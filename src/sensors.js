// Grenswaarden uit Onderzoek 1 (analysedossier); min/max/step alleen voor de y-as.
export const METRICS = {
  temperature: { label: 'Temperatuur', icon: 'device_thermostat', unit: '°C', lo: 18, hi: 24, min: 16, max: 26, dec: 1 },
  humidity: { label: 'Luchtvochtigheid', icon: 'humidity_percentage', unit: '%', lo: 40, hi: 60, min: 20, max: 80, dec: 0 },
  pressure: { label: 'Luchtdruk', icon: 'speed', unit: 'hPa', lo: 990, hi: 1030, min: 980, max: 1040, dec: 0 },
}

export const STATUS = {
  ok: { text: 'Normaal', icon: 'check_circle', cls: 'ok' },
  high: { text: 'Te hoog', icon: 'arrow_upward', cls: 'high' },
  low: { text: 'Te laag', icon: 'arrow_downward', cls: 'low' },
  invalid: { text: 'Ongeldig', icon: 'error', cls: 'invalid' },
}

export const fmt = (v, dec) => v.toFixed(dec).replace('.', ',')
export const statusOf = (key, v) => (v > METRICS[key].hi ? 'high' : v < METRICS[key].lo ? 'low' : 'ok')

// API geeft UTC; alleen voor weergave omzetten.
export const timeOf = (ts) =>
  new Date(ts).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Amsterdam' })

// Onmogelijke waarden zijn een sensorfout en worden niet als geldig getoond.
export const isValid = (m) =>
  m.temperature > -30 && m.temperature < 60 && m.humidity >= 0 && m.humidity <= 100 && m.pressure > 900 && m.pressure < 1100

// Backend (SmartHome.Api) GET /test: laatste meting van de poller, of null als er nog niets is.
export async function fetchLatest() {
  const res = await fetch('/api/test')
  if (!res.ok) throw new Error(`Backend gaf status ${res.status}`)
  return res.json()
}
