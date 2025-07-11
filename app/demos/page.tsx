import React from "react";

export default function DemosPage() {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 32 }}>
      <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 24 }}>Live Demos & Coding Sessions</h1>
      <p style={{ marginBottom: 24 }}>
        Watch live and recorded demos of CodePal in action. Join our next session or catch up on past events!
      </p>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 12 }}>Featured Demo</h2>
        <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', marginBottom: 24 }}>
          <iframe
            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
            title="CodePal Live Demo"
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
        <div>
          <a href="https://www.twitch.tv/codepal" target="_blank" rel="noopener noreferrer" style={{ color: '#9147ff', textDecoration: 'underline', fontWeight: 600 }}>Follow us on Twitch for live sessions</a>
        </div>
      </div>
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>Upcoming Sessions</h2>
        <ul>
          <li>June 10, 2024 – “AI Code Review Showdown” (YouTube Live)</li>
          <li>June 17, 2024 – “Building Plugins with CodePal” (Twitch)</li>
        </ul>
      </div>
    </div>
  );
} 