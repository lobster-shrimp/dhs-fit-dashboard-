import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search');
    const family = searchParams.get('family');
    
    let query = 'SELECT * FROM catalog';
    const conditions: string[] = [];
    const params: any[] = [];
    
    if (search) {
      conditions.push('(name LIKE ? OR description LIKE ? OR keywords LIKE ? OR sku LIKE ?)');
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern, searchPattern);
    }
    
    if (family) {
      conditions.push('family = ?');
      params.push(family);
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ' ORDER BY family, name';
    
    const stmt = db.prepare(query);
    const catalog = stmt.all(...params);
    
    const families = db.prepare('SELECT DISTINCT family FROM catalog WHERE family IS NOT NULL ORDER BY family').all();
    
    return NextResponse.json({ 
      catalog,
      families: families.map((f: any) => f.family)
    });
  } catch (error) {
    console.error('Error fetching catalog:', error);
    return NextResponse.json(
      { error: 'Failed to fetch catalog' },
      { status: 500 }
    );
  }
}
