$url = "http://localhost:1337"
Write-Host "Testing connection to: $url"

try {
    $response = Invoke-WebRequest -Uri $url -Method Get -ErrorAction Stop
    Write-Host "✅ Connection Successful! Status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "❌ Connection Failed" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Yellow
    if ($_.Exception.Response) {
        Write-Host "Status: $($_.Exception.Response.StatusCode)"
    }
}
