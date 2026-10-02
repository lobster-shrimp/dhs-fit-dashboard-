import { NextResponse } from 'next/server';
import { getAllSignals, insertSignal, getAllCatalogSKUs, insertFitScore, updateSignalProcessed } from '@/lib/db';
import { scoreAllSKUsForSignal } from '@/lib/scoring';
import type { Signal } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const signals = getAllSignals();
    return NextResponse.json(signals);
  } catch (error) {
    console.error('Error fetching signals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch signals' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const signal: Signal = {
      id: body.id || `sig-${Date.now()}`,
      source: body.source,
      title: body.title,
      summary: body.summary,
      requirements: body.requirements || [],
      keywords: body.keywords || [],
      priority: body.priority || 'medium',
      deadline: body.deadline,
      uploaded_at: new Date().toISOString(),
      processed: false,
    };

    insertSignal(signal);

    const catalog = getAllCatalogSKUs();
    const results = scoreAllSKUsForSignal(signal, catalog);

    for (const result of results) {
      insertFitScore({
        signal_id: signal.id,
        sku_id: result.sku.id,
        score: result.score,
        match_details: result.details,
        calculated_at: new Date().toISOString(),
      });
    }

    updateSignalProcessed(signal.id, true);

    return NextResponse.json({ signal, scores: results.length }, { status: 201 });
  } catch (error) {
    console.error('Error creating signal:', error);
    return NextResponse.json(
      { error: 'Failed to create signal' },
      { status: 500 }
    );
  }
}
