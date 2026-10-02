import { NextResponse } from 'next/server';
import { getSignal, getCatalogSKU, getAllCatalogSKUs, insertFitScore, updateSignalProcessed } from '@/lib/db';
import { calculateFitScore, scoreAllSKUsForSignal } from '@/lib/scoring';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { signal_id, sku_id } = body;

    if (signal_id && !sku_id) {
      const signal = getSignal(signal_id);
      if (!signal) {
        return NextResponse.json(
          { error: 'Signal not found' },
          { status: 404 }
        );
      }

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

      updateSignalProcessed(signal_id, true);

      return NextResponse.json({
        signal_id,
        scores_calculated: results.length,
        results: results.slice(0, 5),
      });
    }

    if (signal_id && sku_id) {
      const signal = getSignal(signal_id);
      const sku = getCatalogSKU(sku_id);

      if (!signal) {
        return NextResponse.json(
          { error: 'Signal not found' },
          { status: 404 }
        );
      }

      if (!sku) {
        return NextResponse.json(
          { error: 'SKU not found' },
          { status: 404 }
        );
      }

      const { score, details } = calculateFitScore(signal, sku);

      insertFitScore({
        signal_id,
        sku_id,
        score,
        match_details: details,
        calculated_at: new Date().toISOString(),
      });

      return NextResponse.json({
        signal_id,
        sku_id,
        score,
        details,
      });
    }

    return NextResponse.json(
      { error: 'Invalid request. Provide signal_id and optionally sku_id' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error calculating score:', error);
    return NextResponse.json(
      { error: 'Failed to calculate score' },
      { status: 500 }
    );
  }
}
