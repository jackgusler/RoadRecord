@echo off

:: Start LocalTunnel and capture the output in the same terminal session
start /b cmd /c "lt --port 8000 > localtunnel_url.txt"

:: Wait for LocalTunnel to initialize
timeout /t 2

:: Extract the URL using PowerShell
for /f "delims=" %%a in ('powershell -Command "Get-Content localtunnel_url.txt | Select-String -Pattern 'your url is:' | ForEach-Object { $_.Line -replace 'your url is: ', '' }"') do set LOCALTUNNEL_URL=%%a

:: Check if the URL was found
if "%LOCALTUNNEL_URL%"=="" (
    powershell -Command "Write-Host 'Failed to fetch LocalTunnel URL' -ForegroundColor Red"
    exit /b 1
)

:: Update the .env file
powershell -Command "(Get-Content .env) -replace 'API_URL=.*', 'API_URL=%LOCALTUNNEL_URL%' | Set-Content .env"

:: Debug output to confirm the .env file update
powershell -Command "Write-Host 'Updated .env' -ForegroundColor Green"