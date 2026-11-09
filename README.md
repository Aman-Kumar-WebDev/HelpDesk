# Helpdesk

AI-powered support ticket management. See `project.scope.md`, `tech-stack.md`, and `implementation-plan.md`.

## Stack

- **Runtime / package manager:** Bun (workspaces)
- **Client:** React 19 + TypeScript + Vite 8 (`client/`)
- **Server:** Express 5 + TypeScript, run directly by Bun (`server/`)

## Getting started

```bash
bun install
cp server/.env.example server/.env
bun run dev
```

- Client: http://localhost:5173
- API: http://localhost:3000 (the Vite dev server proxies `/api/*` to it)

## Scripts (from the repo root)

| Command             | What it does                                  |
| ------------------- | --------------------------------------------- |
| `bun run dev`       | Starts client and server together, with reload |
| `bun run build`     | Builds the client and server (`dist/`)         |
| `bun run typecheck` | Type-checks both workspaces                     |

## Structure

```
client/          React app (Vite)
  src/App.tsx    Home page, calls /api/health
  vite.config.ts Dev proxy for /api
server/
  src/index.ts   Express server: middleware, /api/health, listen
```
