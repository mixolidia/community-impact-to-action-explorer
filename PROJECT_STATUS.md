# Project Status: Community Insight to Impact Explorer

**Last updated:** November 13, 2026, approximately 6:15 PM ET  
**Project:** CodeSquad AI Community Sprint  
**Team:** Insight to Impact (i2i)  
**Developer:** Solo project  
**Final presentation:** Saturday, November 14, 2026  
**Repository:** https://github.com/mixolidia/community-impact-to-action-explorer  
**Branch:** `main`

## 1. Project overview

**App name:** Community Insight to Impact Explorer  
**AI assistant:** Impact Explorer  
**Case study:** Loudoun County, Virginia (Data Center Alley)  
**Theme:** Climate Action / Environmental Accountability

### Problem being addressed

AI infrastructure creates environmental and community impacts that can be difficult to identify, evaluate, and address.

The application helps people research ways to reduce data center impacts, assess potential mitigation measures and their trade-offs, and develop accountability questions using source-supported information.

### MVP objective

A visitor can select an environmental issue and receive an understandable, AI-assisted impact-to-action brief covering:

1. Issue overview
2. What the evidence shows
3. Potential mitigation measures and trade-offs
4. Relevant decision-makers
5. Accountability questions
6. Information gaps and measurements needed
7. Sources

The application should distinguish documented, reported, estimated/projected, and unknown information.

### Supported issue categories

- Water use
- Noise
- Air quality
- All three issues together

### Intended audience

People researching the environmental and community impacts of data centers, including residents, community organizers, environmental groups, and others interested in reducing those impacts.

## 2. Technology and architecture

**Frontend:** React, Vite, CSS  
**Backend:** Node.js, Express  
**AI:** Google Gemini through LangChain  
**Model configured:** `gemini-3.1-flash-lite`  
**Agent architecture:** Guard → Route → Tool → Think → Check  
**Database:** PostgreSQL support exists in the starter, but the application currently runs without a configured database, using in-memory sample data.

The application was developed locally on an Intel MacBook Pro.

### Important files

| File | Purpose |
|---|---|
| `shared/project.config.js` | Project identity, goals, assistant identity, and voice |
| `server/agent/agent.js` | Agent execution and system prompt |
| `server/agent/router.js` | Skill routing |
| `skills/impact-to-action-brief/SKILL.md` | Environmental research brief instructions |
| `src/App.jsx` | Main application and issue question templates |
| `src/components/ResourceBoard.jsx` | Environmental issue selector |
| `src/components/ChatPanel.jsx` | Chat interface and editable questions |
| `src/components/ProjectHeader.jsx` | Project header |
| `src/components/StartHere.jsx` | Introductory section |
| `src/components/SkillsPanel.jsx` | Agent skill display |
| `src/styles.css` | Application styling |
| `tests/agent.test.js` | Agent and routing tests |
| `tests/skills.test.js` | Skill tests |
| `server/config.js` | Server and Gemini configuration |

## 3. Completed functionality

### Project configuration

- Updated the starter application with the I2I project identity.
- Configured the Impact Explorer assistant.
- Set Loudoun County as the case-study location.
- Added project-specific goals and success criteria.

### AI agent

- Created the `impact-to-action-brief` skill.
- Updated routing rules for environmental research.
- Updated tests for environmental impact questions.
- Connected a Google Gemini API key through the local `.env` file.
- Confirmed the application operates in live AI mode.
- Confirmed Gemini generates environmental impact-to-action briefs.
- Updated agent and skill instructions to avoid repetitive greetings and introductions.
- Confirmed responses now begin directly with the issue overview during browser testing.
- Updated impact-to-action skill guidance to request verified named leadership and public contact details when available; this remains incomplete because verified contact records are not supplied to the agent.
- Updated the base agent prompt to request complete seven-section briefs, typically 400–700 words.
- Increased `maxOutputTokens` from 600 to 4096 in `server/config.js`. Browser testing then returned a complete water-use brief with all seven sections, Sources, and a disclaimer. The cutoff appears resolved for that case.

### Frontend

