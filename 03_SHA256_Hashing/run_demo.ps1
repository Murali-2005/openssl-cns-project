# PowerShell Script for SHA-256 Hashing Demo
$env:Path = "$PSScriptRoot;C:\Program Files\Git\mingw64\bin;" + $env:Path

Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host "     EXPERIMENT 3: SHA-256 HASHING & AVALANCHE EFFECT DEMO       " -ForegroundColor Cyan
Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host "Concept: Cryptographic hash functions are deterministic, one-way, and collision-resistant.`n"

# Ensure pristine original
if (Test-Path original.bak) {
    Copy-Item original.bak original.txt -Force
} else {
    Copy-Item original.txt original.bak -Force
}

Write-Host "[1] Original File Content:" -ForegroundColor Yellow
Get-Content original.txt
Write-Host ""

Write-Host "[2] Computing SHA-256 Digest of Original File:" -ForegroundColor Yellow
$origHashOutput = (& openssl dgst -sha256 original.txt)
Write-Host $origHashOutput -ForegroundColor Green
$origHashOutput | Out-File -FilePath original_hash.txt -Encoding ascii
Write-Host ""

Write-Host "[3] Tampering File (Appending 'Tampered data')..." -ForegroundColor Yellow
Add-Content -Path original.txt -Value "Tampered data"
Write-Host "Updated File Content:"
Get-Content original.txt
Write-Host ""

Write-Host "[4] Computing SHA-256 Digest of Tampered File:" -ForegroundColor Yellow
$modHashOutput = (& openssl dgst -sha256 original.txt)
Write-Host $modHashOutput -ForegroundColor Red
$modHashOutput | Out-File -FilePath modified_hash.txt -Encoding ascii
Write-Host ""

Write-Host "[5] Binary Comparison of Hash Digests (Avalanche Effect):" -ForegroundColor Yellow
cmd.exe /c "fc /b original_hash.txt modified_hash.txt"

Write-Host "`nResult: A tiny change altered almost the entire hash digest!" -ForegroundColor Green
Write-Host "This proves the Avalanche Effect and guarantees data integrity detection." -ForegroundColor Cyan

# Restore original file
Copy-Item original.bak original.txt -Force
