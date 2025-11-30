@echo off
echo ========================================
echo   DESTINOVA - Local Development Server
echo ========================================
echo.
echo Starting server at http://localhost:4000
echo Navigate to: http://localhost:4000/
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

cd /d "%~dp0"
npm run dev
