import Database from 'better-sqlite3';
import path from 'path';
import type { CatalogSKU, Signal, FitScore } from './types';

const DB_PATH = path.join(process.cwd(), 'data', 'intel.db');

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
  }
  return db;
}

export function initializeSchema() {
  const database = getDb();

  database.exec(`
    CREATE TABLE IF NOT EXISTS catalog (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      capabilities TEXT NOT NULL,
      tags TEXT NOT NULL,
      description TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS signals (
      id TEXT PRIMARY KEY,
      source TEXT NOT NULL,
      title TEXT NOT NULL,
      summary TEXT NOT NULL,
      requirements TEXT NOT NULL,
      keywords TEXT NOT NULL,
      priority TEXT NOT NULL,
      deadline TEXT,
      uploaded_at TEXT NOT NULL,
      processed INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS fit_scores (
      signal_id TEXT NOT NULL,
      sku_id TEXT NOT NULL,
      score REAL NOT NULL,
      match_details TEXT NOT NULL,
      calculated_at TEXT NOT NULL,
      PRIMARY KEY (signal_id, sku_id),
      FOREIGN KEY (signal_id) REFERENCES signals(id) ON DELETE CASCADE,
      FOREIGN KEY (sku_id) REFERENCES catalog(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_signals_priority ON signals(priority);
    CREATE INDEX IF NOT EXISTS idx_scores_signal ON fit_scores(signal_id, score DESC);
    CREATE INDEX IF NOT EXISTS idx_scores_sku ON fit_scores(sku_id, score DESC);
  `);
}

export function getAllCatalogSKUs(): CatalogSKU[] {
  const database = getDb();
  const stmt = database.prepare('SELECT * FROM catalog ORDER BY name');
  const rows = stmt.all() as any[];
  
  return rows.map(row => ({
    ...row,
    capabilities: JSON.parse(row.capabilities),
    tags: JSON.parse(row.tags),
  }));
}

export function getCatalogSKU(id: string): CatalogSKU | null {
  const database = getDb();
  const stmt = database.prepare('SELECT * FROM catalog WHERE id = ?');
  const row = stmt.get(id) as any;
  
  if (!row) return null;
  
  return {
    ...row,
    capabilities: JSON.parse(row.capabilities),
    tags: JSON.parse(row.tags),
  };
}

export function insertCatalogSKU(sku: CatalogSKU): void {
  const database = getDb();
  const stmt = database.prepare(`
    INSERT OR REPLACE INTO catalog (id, name, category, capabilities, tags, description, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  
  stmt.run(
    sku.id,
    sku.name,
    sku.category,
    JSON.stringify(sku.capabilities),
    JSON.stringify(sku.tags),
    sku.description,
    sku.created_at
  );
}

export function getAllSignals(): Signal[] {
  const database = getDb();
  const stmt = database.prepare('SELECT * FROM signals ORDER BY uploaded_at DESC');
  const rows = stmt.all() as any[];
  
  return rows.map(row => ({
    ...row,
    requirements: JSON.parse(row.requirements),
    keywords: JSON.parse(row.keywords),
    processed: Boolean(row.processed),
  }));
}

export function getSignal(id: string): Signal | null {
  const database = getDb();
  const stmt = database.prepare('SELECT * FROM signals WHERE id = ?');
  const row = stmt.get(id) as any;
  
  if (!row) return null;
  
  return {
    ...row,
    requirements: JSON.parse(row.requirements),
    keywords: JSON.parse(row.keywords),
    processed: Boolean(row.processed),
  };
}

export function insertSignal(signal: Signal): void {
  const database = getDb();
  const stmt = database.prepare(`
    INSERT OR REPLACE INTO signals (id, source, title, summary, requirements, keywords, priority, deadline, uploaded_at, processed)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  stmt.run(
    signal.id,
    signal.source,
    signal.title,
    signal.summary,
    JSON.stringify(signal.requirements),
    JSON.stringify(signal.keywords),
    signal.priority,
    signal.deadline || null,
    signal.uploaded_at,
    signal.processed ? 1 : 0
  );
}

export function updateSignalProcessed(id: string, processed: boolean): void {
  const database = getDb();
  const stmt = database.prepare('UPDATE signals SET processed = ? WHERE id = ?');
  stmt.run(processed ? 1 : 0, id);
}

export function getScoresForSignal(signalId: string): FitScore[] {
  const database = getDb();
  const stmt = database.prepare(`
    SELECT * FROM fit_scores 
    WHERE signal_id = ? 
    ORDER BY score DESC
  `);
  const rows = stmt.all(signalId) as any[];
  
  return rows.map(row => ({
    ...row,
    match_details: JSON.parse(row.match_details),
  }));
}

export function getScoresForSKU(skuId: string): FitScore[] {
  const database = getDb();
  const stmt = database.prepare(`
    SELECT * FROM fit_scores 
    WHERE sku_id = ? 
    ORDER BY score DESC
  `);
  const rows = stmt.all(skuId) as any[];
  
  return rows.map(row => ({
    ...row,
    match_details: JSON.parse(row.match_details),
  }));
}

export function insertFitScore(score: FitScore): void {
  const database = getDb();
  const stmt = database.prepare(`
    INSERT OR REPLACE INTO fit_scores (signal_id, sku_id, score, match_details, calculated_at)
    VALUES (?, ?, ?, ?, ?)
  `);
  
  stmt.run(
    score.signal_id,
    score.sku_id,
    score.score,
    JSON.stringify(score.match_details),
    score.calculated_at
  );
}

export function closeDb(): void {
  if (db) {
    db.close();
    db = null;
  }
}
