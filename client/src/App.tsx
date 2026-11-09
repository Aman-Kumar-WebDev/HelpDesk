import { useEffect, useState } from 'react'

type Health = { status: string }

function App() {
  const [health, setHealth] = useState<Health | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const res = await fetch('/api/health')
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data: Health = await res.json()
        setHealth(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong')
      }
    }

    fetchHealth()
  }, [])

  return (
    <main className="container">
      <h1>Helpdesk</h1>
      <p>AI-powered support ticket management.</p>
      <section className="card">
        <h2>API status</h2>
        {error && <p className="status error">Unreachable: {error}</p>}
        {!error && !health && <p className="status">Checking…</p>}
        {health && (
          <p className="status ok">
            {health.status}
          </p>
        )}
      </section>
    </main>
  )
}

export default App
