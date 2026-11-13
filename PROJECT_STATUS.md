# Project Status: Community Insight to Impact Explorer

**Last updated:** November 13, 2026  
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

### Frontend

- Replaced the starter resource board with an environmental issue selector.
- Added four choices: water, noise, air quality, and all three.
- Connected issue selection to suggested research questions.
- Questions appear in the chat input and remain editable.
- Selecting an issue does not automatically submit a question.
- Visitors must click Send to request an AI response.
- Tested the issue selector and live AI responses in the browser.

### Testing

- `npm test` previously passed all 15 tests after environmental routing updates.
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

### Priority 2: Improve response presentation

The chat currently displays Markdown formatting imperfectly.

Observed issues:

- Markdown headings and numbered sections are not consistently rendered.
- Bullet points and emphasis may display as literal formatting characters.
- Source hyperlinks are not presented cleanly.
- Long responses may be truncated.

Possible improvements:

- Add a safe Markdown renderer for AI responses.
- Make source links clickable and readable.
- Improve spacing and readability of structured briefs.
- Review model output-token limits and response-length instructions.
- Test full responses for all four issue categories.

### Priority 3: Finish project-specific interface cleanup

Some starter application components and content may still be visible.

Review:

- `ProjectHeader.jsx`
- `StartHere.jsx`
- `SkillsPanel.jsx`
- Remaining starter language and resource references
- Mobile layout and accessibility

Remove or adapt unrelated starter content.

### Priority 4: Deployment and final presentation

- Choose a hosting platform.
- Configure environment variables securely on the hosting platform.
- Deploy the application.
- Verify the public URL works.
- Test live Gemini responses in the deployed application.
- Prepare a short, reliable presentation demonstration.
- Document known limitations honestly.

### Additional technical work

- Review reported npm dependency vulnerabilities, including Zod-related advisories.
- Do not run `npm audit fix --force` without reviewing breaking changes.
- Decide whether persistent storage is necessary. It is not required for the current issue-selector-to-AI-brief workflow.
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

The production build still needs verification.

## 6. Git history

Most recent commits as of November 13, 2026:

| Commit | Description |
|---|---|
| `3dc5542` | Improve agent response openings and brief structure |
| `d847063` | Connect environmental issue selector to editable chat questions |
| `c78459e` | Replace community resource board with environmental issue selector |
| `6ae1d4f` | Add environmental issue questions and selection handler |
| `41f457e` | Update agent tests for environmental impact research |
| `3e90562` | Update skill routing for environmental impact research |
| `5e81f29` | Configure I2I project identity and goals |
| `b49cf3b` | Add impact-to-action brief skill |

At the time this document was prepared, the six newest commits were local and had not yet been pushed to GitHub.

The working tree was clean before creating this document.

## 7. Recommended next development session

**Immediate objective:** Move from a working local prototype toward a credible, publicly accessible MVP for the November 14 presentation.

Suggested sequence:

1. Confirm repository status and run `npm test` and `npm run build`.
2. Improve Markdown rendering and response readability.
3. Integrate a small, verified set of direct sources for the three issue categories.
4. Test evidence-grounded answers and explicitly handle missing evidence.
5. Remove or revise remaining starter content.
6. Deploy the application and verify it publicly.
7. Rehearse the final demonstration.

Given the deadline, prioritize a working deployed application and an accurate demonstration over additional features.

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