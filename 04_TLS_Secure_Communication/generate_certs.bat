@echo off
setlocal
title Generate TLS Server Certificate
echo =====================================================================
echo       STEP 1: GENERATE SELF-SIGNED TLS CERTIFICATE ^& KEY
echo =====================================================================
echo.
set "PATH=%~dp0;C:\Program Files\Git\mingw64\bin;%PATH%"

echo Command:
echo openssl req -x509 -newkey rsa:2048 -keyout server.key -out server.crt -days 365 -noenc -subj "/CN=localhost" -addext "subjectAltName=DNS:localhost,IP:127.0.0.1"
echo.

call openssl req -x509 -newkey rsa:2048 -keyout server.key -out server.crt -days 365 -noenc -subj "/CN=localhost" -addext "subjectAltName=DNS:localhost,IP:127.0.0.1"
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to generate certificate!
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo [SUCCESS] server.crt and server.key created!
echo.
echo Inspecting certificate summary:
call openssl x509 -in server.crt -noout -subject -issuer -dates
echo.
echo You can now run 'start_server.bat' in one window and 'run_client.bat' in another.
echo.
pause
