$ErrorActionPreference = 'Stop'
$secretPath = Join-Path (Join-Path $PSScriptRoot 'runtime') 'secrets.env'
if (-not (Test-Path -LiteralPath $secretPath)) { throw 'Missing protected local-agent secrets.' }
$secretText = [IO.File]::ReadAllText($secretPath)
foreach ($line in ($secretText -split "`r?`n")) {
  if ($line -match '^([A-Z0-9_]+)=(.+)$') { Set-Item -Path ("Env:" + $Matches[1]) -Value $Matches[2] }
}
if (-not $env:AGENT_MANAGER_SHARED_SECRET -and $env:LOCAL_AGENT_TOKEN) {
  $env:AGENT_MANAGER_SHARED_SECRET = $env:LOCAL_AGENT_TOKEN
}
try { & node (Join-Path $PSScriptRoot 'server.mjs') }
finally {
  Remove-Item Env:COMPOSIO_API_KEY -ErrorAction SilentlyContinue
  Remove-Item Env:LOCAL_AGENT_TOKEN -ErrorAction SilentlyContinue
  Remove-Item Env:AGENT_MANAGER_SHARED_SECRET -ErrorAction SilentlyContinue
}
