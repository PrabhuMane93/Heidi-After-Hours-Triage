# Heidi After-Hours Voicemail Triage Prototype

Prototype for Harbour to Sunset GP that converts high-volume after-hours voicemails into structured, actionable work for morning admin and clinical staff.

## What this solves
Morning admin teams should not have to listen to dozens of long recordings before they can start work.

This prototype turns raw voicemail transcripts into triage cards with:
- intent-focused summary
- urgency signal (`EMERGENCY`, `TODAY`, `SOON`, `ROUTINE`, `ADMIN`)
- clear next-step checklist with role ownership
- confidence score for trust and review behavior

## Demo flow (end-to-end)
1. **Raw Data Ingestion tab** loads 50 synthetic after-hours voicemails.
2. Each record is stamped with realistic overnight timing metadata (`datetime`, `hours_since_received`, `time_bucket`).
3. Click **Run Intelligence** to process all voicemails with an LLM triage prompt.
4. **Generated Signals tab** shows sorted triage cards by urgency.
5. Staff mark tasks complete; completed cards move to a separate **Done** section.

## What is automated vs human
**Automated**
- transcript interpretation
- urgency classification
- concise case summary generation
- action checklist drafting
- priority ordering

**Human retained**
- final judgment for edge cases / risk
- clinical decision making
- callback conversation quality
- override of LLM output when confidence is low

## Core product behaviors
- Optimized for **speed under interruption**: summaries + checklists over full transcript review.
- Optimized for **trust**: original transcript visible on hover for quick validation.
- Optimized for **calm triage**: urgency-first ordering, done-state separation, concise cards.
- Time-aware task generation (older urgent messages push prompt callback tasks first).

## Deliverables
### Deliverable 1: Runnable/Clickable Prototype
The system is built as a functional React + TypeScript artifact, focused on execution and workflow clarity.

Prototype access:
- Runnable locally via `npm run dev`
- Repository: this GitHub project

What it demonstrates (as required):
- A voicemail inbox/dashboard (`Raw Data Ingestion` + `Generated Signals` views)
- Each voicemail represented as a structured item (triage card with title, summary, urgency, tasks, confidence)
- Prioritisation/triage signals (urgency ordering: `EMERGENCY` -> `ADMIN`)
- Basic management actions (task check-off, done-state movement, next-step checklist)

### Deliverable 2: Short Walkthrough (Video/Voiceover)
The walkthrough should demonstrate:
- How raw voicemails become actionable items (ingestion -> LLM triage -> signal cards)
- What is automated vs left to humans (AI triage support, human final judgment)
- How this fits a busy clinic morning workflow (urgency-first queue, fast callback decisions, reduced listening overhead)

<div>
    <a href="https://www.loom.com/share/9d9cbbc4a9734185a7d607c531f847fb">
      <p>Revolutionizing Voicemail Management for Clinical Staff 📞 - Watch Video</p>
    </a>
    <a href="https://www.loom.com/share/9d9cbbc4a9734185a7d607c531f847fb">
      <img style="max-width:300px;" src="https://cdn.loom.com/sessions/thumbnails/9d9cbbc4a9734185a7d607c531f847fb-d5c1bb8a53a7d33a-full-play.gif#t=0.1">
    </a>
  </div>

### Example AI Output

**Urgency:** SOON  
**Title:** Diabetes Blood Sugar Concerns  
**Confidence:** 0.90  

**Summary:**  
George Liu reports that his blood sugar levels have been between 15 and 18 for most of the past week despite no significant diet changes. He has type 2 diabetes and is concerned about the persistently high readings. He is asking whether he should schedule an appointment to review his condition.

**Recommended Tasks:**
- Nurse to call patient back this morning — voicemail received over 8 hours ago  
- GP to review recent blood sugar readings and diabetes management  
- Reception to schedule GP appointment if clinical review is recommended