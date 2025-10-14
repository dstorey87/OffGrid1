# Quality Gate Enforcement

## 🚨 IMPORTANT: Do NOT push to main if Quality Gate fails!

This project enforces strict quality gates through GitHub Actions. **You must not push to main unless all checks pass.**

## Local Pre-Push Checklist

Before pushing to `main`, ensure:

1. ✅ All lint checks pass: `npm run lint --prefix frontend`
2. ✅ Type checking passes: `npm run type-check --prefix frontend`
3. ✅ Unit tests pass: `npm test --prefix frontend`
4. ✅ E2E tests pass: `npm run test:e2e --prefix frontend`
5. ✅ Python tests pass: `pytest ai-service/ --cov`
6. ✅ Coverage ≥ 90%

## GitHub Branch Protection (Required)

To prevent failed pushes from reaching main, enable these settings in GitHub:

### Settings → Branches → Branch protection rules → Add rule

**Branch name pattern:** `main`

**Required settings:**

- [x] Require a pull request before merging
  - [x] Require approvals: 1
  - [x] Dismiss stale pull request approvals when new commits are pushed
- [x] Require status checks to pass before merging
  - [x] Require branches to be up to date before merging
  - **Required status checks:**
    - `verify` (from Quality Gate workflow)
    - `frontend-test` (from CI/CD Pipeline)
    - `ai-service-test` (from CI/CD Pipeline)
- [x] Require conversation resolution before merging
- [x] Do not allow bypassing the above settings
- [x] Restrict who can push to matching branches
  - Add only: Service accounts, CI/CD bots

## Workflow

### Development Flow

```bash
# 1. Create feature branch
git checkout -b feature/your-feature

# 2. Make changes and commit
git add .
git commit -m "feat: your changes"

# 3. Run quality checks locally
npm run lint --prefix frontend
npm run type-check --prefix frontend
npm test --prefix frontend
npm run test:e2e --prefix frontend
pytest ai-service/ --cov

# 4. Push feature branch
git push origin feature/your-feature

# 5. Create Pull Request on GitHub
# 6. Wait for Quality Gate to pass ✅
# 7. Get approval
# 8. Merge to main
```

### Emergency Hotfix (Still requires passing tests)

```bash
# 1. Create hotfix branch from main
git checkout main
git pull
git checkout -b hotfix/critical-fix

# 2. Make minimal fix
# 3. Run all quality checks
# 4. Push and create PR
# 5. Wait for Quality Gate ✅
# 6. Merge immediately after approval
```

## What Happens if Quality Gate Fails?

If you push and the Quality Gate fails:

1. **GitHub Actions will show ❌ red X**
2. **You MUST fix the issues immediately**
3. **Do NOT merge the PR**
4. **Run the failing tests locally:**
   ```bash
   npm test --prefix frontend
   npm run test:e2e --prefix frontend
   pytest ai-service/
   ```
5. **Fix the issues until all tests pass**
6. **Commit and push the fixes**
7. **Wait for Quality Gate to turn green ✅**
8. **Only then can you merge**

## Pre-Push Hook (Automated Protection)

A pre-push Git hook is installed at `.git/hooks/pre-push` that runs quality checks before allowing a push. This prevents you from pushing broken code.

**To bypass (NOT RECOMMENDED):**

```bash
git push --no-verify
```

**⚠️ WARNING:** Bypassing the pre-push hook is a violation of the Definition of Done and should only be used in extreme emergencies with team lead approval.

## CI/CD Pipeline Status

You can check the status of your Quality Gate at:

- GitHub Actions tab in the repository
- PR checks section
- Branch protection status

## Enforcement Tools

1. **Local Git Hook:** `.git/hooks/pre-push` - Prevents local pushes with failing tests
2. **GitHub Actions:** `.github/workflows/quality.yaml` - Runs full test suite on push
3. **Branch Protection:** GitHub settings - Prevents merging with failing checks
4. **Required Reviews:** Ensures code review before merge

## Getting Help

If you're stuck with failing tests:

1. Read the error message completely
2. Run the specific failing test locally
3. Check `TEST_STATUS.md` for known issues
4. Review `AI_INSTRUCTIONS.md` for debugging guidelines
5. Ask for help in the team chat with error details

---

**Remember:** The Quality Gate exists to protect production. Never bypass it unless you have explicit approval and understand the risks.
