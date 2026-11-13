// Creates the first admin from ADMIN_EMAIL / ADMIN_PASSWORD. Safe to re-run.
//
// Public sign-up is disabled (disableSignUp also blocks auth.api.signUpEmail),
// so this does what the sign-up endpoint does internally: hash the password
// with Better Auth, create the user, and link a "credential" account.
import { auth } from "../src/auth.ts";
import { prisma } from "../src/db.ts";

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set");
  }

  const ctx = await auth.$context;
  const { minPasswordLength, maxPasswordLength } = ctx.password.config;
  if (password.length < minPasswordLength || password.length > maxPasswordLength) {
    throw new Error(
      `ADMIN_PASSWORD must be ${minPasswordLength}-${maxPasswordLength} characters`,
    );
  }

  const existing = await ctx.internalAdapter.findUserByEmail(email);
  if (existing) {
    await prisma.user.update({
      where: { id: existing.user.id },
      data: { role: "admin" },
    });
    console.log(`Admin ${email} already exists (id ${existing.user.id}); role ensured.`);
    return;
  }

  const hash = await ctx.password.hash(password);
  const user = await ctx.internalAdapter.createUser(
    { email, name: "Admin", emailVerified: true, role: "admin" },
    { method: "admin" }, // provisioning source: created server-side, not via sign-up
  );
  await ctx.internalAdapter.linkAccount({
    userId: user.id,
    providerId: "credential",
    accountId: user.id,
    password: hash,
  });
  console.log(`Created admin ${email} (id ${user.id}).`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
