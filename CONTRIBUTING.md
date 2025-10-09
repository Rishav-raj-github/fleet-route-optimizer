# Contributing to Fleet Route Optimizer

🎉 **Thank you for your interest in contributing to Fleet Route Optimizer!** 

We're building the most comprehensive open-source fleet management platform, and we need talented developers, researchers, and domain experts to help make it happen.

## 🌟 Ways to Contribute

### 🔧 Code Contributions
- **Algorithm Improvements**: Enhance VRP solvers, implement new optimization techniques
- **Frontend Development**: Improve React dashboard, add new visualizations
- **Backend Development**: Optimize APIs, add new microservices
- **Mobile Development**: Build React Native companion app
- **DevOps**: Improve Docker setup, CI/CD, monitoring

### 📚 Documentation
- **API Documentation**: Improve endpoint descriptions and examples
- **Tutorials**: Create step-by-step guides for common use cases
- **Algorithm Explanations**: Document optimization techniques
- **Deployment Guides**: Help others deploy in different environments

### 🧪 Testing & Quality
- **Test Coverage**: Add unit tests, integration tests, E2E tests
- **Performance Testing**: Load testing, benchmarking
- **Bug Reports**: Help identify and fix issues
- **Code Reviews**: Review pull requests from other contributors

### 🎨 Design & UX
- **UI/UX Design**: Improve dashboard interface and user experience
- **Data Visualization**: Create better charts and fleet analytics
- **Mobile Design**: Design responsive mobile interfaces

## 🚀 Getting Started

### 1. Fork and Clone
```bash
# Fork the repository on GitHub, then clone your fork
git clone https://github.com/vkondepati/fleet-route-optimizer.git
cd fleet-route-optimizer

# Add upstream remote
git remote add upstream https://github.com/vkondepati/fleet-route-optimizer.git
```

### 2. Set Up Development Environment
```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env
# Edit .env with your configuration

# Set up database (requires PostgreSQL and Redis)
npm run db:setup

# Start development server
npm run dev
```

### 3. Run Tests
```bash
# Run all tests
npm test

# Run specific test types
npm run test:unit
npm run test:integration
npm run test:e2e

# Run with coverage
npm run test:coverage
```

## 📝 Development Guidelines

### Code Style
- **TypeScript**: All new code should be written in TypeScript
- **ESLint**: We use ESLint with strict rules - run `npm run lint`
- **Prettier**: Code formatting is handled automatically
- **Naming**: Use descriptive variable names, follow camelCase conventions

