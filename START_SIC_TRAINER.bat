@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is required. Install the current LTS release from https://nodejs.org/
  pause
  exit /b 1
)
start "SIC Trainer" http://localhost:3000/
node server.mjs 3000
