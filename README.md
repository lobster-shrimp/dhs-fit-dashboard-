# DHS Fit Dashboard

> DHS Account Intel / SpaceXAI opportunity fit-score dashboard

A Next.js TypeScript dashboard application for tracking Department of Homeland Security (DHS) opportunity signals and calculating fit scores against the SpaceXAI product catalog.

## Overview

This dashboard provides:

- **Real-time opportunity tracking** - Monitor RFIs, RFPs, and other procurement signals from DHS agencies
- **Automated fit scoring** - Calculate match scores between opportunity requirements and SpaceXAI capabilities
- **Intelligence dashboard** - Visualize top matches, priority signals, and opportunity pipeline
- **RESTful API** - Programmatic access to catalog, signals, and scoring engine
- **Live stream endpoint** - Server-sent events for real-time updates

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
npm install
```

### Initialize Database

```bash
npm run init-db
```

This creates the SQLite database with seed data including:
- 8 SpaceXAI catalog SKUs (Starlink, Starshield, Launch Services, etc.)
- 1 sample ICE RFI signal
- Pre-calculated fit scores

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## Features

### Dashboard (`/`)
- Overview of all opportunity signals
- Priority indicators and deadlines
- Top 3 fit matches per signal
- Quick navigation to details

### Catalog (`/catalog`)
- Browse all SpaceXAI products and services
- Organized by category
- Capabilities and tags for each SKU

### Signal Details (`/signals/[id]`)
- Full signal requirements and keywords
- Complete fit score breakdown for all catalog SKUs
- Match analysis with capability/keyword overlaps
- Requirement coverage visualization

### API Endpoints

- `GET /api/catalog` - List all catalog SKUs
- `GET /api/signals` - List all signals
- `POST /api/signals` - Create new signal and auto-score
- `GET /api/signals/[id]` - Get signal with scores
- `POST /api/score` - Calculate fit scores
- `GET /api/stream` - Server-sent events stream

## Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: SQLite with better-sqlite3
- **Styling**: Tailwind CSS
- **Testing**: Jest

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Run production server
- `npm run lint` - Lint code
- `npm test` - Run tests
- `npm run init-db` - Initialize/reset database
- `npm run test-scoring` - Test scoring algorithm

## Scoring Algorithm

The fit score calculation considers:

1. **Requirement Coverage** (40%) - How many signal requirements match SKU capabilities
2. **Capability Matches** (30%) - Direct alignment between capabilities and signal needs  
3. **Keyword Overlap** (20%) - Shared terminology and tags
4. **Presence Bonus** (10%) - Any capability matches found
5. **Priority Boost** - Critical/high priority signals receive additional weight
6. **Category Bonus** - Keyword-category alignment

Scores range from 0-100% with strength ratings:
- **Excellent** (≥75%) - Strong alignment, high fit
- **Strong** (55-74%) - Good match, worth pursuing
- **Moderate** (35-54%) - Partial fit, needs review
- **Weak** (<35%) - Limited alignment

## Project Status

This is a **public mirror** of an internal intelligence tool. The live production tracker is maintained in a Google Sheet with real-time DHS opportunity data.

## License

MIT

## Notes

- No secrets or API keys required for demo
- Database is file-based (data/intel.db)
- All seed data is fictional for demonstration purposes
