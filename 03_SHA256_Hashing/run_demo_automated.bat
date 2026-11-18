@echo off
setlocal
echo Running Automated SHA-256 Hashing Demo...
set "PATH=%~dp0;C:\Program Files\Git\mingw64\bin;%PATH%"

if exist original.bak (
    copy /y original.bak original.txt >nul
) else (
    copy /y original.txt original.bak >nul
)

echo 1. Generating original hash:
call openssl dgst -sha256 original.txt > original_hash.txt
type original_hash.txt
echo.

echo 2. Tampering file:
echo Tampered data >> original.txt
echo.

echo 3. Generating modified hash:
call openssl dgst -sha256 original.txt > modified_hash.txt
type modified_hash.txt
echo.

echo 4. Comparing hashes with fc /b (Demonstrating Avalanche Effect):
fc /b original_hash.txt modified_hash.txt
echo.

copy /y original.bak original.txt >nul
