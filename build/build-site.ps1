$ErrorActionPreference = "Stop"

$projectRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot ".."))
$dist = [System.IO.Path]::GetFullPath((Join-Path $projectRoot "dist"))
$expectedDist = [System.IO.Path]::GetFullPath((Join-Path $projectRoot "dist"))

if ($dist -ne $expectedDist -or -not $dist.StartsWith($projectRoot, [System.StringComparison]::OrdinalIgnoreCase)) {
  throw "Refusing to replace a build directory outside the project."
}

if (Test-Path -LiteralPath $dist) {
  Remove-Item -LiteralPath $dist -Recurse -Force
}

$serverDir = Join-Path $dist "server"
$clientDir = Join-Path $dist "client"
New-Item -ItemType Directory -Force -Path $serverDir, $clientDir | Out-Null

Get-ChildItem -LiteralPath $projectRoot -Filter "*.html" -File |
  Copy-Item -Destination $clientDir
foreach ($publicFile in @("robots.txt", "sitemap.xml")) {
  $publicPath = Join-Path $projectRoot $publicFile
  if (Test-Path -LiteralPath $publicPath) {
    Copy-Item -LiteralPath $publicPath -Destination $clientDir
  }
}
Copy-Item -LiteralPath (Join-Path $projectRoot "assets") -Destination $clientDir -Recurse
Copy-Item -LiteralPath (Join-Path $PSScriptRoot "sites-static-worker.js") -Destination (Join-Path $serverDir "index.js")

Write-Output "Static site build created at $dist"
