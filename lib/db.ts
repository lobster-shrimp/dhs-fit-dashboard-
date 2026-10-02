import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'intel.db');
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS signals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    account TEXT NOT NULL,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    deadline TEXT,
    source TEXT,
    action TEXT,
    status TEXT DEFAULT 'open',
    top_sku TEXT,
    fit_score REAL,
    fit_note TEXT,
    full_text TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS catalog (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sku TEXT UNIQUE NOT NULL,
    family TEXT,
    name TEXT NOT NULL,
    channel TEXT,
    keywords TEXT,
    description TEXT NOT NULL,
    source TEXT,
    updated TEXT
  );

  CREATE TABLE IF NOT EXISTS fit_scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    signal_id INTEGER NOT NULL,
    sku TEXT NOT NULL,
    product_name TEXT NOT NULL,
    fit_score REAL NOT NULL,
    rationale TEXT,
    scored_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (signal_id) REFERENCES signals(id),
    FOREIGN KEY (sku) REFERENCES catalog(sku)
  );

  CREATE INDEX IF NOT EXISTS idx_signals_status ON signals(status);
  CREATE INDEX IF NOT EXISTS idx_signals_account ON signals(account);
  CREATE INDEX IF NOT EXISTS idx_fit_scores_signal ON fit_scores(signal_id);
  CREATE INDEX IF NOT EXISTS idx_fit_scores_sku ON fit_scores(sku);
`);

export default db;
