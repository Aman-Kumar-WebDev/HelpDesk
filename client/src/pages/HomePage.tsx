import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router'
import type { SessionUser } from '../lib/auth-client.ts'

type Health = { status: string }

export default function HomePage() {
  const user = useOutletContext<SessionUser>()
  const [health, setHealth] = useState<Health | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const res = await fetch('/api/health')
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        setHealth(await res.json())
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong')
      }
    }
    fetchHealth()
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Welcome, {user.name}</h1>
        <p className="text-sm text-gray-500">AI-powered support ticket management.</p>
      </div>
      <section className="max-w-md rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-sm font-semibold">API status</h2>
        <p className="mt-1 font-mono text-sm">
          {error && <span className="text-red-600">Unreachable: {error}</span>}
          {!error && !health && 'Checking…'}
          {health && <span className="text-green-700">{health.status}</span>}
        </p>
      </section>
    </div>
  )
}
