import { loudounSources } from '../../server/db/loudoun-sources.js';

export function run() {
  const notes = loudounSources.map(({ id, name, description }) => `[${id}] ${name}: ${description}`);
  return {
    context: `Curated evidence for Loudoun County data center briefs:\n${notes.join('\n')}`,
    data: loudounSources,
  };
}

export function completeBrief(reply, sources) {
  const sourcesHeading = /^(?:#{1,6}[ \t]+)?(?:\*{1,2})?(?:7[.)][ \t]+)?(?:\*{1,2})?Sources(?:\*{1,2})?:?[ \t]*$/im;
  const body = reply.split(sourcesHeading, 1)[0].trimEnd();
  const cited = sources.filter(({ id }) => body.includes(`[${id}]`));
  const references = cited.length ? cited : sources;
  const links = references.map(({ id, name, url }) => `- [${id} · ${name}](${url})`);
  const citationLinks = cited.map(({ id, url }) => `[${id}]: ${url}`);
  return {
    reply: [
      body,
      '### 7. Sources',
      cited.length ? '' : 'The brief has no inline citations. Use these references to check its claims.',
      links.join('\n'),
      '*This AI-assisted brief is for research and public discussion. Check claims against the linked sources.*',
      citationLinks.join('\n'),
    ].filter(Boolean).join('\n\n'),
    sources: references,
  };
}
