# Contributing to MindFlow

Thank you for your interest in contributing to MindFlow! This document provides guidelines and information for contributors.

## 🌟 How to Contribute

### Reporting Issues

1. **Check existing issues** first to avoid duplicates
2. **Use the issue template** when creating new issues
3. **Provide detailed information** including:
   - Steps to reproduce
   - Expected vs actual behavior
   - Browser and OS information
   - Screenshots if applicable

### Suggesting Features

1. **Open a feature request** using the appropriate template
2. **Describe the use case** and why it would be valuable
3. **Consider the scope** - keep features focused and well-defined
4. **Be open to discussion** about implementation approaches

### Code Contributions

#### Getting Started

1. **Fork the repository**
2. **Clone your fork** locally
3. **Install dependencies**: `npm install`
4. **Create a feature branch**: `git checkout -b feature/your-feature-name`
5. **Make your changes**
6. **Test thoroughly**
7. **Commit with clear messages**
8. **Push to your fork**
9. **Create a pull request**

#### Development Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/mindflow-app.git
cd mindflow-app

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm run dev
```

#### Code Standards

- **TypeScript**: All new code should be written in TypeScript
- **ESLint**: Follow the existing ESLint configuration
- **Prettier**: Code will be automatically formatted
- **Components**: Use functional components with hooks
- **Styling**: Use Tailwind CSS classes
- **Accessibility**: Ensure all components are accessible

#### File Organization

- Keep components focused and single-purpose
- Use proper TypeScript types
- Follow the existing folder structure
- Add proper imports/exports
- Keep files under 300 lines when possible

#### Testing

- Test your changes thoroughly in both light and dark modes
- Test responsive design on different screen sizes
- Verify accessibility with screen readers
- Test with and without Supabase configuration
- Test error scenarios and edge cases

## 🎨 Design Guidelines

### UI/UX Principles

- **Simplicity**: Keep interfaces clean and uncluttered
- **Consistency**: Follow established patterns and spacing
- **Accessibility**: Ensure proper contrast and keyboard navigation
- **Responsiveness**: Design for all screen sizes
- **Performance**: Optimize for fast loading and smooth interactions

### Visual Design

- Use the established color palette
- Follow the 8px spacing system
- Maintain consistent typography scales
- Use appropriate icons from Lucide React
- Implement smooth transitions and micro-interactions

## 🔧 Technical Guidelines

### React Best Practices

- Use functional components with hooks
- Implement proper error boundaries
- Optimize with useMemo and useCallback when needed
- Handle loading and error states appropriately
- Use proper TypeScript types

### State Management

- Use React Context for global state
- Implement local storage fallbacks
- Handle offline scenarios gracefully
- Optimize for performance with proper memoization

### Database Integration

- Support both local and cloud modes
- Implement proper error handling
- Use optimistic updates for better UX
- Follow Row Level Security best practices

## 📝 Pull Request Process

### Before Submitting

1. **Test thoroughly** on different browsers and devices
2. **Update documentation** if needed
3. **Add or update tests** for new functionality
4. **Ensure no console errors** or warnings
5. **Check accessibility** compliance
6. **Verify responsive design**

### PR Description

Include in your pull request:

- **Clear description** of changes made
- **Screenshots** for UI changes
- **Testing instructions** for reviewers
- **Related issue numbers** if applicable
- **Breaking changes** if any

### Review Process

1. **Automated checks** must pass (linting, building)
2. **Code review** by maintainers
3. **Testing** by reviewers
4. **Approval** required before merging
5. **Squash and merge** for clean history

## 🐛 Bug Reports

### Information to Include

- **Clear title** describing the issue
- **Steps to reproduce** the problem
- **Expected behavior** vs actual behavior
- **Environment details** (browser, OS, device)
- **Screenshots or videos** if helpful
- **Console errors** if any
- **Configuration** (local vs cloud mode)

### Bug Severity

- **Critical**: App crashes, data loss, security issues
- **High**: Major functionality broken
- **Medium**: Minor functionality issues
- **Low**: Cosmetic issues, minor improvements

## 🚀 Feature Requests

### Good Feature Requests

- **Solve a real problem** for users
- **Align with app goals** of mental health and wellness
- **Are well-scoped** and clearly defined
- **Consider implementation complexity**
- **Include use cases** and examples

### Feature Categories

- **Core Features**: Habit tracking, notes, insights
- **Integrations**: Third-party services (Spotify, etc.)
- **UI/UX**: Interface improvements
- **Performance**: Speed and optimization
- **Accessibility**: Better support for all users

## 📚 Documentation

### What to Document

- **New features** and how to use them
- **API changes** and breaking changes
- **Setup instructions** for new integrations
- **Configuration options** and environment variables
- **Troubleshooting guides** for common issues

### Documentation Style

- Use clear, concise language
- Include code examples where helpful
- Add screenshots for UI features
- Keep information up to date
- Consider different user skill levels

## 🤝 Community Guidelines

### Code of Conduct

- **Be respectful** and inclusive
- **Help others** learn and grow
- **Give constructive feedback**
- **Focus on the code**, not the person
- **Celebrate contributions** of all sizes

### Communication

- **Use GitHub issues** for bug reports and feature requests
- **Use pull requests** for code discussions
- **Be patient** with review processes
- **Ask questions** if anything is unclear
- **Share knowledge** and help others

## 🏆 Recognition

Contributors will be recognized in:

- **README.md** contributors section
- **Release notes** for significant contributions
- **GitHub contributors** page
- **Special mentions** for outstanding contributions

## 📞 Getting Help

If you need help:

1. **Check the documentation** first
2. **Search existing issues** for similar problems
3. **Create a new issue** with detailed information
4. **Join community discussions** for general questions
5. **Contact maintainers** for urgent issues

Thank you for contributing to MindFlow and helping make mental health tools more accessible! 🌟