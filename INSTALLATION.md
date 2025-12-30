# Deimos Smart Mirror - Installation Guide

## Prerequisites

### Required Software
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **Python** (v3.8 or higher) - [Download](https://www.python.org/downloads/)
- **Git** - [Download](https://git-scm.com/)

### Optional (for voice features)
- **Microphone** for voice commands
- **Speakers** for audio output

---

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/boost2hire/Deimos-Smart-mirror.git
cd Deimos-Smart-mirror
```

### 2. Frontend Setup (React + Vite)

```bash
# Install Node.js dependencies
npm install

# Or using yarn
yarn install

# Or using pnpm
pnpm install
```

### 3. Backend Setup (Python + FastAPI)

#### Windows:
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt
```

#### Linux/Mac:
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt
```

### 4. Environment Variables Setup

Create a `.env` file in the `backend` directory:

```bash
cd backend
touch .env  # Linux/Mac
# Or create .env file manually on Windows
```

Add the following variables to `.env`:

```env
# OpenAI API Key (required for GPT features)
OPENAI_API_KEY=your_openai_api_key_here

# Picovoice Access Key (already in code, but can be overridden)
PICOVOICE_ACCESS_KEY=pHuGqjUN87BobgYb648sTQ+6goqkj9nKAMNNVPEETaN9RzshEgoanA==

# Weather API (if using external weather service)
WEATHER_API_KEY=your_weather_api_key_here
```

---

## Running the Application

### Start Backend Server

```bash
# Make sure you're in the backend directory with venv activated
cd backend
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac

# Run the FastAPI server
uvicorn app:app --workers 1 --host 0.0.0.0 --port 8000

# Or using Python directly
python -m uvicorn app:app --host 0.0.0.0 --port 8000
```

The backend will run on: `http://localhost:8000`

### Start Frontend Server

Open a **new terminal** window:

```bash
# Make sure you're in the project root directory
npm run dev
```

The frontend will run on: `http://localhost:8080`

---

## Project Structure

```
Deimos-Smart-mirror/
├── backend/                 # Python FastAPI backend
│   ├── app.py              # Main FastAPI application
│   ├── server.py           # Alternative server setup
│   ├── command_handler.py  # Command processing
│   ├── intent_router.py    # Intent routing
│   ├── handlers/           # Command handlers
│   │   ├── alarm.py
│   │   ├── gpt.py
│   │   └── music.py
│   ├── services/           # External services
│   │   ├── weather.py
│   │   └── youtube.py
│   ├── voice/              # Voice processing
│   │   ├── wake_word.py    # Wake word detection
│   │   ├── stt.py          # Speech-to-text
│   │   └── tts.py          # Text-to-speech
│   └── requirements.txt    # Python dependencies
│
├── src/                    # React frontend
│   ├── components/         # React components
│   ├── hooks/              # Custom React hooks
│   ├── pages/              # Page components
│   └── utils/              # Utility functions
│
├── package.json           # Node.js dependencies
└── vite.config.ts        # Vite configuration
```

---

## Features

- 🎤 **Voice Commands** - Wake word detection using Picovoice
- 🤖 **AI Assistant** - GPT-powered responses
- 🌤️ **Weather** - Real-time weather information
- 🎵 **Music** - YouTube music playback
- ⏰ **Alarms** - Set and manage alarms
- 🔌 **WebSocket** - Real-time communication

---

## Troubleshooting

### Backend Issues

**Port 8000 already in use:**
```bash
# Change port in uvicorn command
uvicorn app:app --host 0.0.0.0 --port 8001
```

**Python dependencies not installing:**
```bash
# Upgrade pip first
pip install --upgrade pip
pip install -r requirements.txt
```

**Picovoice errors:**
- Make sure you have microphone permissions
- Check if `pvporcupine` package installed correctly
- Verify Picovoice access key is valid

### Frontend Issues

**Port 8080 already in use:**
- Vite will automatically use next available port
- Or change port in `vite.config.ts`

**npm install fails:**
```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Backend connection errors:**
- Make sure backend is running on port 8000
- Check `vite.config.ts` proxy settings
- Verify CORS is enabled in backend

---

## Development Commands

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Backend
```bash
# Run with auto-reload (requires uvicorn[standard])
uvicorn app:app --reload --host 0.0.0.0 --port 8000

# Run with multiple workers
uvicorn app:app --workers 4 --host 0.0.0.0 --port 8000
```

---

## API Endpoints

- `GET /` - Health check
- `WebSocket /ws/state` - Real-time state updates
- `POST /api/command` - Send voice commands
- `GET /api/weather` - Get weather data
- `POST /api/youtube` - Search YouTube

---

## Notes

- Backend runs on port **8000**
- Frontend runs on port **8080**
- Frontend proxies `/api` requests to backend
- WebSocket connection for real-time updates
- Voice features require microphone access

---

## Support

For issues or questions, please open an issue on GitHub:
https://github.com/boost2hire/Deimos-Smart-mirror/issues

