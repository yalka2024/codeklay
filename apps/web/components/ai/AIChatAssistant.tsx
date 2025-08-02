// AI Chat Assistant for CodePal
// Features: Context-aware code help, natural language queries, intelligent troubleshooting

import React, { useState, useEffect, useRef } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant' | 'system' | 'error';
  content: string;
  timestamp: string;
  context?: ChatContext;
  attachments?: ChatAttachment[];
  codeBlocks?: CodeBlock[];
  suggestions?: ChatSuggestion[];
  confidence?: number;
  metadata?: {
    language?: string;
    framework?: string;
    topic?: string;
    difficulty?: string;
    relatedTopics?: string[];
  };
}

interface ChatContext {
  currentFile?: string;
  language?: string;
  framework?: string;
  cursorPosition?: number;
  surroundingCode?: string;
  errorMessage?: string;
  userIntent?: string;
  conversationHistory?: string[];
}

interface ChatAttachment {
  id: string;
  type: 'file' | 'image' | 'link' | 'snippet';
  name: string;
  url?: string;
  content?: string;
  size?: number;
  mimeType?: string;
}

interface CodeBlock {
  id: string;
  language: string;
  code: string;
  explanation?: string;
  isExecutable: boolean;
  output?: string;
  error?: string;
  suggestions?: string[];
}

interface ChatSuggestion {
  id: string;
  text: string;
  type: 'question' | 'action' | 'resource' | 'followup';
  confidence: number;
  category: string;
  action?: () => void;
}

interface ChatSession {
  id: string;
  title: string;
  topic: string;
  createdAt: string;
  lastActivity: string;
  messageCount: number;
  isActive: boolean;
  tags: string[];
  summary?: string;
}

interface AIAssistant {
  id: string;
  name: string;
  specialization: string;
  personality: 'helpful' | 'technical' | 'educational' | 'debugging';
  availability: boolean;
  expertise: string[];
  rating: number;
  responseTime: number; // in seconds
  contextAware: boolean;
}

interface ChatAnalytics {
  totalMessages: number;
  averageResponseTime: number;
  userSatisfaction: number;
  mostCommonTopics: string[];
  resolutionRate: number;
  learningProgress: number;
  timeSaved: number; // in minutes
}

