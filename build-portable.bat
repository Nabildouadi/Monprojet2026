@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js n'est pas installé sur cet ordinateur.
  echo Installez-le depuis https://nodejs.org puis relancez ce fichier.
  pause
  exit /b 1
)
node build-portable.js
pause
