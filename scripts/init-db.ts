import { initializeSchema, insertCatalogSKU, insertSignal, getDb, closeDb } from '../lib/db';
import { seedCatalog, seedSignals } from '../lib/seed';
import { calculateFitScore } from '../lib/scoring';
import { insertFitScore } from '../lib/db';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DATA_DIR, 'intel.db');

console.log('🚀 Initializing DHS Fit Dashboard database...\n');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  console.log('✅ Created data directory');
}

if (fs.existsSync(DB_PATH)) {
  console.log('⚠️  Removing existing database...');
  fs.unlinkSync(DB_PATH);
}

console.log('📊 Creating schema...');
initializeSchema();
console.log('✅ Schema created\n');

console.log('📦 Seeding catalog...');
for (const sku of seedCatalog) {
  insertCatalogSKU(sku);
  console.log(`  ✓ ${sku.name}`);
}
console.log(`✅ Seeded ${seedCatalog.length} catalog SKUs\n`);

console.log('📡 Seeding signals...');
for (const signal of seedSignals) {
  insertSignal(signal);
  console.log(`  ✓ ${signal.title}`);
}
console.log(`✅ Seeded ${seedSignals.length} signal(s)\n`);

console.log('🎯 Calculating fit scores...');
for (const signal of seedSignals) {
  let scoreCount = 0;
  for (const sku of seedCatalog) {
    const { score, details } = calculateFitScore(signal, sku);
    insertFitScore({
      signal_id: signal.id,
      sku_id: sku.id,
      score,
      match_details: details,
      calculated_at: new Date().toISOString(),
    });
    scoreCount++;
  }
  console.log(`  ✓ ${signal.id}: ${scoreCount} scores calculated`);
}
console.log('✅ Fit scores calculated\n');

closeDb();

console.log('🎉 Database initialization complete!');
console.log(`📍 Location: ${DB_PATH}\n`);

const db = getDb();
const stats = {
  catalog: db.prepare('SELECT COUNT(*) as count FROM catalog').get() as { count: number },
  signals: db.prepare('SELECT COUNT(*) as count FROM signals').get() as { count: number },
  scores: db.prepare('SELECT COUNT(*) as count FROM fit_scores').get() as { count: number },
};
closeDb();

console.log('📈 Database statistics:');
console.log(`   Catalog SKUs: ${stats.catalog.count}`);
console.log(`   Signals: ${stats.signals.count}`);
console.log(`   Fit Scores: ${stats.scores.count}`);
console.log('\n✨ Ready to run: npm run dev');
