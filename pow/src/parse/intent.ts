import { Spec } from '../types';
import fs from 'node:fs/promises';

export async function parseToSpec(description: string): Promise<Spec> {
  // TODO: Replace with your MCP LLM call using prompts/pow.prompt.txt
  const _systemPrompt = await fs.readFile('prompts/pow.prompt.txt', 'utf8');
  // Temporary deterministic stub for quick demo:
  const faux = description.toLowerCase().includes('login') ? `{"screens":[{"name":"Login","size":{"w":1440,"h":1024},"blocks":[{"type":"header","title":"Acme Portal"},{"type":"form","fields":[{"label":"Email","kind":"email"},{"label":"Password","kind":"password"}]},{"type":"buttons","primary":"Sign in","secondary":"Use SSO"},{"type":"note","text":"Forgot password? link below form"}]},{"name":"2FA","size":{"w":1440,"h":1024},"blocks":[{"type":"otp","digits":6},{"type":"buttons","primary":"Verify"}]},{"name":"Error","size":{"w":1440,"h":1024},"blocks":[{"type":"alert","level":"error","text":"Invalid credentials"}]}],"connectors":[["Login","2FA"],["Login","Error"]]}` : `{"screens":[{"name":"Main","size":{"w":1440,"h":1024},"blocks":[{"type":"header","title":"Untitled Flow"},{"type":"note","text":"Edit the prompt to generate a richer flow."},{"type":"buttons","primary":"Continue"}]}],"connectors":[]}`;
  return JSON.parse(faux) as Spec;
}
