@echo off
setlocal
title Master Suite - Run OpenSSL Experiments (AES, RSA, SHA-256)
echo =====================================================================
echo       OPENSSL CRYPTOGRAPHY ^& NETWORK SECURITY PROJECT SUITE
echo =====================================================================
echo.
set "PATH=%~dp0;C:\Program Files\Git\mingw64\bin;%PATH%"

echo Checking OpenSSL binary...
call openssl version
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] OpenSSL not found! Please check PATH or Git installation.
    pause
    exit /b 1
)
echo.

echo =====================================================================
echo [TEST 1/3] EXPERIMENT 1: AES-256-CBC SYMMETRIC ENCRYPTION
echo =====================================================================
cd "%~dp001_AES_Encryption"
call run_demo_automated.bat
if %ERRORLEVEL% NEQ 0 ( echo [FAIL] AES Test Failed & pause & exit /b 1 )
echo [PASS] AES-256-CBC encryption and decryption verified!
echo.

echo =====================================================================
echo [TEST 2/3] EXPERIMENT 2: RSA-2048 ASYMMETRIC CRYPTOGRAPHY
echo =====================================================================
cd "%~dp002_RSA_Cryptography"
call run_demo_automated.bat
if %ERRORLEVEL% NEQ 0 ( echo [FAIL] RSA Test Failed & pause & exit /b 1 )
echo [PASS] RSA-2048 keypair generation and encryption verified!
echo.

echo =====================================================================
echo [TEST 3/3] EXPERIMENT 3: SHA-256 HASHING ^& AVALANCHE EFFECT
echo =====================================================================
cd "%~dp003_SHA256_Hashing"
call run_demo_automated.bat
if %ERRORLEVEL% NEQ 0 ( echo [FAIL] SHA Test Failed & pause & exit /b 1 )
echo [PASS] SHA-256 Avalanche Effect verified!
echo.

echo =====================================================================
echo ALL OPENSSL EXPERIMENTS COMPLETED WITH 100%% SUCCESS!
echo =====================================================================
cd "%~dp0"
pause
