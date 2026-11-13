import { Navigate, Outlet } from 'react-router'
import { useSession } from '../lib/auth-client.ts'
import FullPageLoader from './FullPageLoader.tsx'
import Navbar from './Navbar.tsx'

// Layout for signed-in pages: redirects to /login without a session.
export default function ProtectedLayout() {
  const { data: session, isPending } = useSession()

  if (isPending) return <FullPageLoader />
  if (!session) return <Navigate to="/login" replace />

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <Navbar user={session.user} />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <Outlet context={session.user} />
      </main>
    </div>
  )
}
