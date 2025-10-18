# PoW System — Collaborative Development Guide

## Project Overview

This repository contains a text-to-wireframe system that links a Node generator (`pow/`) to a Figma plugin (`pow-importer/`). 
The Node script turns a natural-language brief (for example: "Login with SSO, 2FA, and error state") into a structured JSON plan. 
The Figma plugin then reads that plan and creates frames, labels, and components automatically.

```
Projects/
├── pow/                # Node generator
│   ├── package.json
│   └── docs/
│       └── flow.plan.json
└── pow-importer/       # Figma plugin
    ├── manifest.json
    ├── code.js
    └── ui.html
```

## Team Roles & Responsibilities

| Role | Tool | Responsibility |
|------|------|----------------|
| Architect / Oversight | ChatGPT (GPT-5) | Designs and explains the architecture, sequences work, validates each milestone. |
| Operator / Builder | Claude Sonnet 4.5 + Cline (VS Code extension) | Has local file access. Edits, runs, and verifies code. Executes all instructions from the Architect. |
| Troubleshooter / Assistant | GitHub Copilot | Fixes small syntax errors, completes code inline, and assists when the Operator edits in VS Code. |
| Director / Reviewer | Jeff Halpin | Defines creative intent, validates behavior inside Figma, and signs off on working milestones. |

## Workflow

### 1. In the terminal:

```bash
cd pow
npm run plan:copy
```

→ Generates `docs/flow.plan.json` and copies it to the clipboard.

### 2. In Figma:

→ **Plugins → Development → PoW Importer** → Click **Load from Clipboard** then **Import**.

### 3. Frames and labels appear on the canvas.

## Acceptance Criteria

- `npm run plan:copy` completes with no errors.
- Clicking **Load from Clipboard → Import** in Figma creates visible frames and text labels.
- No plugin console errors or orange banners.
- (Optional) Buttons appear when a valid component node-id is provided in `code.js`.

## Commands

| Command | Description |
|---------|-------------|
| `npm run run -- "Prompt"` | Generate JSON plan. |
| `npm run plan:copy` | Generate plan and copy it (macOS). |

## Troubleshooting

| Issue | Cause | Fix |
|-------|-------|-----|
| Plugin won't load | Wrong file path in `manifest.json`. | Ensure `"main":"code.js"`, `"ui":"ui.html"`. |
| "editorType does not include dev" | Manifest missing `"dev"`. | Add `"dev"` to `editorType`. |
| No frames appear | Invalid or empty JSON. | Regenerate plan and re-import. |
| "Component not found" | Wrong or unpublished `node-id`. | Copy link from **main component** again. |

## Next Milestone

- Add form field and header components.
- Generate connectors between screens.
- Create a shared component library mapping (LIB).

---

**Owner:** Jeff Halpin

**Maintainers:** GPT-5 (Architect), Claude Sonnet + Cline (Operator), GitHub Copilot (Troubleshooter)

**Status:** Internal POC — Do Not Distribute
