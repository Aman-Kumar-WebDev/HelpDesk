import type { ReactNode } from 'react'
import { Navigate } from 'react-router'
import { useSession } from '../lib/auth-client.ts'
import FullPageLoader from './FullPageLoader.tsx'

// Pages for signed-out users only (e.g. login). Signed-in users go home.
export default function GuestRoute({ children }: { children: ReactNode }) {
  const { data: session, isPending } = useSession()

  if (isPending) return <FullPageLoader />
  if (session) return <Navigate to="/" replace />
  return children
}
