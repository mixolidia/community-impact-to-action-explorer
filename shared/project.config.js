// =============================================================
// YOUR TEAM AND PROJECT: fill this in first!
// The web page AND the AI agent both read this file, so the app
// introduces your team and the agent knows what problem it serves.
// Anything still starting with "TODO" shows up highlighted on the page.
// =============================================================

export const project = {
  teamName: 'Insight to Impact (i2i)',
  appName: 'Community Insight to Impact Explorer',
  tagline: 'Understand data center impacts. Explore overlooked solutions. Create community change.',

  // One or two sentences. Who is hurting, and how?
  problemStatement:
    'AI infrastructure creates environmental and community impacts that can be difficult to identify, evaluate, and address. This application helps people research ways to reduce data center impacts, assess potential mitigation measures and their trade-offs, and develop accountability questions using source-supported information.',

  // One specific person. Give them a name, an age, and a situation.
  targetUser: 'Alex, 18+, a Community resident curious about local environmental issues.',

  community: 'Loudoun County, VA',
  theme: 'Climate Action / Environmental Accountability',

  // How you will know it works. Make it measurable.
  successMeasure: 'A user can select water use, noise, or air quality and receive a source-supported brief explaining what is known, potential mitigation measures and trade-offs, relevant decision-makers, and questions or measurements needed to evaluate effectiveness.',

  teamMembers: [
    { name: 'members team', role: 'Product owner (writes tickets)' },
    { name: 'members team', role: 'Front end (React)' },
    { name: 'members team', role: 'Back end (API + database)' },
    { name: 'members team', role: 'AI agent and skills' },
  ],

  // The personality of your AI agent. Used in its system prompt.
  agent: {
    name: 'Impact Explorer',
    voice: 'clear, warm, encouraging, evidence-focused, accessible, and plain-spoken, like a helpful neighbor',
    readingLevel: '6th grade',
  },
};

// True if a value still needs to be filled in.
export const isTodo = (value) => typeof value === 'string' && value.trim().startsWith('TODO');
