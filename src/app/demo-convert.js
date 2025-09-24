import { useRouter } from 'next/router';
import { useState } from 'react';

export default function DemoConvert() {
  const router = useRouter();
  const { linkId } = router.query;
  const [status, setStatus] = useState('idle');

  const handleConvert = async () => {
    setStatus('loading');
    const res = await fetch('/api/convert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ linkId }),
    });
    if (res.ok) {
      setStatus('success');
    } else {
      setStatus('error');
    }
  };

  return (
    <div style={{ padding: 32 }}>
      <h2>Demo Conversion Simulation</h2>
      <p>Link ID: <strong>{linkId}</strong></p>
      <button onClick={handleConvert} disabled={status === 'loading'}>
        Simulate Conversion
      </button>
      {status === 'success' && <p style={{ color: 'green' }}>Conversion logged!</p>}
      {status === 'error' && <p style={{ color: 'red' }}>Error logging conversion.</p>}
    </div>
  );
}
