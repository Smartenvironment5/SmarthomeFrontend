import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
import antwoord from './testdata.json';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

// Grenswaarden uit Onderzoek 1
const tempGoed = (t) => t >= 18;
const vochtGoed = (v) => v >= 40 && v <= 60;

// Onmogelijke waarden zijn een sensorfout
const isGeldig = (m) => m.temperature > -30 && m.temperature < 60 && m.pressure > 900 && m.pressure < 1100;

export default function Grafiek() {
  const metingen = antwoord.measurements
    .filter(isGeldig)
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  if (metingen.length === 0) {
    return <p>Geen geldige metingen. Mogelijk is de sensor defect.</p>;
  }

  const laatste = metingen[metingen.length - 1];

  const data = {
    labels: metingen.map((m) =>
      new Date(m.timestamp).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Amsterdam' })
    ),
    datasets: [
      {
        label: 'Temperatuur (°C)',
        data: metingen.map((m) => m.temperature),
        borderColor: 'orange',
        pointRadius: 6,
        pointBackgroundColor: metingen.map((m) => (tempGoed(m.temperature) ? 'green' : 'red'))
      },
      {
        label: 'Luchtvochtigheid (%)',
        data: metingen.map((m) => m.humidity),
        borderColor: 'blue',
        pointRadius: 6,
        pointBackgroundColor: metingen.map((m) => (vochtGoed(m.humidity) ? 'green' : 'red'))
      }
    ]
  };

  return (
    <div>
      <h2>{antwoord.deviceName}</h2>
      <p>
        Temperatuur: {laatste.temperature} °C ({tempGoed(laatste.temperature) ? 'goed' : 'te koud'}) |
        Luchtvochtigheid: {laatste.humidity}% ({vochtGoed(laatste.humidity) ? 'goed' : 'niet goed'}) |
        Luchtdruk: {laatste.pressure} hPa
      </p>
      <Line data={data} />
    </div>
  );
}