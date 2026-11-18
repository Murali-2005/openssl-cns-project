@echo off
setlocal enabledelayedexpansion
title Experiment 3: SHA-256 Cryptographic Hashing and Avalanche Effect

echo =====================================================================
echo       EXPERIMENT 3: SHA-256 HASHING AND AVALANCHE EFFECT DEMO
echo =====================================================================
echo Objective: Demonstrate one-way cryptographic hashing, integrity verification,
echo            and the Avalanche Effect using OpenSSL.
echo Concept: Any modification, even a single character, produces a completely
echo          different fixed-length 256-bit hash.
echo.

set "PATH=%~dp0;C:\Program Files\Git\mingw64\bin;%PATH%"

REM Ensure clean original file
if exist original.bak (
    copy /y original.bak original.txt >nul
) else (
    copy /y original.txt original.bak >nul
)

echo [Step 1] Inspecting original text file (original.txt):
echo -------------------------------------------------------------
type original.txt
echo -------------------------------------------------------------
echo.
pause

echo.
echo [Step 2] Generating SHA-256 hash of original.txt:
echo Command: openssl dgst -sha256 original.txt
echo.
call openssl dgst -sha256 original.txt
echo.
echo [Step 3] Saving original hash to original_hash.txt:
echo Command: openssl dgst -sha256 original.txt ^> original_hash.txt
call openssl dgst -sha256 original.txt > original_hash.txt
echo Hash saved successfully.
echo.
pause

echo.
echo [Step 4] Tampering with the file:
echo Command: echo Tampered data ^>^> original.txt
echo.
echo Tampered data >> original.txt
echo Updated file contents:
echo -------------------------------------------------------------
type original.txt
echo -------------------------------------------------------------
echo.
pause

echo.
echo [Step 5] Generating modified hash and saving to modified_hash.txt:
echo Command: openssl dgst -sha256 original.txt ^> modified_hash.txt
call openssl dgst -sha256 original.txt > modified_hash.txt
call openssl dgst -sha256 original.txt
echo.
pause

echo.
echo [Step 6] Comparing original and modified hashes:
echo Command: fc /b original_hash.txt modified_hash.txt
echo -------------------------------------------------------------
fc /b original_hash.txt modified_hash.txt
echo -------------------------------------------------------------
echo.
echo =====================================================================
echo RESULT: Differences encountered!
echo Notice how appending just a few bytes changed nearly every hex digit.
echo This proves the "Avalanche Effect" and demonstrates how SHA-256
echo immediately detects unauthorized tampering or corruption.
echo =====================================================================
echo.

REM Restore original file for subsequent runs
copy /y original.bak original.txt >nul
pause
