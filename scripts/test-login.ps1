$url = "http://localhost:1337/api/auth/local"
$body = @{
    identifier = "admin"
    password = "123"
} | ConvertTo-Json

Write-Host "Testing login to: $url"
Write-Host "Payload: $body"

try {
    $response = Invoke-RestMethod -Uri $url -Method Post -ContentType "application/json" -Body $body -ErrorAction Stop
    Write-Host "✅ Login Successful!" -ForegroundColor Green
    Write-Host "User: $($response.user | ConvertTo-Json)"
} catch {
    Write-Host "❌ Login Failed" -ForegroundColor Red
    $stream = $_.Exception.Response.GetResponseStream()
    if ($stream) {
        $reader = New-Object System.IO.StreamReader($stream)
        $errorBody = $reader.ReadToEnd()
        Write-Host "Error Response: $errorBody" -ForegroundColor Yellow
    } else {
        Write-Host "Error: $_" -ForegroundColor Yellow
    }
}
