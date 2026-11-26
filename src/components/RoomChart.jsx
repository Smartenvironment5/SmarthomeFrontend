import { Line } from 'react-chartjs-2'
import { CategoryScale, Chart as ChartJS, Filler, Legend, LinearScale, LineElement, PointElement, Tooltip } from 'chart.js'
import { METRICS, timeOf } from '../sensors.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend)
ChartJS.defaults.font.family = "'Plus Jakarta Sans', system-ui, sans-serif"
ChartJS.defaults.color = '#5A5650'

const base = {
  responsive: true,
  maintainAspectRatio: false,
  animation: false,
  interaction: { mode: 'index', intersect: false },
  plugins: { legend: { position: 'bottom', labels: { boxHeight: 3, boxWidth: 22 } } },
}

// Temperatuur en luchtvochtigheid samen; elk een eigen y-as omdat de eenheden verschillen.
function compareChart(readings) {
  const t = METRICS.temperature
  const h = METRICS.humidity
  const data = {
    labels: readings.map((r) => timeOf(r.timestamp)),
    datasets: [
      { label: `${t.label} (${t.unit})`, data: readings.map((r) => r.temperature), yAxisID: 'y', borderColor: '#695C49', borderWidth: 3, tension: 0.3, pointRadius: readings.length > 30 ? 0 : 3 },
      { label: `${h.label} (${h.unit})`, data: readings.map((r) => r.humidity), yAxisID: 'y1', borderColor: '#1F45B8', borderWidth: 3, tension: 0.3, pointRadius: readings.length > 30 ? 0 : 3 },
    ],
  }
  const options = {
    ...base,
    scales: {
      x: { grid: { color: '#DDD9D1' } },
      y: { position: 'left', suggestedMin: t.min, suggestedMax: t.max, title: { display: true, text: t.unit }, grid: { color: '#E6E3DD' } },
      y1: { position: 'right', suggestedMin: h.min, suggestedMax: h.max, title: { display: true, text: h.unit }, grid: { drawOnChartArea: false } },
    },
  }
  return <Line data={data} options={options} />
}

export default function RoomChart({ readings, metric }) {
  if (readings.length === 0) return <p className="muted">Geen geldige metingen. Mogelijk is de sensor defect.</p>
  if (metric === 'compare') return compareChart(readings)
  const m = METRICS[metric]

  const flat = (v) => readings.map(() => v)
  const data = {
    labels: readings.map((r) => timeOf(r.timestamp)),
    datasets: [
      { label: 'Gemeten', data: readings.map((r) => r[metric]), borderColor: '#695C49', backgroundColor: 'rgba(105,92,73,0.1)', fill: 'origin', borderWidth: 3, tension: 0.3, pointRadius: readings.length > 30 ? 0 : 3 },
      { label: `Max ${m.hi} ${m.unit}`, data: flat(m.hi), borderColor: '#A13F00', borderDash: [6, 5], borderWidth: 1.5, pointRadius: 0 },
      // vult tot de max-lijn: groene band = normaal bereik
      { label: `Min ${m.lo} ${m.unit}`, data: flat(m.lo), borderColor: '#1F45B8', borderDash: [6, 5], borderWidth: 1.5, pointRadius: 0, fill: '-1', backgroundColor: 'rgba(29,107,63,0.07)' },
    ],
  }

  const options = {
    ...base,
    scales: {
      x: { grid: { color: '#DDD9D1' } },
      y: { suggestedMin: m.min, suggestedMax: m.max, grid: { color: '#E6E3DD' } },
    },
  }

  return <Line data={data} options={options} />
}
