#!/bin/bash
# Deimos Smart Mirror - Quick Setup Script for Linux/Mac
# Run this script: chmod +x setup.sh && ./setup.sh

echo "🚀 Deimos Smart Mirror - Setup Script"
echo "====================================="
echo ""

# Check Node.js
echo "📦 Checking Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "✅ Node.js found: $NODE_VERSION"
else
    echo "❌ Node.js not found! Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check Python
echo "🐍 Checking Python..."
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version)
    echo "✅ Python found: $PYTHON_VERSION"
else
    echo "❌ Python not found! Please install Python from https://www.python.org/"
    exit 1
fi

echo ""
echo "📥 Installing Frontend Dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ Frontend installation failed!"
    exit 1
fi
echo "✅ Frontend dependencies installed"

echo ""
echo "📥 Setting up Backend..."
cd backend

# Create virtual environment
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Upgrade pip
echo "Upgrading pip..."
pip install --upgrade pip

# Install requirements
echo "Installing Python dependencies..."
pip install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "❌ Backend installation failed!"
    exit 1
fi
echo "✅ Backend dependencies installed"

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo ""
    echo "📝 Creating .env file..."
    cat > .env << EOF
# OpenAI API Key (required for GPT features)
OPENAI_API_KEY=your_openai_api_key_here

# Picovoice Access Key
PICOVOICE_ACCESS_KEY=pHuGqjUN87BobgYb648sTQ+6goqkj9nKAMNNVPEETaN9RzshEgoanA==

# Weather API (optional)
WEATHER_API_KEY=your_weather_api_key_here
EOF
    echo "✅ .env file created. Please update it with your API keys!"
else
    echo "✅ .env file already exists"
fi

cd ..

echo ""
echo "====================================="
echo "✅ Setup Complete!"
echo ""
echo "To start the application:"
echo "1. Backend: cd backend && source venv/bin/activate && uvicorn app:app --host 0.0.0.0 --port 8000"
echo "2. Frontend: npm run dev"
echo ""
echo "Don't forget to update backend/.env with your API keys!"

