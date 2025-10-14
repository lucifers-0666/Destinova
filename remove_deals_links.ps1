# PowerShell script to remove Deals links from all HTML files

$files = @(
    "html\about-us.html",
    "html\contact-us.html",
    "html\destinations.html",
    "html\faq.html",
    "html\flight-status.html",
    "html\my-bookings.html",
    "html\offers.html",
    "html\passenger-details.html",
    "html\payment-history.html",
    "html\payment.html",
    "html\profile.html",
    "html\results.html",
    "html\reviews.html",
    "html\sign-up.html",
    "html\booking-confirmation.html"
)

foreach ($file in $files) {
    $filePath = Join-Path $PSScriptRoot $file
    
    if (Test-Path $filePath) {
        Write-Host "Processing: $file"
        
        # Read content
        $content = Get-Content -Path $filePath -Raw
        
        # Remove desktop Deals link
        $content = $content -replace '\s*<li><a href="offers\.html"><i class="fas fa-tags"></i><span>Deals</span></a></li>\r?\n', ''
        
        # Remove mobile Deals link
        $content = $content -replace '\s*<li><a href="offers\.html"><i class="fas fa-tags"></i> Deals</a></li>\r?\n', ''
        
        # Write back
        Set-Content -Path $filePath -Value $content -NoNewline
        
        Write-Host "  ✓ Completed: $file" -ForegroundColor Green
    } else {
        Write-Host "  ✗ File not found: $file" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "All files processed!" -ForegroundColor Cyan
