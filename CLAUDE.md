# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development Commands
- `npm run lint` - Run ESLint for code linting
- `npm run lint:fix` - Run ESLint with automatic fixes
- `npm run test` - Run Jest tests with experimental VM modules support

### Testing the CLI Tool
- `npx openapi-generate-html -i openapi.json` - Generate HTML from OpenAPI spec
- `npx openapi-generate-html -i openapi.json --theme=dark` - Generate with dark theme
- `npx openapi-generate-html -i openapi.json --ui=swagger --output=custom.html` - Generate with Swagger UI

## Architecture

This is a Node.js CLI tool that generates standalone HTML documentation from OpenAPI specifications. The tool creates self-contained HTML files with all assets embedded.

### Core Components

**Main Entry Point (`src/index.js`)**
- CLI argument parsing using Commander.js
- Interactive prompts using Inquirer.js
- Three-phase workflow: get options → render HTML → write file

**Template System (`resources/*/`)**
- Three UI options: Stoplight Elements, Swagger UI, Redoc
- Each UI has: `template.ejs`, `index.css`, `index.js`
- Templates use EJS with embedded CSS/JS content and OpenAPI data

**Validation (`src/utils/validate.js`)**
- Input validation for CLI commands and interactive prompts
- Supports JSON/YAML files and URLs
- Enforces HTML output format

**Constants (`src/constants/index.js`)**
- UI types: `['stoplight', 'swagger', 'redoc']`
- Themes: `['light', 'dark']`
- File extensions: `['.json', '.yaml', '.yml']`

### Key Processing Steps

1. **Input Resolution**: Accepts file paths or URLs, validates format
2. **$ref Resolution**: Uses `@apidevtools/json-schema-ref-parser` to bundle external references
3. **Template Rendering**: EJS templates embed CSS, JS, and OpenAPI data into single HTML file
4. **Output Generation**: Creates standalone HTML with no external dependencies

### File Structure Logic

- `src/index.js` - Main orchestration and rendering logic
- `src/utils/validate.js` - All input validation functions
- `src/constants/index.js` - Configuration constants
- `resources/{ui}/` - UI-specific templates and assets
- Tests are co-located with source files (e.g., `validate.test.js`)

### Testing

Uses Jest with ES modules (`--experimental-vm-modules` flag required). Tests focus on validation functions and CLI argument handling.