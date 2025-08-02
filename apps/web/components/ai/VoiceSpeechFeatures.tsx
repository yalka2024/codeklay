// Voice & Speech Features for CodePal
// Features: Voice-to-code conversion, speech-based navigation, voice commands, accessibility

import React, { useState, useEffect, useRef } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';

interface VoiceCommand {
  id: string;
  name: string;
  description: string;
  category: 'navigation' | 'coding' | 'editing' | 'search' | 'custom';
  trigger: string;
  action: string;
  isActive: boolean;
  usageCount: number;
  lastUsed?: string;
}

interface VoiceSession {
  id: string;
  startTime: string;
  endTime?: string;
  duration: number; // in seconds
  commandsExecuted: number;
  accuracy: number;
  language: string;
  transcript: VoiceTranscript[];
  errors: VoiceError[];
}

interface VoiceTranscript {
  id: string;
  text: string;
  confidence: number;
  timestamp: string;
  type: 'command' | 'dictation' | 'navigation';
  executed: boolean;
  result?: string;
}

interface VoiceError {
  id: string;
  type: 'recognition' | 'execution' | 'permission' | 'network';
  message: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

interface VoiceSettings {
  language: string;
  dialect?: string;
  speed: number; // 0.5 to 2.0
  pitch: number; // 0.5 to 2.0
  volume: number; // 0 to 1
  autoStart: boolean;
  continuousListening: boolean;
  noiseReduction: boolean;
  echoCancellation: boolean;
  hotwordDetection: boolean;
  customHotword?: string;
}

interface AccessibilityFeature {
  id: string;
  name: string;
  description: string;
  category: 'voice' | 'screen_reader' | 'keyboard' | 'visual' | 'cognitive';
  isEnabled: boolean;
  settings: Record<string, any>;
  usageStats: AccessibilityUsage;
}

interface AccessibilityUsage {
  totalUsage: number;
  lastUsed: string;
  userSatisfaction: number; // 1-5
  errorRate: number;
}

interface CodeGeneration {
  id: string;
  voiceInput: string;
  generatedCode: string;
  language: string;
  confidence: number;
  timestamp: string;
  corrections: CodeCorrection[];
  userFeedback: 'positive' | 'negative' | 'neutral';
}

interface CodeCorrection {
  id: string;
  originalText: string;
  correctedText: string;
  reason: string;
  timestamp: string;
}

export default function VoiceSpeechFeatures() {
  const { user } = useAuthContext();
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [voiceCommands, setVoiceCommands] = useState<VoiceCommand[]>([]);
  const [voiceSessions, setVoiceSessions] = useState<VoiceSession[]>([]);
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>({
    language: 'en-US',
    speed: 1.0,
    pitch: 1.0,
    volume: 0.8,
    autoStart: false,
    continuousListening: false,
    noiseReduction: true,
    echoCancellation: true,
    hotwordDetection: true,
    customHotword: 'CodePal'
  });
  const [accessibilityFeatures, setAccessibilityFeatures] = useState<AccessibilityFeature[]>([]);
  const [codeGenerations, setCodeGenerations] = useState<CodeGeneration[]>([]);
  const [activeSession, setActiveSession] = useState<VoiceSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'commands' | 'sessions' | 'settings' | 'accessibility' | 'codegen'>('overview');

  const recognitionRef = useRef<any>(null);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);

  // Initialize speech recognition and synthesis
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Initialize speech recognition
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = voiceSettings.continuousListening;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = voiceSettings.language;

        recognitionRef.current.onstart = () => {
          setIsListening(true);
          startNewSession();
        };

