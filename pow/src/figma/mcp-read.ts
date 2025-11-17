import { withFigmaClient } from './mcp-client';

type ToolContent = { type: 'text'; text: string } | { type: string };

interface FigmaDocumentNode {
  id: string;
  name: string;
  type: string;
  children?: FigmaDocumentNode[];
}

interface FigmaFileResponse {
  name: string;
  lastModified: string;
  document?: FigmaDocumentNode;
}

export interface FigmaFrameSummary {
  id: string;
  name: string;
}

export interface FigmaPageSummary {
  id: string;
  name: string;
  frames: FigmaFrameSummary[];
}

export interface FigmaFileSummary {
  name: string;
  lastModified: string;
  pages: FigmaPageSummary[];
  rootFrames: FigmaFrameSummary[];
}

export async function fetchFigmaFileSummary(fileKey: string): Promise<FigmaFileSummary> {
  const response = await withFigmaClient(async (client) => {
    const result = await client.callTool({
      name: 'get_file',
      arguments: { file_key: fileKey },
    });

    return result.content as ToolContent[] | undefined;
  });

  if (!response) {
    throw new Error('Figma MCP server returned no content for get_file.');
  }

  const payload = response.find((item) => item.type === 'text') as { type: 'text'; text: string } | undefined;
  if (!payload) {
    throw new Error('Figma MCP server did not return text content for get_file.');
  }

  let parsed: FigmaFileResponse;
  try {
    parsed = JSON.parse(payload.text) as FigmaFileResponse;
  } catch (error) {
    throw new Error(`Unable to parse Figma file response: ${(error as Error).message}`);
  }

  const pages: FigmaPageSummary[] = [];
  const rootFrames: FigmaFrameSummary[] = [];
  const children = parsed.document && parsed.document.children ? parsed.document.children : [];

  for (const child of children) {
    if (!child) continue;

    if (child.type === 'CANVAS') {
      pages.push({
        id: child.id,
        name: child.name,
        frames: collectPageFrames(child),
      });
    } else if (child.type === 'FRAME') {
      rootFrames.push({ id: child.id, name: child.name });
    }
  }

  return {
    name: parsed.name || 'Untitled file',
    lastModified: parsed.lastModified || '',
    pages,
    rootFrames,
  };
}

function collectPageFrames(node: FigmaDocumentNode): FigmaFrameSummary[] {
  if (!node.children || node.children.length === 0) {
    return [];
  }

  const frames: FigmaFrameSummary[] = [];
  for (const child of node.children) {
    if (!child) continue;

    if (child.type === 'FRAME') {
      frames.push({ id: child.id, name: child.name });
    } else if (child.type === 'SECTION') {
      frames.push(...collectPageFrames(child));
    }
  }

  return frames;
}