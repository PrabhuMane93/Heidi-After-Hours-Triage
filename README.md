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

## Tech stack
- React 19 + TypeScript
- Vite
- Tailwind (CDN in `index.html`)
- OpenAI Node SDK (`gpt-4o-mini`) for triage card generation
- Local synthetic dataset: `heidi_voicemails_afterhours_coherent_50.json`

## Local run
### Prerequisites
- Node.js 18+
- npm

### Setup
```bash
npm install
```

Create a local env file:
```bash
cp .env.local.example .env.local
```

Add your API key:
```env
OPENAI_API_KEY=your_key_here
```

Start dev server:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## Environment variables
- `OPENAI_API_KEY` (required): used by `services/openaiService.ts`.
- `GEMINI_API_KEY` is currently wired in Vite config but not used in this prototype workflow.

## Project structure
- `App.tsx`: top-level dashboard workflow and state orchestration.
- `services/mockDataService.ts`: synthetic voicemail ingestion + timestamp enrichment.
- `services/openaiService.ts`: triage prompt and model call.
- `components/RawDataTable.tsx`: raw voicemail queue view.
- `components/SignalCard.tsx`: actionable triage card UI.
- `components/DashboardHeader.tsx`: high-level throughput metrics.
- `types.ts`: shared data contracts.

## Notes and current limitations
- This is a prototype; no backend persistence yet.
- Task completion state is client-side only (resets on reload).
- API key is consumed client-side (`dangerouslyAllowBrowser: true`) for demo speed; production should proxy via secure backend.
- Build currently logs a warning that `/index.css` is referenced but missing.

## Suggested next production increments
1. Move LLM calls to a backend service with audit logging and PHI-safe controls.
2. Add queue ownership, SLA timers, and escalation policies.
3. Add deduplication/threading for repeat callers.
4. Add integration with PMS/EHR task systems.
5. Add failure-mode handling (uncertain intent, poor transcript quality, conflicting urgency cues).
