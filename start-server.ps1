# DESTINOVA - Local Development Server
# PowerShell version

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  DESTINOVA - Local Development Server" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Starting server at http://localhost:8000" -ForegroundColor Green
Write-Host "Navigate to: http://localhost:8000/html/index.html" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Red
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Python is installed
if (Get-Command python -ErrorAction SilentlyContinue) {
    # Change to script directory
    Set-Location $PSScriptRoot
    
    # Start Python HTTP server
    python -m http.server 8000
} else {
    Write-Host "ERROR: Python is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Python from https://www.python.org/downloads/" -ForegroundColor Yellow
    Pause
}
