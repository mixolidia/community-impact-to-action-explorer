import { z } from 'zod';
import { loudounSources, mitigationOptions } from '../../shared/loudoun-sources.js';

export const followUpSchema = z.object({
  insufficientEvidence: z.boolean().describe('True if the source notes do not establish the detail the visitor asked for.'),
  statements: z.array(z.object({
    text: z.string().describe('One short, plain-language statement directly supported by the listed source notes. Use plain text without Markdown or source labels.'),
    sourceIds: z.array(z.enum(loudounSources.map(({ id }) => id))).min(1).max(3)
      .describe('The IDs of the notes that support the whole statement.'),
  })).max(4).describe('Answer in short statements. When evidence is insufficient, give only relevant supported context, or leave the list empty.'),
});

const incompleteAnswer = 'I couldn’t generate a complete cited answer. You can check the source notes or try your question again.';

export function run({ issue, briefIssue, followUp } = {}) {
  const notes = loudounSources.map(({ id, name, description }) => `[${id}] ${name}: ${description}`);
  const context = [`Curated evidence for Loudoun County data center briefs:\n${notes.join('\n')}`];
  if (issue) context.push(`Selected issue: ${issue.title}. Use this to interpret follow-ups and follow any new focus in the visitor's question.`);
  if (briefIssue) {
    context.push(`Use the six numbered overview headings. For section 3, use only these reviewed mitigation options and preserve their order:\n${mitigationList(briefIssue)}`);
  } else if (followUp) {
    context.push('Follow the response schema. Answer the current question using the previous discussion to resolve references. Cite the notes that support each statement. Mark insufficient evidence when a measurement or other detail is unavailable.');
  }
  return {
    context: context.join('\n\n'),
    data: loudounSources,
  };
}

export function completeBrief(reply, sources, { briefIssue } = {}) {
  const sourcesHeading = /^(?:#{1,6}[ \t]+)?(?:\*{1,2})?(?:7[.)][ \t]+)?(?:\*{1,2})?Sources(?:\*{1,2})?:?[ \t]*$/im;
  const draft = reply.split(sourcesHeading, 1)[0].trimEnd()
    .replace(/^ {0,3}\[[A-Z]+\d+\]:[^\r\n]*$/gim, '')
    .replace(/\[([A-Z]+\d+(?:,\s*[A-Z]+\d+)+)\](?![\[(])/g, (_citation, ids) =>
      ids.split(',').map((id) => `[${id.trim()}]`).join(' ')
    );
  const cited = sources.filter(({ id }) => draft.includes(`[${id}]`));
  const body = briefIssue && cited.length ? formatIssueBrief(draft, briefIssue) : draft;
  const used = body ? sources.filter(({ id }) => body.includes(`[${id}]`)) : [];
  return withSources(used.length ? body : incompleteAnswer, sources, used, used.length && /^### 1\./m.test(body) ? '### 7. Sources' : '### Sources');
}

export function completeFollowUp(output, sources) {
  const parsed = followUpSchema.safeParse(output);
  if (!parsed.success) return withSources(incompleteAnswer, sources, []);

  const statements = parsed.data.statements.filter(({ text }) => text.trim());
  const used = sources.filter(({ id }) => statements.some(({ sourceIds }) => sourceIds.includes(id)));
  const answer = statements.map(({ text, sourceIds }) => {
    const citations = [...new Set(sourceIds)].map((id) => `[${id}]`).join(' ');
    return `- ${text.trim().replace(/\s+/g, ' ')} ${citations}`;
  });
  if (parsed.data.insufficientEvidence) answer.unshift('The curated sources don’t establish the specific detail you asked for.');
  return withSources(answer.join('\n\n') || incompleteAnswer, sources, used);
}

function withSources(answer, sources, used, heading = '### Sources') {
  const references = used.length ? used : sources;
  const links = references.map(({ id, name, url }) => `- [${id} · ${name}](${url})`);
  const citationLinks = used.map(({ id, url }) => `[${id}]: ${url}`);
  return {
    reply: [
      answer,
      heading,
      links.join('\n'),
      '*This AI-assisted brief is for research and public discussion. Check claims against the linked sources.*',
      citationLinks.join('\n'),
    ].filter(Boolean).join('\n\n'),
    sources: references,
  };
}

function mitigationList(issue) {
  const options = issue === 'all' ? Object.values(mitigationOptions).flat() : mitigationOptions[issue];
  return options.map((option) => `- ${option}`).join('\n');
}

function formatIssueBrief(draft, issue) {
  const headings = [...draft.matchAll(/^###\s+([1-6])\.\s+[^\r\n]+$/gm)];
  if (headings.map(([, number]) => number).join('') !== '123456') return '';
  const sections = headings.map((heading, index) =>
    draft.slice(heading.index + heading[0].length, headings[index + 1]?.index).trim()
  );
  if (sections.some((section, index) => index !== 2 && !section)) return '';
  const mitigation = headings[2];
  const decisionMakers = headings[3];
  return [
    draft.slice(headings[0].index, mitigation.index).trimEnd(),
    '### 3. Potential mitigation measures and trade-offs',
    mitigationList(issue),
    draft.slice(decisionMakers.index),
  ].join('\n\n');
}
