import { getAllSignals, getScoresForSignal } from '@/lib/db';
import type { StreamEvent } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const sendEvent = (event: StreamEvent) => {
        const data = `data: ${JSON.stringify(event)}\n\n`;
        controller.enqueue(encoder.encode(data));
      };

      sendEvent({
        type: 'heartbeat',
        timestamp: new Date().toISOString(),
        data: { status: 'connected' },
      });

      const signals = getAllSignals();

      for (const signal of signals) {
        sendEvent({
          type: 'signal',
          timestamp: new Date().toISOString(),
          data: signal,
        });

        await new Promise(resolve => setTimeout(resolve, 100));

        const scores = getScoresForSignal(signal.id);
        
        for (const score of scores.slice(0, 3)) {
          sendEvent({
            type: 'score',
            timestamp: new Date().toISOString(),
            data: score,
          });
          
          await new Promise(resolve => setTimeout(resolve, 50));
        }
      }

      const intervalId = setInterval(() => {
        sendEvent({
          type: 'heartbeat',
          timestamp: new Date().toISOString(),
          data: { status: 'alive' },
        });
      }, 10000);

      setTimeout(() => {
        clearInterval(intervalId);
        controller.close();
      }, 60000);
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
