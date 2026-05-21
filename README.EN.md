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
- Convert relative imports to absolute alias-based paths using `@`
- **v2 rewritten in Rust — 10x faster, zero Node.js dependency**

## Usage

**v2 is built with Rust and distributed via npm as precompiled binaries. No Rust toolchain required.**

- Global: `npm i agmd -g`
- Local: `npm i agmd -D`
- Run: `agmd` in the directory you want to document

The generated Markdown (`readme-md.md`) contains:
- A "Directory Structure" section
- A "Statistics" section with totals per suffix, lines and characters

When you install via npm, the `postinstall` script automatically downloads the correct precompiled binary for your platform (Linux x64/ARM64, macOS x64/ARM64, Windows x64).

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

## Rust Library API

```rust
use agmd::{get_file_nodes_api, get_md_api, types::Options};
use std::path::Path;

let option = Options {
    ignore: Some(vec!["node_modules".to_string()]),
    include: Some(vec![".rs".to_string()]),
    ..Default::default()
};

// Get file node tree
let nodes = get_file_nodes_api(Path::new("./src"), Some(&option)).await?;

// Get Markdown output
let (md, nodes) = get_md_api(Some(&option), Path::new(".")).await?;
```

## Notes
- Prefer running path operations inside `src` due to alias resolution conventions
- Dry-run and silent modes are supported across write operations

## Changelog

### v2.0.0
- **Completely rewritten in Rust**
- 10x+ performance improvement for large projects
- Zero Node.js runtime dependency — single binary distribution
- Multi-platform support: Linux x64/ARM64, macOS x64/ARM64, Windows x64
- npm package includes all platform binaries, auto-selects on install
- Smaller install footprint

## Developer Build & Publish Guide

v2 is written in Rust. The npm package distributes precompiled binaries for all platforms.

### Build Steps

1. **Compile binaries for each platform**

   Run on each target platform (or cross-compile):

   ```bash
   # Linux x64
   cargo build --release --target x86_64-unknown-linux-gnu
   cp target/x86_64-unknown-linux-gnu/release/agmd bin/agmd-linux-x64

   # Linux ARM64
   cargo build --release --target aarch64-unknown-linux-gnu
   cp target/aarch64-unknown-linux-gnu/release/agmd bin/agmd-linux-arm64

   # macOS x64
   cargo build --release --target x86_64-apple-darwin
   cp target/x86_64-apple-darwin/release/agmd bin/agmd-macos-x64

   # macOS ARM64
   cargo build --release --target aarch64-apple-darwin
   cp target/aarch64-apple-darwin/release/agmd bin/agmd-macos-arm64

   # Windows x64
   cargo build --release --target x86_64-pc-windows-msvc
   cp target/x86_64-pc-windows-msvc/release/agmd.exe bin/agmd-windows-x64.exe
   ```

2. **Make binaries executable**

   ```bash
   chmod +x bin/agmd-linux-* bin/agmd-macos-*
   ```

3. **Bump version**

   Update version in both:
   - `Cargo.toml`
   - `package.json`

4. **Publish to npm**

   ```bash
   npm publish
   ```

   Make sure you are logged in: `npm login`

### npm Package Structure

```
├── package.json      # npm package config
├── agmd.js           # Entry script, detects platform and spawns binary
├── install.js        # postinstall, copies platform binary as 'agmd'
├── bin/              # Precompiled binaries
│   ├── agmd-linux-x64
│   ├── agmd-linux-arm64
│   ├── agmd-macos-x64
│   ├── agmd-macos-arm64
│   └── agmd-windows-x64.exe
└── ...
```

On install, the `postinstall` script detects the current platform, copies the matching binary from `bin/`, and renames it to `agmd`. No network download required.
