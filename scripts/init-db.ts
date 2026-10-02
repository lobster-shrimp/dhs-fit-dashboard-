import { seedDatabase } from '../lib/seed';

console.log('Initializing database...');

try {
  const result = seedDatabase();
  console.log('✓ Database initialized successfully');
  console.log(`✓ Seeded signal ID: ${result.signalId}`);
  
  import('../lib/scoring').then(async ({ scoreProductsAgainstSignal }) => {
    const db = (await import('../lib/db')).default;
    
    const signal = db.prepare('SELECT * FROM signals WHERE id = ?').get(result.signalId) as any;
    const catalog = db.prepare('SELECT * FROM catalog').all() as any[];
    
    console.log('\nScoring ICE RFI against catalog...');
    const scores = scoreProductsAgainstSignal(signal.full_text, catalog);
    
    const insertStmt = db.prepare(`
      INSERT INTO fit_scores (signal_id, sku, product_name, fit_score, rationale)
      VALUES (?, ?, ?, ?, ?)
    `);
    
    for (const score of scores) {
      insertStmt.run(
        result.signalId,
        score.sku,
        score.product_name,
        score.fit_score,
        score.rationale
      );
    }
    
    const topScore = scores[0];
    db.prepare(`
      UPDATE signals 
      SET top_sku = ?, fit_score = ?
      WHERE id = ?
    `).run(topScore.sku, topScore.fit_score, result.signalId);
    
    console.log(`✓ Scored ${scores.length} products`);
    console.log(`✓ Top match: ${topScore.sku} (${topScore.fit_score}/100)`);
    console.log('\nTop 5 scores:');
    scores.slice(0, 5).forEach((score, idx) => {
      console.log(`  ${idx + 1}. ${score.sku}: ${score.fit_score}/100 - ${score.product_name}`);
    });
    
    process.exit(0);
  });
} catch (error) {
  console.error('Error:', error);
  process.exit(1);
}
