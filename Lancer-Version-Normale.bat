@echo off
setlocal EnableExtensions
title Les Projets des Stagiaires - Version normale (PHP + MySQL)
cd /d "%~dp0"

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

set "MYSQL=non"
netstat -an 2>nul | findstr /c:":3306 " >nul
if not errorlevel 1 set "MYSQL=oui"

cls
echo ============================================================
echo   Les Projets des Stagiaires - MODE NORMAL (PHP + MySQL)
echo ============================================================
echo.
echo   PHP     : %PHP%
echo   Adresse : http://127.0.0.1:%PORT%/index.html
if "%MYSQL%"=="oui" (
  echo   MySQL   : detecte sur le port 3306
) else (
  echo   MySQL   : NON detecte - demarrez XAMPP / WAMP / Laragon
)
echo.
echo   1. Premiere utilisation : lancez "Installer-Base.bat".
echo   2. Laissez cette fenetre OUVERTE pendant l'utilisation.
echo   3. Pour arreter le site : fermez cette fenetre.
echo.
echo   Ouverture du navigateur...

ping -n 3 127.0.0.1 >nul 2>nul
start "" "http://127.0.0.1:%PORT%/index.html"

"%PHP%" -S 127.0.0.1:%PORT%

echo.
echo ------------------------------------------------------------
echo   Le serveur PHP s'est arrete.
echo ------------------------------------------------------------
pause
exit /b 0

:sansphp
cls
echo.
echo   PHP n'a pas ete trouve sur cet ordinateur.
echo.
echo   Solution 1 : demarrez XAMPP, puis copiez ce dossier dans
echo                C:\xampp\htdocs et ouvrez :
echo                http://localhost/NOM-DU-DOSSIER/index.html
echo   Solution 2 : installez PHP ^(https://www.php.net^) et
echo                relancez ce fichier.
echo.
echo   En attendant, la version portable fonctionne sans PHP.
echo   Ouverture de la version portable...
echo.
call "%~dp0Lancer-Version-Portable.bat"
exit /b 0

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
