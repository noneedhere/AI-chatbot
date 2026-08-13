<p align="center">
  <h1 align="center">💬 Simple AI Chatbot — Poly Chat</h1>
  <p align="center">
    <strong>Poly Chat</strong> — A multi-provider AI chatbot with real-time streaming<br>
    built with React 18, Express 4, and TypeScript
  </p>
  <p align="center">
    <img src="https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=white" alt="React 18">
    <img src="https://img.shields.io/badge/TypeScript-5.5-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript 5.5">
    <img src="https://img.shields.io/badge/Express-4-000000?style=flat-square&logo=express&logoColor=white" alt="Express 4">
    <img src="https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite 5">
    <img src="https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS 3">
    <img src="https://img.shields.io/badge/Node.js-20+-339933?style=flat-square&logo=nodedotjs&logoColor=white" alt="Node.js 20+">
    <img src="https://img.shields.io/badge/OpenRouter-API-6366F1?style=flat-square&logo=openai&logoColor=white" alt="OpenRouter API">
  </p>
</p>

Poly Chat is a multi-provider AI chatbot that lets users converse with multiple large language models through a single, unified interface. Built as a full-stack TypeScript monorepo, it routes conversations through [OpenRouter](https://openrouter.ai) to seamlessly switch between **ChatGPT** (OpenAI), **Nemotron 3 Super** (NVIDIA), and **Gemma 4 26B** (Google) — all without leaving the chat window.

The application streams AI responses in real time using Server-Sent Events (SSE), providing a responsive conversational experience with a typing indicator, markdown rendering, and the ability to stop generation mid-stream. Users can switch AI providers on the fly, toggle between dark and light themes, and manage their chat sessions — all within a modern, glassmorphism-styled interface.

---

## Key Features

- **Multi-Provider AI Chat** — Switch between ChatGPT, NVIDIA Nemotron 3 Super, and Google Gemma 4 26B from a dropdown selector without interrupting the conversation.
- **Real-Time Streaming Responses** — AI responses are streamed token-by-token via SSE, displayed with a live typing cursor and animated typing indicator.
- **Stop Generation** — Cancel an in-progress AI response at any time. The partial response is preserved, and the upstream API request is immediately aborted to avoid wasting tokens.
- **Markdown Rendering** — Assistant responses are rendered as rich Markdown with support for GitHub Flavored Markdown (tables, strikethrough, task lists, code blocks with syntax highlighting).
- **Dark / Light Mode** — Toggle between dark and light themes with a single click. Theme preference is persisted in `localStorage` and respects the system color scheme on first visit.
- **Session Persistence** — Chat messages are automatically saved to `sessionStorage` and restored within the same browser tab, surviving page refreshes.
- **New Chat / Clear Chat** — Start a fresh conversation or clear the current chat history with a confirmation dialog to prevent accidental data loss.
- **Provider Status Indicators** — The provider dropdown displays a green/red status dot showing whether each AI model is properly configured with an API key.
- **Conversation Suggestions** — An empty-state screen displays pre-built prompt suggestions to help users start a conversation quickly.
- **Responsive Design** — Fully responsive layout with a collapsible sidebar, mobile-friendly overlay navigation, and adaptive component sizing.
- **Rate Limiting** — Configurable per-minute rate limiting on the chat endpoint to prevent abuse.
- **Error Handling with Retry** — Contextual error banners with specific guidance for common issues (rate limits, invalid API keys, timeouts) and a one-click retry button.
- **Request Validation** — All incoming API requests are validated with Zod schemas before reaching the service layer.
- **Structured Logging** — Backend uses Pino for structured JSON logging in production and human-readable colorized output in development.
- **Graceful Shutdown** — The server handles `SIGTERM` and `SIGINT` signals for clean process termination.

---

## Technology Stack

### Frontend

| Technology | Role |
|---|---|
| **React 18** | Component-based UI library |
| **TypeScript** | Static type checking |
| **Vite 5** | Development server and build tool |
| **Tailwind CSS 3** | Utility-first CSS framework |
| **React Markdown** | Renders AI responses as rich Markdown |
| **remark-gfm** | GitHub Flavored Markdown support |
| **uuid** | Unique ID generation for messages and sessions |

### Backend

| Technology | Role |
|---|---|
| **Node.js** | JavaScript runtime |
| **Express 4** | HTTP server framework |
| **TypeScript** | Static type checking |
| **Zod** | Runtime schema validation for API requests and environment variables |
| **Pino** | Structured logging (with `pino-pretty` for development) |
| **express-rate-limit** | Per-endpoint rate limiting |
| **dotenv** | Environment variable loading from `.env` files |
| **cors** | Cross-Origin Resource Sharing middleware |

### AI / LLM

| Technology | Role |
|---|---|
| **OpenRouter API** | Unified gateway to multiple LLM providers |
| **OpenAI GPT** | ChatGPT model via OpenRouter |
| **NVIDIA Nemotron 3 Super** | NVIDIA model via OpenRouter |
| **Google Gemma 4 26B** | Google model via OpenRouter |

### Development & Testing

| Technology | Role |
|---|---|
| **Vitest** | Unit testing framework for backend |
| **tsx** | TypeScript execution with watch mode for backend development |
| **PostCSS + Autoprefixer** | CSS processing pipeline |
| **Inter (Google Fonts)** | Typography |

---

## Project Structure

```
ai-chatbot/
├── package.json                  # Monorepo root — orchestrates frontend & backend
├── .gitignore                    # Git ignore rules
│
├── backend/
│   ├── package.json              # Backend dependencies and scripts
│   ├── tsconfig.json             # TypeScript configuration
│   ├── vitest.config.ts          # Test runner configuration
│   ├── .env.example              # Environment variable template
│   ├── src/
│   │   ├── server.ts             # Application entry point
│   │   ├── app.ts                # Express app setup (middleware, routes)
│   │   ├── config/
│   │   │   └── env.ts            # Zod-validated environment configuration
│   │   ├── adapters/
│   │   │   ├── adapter.interface.ts    # LLM provider adapter interface
│   │   │   ├── openrouter.adapter.ts   # OpenRouter API adapter (SSE streaming)
│   │   │   └── provider.registry.ts    # Provider registration and lookup
│   │   ├── controllers/
│   │   │   ├── chat.controller.ts      # Chat endpoint handler (SSE)
│   │   │   └── provider.controller.ts  # Provider listing endpoint
│   │   ├── services/
│   │   │   ├── chat.service.ts         # Chat orchestration with timeout + abort
│   │   │   └── provider.service.ts     # Provider info aggregation
│   │   ├── routes/
│   │   │   ├── chat.routes.ts          # POST /api/chat
│   │   │   ├── provider.routes.ts      # GET /api/providers
│   │   │   └── health.routes.ts        # GET /api/health
│   │   ├── middlewares/
│   │   │   ├── errorHandler.middleware.ts      # Global error handler
│   │   │   ├── rateLimiter.middleware.ts       # Rate limiting
│   │   │   └── validateRequest.middleware.ts   # Zod request validation
│   │   ├── schemas/
│   │   │   └── chat.schema.ts          # Chat request Zod schema
│   │   ├── types/
│   │   │   └── chat.types.ts           # Shared TypeScript types
│   │   └── utils/
│   │       ├── logger.ts               # Pino logger setup
│   │       └── sseWriter.ts            # SSE response helpers
│   └── tests/
│       ├── schema.test.ts              # Chat schema validation tests
│       └── openrouter.adapter.test.ts  # Adapter unit tests
│
└── frontend/
    ├── package.json              # Frontend dependencies and scripts
    ├── index.html                # HTML entry point
    ├── vite.config.ts            # Vite configuration with API proxy
    ├── tsconfig.json             # TypeScript configuration
    ├── tailwind.config.js        # Tailwind CSS theme and animations
    ├── postcss.config.js         # PostCSS plugins
    ├── public/
    │   └── favicon.svg           # Application favicon
    └── src/
        ├── main.tsx              # React entry point with theme initialization
        ├── App.tsx               # Root component with layout
        ├── index.css             # Global styles and Tailwind directives
        ├── api/
        │   ├── chatApi.ts        # SSE streaming client for chat
        │   └── providersApi.ts   # Provider list fetcher
        ├── context/
        │   └── ChatContext.tsx   # React Context + useReducer state management
        ├── hooks/
        │   ├── useChat.ts        # Main chat hook (send, stop, retry, new/clear)
        │   └── useSessionStorage.ts  # Session persistence hook
        ├── components/
        │   ├── Chat/
        │   │   ├── ChatArea.tsx          # Chat content area wrapper
        │   │   ├── MessageList.tsx       # Scrollable message list with auto-scroll
        │   │   ├── MessageBubble.tsx     # Individual message bubble with Markdown
        │   │   ├── EmptyState.tsx        # Welcome screen with suggestions
        │   │   ├── ErrorBanner.tsx       # Contextual error display with retry
        │   │   └── TypingIndicator.tsx   # Animated typing dots
        │   ├── Header/
        │   │   ├── Header.tsx           # App header with logo and controls
        │   │   └── ProviderSelector.tsx # AI model dropdown selector
        │   ├── Input/
        │   │   ├── InputArea.tsx         # Message input bar with send/stop
        │   │   └── AutoResizeTextarea.tsx # Auto-expanding textarea
        │   └── Sidebar/
        │       └── Sidebar.tsx          # Collapsible sidebar with actions
        ├── types/
        │   └── chat.types.ts    # Frontend TypeScript types and state shape
        └── utils/
            └── formatTimestamp.ts # Time formatting utility
```

---

## Prerequisites

Before running Poly Chat, ensure you have the following installed:

- **Node.js** (version 20 or later recommended — the project uses `AbortSignal.any()` which requires Node.js 20+)
- **npm** (included with Node.js)
- **OpenRouter API Key(s)** — At least one API key from [OpenRouter](https://openrouter.ai) to enable an AI provider

---

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd ai-chatbot
   ```

2. **Install all dependencies** (backend + frontend)

   ```bash
   npm run install:all
   ```

3. **Configure environment variables**

   ```bash
   cp backend/.env.example backend/.env
   ```

   Edit `backend/.env` and add your OpenRouter API key(s). See the [Environment Configuration](#environment-configuration) section below for details.

---

## Environment Configuration

The backend requires a `.env` file in the `backend/` directory. Copy the provided template and configure it:

```env
# Server
PORT=3001
CORS_ORIGIN=http://localhost:5173
PROVIDER_TIMEOUT_MS=60000
RATE_LIMIT_PER_MINUTE=30

# OpenRouter base URL
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1

# GPT (OpenAI via OpenRouter)
GPT_API_KEY=sk-or-v1-YOUR_KEY_HERE
GPT_DEFAULT_MODEL=openai/gpt-oss-120b

# NVIDIA Nemotron 3 Super via OpenRouter
NEMOTRON_API_KEY=sk-or-v1-YOUR_KEY_HERE
NEMOTRON_DEFAULT_MODEL=nvidia/nemotron-3-super-120b-a12b:free

# Google Gemma 4 26B A4B via OpenRouter
GEMMA_API_KEY=sk-or-v1-YOUR_KEY_HERE
GEMMA_DEFAULT_MODEL=google/gemma-4-26b-a4b-it:free
```

### Variable Reference

| Variable | Required | Description |
|---|---|---|
| `PORT` | No | Backend server port (default: `3001`) |
| `CORS_ORIGIN` | No | Allowed CORS origin (default: `http://localhost:5173`) |
| `PROVIDER_TIMEOUT_MS` | No | Maximum time to wait for an AI provider response in milliseconds (default: `60000`) |
| `RATE_LIMIT_PER_MINUTE` | No | Maximum chat requests per minute per client (default: `30`) |
| `OPENROUTER_BASE_URL` | No | OpenRouter API base URL (default: `https://openrouter.ai/api/v1`) |
| `GPT_API_KEY` | Yes* | OpenRouter API key for the ChatGPT model |
| `GPT_DEFAULT_MODEL` | No | OpenAI model identifier (default: `openai/gpt-oss-120b`) |
| `NEMOTRON_API_KEY` | Yes* | OpenRouter API key for the Nemotron model |
| `NEMOTRON_DEFAULT_MODEL` | No | NVIDIA model identifier (default: `nvidia/nemotron-3-super-120b-a12b:free`) |
| `GEMMA_API_KEY` | Yes* | OpenRouter API key for the Gemma model |
| `GEMMA_DEFAULT_MODEL` | No | Google model identifier (default: `google/gemma-4-26b-a4b-it:free`) |

> \* At least one provider API key must be configured for the application to function. Providers without a key will appear as unavailable in the UI.

---

## Running the Application

### Start both servers simultaneously (Windows)

```bash
npm run dev
```

This opens two terminal windows — one for the backend and one for the frontend.

### Start servers individually

**Backend** (runs on `http://localhost:3001`):

```bash
npm run dev:backend
```

**Frontend** (runs on `http://localhost:5173`):

```bash
npm run dev:frontend
```

> The Vite dev server proxies all `/api` requests to the backend, so both servers must be running.

---

## Usage Guide

### Starting a Conversation

1. Open Poly Chat at `http://localhost:5173`.
2. Select an AI provider from the dropdown in the header (providers with a green dot are configured and ready).
3. Type a message in the input area at the bottom of the screen.
4. Press **Enter** to send (or **Shift+Enter** for a new line).
5. The AI response streams in real time with a typing cursor.

### Using Prompt Suggestions

1. When no messages are present, the empty state displays three suggested prompts.
2. Click any suggestion to immediately send it as your first message.

### Switching AI Providers

1. Click the provider selector dropdown in the header.
2. Select a different AI model from the list.
3. Your next message will be routed to the newly selected provider.
4. Previous messages remain visible — the provider label is shown under each AI response.

### Stopping a Response

1. While the AI is generating a response, the send button changes to a red **Stop** button.
2. Click **Stop** to cancel the generation.
3. The partial response is preserved in the conversation.

### Handling Errors

1. If an error occurs (rate limit, timeout, invalid key), a contextual error banner appears above the input area.
2. Click **Retry** to resend the last message.
3. Click the **×** button to dismiss the error.

### Managing Chat Sessions

- **New Chat** — Click the "New Chat" button in the sidebar to start a fresh conversation with a new session ID.
- **Clear Chat** — Click "Clear Chat" in the sidebar to delete all messages from the current session (with a confirmation dialog).
- Chat history is stored in the browser's `sessionStorage` and is automatically cleared when the tab is closed.

### Toggling Dark Mode

- Click the sun/moon icon in the header to switch between dark and light themes.
- Your preference is saved in `localStorage` and persists across sessions.

---

## API Overview

The backend exposes a RESTful API under the `/api` prefix.

### Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Returns server health status and uptime |
| `GET` | `/api/providers` | Returns a list of all registered AI providers with their configuration status |
| `POST` | `/api/chat` | Sends a chat request and streams the AI response via SSE |

### `POST /api/chat`

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

- `provider` — One of: `gpt`, `nemotron`, `gemma`
- `messages` — Array of message objects with `role` (`user`, `assistant`, `system`) and `content`
- `options` — Optional object with `temperature` (0–2) and `maxTokens`

**Response:** Server-Sent Events stream with the following event types:

| Event | Payload | Description |
|---|---|---|
| `chunk` | `{ "text": "..." }` | A streamed text fragment |
| `done` | `{ "finishReason": "stop", "usage": { ... } }` | Stream completed successfully |
| `error` | `{ "code": "...", "message": "..." }` | An error occurred |

### `GET /api/providers`

**Response:**

```json
{
  "providers": [
    { "id": "gpt", "displayName": "ChatGPT", "model": "openai/gpt-oss-120b", "configured": true },
    { "id": "nemotron", "displayName": "Nemotron 3 Super", "model": "nvidia/nemotron-3-super-120b-a12b:free", "configured": true },
    { "id": "gemma", "displayName": "Gemma 4 26B A4B", "model": "google/gemma-4-26b-a4b-it:free", "configured": false }
  ]
}
```

### Architecture Flow

```
User → React Frontend → Vite Proxy (/api) → Express Backend → OpenRouter API → LLM Provider
                                                   ↓
                                              SSE Stream
                                                   ↓
User ← React State (useReducer) ← SSE Parser ← Express SSE Writer
```

---

## Development Scripts

### Root (Monorepo)

| Script | Command | Description |
|---|---|---|
| `dev` | `npm run dev` | Starts both backend and frontend dev servers (Windows) |
| `dev:backend` | `npm run dev:backend` | Starts only the backend dev server |
| `dev:frontend` | `npm run dev:frontend` | Starts only the frontend dev server |
| `install:all` | `npm run install:all` | Installs dependencies for both backend and frontend |
| `build:backend` | `npm run build:backend` | Compiles backend TypeScript to `dist/` |
| `build:frontend` | `npm run build:frontend` | Builds the frontend for production |

### Backend

| Script | Command | Description |
|---|---|---|
| `dev` | `npm run dev` | Starts the server with `tsx watch` (hot-reload) |
| `build` | `npm run build` | Compiles TypeScript to JavaScript |
| `start` | `npm run start` | Runs the compiled production server |
| `test` | `npm run test` | Runs all tests once with Vitest |
| `test:watch` | `npm run test:watch` | Runs tests in watch mode |
| `lint` | `npm run lint` | Lints source code with ESLint |

### Frontend

| Script | Command | Description |
|---|---|---|
| `dev` | `npm run dev` | Starts the Vite development server |
| `build` | `npm run build` | Type-checks and builds for production |
| `preview` | `npm run preview` | Previews the production build locally |
| `lint` | `npm run lint` | Lints source code with ESLint |

---

## Troubleshooting

| Problem | Solution |
|---|---|
| **"Provider not configured" error** | Ensure you have added a valid OpenRouter API key to `backend/.env` for the selected provider. Restart the backend server after changes. |
| **Frontend cannot reach the API** | Verify both the backend (`localhost:3001`) and frontend (`localhost:5173`) servers are running. The Vite proxy forwards `/api` requests to the backend. |
| **"Rate limited" error** | Free-tier OpenRouter models have rate limits. Wait approximately one minute or configure a paid API key. The `RATE_LIMIT_PER_MINUTE` variable controls the backend's own rate limit. |
| **"Request timed out" error** | The provider took too long to respond. Try again or increase `PROVIDER_TIMEOUT_MS` in `backend/.env`. |
| **Environment validation fails on startup** | The backend validates all environment variables with Zod on boot. Check the error output for the specific invalid or missing variable. |
| **Dark mode not persisting** | Theme preference is stored in `localStorage`. Ensure your browser is not blocking local storage (e.g., in incognito mode). |
| **`AbortSignal.any is not a function`** | This project requires Node.js 20 or later. Upgrade your Node.js installation. |

---

## License

No license has been specified in the repository.

---

## Contact

- **LinkedIn:** [Zidane Rosyidi](https://www.linkedin.com/in/zidane-rosyidi-6b438333b/)
- **Email:** [zidanerosyidi@gmail.com](mailto:zidanerosyidi@gmail.com)
