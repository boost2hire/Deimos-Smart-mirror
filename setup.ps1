# Deimos Smart Mirror - Quick Setup Script for Windows
# Run this script in PowerShell: .\setup.ps1

Write-Host "🚀 Deimos Smart Mirror - Setup Script" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js
Write-Host "📦 Checking Node.js..." -ForegroundColor Yellow
$nodeVersion = node --version 2>$null
if ($nodeVersion) {
    Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "❌ Node.js not found! Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Check Python
Write-Host "🐍 Checking Python..." -ForegroundColor Yellow
$pythonVersion = python --version 2>$null
if ($pythonVersion) {
    Write-Host "✅ Python found: $pythonVersion" -ForegroundColor Green
} else {
    Write-Host "❌ Python not found! Please install Python from https://www.python.org/" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📥 Installing Frontend Dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Frontend installation failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Frontend dependencies installed" -ForegroundColor Green

Write-Host ""
Write-Host "📥 Setting up Backend..." -ForegroundColor Yellow
cd backend

# Create virtual environment
if (-Not (Test-Path "venv")) {
    Write-Host "Creating Python virtual environment..." -ForegroundColor Yellow
    python -m venv venv
}

# Activate virtual environment
Write-Host "Activating virtual environment..." -ForegroundColor Yellow
& .\venv\Scripts\Activate.ps1

# Upgrade pip
Write-Host "Upgrading pip..." -ForegroundColor Yellow
python -m pip install --upgrade pip

# Install requirements
Write-Host "Installing Python dependencies..." -ForegroundColor Yellow
pip install -r requirements.txt
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Backend installation failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Backend dependencies installed" -ForegroundColor Green

# Create .env file if it doesn't exist
if (-Not (Test-Path ".env")) {
    Write-Host ""
    Write-Host "📝 Creating .env file..." -ForegroundColor Yellow
    @"
# OpenAI API Key (required for GPT features)
OPENAI_API_KEY=your_openai_api_key_here

# Picovoice Access Key
PICOVOICE_ACCESS_KEY=pHuGqjUN87BobgYb648sTQ+6goqkj9nKAMNNVPEETaN9RzshEgoanA==

# Weather API (optional)
WEATHER_API_KEY=your_weather_api_key_here
"@ | Out-File -FilePath ".env" -Encoding utf8
    Write-Host "✅ .env file created. Please update it with your API keys!" -ForegroundColor Green
} else {
    Write-Host "✅ .env file already exists" -ForegroundColor Green
}

cd ..

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "✅ Setup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "To start the application:" -ForegroundColor Yellow
Write-Host "1. Backend: cd backend && venv\Scripts\activate && uvicorn app:app --host 0.0.0.0 --port 8000" -ForegroundColor White
Write-Host "2. Frontend: npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Don't forget to update backend/.env with your API keys!" -ForegroundColor Yellow

