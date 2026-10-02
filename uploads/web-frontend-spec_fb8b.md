# DHS Account Intel + SpaceXAI Fit — realtime web front end

## Goal
Build a modern web front end that operators use to watch DHS buying signals in near-real time, score them against SpaceXAI products/services, and take actions (mark status, request demo, draft response notes). Data must be actionable and feel realtime (live updates / polling / SSE / websocket — pick the simplest solid approach).

## Existing workflow to integrate with
- Google Sheet "DHS Account Intel": spreadsheetId `1_fUoZEXUFbIlkK5X6FOJmMgCyas0xxt3RXD444LLCm4`
  - `Signals` columns: date, account, type, title, deadline, source, action, status, top_sku, fit_score, fit_note
  - `Catalog` columns: sku, family, name, channel, keywords, description, source, updated
  - `FitScores` columns: scored_at, signal_date, account, notice_type, title, deadline, top_sku, top_product, fit_score, all_scores_json, rationale, action, source_url
- SAM.gov public Opportunities API v2 (api_key via env `SAM_API_KEY`): used for ICE/CBP/USCIS/FEMA/CISA/DHS HQ searches
- Seeded ICE signal: Sources Sought "ICE Enterprise AI, Data, and Technology Strategy/Arch.: O&M, Enhancement, and Design RFI" due 2026-10-16 10:00 EDT — already scored top GOV-FDE ~92

## SpaceXAI catalog (must score against ALL)
Include at least these SKUs (full table lives in Catalog tab / public x.ai pages):
GOV-GROK4, GOV-GROK4F, GOV-SEARCH, GOV-DOCS, GOV-SECURE, GOV-CODE, GOV-FDE, GOV-CUSTOM, GOV-INTEL, GOV-PLAN, GOV-SEC, GOV-LEGAL, GOV-SUPPORT, GOV-BIZ
Sources: https://x.ai/grok/government https://x.ai/solutions https://x.ai/news/government https://x.ai/news/onegov

## Product requirements
1. Dashboard UI: list of live/open signals with account badges, deadlines, countdown, status, top fit score.
2. Signal detail: full text/meta, ranked SpaceXAI fit scores for every catalog product (semantic layer), rationale, suggested action buttons.
3. Catalog browser: all products/services with keyword/description search.
4. Realtime: when new SAM hits arrive or scores update, UI updates without full page reload.
5. Actions that matter: change status (open/watch/responding/closed), pin/star, copy ALERT blurb, export row, trigger rescore.
6. API layer: REST (or similar) for signals, catalog, scores; background job or route to refresh SAM for the five DHS accounts + HQ; semantic scoring endpoint that returns 0–100 per SKU.
7. Auth: simple local/dev auth or API key gate is fine for v1; do not require real Google OAuth on day one — support JSON/CSV seed + optional Sheets sync later.
8. Seed data: ship with Catalog + the ICE RFI FitScore so the UI is demoable offline.

## Tech guidance (non-binding)
Prefer a single deployable stack (e.g. Next.js or Vite+React + small Node/Express/Fastify API). Use embeddings or a clear semantic similarity approach for scoring (document how). Clear README with run instructions. Tests for scoring ranking on the ICE RFI fixture.

## Done when
- `README.md` explains how to run locally
- UI shows signals, catalog, and per-product scores
- Scoring endpoint ranks all catalog SKUs for a pasted/notice text
- Realtime updates work for new signals or score changes
- Seeded ICE RFI appears with actionable next steps
