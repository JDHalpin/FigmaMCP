# PoW Plugin Quickstart

Use this guide to run the PoW Figma plugin directly from the GitHub repository.

## Prerequisites
- macOS, Windows, or Linux with git installed
- Node.js 18.x (or newer) with npm
- Figma desktop app (for running development plugins)
- (Optional) Access to a Figma MCP bridge with `FIGMA_ACCESS_TOKEN`

## 1. Clone the Repository
```bash
git clone https://github.com/JDHalpin/FigmaMCP.git
cd FigmaMCP
```

## 2. Install CLI Dependencies
```bash
cd pow
npm install
cd ..
```
The CLI generates flow plans that the plugin consumes.

## 3. Generate a Demo Plan (Optional)
```bash
npm run run -- "Reset password with email + SMS fallback"
```
This writes `pow/docs/flow.plan.json`, which you can import straight into Figma.

## 4. Configure MCP Bridge (Optional)
If you want the CLI to validate plans against an existing Figma file:
```bash
export FIGMA_ACCESS_TOKEN="<personal token>"
export FIGMA_MCP_PATH="node"            # or specify FIGMA_MCP_ARGS as a JSON array
export FIGMA_MCP_ARGS="/abs/path/to/figma-mcp-server.mjs"
export FIGMA_FILE_KEY="<default file key>"
```
- `FIGMA_MCP_PATH` / `FIGMA_MCP_ARGS` must launch your MCP server over stdio.
- `FIGMA_FILE_KEY` enables automatic validation of generated screens.

Smoke-test the connection:
```bash
npm run mcp:smoke
npm run mcp:file -- <fileKey>
```
Close or stop the MCP process when you are done.

## 5. Import the Plugin into Figma
1. Open the Figma desktop app.
2. Choose `Plugins → Development → Import plugin from manifest…`.
3. Select `pow-importer/manifest.json` inside the cloned repo.

## 6. Run the Plugin
1. Launch **PoW Importer** from `Plugins → Development`.
2. **Plan JSON Import**
   - Paste the JSON from `pow/docs/flow.plan.json` (or another plan).
   - Click **Import** to create frames with placeholder text labels.
3. **Functional Annotation Generator**
   - Fill in the brand, project, extras, and frame count fields.
   - Click **Create Frames** to generate 2060×1940 annotation boards with dashed artwork and notes columns.

## 7. (macOS) Copy the Example Plan to Clipboard
```bash
npm run plan:copy
```
Use this if you prefer pasting the example plan without opening the generated file.

## Troubleshooting
- Regenerate the plan if `pow/docs/flow.plan.json` is missing.
- Ensure fonts load correctly in Figma; the plugin auto-loads Inter Regular.
- If MCP checks fail, re-verify environment variables and that the server is reachable.
