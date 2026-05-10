import fs from "node:fs"; import crypto from "node:crypto"; import { verify } from "./index.js";
const repo="riverbraid-tsh", role="threshold-signing-helper", inv="TSH_THRESHOLD_STATIONARY", contract="threshold-packet-contract", sig="tsh:THRESHOLD_STATIONARY";
const protocol = JSON.parse(fs.readFileSync("protocol.steps", "utf8"));
const result = verify(protocol.canonical_input);
const digest = crypto.createHash("sha256").update(JSON.stringify({repo, ring:2, role, inv, contract, input:protocol.canonical_input, result})).digest("hex");
const req = ["package.json","index.js","verify.mjs","protocol.steps","AUTHORITY.md","RING.md"];
const missing = req.filter(f => !fs.existsSync(f));
const status = (missing.length === 0 && result.pass && result.stationary && result.signal === sig) ? "VERIFIED" : "FAILED";
const out = { schema:"riverbraid.infrastructure.verify.output", version:"1.0.0", repo, ring:2, role, invariant:inv, contract_type:contract, status, canonical_signal:result.signal, canonical_reason:result.reason, digest:"sha256:"+digest, required_files:req, missing_files:missing, failure_codes: status==="VERIFIED"?[]:["INFRASTRUCTURE_CONTRACT_NOT_VERIFIED"] };
fs.writeFileSync("verify-output.json", JSON.stringify(out, null, 2) + "\n", "utf8");
if (status !== "VERIFIED") { console.error(repo+"_FAIL"); process.exit(1); }
console.log(repo+"_PASS");