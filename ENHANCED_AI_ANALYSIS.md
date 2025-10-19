# 🔬 Enhanced AI Testing - Deep Code Analysis

## Two Modes Available

### 1. **Basic Mode** (`ai_runner.py`)
- Simple continuous testing
- AI gets: test JSON + README excerpt
- Good for: Quick feedback, simple issues

### 2. **Enhanced Mode** (`ai_runner_enhanced.py`) 🔥
- **Deep code analysis**
- AI gets: test files + source code + configs + project structure
- Good for: Complex issues, detailed debugging

### 3. **Investigator Mode** (`ai_investigator.py`) 🔬
- **Maximum depth analysis**
- On-demand investigation of specific test runs
- AI interrogates EVERYTHING: all related files, full context
- Good for: Stubborn bugs, comprehensive fixes

## What's Different?

### Basic Mode
```
Test JSON → AI → "Auth test failed, check timeout settings"
```

### Enhanced Mode
```
Test JSON + Failing test files + Related source code + Configs
    → AI → 
"Auth test failed in tests/e2e/auth.spec.ts:42
Root cause: src/app/auth/signin/page.tsx line 58 
  is missing await on signIn() call.

Fix:
- File: src/app/auth/signin/page.tsx
- Line 58: Change `signIn(credentials)` 
  to `await signIn(credentials)`
"
```

### Investigator Mode
```
All of Enhanced Mode + Keyword-based file discovery
    → AI → 
"Complete analysis with:
1. Root cause for each failure
2. Exact code changes needed  
3. Step-by-step fix instructions
4. Test improvements
5. Priority ranking
"
```

## Usage

### Run Enhanced Continuous Loop
```powershell
python ai_runner_enhanced.py
```

**What it does**:
- Runs tests every 15 minutes
- On failure: auto-reads test files, source files, configs
- Calls Ollama with full context
- Saves to `reports/ai_suggestions_enhanced.md`

### Run Deep Investigation (On-Demand)
```powershell
# Investigate most recent test failure
python ai_investigator.py logs/playwright_headless_20250119_143022.json
```

**What it does**:
- Reads test results JSON
- Extracts all failing tests
- Auto-discovers related files by:
  - Test file paths
  - Error messages
  - Keywords in test names
- Reads ALL related:
  - Test files
  - Page components
  - API routes  
  - UI components
  - Config files
- Builds massive context prompt
- Calls Ollama for 5-minute deep analysis
- Saves comprehensive report

## Context Enrichment Details

### What Enhanced Mode Reads

1. **Failing Test Files** - Full content
   ```
   tests/e2e/auth.spec.ts
   tests/e2e/signup.spec.ts
   ```

2. **Related Source Files** - Inferred from test paths
   ```
   src/app/auth/signin/page.tsx
   src/app/auth/signup/page.tsx
   src/components/AuthForm.tsx
   ```

3. **Configuration Files**
   ```
   playwright.config.ts
   next.config.js
   package.json
   tsconfig.json
   ```

4. **Project Structure** - File tree for context
   ```
   frontend/
   ├── src/
   │   ├── app/
   │   │   └── auth/
   │   └── components/
   └── tests/
       └── e2e/
   ```

5. **Error Details**
   - Full error messages
   - Stack traces with file:line
   - Test duration

### What Investigator Mode Adds

6. **Keyword Discovery** - Finds related files by scanning:
   - Test names: "should sign in user" → finds signin files
   - Error messages: "SignInForm" → finds form components
   - Stack traces: file paths → reads those files

7. **Category Organization** - Separates context by:
   - Pages (`src/app/**/page.tsx`)
   - Components (`src/components/**/*.tsx`)
   - API Routes (`src/app/api/**/*.ts`)
   - Library code (`src/lib/**/*.ts`)

8. **Complete Code** - Reads more content per file
   - Basic: 1000-2000 chars
   - Enhanced: 2000-3000 chars
   - Investigator: Full files (up to 3000 chars)

## Prompt Structure

### Basic Prompt (~5KB)
```
Test results JSON
README excerpt
Simple question
```

### Enhanced Prompt (~50KB)
```
Test failures with details
Failing test file contents
Related source files
Config files
Project structure
Specific questions for code fixes
```

