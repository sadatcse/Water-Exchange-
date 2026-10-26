@echo off
rem Double-click to build the cPanel upload package (water-exchange-cpanel.zip). See DEPLOY-CPANEL.md.
cd /d "%~dp0"
call npm run cpanel
echo.
pause
