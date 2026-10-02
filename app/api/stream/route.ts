import { NextRequest } from 'next/server';
import db from '@/lib/db';

let lastCheck = Date.now();
let lastSignalCount = 0;
let lastUpdateTime = '';

export async function GET(request: NextRequest) {
  const encoder = new TextEncoder();
  
  const stream = new ReadableStream({
    async start(controller) {
      const sendUpdate = () => {
        try {
          const signals = db.prepare('SELECT * FROM signals ORDER BY updated_at DESC LIMIT 1').all();
          const signalCount = db.prepare('SELECT COUNT(*) as count FROM signals').get() as any;
          const latestUpdate = signals.length > 0 ? (signals[0] as any).updated_at : '';
          
          if (signalCount.count !== lastSignalCount || latestUpdate !== lastUpdateTime) {
            lastSignalCount = signalCount.count;
            lastUpdateTime = latestUpdate;
            
            const data = {
              type: 'update',
              timestamp: new Date().toISOString(),
              signal_count: signalCount.count,
              latest_update: latestUpdate
            };
            
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
            );
          } else {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ type: 'ping', timestamp: new Date().toISOString() })}\n\n`)
            );
          }
        } catch (error) {
          console.error('SSE error:', error);
        }
      };
      
      const interval = setInterval(sendUpdate, 5000);
      
      sendUpdate();
      
      request.signal.addEventListener('abort', () => {
        clearInterval(interval);
        controller.close();
      });
    }
  });
  
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
