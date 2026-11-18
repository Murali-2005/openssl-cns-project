@echo off
REM OpenSSL CLI Wrapper for Windows
REM Automatically locates OpenSSL if not in system PATH

where openssl.exe >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    openssl.exe %*
    exit /b %ERRORLEVEL%
)

if exist "C:\Program Files\Git\mingw64\bin\openssl.exe" (
    "C:\Program Files\Git\mingw64\bin\openssl.exe" %*
    exit /b %ERRORLEVEL%
)

if exist "C:\Program Files\OpenSSL-Win64\bin\openssl.exe" (
    "C:\Program Files\OpenSSL-Win64\bin\openssl.exe" %*
    exit /b %ERRORLEVEL%
)

if exist "C:\Program Files\Git\usr\bin\openssl.exe" (
    "C:\Program Files\Git\usr\bin\openssl.exe" %*
    exit /b %ERRORLEVEL%
)

echo [ERROR] OpenSSL was not found on your system.
echo Please ensure Git for Windows or OpenSSL-Win64 is installed.
exit /b 1
