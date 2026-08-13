# SIMPLY CHAT — AI Chatbot

A full-stack conversational AI chatbot application built with **Express (TypeScript)** on the backend and **React (TypeScript + Vite)** on the frontend. It communicates with **OpenAI's GPT model via OpenRouter**, streaming responses token-by-token to the client over **Server-Sent Events (SSE)**.

---

## Overview

Simply CHAT provides a clean, responsive chat interface that allows users to have real-time conversations with an AI assistant. Messages are streamed as they are generated, and users can stop generation at any time. Conversation history is preserved within the browser session.

---

## Features

- **Real-time streaming responses** — tokens appear as the model generates them via SSE
- **Stop generation** — cancel an in-progress AI response at any time
- **Session persistence** — conversation history survives page reloads within the same browser tab (via `sessionStorage`)
- **New Chat / Clear Chat** — start a fresh conversation or clear current history
- **Dark mode** — toggleable dark/light theme, persisted to `localStorage` and respects OS preference
- **Responsive layout** — sidebar collapses on mobile viewports
- **Error feedback** — user-friendly error messages with specific guidance for rate limits, invalid keys, and timeouts
- **Health endpoint** — backend exposes `/api/health` for uptime monitoring

---

## Tech Stack

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Node.js | ≥20 | Runtime |
| TypeScript | ^5.5 | Type safety |
| Express | ^4.19 | HTTP server & routing |
| Zod | ^3.23 | Request body validation |
| Pino | ^9.3 | Structured logging |
| express-rate-limit | ^7.3 | Rate limiting |
| tsx | ^4.16 | TypeScript dev runner |
| dotenv | ^16.4 | Environment variable loading |

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | ^18 | UI framework |
| TypeScript | ^5.5 | Type safety |
| Vite | ^5.4 | Build tool & dev server |
| Tailwind CSS | ^3 | Utility-first styling |
| uuid | ^10 | Client-side message ID generation |

### AI Provider
| Service | Purpose |
|---|---|
| OpenRouter | API gateway to OpenAI GPT (and other models) |
| OpenAI via OpenRouter | Language model for chat completions |

---

## Project Structure

```
ai-multi-chatbot/
├── backend/                    # Express API server
│   ├── src/
│   │   ├── adapters/           # AI provider adapters
│   │   │   ├── adapter.interface.ts    # LLMProviderAdapter contract
│   │   │   ├── openrouter.adapter.ts   # OpenRouter implementation (fetch + SSE)
│   │   │   └── provider.registry.ts    # Singleton registry of active providers
│   │   ├── config/
│   │   │   └── env.ts          # Zod-validated environment loader
│   │   ├── controllers/
│   │   │   ├── chat.controller.ts      # POST /api/chat — SSE streaming handler
│   │   │   └── provider.controller.ts  # GET /api/providers
│   │   ├── middlewares/
│   │   │   ├── errorHandler.middleware.ts      # Global error normalizer
│   │   │   ├── rateLimiter.middleware.ts       # express-rate-limit config
│   │   │   └── validateRequest.middleware.ts   # Zod schema validation
│   │   ├── routes/
│   │   │   ├── chat.routes.ts
│   │   │   ├── health.routes.ts
│   │   │   └── provider.routes.ts
│   │   ├── schemas/
│   │   │   └── chat.schema.ts  # Zod schema for chat request body
│   │   ├── services/
│   │   │   ├── chat.service.ts         # Orchestrates adapter + timeout
│   │   │   └── provider.service.ts     # Wraps provider registry
│   │   ├── types/
│   │   │   └── chat.types.ts   # Shared TypeScript types
│   │   ├── utils/
│   │   │   ├── logger.ts       # Pino logger instance
│   │   │   └── sseWriter.ts    # SSE helper functions
│   │   ├── app.ts              # Express app factory
│   │   └── server.ts           # Entry point — starts HTTP server
│   ├── .env                    # Local environment variables (gitignored)
│   ├── .env.example            # Template for environment variables
│   └── package.json
│
├── frontend/                   # React SPA
│   ├── src/
│   │   ├── api/
│   │   │   ├── chatApi.ts      # SSE stream client (fetch + manual SSE parsing)
│   │   │   └── providersApi.ts # GET /api/providers client
│   │   ├── components/
│   │   │   ├── Chat/           # ChatArea, MessageBubble, TypingIndicator, EmptyState, ErrorBanner
│   │   │   ├── Header/         # Header, ProviderSelector (model badge)
│   │   │   ├── Input/          # InputArea, AutoResizeTextarea
│   │   │   └── Sidebar/        # Sidebar (New Chat, Clear Chat)
│   │   ├── context/
│   │   │   └── ChatContext.tsx # useReducer state + ChatProvider
│   │   ├── hooks/
│   │   │   ├── useChat.ts          # Primary hook — sendMessage, stopGeneration, etc.
│   │   │   └── useSessionStorage.ts # Session persistence hook
│   │   ├── types/
│   │   │   └── chat.types.ts   # Shared frontend TypeScript types
│   │   ├── utils/
│   │   │   └── formatTimestamp.ts
│   │   ├── App.tsx
│   │   ├── index.css           # Tailwind + custom components + dark mode
│   │   └── main.tsx            # React entry — dark mode init
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   └── package.json
│
├── .gitignore
└── package.json                # Root — convenience scripts
```

