'use client';

import { useState } from 'react';

interface EnhancedAuthFormProps {
  mode: 'signin' | 'signup';
  onSuccess: (user: any) => void;
}

export default function EnhancedAuthForm({ mode, onSuccess }: EnhancedAuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [showPassword, setShowPassword] = useState(false);

  const validatePassword = (password: string) => {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push("At least 8 characters");
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push("One uppercase letter");
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push("One lowercase letter");
    }
    
    if (!/\d/.test(password)) {
      errors.push("One number");
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push("One special character");
    }
    
    setPasswordErrors(errors);
    return errors.length === 0;
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (mode === 'signup') {
      validatePassword(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = mode === 'signup' ? '/api/auth/enhanced-signup' : '/api/auth/enhanced-signin';
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          ...(mode === 'signup' && { name }),
        }),
      });

      const data = await response.json();

      if (data.success) {
        onSuccess(data.user);
      } else {
        setError(data.error || 'Authentication failed');
        if (data.details) {
          setPasswordErrors(data.details);
        }
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: '450px',
      margin: '0 auto',
      padding: '30px',
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      border: '1px solid #e5e7eb'
    }}>
      <h2 style={{ 
        textAlign: 'center', 
        marginBottom: '25px', 
        color: '#2563eb',
        fontSize: '1.8rem',
        fontWeight: 'bold'
      }}>
        {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
      </h2>
      
      <form onSubmit={handleSubmit}>
        {mode === 'signup' && (
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '600',
              color: '#374151'
            }}>
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '16px',
                transition: 'border-color 0.2s'
              }}
              placeholder="Enter your full name"
            />
          </div>
        )}
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontWeight: '600',
            color: '#374151'
          }}>
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '16px',
              transition: 'border-color 0.2s'
            }}
            placeholder="Enter your email"
            required
          />
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontWeight: '600',
            color: '#374151'
          }}>
            Password
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                paddingRight: '50px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '16px',
                transition: 'border-color 0.2s'
              }}
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#6b7280'
              }}
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
          
          {mode === 'signup' && passwordErrors.length > 0 && (
            <div style={{
              marginTop: '8px',
              padding: '8px',
              backgroundColor: '#fef2f2',
              borderRadius: '6px',
              fontSize: '14px',
              color: '#dc2626'
            }}>
              <strong>Password requirements:</strong>
              <ul style={{ margin: '4px 0 0 0', paddingLeft: '20px' }}>
                {passwordErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        {error && (
          <div style={{
            color: '#dc2626',
            backgroundColor: '#fef2f2',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '14px',
            border: '1px solid #fecaca'
          }}>
            {error}
          </div>
        )}
        
        <button
          type="submit"
          disabled={loading || (mode === 'signup' && passwordErrors.length > 0)}
          style={{
            width: '100%',
            padding: '14px',
            backgroundColor: loading || (mode === 'signup' && passwordErrors.length > 0) ? '#9ca3af' : '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: loading || (mode === 'signup' && passwordErrors.length > 0) ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s'
          }}
        >
          {loading ? 'Processing...' : (mode === 'signin' ? 'Sign In' : 'Create Account')}
        </button>
      </form>
      
      {mode === 'signin' && (
        <div style={{
          marginTop: '20px',
          textAlign: 'center'
        }}>
          <button
            onClick={() => {/* TODO: Implement forgot password */}}
            style={{
              background: 'none',
              border: 'none',
              color: '#2563eb',
              cursor: 'pointer',
              fontSize: '14px',
              textDecoration: 'underline'
            }}
          >
            Forgot your password?
          </button>
        </div>
      )}
    </div>
  );
} 