- Replaced the starter resource board with an environmental issue selector.
- Added four choices: water, noise, air quality, and all three.
- Connected issue selection to suggested research questions.
- Questions appear in the chat input and remain editable.
- Selecting an issue does not automatically submit a question.
- Visitors must click Send to request an AI response.
- Tested the issue selector and live AI responses in the browser.
- Installed `react-markdown` and updated `src/components/ChatPanel.jsx` to render assistant Markdown, including lists and clickable links. Browser output was reviewed.

### Testing

- `npm test` passed all 15 tests after the Markdown and agent changes earlier on November 13.
- `npm run build` completed successfully earlier on November 13.
- Tests/build have **not yet been confirmed after the latest output-token configuration change**.
- Browser testing confirmed live Gemini integration and issue selection.
- The most recent greeting changes were tested manually and worked.
- Run the automated test suite again after subsequent changes.

## 4. Current limitations and improvements needed

### Priority 1: Improve reliability and evidence quality

**Verified direct sources are not yet integrated.**

Current AI-generated briefs may include generic agency homepage links rather than direct supporting documents.

Required improvements:

- Curate reliable sources for water use, noise, and air quality in Loudoun County.
- Provide source material directly to the agent.
- Link factual claims to supporting evidence.
- Verify that evidence labels match the actual documentation.
- Distinguish general information from Loudoun County-specific findings.
- Prevent unsupported numerical claims, environmental conclusions, or invented citations.
- Make limitations explicit when sufficient evidence is unavailable.

**Important:** The current application should not be represented as providing fully verified or source-grounded research.

### Priority 2: Finish response presentation and contact details

**Markdown rendering implemented:** `react-markdown` was installed and assistant messages now render Markdown. Confirm the result across all issue categories and screen sizes.

**Response cutoff appears fixed:** `server/config.js` now specifies `maxOutputTokens: 4096` instead of `600`. The next water-use test returned sections 1–7 and the disclaimer. Verify other issue categories before marking this fully regression-tested.

**Named contacts are a deferred improvement:** The `impact-to-action-brief` skill asks for verified leadership names, titles, official email addresses, phone numbers, and direct contact links, but the agent still mostly supplies agency directory links. When asked directly for leadership names, the intent router selects `resource-finder`, whose instructions/data also need improvement. Provide a verified curated contact directory to the relevant skill(s), including `resource-finder`; do not rely on the model to recall current officeholders. Previously discussed contact names and numbers are **unverified leads, not approved application data**.

### Priority 3: Finish project-specific interface cleanup

Some starter application components and content may still be visible.

Review:

- `ProjectHeader.jsx`
- `StartHere.jsx`
- `SkillsPanel.jsx`
- Remaining starter language and resource references
- Mobile layout and accessibility

Remove or adapt unrelated starter content.

### Priority 4: Deployment and final presentation (urgent: November 14)

- Choose a hosting platform compatible with the existing Node/Express server and Vite build; prioritize fastest reliable public deployment.
- Configure environment variables securely on the hosting platform.
- Deploy the application.
- Verify the public URL works.
- Test live Gemini responses in the deployed application.
- Prepare a short, reliable presentation demonstration.
- Document known limitations honestly.

### Additional technical work

- Review reported npm dependency vulnerabilities, including Zod-related advisories.
- Do not run `npm audit fix --force` without reviewing breaking changes.
- Decide whether persistent storage is necessary. It is not required for the current issue-selector-to-AI-brief workflow; do not add PostgreSQL solely to satisfy the starter checklist before deployment.
- Create a first Gherkin ticket under `tickets/` following `docs/SPEC-DRIVEN-DEVELOPMENT.md` when practical.
- Replace sample resources with real, verified sources.
- Update or remove the on-page **Start here** checklist. Its first two steps were reported done; remaining steps are PostgreSQL setup, a Gherkin ticket, and verified resources. The checklist is starter-template guidance, not necessarily mandatory MVP architecture.
- Consider reducing unrelated starter functionality after the core MVP is stable.

## 5. Environment and local development

### Requirements

