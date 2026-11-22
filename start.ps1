# Smart Mess Management System - Quick Start Script for Windows PowerShell

Write-Host "==========================================================" -ForegroundColor DarkGreen
Write-Host "         SMART MESS MANAGEMENT SYSTEM - LAUNCHER          " -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor DarkGreen
Write-Host ""

# 1. Check for .env.local file
if (-not (Test-Path ".env.local")) {
    Write-Host "[*] .env.local not found. Creating from .env.example..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env.local"
    Write-Host "[+] .env.local initialized with default configuration." -ForegroundColor Green
} else {
    Write-Host "[+] Environment configuration (.env.local) detected." -ForegroundColor Gray
}

# 2. Check for node_modules
if (-not (Test-Path "node_modules")) {
    Write-Host "[*] node_modules not detected. Installing dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[!] Dependency installation failed. Please check error logs." -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "[+] Node dependencies already installed." -ForegroundColor Gray
}

Write-Host ""
Write-Host "----------------------------------------------------------" -ForegroundColor DarkGray
Write-Host ""
Write-Host "----------------------------------------------------------" -ForegroundColor DarkGray
Write-Host ""
Write-Host "[*] Starting Next.js development server at http://localhost:3000 ..." -ForegroundColor Green
Write-Host ""

# 3. Launch Development Server
npm run dev
