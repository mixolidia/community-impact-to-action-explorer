import { SystemMessage, HumanMessage, AIMessage } from '@langchain/core/messages';
import { aiMode } from '../config.js';
import { environmentalIssues } from '../../shared/environmental-issues.js';
import { project } from '../../shared/project.config.js';
import { logChat } from '../db/resources.js';
import { getModel } from '../ai/model.js';
import { loadSkills } from './skills.js';
import { routeWithAi, routeWithRules } from './router.js';

// =============================================================
// THE AGENT LOOP: five steps for every message
//   1. GUARD  - safety-guardrail removes personal info, flags risky topics
//   2. ROUTE  - the visitor picks a skill, or intent-router picks one
//   3. TOOL   - if the skill has tool.js (like resource-finder), run it
//   4. THINK  - system prompt = base rules + the skill's SKILL.md, then Gemini answers
//   5. CHECK  - add safety notes, log which skill answered (never the message)
// =============================================================

export function baseSystemPrompt() {
  const a = project.agent;
  return [
    `You are ${a.name}, an AI assistant for "${project.appName}" in ${project.community}.`,
    `The problem this app helps with: ${project.problemStatement}`,
    `You mainly help: ${project.targetUser}`,
    `Voice: ${a.voice}. Write at a ${a.readingLevel} reading level.`,
    '',
    'Always:',
    '- Begin responses directly with the relevant information. Do not start with a greeting or introduce yourself.',
    '- Treat conversation history as an ongoing discussion. Do not restart the conversation or repeat introductory statements with each answer.',
    '- Say you are an AI if asked. Never pretend to be a doctor, lawyer, or counselor.',
    '- Never ask for personal information (full name, address, phone, birthday, ID numbers).',
    '- If you do not know, say so. Never invent places, phone numbers, or facts.',
    '- Follow the active skill’s format. Keep other answers concise unless the visitor requests more.',
  ].join('\n');
}

export async function runAgent({ message, skill: chosen, issue, previousSkill, history = [] }) {
  const skills = await loadSkills();
  const mode = aiMode();

  // 1. GUARD
  const guardrail = skills.get('safety-guardrail').tool;
  const guard = guardrail.run({ message });
  if (guard.flags.includes('crisis')) {
    await safeLog({ skill: 'safety-guardrail', routedBy: 'guardrail', flags: guard.flags });
    return { reply: guardrail.CRISIS_REPLY, skill: 'safety-guardrail', routedBy: 'guardrail', flags: guard.flags, mode, sources: [] };
  }
  const cleanMessage = guard.redacted;
  const issuePrompt = environmentalIssues.find(({ question }) => question === cleanMessage);
  const previousIssueIndex = history.findLastIndex(({ role, text }) =>
    role === 'user' && environmentalIssues.some(({ question }) => question === text),
  );
  const activeIssue = issuePrompt ?? environmentalIssues.find(({ id, question }) =>
    issue ? id === issue : question === history[previousIssueIndex]?.text,
  );
  const conversation = issuePrompt ? [] : history.slice(Math.max(0, previousIssueIndex));
  const followUp = conversation.length > 0;

  // 2. ROUTE
  let route;
  if (chosen && chosen !== 'auto' && skills.has(chosen)) {
    route = { skill: chosen, reason: 'Chosen by the visitor.', routedBy: 'visitor' };
  } else if (activeIssue || (followUp && previousSkill === 'impact-to-action-brief')) {
    route = { ...routeWithRules(cleanMessage, skills, { continueResearch: true }), routedBy: 'issue-context' };
  } else if (mode === 'live') {
    try {
      const previousQuestion = conversation.findLast(({ role }) => role === 'user');
      const previousTopic = previousQuestion ? guardrail.run({ message: previousQuestion.text }).redacted : '';
      route = { ...(await routeWithAi({ message: cleanMessage, previousTopic, skills, model: await getModel() })), routedBy: 'intent-router' };
    } catch {
      route = { ...routeWithRules(cleanMessage, skills), routedBy: 'keyword-rules' };
    }
  } else {
    route = { ...routeWithRules(cleanMessage, skills), routedBy: 'keyword-rules' };
  }
  const skill = skills.get(route.skill);

  // 3. TOOL
  let toolResult = null;
  if (skill.tool?.run) {
    toolResult = await skill.tool.run({ message: cleanMessage, issue: activeIssue, briefIssue: issuePrompt?.id, followUp });
  }
  let sources = (toolResult?.data ?? []).map(({ id, name, url }) => (url ? { id, name, url } : { id, name }));

  // 4. THINK
  let reply;
  if (mode === 'mock') {
    reply = mockReply(skill.name, toolResult);
  } else {
    const system = [baseSystemPrompt(), `\n# Skill: ${skill.name}\n${skill.body}`, toolResult ? `\n${toolResult.context}` : '']
      .join('\n')
      .trim();
    const model = await getModel();
    const cleanHistory = conversation.map(({ role, text }) => {
      const { redacted } = guardrail.run({ message: text });
      return role === 'assistant' ? new AIMessage(redacted) : new HumanMessage(redacted);
    });
    const messages = [new SystemMessage(system), ...cleanHistory, new HumanMessage(cleanMessage)];
    if (skill.name === 'impact-to-action-brief' && followUp) {
      const { parsed } = await model.withStructuredOutput(skill.tool.followUpSchema, {
        method: 'jsonSchema',
        includeRaw: true,
      }).invoke(messages);
      ({ reply, sources } = skill.tool.completeFollowUp(parsed, sources));
    } else {
      reply = textOf(await model.invoke(messages)).trim();
      if (!reply) throw new Error('Gemini returned an empty reply.');
      if (skill.name === 'impact-to-action-brief') {
        ({ reply, sources } = skill.tool.completeBrief(reply, sources, { briefIssue: issuePrompt?.id }));
      }
    }
  }

  // 5. CHECK
  if (guard.flags.includes('medical')) reply += '\n\nNote: this is general information, not medical advice. Please check with a doctor or nurse.';
  if (guard.flags.includes('legal')) reply += '\n\nNote: this is general information, not legal advice. A legal aid office can help for free.';
  if (guard.flags.includes('pii-removed')) reply += '\n\n(I removed personal information from your message to keep you safe.)';

  await safeLog({ skill: skill.name, routedBy: route.routedBy, flags: guard.flags });
  return {
    reply,
    skill: skill.name,
    routedBy: route.routedBy,
    reason: route.reason,
    flags: guard.flags,
    mode,
    sources,
  };
}

function textOf(response) {
  if (typeof response.content === 'string') return response.content;
  if (Array.isArray(response.content)) return response.content.map((part) => part.text ?? '').join('');
  return String(response.text ?? '');
}

function mockReply(skillName, toolResult) {
  const intro = `[Mock mode: add GEMINI_API_KEY for real answers] The ${skillName} skill would answer this.`;
  if (skillName === 'resource-finder' && toolResult?.data?.length) {
    const top = toolResult.data.slice(0, 2).map((r) => `- ${r.name}: ${[r.description, r.hours, r.phone].filter(Boolean).join(' ')}`);
    return `${intro}\nTop database matches:\n${top.join('\n')}`;
  }
  return intro;
}

async function safeLog(entry) {
  try {
    await logChat(entry);
  } catch (err) {
    console.warn('[agent] could not write chat log:', err.message);
  }
}
