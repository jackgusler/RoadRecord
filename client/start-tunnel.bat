@echo off

:: Start LocalTunnel and capture the output in the same terminal session
start /b cmd /c "lt --port 8000 > localtunnel_url.txt"

:: Wait for LocalTunnel to initialize
timeout /t 2

:: Debug output to check the initial content of the file
echo Initial content of localtunnel_url.txt:
type localtunnel_url.txt

:: Extract the URL using PowerShell
for /f "delims=" %%a in ('powershell -Command "Get-Content localtunnel_url.txt | Select-String -Pattern 'your url is:' | ForEach-Object { $_.Line -replace 'your url is: ', '' }"') do set LOCALTUNNEL_URL=%%a

:: Debug output to check the fetched URL
echo Fetched LocalTunnel URL: %LOCALTUNNEL_URL%

:: Check if the URL was found
if "%LOCALTUNNEL_URL%"=="" (
  echo Failed to get LocalTunnel URL. Make sure LocalTunnel is running.
  exit /b 1
)

:: Update the .env file
powershell -Command "(Get-Content .env) -replace 'API_URL=.*', 'API_URL=%LOCALTUNNEL_URL%' | Set-Content .env"

:: Debug output to confirm the .env file update
echo Updated .env with new LocalTunnel URL: %LOCALTUNNEL_URL%