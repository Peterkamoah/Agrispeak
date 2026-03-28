# AgriSpeak AI Assistant

AgriSpeak is a production-grade, modular MVP web application that provides agricultural advice to Ghanaian farmers through a Twi-English conversational interface. 

## Architecture
- **Backend**: Node.js/Express (Laravel-inspired modular architecture)
- **Frontend**: Vue 3 + Vite, Pinia, Tailwind CSS, Lucide Icons
- **AI Integration**: OpenAI/Gemini context abstraction
- **Translation**: GhanaNLP integration

## Setup Instructions

### 1. Backend
1. Navigate to the `backend` directory: `cd backend`
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and fill in your API keys (OpenAI, GhanaNLP)
4. Start the server: `npm run dev`

### 2. Frontend
1. Navigate to the `frontend` directory: `cd frontend`
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env`
4. Start the Vite dev server: `npm run dev`

## Usage
Open your browser to the local Vite URL (typically http://localhost:5173). 
You can type messages in English or Twi and the AgriSpeak assistant will reply with locally-relevant agricultural advice.
