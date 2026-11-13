# Implementation Plan

The project is split into 10 phases. Each phase ends with something working that you can test before moving on.

---

## Phase 1 – Project Setup

**Goal:** Frontend, backend, and database run locally with one command.

- [x] Create the monorepo folders: `client/` and `server/`
- [x] Set up the React + TypeScript + Vite app in `client/`
- [x] Set up the Express + TypeScript server in `server/`
- [x] Add a `GET /api/health` endpoint


---

## Phase 2 – Database Schema

**Goal:** All core tables exist.

- [ ] `User` model (name, email, password hash, role: `admin` | `agent`, active flag)
- [ ] `Session` model (for database sessions)
- [ ] `Ticket` model (subject, sender email, sender name, status, category, summary, assigned agent, timestamps)
- [ ] `TicketStatus` enum: `open`, `resolved`, `closed`
- [ ] `TicketCategory` enum: `general_question`, `technical_question`, `refund_request`
- [ ] `Message` model (ticket ID, direction: inbound/outbound, body, sender, timestamp, email message ID)
- [ ] `KnowledgeArticle` model (title, content, embedding vector)
- [ ] Run the first migration
- [ ] Add indexes on ticket status, category, and created date

**Done when:** the migration runs cleanly and Prisma Studio shows all the tables.

---

## Phase 3 – Authentication

**Goal:** Users can log in and out with database sessions.

- [ ] Install and configure Better Auth with the Prisma adapter
- [ ] Enable email/password login with database sessions
- [ ] Write a seed script that creates the first admin from `ADMIN_EMAIL` / `ADMIN_PASSWORD`
- [ ] Add `requireAuth` middleware (rejects requests without a valid session)
- [ ] Add `requireAdmin` middleware (rejects non-admins)
- [ ] Add `GET /api/me` to return the logged-in user
- [x] Build the login page
- [x] Add a logout button
- [x] Add protected routes in React Router (redirect to login when signed out)
- [ ] Write tests for login, logout, and protected routes

**Done when:** the seeded admin can log in, see a protected page, and log out.

---

## Phase 4 – User Management (Admin Only)

**Goal:** The admin can create and manage agents.

- [ ] `GET /api/users` – list users
- [ ] `POST /api/users` – create an agent
- [ ] `PATCH /api/users/:id` – edit name/email
- [ ] `PATCH /api/users/:id/deactivate` – deactivate an agent and delete their sessions
- [ ] Validate request bodies with Zod
- [ ] Build the users page (table of users)
- [ ] Build the "Create Agent" form
- [ ] Add edit and deactivate actions
- [ ] Hide the users page from agents
- [ ] Write tests confirming agents get `403` on user endpoints

**Done when:** the admin creates an agent, the agent logs in, and the agent can't open the users page.

---

## Phase 5 – Email Intake (Create Tickets)

**Goal:** Incoming support emails become tickets.

- [ ] Set up a SendGrid or Mailgun account and an inbound domain/route
- [ ] Add `POST /api/webhooks/inbound-email`
- [ ] Verify the webhook signature so only the provider can call it
- [ ] Parse sender, subject, and body (prefer plain text, strip quoted replies)
- [ ] Create a new ticket with status `open` and its first message
- [ ] Detect replies to existing tickets (by email headers or a ticket ID in the subject) and add them as messages
- [ ] Reopen a resolved ticket when the student replies
- [ ] Ignore duplicate webhook deliveries
- [ ] Test locally with a tunnel (e.g. ngrok) and sample payloads
- [ ] Write tests for new tickets, replies, and duplicates

**Done when:** sending an email to the support address creates a ticket in the database.

---

## Phase 6 – Ticket List and Ticket Details

**Goal:** Agents can browse, view, and update tickets.

- [ ] `GET /api/tickets` with filters (status, category, assigned agent, search) and sorting (date, status)
- [ ] Add pagination to the ticket list endpoint
- [ ] `GET /api/tickets/:id` – ticket with its messages
- [ ] `PATCH /api/tickets/:id` – change status, category, or assigned agent
- [ ] Build the ticket list page with TanStack Table
- [ ] Add filter controls (status, category, agent) and a search box
- [ ] Add sortable columns
- [ ] Keep filters in the URL so views can be shared or bookmarked
- [ ] Build the ticket details page (conversation thread, status, category)
- [ ] Add controls to change status, category, and assigned agent

