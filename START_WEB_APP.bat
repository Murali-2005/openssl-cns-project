@echo off
title Launch Hybrid Encryption Web Application
echo =====================================================================
echo    LAUNCHING HYBRID ENCRYPTION & OPENSSL CNS SUITE IN BROWSER
echo =====================================================================
echo.

set "HTML_FILE=%~dp0web_app\index.html"

REM Try Google Chrome first
if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
    echo Opening in Google Chrome...
    start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" "%HTML_FILE%"
    goto :done
)

if exist "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" (
    echo Opening in Google Chrome...
    start "" "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" "%HTML_FILE%"
    goto :done
)

REM Try Microsoft Edge next
if exist "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" (
    echo Opening in Microsoft Edge...
    start "" "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" "%HTML_FILE%"
    goto :done
)

if exist "C:\Program Files\Microsoft\Edge\Application\msedge.exe" (
    echo Opening in Microsoft Edge...
    start "" "C:\Program Files\Microsoft\Edge\Application\msedge.exe" "%HTML_FILE%"
    goto :done
)

REM Fallback to system default
start "" "%HTML_FILE%"

:done
echo.
echo Application launched successfully!
echo You can now use the interactive Hybrid Encryption & OpenSSL suite.
echo.
pause
