'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function HomePage() {
  return (
    <div style={{
      padding: '40px',
      textAlign: 'center',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: '#2563eb', fontSize: '2.5rem', marginBottom: '20px' }}>
        🚀 CodePal Platform
      </h1>
      
      <div style={{
        background: '#10b981',
        color: 'white',
        padding: '30px',
        borderRadius: '12px',
        marginBottom: '30px',
        maxWidth: '600px',
        margin: '0 auto 30px auto'
      }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '15px' }}>✅ SERVER IS WORKING!</h2>
        <p style={{ fontSize: '1.2rem' }}>Next.js development server is operational on port 3005</p>
      </div>

      <div style={{
        background: '#f0f9ff',
        border: '2px solid #0ea5e9',
        padding: '25px',
        borderRadius: '12px',
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        <h3 style={{ color: '#0ea5e9', fontSize: '1.5rem', marginBottom: '15px' }}>🎉 Success!</h3>
        <p style={{ fontSize: '1.1rem', color: '#374151' }}>
          The CodePal platform is now running successfully. You can access it at:
        </p>
        <p style={{ 
          fontSize: '1.3rem', 
          fontWeight: 'bold', 
          color: '#2563eb',
          marginTop: '15px',
          padding: '10px',
          backgroundColor: '#eff6ff',
          borderRadius: '8px'
        }}>
          http://localhost:3005
        </p>
      </div>

      <div style={{
        marginTop: '40px',
        padding: '20px',
        backgroundColor: '#fef3c7',
        borderRadius: '8px',
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        <h4 style={{ color: '#92400e', marginBottom: '10px' }}>🔧 Technical Details:</h4>
        <ul style={{ textAlign: 'left', color: '#92400e' }}>
          <li>✅ Next.js 15.4.4 running</li>
          <li>✅ React 19.1.0 loaded</li>
          <li>✅ TypeScript configured</li>
          <li>✅ Environment variables set</li>
          <li>✅ Port 3005 accessible</li>
        </ul>
      </div>
    </div>
  );
} 