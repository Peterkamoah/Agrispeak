# AgriSpeak MVP

AgriSpeak is a production-grade web application built to serve as an AI-powered agricultural assistant for Ghanaian farmers. It supports seamless translation between English and Twi using the Khaya/GhanaNLP API and uses **Google Gemini** for agricultural advice.

## Project Structure
This repository combines the frontend and backend in a monorepo setup.
- `/frontend` - Vue 3 + Vite + Tailwind CSS app
- `/backend` - Node.js Express modular application

## Tech Stack
- Frontend: Vue 3, Tailwind CSS, shadcn-like headless UI primitives
- Backend: Node.js, Express, Zod for schema validation
- LLM Provider: Google Gemini (`GOOGLE_API_KEY`, `GEMINI_MODEL`)
- Translation Provider: Khaya (`KHAYA_API_KEY`, `KHAYA_BASE_URL`)

---

## Setup Instructions

### 1. Environment variables

Create a `.env` file at the **repository root** (next to `frontend/` and `backend/`) using `.env.example` as a template. The backend loads this file first, then `backend/.env` if present. Keys include `GOOGLE_API_KEY`, `KHAYA_API_KEY`, `GEMINI_MODEL`, `KHAYA_BASE_URL`, and optional `VITE_*` variables for the frontend.

### 2. Backend Setup

Navigate to the `backend` directory:
```bash
cd backend
```

Install dependencies:
```bash
npm install
```

Set up environment variables (root `.env` or copy `backend/.env.example` to `backend/.env`):
```bash
cp .env.example .env
```

Start the Development Server:
```bash
npm run dev
```
(Server will default to http://localhost:3000)

### 3. Frontend Setup

Open a new terminal tab, then navigate to `frontend`:
```bash
cd frontend
```

Install dependencies:
```bash
npm install
```

Start Vite Server:
```bash
npm run dev
```

### 4. Usage
Open `http://localhost:5173` in your browser. Start interacting in English or Twi! The backend will automatically handle the AI completion and translations required.

## API Provider Implementations (Native Fetch)
The backend does **not** use the official Google or OpenAI SDK packages. It calls the Gemini and Khaya HTTP APIs with Node's built-in `fetch` inside `/backend/src/providers/`. Ensure Node >= 18.x.
