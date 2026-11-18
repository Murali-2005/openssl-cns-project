@echo off
setlocal
echo Running Automated RSA-2048 Demo...
set "PATH=%~dp0;C:\Program Files\Git\mingw64\bin;%PATH%"

echo 1. Generating RSA-2048 private key...
call openssl genpkey -algorithm RSA -out private.pem -pkeyopt rsa_keygen_bits:2048
if %ERRORLEVEL% NEQ 0 ( echo Failed genpkey & exit /b 1 )

echo 2. Extracting public key...
call openssl pkey -in private.pem -pubout -out public.pem
if %ERRORLEVEL% NEQ 0 ( echo Failed pubout & exit /b 1 )

echo 3. Encrypting message.txt with public key...
call openssl pkeyutl -encrypt -pubin -inkey public.pem -in message.txt -out encrypted.bin -pkeyopt rsa_padding_mode:oaep -pkeyopt rsa_oaep_md:sha256
if %ERRORLEVEL% NEQ 0 ( echo Failed encrypt & exit /b 1 )

echo 4. Decrypting encrypted.bin with private key...
call openssl pkeyutl -decrypt -inkey private.pem -in encrypted.bin -out decrypted.txt -pkeyopt rsa_padding_mode:oaep -pkeyopt rsa_oaep_md:sha256
if %ERRORLEVEL% NEQ 0 ( echo Failed decrypt & exit /b 1 )

echo 5. Comparing original and decrypted:
fc /b message.txt decrypted.txt
echo.
