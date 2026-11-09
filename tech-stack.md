# Tech Stack

**In short:** TypeScript everywhere, PostgreSQL for all data, Claude for AI.

---

## Frontend

- **React + TypeScript** – the web app (built with Vite)
- **React Router** – page navigation (login, dashboard, ticket details, users)
- **Tailwind CSS** – styling
- **TanStack Query** – loads data from the API
- **TanStack Table** – ticket list filtering and sorting

## Backend

- **Node.js + Express + TypeScript** – the REST API
- **Zod** – checks incoming data and AI output
- **pg-boss** – runs background jobs (AI tasks, session cleanup)

## Database

- **PostgreSQL** – stores tickets, users, and sessions
- **pgvector** – searches the knowledge base for relevant articles

## ORM

- **Prisma** – database queries, migrations, and seeding the first admin

## Authentication

- **Database sessions** – sessions are stored in PostgreSQL
- **Better Auth** – email and password login with database sessions
- **Roles** – Admin and Agent

## AI

- **Claude API (Anthropic)** – ticket classification, summaries, and suggested replies
  - **Haiku 5.5** – classification and summaries (fast, low cost)
  - **Sonnet 5.5** – suggested replies (higher quality)

## Email

- **SendGrid or Mailgun**
  - **Inbound webhooks** – turn support emails into tickets
  - **Outbound** – send replies to students

## Testing

- **Vitest** – unit tests
- **Supertest** – API tests
- **Playwright** – end-to-end tests

## Deployment

- **Docker** – packages the app; Docker Compose runs everything locally
- **Cloud provider** – AWS, Railway, Fly.io, etc.

---

## How Login Works

1. The user logs in with email and password.
2. The server saves a session in the database.
3. The browser gets a secure cookie holding the session ID.
4. Each request checks that session to find the user and their role.
5. Logging out deletes the session right away.

**Why database sessions?** You can sign a user out instantly, for example when an agent is removed.

## Initial Admin

The first admin is created when the system is deployed, using these environment variables:

```
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your-secure-password
```

The admin then creates agents from the user management screen.

## How a Ticket Flows

1. A student sends an email.
2. SendGrid or Mailgun forwards it to the backend through an inbound webhook.
3. A ticket is created with status **Open**.
4. Claude picks the category and writes a summary.
5. Claude drafts a reply using the knowledge base.
6. An agent reviews the draft and sends it.
7. The ticket moves to **Resolved**, then **Closed**.
