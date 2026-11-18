@echo off
setlocal
title TLS 1.3 Server (Listening on Port 4433)
echo =====================================================================
echo                EXPERIMENT 4: OPENSSL TLS 1.3 SERVER
echo =====================================================================
echo.
set "PATH=%~dp0;C:\Program Files\Git\mingw64\bin;%PATH%"

if not exist server.crt (
    echo [INFO] server.crt not found. Generating self-signed certificate...
    call openssl req -x509 -newkey rsa:2048 -keyout server.key -out server.crt -days 365 -noenc -subj "/CN=localhost" -addext "subjectAltName=DNS:localhost,IP:127.0.0.1"
)

echo Starting TLS server on port 4433...
echo Command: openssl s_server -accept 4433 -cert server.crt -key server.key -www
echo.
echo =====================================================================
echo SERVER STATUS: RUNNING (Keep this window OPEN!)
echo Now open another Command Prompt window and run 'run_client.bat'
echo =====================================================================
echo.

call openssl s_server -accept 4433 -cert server.crt -key server.key -www
pause
