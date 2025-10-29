// Minimal, stable importer: creates frames + text labels from pasted JSON.
// No external libs, no top-level await.

figma.showUI(__html__, { width: 520, height: 360 });

figma.ui.onmessage = async (msg) => {
  if (!msg || msg.type !== 'import') return;

  // 1) Parse JSON safely
  let plan;
  try {
    plan = JSON.parse(String(msg.text || '{}'));
  } catch (e) {
    figma.notify('❌ JSON parse error');
    console.error('Parse error:', e);
    return;
  }

  // 2) Load a font once for labels (ignore failure)
  try { await figma.loadFontAsync({ family: "Inter", style: "Regular" }); }
  catch (_err) {
    // Figma may not have the font yet; ignore and use default fallback.
  }

  // 3) Draw screens left-to-right
  let fx = 0;
  const screens = Array.isArray(plan.screens) ? plan.screens : [];
  for (const s of screens) {
    const frame = figma.createFrame();
    const name = s && s.name ? String(s.name) : 'Screen';
    const w = s && s.size && Number(s.size.w) ? Number(s.size.w) : 1440;
    const h = s && s.size && Number(s.size.h) ? Number(s.size.h) : 1024;

    frame.name = name;
    frame.resize(w, h);
    frame.x = fx;
    frame.y = 0;
    figma.currentPage.appendChild(frame);

    // 4) Label each block at its x/y
    const blocks = s && Array.isArray(s.blocks) ? s.blocks : [];
    for (const b of blocks) {
      const t = figma.createText();
      t.characters = String(b && b.type ? b.type : 'block');
      t.x = b && b.x != null ? Number(b.x) : 0;
      t.y = b && b.y != null ? Number(b.y) : 0;
      frame.appendChild(t);
    }
    fx += w + 240; // spacing between frames
  }

  figma.notify(`✅ Imported ${screens.length} screen(s)`);
};
