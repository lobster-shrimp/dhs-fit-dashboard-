import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { scoreProductsAgainstSignal } from '@/lib/scoring';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { signal_id, text } = body;
    
    if (!text) {
      return NextResponse.json(
        { error: 'Signal text is required' },
        { status: 400 }
      );
    }
    
    const catalogItems = db.prepare('SELECT * FROM catalog').all() as any[];
    
    const scores = scoreProductsAgainstSignal(text, catalogItems);
    
    if (signal_id) {
      db.prepare('DELETE FROM fit_scores WHERE signal_id = ?').run(signal_id);
      
      const insertStmt = db.prepare(`
        INSERT INTO fit_scores (signal_id, sku, product_name, fit_score, rationale)
        VALUES (?, ?, ?, ?, ?)
      `);
      
      for (const score of scores) {
        insertStmt.run(
          signal_id,
          score.sku,
          score.product_name,
          score.fit_score,
          score.rationale
        );
      }
      
      if (scores.length > 0) {
        const topScore = scores[0];
        db.prepare(`
          UPDATE signals 
          SET top_sku = ?, fit_score = ?, updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `).run(topScore.sku, topScore.fit_score, signal_id);
      }
    }
    
    return NextResponse.json({ 
      scores,
      top_score: scores.length > 0 ? scores[0] : null
    });
  } catch (error) {
    console.error('Error scoring signal:', error);
    return NextResponse.json(
      { error: 'Failed to score signal' },
      { status: 500 }
    );
  }
}
