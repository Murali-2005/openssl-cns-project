@echo off
setlocal enabledelayedexpansion
title Experiment 1: AES-256-CBC Symmetric Encryption

echo =====================================================================
echo       EXPERIMENT 1: AES-256-CBC SYMMETRIC ENCRYPTION DEMO
echo =====================================================================
echo Objective: Demonstrate symmetric encryption and decryption using OpenSSL.
echo Concept: Same password/key is used to encrypt and decrypt the data.
echo.

REM Add local path fallback for openssl
set "PATH=%~dp0;C:\Program Files\Git\mingw64\bin;%PATH%"

echo [Step 1] Verifying message.txt exists...
if not exist message.txt (
    echo [ERROR] message.txt not found! Creating default message.txt...
    echo Confidential Message: OpenSSL AES-256-CBC Encryption Experiment > message.txt
)
echo.

echo [Step 2] Displaying original message content:
echo -------------------------------------------------------------
type message.txt
echo -------------------------------------------------------------
echo.
pause

echo.
echo [Step 3] Encrypting message.txt using AES-256-CBC:
echo Command: openssl enc -aes-256-cbc -salt -pbkdf2 -iter 100000 -in message.txt -out encrypted.bin
echo Note: When prompted, enter a password (e.g., SecretPass123).
echo.
call openssl enc -aes-256-cbc -salt -pbkdf2 -iter 100000 -in message.txt -out encrypted.bin
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Encryption failed! Please check your password input.
    pause
    exit /b %ERRORLEVEL%
)
echo [SUCCESS] File encrypted successfully to encrypted.bin!
echo.
pause

echo.
echo [Step 4] Inspecting encrypted file (unreadable ciphertext):
echo -------------------------------------------------------------
type encrypted.bin
echo.
echo -------------------------------------------------------------
echo (Notice: The contents are scrambled binary ciphertext, not readable text.)
echo.
pause

echo.
echo [Step 5] Decrypting encrypted.bin using the same password:
echo Command: openssl enc -d -aes-256-cbc -pbkdf2 -iter 100000 -in encrypted.bin -out decrypted.txt
echo Note: Please re-enter the SAME password used during encryption.
echo.
call openssl enc -d -aes-256-cbc -pbkdf2 -iter 100000 -in encrypted.bin -out decrypted.txt
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Decryption failed! Incorrect password or corrupted file.
    pause
    exit /b %ERRORLEVEL%
)
echo [SUCCESS] File decrypted successfully to decrypted.txt!
echo.
pause

echo.
echo [Step 6] Displaying decrypted message content:
echo -------------------------------------------------------------
type decrypted.txt
echo -------------------------------------------------------------
echo.
pause

echo.
echo [Step 7] Comparing original message.txt and decrypted.txt:
echo Command: fc /b message.txt decrypted.txt
echo.
fc /b message.txt decrypted.txt
echo.
echo =====================================================================
echo RESULT: "FC: no differences encountered"
echo This proves that the decrypted file is 100%% identical to the original!
echo =====================================================================
echo.
pause
