import { NextResponse } from 'next/server';
import { getAllCatalogSKUs } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const catalog = getAllCatalogSKUs();
    return NextResponse.json(catalog);
  } catch (error) {
    console.error('Error fetching catalog:', error);
    return NextResponse.json(
      { error: 'Failed to fetch catalog' },
      { status: 500 }
    );
  }
}
