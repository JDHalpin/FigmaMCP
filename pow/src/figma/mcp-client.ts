import { Client } from '@modelcontextprotocol/sdk/client';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

export type FigmaClient = Client;

interface ConnectParams {
  command: string;
  args: string[];
  env: Record<string, string>;
}

function resolveConnection(): ConnectParams {
  const token = process.env.FIGMA_ACCESS_TOKEN;
  if (!token) {
    throw new Error('FIGMA_ACCESS_TOKEN must be set to use the Figma MCP server.');
  }

  const command = process.env.FIGMA_MCP_COMMAND || 'node';
  const rawArgs = process.env.FIGMA_MCP_ARGS;
  const path = process.env.FIGMA_MCP_PATH;

  let args: string[] | undefined;
  if (rawArgs && rawArgs.trim().length > 0) {
    try {
      const parsed = JSON.parse(rawArgs);
      if (Array.isArray(parsed)) {
        args = parsed.map((value) => String(value));
      }
    } catch (error) {
      throw new Error(`Failed to parse FIGMA_MCP_ARGS as JSON array: ${(error as Error).message}`);
    }
  }

  if (!args) {
    if (!path) {
      throw new Error('Provide FIGMA_MCP_PATH or FIGMA_MCP_ARGS to launch the MCP server.');
    }
    args = [path];
  }

  const extraEnv: Record<string, string> = {};
  const rawEnv = process.env.FIGMA_MCP_ENV;
  if (rawEnv) {
    try {
      const parsed = JSON.parse(rawEnv);
      for (const [key, value] of Object.entries(parsed)) {
        extraEnv[key] = String(value);
      }
    } catch (error) {
      throw new Error(`Failed to parse FIGMA_MCP_ENV as JSON object: ${(error as Error).message}`);
    }
  }

  return {
    command,
    args,
    env: { FIGMA_ACCESS_TOKEN: token, ...extraEnv },
  };
}

export async function withFigmaClient<T>(callback: (client: FigmaClient) => Promise<T>): Promise<T> {
  const params = resolveConnection();
  const transport = new StdioClientTransport({
    command: params.command,
    args: params.args,
    env: params.env,
  });

  const client = new Client(
    { name: 'pow-cli', version: '1.0.0' },
    { capabilities: { tools: {}, resources: {} } }
  );

  await client.connect(transport);

  try {
    return await callback(client);
  } finally {
    await client.close();
  }
}