### Git Workflow
1. **Create Feature Branch**: `git checkout -b feature/your-feature-name`
2. **Make Changes**: Write code, add tests, update documentation
3. **Test Thoroughly**: Ensure all tests pass
4. **Commit with Convention**: Use [Conventional Commits](https://conventionalcommits.org/)
5. **Push and PR**: Push to your fork and create a pull request

### Commit Message Format
```
type(scope): description

[optional body]

[optional footer]
```

**Examples:**
- `feat(vrp): add simulated annealing algorithm`
- `fix(api): resolve GPS coordinate validation bug`
- `docs(readme): update installation instructions`
- `test(routing): add unit tests for A* pathfinding`

### Pull Request Guidelines
- **Clear Title**: Describe what your PR accomplishes
- **Detailed Description**: Explain the changes and why they're needed
- **Link Issues**: Reference related issues with `Fixes #123`
- **Add Tests**: Include tests for new functionality
- **Update Docs**: Update relevant documentation
- **Small PRs**: Keep changes focused and reviewable

## 🏗️ Project Structure

```
fleet-route-optimizer/
├── src/
│   ├── api/                    # Node.js backend API
│   ├── web/                    # React frontend
│   ├── algorithms/             # Core optimization algorithms
│   ├── types/                  # TypeScript type definitions
│   └── utils/                  # Shared utilities
├── tests/
│   ├── unit/                   # Unit tests
│   ├── integration/            # Integration tests
│   ├── e2e/                    # End-to-end tests
│   └── performance/            # Performance tests
├── docs/                       # Documentation
├── docker/                     # Docker configuration
└── scripts/                    # Build and deployment scripts
```

### Key Files to Know
- `openroute-types.ts`: Core type definitions
- `openroute-vrp.ts`: Vehicle Routing Problem solver
- `openroute-astar.ts`: A* pathfinding algorithm
- `openroute-realtime-tracker.ts`: Real-time GPS tracking
- `real-time-tracking-component.tsx`: React dashboard component

## 🧪 Testing Strategy

### Unit Tests
- **Coverage Target**: 90%+ for new code
- **Focus**: Individual functions and classes
- **Location**: `tests/unit/`
- **Run**: `npm run test:unit`

### Integration Tests
- **Focus**: API endpoints, database operations
- **Location**: `tests/integration/`
- **Run**: `npm run test:integration`

### E2E Tests
- **Focus**: Complete user workflows
- **Tool**: Cypress
- **Location**: `tests/e2e/`
- **Run**: `npm run test:e2e`

### Performance Tests
- **Focus**: Load testing, optimization benchmarks
- **Tool**: Artillery
- **Location**: `tests/performance/`
- **Run**: `npm run test:performance`

## 🏷️ Good First Issues

Perfect for new contributors:

- [ ] **Add vehicle type icons** - Design SVG icons for different vehicle types
- [ ] **Implement dark mode** - Add theme switching to React dashboard  
- [ ] **Add route export** - Allow users to export routes as GPX/KML
- [ ] **Create API rate limiting** - Implement Express rate limiting middleware
- [ ] **Add unit tests for utilities** - Test geographic helper functions
- [ ] **Improve error messages** - Make API error responses more user-friendly
- [ ] **Add delivery time windows** - Support time-constrained deliveries
- [ ] **Create Docker healthchecks** - Add container health monitoring

## 🎓 Learning Resources

### Algorithm Resources
- [Vehicle Routing Problem Guide](docs/algorithms/vrp-guide.md)
- [A* Pathfinding Explained](docs/algorithms/astar-explained.md)
- [Optimization Techniques](docs/algorithms/optimization-techniques.md)

### Development Resources
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Documentation](https://reactjs.org/docs/)
- [Leaflet API Reference](https://leafletjs.com/reference.html)
- [PostgreSQL + PostGIS Guide](docs/database/postgis-guide.md)

## 🏆 Recognition

### Contributors Hall of Fame
We recognize contributors in multiple ways:
- **GitHub Contributors Page**: Automatic recognition
- **Monthly Newsletter**: Feature outstanding contributions
- **Conference Talks**: Opportunity to present your work
- **Recommendation Letters**: For job applications or academic pursuits

### Contributor Levels
- **🌱 New Contributor**: First merged PR
- **🌿 Regular Contributor**: 5+ merged PRs
- **🌳 Core Contributor**: 20+ PRs, domain expertise
- **⭐ Maintainer**: Trusted with repository access

## 🤝 Community Guidelines

### Be Respectful
- Use inclusive language
- Respect different perspectives and experience levels
- Provide constructive feedback
- Help newcomers feel welcome

### Collaboration Best Practices
- **Ask Questions**: No question is too basic
- **Share Knowledge**: Help others learn
- **Review Code**: Provide thoughtful code reviews
- **Communicate Clearly**: Be specific in issues and PRs

### Code of Conduct
We follow the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you agree to uphold this code.

## 📞 Getting Help

### Communication Channels
- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: General questions and community discussion
- **Discord**: [Real-time chat](https://discord.gg/fleet-optimizer)
- **Email**: maintainers@fleet-optimizer.dev

### Weekly Office Hours
Join our maintainers for live Q&A sessions:
- **When**: Fridays 3-4 PM UTC
- **Where**: Discord voice chat
- **What**: Code reviews, architecture discussions, mentoring

## 📋 Issue Labels

We use labels to organize and prioritize issues:

- `good first issue`: Perfect for newcomers
- `help wanted`: We need community help
- `bug`: Something isn't working
- `enhancement`: New feature or improvement
- `documentation`: Documentation improvements
- `performance`: Performance-related issues
- `algorithm`: Algorithm improvements
- `frontend`: React/UI related
- `backend`: API/server related
- `testing`: Test improvements needed

## 🎯 Roadmap

### Q1 2024
- [ ] Machine learning-based demand prediction
- [ ] Multi-depot route optimization
- [ ] Advanced fleet analytics dashboard
- [ ] Mobile app for drivers

### Q2 2024
- [ ] Integration with major map providers (Google, Mapbox)
- [ ] Electric vehicle range optimization
- [ ] Real-time traffic integration
- [ ] Driver behavior analytics

### Q3 2024
- [ ] AI-powered route suggestions
- [ ] Advanced reporting and BI
- [ ] Multi-tenant SaaS platform
- [ ] API marketplace for integrations

## 📜 License

By contributing to Fleet Route Optimizer, you agree that your contributions will be licensed under the [MIT License](LICENSE).

---

**Ready to contribute?** 🚀 Check out our [good first issues](https://github.com/vkondepati/fleet-route-optimizer/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) and join our [Discord community](https://discord.gg/fleet-optimizer)!

Thank you for helping build the future of fleet optimization! 🙏

After you've made sure that you've found a new Leaflet bug,
here are some tips for creating a helpful report that will make fixing it much easier and quicker:

 * Write a **descriptive, specific title**. Bad: *Problem with polylines*. Good: *Doing X in IE9 causes Z*.
 * Include **browser, OS and Leaflet version** info in the description.
 * Create a **simple test case** that demonstrates the bug (e.g. using [Leaflet plunker](http://leafletjs.com/edit.html)).
 * Check whether the bug can be reproduced in **other browsers**.
 * Check if the bug occurs in the stable version, main, or both.
 * *Bonus tip:* if the bug only appears in the main version but the stable version is fine,
   use `git bisect` to find the exact commit that introduced the bug.

If you just want some help with your project,
try asking on [Stack Overflow](https://stackoverflow.com/questions/tagged/leaflet)
or [GIS Stack Exchange](https://gis.stackexchange.com/questions/tagged/leaflet) instead.

## Contributing Code

### Considerations for Accepting Patches

While we happily accept patches, we're also committed to keeping Leaflet simple, lightweight and blazingly fast.
So bugfixes, performance optimizations and small improvements that don't add a lot of code
are much more likely to get accepted quickly.

Before sending a pull request with a new feature, check if it's been discussed before already
on [GitHub issues](https://github.com/Leaflet/Leaflet/issues)
and ask yourself two questions:

 1. Are you sure that this new feature is important enough to justify its presence in the Leaflet core?
    Or will it look better as a plugin in a separate repository?
 2. Is it written in a simple, concise way that doesn't add bulk to the codebase?

If your feature or API improvement did get merged into main,
please consider submitting another pull request with the corresponding [documentation update](#improving-documentation).

### Setting up the Build System

The Leaflet build system uses [NodeJS](http://nodejs.org/).
To set up the Leaflet build system, install [NodeJS](https://nodejs.org/).
Then run the following commands in the project root to install dependencies:

```
npm install
```
or, if you prefer [`yarn`](https://yarnpkg.com/) over `npm`:
```
yarn install
```

### Making Changes to Leaflet Source

If you're not yet familiar with the way GitHub works (forking, pull requests, etc.),
be sure to check out the awesome [article about forking](https://help.github.com/articles/fork-a-repo)
on the GitHub Help website &mdash; it will get you started quickly.

You should always write each batch of changes (feature, bugfix, etc.) in **its own topic branch**.
Please do not commit to the `main` branch of your fork — otherwise your unrelated changes will go into the same pull request.

You should also follow the code style and whitespace conventions of the original codebase.
In particular, use tabs for indentation and spaces for alignment.

Before committing your changes, run `npm run lint` to catch any JS errors in the code and fix them. 
The same command is automatically executed while committing. 
You can prevent it from execution with the git flag `--no-verify`: `git commit -m "WIP" --no-verify`.  

Also, please make sure that you have [line endings configured properly](https://help.github.com/articles/dealing-with-line-endings) in Git! Otherwise the diff will show that all lines of a file were changed even if you touched only one.

Happy coding!

### Building Leaflet

The source JavaScript code for Leaflet is a few dozen files, in the `src/` directory.
But normally, Leaflet is loaded in a web browser as just one JavaScript file.

In order to create this file, run `npm run build` or `yarn run build`.

You'll find `dist/leaflet-src.js` and `dist/leaflet.js`. The difference is that
`dist/leaflet-src.js` has sourcemaps and it's not uglified, so it's better for
development. `dist/leaflet.js` is uglified and thus is smaller, so it's better
for deployment.

When developing (or bugfixing) core Leaflet functionalities, it's common to use
the webpages in the `debug/` directory, and run the tests
in a graphical browser. This requires regenerating the bundled files quickly.

In order to do so, run `npm run watch` or `yarn run watch`. This will keep
on rebuilding the bundles whenever any source file changes.

## Running the Tests

Before running the tests, make sure that the source code has been built (as mentioned above). If you want to run the tests in the background while working on Leaflet, it is recommended you run the build in `watch` mode. This way the tests will automatically re-run when changes to the source code are made. 

To run the tests from the command line, ensure you have [Google Chrome](https://www.google.com/chrome/) installed and then run:

```
npm test
```

By default the tests will run in Google Chrome headlessly (without a UI), to run the tests in other browsers you can pass in the [`--browsers`](https://karma-runner.github.io/latest/config/configuration-file.html#browsers) flag.

```
npm test -- --browsers Firefox
```

For a list of available browsers see the documentation of the included launcher plugins:
- [`karma-chrome-launcher`](https://github.com/karma-runner/karma-chrome-launcher#available-browsers)
- [`karma-firefox-launcher`](https://github.com/karma-runner/karma-firefox-launcher#configuration)
- [`karma-safarinative-launcher`](https://github.com/muthu90ec/karma-safarinative-launcher#readme)

## Improving Documentation

The code of the live Leaflet website that contains all documentation and examples is located in the `docs/` directory of the `main` branch
and is automatically generated from a set of HTML and Markdown files by [Jekyll](http://jekyllrb.com/).

The easiest way to make little improvements such as fixing typos without even leaving the browser
is by editing one of the files with the online GitHub editor:
browse the [`docs/ directory`](https://github.com/Leaflet/Leaflet/tree/main/docs),
choose a certain file for editing, click the Edit button, make changes and follow instructions from there.
Once it gets merged, the changes will immediately appear on the website.

To work on the documentation locally ensure you have Ruby installed. You can download it from the [Ruby website](https://www.ruby-lang.org/en/downloads/) or use [`rbenv`](https://github.com/rbenv/rbenv) (recommended).

You'll need to install the same Ruby version as specified in [`.ruby-version`](./docs/.ruby-version). If you are using `rbenv` you can install this by running `rbenv install` from the `docs/` directory.

If you need to make edits in a local repository to see how it looks in the process, do the following:

1. Open a terminal in the `docs/` directory.
2. Make sure you are on the `main` branch by running `git checkout main`.
3. Run `bundle install` to install the dependencies.
4. Run `npm run serve` to serve the documentation.
5. Open [http://localhost:4000](http://localhost:4000) in your web browser.

Now any file changes in `docs/` will be applied when you reload pages.
After committing the changes, just send a pull request.

### API documentation

Since Leaflet 1.0.0-rc1, the API documentation in `reference-1.0.0.html` is handled
via [Leafdoc](https://github.com/Leaflet/Leafdoc). This means that next to the
code for every method, option or property there is a special code comment documenting
that feature. In order to edit the API documentation, just edit these comments in the
source code.

In order to generate the documentation, make sure that the development dependencies
are installed (run either `npm install` or `yarn install`), then just run

```
npm run docs
```

and you'll find a `.html` file in the `dist/` directory.

On every release of a new Leaflet version, this file will be generated and copied
over to `docs/reference.html` - there is no need to send pull requests with changes to this file to update the API documentation.

## Code of Conduct

Everyone is invited to participate in the Leaflet community and related projects:
we want to create a welcoming and friendly environment.
Harassment of participants or other unethical and unprofessional behavior will not be tolerated in our spaces.
The [Contributor Covenant](CODE_OF_CONDUCT.md)
applies to all projects under the Leaflet organization.
Report any issues to agafonkin@gmail.com or ivan@sanchezortega.es.

## Thank You

Not only does your contribution to Leaflet and its community earn our gratitude, but it also makes you AWESOME.
Join [this approved list of awesome people](https://github.com/Leaflet/Leaflet/graphs/contributors)
and help us push the limits of what's possible with online maps!