export default function AIChatAssistant() {
  const { user } = useAuthContext();
  const [activeTab, setActiveTab] = useState('chat');
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedAssistant, setSelectedAssistant] = useState<AIAssistant | null>(null);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [aiAssistants, setAiAssistants] = useState<AIAssistant[]>([]);
  const [chatAnalytics, setChatAnalytics] = useState<ChatAnalytics | null>(null);
  const [currentContext, setCurrentContext] = useState<ChatContext | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load chat data
  useEffect(() => {
    loadChatData();
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadChatData = async () => {
    try {
      // Load chat sessions
      const sessionsResponse = await fetch('/api/ai/chat/sessions');
      if (sessionsResponse.ok) {
        const sessionsData = await sessionsResponse.json();
        setChatSessions(sessionsData);
      }

      // Load AI assistants
      const assistantsResponse = await fetch('/api/ai/chat/assistants');
      if (assistantsResponse.ok) {
        const assistantsData = await assistantsResponse.json();
        setAiAssistants(assistantsData);
      }

      // Load chat analytics
      const analyticsResponse = await fetch('/api/ai/chat/analytics');
      if (analyticsResponse.ok) {
        const analyticsData = await analyticsResponse.json();
        setChatAnalytics(analyticsData);
      }
    } catch (error) {
      console.error('Failed to load chat data:', error);
    }
  };

  // Send message
  const sendMessage = async (content: string, context?: ChatContext) => {
    if (!content.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date().toISOString(),
      context
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/ai/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          sessionId: currentSession?.id,
          assistantId: selectedAssistant?.id,
          context: context || currentContext,
          userId: user?.id
        })
      });

      if (response.ok) {
        const assistantMessage = await response.json();
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        const errorMessage: ChatMessage = {
          id: Date.now().toString(),
          type: 'error',
          content: 'Sorry, I encountered an error. Please try again.',
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'error',
        content: 'Network error. Please check your connection.',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  // Create new chat session
  const createNewSession = async (topic: string) => {
    try {
      const response = await fetch('/api/ai/chat/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: topic,
          topic,
          userId: user?.id
        })
      });

      if (response.ok) {
        const newSession = await response.json();
        setChatSessions(prev => [newSession, ...prev]);
        setCurrentSession(newSession);
        setMessages([]);
        setActiveTab('chat');
      }
    } catch (error) {
      console.error('Failed to create session:', error);
    }
  };

  // Load session messages
  const loadSession = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/ai/chat/sessions/${sessionId}/messages`);
      if (response.ok) {
        const sessionData = await response.json();
        setCurrentSession(sessionData.session);
        setMessages(sessionData.messages);
        setActiveTab('chat');
      }
    } catch (error) {
      console.error('Failed to load session:', error);
    }
  };

  // Handle file upload
  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('sessionId', currentSession?.id || '');

    try {
      const response = await fetch('/api/ai/chat/upload', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const attachment = await response.json();
        const message: ChatMessage = {
          id: Date.now().toString(),
          type: 'user',
          content: `Uploaded file: ${file.name}`,
          timestamp: new Date().toISOString(),
          attachments: [attachment]
        };
        setMessages(prev => [...prev, message]);
      }
    } catch (error) {
      console.error('Failed to upload file:', error);
    }
  };

  // Execute code block
  const executeCode = async (codeBlock: CodeBlock) => {
    try {
      const response = await fetch('/api/ai/chat/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: codeBlock.code,
          language: codeBlock.language,
          sessionId: currentSession?.id
        })
      });

      if (response.ok) {
        const result = await response.json();
        // Update the code block with output
        setMessages(prev => prev.map(msg => ({
          ...msg,
          codeBlocks: msg.codeBlocks?.map(block =>
            block.id === codeBlock.id ? { ...block, output: result.output, error: result.error } : block
          )
        })));
      }
    } catch (error) {
      console.error('Failed to execute code:', error);
    }
  };

  // Voice recognition
  const startVoiceRecognition = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
    }
  };

  const ChatInterface = () => (
    <div className="flex flex-col h-[600px]">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-white border-opacity-20">
        <div>
          <h3 className="text-white font-semibold">
            {currentSession ? currentSession.title : 'New Chat'}
          </h3>
          {selectedAssistant && (
            <p className="text-gray-400 text-sm">{selectedAssistant.name} • {selectedAssistant.specialization}</p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            className={`p-2 rounded ${voiceEnabled ? 'bg-blue-600' : 'bg-gray-600'}`}
          >
            🎤
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 bg-gray-600 rounded"
          >
            📎
          </button>
          <input
            ref={fileInputRef}
            type="file"
            onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
            className="hidden"
            accept=".js,.ts,.jsx,.tsx,.py,.java,.cpp,.c,.cs,.php,.rb,.go,.rs,.swift,.kt,.md,.txt"
          />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🤖</div>
            <h4 className="text-white font-semibold mb-2">AI Chat Assistant</h4>
            <p className="text-gray-400 mb-4">Ask me anything about coding, debugging, or learning!</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                "How do I implement authentication in React?",
                "What's the difference between let, const, and var?",
                "Help me debug this JavaScript error",
                "Explain async/await in JavaScript"
              ].map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => sendMessage(suggestion)}
                  className="p-3 text-left bg-white bg-opacity-5 rounded-lg hover:bg-white hover:bg-opacity-10 border border-transparent hover:border-blue-400"
                >
                  <span className="text-gray-300 text-sm">{suggestion}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map(message => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-4 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : message.type === 'error'
                    ? 'bg-red-900 text-red-200'
                    : 'bg-white bg-opacity-10 text-gray-300'
                }`}
              >
                <div className="mb-2">
                  <span className="text-sm opacity-75">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                  {message.confidence && (
                    <span className="ml-2 text-xs bg-white bg-opacity-20 px-2 py-1 rounded">
                      {message.confidence}% confidence
                    </span>
                  )}
                </div>

                <div className="space-y-3">
                  <p className="whitespace-pre-wrap">{message.content}</p>

                  {/* Code Blocks */}
                  {message.codeBlocks && message.codeBlocks.map(block => (
                    <div key={block.id} className="bg-gray-800 rounded p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-400 text-sm">{block.language}</span>
                        {block.isExecutable && (
                          <button
                            onClick={() => executeCode(block)}
                            className="px-2 py-1 bg-green-600 hover:bg-green-700 rounded text-xs"
                          >
                            Run
                          </button>
                        )}
                      </div>
                      <pre className="text-gray-300 text-sm overflow-x-auto">
                        <code>{block.code}</code>
                      </pre>
                      {block.explanation && (
                        <p className="text-gray-400 text-sm mt-2">{block.explanation}</p>
                      )}
                      {block.output && (
                        <div className="mt-2 p-2 bg-green-900 bg-opacity-30 rounded">
                          <strong>Output:</strong>
                          <pre className="text-green-300 text-sm">{block.output}</pre>
                        </div>
                      )}
                      {block.error && (
                        <div className="mt-2 p-2 bg-red-900 bg-opacity-30 rounded">
                          <strong>Error:</strong>
                          <pre className="text-red-300 text-sm">{block.error}</pre>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Suggestions */}
                  {message.suggestions && (
                    <div className="flex flex-wrap gap-2">
                      {message.suggestions.map(suggestion => (
                        <button
                          key={suggestion.id}
                          onClick={() => suggestion.action?.() || sendMessage(suggestion.text)}
                          className="px-3 py-1 bg-white bg-opacity-10 hover:bg-white hover:bg-opacity-20 rounded text-sm border border-transparent hover:border-blue-400"
                        >
                          {suggestion.text}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white bg-opacity-10 text-gray-300 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-sm">AI is typing...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-white border-opacity-20">
        <div className="flex items-end space-x-2">
          {voiceEnabled && (
            <button
              onClick={startVoiceRecognition}
              disabled={isRecording}
              className={`p-3 rounded ${isRecording ? 'bg-red-600' : 'bg-gray-600'}`}
            >
              {isRecording ? '🔴' : '🎤'}
            </button>
          )}
          <div className="flex-1">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(inputMessage);
                }
              }}
              placeholder="Ask me anything about coding..."
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white resize-none"
              rows={1}
              style={{ minHeight: '44px', maxHeight: '120px' }}
            />
          </div>
          <button
            onClick={() => sendMessage(inputMessage)}
            disabled={!inputMessage.trim() || isTyping}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );

  const ChatSessions = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-semibold">Chat Sessions</h3>
        <button
          onClick={() => createNewSession('New Conversation')}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
        >
          New Chat
        </button>
      </div>

      <div className="space-y-3">
        {chatSessions.map(session => (
          <div
            key={session.id}
            className={`p-4 rounded-lg border cursor-pointer transition-all ${
              currentSession?.id === session.id
                ? 'bg-blue-600 border-blue-400'
                : 'bg-white bg-opacity-5 border-white border-opacity-10 hover:bg-white hover:bg-opacity-10'
            }`}
            onClick={() => loadSession(session.id)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="text-white font-medium">{session.title}</h4>
                <p className="text-gray-400 text-sm">{session.topic}</p>
                <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                  <span>{session.messageCount} messages</span>
                  <span>{new Date(session.lastActivity).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="text-right">
                {session.isActive && (
                  <span className="px-2 py-1 bg-green-900 text-green-200 text-xs rounded">
                    Active
                  </span>
                )}
              </div>
            </div>
            {session.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {session.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const AIAssistants = () => (
    <div className="space-y-6">
      <h3 className="text-white font-semibold">AI Assistants</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {aiAssistants.map(assistant => (
          <div
            key={assistant.id}
            className={`p-6 rounded-xl border cursor-pointer transition-all ${
              selectedAssistant?.id === assistant.id
                ? 'bg-blue-600 border-blue-400'
                : 'bg-white bg-opacity-10 border-white border-opacity-20 hover:bg-white hover:bg-opacity-15'
            }`}
            onClick={() => setSelectedAssistant(assistant)}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-white font-semibold">{assistant.name}</h4>
                <p className="text-gray-400 text-sm">{assistant.specialization}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-1">
                  <span className="text-yellow-400">⭐</span>
                  <span className="text-gray-300">{assistant.rating}</span>
                </div>
                <div className="text-gray-500 text-xs">{assistant.responseTime}s avg</div>
              </div>
            </div>

            <div className="mb-4">
              <span className={`px-2 py-1 rounded text-xs ${
                assistant.personality === 'helpful' ? 'bg-green-900 text-green-200' :
                assistant.personality === 'technical' ? 'bg-blue-900 text-blue-200' :
                assistant.personality === 'educational' ? 'bg-purple-900 text-purple-200' :
                'bg-orange-900 text-orange-200'
              }`}>
                {assistant.personality}
              </span>
              {assistant.contextAware && (
                <span className="ml-2 px-2 py-1 bg-purple-900 text-purple-200 text-xs rounded">
                  Context Aware
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-1 mb-4">
              {assistant.expertise.slice(0, 3).map(skill => (
                <span key={skill} className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">
                  {skill}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className={`px-2 py-1 rounded text-xs ${
                assistant.availability ? 'bg-green-900 text-green-200' : 'bg-gray-900 text-gray-200'
              }`}>
                {assistant.availability ? 'Available' : 'Busy'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const ChatAnalytics = () => (
    <div className="space-y-6">
      <h3 className="text-white font-semibold">Chat Analytics</h3>

      {chatAnalytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20">
            <h4 className="text-white font-semibold mb-2">Total Messages</h4>
            <div className="text-3xl font-bold text-blue-400">{chatAnalytics.totalMessages}</div>
            <p className="text-gray-400 text-sm">Conversations</p>
          </div>

          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20">
            <h4 className="text-white font-semibold mb-2">Response Time</h4>
            <div className="text-3xl font-bold text-green-400">{chatAnalytics.averageResponseTime}s</div>
            <p className="text-gray-400 text-sm">Average</p>
          </div>

          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20">
            <h4 className="text-white font-semibold mb-2">Satisfaction</h4>
            <div className="text-3xl font-bold text-purple-400">{chatAnalytics.userSatisfaction}%</div>
            <p className="text-gray-400 text-sm">User rating</p>
          </div>

          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20">
            <h4 className="text-white font-semibold mb-2">Time Saved</h4>
            <div className="text-3xl font-bold text-orange-400">{chatAnalytics.timeSaved}m</div>
            <p className="text-gray-400 text-sm">Development time</p>
          </div>
        </div>
      )}

      {/* Most Common Topics */}
      {chatAnalytics && (
        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20">
          <h4 className="text-white font-semibold mb-4">Most Common Topics</h4>
          <div className="space-y-3">
            {chatAnalytics.mostCommonTopics.map((topic, index) => (
              <div key={topic} className="flex items-center justify-between">
                <span className="text-gray-300">{topic}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${100 - (index * 15)}%` }}
                    ></div>
                  </div>
                  <span className="text-gray-400 text-sm">{100 - (index * 15)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">AI Chat Assistant</h1>
        <p className="text-gray-300">Context-aware code help, natural language queries, and intelligent troubleshooting</p>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-2 mb-8">
        <div className="flex space-x-2">
          {[
            { id: 'chat', label: 'Chat', icon: '💬' },
            { id: 'sessions', label: 'Sessions', icon: '📋' },
            { id: 'assistants', label: 'Assistants', icon: '🤖' },
            { id: 'analytics', label: 'Analytics', icon: '📊' }
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
        {activeTab === 'chat' && <ChatInterface />}
        {activeTab === 'sessions' && <ChatSessions />}
        {activeTab === 'assistants' && <AIAssistants />}
        {activeTab === 'analytics' && <ChatAnalytics />}
      </div>
    </div>
  );
} 