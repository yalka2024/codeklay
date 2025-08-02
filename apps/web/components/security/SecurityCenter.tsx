// Security Center for CodePal
// Features: MFA, audit logs, security monitoring, threat detection

import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';

interface SecurityEvent {
  id: string;
  type: 'login' | 'logout' | 'password_change' | 'mfa_enabled' | 'mfa_disabled' | 'suspicious_activity' | 'api_access' | 'file_access';
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  location: string;
  status: 'success' | 'failed' | 'blocked';
  details: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

interface SecuritySettings {
  mfaEnabled: boolean;
  mfaMethod: 'totp' | 'sms' | 'email' | 'hardware';
  passwordLastChanged: string;
  passwordStrength: 'weak' | 'medium' | 'strong';
  sessionTimeout: number;
  maxLoginAttempts: number;
  ipWhitelist: string[];
  apiKeyRotation: boolean;
  auditLogging: boolean;
  threatDetection: boolean;
}

interface SecurityThreat {
  id: string;
  type: 'brute_force' | 'suspicious_ip' | 'unusual_activity' | 'data_breach' | 'malware' | 'phishing';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  timestamp: string;
  status: 'active' | 'investigating' | 'resolved' | 'false_positive';
  affectedUsers: number;
  recommendation: string;
}

export default function SecurityCenter() {
  const { user } = useAuthContext();
  const [activeTab, setActiveTab] = useState('overview');
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    mfaEnabled: false,
    mfaMethod: 'totp',
    passwordLastChanged: '2024-01-15',
    passwordStrength: 'strong',
    sessionTimeout: 3600,
    maxLoginAttempts: 5,
    ipWhitelist: [],
    apiKeyRotation: true,
    auditLogging: true,
    threatDetection: true
  });

  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [securityThreats, setSecurityThreats] = useState<SecurityThreat[]>([]);
  const [mfaSetupStep, setMfaSetupStep] = useState<'initial' | 'qr' | 'verify' | 'complete'>('initial');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Load security data
  useEffect(() => {
    loadSecurityData();
  }, []);

  const loadSecurityData = async () => {
    try {
      // Load security events
      const eventsResponse = await fetch('/api/security/events');
      if (eventsResponse.ok) {
        const events = await eventsResponse.json();
        setSecurityEvents(events);
      }

      // Load security threats
      const threatsResponse = await fetch('/api/security/threats');
      if (threatsResponse.ok) {
        const threats = await threatsResponse.json();
        setSecurityThreats(threats);
      }

      // Load security settings
      const settingsResponse = await fetch('/api/security/settings');
      if (settingsResponse.ok) {
        const settings = await settingsResponse.json();
        setSecuritySettings(settings);
      }
    } catch (error) {
      console.error('Failed to load security data:', error);
    }
  };

  // MFA Setup
  const setupMFA = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/security/mfa/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        const { qrCodeUrl, secret } = await response.json();
        setQrCodeUrl(qrCodeUrl);
        setMfaSetupStep('qr');
      }
    } catch (error) {
      console.error('Failed to setup MFA:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyMFACode = async () => {
    if (!verificationCode) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/security/mfa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: verificationCode })
      });

      if (response.ok) {
        setMfaSetupStep('complete');
        setSecuritySettings(prev => ({ ...prev, mfaEnabled: true }));
        setVerificationCode('');
      } else {
        alert('Invalid verification code. Please try again.');
      }
    } catch (error) {
      console.error('Failed to verify MFA code:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const disableMFA = async () => {
    if (!confirm('Are you sure you want to disable MFA? This will reduce your account security.')) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/security/mfa/disable', {
        method: 'POST'
      });

      if (response.ok) {
        setSecuritySettings(prev => ({ ...prev, mfaEnabled: false }));
      }
    } catch (error) {
      console.error('Failed to disable MFA:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update security settings
  const updateSecuritySetting = async (setting: keyof SecuritySettings, value: any) => {
    try {
      const response = await fetch('/api/security/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [setting]: value })
      });

      if (response.ok) {
        setSecuritySettings(prev => ({ ...prev, [setting]: value }));
      }
    } catch (error) {
      console.error('Failed to update security setting:', error);
    }
  };

  // Generate new API key
  const generateNewAPIKey = async () => {
    if (!confirm('This will invalidate your current API key. Are you sure?')) {
      return;
    }

    try {
      const response = await fetch('/api/security/api-key/rotate', {
        method: 'POST'
      });

      if (response.ok) {
        const { newApiKey } = await response.json();
        alert(`New API key generated: ${newApiKey}\nPlease save this key securely.`);
      }
    } catch (error) {
      console.error('Failed to generate new API key:', error);
    }
  };

  // Get risk level color
  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'high': return 'text-orange-400';
      case 'critical': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  // Get threat severity color
  const getThreatSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-900 text-green-200';
      case 'medium': return 'bg-yellow-900 text-yellow-200';
      case 'high': return 'bg-orange-900 text-orange-200';
      case 'critical': return 'bg-red-900 text-red-200';
      default: return 'bg-gray-900 text-gray-200';
    }
  };

  const SecurityOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20">
          <h3 className="text-white font-semibold mb-4">Account Security</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">MFA Status</span>
              <span className={`px-2 py-1 rounded text-xs ${
                securitySettings.mfaEnabled ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'
              }`}>
                {securitySettings.mfaEnabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Password Strength</span>
              <span className={`px-2 py-1 rounded text-xs ${
                securitySettings.passwordStrength === 'strong' ? 'bg-green-900 text-green-200' :
                securitySettings.passwordStrength === 'medium' ? 'bg-yellow-900 text-yellow-200' :
                'bg-red-900 text-red-200'
              }`}>
                {securitySettings.passwordStrength}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Last Password Change</span>
              <span className="text-gray-400 text-sm">
                {new Date(securitySettings.passwordLastChanged).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20">
          <h3 className="text-white font-semibold mb-4">Active Threats</h3>
          <div className="space-y-3">
            {securityThreats.filter(t => t.status === 'active').slice(0, 3).map(threat => (
              <div key={threat.id} className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">{threat.type}</span>
                <span className={`px-2 py-1 rounded text-xs ${getThreatSeverityColor(threat.severity)}`}>
                  {threat.severity}
                </span>
              </div>
            ))}
            {securityThreats.filter(t => t.status === 'active').length === 0 && (
              <span className="text-green-400 text-sm">No active threats</span>
            )}
          </div>
        </div>

        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20">
          <h3 className="text-white font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {securityEvents.slice(0, 3).map(event => (
              <div key={event.id} className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">{event.type}</span>
                <span className={`px-2 py-1 rounded text-xs ${
                  event.status === 'success' ? 'bg-green-900 text-green-200' :
                  event.status === 'failed' ? 'bg-red-900 text-red-200' :
                  'bg-yellow-900 text-yellow-200'
                }`}>
                  {event.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const MFASetup = () => (
    <div className="space-y-6">
      <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20">
        <h3 className="text-white font-semibold mb-4">Multi-Factor Authentication</h3>
        
        {!securitySettings.mfaEnabled ? (
          <div className="space-y-4">
            <p className="text-gray-300">
              Enable MFA to add an extra layer of security to your account. 
              You'll need to enter a code from your authenticator app when signing in.
            </p>
            
            {mfaSetupStep === 'initial' && (
              <button
                onClick={setupMFA}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded"
              >
                {isLoading ? 'Setting up...' : 'Setup MFA'}
              </button>
            )}

            {mfaSetupStep === 'qr' && (
              <div className="space-y-4">
                <p className="text-gray-300">
                  Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.):
                </p>
                <div className="bg-white p-4 rounded inline-block">
                  <img src={qrCodeUrl} alt="MFA QR Code" className="w-48 h-48" />
                </div>
                <div className="space-y-2">
                  <label className="block text-gray-300 text-sm">Verification Code:</label>
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="Enter 6-digit code"
                    className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded"
                    maxLength={6}
                  />
                  <button
                    onClick={verifyMFACode}
                    disabled={!verificationCode || isLoading}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 rounded"
                  >
                    {isLoading ? 'Verifying...' : 'Verify Code'}
                  </button>
                </div>
              </div>
            )}

            {mfaSetupStep === 'complete' && (
              <div className="text-green-400">
                ✅ MFA has been successfully enabled for your account!
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-green-400">
              ✅ MFA is currently enabled for your account.
            </div>
            <button
              onClick={disableMFA}
              disabled={isLoading}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 rounded"
            >
              {isLoading ? 'Disabling...' : 'Disable MFA'}
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const SecuritySettingsTab = () => (
    <div className="space-y-6">
      <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20">
        <h3 className="text-white font-semibold mb-4">Security Settings</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-gray-300">Session Timeout (minutes)</label>
              <p className="text-gray-400 text-sm">Automatically log out after inactivity</p>
            </div>
            <select
              value={securitySettings.sessionTimeout / 60}
              onChange={(e) => updateSecuritySetting('sessionTimeout', parseInt(e.target.value) * 60)}
              className="bg-gray-700 text-white px-3 py-2 rounded border border-gray-600"
            >
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={60}>1 hour</option>
              <option value={120}>2 hours</option>
              <option value={480}>8 hours</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-gray-300">Max Login Attempts</label>
              <p className="text-gray-400 text-sm">Block account after failed attempts</p>
            </div>
            <select
              value={securitySettings.maxLoginAttempts}
              onChange={(e) => updateSecuritySetting('maxLoginAttempts', parseInt(e.target.value))}
              className="bg-gray-700 text-white px-3 py-2 rounded border border-gray-600"
            >
              <option value={3}>3 attempts</option>
              <option value={5}>5 attempts</option>
              <option value={10}>10 attempts</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-gray-300">API Key Rotation</label>
              <p className="text-gray-400 text-sm">Automatically rotate API keys</p>
            </div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={securitySettings.apiKeyRotation}
                onChange={(e) => updateSecuritySetting('apiKeyRotation', e.target.checked)}
                className="rounded"
              />
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-gray-300">Audit Logging</label>
              <p className="text-gray-400 text-sm">Log all security events</p>
            </div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={securitySettings.auditLogging}
                onChange={(e) => updateSecuritySetting('auditLogging', e.target.checked)}
                className="rounded"
              />
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-gray-300">Threat Detection</label>
              <p className="text-gray-400 text-sm">Monitor for suspicious activity</p>
            </div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={securitySettings.threatDetection}
                onChange={(e) => updateSecuritySetting('threatDetection', e.target.checked)}
                className="rounded"
              />
            </label>
          </div>
        </div>
      </div>

      <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20">
        <h3 className="text-white font-semibold mb-4">API Security</h3>
        <div className="space-y-4">
          <p className="text-gray-300">
            Your API key is used to authenticate API requests. Keep it secure and rotate it regularly.
          </p>
          <button
            onClick={generateNewAPIKey}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded"
          >
            Generate New API Key
          </button>
        </div>
      </div>
    </div>
  );

  const AuditLogs = () => (
    <div className="space-y-6">
      <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20">
        <h3 className="text-white font-semibold mb-4">Security Audit Logs</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left text-gray-300 py-2">Event</th>
                <th className="text-left text-gray-300 py-2">Time</th>
                <th className="text-left text-gray-300 py-2">IP Address</th>
                <th className="text-left text-gray-300 py-2">Location</th>
                <th className="text-left text-gray-300 py-2">Status</th>
                <th className="text-left text-gray-300 py-2">Risk Level</th>
              </tr>
            </thead>
            <tbody>
              {securityEvents.map(event => (
                <tr key={event.id} className="border-b border-gray-800">
                  <td className="text-gray-300 py-2">{event.type}</td>
                  <td className="text-gray-400 py-2">
                    {new Date(event.timestamp).toLocaleString()}
                  </td>
                  <td className="text-gray-400 py-2">{event.ipAddress}</td>
                  <td className="text-gray-400 py-2">{event.location}</td>
                  <td className="py-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      event.status === 'success' ? 'bg-green-900 text-green-200' :
                      event.status === 'failed' ? 'bg-red-900 text-red-200' :
                      'bg-yellow-900 text-yellow-200'
                    }`}>
                      {event.status}
                    </span>
                  </td>
                  <td className="py-2">
                    <span className={`px-2 py-1 rounded text-xs ${getRiskLevelColor(event.riskLevel)}`}>
                      {event.riskLevel}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const ThreatMonitoring = () => (
    <div className="space-y-6">
      <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20">
        <h3 className="text-white font-semibold mb-4">Active Threats</h3>
        
        <div className="space-y-4">
          {securityThreats.filter(t => t.status === 'active').map(threat => (
            <div key={threat.id} className="p-4 rounded-lg border border-gray-700">
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-white font-medium">{threat.type}</h4>
                <span className={`px-2 py-1 rounded text-xs ${getThreatSeverityColor(threat.severity)}`}>
                  {threat.severity}
                </span>
              </div>
              <p className="text-gray-300 text-sm mb-2">{threat.description}</p>
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>Detected: {new Date(threat.timestamp).toLocaleString()}</span>
                <span>Affected Users: {threat.affectedUsers}</span>
              </div>
              <div className="mt-2 p-2 bg-gray-800 rounded">
                <p className="text-gray-300 text-xs">
                  <strong>Recommendation:</strong> {threat.recommendation}
                </p>
              </div>
            </div>
          ))}
          
          {securityThreats.filter(t => t.status === 'active').length === 0 && (
            <div className="text-center py-8">
              <div className="text-green-400 text-2xl mb-2">✅</div>
              <p className="text-gray-300">No active threats detected</p>
              <p className="text-gray-400 text-sm">Your account is currently secure</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Security Center</h1>
        <p className="text-gray-300">Manage your account security and monitor threats</p>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-2 mb-8">
        <div className="flex space-x-2">
          {[
            { id: 'overview', label: 'Overview', icon: '🛡️' },
            { id: 'mfa', label: 'MFA Setup', icon: '🔐' },
            { id: 'settings', label: 'Settings', icon: '⚙️' },
            { id: 'audit', label: 'Audit Logs', icon: '📋' },
            { id: 'threats', label: 'Threats', icon: '🚨' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-white hover:bg-opacity-10'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20">
        {activeTab === 'overview' && <SecurityOverview />}
        {activeTab === 'mfa' && <MFASetup />}
        {activeTab === 'settings' && <SecuritySettingsTab />}
        {activeTab === 'audit' && <AuditLogs />}
        {activeTab === 'threats' && <ThreatMonitoring />}
      </div>
    </div>
  );
} 