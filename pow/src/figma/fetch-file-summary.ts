import { fetchFigmaFileSummary } from './mcp-read';

async function main() {
  const fileKey = process.argv[2];
  if (!fileKey) {
    console.error('Usage: npm run mcp:file -- <fileKey>');
    process.exit(1);
    return;
  }

  try {
    const summary = await fetchFigmaFileSummary(fileKey);
    console.log(`File: ${summary.name}`);
    console.log(`Last modified: ${summary.lastModified}`);

    if (summary.pages.length === 0) {
      console.log('No pages or frames detected.');
    } else {
      console.log('Pages:');
      for (const page of summary.pages) {
        if (page.frames.length === 0) {
          console.log(` - ${page.name} (${page.id}) — no frames`);
        } else {
          console.log(` - ${page.name} (${page.id})`);
          for (const frame of page.frames) {
            console.log(`    • ${frame.name} (${frame.id})`);
          }
        }
      }
    }

    if (summary.rootFrames.length > 0) {
      console.log('Frames at document root:');
      for (const frame of summary.rootFrames) {
        console.log(` - ${frame.name} (${frame.id})`);
      }
    }
  } catch (error) {
    console.error('Failed to read Figma file via MCP:', (error as Error).message);
    process.exit(1);
  }
}

main();