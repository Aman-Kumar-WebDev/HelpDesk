import { createAuthClient } from 'better-auth/react'
import { inferAdditionalFields } from 'better-auth/client/plugins'

// Same-origin: Vite proxies /api to the server, so no baseURL is needed.
// Additional fields are declared here (not inferred from the server's
// `auth` type) so the client never imports server code.
export const authClient = createAuthClient({
  plugins: [
    inferAdditionalFields({
      user: { role: { type: 'string', required: false } },
    }),
  ],
})

export const { useSession, signIn, signOut } = authClient

export type SessionUser = NonNullable<
  ReturnType<typeof useSession>['data']
>['user']
