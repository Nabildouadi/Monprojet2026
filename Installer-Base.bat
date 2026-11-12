@echo off
setlocal EnableExtensions
title Installation de la base MySQL
cd /d "%~dp0"

rem ---- Serveur portable PHP + MariaDB fourni avec le projet ----
if exist "%~dp0serveur\php\php.exe" if exist "%~dp0serveur\mariadb\bin\mysqld.exe" (
  powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0serveur\serveur.ps1" -Action Install
  if errorlevel 1 (
    echo.
    echo   Installation automatique impossible. Voir serveur\mysqld.err
    echo.
    pause
  )
  exit /b 0
)

call :chercher_php
if not defined PHP goto :sansphp

rem ---- Recherche d'un port libre (8080 a 8099) ----
set "PORT=8080"
:port_libre
netstat -an 2>nul | findstr /c:":%PORT% " >nul
if not errorlevel 1 (
  set /a PORT+=1
  if %PORT% GTR 8099 goto :sansport
  goto :port_libre
)

netstat -an 2>nul | findstr /c:":3306 " >nul
if errorlevel 1 netstat -an 2>nul | findstr /c:":3307 " >nul
if errorlevel 1 (
  echo.
  echo   ATTENTION : MySQL ne semble pas demarre ^(ports 3306 / 3307^).
  echo   Demarrez XAMPP ou WAMP ^(bouton Start MySQL^), puis relancez.
  echo.
  pause
)

cls
echo ============================================================
echo   Installation de la base de donnees MySQL
echo ============================================================
echo.
echo   Base a creer : insfp_projets
echo   Adresse      : http://127.0.0.1:%PORT%/install.php
echo.
echo   Le navigateur s'ouvre. Suivez les indications de la page.
echo   Laissez cette fenetre ouverte, puis fermez-la a la fin.
echo.

ping -n 3 127.0.0.1 >nul 2>nul
start "" "http://127.0.0.1:%PORT%/install.php"

"%PHP%" -S 127.0.0.1:%PORT% -t "%~dp0"

echo.
echo ------------------------------------------------------------
echo   Serveur arrete. Vous pouvez fermer cette fenetre.
echo ------------------------------------------------------------
pause
exit /b 0

:sansphp
cls
echo.
echo   PHP n'a pas ete trouve sur cet ordinateur.
echo.
echo   Demarrez XAMPP / WAMP puis ouvrez dans le navigateur :
echo       http://localhost/NOM-DU-DOSSIER/install.php
echo.
pause
exit /b 1

:sansport
cls
echo.
echo   Les ports 8080 a 8099 sont tous occupes.
echo   Fermez les anciennes fenetres noires, puis relancez ce fichier.
echo.
pause
exit /b 1

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
