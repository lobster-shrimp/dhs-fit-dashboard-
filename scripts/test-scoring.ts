import { getAllCatalogSKUs, getSignal } from '../lib/db';
import { scoreAllSKUsForSignal } from '../lib/scoring';

console.log('🧪 Testing scoring algorithm...\n');

const signal = getSignal('sig-001');

if (!signal) {
  console.error('❌ Signal sig-001 not found. Run npm run init-db first.');
  process.exit(1);
}

console.log('📡 Signal:', signal.title);
console.log('🎯 Priority:', signal.priority);
console.log('📋 Requirements:', signal.requirements.length);
console.log('🔑 Keywords:', signal.keywords.join(', '));
console.log();

const catalog = getAllCatalogSKUs();
console.log(`📦 Scoring against ${catalog.length} SKUs...\n`);

const results = scoreAllSKUsForSignal(signal, catalog);

console.log('🏆 Top Matches:\n');
results.slice(0, 5).forEach((result, index) => {
  console.log(`${index + 1}. ${result.sku.name}`);
  console.log(`   Score: ${(result.score * 100).toFixed(1)}% (${result.details.strength})`);
  console.log(`   Capability matches: ${result.details.capability_matches.length}`);
  console.log(`   Keyword matches: ${result.details.keyword_matches.length}`);
  console.log(`   Requirement coverage: ${(result.details.requirement_coverage * 100).toFixed(1)}%`);
  console.log(`   Rationale: ${result.details.rationale}`);
  console.log();
});

console.log('📊 Score Distribution:');
const distribution = {
  excellent: results.filter(r => r.score >= 0.75).length,
  strong: results.filter(r => r.score >= 0.55 && r.score < 0.75).length,
  moderate: results.filter(r => r.score >= 0.35 && r.score < 0.55).length,
  weak: results.filter(r => r.score < 0.35).length,
};

console.log(`   Excellent (≥75%): ${distribution.excellent}`);
console.log(`   Strong (55-74%): ${distribution.strong}`);
console.log(`   Moderate (35-54%): ${distribution.moderate}`);
console.log(`   Weak (<35%): ${distribution.weak}`);
console.log('\n✅ Scoring test complete!');
