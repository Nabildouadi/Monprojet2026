@echo off
setlocal EnableExtensions
title Les Projets des Stagiaires - Version portable
cd /d "%~dp0"

set "PORTABLE=%~dp0dist\Les Projets des Stagiaires - Portable.html"

if exist "%PORTABLE%" goto :ouvrir

cls
echo ============================================================
echo   Les Projets des Stagiaires - VERSION PORTABLE
echo ============================================================
echo.
echo   Le fichier portable n'existe pas encore : generation...
echo.

where node >nul 2>nul
if errorlevel 1 goto :sansnode

node "%~dp0build-portable.js"
if exist "%PORTABLE%" goto :ouvrir

:sansnode
echo.
echo   Node.js n'est pas installe : ouverture directe du dossier.
echo   Le fichier index.html fonctionne aussi en mode portable.
echo.
if exist "%~dp0index.html" (
  start "" "%~dp0index.html"
) else (
  start "" "%~dp0"
)
exit /b 0

:ouvrir
echo ============================================================
echo   Les Projets des Stagiaires - VERSION PORTABLE
echo ============================================================
echo.
echo   Fichier : "%PORTABLE%"
echo   Aucun serveur, aucune installation : ouverture directe.
echo.
start "" "%PORTABLE%"
exit /b 0
