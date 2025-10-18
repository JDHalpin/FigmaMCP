import { Plan, Spec, PlacedBlock } from '../types';

const GRID = { cols: 12, gutter: 80, margin: 160, colWidth: (1440 - 2*160 - 11*80) / 12 };
const V = { block: 24 };

function spanWidth(span: number) {
  return span * GRID.colWidth + (span - 1) * GRID.gutter;
}

export function planLayout(spec: Spec): Plan {
  const screens = spec.screens.map(screen => {
    let y = 120;
    const blocks: PlacedBlock[] = [];

    for (const b of screen.blocks) {
      let span = 12;
      if (b.type === 'form' || b.type === 'buttons' || b.type === 'note') span = 6;
      if (b.type === 'otp') span = 4;
      if (b.type === 'alert') span = 8;
      if (b.type === 'table') span = 10;
      if (b.type === 'list' || b.type === 'modal') span = 8;

      const w = spanWidth(span);
      const x = Math.round((screen.size.w - w) / 2); // center

      blocks.push({ ...b, x, y, span });
      y += 120 + V.block;
    }

    return { name: screen.name, size: screen.size, blocks };
  });

  return { screens, connectors: spec.connectors };
}