- Node.js 20 or newer
- npm
- Google Gemini API key

Previously confirmed local versions:

- Node.js `v22.23.5`
- npm `10.9.9`

### Local setup

```bash
npm install
cp .env.example .env
```

Add the Gemini API key to `.env`:

```dotenv
GEMINI_API_KEY=your_api_key_here
```

**Never commit `.env` or share the real API key.**

### Start the development server

```bash
npm run dev
```

Open:

http://localhost:3000

### Run tests

```bash
npm test
```

### Check Git status

```bash
git status
```

### Build the frontend

```bash
npm run build
```

The production build passed earlier on November 13 after the Markdown update; rerun after the latest edits.

## 6. Git status and version-control caution

Previously observed repository commit: `9884358` on `main` with a clean working tree **before** the November 13 changes. Earlier history is recorded in Git.

During November 13, the following files were edited locally: `src/components/ChatPanel.jsx`, `package.json`, lockfile (after `npm install react-markdown`), `skills/impact-to-action-brief/SKILL.md`, `server/agent/agent.js`, and `server/config.js`. **Their commit/push status has not been confirmed.** A `git add server/config.js && git commit ... && git push` command was suggested but no execution output was provided. Check `git status --short --branch` and `git log -1 --oneline` before committing; do not assume changes are pushed.

## 7. Next session: prioritized handoff checklist

**Deadline:** Final CodeSquad presentation is Saturday, November 14, 2026. Work in focused ~30-minute sessions and provide **one step at a time**.

1. **Save and verify current changes:** inspect Git status, run `npm test` and `npm run build`, then commit/push tested changes without including `.env`. Do not assume the previously suggested command ran.
2. **Deploy the existing application:** choose a compatible host, configure `GEMINI_API_KEY` and other required environment variables securely, use the existing production build/start commands, and obtain a public URL. Verify the public app and a live seven-section water-use response. Deployment is the top delivery priority.
3. **Improve evidence quality:** replace in-memory/sample resources with a small set of verified Loudoun County sources for water, noise, and air quality. Supply source content directly to the agent, verify links, and remove unsupported claims. Do not claim the present brief is fully source-grounded.
4. **Finish demo readiness:** remove or revise leftover starter UI (especially **Start here**); test all four issue options and mobile readability; prepare and record a short demonstration with transparent limitations.
5. **Defer until the core works:** curate and verify named leaders, public emails, phone numbers, and direct official contacts for both `impact-to-action-brief` and `resource-finder`; add the Gherkin ticket; assess whether PostgreSQL is actually needed; review dependency vulnerability warnings.

**Latest browser test:** After increasing the output limit, a water-use prompt returned all seven sections, mitigation trade-offs, agency contact links, accountability questions, information gaps, sources, and disclaimer. It still included assertions not directly backed by the linked sources. The cutoff fix is promising but not a substitute for evidence verification.

## 8. Working preferences and collaboration

- Work one terminal step at a time.
- Explain commands when requested.
- Use `vim`, not `nano`.
- Test changes before committing.
- Commit working features in logical units.
- Do not assume commands succeeded without seeing their output.
- Avoid unnecessary changes to functioning code.
- Preserve the project's intended purpose and scope.
- Do not invent sources, research findings, or completed features.
- Maintain this document as the ongoing project handoff and status reference.

## 9. Project boundaries

### In scope

- Loudoun County case study
- Water use, noise, and air quality
- Source-supported environmental impact briefs
- Mitigation measures and trade-offs
- Relevant decision-makers
- Accountability questions
- Information gaps and uncertainty

### Stretch goals

- Side-by-side mitigation comparisons
- Electricity demand as an additional issue
- Printable or downloadable brief
- Second case study
- Map or timeline

### Out of scope for the MVP

- Nationwide facility database
- Real-time facility monitoring
- Automated collection of all government records
- Individual health predictions
- Unsupported causal claims
- Legal, medical, or engineering advice
- Community complaint case-management system

---

**Handoff note:** Continue developing the existing application. Do not restart the project or replace its architecture without a specific reason. Verify the current repository state before making changes.