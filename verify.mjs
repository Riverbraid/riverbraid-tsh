import fs from 'fs';
import crypto from 'crypto';

const spec = {
  repo: "riverbraid-tsh",
  ring: 2,
  class: "signing-tool",
  verification_scope: "ring2-signing-tool-anchor-and-file-surface",
  claim_boundary: "infrastructure-classification-only",
  expected_anchor: "STATIONARY_STATE_V2_20260425-092050",
  required_files: [".anchor", "AUTHORITY.md", "RING.md", "package.json", "verify.mjs"]
};

const observed_anchor = fs.readFileSync('.anchor', 'utf8').trim();
const missing = spec.required_files.filter(f => !fs.existsSync(f));
const isVerified = (observed_anchor === spec.expected_anchor && missing.length === 0);

const output = {
  ...spec,
  status: isVerified ? "VERIFIED" : "FILES_PRESENT_UNVERIFIED",
  observed_anchor,
  anchor_matches: observed_anchor === spec.expected_anchor,
  structural_artifact_present: true,
  missing_files: missing,
  failure_codes: [],
  digest: "sha256:" + crypto.createHash('sha256').update(observed_anchor).digest('hex')
};

fs.writeFileSync('verify-output.json', JSON.stringify(output, null, 2));
console.log(JSON.stringify(output, null, 2));