import { test } from 'node:test';
import assert from 'node:assert/strict';
import { environmentalIssues } from '../shared/environmental-issues.js';

// Test the agent without calling Gemini or requiring a database.
process.env.AI_MODE = 'mock';
delete process.env.DATABASE_URL;

const { runAgent } = await import('../server/agent/agent.js');
const { routeWithRules } = await import('../server/agent/router.js');
const { loadSkills } = await import('../server/agent/skills.js');
const { completeBrief, completeFollowUp } = await import('../skills/impact-to-action-brief/tool.js');

test('keyword routing selects appropriate skills', async () => {
  const skills = await loadSkills();

  assert.equal(
    routeWithRules('Translate this into Spanish', skills).skill,
    'translator'
  );

  assert.equal(
    routeWithRules('What does this technical term mean?', skills).skill,
    'plain-language-explainer'
  );

  assert.equal(
    routeWithRules('What should I do next?', skills).skill,
    'action-plan-builder'
  );

  assert.equal(
    routeWithRules('How does data center water use affect residents?', skills).skill,
    'impact-to-action-brief'
  );
});

test('environmental research uses the impact-to-action skill', async () => {
  const out = await runAgent({
    message: 'What are the environmental impacts of data center noise?'
  });

  assert.equal(out.skill, 'impact-to-action-brief');
  assert.equal(out.mode, 'mock');
  assert.deepEqual(out.sources.map(({ id }) => id), ['W1', 'W2', 'N1', 'N2', 'A1', 'A2']);
});

test('impact briefs link the curated sources used in the response', async () => {
  const { sources } = await runAgent({ message: 'What is known about data center noise?' });
  const draft = '### 1. Issue overview\nFindings [N1] and [N2].\n\n**7. Sources**\nhttps://example.org/unverified';
  const brief = completeBrief(draft, sources);
  assert.deepEqual(brief.sources.map(({ id }) => id), ['N1', 'N2']);
  assert.match(brief.reply, /### 7\. Sources/);
  assert.match(brief.reply, /\[N1\]: https:\/\/www\.loudoun\.gov\//);
  assert.doesNotMatch(brief.reply, /example\.org/);
});

test('issue context keeps plain-language follow-ups with the evidence skill', async () => {
  const water = environmentalIssues.find(({ id }) => id === 'water');
  const history = [{ role: 'user', text: water.question }];
  for (const context of [{ issue: water.id, history: [] }, { history }]) {
    const out = await runAgent({ message: 'Can you explain the first option in simpler words?', ...context });
    assert.equal(out.skill, 'impact-to-action-brief');
    assert.equal(out.routedBy, 'issue-context');
    assert.ok(out.sources.some(({ id }) => id === 'W1'));
  }
  const translation = await runAgent({ message: 'Translate this into Spanish', history });
  assert.equal(translation.skill, 'translator');
});

test('the default issue brief supplies reviewed mitigations and links grouped citations', async () => {
  const { sources } = await runAgent({ message: 'What is known about data center noise?' });
  const draft = [
    '### 1. Issue overview\nCooling equipment can produce noise [N1].',
    '### 2. What the evidence shows\n**Documented:** The county has noise standards [N1, N2].',
    '### 3. Potential mitigation measures and trade-offs\nUnsupported trade-off.',
    '### 4. Relevant decision-makers\nZoning Enforcement investigates complaints [N1].',
    '### 5. Accountability questions\nWhich rules apply here?',
    '### 6. Information gaps and measurements needed\nAsk for the site’s noise study.',
    '[N1]: https://example.org/unverified',
  ].join('\n\n');
  const brief = completeBrief(draft, sources, { briefIssue: 'noise' });
  assert.deepEqual(brief.sources.map(({ id }) => id), ['N1', 'N2', 'A1']);
  assert.match(brief.reply, /noise standards \[N1\] \[N2\]/);
  assert.match(brief.reply, /Soundproof mechanical equipment/);
  assert.match(brief.reply, /Limit scheduled generator testing hours/);
  assert.doesNotMatch(brief.reply, /Unsupported trade-off|example\.org/);
  assert.match(brief.reply, /### 7\. Sources/);
  const incomplete = completeBrief('### 1. Issue overview\nNoise [N1].', sources, { briefIssue: 'noise' });
  assert.match(incomplete.reply, /couldn’t generate a complete cited answer/);
  assert.doesNotMatch(incomplete.reply, /### 7\. Sources/);
});

test('follow-ups keep clickable sources and use a fallback for uncited answers', async () => {
  const { sources } = await runAgent({ message: 'What is known about data center water use?' });
  const answer = completeFollowUp({
    insufficientEvidence: false,
    statements: [
      { text: 'Reclaimed water can reduce drinking water demand.', sourceIds: ['W1'] },
      { text: 'Evaporation can reduce how much water flows back to the river.', sourceIds: ['W2'] },
    ],
  }, sources);
  assert.match(answer.reply, /### Sources/);
  assert.match(answer.reply, /drinking water demand\. \[W1\]/);
  assert.match(answer.reply, /back to the river\. \[W2\]/);
  assert.deepEqual(answer.sources.map(({ id }) => id), ['W1', 'W2']);
  const unknown = completeFollowUp({ insufficientEvidence: true, statements: [] }, sources);
  assert.match(unknown.reply, /sources don’t establish the specific detail/);
  const unsupported = completeFollowUp({
    insufficientEvidence: false,
    statements: [{ text: 'The data center used 90 gallons.', sourceIds: [] }],
  }, sources);
  assert.match(unsupported.reply, /couldn’t generate a complete cited answer/);
  assert.doesNotMatch(unsupported.reply, /90 gallons/);
  assert.ok(unsupported.sources.some(({ id }) => id === 'W1'));
});

test('a chosen skill wins over the router', async () => {
  const out = await runAgent({
    message: 'What are the impacts of water use?',
    skill: 'translator'
  });

  assert.equal(out.skill, 'translator');
  assert.equal(out.routedBy, 'visitor');
});

test('crisis messages skip the AI and show emergency numbers', async () => {
  const out = await runAgent({ message: 'I want to end my life' });

  assert.equal(out.skill, 'safety-guardrail');
  assert.match(out.reply, /988/);
});

test('unmatched questions default to environmental research', async () => {
  const out = await runAgent({
    message: 'Tell me about this application.'
  });

  assert.equal(out.skill, 'impact-to-action-brief');
});

test('auto mode routes environmental research scenarios', async () => {
  const skills = await loadSkills();

  const cases = {
    'How much water do data centers use?': 'impact-to-action-brief',
    'What noise impacts affect nearby residents?': 'impact-to-action-brief',
    'How can air quality impacts be reduced?': 'impact-to-action-brief',
    'What mitigation options are available?': 'impact-to-action-brief',
    'Translate this into Spanish': 'translator',
    'Explain this technical term': 'plain-language-explainer',
    'What should I do next?': 'action-plan-builder',
  };

  for (const [message, expectedSkill] of Object.entries(cases)) {
    assert.equal(
      routeWithRules(message, skills).skill,
      expectedSkill,
      message
    );
  }
});
