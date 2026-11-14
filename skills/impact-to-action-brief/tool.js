import { loudounSources, mitigationOptions } from '../../shared/loudoun-sources.js';

export function run({ issue, briefIssue } = {}) {
  const notes = loudounSources.map(({ id, name, description }) => `[${id}] ${name}: ${description}`);
  const context = [`Curated evidence for Loudoun County data center briefs:\n${notes.join('\n')}`];
  if (issue) context.push(`Selected issue: ${issue.title}. Use this to interpret follow-ups and follow any new focus in the visitor's question.`);
  if (briefIssue) {
    context.push(`Use the six numbered overview headings. For section 3, use only these reviewed mitigation options and preserve their order:\n${mitigationList(briefIssue)}`);
  }
  return {
    context: context.join('\n\n'),
    data: loudounSources,
  };
}

export function completeBrief(reply, sources, { followUp = false, briefIssue } = {}) {
  const sourcesHeading = /^(?:#{1,6}[ \t]+)?(?:\*{1,2})?(?:7[.)][ \t]+)?(?:\*{1,2})?Sources(?:\*{1,2})?:?[ \t]*$/im;
  const draft = reply.split(sourcesHeading, 1)[0].trimEnd()
    .replace(/^ {0,3}\[[A-Z]+\d+\]:[^\r\n]*$/gim, '')
    .replace(/\[([A-Z]+\d+(?:,\s*[A-Z]+\d+)+)\](?![\[(])/g, (_citation, ids) =>
      ids.split(',').map((id) => `[${id.trim()}]`).join(' ')
    );
  const cited = sources.filter(({ id }) => draft.includes(`[${id}]`));
  const body = briefIssue && cited.length ? formatIssueBrief(draft, briefIssue) : draft;
  const used = body ? sources.filter(({ id }) => body.includes(`[${id}]`)) : [];
  const references = used.length ? used : sources;
  const answer = used.length ? body : 'I couldn’t generate a complete cited answer. You can check the source notes or try your question again.';
  const links = references.map(({ id, name, url }) => `- [${id} · ${name}](${url})`);
  const citationLinks = used.map(({ id, url }) => `[${id}]: ${url}`);
  return {
    reply: [
      answer,
      !followUp && /^### 1\./m.test(answer) ? '### 7. Sources' : '### Sources',
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
