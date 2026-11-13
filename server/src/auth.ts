import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./db.ts";

// Secret and base URL come from BETTER_AUTH_SECRET / BETTER_AUTH_URL.
// With a database and no secondaryStorage, sessions are stored in the
// `session` table. Cookie cache stays off (the default), so every request
// checks the database and revoking a session takes effect immediately.
export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: process.env.CLIENT_URL ? [process.env.CLIENT_URL] : [],
});