### Investigator Prompt (~100KB+)
```
Everything in Enhanced +
All discovered related files
Complete context per category
Detailed investigation checklist
Request for implementation plan
```

## Example Output Comparison

### Basic Mode
```markdown
## Analysis

**Root Cause**: Authentication timeout
**Fix**: Increase timeout in playwright config
**Priority**: Medium
```

### Enhanced Mode
```markdown
## Root Cause Analysis

File: tests/e2e/auth.spec.ts:42
Issue: Missing await on async operation

Related file: src/app/auth/signin/page.tsx:58
The signIn() call is not awaited, causing race condition

## Specific Code Fix

**File**: src/app/auth/signin/page.tsx
**Line**: 58

Current:
```typescript
const result = signIn(credentials);
```

Fixed:
```typescript
const result = await signIn(credentials);
```

**Priority**: High - Blocks authentication flow
```

### Investigator Mode
```markdown
# Comprehensive Investigation Report

## Executive Summary
3 test failures identified across authentication flow.
Root cause: Missing async/await + incorrect error handling.

## Failure 1: Sign In Test
**File**: tests/e2e/auth.spec.ts:42
**Root Cause**: Race condition in signin flow

### Code Analysis
The test expects immediate response, but:
1. src/app/auth/signin/page.tsx:58 - Missing await
2. src/components/AuthForm.tsx:112 - No loading state
3. src/lib/auth.ts:45 - Timeout too short

### Fix Implementation

#### Step 1: Fix async operation
File: src/app/auth/signin/page.tsx
Lines: 56-60

Current:
```typescript
const handleSubmit = (data) => {
  const result = signIn(data);
  if (result.ok) router.push('/dashboard');
}
```

Fixed:
```typescript
const handleSubmit = async (data) => {
  const result = await signIn(data);
  if (result.ok) router.push('/dashboard');
}
```

#### Step 2: Add loading state
File: src/components/AuthForm.tsx
... (continues with detailed fixes)

## Implementation Plan
1. Fix async/await (5 min) - HIGH PRIORITY
2. Add loading states (10 min) - MEDIUM
3. Increase timeout (2 min) - HIGH
4. Update tests (15 min) - MEDIUM

Total estimated time: 32 minutes
```

## Configuration

All three modes use the same config in the scripts:

```python
OLLAMA_MODEL = "qwen2.5"      # AI model
SLEEP_MINUTES = 15            # Enhanced runner only
TEST_DIR = Path("frontend")   # Test location
```

## Tips for Best Results

### 1. Use Right Mode for Task
- **Quick check**: Basic mode
- **Automated monitoring**: Enhanced mode (continuous)
- **Stubborn bug**: Investigator mode (on-demand)

### 2. Improve AI Context
Add to your README:
- Architecture decisions
- Common patterns
- Setup requirements
- Known issues

### 3. Better Test Names
```typescript
// Good - AI can infer related files
test('user can sign in with email and password')

// Bad - AI can't infer context
test('test1')
```

### 4. Structure Matters
Keep related files together:
```
src/app/auth/
  signin/
    page.tsx
  signup/
    page.tsx

tests/e2e/
  auth.spec.ts  ← AI finds both signin & signup files
```

## Limitations

1. **Token Limits** - Very large files may be truncated
2. **Context Window** - Ollama models have limits (~8K-32K tokens)
3. **Inference Quality** - AI might miss some related files
4. **Time** - Deep analysis takes 2-5 minutes

## Troubleshooting

**"Prompt too large"**
→ Reduce file content limits in the scripts

**"AI suggestions are vague"**
→ Use Investigator mode for more context

**"Related files not found"**
→ Check your file naming matches test keywords

**"Analysis timeout"**
→ Increase timeout or use smaller model

## Next Steps

1. **Try Enhanced Mode**:
   ```powershell
   python ai_runner_enhanced.py
   ```

2. **Run Investigation**:
   ```powershell
   python ai_investigator.py logs/latest.json
   ```

3. **Compare Results**: See how much better the AI performs with full context!

---

**Power Level**: Basic < Enhanced < Investigator 🚀  
**Context Depth**: JSON < Code < Everything 🔬  
**Fix Quality**: Generic < Specific < Surgical 🎯
