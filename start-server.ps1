# DESTINOVA - Local Development Server
# PowerShell version

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  DESTINOVA - Local Development Server" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Starting server at http://localhost:4000" -ForegroundColor Green
Write-Host "Navigate to: http://localhost:4000/" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Red
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Change to script directory
Set-Location $PSScriptRoot

# Start Node.js server
npm run dev
