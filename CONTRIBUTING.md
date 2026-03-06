# Contributing to webext-event-bus

Thank you for your interest in contributing.

## Reporting Issues

Before opening an issue, please check if it already exists. When reporting a bug, include:

- A clear description of the problem
- Steps to reproduce the issue
- Your environment (Node.js version, browser, OS)
- Any relevant code samples or error messages

For feature requests, explain the use case and desired behavior.

## Development Workflow

1. Fork the repository
2. Clone your fork locally
3. Create a feature branch from `main`
4. Make your changes
5. Ensure tests pass
6. Push to your fork and submit a pull request

```bash
git clone https://github.com/theluckystrike/webext-event-bus.git
cd webext-event-bus
npm install
npm test
```

## Code Style

- Use TypeScript with strict mode enabled
- Follow the existing code patterns in the repository
- Use meaningful variable and function names
- Add JSDoc comments for public APIs
- Keep functions focused and small

## Testing

Run tests before submitting changes:

```bash
npm test
```

Add tests for new functionality. Ensure all existing tests continue to pass.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
