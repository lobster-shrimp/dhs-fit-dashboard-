<h1 align="center">
  <br>
  🛡️
  <br>
  DHS Fit Dashboard
  <br>
</h1>

<h4 align="center">Intelligence dashboard for tracking DHS opportunity signals and SpaceXAI fit scores.</h4>

<p align="center">
  <a href="#key-features">Key Features</a> •
  <a href="#how-to-use">How To Use</a> •
  <a href="#credits">Credits</a> •
  <a href="#license">License</a>
</p>

<p align="center">
  <i>Screenshot: Dashboard view with signal tracking, catalog browser, and fit score analysis</i>
</p>

## Key Features

* **Opportunity Signal Tracking**
  - Monitor RFIs, RFPs, and procurement signals from DHS agencies
  - Priority indicators and deadline tracking
  - Automated processing pipeline
* **Automated Fit Scoring**
  - Multi-factor algorithm calculating match scores between opportunity requirements and SpaceXAI capabilities
  - Requirement coverage analysis (40%), capability matches (30%), keyword overlap (20%)
  - Priority boosts for critical/high-priority signals
* **Catalog Management**
  - Browse 8+ SpaceXAI products and services (Starlink, Starshield, Launch Services, etc.)
  - Organized by category with full capability and tag listings
  - Seeded demo data for immediate exploration
* **Interactive Dashboard**
  - Overview page with top 3 matches per signal
  - Detailed signal pages with complete fit score breakdowns
  - Match analysis with capability/keyword overlaps and requirement coverage visualization
* **RESTful API**
  - Programmatic access to catalog, signals, and scoring engine
  - Create signals and auto-calculate scores
  - Query endpoints for integration
* **Real-time Stream**
  - Server-sent events endpoint for live updates
  - Event stream for signals and scores
* **Seeded Demo Data**
  - Pre-loaded ICE RFI signal for immediate testing
  - 8 SpaceXAI catalog SKUs with realistic capabilities
  - Pre-calculated fit scores ready to explore

## How To Use

To clone and run this application, you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

```bash
# Clone this repository
$ git clone https://github.com/lobster-shrimp/dhs-fit-dashboard-

# Go into the repository
$ cd dhs-fit-dashboard-

# Install dependencies
$ npm install

# Initialize the database with seed data
$ npm run init-db

# Run the development server
$ npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

> **Note**
> The database (data/intel.db) is created on first init-db run. Re-run `npm run init-db` to reset with fresh seed data.

### Additional Commands

```bash
# Build for production
$ npm run build

# Run production server
$ npm start

# Run tests
$ npm test

# Test scoring algorithm
$ npm run test-scoring
```

## API Endpoints

The dashboard exposes RESTful endpoints:

- `GET /api/catalog` - List all catalog SKUs
- `GET /api/signals` - List all signals
- `POST /api/signals` - Create new signal and auto-score
- `GET /api/signals/[id]` - Get signal with scores
- `POST /api/score` - Calculate fit scores
- `GET /api/stream` - Server-sent events stream

## Project Context

This is a **public mirror** of an internal intelligence tool. The live production tracker is maintained in a Google Sheet with real-time DHS opportunity data. This repository contains a runnable demo UI with:

- Fictional seed data for demonstration purposes
- No secrets or API keys required
- SQLite file-based database
- Complete scoring algorithm implementation

## Credits

This software uses the following open source packages:

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [better-sqlite3](https://github.com/WiseLibs/better-sqlite3)
- [Tailwind CSS](https://tailwindcss.com/)
- [Jest](https://jestjs.io/)

## License

MIT

---

> GitHub [@lobster-shrimp](https://github.com/lobster-shrimp)
