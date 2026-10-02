# DHS Account Intel + SpaceXAI Fit Scoring
A realtime web application for tracking DHS buying signals with semantic fit scoring against SpaceXAI's government product catalog.
## Features
- **📊 Live Dashboard**: Monitor DHS component opportunities (ICE, CBP, USCIS, FEMA, CISA, DHS HQ) in real-time
- **🎯 Semantic Scoring**: AI-powered fit scoring that ranks ALL SpaceXAI catalog products (0-100) against each opportunity
- **⚡ Realtime Updates**: Server-Sent Events (SSE) for live signal and score updates without page refresh
- **📦 Seeded Data**: Ships with complete SpaceXAI catalog and ICE Enterprise AI RFI for immediate demo
- **🔄 Status Management**: Track signals through open → watch → responding → closed workflow
- **🔍 Catalog Browser**: Search and filter 14 SpaceXAI government products/services
- **📋 Export & Actions**: Copy formatted alerts, trigger rescoring, update signal status

## Quick Start

### Prerequisites

- Node.js 18+ (20+ recommended)
- npm 8+

### Local Run (90 seconds to demo)

# Install dependencies
npm install

# Initialize database and start dev server (auto-runs on port 43210)
The application will:
1. Create SQLite database at `data/intel.db`
2. Seed 14 SpaceXAI catalog products
3. Seed ICE Enterprise AI RFI (due Oct 16, 2026)
4. Score the RFI against all catalog products
5. Start Next.js dev server at http://localhost:43210
**Expected Top Scores for ICE RFI:**
- GOV-FDE (Federal Data & Enterprise Platform): ~88-92
- GOV-SECURE (Secure Government Cloud): ~80-86
- GOV-GROK4 (Grok 4 for Government): ~75-82
The ICE RFI emphasizes enterprise AI platform, LLMOps, data fabric, and secure cloud infrastructure—perfect alignment with GOV-FDE and GOV-SECURE.
## How Scoring Works
### Semantic Scoring Engine
The scoring system uses **TF-IDF (Term Frequency-Inverse Document Frequency)** with **cosine similarity** to match opportunity text against catalog products:
#### Algorithm Overview
1. **Tokenization**: Text is lowercased, punctuation removed, split into tokens (words ≥3 chars)
2. **TF-IDF Vectorization**:
   - **Term Frequency (TF)**: How often a term appears in a document (normalized by document length)
   - **Inverse Document Frequency (IDF)**: How rare/important a term is across all documents
   - **TF-IDF Score**: TF × IDF for each term in the vocabulary
3. **Cosine Similarity**: Measures the angle between two TF-IDF vectors
   - Range: 0 (orthogonal/no match) to 1 (identical direction/perfect match)
   - Formula: `cosine_similarity = dot_product(vec1, vec2) / (||vec1|| × ||vec2||)`

4. **Score Normalization**: Raw similarity (0-1) scaled to 0-100 with 1.5x multiplier to boost relevant matches

5. **Rationale Generation**: Explains the score based on:
   - Semantic alignment strength (strong/moderate/limited)
   - Matched key terms from the opportunity text
   - Domain-specific signals (AI, data, cloud, security, enterprise keywords)
   - Product family alignment (e.g., Platform Services + enterprise scope)

#### Why This Approach?

- **No External Dependencies**: Pure JavaScript implementation, no OpenAI/embeddings API required
- **Transparent & Explainable**: Clear rationale shows why each product scored as it did
- **Fast**: Scores all 14 products in <100ms
- **Deterministic**: Same input always produces same scores (good for testing)
- **Government Context Aware**: Weights terms like "FedRAMP", "classified", "enterprise", "compliance"

#### Scoring Code Location

- Engine: `lib/scoring.ts`
- API Endpoint: `app/api/score/route.ts`
- Tests: `__tests__/scoring.test.ts`

## Project Structure

