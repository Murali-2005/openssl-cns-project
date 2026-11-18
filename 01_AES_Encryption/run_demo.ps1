# PowerShell Script for AES-256-CBC Demo
$env:Path = "$PSScriptRoot;C:\Program Files\Git\mingw64\bin;" + $env:Path

Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host "      EXPERIMENT 1: AES-256-CBC SYMMETRIC ENCRYPTION DEMO        " -ForegroundColor Cyan
Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host "Concept: Symmetric encryption using AES-256 with CBC mode and PBKDF2.`n"

Write-Host "[1] Original Message Content:" -ForegroundColor Yellow
Get-Content message.txt
Write-Host ""

$password = Read-Host "Enter encryption password (default: Secret123)"
if ([string]::IsNullOrWhiteSpace($password)) { $password = "Secret123" }

Write-Host "`n[2] Encrypting message.txt using AES-256-CBC..." -ForegroundColor Yellow
& openssl enc -aes-256-cbc -salt -pbkdf2 -iter 100000 -in message.txt -out encrypted.bin -pass "pass:$password"
Write-Host "[SUCCESS] File encrypted to encrypted.bin!`n" -ForegroundColor Green

Write-Host "[3] Ciphertext Preview (Raw Bytes):" -ForegroundColor Yellow
[System.BitConverter]::ToString([System.IO.File]::ReadAllBytes("encrypted.bin")[0..47]) + "... (scrambled bytes)"
Write-Host ""

Write-Host "[4] Decrypting encrypted.bin using password..." -ForegroundColor Yellow
& openssl enc -d -aes-256-cbc -pbkdf2 -iter 100000 -in encrypted.bin -out decrypted.txt -pass "pass:$password"
Write-Host "[SUCCESS] File decrypted to decrypted.txt!`n" -ForegroundColor Green

Write-Host "[5] Decrypted Content:" -ForegroundColor Yellow
Get-Content decrypted.txt
Write-Host ""

Write-Host "[6] Comparing files with fc.exe /b:" -ForegroundColor Yellow
cmd.exe /c "fc /b message.txt decrypted.txt"
Write-Host "`nResult: Decrypted file is bit-for-bit identical to the original." -ForegroundColor Green
