import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const signal = db.prepare('SELECT * FROM signals WHERE id = ?').get(id);
    
    if (!signal) {
      return NextResponse.json(
        { error: 'Signal not found' },
        { status: 404 }
      );
    }
    
    const fitScores = db.prepare(`
      SELECT * FROM fit_scores 
      WHERE signal_id = ? 
      ORDER BY fit_score DESC
    `).all(id);
    
    return NextResponse.json({ signal, fit_scores: fitScores });
  } catch (error) {
    console.error('Error fetching signal:', error);
    return NextResponse.json(
      { error: 'Failed to fetch signal' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const allowedFields = ['status', 'action', 'fit_note'];
    const updates: string[] = [];
    const values: any[] = [];
    
    for (const field of allowedFields) {
      if (field in body) {
        updates.push(`${field} = ?`);
        values.push(body[field]);
      }
    }
    
    if (updates.length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      );
    }
    
    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);
    
    const stmt = db.prepare(`
      UPDATE signals 
      SET ${updates.join(', ')}
      WHERE id = ?
    `);
    
    stmt.run(...values);
    
    const updated = db.prepare('SELECT * FROM signals WHERE id = ?').get(id);
    
    return NextResponse.json({ signal: updated });
  } catch (error) {
    console.error('Error updating signal:', error);
    return NextResponse.json(
      { error: 'Failed to update signal' },
      { status: 500 }
    );
  }
}
