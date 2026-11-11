@echo off
title Les Projets des Stagiaires - Version portable
cd /d "%~dp0"

set "PORTABLE=dist\Les Projets des Stagiaires - Portable.html"

if not exist "%PORTABLE%" (
  echo Generation de la version portable...
  where node >nul 2>nul
  if errorlevel 1 (
    echo Node.js n'est pas installe. Ouvrez simplement index.html dans le navigateur :
    echo il fonctionnera automatiquement en mode portable.
    start "" "index.html"
    exit /b 0
  )
  node build-portable.js
)

if exist "%PORTABLE%" (
  start "" "%PORTABLE%"
) else (
  start "" "index.html"
)
