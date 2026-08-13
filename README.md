# Simple AI Chatbot — Poly Chat

A full-stack, multi-provider AI chatbot application built with **Express (TypeScript)** on the backend and **React (TypeScript + Vite)** on the frontend. Poly Chat connects to multiple AI models through **OpenRouter**, streaming responses token-by-token to the client via **Server-Sent Events (SSE)**.

Users can switch between AI providers in real time — currently supporting **OpenAI GPT**, **NVIDIA Nemotron 3 Super**, and **Google Gemma 4 26B A4B** — all through a single unified chat interface. Conversation history is preserved within the browser session, and the interface supports both light and dark themes.

---

## Key Features

- **Multi-Provider AI Selection** — switch between ChatGPT, NVIDIA Nemotron 3 Super, and Google Gemma 4 26B A4B from a dropdown selector in the header. Each provider connects through OpenRouter with its own API key.
- **Real-Time Streaming Responses** — AI tokens appear as the model generates them via Server-Sent Events, providing immediate visual feedback.
- **Stop Generation** — cancel an in-progress AI response at any time by clicking the stop button. Partial responses are preserved.
- **Session Persistence** — conversation history survives page reloads within the same browser tab using `sessionStorage`.
- **New Chat / Clear Chat** — start a fresh conversation or clear the current history. A confirmation dialog prevents accidental deletion.
- **Dark Mode** — toggleable dark/light theme with persistence to `localStorage`. Respects the OS color scheme preference on first visit.
- **Responsive Layout** — collapsible sidebar with a mobile-friendly overlay. The layout adapts smoothly between desktop and mobile viewports.
- **Markdown Rendering** — AI responses are rendered with full Markdown support, including GitHub Flavored Markdown (tables, strikethrough, task lists) via `react-markdown` and `remark-gfm`.
- **Suggestion Chips** — the empty state displays quick-start prompts to help users begin a conversation.
- **Error Feedback** — context-aware error banners with specific guidance for rate limits, invalid API keys, timeouts, and provider errors. Each error includes a retry action.
- **Rate Limiting** — configurable per-IP rate limiting on the backend to prevent abuse.
- **Request Validation** — all incoming requests are validated with Zod schemas before reaching business logic.
- **Structured Logging** — backend uses Pino for structured JSON logging with request tracing.
- **Health Endpoint** — the backend exposes `/api/health` for uptime monitoring.
- **Graceful Shutdown** — the server handles `SIGTERM` and `SIGINT` signals for clean process termination.

---

## Technology Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| React | ^18.3 | Component-based UI framework |
| TypeScript | ^5.5 | Static type safety |
| Vite | ^5.3 | Build tool and development server with HMR |
| Tailwind CSS | ^3.4 | Utility-first CSS framework |
| react-markdown | ^9.0 | Renders AI responses as formatted Markdown |
| remark-gfm | ^4.0 | GitHub Flavored Markdown support |
| uuid | ^10.0 | Client-side unique message ID generation |

### Backend

| Technology | Version | Purpose |
|---|---|---|
| Node.js | ≥20 | JavaScript runtime |
| TypeScript | ^5.5 | Static type safety |
| Express | ^4.19 | HTTP server and routing |
| Zod | ^3.23 | Request body and environment variable validation |
| Pino | ^9.3 | Structured JSON logging |
| pino-pretty | ^11.2 | Development log formatting |
| express-rate-limit | ^7.3 | Per-IP rate limiting |
| dotenv | ^16.4 | Environment variable loading from `.env` files |
| tsx | ^4.16 | TypeScript development runner with watch mode |
| Vitest | ^1.6 | Unit testing framework |

### AI / LLM

| Service | Purpose |
|---|---|
| OpenRouter | Unified API gateway for accessing multiple AI models |
| OpenAI GPT (via OpenRouter) | `openai/gpt-oss-120b` — general-purpose language model |
| NVIDIA Nemotron 3 Super (via OpenRouter) | `nvidia/nemotron-3-super-120b-a12b:free` — NVIDIA's open language model |
| Google Gemma 4 26B A4B (via OpenRouter) | `google/gemma-4-26b-a4b-it:free` — Google's efficient language model |

### Styling / UI

| Technology | Purpose |
|---|---|
| Tailwind CSS | Utility-first styling with custom brand colors and animations |
| Inter (Google Fonts) | Primary typeface for the application |
| Custom CSS components | Reusable `.btn-primary`, `.btn-ghost`, `.glass-card` component classes |

### Package Management

| Tool | Purpose |
|---|---|
| npm | Dependency management for both frontend and backend |

---

## Project Structure

