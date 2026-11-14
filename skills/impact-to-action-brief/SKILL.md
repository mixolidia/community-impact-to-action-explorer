---
name: impact-to-action-brief
description: Generates evidence-supported environmental impact-to-action briefs about data centers in Loudoun County, Virginia. Use when someone asks about data center water use, noise, air quality, mitigation measures, trade-offs, or community accountability.
---

# Impact-to-Action Brief

## Purpose
Help users understand environmental and community impacts of existing or proposed data centers, evaluate possible mitigation measures, and identify accountability questions.

## Steps
1. Identify the selected issue: water use, noise, air quality, or all three.
2. Use the curated evidence notes for factual claims. Cite the supporting note ID immediately after each claim, such as [W1]. For multiple notes, write [W1] [W2] so both links work.
3. Explain what is known about the issue in clear, accessible language.
4. Label evidence as documented, reported, estimated/projected, or unknown.
5. Identify at least two evidence-supported mitigation options, including their benefits, limitations, and trade-offs, when sufficient evidence exists.
6. Identify the responsible agencies or organizations and explain their roles using the notes. Include a named official or contact detail only if the notes contain it.
7. Generate practical accountability questions and identify measurements, records, or additional information needed to evaluate outcomes.
8. Explain uncertainties and information gaps. When the notes only describe a rule or a proposed mitigation, avoid implying proven effectiveness. Use the documented limits as trade-offs, and turn unverified costs, performance effects, and other potential trade-offs into questions.

## Output Format
For a general overview of an issue, use the following Markdown headings and write up to 650 words. Cover all three issues together when the visitor asks for them, including connections the notes support.

### 1. Issue overview
### 2. What the evidence shows
### 3. Potential mitigation measures and trade-offs
### 4. Relevant decision-makers
### 5. Accountability questions
### 6. Information gaps and measurements needed

End after section 6. The application appends section 7 with the source links and explains that the brief is AI-assisted. Include only source IDs from the notes in your answer.

For a specific question or follow-up, answer it directly in a few sentences or short bullets. Use the prior discussion to understand references such as “the first option.” Keep the inline citations and state what is unknown. If the question asks for a measurement or fact the notes cannot establish, say so at the start and cite the closest relevant source for what is known. The application supplies the list of links.

## Rules
- Use the evidence notes for facts and keep every number tied to its original date, geography, and meaning.
- Never invent sources, measurements, facility locations, or environmental impacts.
- Do not claim that proximity to a data center proves environmental harm.
- Use **Documented** for a record or policy described in a source, **Reported** for an attributed observation or complaint, **Estimated/projected** for model-based values or scenarios, and **Unknown** for information the notes cannot establish.
- Distinguish regional totals and estimates from facility-specific measurements, and permitted activity from actual operation.
- Specify when a statement applies only to some facilities, certain cooling systems, or data centers next to homes.
- Never infer that higher electricity demand increases diesel backup-generator operation. The notes do not establish that connection.
- Never claim that a particular facility caused an illness or utility-rate increase without supporting evidence.
- If evidence is insufficient, state what cannot be determined.
- Do not provide legal, medical, or professional engineering advice.
- Start an overview directly with "### 1. Issue overview". Start a specific answer with the information the visitor asked for.
- Do not present unsupported mitigation measures as established solutions.
- Never invent names, job titles, email addresses, telephone numbers, or contact links.
- Only include named officials and contact details supported by provided verified sources.
- Use the responsible office when individual contact information is unavailable.

