# pro4 — Event-Driven Financial Notification Engine

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/vardhan23v/financial-notifications)
[![License](https://img.shields.io/badge/license-MIT-blue)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-22-339933)](https://nodejs.org/)

**pro4** is a full-stack, event-driven financial notification engine that ingests financial events (margin calls, trade confirmations, EMI reminders, suspicious activity alerts, and 25+ other event types), routes them through a multi-channel delivery pipeline (SMS, Email, Push, WhatsApp, In-App), and enforces TRAI DND compliance, frequency capping, and quiet hours. It includes a persistent dead-letter queue with retry, a localized Handlebars template engine, real-time analytics via SSE, and a React dashboard for monitoring and management.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, TypeScript 6, Vite 8, React Router, Lucide icons |
| **Backend** | Node.js, Express, TypeScript |
| **ORM** | Prisma (PostgreSQL) |
| **Messaging** | Apache Kafka, RabbitMQ |
| **Caching** | Redis |
| **Database** | PostgreSQL |
| **Templating** | Handlebars (multi-locale) |
| **Monitoring** | Prometheus metrics, structured logging (pino) |
| **Infrastructure** | Docker Compose (Kafka, Zookeeper, RabbitMQ, Redis, PostgreSQL) |

## Features

- **25+ financial event types** — margin calls, trade confirmations, EMI reminders, suspicious activity alerts, KYC expiry, policy renewals, and more
- **Multi-channel delivery** — SMS, Email, Push, WhatsApp, In-App with provider failover and circuit breakers
- **TRAI DND compliance** — automatic DND registry checks with transactional exemptions for regulatory events
- **Frequency capping** — sliding-window rate limiting per user/channel to prevent notification fatigue
- **Quiet hours** — timezone-aware quiet period enforcement (bypassable for high-urgency events)
- **Event scoring & routing** — risk/urgency scoring engine with regulatory override routing (SEBI, RBI, IRDAI)
- **Persistent DLQ with retry** — dead-letter queue for failed deliveries with replay capability
- **Localized template engine** — Handlebars-based templates with per-locale overrides (en-IN default)
- **Real-time analytics** — SSE-streamed metrics dashboard with breakdowns by channel, status, and event type
- **Website proxy viewer** — server-side proxy that strips X-Frame-Options/CSP for sandboxed iframe previews
- **System health dashboard** — live status cards for Kafka, RabbitMQ, Redis, PostgreSQL, and circuit breaker states
- **Notification explorer** — searchable, filterable notification log with pagination
- **Provider management** — toggle delivery providers on/off from the UI
- **Template CRUD** — create, edit, and delete notification templates per event type and channel
- **User preferences** — per-user channel selection, quiet hours, and language preferences
- **Event simulator** — dynamic form for submitting test events with Zod schema-driven fields
- **Correlation ID tracing** — end-to-end request tracing via `x-correlation-id` header
- **Graceful shutdown** — clean disconnect from Kafka, RabbitMQ, Redis, and Prisma on SIGTERM/SIGINT

## Local Setup

### Prerequisites

- Node.js 22+
- Docker & Docker Compose
- npm

### 1. Clone the repository

```bash
git clone https://github.com/vardhan23v/financial-notifications.git
cd financial-notifications
```

### 2. Install dependencies

```bash
npm install
cd frontend && npm install && cd ..
```

### 3. Start infrastructure services

```bash
docker compose up -d
```

This starts PostgreSQL, Kafka (with Zookeeper), RabbitMQ, and Redis.

### 4. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` with your local settings. The defaults match the Docker Compose configuration.

### 5. Run database migrations and seed

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

### 6. Start the backend

```bash
npm run dev
```

The API server starts on `http://localhost:3000` and the Prometheus metrics server on `http://localhost:9090/metrics`.

### 7. Start the frontend

```bash
cd frontend && npm run dev
```

The Vite dev server starts on `http://localhost:5173`.

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/status` | System status with component health, metrics, providers, and circuit breakers |
| `GET` | `/api/events/types` | List all supported event types |
| `POST` | `/api/events` | Submit a new event for processing |
| `GET` | `/api/notifications` | Search and filter notifications |
| `GET` | `/api/dlq` | List dead-letter queue entries |
| `POST` | `/api/dlq/:id/replay` | Replay a DLQ entry |
| `GET` | `/api/providers` | List delivery providers |
| `PATCH` | `/api/providers/:id` | Toggle provider active/inactive |
| `GET` | `/api/templates` | List notification templates |
| `POST` | `/api/templates` | Create a template |
| `PATCH` | `/api/templates/:id` | Update a template |
| `DELETE` | `/api/templates/:id` | Delete a template |
| `GET` | `/api/users` | List users with preferences |
| `PATCH` | `/api/users/:userId/preferences` | Update user preferences |
| `GET` | `/api/analytics/stream` | SSE stream of real-time metrics snapshots |
| `GET` | `/api/proxy/website?url=...` | Proxy fetch a website (strips X-Frame-Options/CSP) |

## Deployment

### Frontend (Vercel)

The React frontend is deployable to Vercel with zero configuration:

1. Connect your GitHub repository to Vercel
2. Set the **Root Directory** to `frontend`
3. Vercel auto-detects Vite and applies the correct build settings

### Backend

The backend can be deployed to any Node.js hosting platform (Railway, Render, Fly.io, or a VPS). A `Dockerfile` is included at the repository root for containerized deployment.

## License

MIT