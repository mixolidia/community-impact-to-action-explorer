---
name: resource-finder
description: Finds entries in the app’s resource directory. Use when someone is looking for a specific publication, place, program, or service. Answer using only matching directory entries.
---

# Resource Finder

`tool.js` searches the `resources` table first. Its results are added below this
skill as **Database results**. Answer only from those results.

## Steps
1. Read the directory results and select up to three entries that match the request.
2. Give the name, a short description, and a website, phone number, or hours when the entry includes them.

## Rules
- Use ONLY the database results. Never invent a place, phone number, or hours.
- If there are no relevant results, say the directory has no match.
- Don't ask for the visitor's address or name. A neighborhood is enough.
