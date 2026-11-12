@echo off
setlocal EnableExtensions
title Les Projets des Stagiaires - Lancement automatique
cd /d "%~dp0"

rem ============================================================
rem  Priorite 1 : serveur portable PHP + MariaDB (dossier serveur)
rem ============================================================
if not exist "%~dp0serveur\php\php.exe" goto :sans_serveur
if not exist "%~dp0serveur\mariadb\bin\mysqld.exe" goto :sans_serveur

cls
echo ============================================================
echo   Les Projets des Stagiaires - INSFP EL HIDHAB 2026
echo ============================================================
echo.
echo   Serveur PHP + MySQL portable detecte.
echo   Demarrage en MODE NORMAL (MySQL) - aucune installation Windows.
echo.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0serveur\serveur.ps1" -Action Start
if errorlevel 5 goto :echec_serveur
if errorlevel 4 goto :echec_serveur
if errorlevel 3 goto :sans_serveur
if errorlevel 1 goto :echec_serveur
exit /b 0

:echec_serveur
echo.
echo   Le serveur portable n'a pas pu demarrer.
echo   Verification : serveur\mysqld.err et serveur\php.err
echo.
echo   Bascule automatique en MODE PORTABLE.
echo.
call "%~dp0Lancer-Version-Portable.bat"
exit /b 0

rem ============================================================
rem  Priorite 2 : PHP + MySQL deja installes (XAMPP / WAMP / Laragon)
rem ============================================================
:sans_serveur
call :chercher_php

set "MYSQL=non"
netstat -an 2>nul | findstr /c:":3306 " >nul
if not errorlevel 1 set "MYSQL=oui"
netstat -an 2>nul | findstr /c:":3307 " >nul
if not errorlevel 1 set "MYSQL=oui"

if not defined PHP goto :portable
if "%MYSQL%"=="non" goto :portable

cls
echo ============================================================
echo   Les Projets des Stagiaires - INSFP EL HIDHAB 2026
echo ============================================================
echo.
echo   PHP et MySQL sont disponibles : demarrage en MODE NORMAL.
echo.
call "%~dp0Lancer-Version-Normale.bat"
exit /b 0

:portable
cls
echo ============================================================
echo   Les Projets des Stagiaires - INSFP EL HIDHAB 2026
echo ============================================================
echo.
if not defined PHP (
  echo   PHP n'est pas installe sur cet ordinateur.
) else (
  echo   MySQL n'est pas demarre ^(XAMPP / WAMP / Laragon^).
)
echo   Demarrage en MODE PORTABLE : aucune installation necessaire.
echo.
call "%~dp0Lancer-Version-Portable.bat"
exit /b 0

rem ============================================================
rem  Recherche de PHP (XAMPP, WAMP, Laragon, dossier local, PATH)
rem ============================================================
:chercher_php
if exist "%~dp0php\php.exe" (
  set "PHP=%~dp0php\php.exe"
  goto :eof
)
if exist "C:\xampp\php\php.exe" (
  set "PHP=C:\xampp\php\php.exe"
  goto :eof
)
for /d %%D in ("C:\wamp64\bin\php\php*") do if exist "%%~fD\php.exe" set "PHP=%%~fD\php.exe"
if defined PHP goto :eof
for /d %%D in ("C:\wamp\bin\php\php*") do if exist "%%~fD\php.exe" set "PHP=%%~fD\php.exe"
if defined PHP goto :eof
for /d %%D in ("C:\laragon\bin\php\php*") do if exist "%%~fD\php.exe" set "PHP=%%~fD\php.exe"
if defined PHP goto :eof
for /d %%D in ("C:\tools\php\php*") do if exist "%%~fD\php.exe" set "PHP=%%~fD\php.exe"
if defined PHP goto :eof
if exist "C:\php\php.exe" (
  set "PHP=C:\php\php.exe"
  goto :eof
)
if exist "C:\Program Files\PHP\php.exe" (
  set "PHP=C:\Program Files\PHP\php.exe"
  goto :eof
)
where php >nul 2>nul
if not errorlevel 1 for /f "delims=" %%P in ('where php 2^>nul') do set "PHP=%%P"
goto :eof
