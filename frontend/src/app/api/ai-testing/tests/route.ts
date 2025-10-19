import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

/**
 * API endpoint for fetching test results
 */
export async function GET(request: NextRequest) {
  const resultsFile = path.join(process.cwd(), '..', 'logs', 'test_results.json');
  
  if (!existsSync(resultsFile)) {
    return NextResponse.json({
      last_updated: null,
      total_cycles: 0,
      results: []
    });
  }
  
  try {
    const content = await readFile(resultsFile, 'utf-8');
    const data = JSON.parse(content);
    
    // Support filtering by cycle
    const cycleParam = request.nextUrl.searchParams.get('cycle');
    if (cycleParam) {
      const cycle = parseInt(cycleParam);
      data.results = data.results.filter((r: any) => r.cycle === cycle);
    }
    
    return NextResponse.json(data);
  } catch (err) {
    console.error('Error reading results file:', err);
    return NextResponse.json(
      { error: 'Failed to read test results' },
      { status: 500 }
    );
  }
}
