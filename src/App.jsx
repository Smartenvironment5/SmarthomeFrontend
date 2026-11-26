import { useEffect, useState } from 'react'
import Landing from './components/Landing.jsx'
import Auth from './components/Auth.jsx'
import Dashboard from './components/Dashboard.jsx'
import { fetchLatest } from './sensors.js'

const POLL_MS = 30000 // backend poller ververst ook elke 30 s

export default function App() {
  const [screen, setScreen] = useState('landing') // landing | login | forgot | app
  const [history, setHistory] = useState({}) // deviceId -> metingen (oud -> nieuw)
  const [error, setError] = useState('')

  useEffect(() => {
    if (screen !== 'app') return
    let stop = false
    async function load() {
      try {
        const m = await fetchLatest()
        if (stop) return
        setError('')
        if (!m) return
        setHistory((h) => {
          const list = h[m.deviceId] ?? []
          if (list.at(-1)?.timestamp === m.timestamp) return h
          // shortcut: geschiedenis leeft alleen in de browser; vervangen zodra de backend /telemetry doorgeeft.
          return { ...h, [m.deviceId]: [...list, m].slice(-500) }
        })
      } catch {
        if (!stop) setError('Backend niet bereikbaar. Controleer of de API draait en probeer het opnieuw.')
      }
    }
    load()
    const id = setInterval(load, POLL_MS)
    return () => {
      stop = true
      clearInterval(id)
    }
  }, [screen])

  if (screen === 'landing') return <Landing onLogin={() => setScreen('login')} />
  if (screen === 'app') return <Dashboard history={history} error={error} onLogout={() => setScreen('login')} />
  return <Auth mode={screen} go={setScreen} />
}
