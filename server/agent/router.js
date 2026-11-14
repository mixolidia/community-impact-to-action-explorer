import { z } from 'zod';
import { SystemMessage, HumanMessage } from '@langchain/core/messages';
import { publicSkills } from './skills.js';

// The router asks the AI to pick a skill, and zod forces the answer into a known shape.

export function makeRouteSchema(skillNames) {
  return z.object({
    skill: z.enum(skillNames).describe('the one skill that should answer'),
    reason: z.string().describe('one short sentence explaining the choice'),
  });
}

export async function routeWithAi({ message, previousTopic, skills, model }) {
  const choices = publicSkills(skills);
  const schema = makeRouteSchema(choices.map((s) => s.name));
  const routerSkill = skills.get('intent-router');
  const menu = choices.map((s) => `- ${s.name}: ${s.description}`).join('\n');

  const result = await model.withStructuredOutput(schema).invoke([
    new SystemMessage(`${routerSkill.body}\n\n## Skills you can choose\n${menu}`),
    new HumanMessage(previousTopic ? JSON.stringify({ previousTopic, message }) : message),
  ]);
  return schema.parse(result); // double-check the shape before we trust it
}

// No AI needed: keyword rules used in mock mode or if AI routing fails.
const TRANSLATION_REQUEST = /\b(translate|translation|in spanish|in english|en español|in polish|in arabic|in chinese)\b/i;

const RULES = [
  {
    skill: 'impact-to-action-brief',
    pattern: /\b(data centers?|environmental|water|noise|air quality|pollution|emissions?|cooling|electricity|energy|mitigation|stakeholders?|accountability|community impacts?|loudoun)\b/i,
  },
  {
    skill: 'translator',
    pattern: TRANSLATION_REQUEST,
  },
  {
    skill: 'plain-language-explainer',
    pattern: /\b(what does .* mean|explain|simplify|plain language|confus\w*|don't understand)\b/i,
  },
  {
    skill: 'action-plan-builder',
    pattern: /\b(what should i do|where do i start|next steps?|plan|how do i|steps)\b/i,
  },
];

export function routeWithRules(message, skills, { continueResearch = false } = {}) {
  if (continueResearch) {
    if (TRANSLATION_REQUEST.test(message) && skills.has('translator')) {
      return { skill: 'translator', reason: 'The visitor requested a translation.' };
    }
    return { skill: 'impact-to-action-brief', reason: 'The visitor is continuing environmental research.' };
  }

  for (const rule of RULES) {
    if (rule.pattern.test(message) && skills.has(rule.skill)) {
      return { skill: rule.skill, reason: 'Matched a keyword rule.' };
    }
  }

  return {
    skill: 'impact-to-action-brief',
    reason: 'Default skill for environmental impact research.',
  };
}
