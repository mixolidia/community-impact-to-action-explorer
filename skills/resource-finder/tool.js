import { searchResourcesForAgent } from '../../server/db/resources.js';

// Look up directory entries before the AI writes anything.
export async function run({ message }) {
  const matches = await searchResourcesForAgent(message, 5);
  if (!matches.length) {
    return { context: 'Database results: none found.', data: [] };
  }
  const lines = matches.map(
    (r) => [
      `- ${r.name} (${r.category}, ${r.neighborhood}): ${r.description}`,
      r.website && `Website: ${r.website}`,
      r.hours && `Hours: ${r.hours}`,
      r.phone && `Phone: ${r.phone}`,
      r.languages && `Languages: ${r.languages}`,
    ].filter(Boolean).join(' '),
  );
  return { context: `Database results:\n${lines.join('\n')}`, data: matches };
}
