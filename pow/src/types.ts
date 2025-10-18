export type Block =
 | { type: 'header'; title: string }
 | { type: 'form'; fields: { label: string; kind: 'text'|'password'|'email'|'search'|'number' }[] }
 | { type: 'buttons'; primary: string; secondary?: string; tertiary?: string }
 | { type: 'alert'; level: 'info'|'success'|'warning'|'error'; text: string }
 | { type: 'otp'; digits: 6 }
 | { type: 'note'; text: string }
 | { type: 'list'; rows: number; item: string }
 | { type: 'table'; cols: number; rows: number }
 | { type: 'modal'; title: string; body: string };

export type Screen = { name: string; size: { w: number; h: number }; blocks: Block[] };
export type Spec = { screens: Screen[]; connectors: [string, string][] };
export type PlacedBlock = Block & { x: number; y: number; span?: number };
export type PlannedScreen = { name: string; size: { w: number; h: number }; blocks: PlacedBlock[] };
export type Plan = { screens: PlannedScreen[]; connectors: [string, string][] };