**Done when:** an agent can filter the list, open a ticket, read the thread, and change its status.

---

## Phase 7 – Manual Replies

**Goal:** Agents can reply to students by email.

- [ ] `POST /api/tickets/:id/replies` – save an outbound message
- [ ] Send the reply through SendGrid or Mailgun
- [ ] Set threading headers (`In-Reply-To`, `References`) so the reply stays in the student's email thread
- [ ] Build a reply box on the ticket details page
- [ ] Offer "Send and mark Resolved"
- [ ] Show send errors to the agent
- [ ] Write tests for reply sending (with the email provider mocked)

**Done when:** an agent's reply arrives in the student's inbox in the same thread.

---

## Phase 8 – AI Classification and Summaries

**Goal:** New tickets are categorized and summarized automatically.

- [ ] Install the Anthropic SDK and add the API key to `.env`
- [ ] Set up pg-boss for background jobs
- [ ] Queue a `classify-ticket` job when a ticket is created
- [ ] Prompt Claude Haiku 5.5 to return JSON: `{ category, summary, confidence }`
- [ ] Validate the AI response with Zod; fall back to `general_question` if it's invalid
- [ ] Save the category and summary on the ticket
- [ ] Show the summary at the top of the ticket details page
- [ ] Let agents override the AI-picked category
- [ ] Add retries and log failures
- [ ] Write tests with Claude responses mocked

**Done when:** a new email becomes a ticket with a category and summary within a few seconds.

---

## Phase 9 – Knowledge Base and AI Replies

**Goal:** Claude suggests replies grounded in the knowledge base, and can auto-respond.

### Knowledge base
- [ ] CRUD endpoints for knowledge articles (admin only)
- [ ] Build the knowledge base management page
- [ ] Generate and store an embedding for each article (pgvector)
- [ ] Write a search function that finds the most relevant articles for a ticket

### AI-suggested replies
- [ ] Queue a `draft-reply` job after classification
- [ ] Prompt Claude Sonnet 5.5 with the ticket thread plus relevant articles
- [ ] Tell Claude to answer only from the articles and flag when it can't
- [ ] Save the draft on the ticket
- [ ] Show the draft in the reply box so the agent can edit and send it
- [ ] Add a "Regenerate" button

### Auto-generated responses
- [ ] Add an admin setting to turn auto-reply on or off
- [ ] Auto-send only when confidence is high and the category is `general_question`
- [ ] Mark auto-sent messages clearly in the thread
- [ ] Never auto-send refund requests

**Done when:** an agent opens a ticket and finds an accurate draft based on the knowledge base.

---

## Phase 10 – Dashboard, Testing, and Deployment

**Goal:** The app is finished, tested, and live.

### Dashboard
- [ ] `GET /api/stats` – ticket counts by status and category
- [ ] Build stat cards (open, resolved, closed)
- [ ] Add a breakdown by category
- [ ] Add a "recent tickets" list
- [ ] Make the dashboard the home page after login

### Testing and polish
- [ ] Playwright tests: login, create agent, view ticket, send reply
- [ ] Add loading, empty, and error states on every page
- [ ] Add rate limiting on login and webhook endpoints
- [ ] Add a scheduled job to clean up expired sessions

### Deployment
- [ ] Write a production Dockerfile for the server and client
- [ ] Choose a cloud provider (AWS, Railway, Fly.io) and set up managed PostgreSQL with pgvector
- [ ] Set production environment variables
- [ ] Run migrations and the admin seed on deploy
- [ ] Point the email provider's inbound webhook at the production URL
- [ ] Send a test email from start to finish in production

**Done when:** a real email to the support address flows through the live system and gets answered.

---

## Phase Summary

| Phase | Focus | Result |
|---|---|---|
| 1 | Project setup | Apps run locally |
| 2 | Database schema | Tables created |
| 3 | Authentication | Admin can log in |
| 4 | User management | Admin creates agents |
| 5 | Email intake | Emails become tickets |
| 6 | Ticket list and details | Agents manage tickets |
| 7 | Manual replies | Agents reply by email |
| 8 | AI classification and summaries | Tickets auto-categorized |
| 9 | Knowledge base and AI replies | AI drafts and auto-replies |
| 10 | Dashboard, testing, deployment | Live system |
