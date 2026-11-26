import { useState } from 'react'
import { Logo } from './Landing.jsx'

export default function Auth({ mode, go }) {
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [error, setError] = useState('')
  const [resetSent, setResetSent] = useState(false)

  const switchTo = (m) => {
    setError('')
    setResetSent(false)
    go(m)
  }

  // shortcut: backend heeft nog geen login-endpoint; alleen lege velden worden gecontroleerd.
  const doLogin = (e) => {
    e.preventDefault()
    if (!email) return setError('E-mail niet ingevuld')
    if (!pw) return setError('Wachtwoord niet ingevuld')
    go('app')
  }

  // shortcut: nog geen reset-endpoint in de backend; alleen de melding uit het ontwerp.
  const doReset = (e) => {
    e.preventDefault()
    if (!email) return setError('E-mail niet ingevuld')
    setError('')
    setResetSent(true)
  }

  const emailField = (
    <label>
      E-mailadres
      <input type="email" placeholder="naam@voorbeeld.nl" value={email} onChange={(e) => setEmail(e.target.value)} />
    </label>
  )

  return (
    <div className="page">
      <div className="auth">
        <div className="auth-side stripes">
          <button className="link-plain" onClick={() => switchTo('landing')}><Logo /></button>
        </div>
        <div className="auth-panel">
          {mode === 'login' ? (
            <form className="auth-form" onSubmit={doLogin} noValidate>
              <h1>Inloggen</h1>
              <div className="fields">
                {emailField}
                <label>
                  Wachtwoord
                  <input type="password" placeholder="••••••••" value={pw} onChange={(e) => setPw(e.target.value)} />
                </label>
                <button type="button" className="link-btn right" onClick={() => switchTo('forgot')}>Wachtwoord vergeten?</button>
                {error && <div className="error" role="alert">{error}</div>}
              </div>
              <button className="btn-primary block">Log in</button>
            </form>
          ) : (
            <form className="auth-form" onSubmit={doReset} noValidate>
              <h1>Wachtwoord vergeten</h1>
              <p className="muted">Vul je e-mailadres in. We sturen je een link om een nieuw wachtwoord in te stellen.</p>
              {emailField}
              {error && <div className="error" role="alert">{error}</div>}
              {resetSent && (
                <div className="notice-ok">
                  <span className="ms" aria-hidden="true">mark_email_read</span>
                  <span>Check je mail. Als dit adres bij ons bekend is, krijg je binnen een paar minuten een link.</span>
                </div>
              )}
              <button className="btn-primary block">Stuur resetlink</button>
              <button type="button" className="link-btn" onClick={() => switchTo('login')}>
                <span className="ms" aria-hidden="true">arrow_back</span>Terug naar inloggen
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
