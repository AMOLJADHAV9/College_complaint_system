# Test Authentication Script

# Test Signup
Write-Host "Testing Signup..."
$signupBody = @{
    username = "amol"
    email = "amol@example.com"
    password = "password123"
} | ConvertTo-Json

try {
    $signupResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/signup" -Method POST -ContentType "application/json" -Body $signupBody
    Write-Host "Signup Success:" -ForegroundColor Green
    $signupResponse | ConvertTo-Json
} catch {
    Write-Host "Signup Error:" -ForegroundColor Red
    Write-Host $_.Exception.Message
}

Write-Host "`n" -NoNewline

# Test Login
Write-Host "Testing Login..."
$loginBody = @{
    username = "amol"
    password = "password123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method POST -ContentType "application/json" -Body $loginBody
    Write-Host "Login Success:" -ForegroundColor Green
    $loginResponse | ConvertTo-Json
} catch {
    Write-Host "Login Error:" -ForegroundColor Red
    Write-Host $_.Exception.Message
}