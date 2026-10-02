# Agent Notes

## Project Context

This is the **DHS Account Intel / SpaceXAI Fit-Score Dashboard** - a public mirror of an internal intelligence tool used to track Department of Homeland Security (DHS) opportunity signals and automatically calculate fit scores against the SpaceXAI product catalog.

## Architecture

### Tech Stack
- **Next.js 14** with App Router and TypeScript
- **SQLite** database (better-sqlite3) for data persistence
- **Tailwind CSS** for styling
- **Jest** for testing

### Key Components

1. **Database Layer** (`lib/db.ts`)
   - SQLite schema with three tables: catalog, signals, fit_scores
   - Full CRUD operations for SKUs, signals, and scores
   - Automatic JSON serialization for arrays

2. **Scoring Engine** (`lib/scoring.ts`)
   - Multi-factor algorithm weighing requirements, capabilities, keywords
   - Priority boosts for critical/high-priority signals
   - Generates match details with rationale

3. **Seed Data** (`lib/seed.ts`)
   - 8 SpaceXAI catalog SKUs (Starlink, Starshield, etc.)
   - 1 sample ICE RFI signal
   - Realistic DHS procurement scenario

4. **API Routes** (`app/api/`)
   - RESTful endpoints for catalog, signals, scoring
   - Server-sent events stream for real-time updates
   - Auto-scoring on signal creation

5. **UI Pages** (`app/`)
   - Dashboard with signal overview and top matches
   - Catalog browser organized by category
   - Signal detail page with full score breakdown

## Development Workflow

### Initial Setup
```bash
npm install
npm run init-db  # Creates and seeds database
npm run dev      # Start development server
```

### Testing
```bash
npm test                  # Run Jest tests
npm run test-scoring      # Manual scoring algorithm test
```

### Database Reset
```bash
npm run init-db  # Drops and recreates database with seed data
```

## Important Files

- `lib/types.ts` - TypeScript interfaces for all data models
- `lib/utils.ts` - UI utilities (colors, formatting)
- `scripts/init-db.ts` - Database initialization script
- `data/intel.db` - SQLite database file (gitignored, generated)

## Common Tasks

### Adding a New Catalog SKU
1. Add to `seedCatalog` array in `lib/seed.ts`
2. Run `npm run init-db` to regenerate database
3. Scores will auto-calculate for existing signals

### Creating a New Signal
POST to `/api/signals` with:
```json
{
  "source": "Agency RFI",
  "title": "Requirement Title",
  "summary": "Description...",
  "requirements": ["req1", "req2"],
  "keywords": ["key1", "key2"],
  "priority": "high"
}
```

Scores are calculated automatically on creation.

### Adjusting Scoring Algorithm
- Edit weights in `calculateFitScore()` in `lib/scoring.ts`
- Test with `npm run test-scoring`
- Re-score existing signals via `/api/score` POST

## Deployment Notes

- Database file must be writable by Node process
- No environment variables or secrets required for demo
- Static export not supported (uses database + API routes)
- Recommended: Vercel, Railway, or similar Node.js host

## Public Mirror Context

This repository is a **public demonstration version**. The live production tracker:
- Uses a Google Sheet for real-time DHS opportunity tracking
- Contains actual procurement data (not public)
- Integrates with internal SpaceX systems
- Has additional security and access controls

This public version uses fictional seed data and is suitable for:
- Understanding the architecture
- Testing the scoring algorithm
- Demonstrating the UI/UX
- Learning the data model

## Future Enhancements

Potential additions:
- PDF parsing for uploaded RFI/RFP documents
- User authentication and access control
- Historical tracking and trend analysis
- Email notifications for high-fit opportunities
- Export to Excel/CSV
- GraphQL API alternative
- Real-time WebSocket updates (upgrade from SSE)

## Questions?

This codebase is well-documented with inline comments and type definitions. Key logic is in:
- Scoring: `lib/scoring.ts` 
- Database: `lib/db.ts`
- Types: `lib/types.ts`
