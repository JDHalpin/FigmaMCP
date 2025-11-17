import { parseToSpec } from '../src/parse/intent';
import { planLayout } from '../src/plan/layout';
import { writeFlow } from '../src/figma/write'; // keep for later / optional
import { writePlan } from '../src/output/plan-writer'; // ⬅ add this
import { fetchFigmaFileSummary } from '../src/figma/mcp-read';

const prompt = process.argv.slice(2).join(' ') || 'Login with SSO, 2FA, and error state';

(async () => {
  const spec = await parseToSpec(prompt);
  const plan = planLayout(spec);

  // Always write a plan file we can import in Figma:
  await writePlan(plan, "docs/flow.plan.json");

  const figmaFileKey = process.env.FIGMA_FILE_KEY;
  if (figmaFileKey) {
    try {
      const summary = await fetchFigmaFileSummary(figmaFileKey);
      console.log(`ℹ️ Figma file: ${summary.name} (last modified ${summary.lastModified || 'unknown'})`);

      if (summary.pages.length > 0) {
        const pageSnippets = summary.pages
          .slice(0, 3)
          .map((page) => {
            const framePreview = page.frames.slice(0, 2).map((frame) => frame.name).join(', ');
            const hasMoreFrames = page.frames.length > 2 ? '…' : '';
            return `${page.name}${framePreview ? ` → ${framePreview}${hasMoreFrames}` : ''}`;
          })
          .join(' | ');

        console.log(`   Pages: ${pageSnippets}${summary.pages.length > 3 ? ' …' : ''}`);
      }

      const availableFrameNames = new Set<string>();
      for (const page of summary.pages) {
        for (const frame of page.frames) {
          availableFrameNames.add(frame.name);
        }
      }
      for (const frame of summary.rootFrames) {
        availableFrameNames.add(frame.name);
      }

      const missingScreens = (plan.screens || []).filter((screen) => !availableFrameNames.has(screen.name));
      if (missingScreens.length > 0) {
        const names = missingScreens.map((screen) => screen.name).join(', ');
        console.log(`   ⚠️ Screens not found in Figma: ${names}`);
      } else if (plan.screens && plan.screens.length > 0) {
        console.log('   ✅ All generated screens already exist as Figma frames.');
      }
    } catch (error) {
      console.warn('⚠️ Unable to query Figma MCP:', (error as Error).message);
    }
  }

  // If/when you have write-capable MCP, this will place nodes directly:
  // await writeFlow(plan);

  console.log('PoW generated ✔');
})();
