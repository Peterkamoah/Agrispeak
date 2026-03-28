# AgriSpeak MVP

AgriSpeak is a production-grade web application built to serve as an AI-powered agricultural assistant for Ghanaian farmers. It supports seamless translation between English and Twi using the GhanaNLP Khaya API and integrates with OpenAI for providing high-quality agricultural advice.

## Project Structure
This repository combines the frontend and backend in a monorepo setup.
- `/frontend` - Vue 3 + Vite + Tailwind CSS app
- `/backend` - Node.js Express modular application

## Tech Stack
- Frontend: Vue 3, Tailwind CSS, shadcn-like headless UI primitives
- Backend: Node.js, Express, Zod for schema validation
- LLM Provider: OpenAI
- Translation Provider: GhanaNLP Khaya API

---

## Setup Instructions

### 1. Backend Setup

Navigate to the `backend` directory:
```bash
cd backend
```

Install dependencies:
```bash
npm install
```

Set up Environment Variables:
Copy `.env.example` to `.env` and fill out your keys.
```bash
cp .env.example .env
```

Start the Development Server:
```bash
npm run dev
```
(Server will default to http://localhost:3000)

### 2. Frontend Setup

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

### 3. Usage
Open `http://localhost:5173` in your browser. Start interacting in English or Twi! The backend will automatically handle the AI completion and translations required.

## API Provider Implementations (Native Fetch)
The backend does **not** rely on large dependencies like the `openai` or `axios` NPM packages. We keep the bundle minimal by using Node's built-in `fetch` API directly inside the `/backend/src/providers/` files. Ensure you are using Node >= 18.x.