---

## Prerequisites

Before running this project, ensure you have:

- **Node.js** v20 or later — [nodejs.org](https://nodejs.org)
- **npm** v10 or later (comes with Node.js)
- An **OpenRouter API key** — [openrouter.ai/keys](https://openrouter.ai/keys) (free account available)
- **Git** — [git-scm.com](https://git-scm.com)

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/noneedhere/AI-chatbot.git
cd AI-chatbot
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Install frontend dependencies

```bash
cd ../frontend
npm install
```

### 4. Set up environment variables

Copy the example file and fill in your API key:

```bash
# From the project root
cp backend/.env.example backend/.env
```

Open `backend/.env` and set your OpenRouter API key:

```env
GPT_API_KEY=sk-or-v1-your-actual-key-here
```

### 5. Run the backend

Open a terminal in the `backend/` directory:

```bash
cd backend
npm run dev
```

The server will start at `http://localhost:3001`.

### 6. Run the frontend

Open a **second terminal** in the `frontend/` directory:

```bash
cd frontend
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Environment Variables

All environment variables are configured in `backend/.env`. Copy `backend/.env.example` as a starting point.

| Variable | Required | Default | Description |
|---|---|---|---|
| `PORT` | No | `3001` | Port the Express server listens on |
| `CORS_ORIGIN` | No | `http://localhost:5173` | Allowed frontend origin for CORS |
| `PROVIDER_TIMEOUT_MS` | No | `60000` | Maximum time (ms) to wait for a model response |
| `RATE_LIMIT_PER_MINUTE` | No | `30` | Maximum requests per minute per IP |
| `OPENROUTER_BASE_URL` | No | `https://openrouter.ai/api/v1` | OpenRouter API base URL |
| `GPT_API_KEY` | **Yes** | — | Your OpenRouter API key |
| `GPT_DEFAULT_MODEL` | No | `openai/gpt-oss-120b` | OpenRouter model slug to use |

> **Note:** The frontend has no environment variables. The Vite dev server proxies all `/api/*` requests to `http://localhost:3001` automatically.

---

## API Documentation

### `GET /api/health`

Returns server uptime status.

**Response:**
```json
{
  "status": "ok",
  "uptime": 142
}
```

---

### `GET /api/providers`

Returns a list of registered AI providers and their configuration status.

**Response:**
```json
{
  "providers": [
    {
      "id": "gpt",
      "displayName": "ChatGPT",
      "model": "openai/gpt-oss-120b",
      "configured": true
    }
  ]
}
```

---

### `POST /api/chat`

Sends a chat request and streams the response as Server-Sent Events.

**Request Body:**
```json
{
  "provider": "gpt",
  "messages": [
    { "role": "user", "content": "Hello, how are you?" }
  ],
  "options": {
    "temperature": 0.7,
    "maxTokens": 1024
  }
}
```

**Response:** `text/event-stream`

```
event: chunk
data: {"text":"Hello"}

event: chunk
data: {"text":"! How"}

event: done
data: {"finishReason":"stop","usage":{"promptTokens":10,"completionTokens":5}}
```

**Error event:**
```
event: error
data: {"code":"RATE_LIMITED","message":"ChatGPT rate limit exceeded."}
```

**Error codes:**

| Code | HTTP Status | Meaning |
|---|---|---|
| `INVALID_REQUEST` | 400 | Request body failed validation |
| `INVALID_PROVIDER` | 400 | Unknown provider ID |
| `PROVIDER_NOT_CONFIGURED` | 404 | API key not set |
| `INVALID_API_KEY` | 401 | API key rejected by OpenRouter |
| `RATE_LIMITED` | 429 | Too many requests |
| `PROVIDER_TIMEOUT` | 408 | OpenRouter did not respond in time |
| `PROVIDER_ERROR` | 502 | Upstream OpenRouter error |
| `INTERNAL_ERROR` | 500 | Unexpected server error |

---

## Usage Guide

After completing the installation:

1. Open `http://localhost:5173` in your browser.
2. The chat interface will load. The model badge in the top-right shows the active AI model.
3. Type a message in the input field and press **Enter** (or click the send button) to chat.
4. While the AI is responding, a red **■ Stop** button appears — click it to cancel generation at any time.
5. Use **New Chat** in the sidebar to start a fresh conversation.
6. Use **Clear Chat** to remove all messages from the current session.
7. Click the moon/sun icon in the header to toggle dark/light mode.
8. Your conversation persists through page reloads but is cleared when the browser tab is closed.

---

## Development Workflow

### Backend

```bash
cd backend

# Development with auto-reload (tsx watch)
npm run dev

# Type-check without emitting
npx tsc --noEmit

# Build for production
npm run build

# Run production build
npm start
```

### Frontend

```bash
cd frontend

# Development with HMR
npm run dev

# Type-check
npx tsc --noEmit

# Production build (outputs to dist/)
npm run build

# Preview production build locally
npm run preview
```

---

## Troubleshooting

### Port 5173 already in use

The frontend will automatically switch to the next available port (e.g., 5174). However, the backend CORS is set to `5173` by default. Either:
- Kill the process using port 5173, or
- Update `CORS_ORIGIN=http://localhost:5174` in `backend/.env` and restart the backend.

### `npm` commands fail with `ENOENT`

Do not run `npm install` or `npm run dev` from the project root unless using the root convenience scripts. Navigate into `backend/` or `frontend/` first:

```bash
cd backend && npm run dev
# In a second terminal:
cd frontend && npm run dev
```

### "Provider Not Configured" error in the UI

The `GPT_API_KEY` is missing or empty in `backend/.env`. Add your OpenRouter API key and restart the backend.

### Rate limit errors (429)

OpenRouter free-tier models share a rate-limit pool across all users. If you hit a 429:
1. Wait 1–5 minutes and try again.
2. For a dedicated rate limit, add your own provider API key at [openrouter.ai/settings/integrations](https://openrouter.ai/settings/integrations).

### AI response is cut off or empty

The `GPT_DEFAULT_MODEL` in `.env` may point to a model that is currently unavailable or renamed on OpenRouter. Check [openrouter.ai/models](https://openrouter.ai/models) for the current correct model slug.

### Backend crashes on startup

Check the console output. Common causes:
- Missing `backend/.env` file — copy from `.env.example`.
- Invalid environment variable types — Zod will print a detailed error.

---

## Security Notes

- **Never commit your `.env` file.** It is already excluded by `.gitignore`. The `.env.example` file should contain only placeholder values, never real API keys.
- The API key is only used on the backend. It is never sent to the browser.
- CORS is restricted to the configured `CORS_ORIGIN` — the frontend origin only.
- Rate limiting (default: 30 requests/minute/IP) prevents abuse.
- All request bodies are validated with Zod before reaching business logic.

---

## License

This project does not currently specify a license. All rights are reserved by the author unless otherwise stated.

---

*Built with Express, React, TypeScript, and OpenRouter.*
