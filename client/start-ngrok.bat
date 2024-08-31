@echo off

:: Start ngrok and capture the output in the same terminal session
start /b ngrok http 8000

:: Wait for ngrok to initialize
timeout /t 2

:: Fetch the ngrok URL using PowerShell
powershell -Command "$ngrokApiResponse = Invoke-RestMethod http://127.0.0.1:4040/api/tunnels; $ngrokUrl = $ngrokApiResponse.tunnels | Where-Object { $_.proto -eq 'https' } | Select-Object -ExpandProperty public_url; Write-Output $ngrokUrl" > ngrok_url.txt

:: Read the ngrok URL from the file
set /p NGROK_URL=<ngrok_url.txt

:: Debug output to check the fetched URL
echo Fetched ngrok URL: %NGROK_URL%

:: Check if the URL was found
if "%NGROK_URL%"=="" (
  echo Failed to get ngrok URL. Make sure ngrok is running.
  exit /b 1
)

:: Update the .env file
powershell -Command "(Get-Content .env) -replace 'API_URL=.*', 'API_URL=%NGROK_URL%' | Set-Content .env"

:: Debug output to confirm the .env file update
echo Updated .env with new ngrok URL: %NGROK_URL%