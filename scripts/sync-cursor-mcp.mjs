/**
 * Generates .cursor/mcp.json from .vscode/mcp.json (single source of truth).
 * Cursor uses mcpServers; VS Code uses servers + optional inputs.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const vscodePath = path.join(root, '.vscode', 'mcp.json');
const cursorDir = path.join(root, '.cursor');
const cursorPath = path.join(cursorDir, 'mcp.json');

const raw = fs.readFileSync(vscodePath, 'utf8');
const vscode = JSON.parse(raw);

if (!vscode.servers || typeof vscode.servers !== 'object') {
  console.error('sync-cursor-mcp: .vscode/mcp.json must contain a "servers" object.');
  process.exit(1);
}

const mcpServers = {};
for (const [name, cfg] of Object.entries(vscode.servers)) {
  if (!cfg || typeof cfg !== 'object') continue;
  const next = { ...cfg };
  // Cursor remote examples omit VS Code–specific "type" for streamable HTTP.
  if (next.type === 'http') delete next.type;
  mcpServers[name] = next;
}

if (!fs.existsSync(cursorDir)) {
  fs.mkdirSync(cursorDir, { recursive: true });
}

const out = `${JSON.stringify({ mcpServers }, null, 2)}\n`;
fs.writeFileSync(cursorPath, out, 'utf8');
console.log(`Wrote ${path.relative(root, cursorPath)} from .vscode/mcp.json`);
