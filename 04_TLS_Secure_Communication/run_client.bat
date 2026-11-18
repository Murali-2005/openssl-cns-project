@echo off
setlocal
title TLS 1.3 Client Connection
echo =====================================================================
echo                EXPERIMENT 4: OPENSSL TLS 1.3 CLIENT
echo =====================================================================
echo.
set "PATH=%~dp0;C:\Program Files\Git\mingw64\bin;%PATH%"

echo Connecting to TLS server at localhost:4433...
echo Command: openssl s_client -connect localhost:4433 -servername localhost -showcerts
echo.
echo INSTRUCTIONS ONCE CONNECTED:
echo 1. Notice the negotiated cipher suite and protocol (TLSv1.3, AES-256-GCM).
echo 2. Type:
echo       GET / HTTP/1.0
echo 3. Press [ENTER] TWICE to send the HTTP request!
echo 4. Observe the HTTP 200 OK server response and TLS certificate details.
echo.
pause

call openssl s_client -connect localhost:4433 -servername localhost -showcerts
pause
