import { NextResponse } from 'next/server';
import { getSignal, getScoresForSignal, getCatalogSKU } from '@/lib/db';

export const dynamic = 'force-dynamic';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const signal = getSignal(params.id);

    if (!signal) {
      return NextResponse.json(
        { error: 'Signal not found' },
        { status: 404 }
      );
    }

    const scores = getScoresForSignal(params.id);
    const scoredResults = scores.map(score => ({
      ...score,
      sku: getCatalogSKU(score.sku_id),
    }));

    return NextResponse.json({
      signal,
      scores: scoredResults,
    });
  } catch (error) {
    console.error('Error fetching signal:', error);
    return NextResponse.json(
      { error: 'Failed to fetch signal' },
      { status: 500 }
    );
  }
}
