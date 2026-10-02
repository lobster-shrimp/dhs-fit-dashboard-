import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const account = searchParams.get('account');
    
    let query = 'SELECT * FROM signals';
    const conditions: string[] = [];
    const params: any[] = [];
    
    if (status) {
      conditions.push('status = ?');
      params.push(status);
    }
    
    if (account) {
      conditions.push('account = ?');
      params.push(account);
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ' ORDER BY deadline ASC, created_at DESC';
    
    const stmt = db.prepare(query);
    const signals = stmt.all(...params);
    
    return NextResponse.json({ signals });
  } catch (error) {
    console.error('Error fetching signals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch signals' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { date, account, type, title, deadline, source, action, status, full_text } = body;
    
    const stmt = db.prepare(`
      INSERT INTO signals (date, account, type, title, deadline, source, action, status, full_text)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(date, account, type, title, deadline, source, action, status || 'open', full_text);
    
    return NextResponse.json({ 
      success: true, 
      id: result.lastInsertRowid 
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating signal:', error);
    return NextResponse.json(
      { error: 'Failed to create signal' },
      { status: 500 }
    );
  }
}
