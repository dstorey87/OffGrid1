# Comprehensive Website Testing Script
$pages = @(
    @{name="Homepage"; url="http://localhost:3000"; expected="Complete Green Technology"},
    @{name="Solar Load Analysis"; url="http://localhost:3000/solar-calculators/load-analysis"; expected="Load Analysis Calculator"},
    @{name="Battery Sizing"; url="http://localhost:3000/solar-calculators/battery-sizing"; expected="Battery Sizing Calculator"},
    @{name="Panel Sizing"; url="http://localhost:3000/solar-calculators/panel-sizing"; expected="Panel Sizing Calculator"},
    @{name="Rainwater Harvesting"; url="http://localhost:3000/green-calculators/rainwater-harvesting"; expected="Rainwater"},
    @{name="Greywater Systems"; url="http://localhost:3000/green-calculators/greywater-systems"; expected="Greywater"},
    @{name="Wind Power"; url="http://localhost:3000/green-calculators/wind-power"; expected="Wind Power"},
    @{name="Hydroponics"; url="http://localhost:3000/green-calculators/hydroponics"; expected="Hydroponics"},
    @{name="Portugal Guide"; url="http://localhost:3000/portugal-guide"; expected="Portugal"},
    @{name="Shop"; url="http://localhost:3000/shop"; expected="Shop"},
    @{name="Services"; url="http://localhost:3000/services"; expected="Services"}
)

Write-Host "`n========== WEBSITE TESTING REPORT ==========`n" -ForegroundColor Cyan

$passed = 0
$failed = 0

foreach ($page in $pages) {
    Write-Host "Testing: $($page.name)..." -NoNewline
    try {
        $response = curl -s $page.url
        if ($response -match $page.expected) {
            Write-Host " ✓ PASS" -ForegroundColor Green
            $passed++
        } else {
            Write-Host " ✗ FAIL (content not found)" -ForegroundColor Red
            $failed++
        }
    } catch {
        Write-Host " ✗ FAIL (error)" -ForegroundColor Red
        $failed++
    }
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "RESULTS: $passed passed, $failed failed" -ForegroundColor $(if ($failed -eq 0) { "Green" } else { "Yellow" })
Write-Host "========================================`n" -ForegroundColor Cyan
