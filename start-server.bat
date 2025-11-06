@echo off
echo ========================================
echo   DESTINOVA - Local Development Server
echo ========================================
echo.
echo Starting server at http://localhost:8000
echo Navigate to: http://localhost:8000/html/index.html
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

cd /d "%~dp0"
python -m http.server 8000
