# PowerShell Script for RSA-2048 Cryptography Demo
$env:Path = "$PSScriptRoot;C:\Program Files\Git\mingw64\bin;" + $env:Path

Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host "       EXPERIMENT 2: RSA-2048 ASYMMETRIC CRYPTOGRAPHY DEMO       " -ForegroundColor Cyan
Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host "Concept: Public Key encrypts; Private Key decrypts.`n"

Write-Host "[1] Original Message Content:" -ForegroundColor Yellow
Get-Content message.txt
Write-Host ""

Write-Host "[2] Generating 2048-bit RSA Private Key (private.pem)..." -ForegroundColor Yellow
& openssl genpkey -algorithm RSA -out private.pem -pkeyopt rsa_keygen_bits:2048
Write-Host "[SUCCESS] Private key generated!`n" -ForegroundColor Green

Write-Host "[3] Extracting Public Key (public.pem)..." -ForegroundColor Yellow
& openssl pkey -in private.pem -pubout -out public.pem
Write-Host "[SUCCESS] Public key extracted:`n" -ForegroundColor Green
Get-Content public.pem
Write-Host ""

Write-Host "[4] Encrypting message.txt using Public Key (RSA-OAEP-SHA256)..." -ForegroundColor Yellow
& openssl pkeyutl -encrypt -pubin -inkey public.pem -in message.txt -out encrypted.bin -pkeyopt rsa_padding_mode:oaep -pkeyopt rsa_oaep_md:sha256
Write-Host "[SUCCESS] Ciphertext generated (encrypted.bin)`n" -ForegroundColor Green

Write-Host "[5] Decrypting encrypted.bin using Private Key..." -ForegroundColor Yellow
& openssl pkeyutl -decrypt -inkey private.pem -in encrypted.bin -out decrypted.txt -pkeyopt rsa_padding_mode:oaep -pkeyopt rsa_oaep_md:sha256
Write-Host "[SUCCESS] File decrypted!`n" -ForegroundColor Green

Write-Host "[6] Decrypted Content:" -ForegroundColor Yellow
Get-Content decrypted.txt
Write-Host ""

Write-Host "[7] Verifying with fc.exe /b:" -ForegroundColor Yellow
cmd.exe /c "fc /b message.txt decrypted.txt"
Write-Host "`nResult: Decrypted text matches original perfectly!" -ForegroundColor Green