```
ai-chatbot/
├── backend/                          # Express API server
│   ├── src/
│   │   ├── adapters/                 # AI provider adapters
│   │   │   ├── adapter.interface.ts        # LLMProviderAdapter contract
│   │   │   ├── openrouter.adapter.ts       # OpenRouter implementation (fetch + SSE)
│   │   │   └── provider.registry.ts        # Singleton registry of active providers
│   │   ├── config/
│   │   │   └── env.ts                # Zod-validated environment loader
│   │   ├── controllers/
│   │   │   ├── chat.controller.ts          # POST /api/chat — SSE streaming handler
│   │   │   └── provider.controller.ts      # GET /api/providers
│   │   ├── middlewares/
│   │   │   ├── errorHandler.middleware.ts   # Global error normalizer
│   │   │   ├── rateLimiter.middleware.ts    # express-rate-limit config
│   │   │   └── validateRequest.middleware.ts # Zod schema validation
│   │   ├── routes/
│   │   │   ├── chat.routes.ts
│   │   │   ├── health.routes.ts
│   │   │   └── provider.routes.ts
│   │   ├── schemas/
│   │   │   └── chat.schema.ts        # Zod schema for chat request body
│   │   ├── services/
│   │   │   ├── chat.service.ts             # Orchestrates adapter + timeout + abort
│   │   │   └── provider.service.ts         # Wraps provider registry
│   │   ├── types/
│   │   │   └── chat.types.ts         # Shared TypeScript types
│   │   ├── utils/
│   │   │   ├── logger.ts             # Pino logger instance
│   │   │   └── sseWriter.ts          # SSE helper functions
│   │   ├── app.ts                    # Express app factory
│   │   └── server.ts                 # Entry point — starts HTTP server
│   ├── tests/
│   │   ├── openrouter.adapter.test.ts
│   │   └── schema.test.ts
│   ├── .env.example                  # Template for environment variables
│   ├── package.json
│   ├── tsconfig.json
│   └── vitest.config.ts
│
├── frontend/                         # React SPA
│   ├── src/
│   │   ├── api/
│   │   │   ├── chatApi.ts            # SSE stream client (fetch + manual SSE parsing)
│   │   │   └── providersApi.ts       # GET /api/providers client
│   │   ├── components/
│   │   │   ├── Chat/                 # ChatArea, MessageBubble, TypingIndicator,
│   │   │   │                         # EmptyState, ErrorBanner, MessageList
│   │   │   ├── Header/              # Header, ProviderSelector (dropdown)
│   │   │   ├── Input/               # InputArea, AutoResizeTextarea
│   │   │   └── Sidebar/             # Sidebar (New Chat, Clear Chat)
│   │   ├── context/
│   │   │   └── ChatContext.tsx       # useReducer state management + ChatProvider
│   │   ├── hooks/
│   │   │   ├── useChat.ts           # Primary hook — sendMessage, stopGeneration, etc.
│   │   │   └── useSessionStorage.ts # Session persistence hook
│   │   ├── types/
│   │   │   └── chat.types.ts        # Frontend TypeScript types
│   │   ├── utils/
│   │   │   └── formatTimestamp.ts
│   │   ├── App.tsx
│   │   ├── index.css                # Tailwind directives + custom components
│   │   └── main.tsx                 # React entry point + dark mode init
│   ├── index.html
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── vite.config.ts
│   └── package.json
│
├── .gitignore
├── package.json                      # Root — monorepo convenience scripts
└── README.md
```

**Key directories:**

- **`backend/src/adapters/`** — contains the provider adapter pattern. The `OpenRouterAdapter` class is reusable for any OpenRouter-hosted model; adding a new provider requires only registering a new instance in `provider.registry.ts`.
- **`frontend/src/components/`** — organized by UI region (Chat, Header, Input, Sidebar). Each component is focused and self-contained.
- **`frontend/src/context/`** — centralized state management using React's `useReducer` pattern, with a `ChatProvider` wrapping the entire application.

---

## Prerequisites

Before running this project, ensure you have:

