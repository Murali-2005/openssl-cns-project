@echo off
setlocal
echo Running Automated AES-256-CBC Demo (Password: Student123)...
set "PATH=%~dp0;C:\Program Files\Git\mingw64\bin;%PATH%"

echo 1. Displaying original message:
type message.txt
echo.

echo 2. Encrypting with password 'Student123'...
call openssl enc -aes-256-cbc -salt -pbkdf2 -iter 100000 -in message.txt -out encrypted.bin -pass pass:Student123
if %ERRORLEVEL% NEQ 0 ( echo Failed to encrypt & exit /b 1 )
echo Encrypted to encrypted.bin successfully.
echo.

echo 3. Decrypting with password 'Student123'...
call openssl enc -d -aes-256-cbc -pbkdf2 -iter 100000 -in encrypted.bin -out decrypted.txt -pass pass:Student123
if %ERRORLEVEL% NEQ 0 ( echo Failed to decrypt & exit /b 1 )
echo Decrypted to decrypted.txt successfully.
echo.

echo 4. Comparing original and decrypted:
fc /b message.txt decrypted.txt
echo.
