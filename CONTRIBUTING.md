# Contributing to OffGrid Platform

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Maintain professional communication

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in Issues
2. Create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details (OS, versions, etc.)
   - Screenshots if applicable

### Suggesting Features

1. Check existing feature requests
2. Create a new issue with:
   - Clear description of the feature
   - Use case and benefits
   - Possible implementation approach

### Pull Requests

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes following our coding standards
4. Add tests for new functionality
5. Ensure all tests pass
6. Update documentation
7. Commit with clear messages
8. Push to your fork
9. Create a Pull Request

## Development Setup

See README.md for detailed setup instructions.

## Coding Standards

### Frontend (TypeScript/Next.js)
- Use TypeScript strict mode
- Follow ESLint configuration
- Format code with Prettier
- Write meaningful component and variable names
- Add JSDoc comments for complex functions

### Backend (Python/FastAPI)
- Follow PEP 8 style guide
- Use type hints
- Format with Black
- Lint with Ruff
- Type check with MyPy
- Write docstrings for all functions/classes

### WordPress/PHP
- Follow WordPress coding standards
- Use meaningful variable names
- Comment complex logic
- Sanitize and validate all inputs
- Use WordPress functions where available

## Testing

- Write tests for all new features
- Maintain or improve code coverage
- Run full test suite before submitting PR
- Include both unit and integration tests

## Documentation

- Update README.md for new features
- Add inline comments for complex logic
- Update API documentation
- Include examples where helpful

## Commit Messages

Format: `type(scope): description`

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Test additions or changes
- `chore`: Build process or auxiliary tool changes

Examples:
```
feat(frontend): add dark mode toggle
fix(ai-service): resolve timeout issue
docs(readme): update installation steps
```

## Questions?

Open a discussion in GitHub Discussions or reach out via email.

Thank you for contributing! 🎉
