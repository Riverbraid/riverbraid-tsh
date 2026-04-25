import { readFileSync, existsSync, readdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));
const GENESIS_ANCHOR = '01a777';

function fail(msg) {
  console.error(`FAIL-CLOSED: ${msg}`);
  process.exit(1);
}

// Check Anchor
const anchorPath = resolve(__dir, '.anchor');
if (!existsSync(anchorPath)) fail('Missing .anchor file');
const anchor = readFileSync(anchorPath, 'utf8').trim();
if (anchor !== GENESIS_ANCHOR) fail('Anchor mismatch');

// Check for Structural Integrity (Cargo, Spec, or Source)
const artifacts = ['Cargo.toml', 'spec.json', 'src', 'package.json'];
const found = artifacts.some(f => existsSync(resolve(__dir, f)));

if (!found) fail('Structural Integrity Check Failed: No build or source artifacts found.');

console.log('STATIONARY: System integrity verified.');
process.exit(0);
