// Minimal, stable importer: creates frames + text labels from pasted JSON.
// No external libs, no top-level await.

figma.showUI(__html__, { width: 520, height: 560 });

let fontLoaded = false;

async function ensureFont() {
  if (fontLoaded) return;
  try {
    await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
  } catch (err) {
    console.warn('Font load failed, using fallback', err);
  }
  fontLoaded = true;
}

function createText(parent, characters, x, y, options = {}) {
  const text = figma.createText();
  text.fontName = options.fontName || { family: 'Inter', style: 'Regular' };
  text.characters = characters;
  text.x = x;
  text.y = y;
  if (options.fontSize) text.fontSize = options.fontSize;
  if (options.opacity !== undefined) text.opacity = options.opacity;
  if (options.fontName) text.fontName = options.fontName;
  if (options.width !== undefined) {
    text.textAutoResize = 'NONE';
    const height = options.height !== undefined ? options.height : text.height;
    text.resize(options.width, height);
  }
  parent.appendChild(text);
  return text;
}

function createDashedRectangle(parent, x, y, width, height) {
  const rect = figma.createRectangle();
  rect.x = x;
  rect.y = y;
  rect.resize(width, height);
  rect.strokeWeight = 2;
  rect.strokeJoin = 'ROUND';
  rect.dashPattern = [12, 8];
  rect.fills = [];
  rect.strokes = [{ type: 'SOLID', color: { r: 0.7, g: 0.7, b: 0.7 } }];
  parent.appendChild(rect);
  return rect;
}

function createHorizontalRule(parent, x, y, length) {
  const line = figma.createLine();
  line.x = x;
  line.y = y;
  line.resize(length, 0);
  line.strokes = [{ type: 'SOLID', color: { r: 0.82, g: 0.82, b: 0.82 } }];
  line.strokeWeight = 1;
  parent.appendChild(line);
  return line;
}

figma.ui.onmessage = async (msg) => {
  if (!msg) return;

  if (msg.type === 'import') {
    // 1) Parse JSON safely
    let plan;
    try {
      plan = JSON.parse(String(msg.text || '{}'));
    } catch (e) {
      figma.notify('❌ JSON parse error');
      console.error('Parse error:', e);
      return;
    }

    await ensureFont();

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
    return;
  }

  if (msg.type === 'create-annotations') {
    const {
      frameCount,
      brand,
      project,
      docExtra,
      pageBase,
      pageExtra,
    } = msg;

    const count = Number(frameCount);
    if (!count || count < 1) {
      figma.notify('⚠️ Enter a frame count (>=1)');
      return;
    }

    await ensureFont();

    const FRAME_WIDTH = 2060;
    const FRAME_HEIGHT = 1940;
    const SPACING = 240;

    for (let idx = 0; idx < count; idx++) {
      const frame = figma.createFrame();
      frame.resize(FRAME_WIDTH, FRAME_HEIGHT);
      frame.name = `${pageBase || 'Page'} ${String(idx + 1).padStart(2, '0')}`;
      frame.x = idx * (FRAME_WIDTH + SPACING);
      frame.y = 0;
      frame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
      figma.currentPage.appendChild(frame);

      const headerText = `[${brand || 'brand'}][${project || 'project name'}][functional annotations][${docExtra || '*additional field'}]`;
      createText(frame, headerText, 67, 30, { fontSize: 20 });

      createHorizontalRule(frame, 54, 68, 1950);

      const pageTitle = `[${(pageBase || 'Page name')} ${String(idx + 1).padStart(2, '0')}][${pageExtra || '*additional field'}]`;
      createText(frame, pageTitle, 90, 136, { fontSize: 28 });

      createDashedRectangle(frame, 108, 244, 1024, 900);
      createDashedRectangle(frame, 1172, 244, 390, 1440);

  createText(frame, 'FUNCTIONAL ANNOTATIONS', 1592, 244, { fontSize: 18 });

      const annotationText = createText(frame, 'Add functional notes here…', 1606, 312, {
        fontSize: 16,
        width: 339,
        height: 600,
      });
      annotationText.opacity = 0.6;
    }

    figma.notify(`✅ Created ${count} annotation frame(s)`);
  }
};
