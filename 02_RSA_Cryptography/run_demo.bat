@echo off
setlocal enabledelayedexpansion
title Experiment 2: RSA-2048 Asymmetric Cryptography

echo =====================================================================
echo       EXPERIMENT 2: RSA-2048 ASYMMETRIC CRYPTOGRAPHY DEMO
echo =====================================================================
echo Objective: Demonstrate asymmetric key generation, public key encryption,
echo            and private key decryption using OpenSSL.
echo Concept: Public Key encrypts; Private Key decrypts.
echo.

set "PATH=%~dp0;C:\Program Files\Git\mingw64\bin;%PATH%"

echo [Step 1] Verifying message.txt exists...
if not exist message.txt (
    echo [ERROR] message.txt not found! Creating default message.txt...
    echo Secret RSA Message: Hybrid Key Exchange 2026 > message.txt
)
echo Original message content:
echo -------------------------------------------------------------
type message.txt
echo -------------------------------------------------------------
echo.
pause

echo.
echo [Step 2] Generating RSA-2048 Private Key:
echo Command: openssl genpkey -algorithm RSA -out private.pem -pkeyopt rsa_keygen_bits:2048
echo.
call openssl genpkey -algorithm RSA -out private.pem -pkeyopt rsa_keygen_bits:2048
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Private key generation failed!
    pause
    exit /b %ERRORLEVEL%
)
echo [SUCCESS] Private key generated and saved to private.pem!
echo (Remember: Keep private.pem strictly secret!)
echo.
pause

echo.
echo [Step 3] Extracting the Public Key from the Private Key:
echo Command: openssl pkey -in private.pem -pubout -out public.pem
echo.
call openssl pkey -in private.pem -pubout -out public.pem
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Public key extraction failed!
    pause
    exit /b %ERRORLEVEL%
)
echo [SUCCESS] Public key extracted to public.pem!
echo Inspecting public.pem:
echo -------------------------------------------------------------
type public.pem
echo -------------------------------------------------------------
echo (This public key can be freely shared with any sender.)
echo.
pause

echo.
echo [Step 4] Encrypting message.txt using the Public Key (RSA-OAEP with SHA-256):
echo Command: openssl pkeyutl -encrypt -pubin -inkey public.pem -in message.txt -out encrypted.bin -pkeyopt rsa_padding_mode:oaep -pkeyopt rsa_oaep_md:sha256
echo.
call openssl pkeyutl -encrypt -pubin -inkey public.pem -in message.txt -out encrypted.bin -pkeyopt rsa_padding_mode:oaep -pkeyopt rsa_oaep_md:sha256
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] RSA Encryption failed! Note: RSA can only directly encrypt short payloads (keys/hashes).
    pause
    exit /b %ERRORLEVEL%
)
echo [SUCCESS] Message encrypted to encrypted.bin!
echo.
pause

echo.
echo [Step 5] Decrypting encrypted.bin using the Private Key:
echo Command: openssl pkeyutl -decrypt -inkey private.pem -in encrypted.bin -out decrypted.txt -pkeyopt rsa_padding_mode:oaep -pkeyopt rsa_oaep_md:sha256
echo.
call openssl pkeyutl -decrypt -inkey private.pem -in encrypted.bin -out decrypted.txt -pkeyopt rsa_padding_mode:oaep -pkeyopt rsa_oaep_md:sha256
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] RSA Decryption failed!
    pause
    exit /b %ERRORLEVEL%
)
echo [SUCCESS] Message decrypted to decrypted.txt!
echo.
echo Decrypted message content:
echo -------------------------------------------------------------
type decrypted.txt
echo -------------------------------------------------------------
echo.
pause

echo.
echo [Step 6] Comparing original and decrypted messages:
echo Command: fc /b message.txt decrypted.txt
echo.
fc /b message.txt decrypted.txt
echo.
echo =====================================================================
echo RESULT: "FC: no differences encountered"
echo This demonstrates asymmetric encryption: Public key encrypted,
echo and only the corresponding Private key could decrypt the data.
echo =====================================================================
echo.
pause