        recognitionRef.current.onresult = (event: any) => {
          let interimTranscript = '';
          let finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript += transcript;
            }
          }

          setCurrentTranscript(interimTranscript);
          
          if (finalTranscript) {
            processVoiceCommand(finalTranscript);
          }
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
          addVoiceError('recognition', event.error);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
          if (activeSession) {
            endSession(activeSession.id);
          }
        };
      }

      // Initialize speech synthesis
      synthesisRef.current = window.speechSynthesis;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [voiceSettings]);

  // Load voice data
  const loadVoiceData = async () => {
    setIsLoading(true);
    try {
      // Simulate API calls
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      const mockCommands: VoiceCommand[] = [
        {
          id: '1',
          name: 'Create Function',
          description: 'Create a new function with voice input',
          category: 'coding',
          trigger: 'create function',
          action: 'generate_function',
          isActive: true,
          usageCount: 45,
          lastUsed: '2024-01-15T10:30:00Z'
        },
        {
          id: '2',
          name: 'Navigate to File',
          description: 'Navigate to a specific file in the project',
          category: 'navigation',
          trigger: 'open file',
          action: 'navigate_to_file',
          isActive: true,
          usageCount: 23,
          lastUsed: '2024-01-15T09:15:00Z'
        },
        {
          id: '3',
          name: 'Search Code',
          description: 'Search for code patterns or functions',
          category: 'search',
          trigger: 'search for',
          action: 'code_search',
          isActive: true,
          usageCount: 67,
          lastUsed: '2024-01-15T11:00:00Z'
        },
        {
          id: '4',
          name: 'Run Tests',
          description: 'Execute test suite for current project',
          category: 'coding',
          trigger: 'run tests',
          action: 'execute_tests',
          isActive: true,
          usageCount: 12,
          lastUsed: '2024-01-15T08:45:00Z'
        }
      ];

      const mockSessions: VoiceSession[] = [
        {
          id: '1',
          startTime: '2024-01-15T10:00:00Z',
          endTime: '2024-01-15T10:30:00Z',
          duration: 1800,
          commandsExecuted: 15,
          accuracy: 92.5,
          language: 'en-US',
          transcript: [
            {
              id: 'transcript-1',
              text: 'create function calculate total',
              confidence: 0.95,
              timestamp: '2024-01-15T10:05:00Z',
              type: 'command',
              executed: true,
              result: 'Function created successfully'
            }
          ],
          errors: []
        }
      ];

      const mockAccessibility: AccessibilityFeature[] = [
        {
          id: '1',
          name: 'Voice Navigation',
          description: 'Navigate through the interface using voice commands',
          category: 'voice',
          isEnabled: true,
          settings: { sensitivity: 0.8, timeout: 5000 },
          usageStats: {
            totalUsage: 156,
            lastUsed: '2024-01-15T10:30:00Z',
            userSatisfaction: 4.5,
            errorRate: 0.05
          }
        },
        {
          id: '2',
          name: 'Screen Reader Integration',
          description: 'Enhanced screen reader support for accessibility',
          category: 'screen_reader',
          isEnabled: true,
          settings: { speed: 1.0, verbosity: 'medium' },
          usageStats: {
            totalUsage: 89,
            lastUsed: '2024-01-15T09:45:00Z',
            userSatisfaction: 4.8,
            errorRate: 0.02
          }
        }
      ];

      const mockCodeGen: CodeGeneration[] = [
        {
          id: '1',
          voiceInput: 'create a function that calculates the factorial of a number',
          generatedCode: `function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}`,
          language: 'javascript',
          confidence: 0.92,
          timestamp: '2024-01-15T10:30:00Z',
          corrections: [],
          userFeedback: 'positive'
        }
      ];

      setVoiceCommands(mockCommands);
      setVoiceSessions(mockSessions);
      setAccessibilityFeatures(mockAccessibility);
      setCodeGenerations(mockCodeGen);
    } catch (error) {
      console.error('Error loading voice data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Start voice recognition
  const startListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        addVoiceError('permission', 'Microphone access denied');
      }
    }
  };

  // Stop voice recognition
  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  // Speak text
  const speakText = (text: string) => {
    if (synthesisRef.current) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = voiceSettings.speed;
      utterance.pitch = voiceSettings.pitch;
      utterance.volume = voiceSettings.volume;
      utterance.lang = voiceSettings.language;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        setIsSpeaking(false);
      };

      synthesisRef.current.speak(utterance);
    }
  };

  // Process voice command
  const processVoiceCommand = (command: string) => {
    const matchedCommand = voiceCommands.find(cmd => 
      command.toLowerCase().includes(cmd.trigger.toLowerCase())
    );

    if (matchedCommand) {
      executeCommand(matchedCommand, command);
    } else {
      // Try to generate code from voice input
      generateCodeFromVoice(command);
    }
  };

  // Execute voice command
  const executeCommand = (command: VoiceCommand, input: string) => {
    // Update command usage
    setVoiceCommands(prev => prev.map(cmd => 
      cmd.id === command.id 
        ? { 
            ...cmd, 
            usageCount: cmd.usageCount + 1,
            lastUsed: new Date().toISOString()
          }
        : cmd
    ));

    // Add to transcript
    if (activeSession) {
      const transcript: VoiceTranscript = {
        id: `transcript-${Date.now()}`,
        text: input,
        confidence: 0.9,
        timestamp: new Date().toISOString(),
        type: 'command',
        executed: true,
        result: `Executed: ${command.action}`
      };

      setVoiceSessions(prev => prev.map(session => 
        session.id === activeSession.id
          ? {
              ...session,
              commandsExecuted: session.commandsExecuted + 1,
              transcript: [...session.transcript, transcript]
            }
          : session
      ));
    }

    // Provide feedback
    speakText(`Executed ${command.name}`);
  };

  // Generate code from voice input
  const generateCodeFromVoice = async (input: string) => {
    try {
      setIsLoading(true);
      // Simulate AI code generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const generatedCode = `// Generated from voice input: "${input}"
function processVoiceInput(input) {
  // TODO: Implement based on voice input
  console.log("Processing:", input);
  return input.toLowerCase();
}`;

      const newCodeGen: CodeGeneration = {
        id: `codegen-${Date.now()}`,
        voiceInput: input,
        generatedCode,
        language: 'javascript',
        confidence: 0.85,
        timestamp: new Date().toISOString(),
        corrections: [],
        userFeedback: 'neutral'
      };

      setCodeGenerations(prev => [newCodeGen, ...prev]);
      speakText('Code generated from your voice input');
    } catch (error) {
      console.error('Error generating code:', error);
      speakText('Sorry, I could not generate code from your input');
    } finally {
      setIsLoading(false);
    }
  };

  // Start new voice session
  const startNewSession = () => {
    const newSession: VoiceSession = {
      id: `session-${Date.now()}`,
      startTime: new Date().toISOString(),
      duration: 0,
      commandsExecuted: 0,
      accuracy: 0,
      language: voiceSettings.language,
      transcript: [],
      errors: []
    };

    setActiveSession(newSession);
    setVoiceSessions(prev => [newSession, ...prev]);
  };

  // End voice session
  const endSession = (sessionId: string) => {
    setVoiceSessions(prev => prev.map(session => 
      session.id === sessionId
        ? {
            ...session,
            endTime: new Date().toISOString(),
            duration: Math.floor((new Date().getTime() - new Date(session.startTime).getTime()) / 1000)
          }
        : session
    ));
    setActiveSession(null);
  };

  // Add voice error
  const addVoiceError = (type: string, message: string) => {
    const error: VoiceError = {
      id: `error-${Date.now()}`,
      type: type as any,
      message,
      timestamp: new Date().toISOString(),
      severity: 'medium'
    };

    if (activeSession) {
      setVoiceSessions(prev => prev.map(session => 
        session.id === activeSession.id
          ? {
              ...session,
              errors: [...session.errors, error]
            }
          : session
      ));
    }
  };

  // Toggle accessibility feature
  const toggleAccessibilityFeature = (featureId: string) => {
    setAccessibilityFeatures(prev => prev.map(feature => 
      feature.id === featureId
        ? { ...feature, isEnabled: !feature.isEnabled }
        : feature
    ));
  };

  useEffect(() => {
    loadVoiceData();
  }, []);

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Voice Control Panel */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Voice Control</h3>
          <div className="flex items-center space-x-2">
            <span className={`w-3 h-3 rounded-full ${isListening ? 'bg-red-500 animate-pulse' : 'bg-gray-300'}`}></span>
            <span className="text-sm text-gray-500">
              {isListening ? 'Listening...' : 'Ready'}
            </span>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Current Input:</p>
          <div className="bg-gray-50 rounded p-3 min-h-[60px]">
            {currentTranscript || 'Say something...'}
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={isListening ? stopListening : startListening}
            className={`flex-1 px-4 py-2 rounded-lg font-medium ${
              isListening
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isListening ? 'Stop Listening' : 'Start Listening'}
          </button>
          <button
            onClick={() => speakText('Hello, I am CodePal voice assistant')}
            disabled={isSpeaking}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            Test Speech
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Voice Commands</h3>
          <p className="text-2xl font-bold text-blue-600">{voiceCommands.filter(c => c.isActive).length}</p>
          <p className="text-xs text-gray-400">Active commands</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Sessions</h3>
          <p className="text-2xl font-bold text-green-600">{voiceSessions.length}</p>
          <p className="text-xs text-gray-400">Voice sessions</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Commands Executed</h3>
          <p className="text-2xl font-bold text-purple-600">
            {voiceSessions.reduce((acc, session) => acc + session.commandsExecuted, 0)}
          </p>
          <p className="text-xs text-gray-400">This month</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Accuracy</h3>
          <p className="text-2xl font-bold text-orange-600">
            {voiceSessions.length > 0 
              ? (voiceSessions.reduce((acc, session) => acc + session.accuracy, 0) / voiceSessions.length).toFixed(1)
              : 0}%
          </p>
          <p className="text-xs text-gray-400">Average accuracy</p>
        </div>
      </div>

      {/* Recent Commands */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Voice Commands</h3>
        </div>
        <div className="p-6">
          {voiceCommands
            .filter(cmd => cmd.lastUsed)
            .sort((a, b) => new Date(b.lastUsed!).getTime() - new Date(a.lastUsed!).getTime())
            .slice(0, 5)
            .map(command => (
              <div key={command.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                <div>
                  <h4 className="font-medium text-gray-900">{command.name}</h4>
                  <p className="text-sm text-gray-500">"{command.trigger}"</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-900">{command.usageCount} uses</p>
                  <p className="text-xs text-gray-500">
                    {new Date(command.lastUsed!).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );

  const renderCommands = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Voice Commands</h2>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Add Command
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {voiceCommands.map(command => (
          <div key={command.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{command.name}</h3>
                <p className="text-sm text-gray-500">{command.description}</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                command.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {command.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>

            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Trigger Phrase</p>
              <p className="text-lg font-mono text-blue-600">"{command.trigger}"</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Usage Count</p>
                <p className="text-lg font-semibold text-gray-900">{command.usageCount}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Category</p>
                <p className="text-sm font-medium text-gray-900">{command.category.replace('_', ' ')}</p>
              </div>
            </div>

            <div className="flex space-x-2">
              <button className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                Test
              </button>
              <button className="flex-1 px-3 py-2 text-sm bg-gray-600 text-white rounded hover:bg-gray-700">
                {command.isActive ? 'Disable' : 'Enable'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSessions = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Voice Sessions</h2>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          {voiceSessions.map(session => (
            <div key={session.id} className="border-b border-gray-200 last:border-b-0 pb-6 last:pb-0 mb-6 last:mb-0">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Session {new Date(session.startTime).toLocaleDateString()}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {new Date(session.startTime).toLocaleTimeString()} - {session.endTime ? new Date(session.endTime).toLocaleTimeString() : 'Active'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">{Math.floor(session.duration / 60)}m {session.duration % 60}s</p>
                  <p className="text-sm text-gray-500">{session.commandsExecuted} commands</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Accuracy</p>
                  <p className="text-lg font-semibold text-gray-900">{session.accuracy}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Language</p>
                  <p className="text-sm font-medium text-gray-900">{session.language}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Errors</p>
                  <p className="text-sm font-medium text-gray-900">{session.errors.length}</p>
                </div>
              </div>

              {session.transcript.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Transcript</p>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {session.transcript.slice(0, 3).map(transcript => (
                      <div key={transcript.id} className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">"{transcript.text}"</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          transcript.executed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {transcript.executed ? 'Executed' : 'Failed'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Voice Settings</h2>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Speech Recognition</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                <select
                  value={voiceSettings.language}
                  onChange={(e) => setVoiceSettings(prev => ({ ...prev, language: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="en-US">English (US)</option>
                  <option value="en-GB">English (UK)</option>
                  <option value="es-ES">Spanish</option>
                  <option value="fr-FR">French</option>
                  <option value="de-DE">German</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Continuous Listening</label>
                <input
                  type="checkbox"
                  checked={voiceSettings.continuousListening}
                  onChange={(e) => setVoiceSettings(prev => ({ ...prev, continuousListening: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hotword Detection</label>
                <input
                  type="checkbox"
                  checked={voiceSettings.hotwordDetection}
                  onChange={(e) => setVoiceSettings(prev => ({ ...prev, hotwordDetection: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Speech Synthesis</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Speed</label>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={voiceSettings.speed}
                  onChange={(e) => setVoiceSettings(prev => ({ ...prev, speed: parseFloat(e.target.value) }))}
                  className="w-full"
                />
                <p className="text-sm text-gray-500">{voiceSettings.speed}x</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pitch</label>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={voiceSettings.pitch}
                  onChange={(e) => setVoiceSettings(prev => ({ ...prev, pitch: parseFloat(e.target.value) }))}
                  className="w-full"
                />
                <p className="text-sm text-gray-500">{voiceSettings.pitch}x</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Volume</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={voiceSettings.volume}
                  onChange={(e) => setVoiceSettings(prev => ({ ...prev, volume: parseFloat(e.target.value) }))}
                  className="w-full"
                />
                <p className="text-sm text-gray-500">{Math.round(voiceSettings.volume * 100)}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAccessibility = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Accessibility Features</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {accessibilityFeatures.map(feature => (
          <div key={feature.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{feature.name}</h3>
                <p className="text-sm text-gray-500">{feature.description}</p>
              </div>
              <button
                onClick={() => toggleAccessibilityFeature(feature.id)}
                className={`px-3 py-1 text-sm rounded-full ${
                  feature.isEnabled
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {feature.isEnabled ? 'Enabled' : 'Disabled'}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Total Usage</p>
                <p className="text-lg font-semibold text-gray-900">{feature.usageStats.totalUsage}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Satisfaction</p>
                <p className="text-lg font-semibold text-gray-900">{feature.usageStats.userSatisfaction}/5</p>
              </div>
            </div>

            <div className="flex space-x-2">
              <button className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                Configure
              </button>
              <button className="flex-1 px-3 py-2 text-sm bg-gray-600 text-white rounded hover:bg-gray-700">
                Test
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCodeGen = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Voice-to-Code Generation</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {codeGenerations.map(codeGen => (
          <div key={codeGen.id} className="bg-white rounded-lg shadow p-6">
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Voice Input</h3>
              <p className="text-sm text-gray-600 italic">"{codeGen.voiceInput}"</p>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Generated Code</h4>
              <pre className="bg-gray-50 rounded p-3 text-sm overflow-x-auto">
                <code>{codeGen.generatedCode}</code>
              </pre>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Language</p>
                <p className="text-sm font-medium text-gray-900">{codeGen.language}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Confidence</p>
                <p className="text-sm font-medium text-gray-900">{(codeGen.confidence * 100).toFixed(1)}%</p>
              </div>
            </div>

            <div className="flex space-x-2">
              <button className="flex-1 px-3 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700">
                Use Code
              </button>
              <button className="flex-1 px-3 py-2 text-sm bg-gray-600 text-white rounded hover:bg-gray-700">
                Regenerate
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Voice & Speech Features</h1>
          <p className="text-gray-600 mt-2">
            Voice-to-code conversion, speech-based navigation, and accessibility features
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'commands', label: 'Commands' },
              { id: 'sessions', label: 'Sessions' },
              { id: 'settings', label: 'Settings' },
              { id: 'accessibility', label: 'Accessibility' },
              { id: 'codegen', label: 'Code Generation' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Content */}
        {!isLoading && (
          <div>
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'commands' && renderCommands()}
            {activeTab === 'sessions' && renderSessions()}
            {activeTab === 'settings' && renderSettings()}
            {activeTab === 'accessibility' && renderAccessibility()}
            {activeTab === 'codegen' && renderCodeGen()}
          </div>
        )}
      </div>
    </div>
  );
} 