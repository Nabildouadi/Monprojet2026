@echo off
title Installation de la base MySQL
cd /d "%~dp0"

set "PHP="
if exist "C:\xampp\php\php.exe" set "PHP=C:\xampp\php\php.exe"
if exist "C:\wamp64\bin\php\php8.2.12\php.exe" set "PHP=C:\wamp64\bin\php\php8.2.12\php.exe"
if "%PHP%"=="" (
  where php >nul 2>nul
  if not errorlevel 1 set "PHP=php"
)

if "%PHP%"=="" (
  echo PHP n'a pas ete trouve.
  echo Demarrez XAMPP/WAMP et ouvrez install.php depuis le navigateur.
  pause
  exit /b 1
)

echo ============================================================
echo   Installation de la base de donnees MySQL
echo ============================================================
echo.
echo MySQL doit etre demarre (XAMPP / WAMP).
echo La base "insfp_projets" sera creee automatiquement.
echo.
echo Adresse : http://127.0.0.1:8080/install.php
echo.

start "" cmd /c "timeout /t 3 >nul & start "" http://127.0.0.1:8080/install.php"
"%PHP%" -S 127.0.0.1:8080
