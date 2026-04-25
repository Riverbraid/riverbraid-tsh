$GENESIS_ANCHOR = "01a777"
$AnchorPath = Join-Path $PSScriptRoot ".anchor"

if (-not (Test-Path $AnchorPath)) {
    Write-Error "FAIL-CLOSED: Missing .anchor file"
    exit 1
}

$CurrentAnchor = (Get-Content $AnchorPath).Trim()
if ($CurrentAnchor -ne $GENESIS_ANCHOR) {
    Write-Error "FAIL-CLOSED: Anchor mismatch"
    exit 1
}

Write-Host "Anchor Verified. Dispatching..." -ForegroundColor Green
# Example dispatch to verify.mjs
node verify.mjs
