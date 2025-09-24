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
    <div style={{ padding: 32 }}>
      <h2>Demo Link Generator</h2>
      <input
        type="text"
        value={linkId}
        onChange={e => setLinkId(e.target.value)}
        placeholder="Enter linkId (e.g. demo1)"
        style={{ marginRight: 8 }}
      />
      <button onClick={generateLink}>Generate Link</button>
      {generatedLink && (
        <div style={{ marginTop: 16 }}>
          <strong>Tracking Link:</strong>
          <div>
            <a href={generatedLink} target="_blank" rel="noopener noreferrer">{generatedLink}</a>
          </div>
        </div>
      )}
    </div>
  );
}
