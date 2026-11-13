import { useState } from 'react'
import { useNavigate } from 'react-router'
import { signOut, type SessionUser } from '../lib/auth-client.ts'

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join('')
}

export default function Navbar({ user }: { user: SessionUser }) {
  const navigate = useNavigate()
  const [signingOut, setSigningOut] = useState(false)

  const handleSignOut = async () => {
    setSigningOut(true)
    await signOut()
    navigate('/login', { replace: true })
  }

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/85 text-slate-100 shadow-lg shadow-black/20 backdrop-blur-xl">
      {/* Hairline highlight along the top edge */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-amber-300/60 to-transparent" />

      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="grid size-9 place-items-center rounded-xl bg-linear-to-br from-amber-300 via-amber-400 to-amber-600 shadow-md shadow-amber-500/30 ring-1 ring-white/20">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-5 text-slate-950" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 13v-1a8 8 0 0 1 16 0v1M4 13a2 2 0 0 0 2 2h1v-5H6a2 2 0 0 0-2 2Zm16 0a2 2 0 0 1-2 2h-1v-5h1a2 2 0 0 1 2 2Zm-3 2v1a3 3 0 0 1-3 3h-2" />
            </svg>
          </div>
          <div className="leading-tight">
            <span className="block text-base font-semibold tracking-tight">Helpdesk</span>
            <span className="block text-[11px] font-medium uppercase tracking-[0.18em] text-slate-400">Support Suite</span>
          </div>
        </div>

        {/* User + actions */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 py-1 pl-1 pr-4">
            <div className="grid size-8 place-items-center rounded-full bg-linear-to-br from-slate-600 to-slate-800 text-xs font-semibold text-amber-200 ring-1 ring-amber-300/40">
              {initials(user.name)}
            </div>
            <div className="hidden leading-tight sm:block">
              <span className="block text-sm font-medium">{user.name}</span>
              {user.role && (
                <span className="block text-[11px] font-medium capitalize text-amber-300/90">{user.role}</span>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            disabled={signingOut}
            className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-amber-300/50 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/60 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {signingOut ? 'Signing out…' : 'Sign out'}
          </button>
        </div>
      </nav>
    </header>
  )
}