```
.
├── app/
│   ├── api/
│   │   ├── catalog/route.ts      # Catalog search/filter API
│   │   ├── signals/route.ts      # Signal CRUD API
│   │   ├── signals/[id]/route.ts # Single signal detail/update
│   │   ├── score/route.ts        # Semantic scoring endpoint
│   │   └── stream/route.ts       # SSE realtime updates
│   ├── catalog/page.tsx          # Catalog browser UI
│   ├── signals/[id]/page.tsx     # Signal detail view with scores
│   ├── layout.tsx                # App shell with nav
│   ├── page.tsx                  # Dashboard (main view)
│   └── globals.css               # Tailwind + design tokens
├── lib/
│   ├── db.ts                     # SQLite database setup
│   ├── seed.ts                   # Seed data (catalog + ICE RFI)
│   ├── scoring.ts                # TF-IDF semantic scoring engine
│   ├── types.ts                  # TypeScript interfaces
│   └── utils.ts                  # UI utilities (formatters, colors)
├── scripts/
│   └── init-db.ts                # DB initialization + scoring script
├── data/
│   └── intel.db                  # SQLite database (auto-generated)
└── __tests__/
    └── scoring.test.ts           # Scoring algorithm tests
```

## Database Schema

### Tables

**signals** - DHS buying signals/opportunities
- `id`, `date`, `account` (ICE/CBP/USCIS/FEMA/CISA/DHS HQ)
- `type` (RFI, Sources Sought, RFP, Award, etc.)
- `title`, `deadline`, `source`, `action`
- `status` (open/watch/responding/closed)
- `top_sku`, `fit_score`, `fit_note`
- `full_text` (complete opportunity text for scoring)

**catalog** - SpaceXAI government products
- `sku` (GOV-GROK4, GOV-FDE, etc.)
- `family` (AI Models, Platform Services, Security, etc.)
- `name`, `channel` (FedRAMP High, IL5, etc.)
- `keywords`, `description`, `source`, `updated`

**fit_scores** - Per-product fit scores for each signal
- `signal_id` → signals
- `sku` → catalog
- `product_name`, `fit_score` (0-100)
- `rationale`, `scored_at`

## API Reference

### Signals

**GET /api/signals**
- Query: `?status=open&account=ICE`
- Returns: List of signals with metadata

**GET /api/signals/:id**
- Returns: Signal detail + all fit scores

**POST /api/signals**
- Body: Signal object (date, account, type, title, deadline, source, action, full_text)
- Returns: Created signal ID

**PATCH /api/signals/:id**
- Body: `{ status: "responding" }` or `{ action: "..." }` or `{ fit_note: "..." }`
- Returns: Updated signal

### Catalog

**GET /api/catalog**
- Query: `?search=ai&family=AI Models`
- Returns: Filtered catalog + available families

### Scoring

**POST /api/score**
- Body: `{ signal_id: 1, text: "..." }`
- Returns: Ranked scores for ALL catalog products (0-100 each)
- Side effect: Stores scores in fit_scores table, updates signal.top_sku + signal.fit_score

### Realtime Stream

**GET /api/stream**
- Server-Sent Events endpoint
- Emits `update` event when signals/scores change
- Emits `ping` every 5s as keepalive

## SAM.gov Integration (Optional)

To enable live SAM.gov opportunity fetching:

1. Get API key from https://sam.gov/data-services/
2. Set environment variable:
   ```bash
   export SAM_API_KEY=your_key_here
   ```
3. Restart dev server

**Note**: The app is fully functional without SAM.gov integration using seeded data. SAM.gov integration is for production deployments requiring live feed updates.

## SpaceXAI Catalog (14 Products)

### AI Models
- **GOV-GROK4**: Advanced LLM for government with FedRAMP High
- **GOV-GROK4F**: High-performance fast inference variant

### Data & Search
- **GOV-SEARCH**: Enterprise search with semantic understanding & RAG
- **GOV-DOCS**: Document intelligence with classification handling

### Platform Services
- **GOV-FDE**: Federal Data & Enterprise AI Platform (LLMOps, data fabric, governance)

### Security & Compliance
- **GOV-SECURE**: Hardened AI infrastructure (IL5, airgapped, NIST 800-53)
- **GOV-SEC**: Cybersecurity & threat detection with SOC/SIEM integration

