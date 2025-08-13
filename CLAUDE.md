# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

⚡ **This project uses Yarn for dependency management and Vite for modern build tooling.**

### Package Management
- `yarn install` - Install all dependencies
- `yarn add <package>` - Add new dependency
- `yarn add --dev <package>` - Add new dev dependency

### Build and Development (Modern - Vite)
- `yarn dev` - Start development server with Hot Module Replacement (HMR)
- `yarn build` - Production build with Vite (includes custom asset generation)
- `yarn preview` - Preview production build locally
- `yarn start` - Start the Express server (serves built assets)

### Build and Development (Legacy - Gulp)
- `yarn build:gulp` - Production build via Gulp (legacy, use yarn build instead)
- `yarn build:dev:gulp` - Development build via Gulp (legacy)

### Testing and Quality
- `yarn test` - Run all tests with coverage using AVA test runner
- `yarn lint` - Lint client-side code using ESLint with Airbnb config
- `yarn lint-diff` - Lint only changed files
- `yarn validator` - Validate airport and configuration JSON files

### Development Workflow
- Tests are located in `test/` directory with `.spec.js` extension
- Test configuration uses AVA with Babel transpilation
- Code coverage reports generated with nyc
- ESLint enforces Airbnb JavaScript style guide

## Code Architecture

### Application Structure
This is an HTML5 air traffic control simulator with a modular ES6+ architecture:

**Core Application Flow:**
- `App.js` - Main application entry point, handles airport loading and initialization lifecycle
- `AppController.js` - Root controller coordinating all subsystems
- `index.js` - Application bootstrap and DOM ready handler

**Key Subsystems:**
- **Aircraft System** (`aircraft/`) - Aircraft models, flight management, pilot commands, and strip views
- **Airport System** (`airport/`) - Airport models, runways, airspace, and navigation maps  
- **Traffic Generation** (`trafficGenerator/`) - Spawn patterns, scheduling, and procedural aircraft creation
- **Command System** (`commands/`) - Parsed commands, aircraft commands, and scope commands with validation
- **Canvas Rendering** (`canvas/`) - WebGL/Canvas2D rendering pipeline for radar scope
- **Navigation** (`navigationLibrary/`) - Fixes, airways, procedures, and holds
- **Game Logic** (`game/`) - Scoring, game options, and simulation state

**Data Architecture:**
- Airport configurations in JSON format (`assets/airports/`)
- Aircraft type definitions (`assets/aircraft/`)
- Airline definitions (`assets/airlines/`)
- Navigation procedures and fixes embedded in airport files
- Spawn patterns define traffic generation rules

**Event-Driven Architecture:**
- `EventBus.js` - Central event dispatcher using publish/subscribe pattern
- Controllers communicate via events rather than direct coupling
- Event constants defined in `constants/eventNames.js`

### Build System
- **Gulp-based build pipeline** with tasks for:
  - JavaScript bundling with Browserify and Babel transpilation
  - LESS compilation to CSS with autoprefixer
  - JSON assembly and validation
  - Markdown processing for guides and documentation
  - Asset copying and optimization

### Testing Architecture
- **AVA test runner** with parallel execution
- **Sinon.js** for mocking and stubbing
- **browser-env** for DOM simulation in Node.js tests
- Tests organized by module with corresponding `_mocks/` directories
- Test helpers in `test/testHelpers/` for common setup

### Key Design Patterns
- **MVC Architecture** - Models hold data, Controllers handle logic, Views manage presentation
- **Command Pattern** - Aircraft commands parsed and executed through command objects
- **Observer Pattern** - Event-driven communication between subsystems
- **Factory Pattern** - Dynamic creation of aircraft, spawn patterns, and model sources
- **Collection Pattern** - Consistent interface for managing groups of related objects

### File Organization
- Client code: `src/assets/scripts/client/`
- Server code: `src/assets/scripts/server/`
- Static assets: `assets/` (source) → `public/assets/` (built)
- Build tools: `tools/tasks/`
- Documentation: `documentation/`