- **Node.js** v20 or later — [nodejs.org](https://nodejs.org)
- **npm** v10 or later (included with Node.js)
- **Git** — [git-scm.com](https://git-scm.com)
- **OpenRouter API keys** — [openrouter.ai/keys](https://openrouter.ai/keys) (free accounts available). You will need one API key per provider you want to enable.

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/noneedhere/AI-chatbot.git
cd AI-chatbot
```

### 2. Install all dependencies

Using the root convenience script:

```bash
npm run install:all
```

Or install each project separately:

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 3. Set up environment variables

```bash
cp backend/.env.example backend/.env
```

Open `backend/.env` and add your OpenRouter API keys:

```env
# GPT OpenAI via OpenRouter
GPT_API_KEY=sk-or-v1-your-gpt-key-here

# NVIDIA Nemotron 3 Super via OpenRouter
NEMOTRON_API_KEY=sk-or-v1-your-nemotron-key-here

# Google Gemma 4 26B A4B via OpenRouter
GEMMA_API_KEY=sk-or-v1-your-gemma-key-here
```

> **Note:** Each provider requires its own OpenRouter API key. Providers without a valid key will appear as "Not configured" in the UI.

---

## Environment Configuration

All environment variables are configured in `backend/.env`. Copy `backend/.env.example` as a starting point.

| Variable | Required | Default | Description |
|---|---|---|---|
| `PORT` | No | `3001` | Port the Express server listens on |
| `CORS_ORIGIN` | No | `http://localhost:5173` | Allowed frontend origin for CORS |
| `PROVIDER_TIMEOUT_MS` | No | `60000` | Maximum wait time (ms) for a model response |
| `RATE_LIMIT_PER_MINUTE` | No | `30` | Maximum requests per minute per IP |
| `OPENROUTER_BASE_URL` | No | `https://openrouter.ai/api/v1` | OpenRouter API base URL |
| `GPT_API_KEY` | **Yes** | — | OpenRouter API key for the GPT provider |
| `GPT_DEFAULT_MODEL` | No | `openai/gpt-oss-120b` | Model slug for the GPT provider |
| `NEMOTRON_API_KEY` | **Yes** | — | OpenRouter API key for the Nemotron provider |
| `NEMOTRON_DEFAULT_MODEL` | No | `nvidia/nemotron-3-super-120b-a12b:free` | Model slug for the Nemotron provider |
| `GEMMA_API_KEY` | **Yes** | — | OpenRouter API key for the Gemma provider |
| `GEMMA_DEFAULT_MODEL` | No | `google/gemma-4-26b-a4b-it:free` | Model slug for the Gemma provider |

> **Note:** The frontend has no environment variables. The Vite dev server proxies all `/api/*` requests to `http://localhost:3001` automatically.

---

## Running the Application

### Option 1: Using root convenience scripts (Windows)

From the project root:

```bash
npm run dev
```

This opens two terminal windows — one for the backend and one for the frontend.

### Option 2: Running each server separately

**Terminal 1 — Backend:**

```bash
cd backend
npm run dev
```

The API server will start at `http://localhost:3001`.

**Terminal 2 — Frontend:**

```bash
cd frontend
npm run dev
```

The application will be available at `http://localhost:5173`.

---

## Usage Guide

### Starting a Chat

1. Open `http://localhost:5173` in your browser.
2. The chat interface loads with an empty state showing suggestion chips.
3. Type a message in the input field and press **Enter** to send (or click the send button).
4. The AI response will stream in real time, with a blinking cursor indicating active generation.

### Switching AI Models

1. Click the **model selector dropdown** in the top-right corner of the header.
2. A dropdown menu displays all available models with their status.
3. Select a different model (e.g., Nemotron 3 Super or Gemma 4 26B A4B).
4. All subsequent messages will be sent to the selected provider.
5. A green status dot indicates the provider is configured; a red dot indicates a missing API key.

### Stopping a Response

1. While the AI is generating a response, a red **■ Stop** button appears in the input area.
2. Click the stop button to cancel generation immediately.
3. Any text generated so far is preserved in the conversation.

### Managing Conversations

1. Click the **hamburger menu** (☰) in the top-left to open or close the sidebar.
2. Click **New Chat** to start a fresh conversation with a new session ID.
3. Click **Clear Chat** to remove all messages from the current session. A confirmation dialog appears before deletion.
4. Conversation history persists through page reloads but is cleared when the browser tab is closed.

### Toggling Dark Mode

1. Click the **sun/moon icon** in the top-right of the header.
2. The theme preference is saved to `localStorage` and persists across sessions.
3. On first visit, the app respects your operating system's color scheme preference.

### Handling Errors

1. When an error occurs, a banner appears above the input area with specific guidance.
2. Click **Retry** to resend the last message.
3. Click **✕** to dismiss the error.
4. For rate limit errors, the banner links to OpenRouter's integration settings.

---

## API / Architecture Overview

The frontend communicates with the backend through a Vite dev server proxy (`/api` → `http://localhost:3001`). The backend acts as a gateway to OpenRouter, handling authentication, rate limiting, and SSE streaming.

### `GET /api/health`

Returns server uptime status.

**Response:**
```json
{
  "status": "ok",
  "uptime": 142
}
```

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
    },
    {
      "id": "nemotron",
      "displayName": "Nemotron 3 Super",
      "model": "nvidia/nemotron-3-super-120b-a12b:free",
      "configured": true
    },
    {
      "id": "gemma",
      "displayName": "Gemma 4 26B A4B",
      "model": "google/gemma-4-26b-a4b-it:free",
      "configured": true
    }
  ]
}
```

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

Valid `provider` values: `"gpt"`, `"nemotron"`, `"gemma"`.

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
data: {"code":"RATE_LIMITED","message":"Nemotron 3 Super rate limit exceeded."}
```

