import { NextRequest, NextResponse } from 'next/server';
import { spawn, exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';

const execAsync = promisify(exec);

export const dynamic = 'force-dynamic';

/**
 * API endpoint for controlling the AI test runner
 * POST /api/ai-testing/control { action: 'start' | 'stop' | 'status' }
 */
export async function POST(request: NextRequest) {
  const { action } = await request.json();
  
  const projectRoot = path.join(process.cwd(), '..');
  const runnerScript = path.join(projectRoot, 'ai_runner_enhanced.py');
  const pidFile = path.join(projectRoot, 'logs', 'runner.pid');
  
  try {
    switch (action) {
      case 'start': {
        // Check if already running
        if (fs.existsSync(pidFile)) {
          const pid = fs.readFileSync(pidFile, 'utf-8').trim();
          try {
            // Check if process exists
            process.kill(parseInt(pid), 0);
            
            // Process exists - read session info
            const sessionFile = path.join(projectRoot, 'logs', 'session.json');
            let sessionInfo = null;
            if (fs.existsSync(sessionFile)) {
              sessionInfo = JSON.parse(fs.readFileSync(sessionFile, 'utf-8'));
            }
            
            return NextResponse.json({ 
              success: true,
              already_running: true,
              message: 'AI runner is already running - connecting to existing session',
              pid: parseInt(pid),
              session: sessionInfo
            });
          } catch {
            // Process doesn't exist, remove stale PID file
            fs.unlinkSync(pidFile);
          }
        }
        
        // Start the runner
        const child = spawn('python', ['ai_runner_enhanced.py'], {
          cwd: projectRoot,
          detached: true,
          stdio: 'ignore'
        });
        
        child.unref();
        
        // Save PID
        fs.mkdirSync(path.dirname(pidFile), { recursive: true });
        fs.writeFileSync(pidFile, child.pid?.toString() || '');
        
        return NextResponse.json({ 
          success: true, 
          message: 'AI runner started',
          pid: child.pid
        });
      }
      
      case 'stop': {
        if (!fs.existsSync(pidFile)) {
          return NextResponse.json({ 
            success: false, 
            message: 'AI runner is not running'
          });
        }
        
        const pid = fs.readFileSync(pidFile, 'utf-8').trim();
        
        try {
          // Kill the process
          if (process.platform === 'win32') {
            await execAsync(`taskkill /PID ${pid} /F /T`);
          } else {
            process.kill(parseInt(pid), 'SIGTERM');
          }
          
          // Remove PID file
          fs.unlinkSync(pidFile);
          
          return NextResponse.json({ 
            success: true, 
            message: 'AI runner stopped'
          });
        } catch (err) {
          return NextResponse.json({ 
            success: false, 
            message: 'Failed to stop AI runner',
            error: String(err)
          });
        }
      }
      
      case 'status': {
        if (!fs.existsSync(pidFile)) {
          return NextResponse.json({ 
            running: false,
            message: 'AI runner is not running'
          });
        }
        
        const pid = fs.readFileSync(pidFile, 'utf-8').trim();
        
        try {
          // Check if process exists
          process.kill(parseInt(pid), 0);
          return NextResponse.json({ 
            running: true,
            pid: parseInt(pid),
            message: 'AI runner is running'
          });
        } catch {
          // Process doesn't exist, remove stale PID file
          fs.unlinkSync(pidFile);
          return NextResponse.json({ 
            running: false,
            message: 'AI runner is not running'
          });
        }
      }
      
      default:
        return NextResponse.json({ 
          success: false, 
          message: 'Invalid action' 
        }, { status: 400 });
    }
  } catch (err) {
    console.error('Control API error:', err);
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error',
      error: String(err)
    });
  }
}

export async function GET() {
  try {
    // Get status
    const pidFile = path.join(process.cwd(), '..', 'logs', 'runner.pid');
    
    if (!fs.existsSync(pidFile)) {
      return NextResponse.json({ 
        running: false,
        message: 'AI runner is not running'
      });
    }
    
    const pid = fs.readFileSync(pidFile, 'utf-8').trim();
    
    try {
      process.kill(parseInt(pid), 0);
      return NextResponse.json({ 
        running: true,
        pid: parseInt(pid),
        message: 'AI runner is running'
      });
    } catch {
      fs.unlinkSync(pidFile);
      return NextResponse.json({ 
        running: false,
        message: 'AI runner is not running'
      });
    }
  } catch (err) {
    console.error('Control GET error:', err);
    return NextResponse.json({ 
      running: false,
      message: 'Error checking status',
      error: String(err)
    });
  }
}
