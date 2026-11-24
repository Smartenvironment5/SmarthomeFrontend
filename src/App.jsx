import { useEffect, useState } from 'react';

export default function App() {
  const [status, setStatus] = useState('Verbinden met backend...');
  const [sensorData, setSensorData] = useState(null);
  const [error, setError] = useState('');

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    async function testConnection() {
      try {
        const healthRes = await fetch(`${apiBaseUrl}/health/db`);
        if (!healthRes.ok) {
          throw new Error(`Backend reageerde met status ${healthRes.status}`);
        }
        setStatus('Verbonden met backend en database (200 OK)');

        const testRes = await fetch(`${apiBaseUrl}/test`);
        if (testRes.ok) {
          const data = await testRes.json();
          setSensorData(data);
        }
      } catch (err) {
        setError(err.message);
        setStatus('Verbinding mislukt');
      }
    }

    testConnection();
  }, [apiBaseUrl]);

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Smart Home Frontend</h1>
      <p><strong>API URL uit .env:</strong> {apiBaseUrl || 'Niet ingesteld!'}</p>
      <p><strong>Status:</strong> {status}</p>

      {error && (
        <p style={{ color: 'red' }}>
          <strong>Foutmelding:</strong> {error}
        </p>
      )}

      {sensorData && (
        <pre>{JSON.stringify(sensorData, null, 2)}</pre>
      )}
    </main>
  );
}
