# AI Instructions for OffGrid Platform Development

## 🎯 Core Principles

This document provides guidance for AI assistants (GitHub Copilot, Claude, ChatGPT, etc.) working on the OffGrid Platform codebase.

## 🧪 Testing Discipline

### After writing or editing code, always:

1. **Run unit tests** for the affected component:

   - Frontend: `npm test --prefix frontend`
   - AI Service: `pytest ai-service/`
   - WordPress Plugin: `vendor/bin/phpunit --configuration wordpress/plugins/pt-hub/phpunit.xml`

2. **Run Playwright tests**:

   ```bash
   npm run test:e2e --prefix frontend
   ```

3. **If any fail, fix until all are green**:

   - Analyze the error messages
   - Apply minimal, targeted fixes
   - Re-run tests to verify
   - Repeat until all tests pass

4. **Never consider a task complete** until:

   - All `pytest` tests pass
   - All Playwright E2E tests pass
   - Linting passes (ESLint, Ruff, MyPy)
   - Type checking passes
   - Coverage meets ≥ 90% threshold

5. **After success, update TEST_STATUS.md**:
   - Mark tests as ✅ PASSED
   - Record coverage percentage
   - Note any new tests added
   - Document any edge cases discovered

## 🔄 Bug-Fix Loop Protocol

When tests fail:

1. **Diagnose root cause**:

   - Read error messages completely
   - Check stack traces
   - Review changed files
   - Consider dependencies

2. **Apply minimal fix**:

   - Fix only what's broken
   - Don't refactor unrelated code
   - Maintain existing patterns
   - Preserve backward compatibility

3. **Re-run tests**:

   ```bash
   npm test --prefix frontend
   npm run test:e2e --prefix frontend
   pytest ai-service/ --cov
   ```

4. **Repeat until green**:
   - Do not proceed to other tasks
   - Do not skip failing tests
   - Do not disable tests to make them pass
   - Fix the actual issue

## 📝 Code Quality Standards

### Frontend (TypeScript/Next.js)

- **Type Safety**: Use TypeScript strict mode, no `any` types without justification
- **Components**: Functional components with hooks, proper prop typing
- **Testing**: Jest for unit tests, Playwright for E2E
- **Styling**: Tailwind CSS classes, use design system tokens
- **Accessibility**: ARIA labels, semantic HTML, keyboard navigation
- **Performance**: Code splitting, lazy loading, optimized images

### AI Service (Python/FastAPI)

- **Type Hints**: All functions must have type annotations
- **Async**: Use async/await for I/O operations
- **Validation**: Pydantic models for all request/response schemas
- **Error Handling**: Proper HTTP status codes, descriptive error messages
- **Testing**: pytest with async support, minimum 90% coverage
- **Documentation**: Docstrings following Google style

### WordPress Plugin (PHP)

- **WordPress Standards**: Follow WordPress coding standards
- **Security**: Sanitize inputs, escape outputs, nonces for forms
- **Hooks**: Use WordPress hooks system, don't modify core
- **Database**: Use $wpdb for queries, prepare statements
- **i18n**: All strings must be translatable
- **Compatibility**: Test with multisite enabled

## 🚀 Deployment Checklist

Before marking code as deployment-ready:

- [ ] All tests pass (unit, integration, E2E)
- [ ] Code coverage ≥ 90%
- [ ] Linting passes with no warnings
- [ ] Type checking passes
- [ ] Visual regression tests pass
- [ ] Health endpoints return 200
- [ ] Documentation updated
- [ ] CHANGELOG.md updated
- [ ] No console errors in browser
- [ ] No server errors in logs
- [ ] Performance benchmarks met

## 🎨 UI/UX Guidelines

- **Dark Mode**: All components must support dark mode
- **Responsive**: Mobile-first design, test all breakpoints
- **Loading States**: Show skeleton loaders or spinners
- **Error States**: User-friendly error messages
- **Empty States**: Helpful messages when no data
- **Feedback**: Toast notifications for user actions

## 🔐 Security Practices

- **Environment Variables**: Never commit secrets
- **Input Validation**: Validate all user inputs
- **SQL Injection**: Use parameterized queries
- **XSS Protection**: Escape all outputs
- **CSRF**: Use tokens for state-changing operations
- **Rate Limiting**: Implement on all API endpoints
- **Authentication**: Verify tokens, check permissions

## 📚 Documentation Requirements

For every new feature or significant change:

1. **Update README.md** if it affects setup or usage
2. **Add inline comments** for complex logic
3. **Write JSDoc/docstrings** for public APIs
4. **Update API documentation** if endpoints change
5. **Add examples** in code comments
6. **Update TEST_STATUS.md** with test results

## 🔧 Development Workflow

### Before Starting Work

1. Pull latest from main branch
2. Create feature branch: `git checkout -b feature/your-feature`
3. Review relevant documentation
4. Understand existing patterns in codebase

### During Development

1. Write tests first (TDD when appropriate)
2. Implement minimal code to pass tests
3. Refactor while keeping tests green
4. Run linters and formatters frequently
5. Commit small, logical changes

### Before Submitting PR

1. Run full test suite: `make test`
2. Run linters: `make lint`
3. Check coverage: Ensure ≥ 90%
4. Test locally with Docker Compose
5. Update documentation
6. Write descriptive commit messages

## 🐛 Debugging Guidelines

When encountering bugs:

1. **Reproduce reliably**: Create minimal test case
2. **Add failing test**: Write test that demonstrates bug
3. **Fix code**: Make test pass
4. **Verify**: Run full test suite
5. **Document**: Add comment explaining fix if non-obvious

## 📊 Performance Targets

- **Frontend**: First Contentful Paint < 1.5s
- **API**: Response time < 200ms (p95)
- **Database**: Query time < 50ms (p95)
- **Build**: Production build < 2 minutes
- **Tests**: Full suite < 5 minutes

## 🤖 AI-Specific Guidelines

### When Using Copilot Chat

Use this command after making changes:

```
@workspace If any test fails, diagnose root cause, apply minimal fix,
re-run `npm test` and `npm run test:e2e --prefix frontend`.
Repeat until all green. Do not proceed to other tasks until success.
```

### Code Review Checklist

Before accepting AI-generated code:

- [ ] Code follows project patterns
- [ ] Tests are included
- [ ] No security vulnerabilities
- [ ] Performance is acceptable
- [ ] Error handling is present
- [ ] Types are correct
- [ ] Documentation is clear

## ⚠️ Common Pitfalls to Avoid

1. **Don't skip tests**: Always run tests before committing
2. **Don't disable linting rules**: Fix the issue instead
3. **Don't use `any` type**: Provide proper types
4. **Don't ignore warnings**: Treat warnings as errors
5. **Don't commit commented code**: Remove or document
6. **Don't hardcode values**: Use environment variables
7. **Don't break existing APIs**: Maintain compatibility
8. **Don't ignore edge cases**: Test boundary conditions

## 🎓 Learning Resources

- **Next.js**: https://nextjs.org/docs
- **FastAPI**: https://fastapi.tiangolo.com/
- **Playwright**: https://playwright.dev/
- **WordPress**: https://developer.wordpress.org/
- **TypeScript**: https://www.typescriptlang.org/docs/
- **Python**: https://docs.python.org/3/

## 📞 Getting Help

If stuck or uncertain:

1. Check existing code for patterns
2. Review documentation in `/docs`
3. Run tests to understand expected behavior
4. Ask specific questions in PR comments
5. Reference relevant issues or discussions

---

**Remember**: Quality over speed. A working, well-tested feature is worth more than a fast, broken one.