**Error codes:**

| Code | HTTP Status | Meaning |
|---|---|---|
| `INVALID_REQUEST` | 400 | Request body failed Zod validation |
| `INVALID_PROVIDER` | 400 | Unknown provider ID |
| `PROVIDER_NOT_CONFIGURED` | 404 | API key not set for this provider |
| `INVALID_API_KEY` | 401 | API key rejected by OpenRouter |
| `RATE_LIMITED` | 429 | Too many requests |
| `PROVIDER_TIMEOUT` | 408 | OpenRouter did not respond within `PROVIDER_TIMEOUT_MS` |
| `PROVIDER_ERROR` | 502 | Upstream OpenRouter error |
| `INTERNAL_ERROR` | 500 | Unexpected server error |

---

## Development Scripts

### Backend (`backend/`)

| Script | Command | Description |
|---|---|---|
| `dev` | `npm run dev` | Start development server with auto-reload (`tsx watch`) |
| `build` | `npm run build` | Compile TypeScript to `dist/` |
| `start` | `npm start` | Run the compiled production build |
| `test` | `npm test` | Run unit tests with Vitest |
| `test:watch` | `npm run test:watch` | Run tests in watch mode |
| `lint` | `npm run lint` | Lint source files with ESLint |

### Frontend (`frontend/`)

| Script | Command | Description |
|---|---|---|
| `dev` | `npm run dev` | Start Vite development server with HMR |
| `build` | `npm run build` | Type-check and build for production |
| `preview` | `npm run preview` | Preview the production build locally |
| `lint` | `npm run lint` | Lint source files with ESLint |

### Root

| Script | Command | Description |
|---|---|---|
| `dev` | `npm run dev` | Start both backend and frontend in separate terminals (Windows) |
| `dev:backend` | `npm run dev:backend` | Start only the backend |
| `dev:frontend` | `npm run dev:frontend` | Start only the frontend |
| `install:all` | `npm run install:all` | Install dependencies for both projects |
| `build:backend` | `npm run build:backend` | Build only the backend |
| `build:frontend` | `npm run build:frontend` | Build only the frontend |

---

## Troubleshooting

### Port 5173 already in use

Vite will automatically switch to the next available port (e.g., 5174). However, the backend CORS is configured for `http://localhost:5173` by default. Either:
- Kill the process using port 5173, or
- Update `CORS_ORIGIN=http://localhost:5174` in `backend/.env` and restart the backend.

### "Provider Not Configured" error in the UI

The API key for the selected provider is missing or empty in `backend/.env`. Add the corresponding key (e.g., `NEMOTRON_API_KEY`) and restart the backend.

### Rate limit errors (429)

OpenRouter free-tier models share a rate-limit pool across all users. If you encounter a 429 error:
1. Wait 1–5 minutes and try again.
2. Switch to a different AI model using the provider selector.
3. For a dedicated rate limit, add your own provider API key at [openrouter.ai/settings/integrations](https://openrouter.ai/settings/integrations).

### AI response is cut off or empty

The default model slug in `.env` may point to a model that is currently unavailable or renamed on OpenRouter. Check [openrouter.ai/models](https://openrouter.ai/models) for the current correct model slug.

### Backend crashes on startup

Check the console output. Common causes:
- Missing `backend/.env` file — copy from `.env.example`.
- Invalid environment variable types — Zod will print a detailed validation error.

### `npm` commands fail with `ENOENT`

Do not run `npm install` or `npm run dev` from the project root unless using the root convenience scripts. Navigate into `backend/` or `frontend/` first:

```bash
cd backend && npm run dev
# In a second terminal:
cd frontend && npm run dev
```

---

## Security Notes

- **Never commit your `.env` file.** It is excluded by `.gitignore`. The `.env.example` file contains only placeholder values.
- API keys are used exclusively on the backend. They are never sent to the browser.
- CORS is restricted to the configured `CORS_ORIGIN` — the frontend origin only.
- Rate limiting (default: 30 requests/minute/IP) prevents abuse.
- All request bodies are validated with Zod schemas before reaching business logic.

---

## License

This project does not currently specify a license. All rights are reserved by the author unless otherwise stated.

---

## Contact

- **LinkedIn:** [Zidane Rosyidi](https://www.linkedin.com/in/zidane-rosyidi-6b438333b/)
- **Email:** [zidanerosyidi@gmail.com](mailto:zidanerosyidi@gmail.com)

---

*Built with Express, React, TypeScript, and OpenRouter.*
