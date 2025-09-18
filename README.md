# Protoline Design System

A prototype for an AI-powered design system monorepo built with TypeScript, React, and automated tooling.
As it is a prototype, it is still very basic. The components are intended to be placeholders only, this test is more about the basic pipeline and workflow.

## 🚀 Overview

Protoline is a comprehensive design system that includes:

- **Design Tokens** - Centralized styling foundation with automated builds
- **React Component Library** - Reusable UI components with TypeScript
- **Storybook** - Interactive component documentation and testing
- **Docusaurus** - Comprehensive documentation site
- **AI-Powered Code Generation** - Automated creation of stories, tests, and docs
- **Visual Testing** - Playwright-powered visual regression testing

## 📦 Packages

This monorepo contains the following packages:

- **`@protoline/tokens`** - Design tokens (colors, spacing, typography) built with Style Dictionary
- **`@protoline/ui`** - React component library with TypeScript
- **`@protoline/storybook`** - Storybook configuration with visual testing
- **`docs`** - Docusaurus documentation site

## 🛠️ Tech Stack

- **Monorepo Management**: pnpm workspaces
- **Build System**: tsup, Vite
- **UI Framework**: React 18+
- **Language**: TypeScript 5+
- **Documentation**: Storybook 9, Docusaurus 3
- **Testing**: Vitest, Playwright, React Testing Library
- **Design Tokens**: Style Dictionary
- **AI Integration**: LangChain + OpenAI for code generation

## 📋 Prerequisites

- Node.js 18+
- pnpm 10.15.1+
- OpenAI API key (for code generation features)

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd protoline
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables** (optional, for AI features)
   ```bash
   cp .env.example .env
   # Add your OPENAI_API_KEY to .env
   ```

4. **Start development**
   ```bash
   pnpm dev
   ```

This will start:
- Design tokens watcher (rebuilds on changes)
- Storybook dev server at http://localhost:6006

## 📝 Available Scripts

### Development
- `pnpm dev` - Start tokens watcher + Storybook
- `pnpm storybook` - Run Storybook dev server
- `pnpm docs` - Start Docusaurus dev server
- `pnpm tokens:watch` - Watch and rebuild design tokens

### Building
- `pnpm ci:build` - Build tokens and UI packages
- `pnpm ci:storybook` - Build Storybook for production
- `pnpm ci:docs` - Build documentation site
- `pnpm ci:deploy` - Full production build pipeline

### Testing
- `pnpm ci:test` - Run unit tests and visual tests
- `pnpm ci:test:visual` - Run Playwright visual regression tests

### Code Generation (AI-Powered)
- `pnpm generate:dry` - Preview what files would be generated
- `pnpm generate` - Generate missing stories, tests, and docs for components

## 🎨 Design Tokens

Design tokens are defined in `packages/tokens/tokens.json` and automatically built into:
- CSS custom properties
- TypeScript constants
- Sass variables

The tokens include:
- **Colors**: Primary, secondary, background, text
- **Spacing**: Small, medium, large scales
- **Typography**: Font families, sizes, weights
- **Shadows**: Elevation system

## 🧩 Components

Current components in the UI library:

- **Button** - Interactive button with variants
- **Card** - Content container with styling
- **TokenInspector** - Design token visualization tool

Each component includes:
- TypeScript definitions
- Storybook stories
- Unit tests
- Documentation

## 🤖 AI-Powered Development

This project includes intelligent code generation using OpenAI:

### Automatic File Generation
Run the generator to create missing files for your components:

```bash
# See what would be generated
pnpm generate:dry

# Generate missing stories, tests, and docs
pnpm generate
```

The AI will analyze your component props and generate:
- **Storybook stories** with realistic examples
- **Unit tests** with proper assertions
- **MDX documentation** with usage examples

### Supported Generation
- Storybook CSF 3.0 stories (.stories.tsx)
- Vitest + React Testing Library tests (.test.tsx)
- Docusaurus MDX documentation (.mdx)

## 🧪 Testing

### Unit Testing
- Framework: Vitest + React Testing Library
- Location: `storybook/src/stories/*.test.tsx`
- Command: `pnpm ci:test`

### Visual Testing
- Framework: Playwright + Storybook
- Automated screenshot comparison
- Command: `pnpm ci:test:visual`

## 📚 Documentation

### Storybook
Interactive component documentation at http://localhost:6006

### Docusaurus
Comprehensive docs site with:
- Getting started guides
- Component documentation
- Design token reference
- API documentation

## 🏗️ Project Structure
protoline/
├── packages/
│ ├── tokens/ # Design tokens
│ │ ├── tokens.json # Token definitions
│ │ ├── build.js # Style Dictionary build
│ │ └── dist/ # Generated tokens
│ └── ui/ # React components
│ ├── src/ # Component source
│ └── dist/ # Built components
├── storybook/ # Storybook configuration
│ ├── src/stories/ # Component stories
│ └── tests/ # Visual tests
├── docs/ # Docusaurus site
│ ├── docs/ # Documentation content
│ └── src/ # Site customization
├── scripts/ # Build and generation scripts
│ ├── generate.ts # AI-powered file generation
│ └── generate-missing.ts # Batch generation tool
└── build/ # Production builds
├── storybook/
└── docs/

## 🔧 Configuration

### Package Manager
This project uses pnpm with workspace configuration in `pnpm-workspace.yaml`.

### TypeScript
Shared TypeScript configuration with project-specific overrides.

### ESLint
Consistent linting across all packages with React and accessibility rules.

## 🚀 Deployment

The project includes a complete CI/CD pipeline:

```bash
pnpm ci:deploy
```

This will:
1. Build design tokens
2. Build UI library
3. Build Storybook
4. Run visual tests
5. Build documentation
6. Generate production assets in `build/`

## 🤝 Contributing

1. Create a new component in `packages/ui/src/`
2. Run `pnpm generate` to create stories, tests, and docs
3. Update design tokens if needed in `packages/tokens/tokens.json`
4. Run tests: `pnpm ci:test`
5. Build and verify: `pnpm ci:build`


## 🔗 Links

- [Storybook](http://localhost:6006) - Component playground
- [Documentation](http://localhost:3000) - Full documentation site
- [Design Tokens](./packages/tokens/tokens.json) - Token definitions

---