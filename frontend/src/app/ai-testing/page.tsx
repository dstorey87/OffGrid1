'use client';

import { useAIStream } from '@/hooks/useAIStream';
import { useEffect, useRef, useState } from 'react';
import { CheckCircle2, XCircle, Clock, Play, AlertCircle, StopCircle, Terminal, RefreshCw } from 'lucide-react';

export default function AITestingDashboard() {
  const { events, isConnected } = useAIStream();
  const consoleRef = useRef<HTMLDivElement>(null);
  const logViewerRef = useRef<HTMLDivElement>(null);
  const [testSummary, setTestSummary] = useState<Record<string, any>>({});
  const [currentCycle, setCurrentCycle] = useState(0);
  const [autoScroll, setAutoScroll] = useState(true);
  const [runnerStatus, setRunnerStatus] = useState<'running' | 'stopped' | 'loading'>('loading');
  const [logs, setLogs] = useState<string[]>([]);
  const [showLogs, setShowLogs] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCycle, setSelectedCycle] = useState<number | 'all'>('all');
  const [availableCycles, setAvailableCycles] = useState<number[]>([]);
  
  // Check runner status on mount
  useEffect(() => {
    checkRunnerStatus();
    const interval = setInterval(checkRunnerStatus, 5000);
    return () => clearInterval(interval);
  }, []);
  
  // Auto-scroll console
  useEffect(() => {
    if (autoScroll && consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [events, autoScroll]);
  
  // Auto-scroll log viewer
  useEffect(() => {
    if (autoScroll && logViewerRef.current) {
      logViewerRef.current.scrollTop = logViewerRef.current.scrollHeight;
    }
  }, [logs, autoScroll]);
  
  // Fetch logs periodically
  useEffect(() => {
    if (showLogs) {
      fetchLogs();
      const interval = setInterval(fetchLogs, 2000);
      return () => clearInterval(interval);
    }
    return undefined;
  }, [showLogs]);
  
  const checkRunnerStatus = async () => {
    try {
      const res = await fetch('/api/ai-testing/control');
      if (!res.ok) {
        console.warn('Runner status check failed:', res.status);
        setRunnerStatus('stopped');
        return;
      }
      const data = await res.json();
      setRunnerStatus(data.running ? 'running' : 'stopped');
    } catch (err) {
      console.error('Failed to check runner status:', err);
      setRunnerStatus('stopped');
    }
  };
  
  const startRunner = async () => {
    setRunnerStatus('loading');
    try {
      const res = await fetch('/api/ai-testing/control', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'start' })
      });
      const data = await res.json();
      if (data.success) {
        setRunnerStatus('running');
        if (data.already_running) {
          console.log('Connected to existing session:', data.session);
        }
      } else {
        alert(data.message);
        setRunnerStatus('stopped');
      }
    } catch (err) {
      console.error('Failed to start runner:', err);
      alert('Failed to start AI runner');
      setRunnerStatus('stopped');
    }
  };
  
  const stopRunner = async () => {
    setRunnerStatus('loading');
    try {
      const res = await fetch('/api/ai-testing/control', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'stop' })
      });
      const data = await res.json();
      if (data.success) {
        setRunnerStatus('stopped');
      } else {
        alert(data.message);
        setRunnerStatus('running');
      }
    } catch (err) {
      console.error('Failed to stop runner:', err);
      alert('Failed to stop AI runner');
      setRunnerStatus('running');
    }
  };
  
  const fetchLogs = async () => {
    try {
      const response = await fetch('/api/ai-testing/logs?type=runner&tail=200');
      if (!response.ok) {
        console.warn('Logs API returned non-OK:', response.status);
        return;
      }
      const data = await response.json();
      if (data.lines) {
        setLogs(data.lines);
      }
    } catch (err) {
      console.error('Failed to fetch logs:', err);
    }
  };
  
  // Build test summary from events
  useEffect(() => {
    const summary: Record<string, any> = {};
    const cycles = new Set<number>();
    
    for (const event of events) {
      if (event.type === 'cycle_start') {
        setCurrentCycle(event.cycle || 0);
        if (event.cycle) cycles.add(event.cycle);
      }
      
      if (event.type === 'test_complete' && event.test_name) {
        if (!summary[event.test_name]) {
          summary[event.test_name] = [];
        }
        summary[event.test_name].push(event);
      }
      
      if (event.type === 'ai_rca' && event.test_name) {
        const tests = summary[event.test_name] || [];
        const lastTest = tests[tests.length - 1];
        if (lastTest) {
          lastTest.rca = event.analysis;
        }
      }
      
      if (event.type === 'ai_fix' && event.test_name) {
        const tests = summary[event.test_name] || [];
        const lastTest = tests[tests.length - 1];
        if (lastTest) {
          lastTest.fix = event.fix;
        }
      }
    }
    
    setTestSummary(summary);
    const cycleArray = Array.from(cycles).sort((a, b) => b - a);
    setAvailableCycles(cycleArray);
    // Default to latest cycle if not already selected
    if (selectedCycle === 'all' && cycleArray.length > 0) {
      setSelectedCycle(cycleArray[0]);
    }
  }, [events]);
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'running':
        return <Clock className="w-5 h-5 text-yellow-500 animate-spin" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };
  
  const getEventColor = (type: string) => {
    switch (type) {
      case 'test_discovered':
        return 'text-blue-300';
      case 'test_execution_start':
        return 'text-cyan-300';
      case 'test_output':
        return 'text-gray-300';
      case 'test_complete':
        return 'text-blue-400';
      case 'ai_prompt':
        return 'text-yellow-400';
      case 'ai_thinking':
        return 'text-purple-400';
      case 'ai_response_chunk':
        return 'text-green-300';
      case 'ai_full_response':
        return 'text-green-500 font-semibold';
      case 'ai_rca':
        return 'text-orange-400';
      case 'ai_fix':
        return 'text-green-400';
      case 'error':
        return 'text-red-400';
      case 'cycle_start':
        return 'text-cyan-500 font-semibold';
      case 'cycle_complete':
        return 'text-cyan-400 font-semibold';
      default:
        return 'text-gray-400';
    }
  };
  
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'test_discovered':
        return '🔍';
      case 'test_execution_start':
        return '▶️';
      case 'test_output':
        return '📄';
      case 'ai_prompt':
        return '📤';
      case 'ai_thinking':
        return '💭';
      case 'ai_response_chunk':
        return '💬';
      case 'ai_full_response':
        return '✅';
      case 'error':
        return '❌';
      case 'cycle_start':
        return '🔄';
      case 'cycle_complete':
        return '✨';
      default:
        return '•';
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">AI Testing Dashboard</h1>
            <p className="text-gray-400">Real-time autonomous test monitoring</p>
          </div>
          <div className="flex items-center gap-4">
            {/* Control Panel */}
            <div className="flex items-center gap-2">
              {runnerStatus === 'stopped' && (
                <button
                  onClick={startRunner}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors"
                >
                  <Play className="w-4 h-4" />
                  Start AI Runner
                </button>
              )}
              {runnerStatus === 'running' && (
                <button
                  onClick={stopRunner}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors"
                >
                  <StopCircle className="w-4 h-4" />
                  Stop Runner
                </button>
              )}
              {runnerStatus === 'loading' && (
                <button
                  disabled
                  className="px-4 py-2 bg-gray-600 rounded-lg flex items-center gap-2 text-sm font-medium opacity-50 cursor-not-allowed"
                >
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Loading...
                </button>
              )}
              
              <button
                onClick={() => setShowLogs(!showLogs)}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors ${
                  showLogs ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                <Terminal className="w-4 h-4" />
                {showLogs ? 'Hide Logs' : 'Show Logs'}
              </button>
            </div>
            
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
              <span className="text-sm">{isConnected ? 'Connected' : 'Disconnected'}</span>
            </div>
            <div className="px-4 py-2 bg-gray-800 rounded-lg">
              <span className="text-sm text-gray-400">Cycle</span>
              <span className="ml-2 text-xl font-bold text-cyan-400">#{currentCycle}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Log Viewer - Collapsible */}
      {showLogs && (
        <div className="max-w-7xl mx-auto mb-6">
          <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
            <div className="px-4 py-3 bg-gray-800 border-b border-gray-700">
              <h2 className="font-semibold">Full Runner Logs</h2>
            </div>
            <div
              ref={logViewerRef}
              className="h-[300px] overflow-y-auto p-4 font-mono text-xs space-y-0.5 bg-black"
            >
              {logs.length === 0 && (
                <div className="text-gray-500 text-center py-10">
                  No logs available yet
                </div>
              )}
              {logs.map((line, idx) => (
                <div key={idx} className="text-gray-300 whitespace-pre-wrap">
                  {line}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Console - Takes 2 columns */}
        <div className="lg:col-span-2">
          <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-gray-800 border-b border-gray-700">
              <div className="flex items-center gap-2">
                <Play className="w-4 h-4 text-green-500" />
                <h2 className="font-semibold">Live AI Console</h2>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={autoScroll}
                  onChange={(e) => setAutoScroll(e.target.checked)}
                  className="rounded"
                />
                Auto-scroll
              </label>
            </div>
            
            <div
              ref={consoleRef}
              className="h-[600px] overflow-y-auto p-4 font-mono text-sm space-y-1"
            >
              {events.length === 0 && (
                <div className="text-gray-500 text-center py-20">
                  Waiting for AI runner to start...
                </div>
              )}
              
              {events.map((event, idx) => {
                // Special handling for different event types
                const isCodeOutput = event.type === 'test_output' || event.type === 'ai_response_chunk';
                const isImportant = ['cycle_start', 'cycle_complete', 'ai_full_response', 'ai_prompt'].includes(event.type);
                
                return (
                  <div 
                    key={idx} 
                    className={`flex gap-3 px-2 py-1 rounded ${isImportant ? 'bg-gray-800/70 border-l-2 border-cyan-500' : 'hover:bg-gray-800/30'}`}
                  >
                    <span className="text-gray-600 text-xs flex-shrink-0 w-20">
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </span>
                    <span className="flex-shrink-0 text-lg w-6">
                      {getEventIcon(event.type)}
                    </span>
                    <span className={`flex-shrink-0 min-w-[140px] ${getEventColor(event.type)}`}>
                      [{event.type}]
                    </span>
                    <div className="flex-1 min-w-0">
                      {/* Show message or specific fields */}
                      {event.message && (
                        <div className={isCodeOutput ? 'text-gray-400 font-mono text-xs' : 'text-gray-200'}>
                          {event.message}
                        </div>
                      )}
                      
                      {/* Show prompt preview for ai_prompt events */}
                      {event.type === 'ai_prompt' && event.prompt && (
                        <details className="mt-1">
                          <summary className="cursor-pointer text-xs text-gray-500 hover:text-gray-300">
                            View full prompt ({event.full_length} chars)
                          </summary>
                          <pre className="mt-2 p-2 bg-black rounded text-xs text-gray-300 overflow-x-auto whitespace-pre-wrap">
                            {event.prompt}
                          </pre>
                        </details>
                      )}
                      
                      {/* Show chunk for streaming AI responses */}
                      {event.type === 'ai_response_chunk' && event.chunk && (
                        <div className="text-green-300 whitespace-pre-wrap">
                          {event.chunk}
                        </div>
                      )}
                      
                      {/* Show full response */}
                      {event.type === 'ai_full_response' && event.response && (
                        <details className="mt-1">
                          <summary className="cursor-pointer text-xs text-green-400 hover:text-green-300">
                            View complete AI analysis ({event.length} chars)
                          </summary>
                          <pre className="mt-2 p-3 bg-black rounded text-xs text-gray-200 overflow-x-auto whitespace-pre-wrap max-h-96 overflow-y-auto">
                            {event.response}
                          </pre>
                        </details>
                      )}
                      
                      {/* Show test info */}
                      {event.test && (
                        <div className="text-sm text-gray-400">
                          {event.test} {event.file && <span className="text-xs">({event.file})</span>}
                        </div>
                      )}
                      
                      {/* Show output */}
                      {event.output && !event.message && (
                        <div className="text-xs text-gray-400 font-mono whitespace-pre-wrap">
                          {event.output}
                        </div>
                      )}
                      
                      {/* Show analysis/fix */}
                      {event.analysis && (
                        <div className="text-sm text-orange-300 mt-1">{event.analysis}</div>
                      )}
                      {event.fix && (
                        <div className="text-sm text-green-300 mt-1">{event.fix}</div>
                      )}
                      
                      {/* Show error details */}
                      {event.details && event.type === 'error' && (
                        <div className="text-xs text-red-300 mt-1 font-mono">{event.details}</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Test Summary - Takes 1 column */}
        <div>
          <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
            <div className="px-4 py-3 bg-gray-800 border-b border-gray-700">
              <h2 className="font-semibold mb-3">Test Results</h2>
              
              {/* Search and Filter Controls */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Search tests..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-gray-900 border border-gray-700 rounded text-sm focus:outline-none focus:border-blue-500"
                />
                <select
                  value={selectedCycle}
                  onChange={(e) => setSelectedCycle(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
                  className="px-3 py-1.5 bg-gray-900 border border-gray-700 rounded text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value={availableCycles[0] || 'all'}>Latest Cycle {availableCycles[0] ? `#${availableCycles[0]}` : ''}</option>
                  {availableCycles.slice(1).map(cycle => (
                    <option key={cycle} value={cycle}>Cycle #{cycle}</option>
                  ))}
                  <option value="all">All Cycles</option>
                </select>
              </div>
            </div>
            
            <div className="h-[600px] overflow-y-auto">
              {Object.keys(testSummary).length === 0 && (
                <div className="text-gray-500 text-center py-20 text-sm">
                  No tests run yet
                </div>
              )}
              
              {/* Test Results Table */}
              {Object.keys(testSummary).length > 0 && (
                <table className="w-full text-sm">
                  <thead className="bg-gray-800 sticky top-0">
                    <tr className="text-left text-xs text-gray-400 uppercase">
                      <th className="px-4 py-2 font-medium">Status</th>
                      <th className="px-4 py-2 font-medium">Test Name</th>
                      <th className="px-4 py-2 font-medium text-center">Cycle</th>
                      <th className="px-4 py-2 font-medium text-right">Duration</th>
                      <th className="px-4 py-2 font-medium text-center">AI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {Object.entries(testSummary)
                      .filter(([testName]) => 
                        searchQuery === '' || testName.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .flatMap(([testName, results]: [string, any]) => 
                        results
                          .filter((result: any) => 
                            selectedCycle === 'all' || result.cycle === selectedCycle
                          )
                          .map((result: any, idx: number) => ((
                            <tr key={`${testName}-${result.cycle}-${idx}`} className="hover:bg-gray-800/50">
                              <td className="px-4 py-3">
                                {getStatusIcon(result.status)}
                              </td>
                              <td className="px-4 py-3">
                                <div className="font-medium text-gray-200">{testName}</div>
                                {result.file && (
                                  <div className="text-xs text-gray-500 mt-0.5">{result.file}</div>
                                )}
                              </td>
                              <td className="px-4 py-3 text-center text-gray-400">
                                #{result.cycle || currentCycle}
                              </td>
                              <td className="px-4 py-3 text-right text-gray-400">
                                {result.duration_ms ? `${result.duration_ms}ms` : '-'}
                              </td>
                              <td className="px-4 py-3 text-center">
                                {(result.rca || result.fix) && (
                                  <button
                                    onClick={() => {
                                      // TODO: Show AI analysis modal
                                    }}
                                    className="text-xs px-2 py-1 bg-purple-500/20 text-purple-300 rounded hover:bg-purple-500/30"
                                  >
                                    View
                                  </button>
                                )}
                              </td>
                            </tr>
                          )))
                      )
                    }
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Logs Viewer (if shown) */}
      {showLogs && (
        <div className="mt-6 bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
          <div className="px-4 py-3 bg-gray-800 border-b border-gray-700 flex justify-between items-center">
            <h2 className="font-semibold">Runner Logs</h2>
            <button
              onClick={() => setShowLogs(false)}
              className="text-xs text-gray-400 hover:text-gray-200"
            >
              Close
            </button>
          </div>
          <div 
            ref={logViewerRef}
            className="h-64 overflow-y-auto p-4 bg-black font-mono text-xs"
          >
            {logs.map((line, i) => (
              <div key={i} className="text-gray-300">{line}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
