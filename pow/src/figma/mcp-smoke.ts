import { Client } from '@modelcontextprotocol/sdk/client';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

async function main() {
  const serverPath = process.env.FIGMA_MCP_PATH;
  const token = process.env.FIGMA_ACCESS_TOKEN;
  const command = process.env.FIGMA_MCP_COMMAND ?? 'node';
  const args = process.env.FIGMA_MCP_ARGS ? (JSON.parse(process.env.FIGMA_MCP_ARGS) as string[]) : undefined;
  const extraEnv = process.env.FIGMA_MCP_ENV ? (JSON.parse(process.env.FIGMA_MCP_ENV) as Record<string, string>) : {};

  if (!serverPath && !args) {
    throw new Error('Set FIGMA_MCP_PATH or FIGMA_MCP_ARGS to tell the smoke test how to launch your Figma MCP server.');
  }

  if (!token) {
    throw new Error('FIGMA_ACCESS_TOKEN environment variable is required.');
  }

  const transport = new StdioClientTransport({
    command,
    args: args ?? [serverPath!],
    env: { FIGMA_ACCESS_TOKEN: token, ...extraEnv },
  });

  const client = new Client(
    { name: 'pow-smoke', version: '0.0.1' },
    { capabilities: { tools: {}, resources: {} } }
  );

  await client.connect(transport);

  const toolsResult = await client.listTools({});
  const toolNames: string[] = [];
  for (const tool of toolsResult.tools ?? []) toolNames.push(tool.name);
  console.log('✅ Connected to Figma MCP server. Tools available:', toolNames.join(', ') || '(none reported)');

  const resourcesResult = await client.listResources({});
  const resourceUris: string[] = [];
  for (const resource of resourcesResult.resources ?? []) resourceUris.push(resource.uri);
  console.log('📚 Resources advertised:', resourceUris.join(', ') || '(none reported)');

  await client.close();
}

main().catch((error) => {
  console.error('❌ MCP smoke test failed:', error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
