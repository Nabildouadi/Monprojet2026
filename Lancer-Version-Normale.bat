@echo off
title Les Projets des Stagiaires - Version MySQL / PHP
cd /d "%~dp0"

set "PHP="
if exist "C:\xampp\php\php.exe" set "PHP=C:\xampp\php\php.exe"
if exist "C:\wamp64\bin\php\php8.2.12\php.exe" set "PHP=C:\wamp64\bin\php\php8.2.12\php.exe"
if "%PHP%"=="" (
  where php >nul 2>nul
  if not errorlevel 1 set "PHP=php"
)

if "%PHP%"=="" (
  echo.
  echo PHP n'a pas ete trouve sur cet ordinateur.
  echo.
  echo Solution 1 : demarrez XAMPP, puis copiez ce dossier dans C:\xampp\htdocs
  echo              et ouvrez http://localhost/votre-dossier/index.html
  echo Solution 2 : installez PHP ^(https://www.php.net^) et relancez ce fichier.
  echo En attendant, la version portable fonctionne sans PHP :
  echo              double-cliquez sur "Lancer-Version-Portable.bat".
  echo.
  pause
  exit /b 1
)

echo ============================================================
echo   Les Projets des Stagiaires - MODE NORMAL (MySQL + PHP)
echo ============================================================
echo.
echo 1. MySQL doit etre demarre (XAMPP / WAMP).
echo 2. Si c'est la premiere utilisation, lancez d'abord
echo    "Installer-Base.bat" pour creer la base de donnees.
echo 3. L'adresse s'ouvre automatiquement dans le navigateur.
echo.
echo Adresse : http://127.0.0.1:8080/index.html
echo IMPORTANT : laissez cette fenetre ouverte pendant l'utilisation.
echo.

start "" cmd /c "timeout /t 3 >nul & start "" http://127.0.0.1:8080/index.html"
"%PHP%" -S 127.0.0.1:8080
