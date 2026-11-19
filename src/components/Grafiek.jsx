import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  PointElement, LineElement, Title, Tooltip, Legend
} from 'chart.js';
import metingen from './testdata.json';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function Grafiek() {
  // De API geeft tijd in UTC; we tonen hem in Nederlandse tijd
  const labels = metingen.map((m) =>
    new Date(m.tijd).toLocaleTimeString('nl-NL', {
      hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Amsterdam'
    })
  );

  const data = {
    labels,
    datasets: [
      { label: 'Temperatuur (°C)', data: metingen.map((m) => m.temperatuur), borderColor: 'red' },
      { label: 'Luchtvochtigheid (%)', data: metingen.map((m) => m.luchtvochtigheid), borderColor: 'blue' }
    ]
  };

  return <Line data={data} />;
}