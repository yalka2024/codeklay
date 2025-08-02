export default function MinimalPage() {
  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      padding: '40px',
      maxWidth: '800px',
      margin: '0 auto',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <h1 style={{ color: '#2563eb', marginBottom: '20px' }}>
          🚀 CodePal Platform - Minimal Test
        </h1>
        
        <p style={{ fontSize: '18px', color: '#374151', marginBottom: '30px' }}>
          If you can see this page, the server is working correctly!
        </p>

        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '25px',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <h2 style={{ marginTop: '0' }}>✅ Server Status: RUNNING</h2>
          <p>Next.js development server is operational</p>
        </div>

        <div style={{ marginTop: '30px' }}>
          <h3 style={{ color: '#1f2937' }}>Available Features:</h3>
          <ul style={{ fontSize: '16px', lineHeight: '1.6' }}>
            <li>🧠 Quantum Computing Integration</li>
            <li>🥽 VR/AR Development Tools</li>
            <li>⛓️ Blockchain Collaboration</li>
            <li>🤖 AI Agents</li>
            <li>📊 Analytics Dashboard</li>
            <li>🌐 Multi-language Support</li>
          </ul>
        </div>

        <div style={{
          marginTop: '30px',
          padding: '15px',
          backgroundColor: '#f0f9ff',
          border: '1px solid #0ea5e9',
          borderRadius: '6px'
        }}>
          <p style={{ margin: '0', color: '#0369a1' }}>
            <strong>Next Steps:</strong> Once this page loads successfully, 
            we can proceed to access the full CodePal platform features.
          </p>
        </div>
      </div>
    </div>
  );
} 