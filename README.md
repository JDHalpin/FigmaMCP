# Figma MCP Toolkit ("PoW")

*Connect to Figma to generate new frames and components.*

## Overview
- `pow/`: TypeScript CLI that turns a natural-language intent into a structured flow plan (`docs/flow.plan.json`).
- `pow-importer/`: Companion Figma plugin that imports the plan or generates annotation frames.
- Optional MCP bridge: the CLI can query a read-only Model Context Protocol (MCP) server for Figma metadata to validate plans before you import them.

```
.
├── pow/
│   ├── cli/run.ts
│   ├── src/figma/
│   │   ├── mcp-client.ts      # shared MCP client helper
│   │   ├── mcp-read.ts        # fetches Figma file/page/frame summary
│   │   └── fetch-file-summary.ts
│   └── docs/flow.plan.json   # generated output (ignored in git)
└── pow-importer/
    ├── manifest.json
    ├── code.js                # plugin logic
    └── ui.html                # refreshed panel UI
```

## Requirements
- Node.js 18+ with npm
- Figma desktop app for plugin development
- (Optional) MCP-compatible Figma bridge with a valid `FIGMA_ACCESS_TOKEN`

## Setup
1. Install dependencies (inside `pow/`):
   ```bash
   cd pow
   npm install
   ```
2. (Optional) Configure MCP environment variables in your shell profile or `.env`:
   ```bash
   export FIGMA_ACCESS_TOKEN="<personal token>"
   export FIGMA_MCP_PATH="node"
   export FIGMA_MCP_ARGS="/absolute/path/to/figma-mcp-server.mjs"
   export FIGMA_FILE_KEY="<default file key>"
   ```
   - `FIGMA_MCP_PATH`/`FIGMA_MCP_ARGS` must start your MCP server over stdio.
   - `FIGMA_FILE_KEY` lets the CLI auto-validate screens against an existing file.

## CLI Workflows (run from repo root or inside `pow/`)
- Generate a plan for a custom prompt:
  ```bash
  npm run run -- "Reset password with email + SMS fallback"
  ```
  This writes `pow/docs/flow.plan.json`.

- Copy the default example plan to the clipboard (macOS):
  ```bash
  npm run plan:copy
  ```

- Query the MCP bridge for metadata (requires env vars above):
  ```bash
  FIGMA_FILE_KEY=123abc npm run run -- "Checkout flow"
  npm run mcp:file -- 123abc
  ```
  The CLI prints page/frame summaries and flags generated screens that do not already exist in Figma.

## Figma Plugin
1. In Figma desktop choose `Plugins → Development → Import plugin from manifest…` and select `pow-importer/manifest.json`.
2. Launch **PoW Importer**.
   - **Plan JSON Import**
     - Paste the JSON from `pow/docs/flow.plan.json`.
     - Press **Import** to create frames with placeholder labels. No changes happen until JSON parses successfully.
   - **Functional Annotation Generator**
     - Fill in brand, project, naming extras, and frame count.
     - Press **Create Frames** to generate 2060×1940 annotation boards with a dashed artwork region and notes column.
3. The refreshed UI uses a taller window, a visible scrollbar, and context copy so it screenshots well for demos.

## Scripts (`pow/package.json`)
| Command | Description |
| --- | --- |
| `npm run run -- "Prompt"` | Generate plan JSON for a specific prompt. |
| `npm run plan:copy` | Generate the default plan and copy it (macOS-only). |
| `npm run mcp:smoke` | Smoke-test the MCP bridge and list available tools. |
| `npm run mcp:file -- <fileKey>` | Print pages/frames for a file through MCP. |

## Review Notes & Next Steps
- Generated plans (`pow/docs/flow.plan.json`) stay out of git via `.gitignore`—regenerate as needed.
- MCP integration is read-only today; `src/figma/write.ts` sketches how write-capable tooling could reuse the plan once a writer is available.
- Share feedback or integration questions in issues so we can prioritize the next iteration.
  Candidates include consuming more MCP metadata during plan generation, expanding component mappings, and enabling direct writes once a server supports them.
