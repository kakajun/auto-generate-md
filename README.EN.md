# agmd (auto generate md)

> A CLI and library that scans your project to generate Markdown docs for directory structures, counts code metrics, and provides utilities to normalize imports, rename paths, and classify files via routes.

## Features
- Count files and total lines/characters in the project
- Auto-complete missing suffixes like `.js` and `.vue`
- Rename files/folders from CamelCase to Kebab-Case
- Convert imports from absolute to relative paths for easy navigation
- Classify files by routes and export JSON of nodes
- Interactive CLI for all operations
- Output the full tree as JSON
- TypeScript implementation with extensive tests
- Convert relative imports to absolute alias-based paths using `@` (new)

## Usage
- Global: `npm i agmd -g`
- Local: `npm i agmd -D`
- Run: `agmd` in the directory you want to document

The generated Markdown (`readme-md.md`) contains:
- A “Directory Structure” section
- A “Statistics” section with totals per suffix, lines and characters

## Scripts
Add to `package.json`:

`npx agmd --ignore lib,node_modules,dist --include .js,.ts,.vue [--dry-run] [--silent]`

## CLI Commands (interactive)
- Help
- Generate Structure Markdown
- Change Relative Path
- Change Absolute Path
- Completion suffix
- Rename folders to Kebab-Case
- Rename files to Kebab-Case
- Record nodes as JSON
- Mark files for classification
- Delete marks
- Classification

## CLI Options
- `--include string` / `-in string` Include suffixes (space-separated)
- `--ignore string` / `-i string` Ignore file or directory names (space-separated)
- `--dry-run` / `-d` Preview changes without writing to disk
- `--silent` / `-s` Minimize logs

Defaults:
- `--ignore` img,styles,node_modules,LICENSE,.git,.github,dist,.husky,.vscode,readme-file.js,readme-md.js
- `--include` .js,.vue,.ts

Example:
`agmd --ignore lib node_modules dist --include .js .ts .vue --dry-run --silent`

## Advanced
Create `classify.js` at the project root to define route-based classification. Use `@` alias paths in the config. If missing, the tool scans `router/` automatically.

## API
- `getFileNodes(option?)` Get detailed file info
- `getMd(option?)` Get composed Markdown string and nodes

`option: { ignore?: string[]; include?: string[] }`

## Notes
- Prefer running path operations inside `src` due to alias resolution conventions
- Dry-run and silent modes are supported across write operations