param(
  [string]$ProjectRoot = (Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path))
)

Add-Type -AssemblyName System.Drawing

$brandRoot = Join-Path $ProjectRoot 'public\assets\brand'
$sourceBrandRoot = Join-Path $ProjectRoot 'source-assets\brand'
$backgroundPath = Join-Path $sourceBrandRoot 'world-arch-journal-youtube-bg-v1.png'
$portraitPath = Join-Path $ProjectRoot 'public\assets\filmnub'
