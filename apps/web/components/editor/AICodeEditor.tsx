// AI-Powered Code Editor for CodePal
// Features: Monaco Editor, AI assistance, real-time collaboration, code analysis

import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as monaco from 'monaco-editor';
import { useCollaboration } from '../../contexts/CollaborationContext';
import { useAuthContext } from '../../contexts/AuthContext';

interface AICodeEditorProps {
  filePath: string;
  projectId: string;
  initialValue?: string;
  language?: string;
  theme?: 'vs-dark' | 'vs-light' | 'hc-black';
  readOnly?: boolean;
  onSave?: (content: string) => void;
  onError?: (error: string) => void;
}

interface AICompletion {
  label: string;
  kind: monaco.languages.CompletionItemKind;
  insertText: string;
  documentation?: string;
  detail?: string;
}

interface CodeAnalysis {
  type: 'error' | 'warning' | 'info' | 'suggestion';
  message: string;
  line: number;
  column: number;
  endLine?: number;
  endColumn?: number;
  code?: string;
  severity: monaco.MarkerSeverity;
}

export default function AICodeEditor({
  filePath,
  projectId,
  initialValue = '',
  language = 'typescript',
  theme = 'vs-dark',
  readOnly = false,
  onSave,
  onError
}: AICodeEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const monacoEditorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const { user } = useAuthContext();
  const { isConnected, sendCodeUpdate, users } = useCollaboration();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<CodeAnalysis[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<AICompletion[]>([]);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');

  // Initialize Monaco Editor
  useEffect(() => {
    if (!editorRef.current) return;

    // Configure Monaco Editor
    monaco.editor.defineTheme('codepal-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6A9955' },
        { token: 'keyword', foreground: 'C586C0' },
        { token: 'string', foreground: 'CE9178' },
        { token: 'number', foreground: 'B5CEA8' },
        { token: 'function', foreground: 'DCDCAA' },
        { token: 'class', foreground: '4EC9B0' },
      ],
      colors: {
        'editor.background': '#1E1E1E',
        'editor.foreground': '#D4D4D4',
        'editor.lineHighlightBackground': '#2A2A2A',
        'editor.selectionBackground': '#264F78',
        'editor.inactiveSelectionBackground': '#3A3D41',
      }
    });

    // Create editor instance
    const editor = monaco.editor.create(editorRef.current, {
      value: initialValue,
      language: language,
      theme: 'codepal-dark',
      automaticLayout: true,
      minimap: { enabled: true },
      scrollBeyondLastLine: false,
      fontSize: 14,
      fontFamily: 'JetBrains Mono, Consolas, monospace',
      lineNumbers: 'on',
      roundedSelection: false,
      readOnly: readOnly,
      cursorStyle: 'line',
      wordWrap: 'on',
      folding: true,
      foldingStrategy: 'indentation',
      showFoldingControls: 'always',
      selectOnLineNumbers: true,
      contextmenu: true,
      mouseWheelZoom: true,
      quickSuggestions: {
        other: true,
        comments: true,
        strings: true
      },
      suggestOnTriggerCharacters: true,
      acceptSuggestionOnEnter: 'on',
      tabCompletion: 'on',
      wordBasedSuggestions: true,
      parameterHints: {
        enabled: true
      },
      autoIndent: 'full',
      formatOnPaste: true,
      formatOnType: true,
      dragAndDrop: true,
      links: true,
      colorDecorators: true,
      lightbulb: {
        enabled: true
      },
      codeActionsOnSave: {
        'source.fixAll': true,
        'source.organizeImports': true
      }
    });

    monacoEditorRef.current = editor;
    setIsLoading(false);

    // Set up AI completion provider
    const aiCompletionProvider = monaco.languages.registerCompletionItemProvider(language, {
      provideCompletionItems: async (model, position) => {
        const suggestions = await getAICompletions(model, position);
        return { suggestions };
      }
    });

    // Set up AI code action provider
    const aiCodeActionProvider = monaco.languages.registerCodeActionProvider(language, {
      provideCodeActions: async (model, range, context) => {
        const actions = await getAICodeActions(model, range, context);
        return { actions };
      }
    });

    // Set up hover provider for AI insights
    const aiHoverProvider = monaco.languages.registerHoverProvider(language, {
      provideHover: async (model, position) => {
        const hover = await getAIHover(model, position);
        return hover;
      }
    });

    // Set up real-time collaboration
    if (isConnected) {
      editor.onDidChangeModelContent((event) => {
        const content = editor.getValue();
        sendCodeUpdate({
          projectId,
          filePath,
          content,
          operation: 'replace'
        });
      });

      // Handle cursor position updates
      editor.onDidChangeCursorPosition((event) => {
        sendCursorUpdate({
          line: event.position.lineNumber,
          column: event.position.column,
          x: event.position.column * 8, // Approximate pixel position
          y: event.position.lineNumber * 20
        });
      });
    }

    // Handle save
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      const content = editor.getValue();
      onSave?.(content);
    });

    // Cleanup
    return () => {
      aiCompletionProvider.dispose();
      aiCodeActionProvider.dispose();
      aiHoverProvider.dispose();
      editor.dispose();
    };
  }, [filePath, projectId, language, theme, readOnly, isConnected]);

  // AI Completion Provider
  const getAICompletions = async (
    model: monaco.editor.ITextModel,
    position: monaco.Position
  ): Promise<monaco.languages.CompletionItem[]> => {
    try {
      const textUntilPosition = model.getValueInRange({
        startLineNumber: 1,
        startColumn: 1,
        endLineNumber: position.lineNumber,
        endColumn: position.column
      });

      // Call AI service for completions
      const response = await fetch('/api/ai/code-completion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: textUntilPosition,
          language,
          position: { line: position.lineNumber, column: position.column }
        })
      });

      if (response.ok) {
        const completions: AICompletion[] = await response.json();
        return completions.map(comp => ({
          label: comp.label,
          kind: comp.kind,
          insertText: comp.insertText,
          documentation: comp.documentation,
          detail: comp.detail,
          range: {
            startLineNumber: position.lineNumber,
            startColumn: position.column,
            endLineNumber: position.lineNumber,
            endColumn: position.column
          }
        }));
      }
    } catch (error) {
      console.error('Failed to get AI completions:', error);
    }

    return [];
  };

  // AI Code Actions Provider
  const getAICodeActions = async (
    model: monaco.editor.ITextModel,
    range: monaco.Range,
    context: monaco.languages.CodeActionContext
  ): Promise<monaco.languages.CodeAction[]> => {
    const actions: monaco.languages.CodeAction[] = [];

    try {
      const selectedText = model.getValueInRange(range);
      
      // Add AI-powered refactoring actions
      actions.push({
        title: '🤖 AI: Optimize this code',
        kind: 'refactor',
        edit: {
          edits: [{
            resource: model.uri,
            edit: {
              range: range,
              text: await getAIOptimization(selectedText, language)
            }
          }]
        }
      });

      actions.push({
        title: '🔒 AI: Security review',
        kind: 'quickfix',
        edit: {
          edits: [{
            resource: model.uri,
            edit: {
              range: range,
              text: await getAISecurityFix(selectedText, language)
            }
          }]
        }
      });

      actions.push({
        title: '📝 AI: Add documentation',
        kind: 'refactor',
        edit: {
          edits: [{
            resource: model.uri,
            edit: {
              range: range,
              text: await getAIDocumentation(selectedText, language)
            }
          }]
        }
      });
    } catch (error) {
      console.error('Failed to get AI code actions:', error);
    }

    return actions;
  };

  // AI Hover Provider
  const getAIHover = async (
    model: monaco.editor.ITextModel,
    position: monaco.Position
  ): Promise<monaco.languages.Hover | null> => {
    try {
      const word = model.getWordAtPosition(position);
      if (!word) return null;

      const response = await fetch('/api/ai/code-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: model.getValue(),
          word: word.word,
          position: { line: position.lineNumber, column: position.column },
          language
        })
      });

      if (response.ok) {
        const insight = await response.json();
        return {
          contents: [
            { value: `**${word.word}**` },
            { value: insight.description },
            { value: insight.suggestions }
          ]
        };
      }
    } catch (error) {
      console.error('Failed to get AI hover:', error);
    }

    return null;
  };

  // AI Service Functions
  const getAIOptimization = async (code: string, lang: string): Promise<string> => {
    const response = await fetch('/api/ai/optimize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, language: lang })
    });
    const result = await response.json();
    return result.optimizedCode || code;
  };

  const getAISecurityFix = async (code: string, lang: string): Promise<string> => {
    const response = await fetch('/api/ai/security-fix', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, language: lang })
    });
    const result = await response.json();
    return result.fixedCode || code;
  };

  const getAIDocumentation = async (code: string, lang: string): Promise<string> => {
    const response = await fetch('/api/ai/documentation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, language: lang })
    });
    const result = await response.json();
    return result.documentedCode || code;
  };

  // Code Analysis
  const analyzeCode = useCallback(async () => {
    if (!monacoEditorRef.current) return;

    setIsAnalyzing(true);
    try {
      const code = monacoEditorRef.current.getValue();
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language })
      });

      if (response.ok) {
        const analysis: CodeAnalysis[] = await response.json();
        setAnalysisResults(analysis);

        // Add markers to editor
        const markers: monaco.editor.IMarkerData[] = analysis.map(item => ({
          message: item.message,
          severity: item.severity,
          startLineNumber: item.line,
          startColumn: item.column,
          endLineNumber: item.endLine || item.line,
          endColumn: item.endColumn || item.column
        }));

        monaco.editor.setModelMarkers(monacoEditorRef.current!.getModel()!, 'ai-analysis', markers);
      }
    } catch (error) {
      console.error('Failed to analyze code:', error);
      onError?.('Failed to analyze code');
    } finally {
      setIsAnalyzing(false);
    }
  }, [language, onError]);

  // AI Chat
  const sendAIPrompt = async () => {
    if (!aiPrompt.trim() || !monacoEditorRef.current) return;

    try {
      const code = monacoEditorRef.current.getValue();
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          prompt: aiPrompt,
          language,
          filePath
        })
      });

      if (response.ok) {
        const result = await response.json();
        // Apply AI suggestions
        if (result.suggestions) {
          const model = monacoEditorRef.current.getModel();
          if (model) {
            const range = model.getFullModelRange();
            model.pushEditOperations(
              [],
              [{ range, text: result.suggestions }],
              () => null
            );
          }
        }
        setAiPrompt('');
      }
    } catch (error) {
      console.error('Failed to send AI prompt:', error);
      onError?.('Failed to process AI prompt');
    }
  };

  // Send cursor update
  const sendCursorUpdate = useCallback((cursor: any) => {
    // This would be handled by the collaboration context
  }, []);

  return (
    <div className="flex flex-col h-full bg-gray-900">
      {/* Editor Toolbar */}
      <div className="flex items-center justify-between p-2 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-300">{filePath}</span>
          <span className="text-xs text-gray-500">({language})</span>
        </div>
        
        <div className="flex items-center space-x-2">
          {isConnected && (
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs text-gray-300">
                {users.length} collaborators
              </span>
            </div>
          )}
          
          <button
            onClick={analyzeCode}
            disabled={isAnalyzing}
            className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded"
          >
            {isAnalyzing ? 'Analyzing...' : '🔍 Analyze'}
          </button>
          
          <button
            onClick={() => setShowAIPanel(!showAIPanel)}
            className="px-3 py-1 text-xs bg-purple-600 hover:bg-purple-700 rounded"
          >
            🤖 AI Assistant
          </button>
        </div>
      </div>

      <div className="flex flex-1">
        {/* Main Editor */}
        <div className="flex-1 relative">
          <div ref={editorRef} className="w-full h-full" />
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75">
              <div className="text-white">Loading editor...</div>
            </div>
          )}
        </div>

        {/* AI Assistant Panel */}
        {showAIPanel && (
          <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
            <div className="p-4 border-b border-gray-700">
              <h3 className="text-white font-semibold mb-2">AI Assistant</h3>
              <div className="space-y-2">
                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Ask AI to help with your code..."
                  className="w-full h-20 p-2 text-sm bg-gray-700 text-white border border-gray-600 rounded resize-none"
                />
                <button
                  onClick={sendAIPrompt}
                  className="w-full px-3 py-2 text-sm bg-purple-600 hover:bg-purple-700 rounded"
                >
                  Send to AI
                </button>
              </div>
            </div>

            {/* Analysis Results */}
            <div className="flex-1 p-4 overflow-y-auto">
              <h4 className="text-white font-semibold mb-2">Code Analysis</h4>
              {analysisResults.length > 0 ? (
                <div className="space-y-2">
                  {analysisResults.map((result, index) => (
                    <div
                      key={index}
                      className={`p-2 rounded text-sm ${
                        result.type === 'error' ? 'bg-red-900 text-red-200' :
                        result.type === 'warning' ? 'bg-yellow-900 text-yellow-200' :
                        'bg-blue-900 text-blue-200'
                      }`}
                    >
                      <div className="font-semibold">Line {result.line}:</div>
                      <div>{result.message}</div>
                      {result.code && (
                        <div className="mt-1 font-mono text-xs opacity-75">
                          {result.code}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-400 text-sm">
                  No analysis results yet. Click "Analyze" to get started.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 