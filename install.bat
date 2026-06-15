@echo off
setlocal EnableDelayedExpansion
title WebDev - Dependency Installer

echo ============================================
echo  WebDev Dependency Installer
echo ============================================
echo.

:: ── 1. Check Node.js ─────────────────────────
echo [1/4] Checking for Node.js...
where node >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Node.js is not installed or not on PATH.
    echo         Download it from https://nodejs.org  ^(LTS recommended^)
    echo         Minimum required version: 18.x
    pause
    exit /b 1
)

for /f "tokens=*" %%v in ('node --version') do set NODE_VERSION=%%v
echo [OK] Node.js found: %NODE_VERSION%

:: Verify minimum version (18)
for /f "tokens=1 delims=." %%m in ("%NODE_VERSION:v=%") do set NODE_MAJOR=%%m
if %NODE_MAJOR% lss 18 (
    echo [ERROR] Node.js %NODE_VERSION% is too old. Version 18 or higher is required.
    echo         Download the latest LTS from https://nodejs.org
    pause
    exit /b 1
)

:: ── 2. Check npm ──────────────────────────────
echo.
echo [2/4] Checking for npm...
where npm >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [ERROR] npm is not found. Reinstalling Node.js should fix this.
    pause
    exit /b 1
)

for /f "tokens=*" %%v in ('npm --version') do set NPM_VERSION=%%v
echo [OK] npm found: v%NPM_VERSION%

:: ── 3. Verify package.json exists ────────────
echo.
echo [3/4] Verifying project files...
if not exist package.json (
    echo [ERROR] package.json not found. Make sure you are running this script
    echo         from the root of the project directory.
    pause
    exit /b 1
)
echo [OK] package.json found.

:: ── 4. Install dependencies ───────────────────
echo.
echo [4/4] Installing npm dependencies...
echo       (this may take a moment)
echo.

npm install
if %ERRORLEVEL% neq 0 (
    echo.
    echo [ERROR] npm install failed with exit code %ERRORLEVEL%.
    echo         Common fixes:
    echo           - Check your internet connection
    echo           - Delete the node_modules folder and try again
    echo           - Run:  npm cache clean --force
    pause
    exit /b 1
)

:: ── Verification ──────────────────────────────
echo.
echo [VERIFY] Checking node_modules...
if not exist node_modules (
    echo [ERROR] node_modules folder was not created. Installation may have failed silently.
    pause
    exit /b 1
)
echo [OK] node_modules folder exists.

:: Count installed packages
set PKG_COUNT=0
for /d %%d in (node_modules\*) do set /a PKG_COUNT+=1
echo [OK] Packages installed: %PKG_COUNT%

echo.
echo ============================================
echo  All dependencies installed successfully!
echo ============================================
echo.
pause
exit /b 0
