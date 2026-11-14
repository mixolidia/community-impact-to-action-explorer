# Community Insight to Impact Explorer

A CodeSquad AI Community Sprint project about data center impacts in Loudoun County, Virginia. It uses React, Vite, and CSS on the front end, Node.js and Express for the API, and Google Gemini through LangChain.

The [public demo](https://community-impact-to-action-explorer.onrender.com/) runs on Render with Gemini and a directory seeded from verified public sources. The source notes and environmental briefs use `shared/loudoun-sources.js`. PostgreSQL is optional for directory persistence. Local development also supports mock AI.

Choose Water use, Noise, or Air quality, then send the prepared question. Open the source links to inspect the evidence and ask follow-up questions. Choose **Print / Save PDF** in the chat header after a brief is ready to print it or save it with its sources. The source notes are available even when Gemini is unavailable. The public chat shares a limit of 12 requests per minute to conserve the demo's Gemini quota.

Hero photo: [Aerial view of a Purcellville, Virginia residential area](https://www.travelandleisure.com/guide-to-loudoun-county-virginia-11766291), Gerville/Getty Images. Used with permission.

---

## Our team (fill this in)

| | |
|---|---|
| **Team name** | Insight to Impact (i2i) |
| **App name** | Community Insight to Impact Explorer |
| **Problem statement** | People researching the environmental and community impacts of data centers struggle to find reliable, accessible information about documented impacts, potential mitigation measures, and who is responsible for addressing them. |
| **Target user** | People living near data centers and anyone researching ways to reduce their environmental and community impacts. |
| **Community** | Loudoun County, Virginia, Data Center Alley |
| **Theme** | 	Climate Action / Environmental Accountability|
| **How we'll know it works** | A user can select water use, noise, or air quality and receive an understandable AI-generated impact-to-action brief with evidence labels, at least two mitigation options and their trade-offs, relevant decision-makers, accountability questions, information gaps, and source links.|

| Name | Role |
|---|---|
| Mixolidia Gautreaux | Product owner (writes tickets) |
| Mixolidia Gautreaux | Front end (React) |
| Mixolidia Gautreaux | Back end (API + database) |
| Mixolidia Gautreaux | AI agent and skills |

> Put the same info in `shared/project.config.js`. The web page and the AI agent both read it.

---

## What's inside (the restaurant map)

| Restaurant | Folder | Tech | Job |
|---|---|---|---|
| Dining room | `src/`, `index.html` | React + CSS | What visitors see and click |
| Waiter | `src/api.js`, `server/routes/api.js` | fetch + Express | Carries orders in, answers out |
| Order check | `server/validation.js` | zod | Rejects bad orders before cooking |
| Kitchen | `server/agent/` | LangChain | The agent loop: guard, route, tool, think, check |
| Chef playbooks | `skills/` | SKILL.md | Step-by-step know-how for each kind of request |
| Outside supplier | `server/ai/model.js` | Gemini | The AI model |
| Pantry and logbook | `server/db/` | PostgreSQL | Resources and logs that survive restarts |
| The menu | `SPEC.md`, `tickets/` | Gherkin | What we promise to build |

---

## Upload this project to GitHub

1. Create a new, empty repository on GitHub. Do not initialize it with a README, license, or `.gitignore`; this project already has those files and Git history.
2. From this project folder, run `git remote -v` to check the destination. If there is no `origin`, add the URL for your repository:

  ```bash
  git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
  ```

3. Commit any changes you want to upload, then push the `main` branch:

    ```bash
    git add .
    git commit -m "Describe your project changes"
    git push -u origin main
    ```

  If Git says there is nothing to commit, skip the commit command and push. Check that `origin` points to the repository you intend to publish before pushing. Never commit API keys, `.env` files, or other secrets.

## Optional development on Replit

### 1. Get the code into Replit
- **From GitHub:** in Replit, choose **Create App > Import from GitHub** and paste your team's repo URL.
- **From a zip:** create a new Node.js app in Replit and drag these files in.

### 2. Add your Gemini API key (this is where the key goes)
1. Go to <https://aistudio.google.com/apikey>, sign in, and click **Create API key**. Copy it.
2. In Replit, open **Tools > Secrets** (or search "Secrets").
3. Add a secret. Name it exactly `GEMINI_API_KEY`, and paste your key as the value.
4. Optional: add `GEMINI_MODEL` if you want a different model than `gemini-3.1-flash-lite`.

> Never paste your key into code or commit it. Replit Secrets keep it private, and
> `server/config.js` reads it on the server only. It is never sent to the browser.

### 3. Create the database (already configured, just switch it on)
1. In Replit, open **Tools > Database** and create a **PostgreSQL** database.
2. Replit automatically adds a `DATABASE_URL` secret. That's all the setup there is.
3. When the server starts, it creates the tables in `server/db/schema.sql` and seeds an empty directory with Loudoun County research references.

The brief workflow runs without PostgreSQL. Changes to the in-memory directory disappear on restart.

### 4. Run it
Click **Run**. The first run installs packages (about a minute). Then open the preview.

Check the AI status at the top of the page:

| Pill | Means |
|---|---|
| **AI: Gemini live** | Gemini is configured. Submit a brief to verify the connection. |
| **AI: Mock mode** | No key found. Check the Secret name, then restart. |

### 5. Make it yours
1. Fill in **Our team** above and `shared/project.config.js`.
2. Fill in `SPEC.md` with your team.
3. Read [`docs/SPEC-DRIVEN-DEVELOPMENT.md`](docs/SPEC-DRIVEN-DEVELOPMENT.md) and write your first ticket in `tickets/`.

## Run it on your own computer (optional)

```bash
npm install
cp .env.example .env    # then paste your GEMINI_API_KEY (and DATABASE_URL if you have Postgres)
npm run dev             # http://localhost:3000
npm test                # no key or database needed
```

You need Node.js 20 or newer.

---

## Agent skills

A **skill** is a playbook the agent follows for one kind of request. Each one is a folder in
`skills/` with a `SKILL.md` (instructions) and sometimes a `tool.js` (real code). The format is the
open [Agent Skills](https://agentskills.io/specification) standard, so Replit Agent can read them too.

| Skill | What it does | Code? |
|---|---|---|
| `safety-guardrail` | Runs first on EVERY message. Removes phone numbers, emails, and ID numbers. Flags crisis, medical, and legal topics. Crisis messages get emergency numbers instead of AI. | Yes, `tool.js` |
| `intent-router` | When the skill picker is on **Auto**, reads the message and picks the best skill. Uses LangChain **structured output** checked by **zod**, with keyword rules as a backup. | Uses zod |
| `resource-finder` | Searches the Postgres `resources` table and answers ONLY from what it finds. No made-up places or phone numbers. | Yes, `tool.js` |
| `impact-to-action-brief` | Uses curated Loudoun County evidence to draft a brief on water use, noise, air quality, or all three. | Yes, `tool.js` |
| `plain-language-explainer` | Rewrites confusing letters, forms, and notices at a 6th-grade reading level. | |
| `translator` | Translates while keeping names, numbers, and dates exactly the same. | |
| `action-plan-builder` | Turns "what should I do?" into 3 to 5 numbered steps and what to bring. | |

### How one message flows (read `server/agent/agent.js`)

```
visitor types a message
  1. GUARD   safety-guardrail removes personal info, flags risky topics
  2. ROUTE   the visitor picked a skill, or intent-router picks one
  3. TOOL    if the skill has tool.js, run it (resource-finder searches Postgres)
  4. THINK   system prompt = base rules + the skill's SKILL.md (+ database results) -> Gemini
  5. CHECK   add safety notes, log which skill answered (never the message itself)
answer goes back to React
```

### Add your own skill
1. Copy a folder: `cp -r skills/translator skills/my-new-skill`
2. In `SKILL.md`, set `name: my-new-skill` (must match the folder) and write a `description`
   that says what it does **and when to use it**. The router reads that description.
3. Write the steps and rules.
4. Optional: add `tool.js` that exports `run({ message })` and returns `{ context, data }`.
5. Optional: add a keyword rule for it in `server/agent/router.js`.
6. Restart, then run `npm test`. It appears in the Agent skills panel and the skill picker.

---

## The database

### What community resources are for
The resource directory starts with six public research references. The `resource-finder` skill searches the directory. Environmental briefs read the curated notes directly from `shared/loudoun-sources.js` and link to the original publications.

Each listing needs a **name**, one supported **category**, and a clear **description**. The resources API also accepts **neighborhood**, **hours**, **phone**, **website**, **address**, and **languages**. Categories are `Food`, `Health`, `Housing`, `Youth`, `Education`, `Jobs`, `Seniors`, `Legal Aid`, and `Environment`.

Seed data is inserted only when the resources table is empty. Add only information intended for public use.

| Table | What's in it |
|---|---|
| `resources` | Community programs: name, category, description, neighborhood, hours, phone, website, languages |
| `chat_logs` | Which skill answered and when. **Never** what the person typed (privacy by design). |

- **See your data:** Replit **Tools > Database** lets you browse tables and run SQL.
- **Add a table:** add a `CREATE TABLE IF NOT EXISTS ...` to `server/db/schema.sql`, then restart
  (or run `npm run db:setup`). There's a commented example at the bottom of that file.
- **Write queries** in `server/db/resources.js` (or a new file next to it). Always use
  `$1, $2` placeholders, never string glue. That's what stops SQL injection.
- **Maintain the evidence notes** and original publication links in `shared/loudoun-sources.js`.

## API routes

| Method | Route | Does |
|---|---|---|
| GET | `/api/health` | AI mode, model, and database status |
| GET | `/api/skills` | The loaded skills |
| POST | `/api/chat` | `{ message, skill?, history? }` -> the agent's answer |
| GET | `/api/resources?search=&category=` | Search resources |
| POST | `/api/resources` | Add a resource (checked by zod) |

---

## Spec-driven development (how we work)

We **write what "done" means before we code**, using Gherkin scenarios:

```gherkin
Scenario: Find homework help
  Given the resources table has the sample data
  When I ask "Where can my kids get homework help?"
  Then the answer mentions "Bright Futures After School"
  And the label under the answer says "skill: resource-finder"
```

1. Fill in `SPEC.md` (once).
2. Copy `tickets/TEMPLATE.md` for each feature. Write the user story and scenarios.
3. Build it yourself, or hand the ticket to Replit Agent (prompt in the guide, section 6).
4. Walk through every scenario. Add a test for the important ones.
5. Demo it to a teammate. Move it to Done.

Full guide with examples, rules for good scenarios, sizing, and a Definition of Done:
**[`docs/SPEC-DRIVEN-DEVELOPMENT.md`](docs/SPEC-DRIVEN-DEVELOPMENT.md)**.
Finished example tickets are in `tickets/001` to `003`. `tickets/004` is a ticket for you to build.

---

## Git: clone, branch, push

```bash
git clone <your-team-repo-url>
cd community-sprint-starter
git checkout -b your-name/004-save-favorites   # one branch per ticket
git add .
git commit -m "004: save favorites (scenarios 1-2)"
git push -u origin your-name/004-save-favorites
```

Open a pull request, have a teammate check the scenarios, then merge to `main`.

## Project structure

```
.
├── index.html                  React page shell
├── src/                        React app (dining room)
│   ├── App.jsx, api.js, styles.css
│   └── components/             ProjectHeader, ChatPanel, ResourceBoard, SkillsPanel
├── shared/project.config.js    Your team, problem, and agent persona
├── server/
│   ├── index.js                One server: API + React (Vite in dev, dist/ in production)
│   ├── config.js               Reads GEMINI_API_KEY, DATABASE_URL, etc.
│   ├── validation.js           zod schemas
│   ├── routes/api.js           /api routes
│   ├── ai/model.js             LangChain ChatGoogle (Gemini)
│   ├── agent/                  agent.js (the loop), router.js, skills.js
│   └── db/                     pool.js, schema.sql, seed-data.js, resources.js, setup.js
├── skills/                     Agent skills (SKILL.md + optional tool.js)
├── SPEC.md                     Your project spec
├── docs/SPEC-DRIVEN-DEVELOPMENT.md
├── tickets/                    Gherkin tickets (template + examples)
└── tests/                      node:test tests (npm test)
```

## Scripts

| Command | Does |
|---|---|
| `npm run dev` | Start the app with instant reload (what Replit's Run button does) |
| `npm test` | Run the tests (no key or database needed) |
| `npm run db:setup` | Create tables and seed an empty directory |
| `npm run build` then `npm start` | Production build (used when you Publish on Replit) |

## Deployment

Render can run this repository as a Node web service. Build with `npm ci --include=dev && npm run build` and start with `npm start`. Store `GEMINI_API_KEY` in the service's environment and use `/api/health` for the health check. Replit publishing uses the `[deployment]` settings in `.replit`.

## Troubleshooting

| Problem | Fix |
|---|---|
| Pill says **Mock mode** | The Secret must be named exactly `GEMINI_API_KEY`. Stop and Run again. |
| "Gemini rejected the key or model" | Copy the key again. Or set `GEMINI_MODEL` to a model listed in AI Studio. |
| "Too many requests" | Free keys have a rate limit. Wait a minute. |
| `relation "resources" does not exist` | Run `npm run db:setup`. |
| `Cannot find package` | Run `npm install`. |
| Port already in use (local) | Stop the other server, or set `PORT=3001` in `.env`. |
| A skill doesn't show up | Run `npm test`. The skill checker explains what's wrong in `SKILL.md`. |

## Safety rules
- Keys go in Secrets or `.env`, never in code. `.env` is in `.gitignore`.
- Free-tier Gemini usage may be used by Google to improve its products. Don't send personal info.
- Answers come from AI and can be wrong. The app says so, and so should you.
