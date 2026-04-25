#!/bin/bash
GENESIS_ANCHOR="01a777"
REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [[ ! -f "$REPO_DIR/.anchor" ]]; then
    echo "FAIL-CLOSED: Missing .anchor file"
    exit 1
fi

if [[ "$(cat "$REPO_DIR/.anchor" | tr -d '[:space:]')" != "$GENESIS_ANCHOR" ]]; then
    echo "FAIL-CLOSED: Anchor mismatch"
    exit 1
fi

echo "Anchor Verified. Dispatching..."
node verify.mjs