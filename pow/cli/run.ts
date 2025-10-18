import { parseToSpec } from '../src/parse/intent';
import { planLayout } from '../src/plan/layout';
import { writeFlow } from '../src/figma/write'; // keep for later / optional
import { writePlan } from '../src/output/plan-writer'; // ⬅ add this

const prompt = process.argv.slice(2).join(' ') || 'Login with SSO, 2FA, and error state';

(async () => {
  const spec = await parseToSpec(prompt);
  const plan = planLayout(spec);

  // Always write a plan file we can import in Figma:
  await writePlan(plan, "docs/flow.plan.json");

  // If/when you have write-capable MCP, this will place nodes directly:
  // await writeFlow(plan);

  console.log('PoW generated ✔');
})();
