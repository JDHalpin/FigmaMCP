const LIB = { button_primary: '22-877' }; // replace with node-id from "Copy link"
const toId = id => String(id).replace(/-/g, ':');
function getComp(id){ const n=figma.getNodeById(toId(id)); return n?.type==='COMPONENT'?n : (n?.type==='INSTANCE'?n.mainComponent:null); }

figma.showUI(__html__, { width: 360, height: 140 });

figma.ui.onmessage = async (msg) => {
  if (msg.type !== 'import') return;
  try {
    const plan = JSON.parse(String(msg.text||'{}'));
    try { await figma.loadFontAsync({ family: "Inter", style: "Regular" }); } catch {}
    let fx = 0;
    for (const s of (plan.screens||[])) {
      const frame = figma.createFrame();
      const w = (s.size?.w)||1440, h = (s.size?.h)||1024;
      frame.name = s.name||'Screen'; frame.resize(w,h); frame.x = fx; frame.y = 0;
      figma.currentPage.appendChild(frame);
      for (const b of (s.blocks||[])) {
        if (b.type==='buttons' && LIB.button_primary) {
          try { const c=getComp(LIB.button_primary); if(c){ const i=c.createInstance(); i.x=+b.x||0; i.y=+b.y||0; frame.appendChild(i); } }
          catch(e){ console.error(e); }
        } else {
          const t = figma.createText(); t.characters = String(b.type||'block');
          t.x = Number(b.x||0); t.y = Number(b.y||0); frame.appendChild(t);
        }
      }
      fx += w + 240;
    }
    figma.notify('✅ Frames + labels created');
  } catch (e) { figma.notify('❌ Import failed'); console.error(e); }
};
