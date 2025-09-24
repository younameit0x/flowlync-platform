'use client';

import { useState } from 'react';

export default function DemoLinkGenerator() {
  const [linkId, setLinkId] = useState('demo1');
  const [generatedLink, setGeneratedLink] = useState('');

  const generateLink = () => {
    // For demo, use a hardcoded or random linkId
    const id = linkId || 'demo1';
    setGeneratedLink(`${window.location.origin}/api/track?linkId=${id}`);
  };

  return (
    <div style={{ padding: 32, fontFamily: 'Arial, sans-serif' }}>
      <h2>Demo Link Generator</h2>
      <div style={{ marginBottom: 16 }}>
        <input
          type="text"
          value={linkId}
          onChange={e => setLinkId(e.target.value)}
          placeholder="Enter linkId (e.g. demo1)"
          style={{ padding: 8, marginRight: 8, border: '1px solid #ccc', borderRadius: 4 }}
        />
        <button 
          onClick={generateLink}
          style={{ padding: 8, background: '#0070f3', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}
        >
          Generate Link
        </button>
      </div>
      {generatedLink && (
        <div style={{ marginTop: 16, padding: 16, background: '#f0f0f0', borderRadius: 4 }}>
          <strong>Tracking Link:</strong>
          <div style={{ marginTop: 8 }}>
            <a href={generatedLink} target="_blank" rel="noopener noreferrer" style={{ color: '#0070f3' }}>
              {generatedLink}
            </a>
          </div>
          <div style={{ marginTop: 8, fontSize: '14px', color: '#666' }}>
            Click this link to test the tracking system
          </div>
        </div>
      )}
    </div>
  );
}