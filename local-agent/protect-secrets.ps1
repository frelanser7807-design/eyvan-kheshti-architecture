$ErrorActionPreference = 'Stop'
$runtimePath = Join-Path $PSScriptRoot 'runtime'
New-Item -ItemType Directory -Force -Path $runtimePath | Out-Null

$composioKey = (Get-Clipboard -Raw).Trim()
if (-not $composioKey.StartsWith('ak_') -or $composioKey.Length -lt 20) {
  throw 'A valid Composio API key is not present in the clipboard.'
}

$tokenBytes = New-Object byte[] 32
[Security.Cryptography.RandomNumberGenerator]::Fill($tokenBytes)
$localToken = [Convert]::ToBase64String($tokenBytes).TrimEnd('=').Replace('+','-').Replace('/','_')
$secretPath = Join-Path $runtimePath 'secrets.env'
@(
  "COMPOSIO_API_KEY=$composioKey"
  "LOCAL_AGENT_TOKEN=$localToken"
) | Set-Content -LiteralPath $secretPath -Encoding utf8

$sid = [Security.Principal.WindowsIdentity]::GetCurrent().User.Value
& icacls.exe $secretPath /inheritance:r /grant:r ("*" + $sid + ":(R,W)") | Out-Null
if ($LASTEXITCODE -ne 0) { throw 'Failed to restrict the secret file ACL.' }

Set-Clipboard -Value ''
Write-Output 'Secrets saved in a Git-ignored file restricted to the current Windows account; clipboard cleared.'