### Developer Tools
- **GOV-CODE**: AI code assistant with DevSecOps integration

### Custom Solutions
- **GOV-CUSTOM**: Custom model development & fine-tuning

### Intelligence
- **GOV-INTEL**: Multi-INT fusion & threat analysis (OSINT/SIGINT/GEOINT)

### Operations
- **GOV-PLAN**: Mission planning, strategy, wargaming, decision support

### Professional Services
- **GOV-LEGAL**: Legal & regulatory AI (CFR, USC, agency regs)
- **GOV-SUPPORT**: 24/7 cleared support, training, certification

### Business Operations
- **GOV-BIZ**: Business intelligence, acquisition analytics, financial management

## Testing

### Run Scoring Tests

```bash
npm test
```

Tests verify:
- ✅ GOV-FDE ranks highest for ICE Enterprise AI RFI (expected: 85-95)
- ✅ GOV-SECURE ranks in top 3 (security/compliance emphasis)
- ✅ All 14 products receive scores (0-100 range)
- ✅ Rationale generation works correctly
- ✅ TF-IDF vectorization is consistent

### Expected Test Results

The ICE RFI emphasizes:
- Enterprise AI platform & LLMOps
- Data fabric & integration (50+ systems)
- Secure cloud (FedRAMP High, zero-trust)
- Governance & compliance

**Expected top 3**:
1. GOV-FDE (88-92): Perfect match for "Enterprise AI Platform"
2. GOV-SECURE (80-86): Security/compliance requirements
3. GOV-GROK4 or GOV-DATA (75-82): AI/data platform fit

## Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Database**: SQLite (better-sqlite3)
- **Realtime**: Server-Sent Events (SSE)
- **Scoring**: TF-IDF + Cosine Similarity (no external AI APIs)
- **Deployment**: Vercel-ready (Node.js runtime)

## Development

### Add a New Signal

```bash
curl -X POST http://localhost:43210/api/signals \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2026-10-05",
    "account": "CBP",
    "type": "Sources Sought",
    "title": "CBP Cloud AI Platform",
    "deadline": "2026-11-15T17:00:00-05:00",
    "source": "https://sam.gov/...",
    "action": "Respond by Nov 15; leverage Cumulus IDIQ",
    "full_text": "CBP seeks an enterprise AI platform..."
  }'
```

### Trigger Manual Rescore

```bash
curl -X POST http://localhost:43210/api/score \
  -H "Content-Type: application/json" \
  -d '{
    "signal_id": 1,
    "text": "Full opportunity text here..."
  }'
```

### Monitor Realtime Stream

```bash
curl -N http://localhost:43210/api/stream
```

## Production Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

**Important**: SQLite database is ephemeral on Vercel. For production, migrate to:
- Vercel Postgres (recommended)
- PlanetScale (MySQL)
- Supabase (PostgreSQL)

Update `lib/db.ts` to use your chosen database client.

### Environment Variables (Production)

```env
SAM_API_KEY=your_sam_gov_api_key_optional
DATABASE_URL=your_postgres_url_if_migrated
```

## Roadmap / Future Enhancements

- [ ] SAM.gov auto-refresh background job (daily/hourly)
- [ ] Google Sheets two-way sync (read/write to `DHS Account Intel` sheet)
- [ ] Email/Slack alerts for high-scoring signals (>80)
- [ ] Historical trending: score evolution over time
- [ ] Competitor tracking: mention detection (Palantir, Google, OpenAI, Anthropic)
- [ ] Export to PDF/DOCX for response teams
- [ ] Multi-user auth (Clerk or NextAuth.js)
- [ ] PostgreSQL migration for production scale

## License

Proprietary - SpaceXAI Internal Use

## Support

For questions or issues:
- Technical: engineering@spacexai.com
- Product: product@spacexai.com
- Sales: govteam@spacexai.com

---

**Built with ❤️ for DHS Account Teams • Powered by TF-IDF Semantic Scoring**
