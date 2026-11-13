import { test } from 'node:test';
import assert from 'node:assert/strict';

// Test the agent without calling Gemini or requiring a database.
process.env.AI_MODE = 'mock';
delete process.env.DATABASE_URL;

const { runAgent } = await import('../server/agent/agent.js');
const { routeWithRules } = await import('../server/agent/router.js');
const { loadSkills } = await import('../server/agent/skills.js');

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
