import { useState } from 'react'
import RoomChart from './RoomChart.jsx'
import { METRICS, STATUS, fmt, isValid, statusOf, timeOf } from '../sensors.js'

const KEYS = Object.keys(METRICS)

function Badge({ status }) {
  const st = STATUS[status]
  return (
    <span className={`badge ${st.cls}`}>
      <span className="ms" aria-hidden="true">{st.icon}</span>
      {st.text}
    </span>
  )
}

function alertsFor(devices) {
  const alerts = []
  devices.forEach((d) => {
    if (!isValid(d)) return alerts.push({ room: d.deviceName, status: 'invalid', text: 'ongeldige meting, sensor mogelijk defect' })
    KEYS.forEach((k) => {
      const s = statusOf(k, d[k])
      const m = METRICS[k]
      if (s !== 'ok') alerts.push({ room: d.deviceName, status: s, text: `${m.label.toLowerCase()} ${fmt(d[k], m.dec)} ${m.unit} (grens ${m.lo}–${m.hi} ${m.unit})` })
    })
  })
  return alerts
}

function Overview({ devices, open }) {
  const alerts = alertsFor(devices)
  return (
    <div className="stack">
      {alerts.length > 0 && (
        <div className="card alerts">
          <div className="icon-box warn"><span className="ms" aria-hidden="true">notifications</span></div>
          <div className="alerts-list">
            <div className="alerts-title">{alerts.length} {alerts.length === 1 ? 'melding' : 'meldingen'}</div>
            {alerts.map((a, i) => (
              <div key={i} className="alert-row">
                <Badge status={a.status} />
                <span><b>{a.room}</b> · {a.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="room-grid">
        {devices.map((d) => (
          <div key={d.deviceId} className="card room-card">
            <div className="room-head">
              <div className="room-name">
                <div className="icon-box"><span className="ms" aria-hidden="true">sensors</span></div>
                {d.deviceName}
              </div>
              <button className="link-btn" onClick={() => open(d.deviceId)}>
                Bekijk kamer<span className="ms" aria-hidden="true">chevron_right</span>
              </button>
            </div>
            {KEYS.map((k) => (
              <div key={k} className="metric-row">
                <span className="muted">{METRICS[k].label}</span>
                {isValid(d) ? (
                  <span className="metric-val">
                    <b>{fmt(d[k], METRICS[k].dec)}</b> <small>{METRICS[k].unit}</small>
                    <Badge status={statusOf(k, d[k])} />
                  </span>
                ) : (
                  <span className="muted">ongeldig</span>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

function Room({ readings }) {
  const [metric, setMetric] = useState('temperature')
  const latest = readings.at(-1)
  const valid = readings.filter(isValid)
  const m = METRICS[metric] // undefined bij 'compare'
  const ok = isValid(latest)

  return (
    <div className="stack">
      <div className="card chart-card">
        <div className="chart-head">
          <div>
            <div className="chart-title">{m ? `${m.label} (${m.unit})` : 'Temperatuur vs. luchtvochtigheid'}</div>
            <div className="muted small">
              Sinds openen dashboard · {latest.deviceName}{m && ` · grens ${m.lo}–${m.hi} ${m.unit}`}
            </div>
          </div>
          <div className="tabs">
            {KEYS.map((k) => (
              <button key={k} className={k === metric ? 'active' : ''} onClick={() => setMetric(k)}>{METRICS[k].label}</button>
            ))}
            <button className={metric === 'compare' ? 'active' : ''} onClick={() => setMetric('compare')}>Vergelijk</button>
          </div>
        </div>
        <div className="chart-box">
          <RoomChart readings={valid} metric={metric} />
        </div>
      </div>

      <div className="panel-grid">
        {KEYS.map((k) => {
          const s = ok ? statusOf(k, latest[k]) : null
          return (
            <div key={k} className={`card panel ${s && s !== 'ok' ? `ring-${s}` : ''}`}>
              <div className="room-name small-name">
                <div className="icon-box"><span className="ms" aria-hidden="true">{METRICS[k].icon}</span></div>
                {METRICS[k].label}
              </div>
              <div className="big">{ok ? fmt(latest[k], METRICS[k].dec) : '—'}<small>{METRICS[k].unit}</small></div>
              {s ? <Badge status={s} /> : <span className="error">Ongeldige meting</span>}
              <div className="muted small">Grens {METRICS[k].lo}–{METRICS[k].hi} {METRICS[k].unit} · {timeOf(latest.timestamp)}</div>
            </div>
          )
        })}
        <div className="card panel">
          <div className="room-name small-name">
            <div className="icon-box"><span className="ms" aria-hidden="true">sensors</span></div>
            Metingen
          </div>
          <div className="big">{latest.msgCount.toLocaleString('nl-NL')}</div>
          <div className="muted small">{latest.deviceName} · gemeten {timeOf(latest.timestamp)}</div>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard({ history, error, onLogout }) {
  const [view, setView] = useState('overview') // 'overview' of een deviceId
  const [menu, setMenu] = useState(false)
  const devices = Object.values(history).map((list) => list.at(-1))
  const room = history[view]
  const lastTs = devices.map((d) => d.timestamp).sort().at(-1)

  const nav = [{ id: 'overview', icon: 'dashboard', label: 'Overzicht' }].concat(
    devices.map((d) => ({ id: d.deviceId, icon: 'sensors', label: d.deviceName })),
  )

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="side-logo"><span /></div>
        {nav.map((n) => (
          <button key={n.id} className={`nav-btn ${view === n.id ? 'active' : ''}`} onClick={() => setView(n.id)}>
            <span className="ms" aria-hidden="true">{n.icon}</span>
            <span>{n.label}</span>
          </button>
        ))}
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <div className="muted small">
              {room ? `Overzicht / ${room.at(-1).deviceName}` : `Alle kamers${lastTs ? ` · laatst bijgewerkt ${timeOf(lastTs)}` : ''}`}
            </div>
            <h1>{room ? room.at(-1).deviceName : 'Overzicht'}</h1>
          </div>
          <div className="menu-wrap">
            <button className="avatar" aria-label="Accountmenu" onClick={() => setMenu(!menu)}>
              <span className="ms" aria-hidden="true">person</span>
            </button>
            {menu && (
              <div className="menu">
                <button onClick={onLogout}><span className="ms" aria-hidden="true">logout</span>Uitloggen</button>
              </div>
            )}
          </div>
        </header>

        {error && <div className="card error-card" role="alert">{error}</div>}
        {!error && devices.length === 0 && <div className="card muted">Nog geen sensordata ontvangen van de backend.</div>}
        {room ? <Room readings={room} /> : <Overview devices={devices} open={setView} />}
      </main>
    </div>
  )
}
