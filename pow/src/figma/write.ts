import { Plan } from '../types';
import { LIB } from '../lib/map';

// Replace these 4 with your actual MCP Figma calls.
async function createFrame(name: string, w: number, h: number) { return { id: `frame:${name}`, name, w, h }; }
async function instance(key: string, parentId: string, x: number, y: number) { return { id: `${key}@${x},${y}`, parentId, x, y, key }; }
async function addText(parentId: string, x: number, y: number, text: string) { return { id: `text:${x},${y}`, parentId, x, y, text }; }
async function connect(fromFrameName: string, toFrameName: string, label = '→') { return { id: `conn:${fromFrameName}->${toFrameName}`, label }; }

export async function writeFlow(plan: Plan) {
  const frameIds: Record<string, string> = {};
  for (const s of plan.screens) {
    const f = await createFrame(s.name, s.size.w, s.size.h);
    frameIds[s.name] = f.id;

    for (const b of s.blocks) {
      if (b.type === 'header') {
        await instance(LIB.header_basic, f.id, b.x, b.y);
        await addText(f.id, b.x + 40, b.y + 16, b.title);
      }
      if (b.type === 'form') {
        let yy = b.y;
        for (const field of b.fields) {
          const key = field.kind === 'password' ? LIB.form_password : field.kind === 'email' ? LIB.form_email : LIB.form_text;
          await instance(key, f.id, b.x, yy);
          await addText(f.id, b.x, yy - 22, field.label);
          yy += 88;
        }
      }
      if (b.type === 'buttons') {
        await instance(LIB.button_primary, f.id, b.x, b.y);
        if (b.secondary) await instance(LIB.button_secondary, f.id, b.x + 220, b.y);
        if (b.tertiary) await instance(LIB.button_tertiary, f.id, b.x + 440, b.y);
      }
      if (b.type === 'alert') {
        const key = b.level === 'error' ? LIB.alert_error : LIB.alert_info;
        await instance(key, f.id, b.x, b.y);
        await addText(f.id, b.x + 24, b.y + 18, b.text);
      }
      if (b.type === 'otp') await instance(LIB.otp_inputs, f.id, b.x, b.y);
      if (b.type === 'note') {
        await instance(LIB.note_basic, f.id, b.x, b.y);
        await addText(f.id, b.x + 8, b.y + 8, b.text);
      }
      if (b.type === 'list') {
        for (let i = 0; i < b.rows; i++) await instance(LIB.list_row, f.id, b.x, b.y + i * 56);
      }
      if (b.type === 'table') await instance(LIB.table_basic, f.id, b.x, b.y);
      if (b.type === 'modal') {
        await instance(LIB.modal_basic, f.id, b.x, b.y);
        await addText(f.id, b.x + 24, b.y + 24, b.title);
        await addText(f.id, b.x + 24, b.y + 64, b.body);
      }
    }
  }
  for (const [from, to] of plan.connectors) await connect(from, to);
}
