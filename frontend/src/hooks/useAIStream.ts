'use client';

import { useEffect, useState, useRef } from 'react';

export interface AITestEvent {
  timestamp: string;
  type: 'runner_start' | 'cycle_start' | 'test_discovered' | 'test_execution_start' | 
        'test_output' | 'test_start' | 'test_complete' | 'ai_prompt' | 'ai_thinking' | 
        'ai_response_chunk' | 'ai_full_response' | 'ai_rca' | 'ai_fix' | 
        'cycle_complete' | 'error' | 'connected' | 'info';
  cycle?: number;
  message?: string;
  test_name?: string;
  test?: string;
  file?: string;
  count?: number;
  output?: string;
  prompt?: string;
  full_length?: number;
  chunk?: string;
  response?: string;
  length?: number;
  status?: string;
  duration_ms?: number;
  error?: string;
  details?: string;
  analysis?: string;
  fix?: string;
  [key: string]: unknown;
}

export function useAIStream() {
  const [events, setEvents] = useState<AITestEvent[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);
  
  useEffect(() => {
    const eventSource = new EventSource('/api/ai-testing/stream');
    eventSourceRef.current = eventSource;
    
    eventSource.onopen = () => {
      setIsConnected(true);
    };
    
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setEvents((prev) => [...prev, data]);
      } catch (err) {
        console.error('Failed to parse SSE event:', err);
      }
    };
    
    eventSource.onerror = () => {
      setIsConnected(false);
    };
    
    return () => {
      eventSource.close();
    };
  }, []);
  
  return { events, isConnected };
}
