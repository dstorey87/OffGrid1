import { NextRequest } from 'next/server';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Server-Sent Events endpoint for streaming AI test events
 * Tails the live_stream.jsonl file and sends new events to clients
 */
export async function GET(request: NextRequest) {
  const encoder = new TextEncoder();
  
  const stream = new ReadableStream({
    async start(controller) {
      const streamFile = path.join(process.cwd(), '..', 'logs', 'live_stream.jsonl');
      
      // Send initial connection event
      const connectEvent = `data: ${JSON.stringify({
        type: 'connected',
        timestamp: new Date().toISOString(),
        message: 'Connected to AI test stream'
      })}\n\n`;
      controller.enqueue(encoder.encode(connectEvent));
      
      let lastPosition = 0;
      
      // Check if file exists
      if (!existsSync(streamFile)) {
        const errorEvent = `data: ${JSON.stringify({
          type: 'info',
          timestamp: new Date().toISOString(),
          message: 'Waiting for AI runner to start...'
        })}\n\n`;
        controller.enqueue(encoder.encode(errorEvent));
      } else {
        // Read existing content first
        try {
          const content = await readFile(streamFile, 'utf-8');
          const lines = content.split('\n').filter(line => line.trim());
          
          // Send last 50 events for context
          const recentLines = lines.slice(-50);
          for (const line of recentLines) {
            const event = `data: ${line}\n\n`;
            controller.enqueue(encoder.encode(event));
          }
          
          lastPosition = content.length;
        } catch (err) {
          console.error('Error reading stream file:', err);
        }
      }
      
      // Poll for new content every 500ms
      const interval = setInterval(async () => {
        if (!existsSync(streamFile)) return;
        
        try {
          const content = await readFile(streamFile, 'utf-8');
          
          if (content.length > lastPosition) {
            const newContent = content.slice(lastPosition);
            const newLines = newContent.split('\n').filter(line => line.trim());
            
            for (const line of newLines) {
              const event = `data: ${line}\n\n`;
              controller.enqueue(encoder.encode(event));
            }
            
            lastPosition = content.length;
          }
        } catch (err) {
          console.error('Error polling stream file:', err);
        }
      }, 500);
      
      // Cleanup on disconnect
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
