'use client';

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Play, Save, GitCommit, FileText, Folder, ChevronRight, ChevronDown, File, Wand2, FlaskConical, ShieldCheck, BookOpen } from "lucide-react"
import { useI18n } from '../app/i18n'

const fileTree = [
  {
    name: "src",
    type: "folder",
    expanded: true,
    children: [
      {
        name: "components",
        type: "folder",
        expanded: true,
        children: [
          { name: "Header.tsx", type: "file" },
          { name: "Sidebar.tsx", type: "file" },
          { name: "Button.tsx", type: "file" },
        ],
      },
      {
        name: "pages",
        type: "folder",
        expanded: false,
        children: [
          { name: "index.tsx", type: "file" },
          { name: "about.tsx", type: "file" },
        ],
      },
      {
        name: "utils",
        type: "folder",
        expanded: false,
        children: [
          { name: "helpers.ts", type: "file" },
          { name: "api.ts", type: "file" },
        ],
      },
      { name: "App.tsx", type: "file" },
      { name: "index.tsx", type: "file" },
    ],
  },
  { name: "public", type: "folder", expanded: false, children: [] },
  { name: "package.json", type: "file" },
  { name: "tsconfig.json", type: "file" },
  { name: "README.md", type: "file" },
]

const sampleCode = `import React, { useState } from 'react';
import { Button } from './components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';

interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
}

export default function TodoApp() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [inputValue, setInputValue] = useState('');

  const addTodo = () => {
    if (inputValue.trim()) {
      setTodos([...todos, {
        id: Date.now(),
        text: inputValue,
        completed: false
      }]);
      setInputValue('');
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{t('code_editor.todo_list')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={t('code_editor.add_todo_placeholder')}
            className="flex-1 px-3 py-2 border rounded-md"
            onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          />
          <Button onClick={addTodo}>{t('code_editor.add')}</Button>
        </div>
        <div className="space-y-2">
          {todos.map(todo => (
            <div
              key={todo.id}
              className={\`flex items-center gap-2 p-2 border rounded-md \${
                todo.completed ? 'bg-gray-50 text-gray-500' : ''
              }\`}
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
              />
              <span className={todo.completed ? 'line-through' : ''}>
                {todo.text}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}`

const terminalOutput = `$ npm run dev

> todo-app@0.1.0 dev
> next dev

ready - started server on 0.0.0.0:3000, url: http://localhost:3000
info  - Loaded env from .env.local
event - compiled client and server successfully in 2.3s (165 modules)
wait  - compiling...
event - compiled client and server successfully in 89 ms (165 modules)
`

function FileTreeItem({ item, level = 0 }: { item: any; level?: number }) {
  const [expanded, setExpanded] = React.useState(item.expanded || false)

  return (
    <div>
      <div
        className="flex items-center gap-1 py-1 px-2 hover:bg-muted/50 cursor-pointer text-sm"
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={() => item.type === "folder" && setExpanded(!expanded)}
      >
        {item.type === "folder" ? (
          <>
            {expanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            <Folder className="h-4 w-4 text-blue-500" />
          </>
        ) : (
          <>
            <div className="w-3" />
            <File className="h-4 w-4 text-gray-500" />
          </>
        )}
        <span>{item.name}</span>
      </div>
      {item.type === "folder" && expanded && item.children && (
        <div>
          {item.children.map((child: any, index: number) => (
            <FileTreeItem key={index} item={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

export function CodeEditor() {
  const { t } = useI18n()
  const [activeFile, setActiveFile] = React.useState("App.tsx")
  const [aiReview, setAiReview] = React.useState<string | null>(null)
  const [reviewLoading, setReviewLoading] = React.useState(false)
  const [generatedTests, setGeneratedTests] = React.useState<string | null>(null)
  const [testGenLoading, setTestGenLoading] = React.useState(false)
  const [testResult, setTestResult] = React.useState<string | null>(null)
  const [aiFix, setAiFix] = React.useState<string | null>(null)
  const [fixLoading, setFixLoading] = React.useState(false)
  const [analysisResult, setAnalysisResult] = React.useState<string | null>(null)
  const [analysisLoading, setAnalysisLoading] = React.useState(false)
  const [generatedDocs, setGeneratedDocs] = React.useState<string | null>(null)
  const [docsLoading, setDocsLoading] = React.useState(false)

  const handleAIReview = async () => {
    setReviewLoading(true)
    setAiReview(null)
    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'user', content: `Review this code and suggest improvements, fixes, and best practices.\n\n${sampleCode}` }
          ],
          mode: 'review',
          language: 'en',
        }),
      })
      const data = await res.json()
      setAiReview(data.message)
    } catch (e) {
      setAiReview('Error: Unable to reach AI service.')
    } finally {
      setReviewLoading(false)
    }
  }

  const handleGenerateTests = async () => {
    setTestGenLoading(true)
    setGeneratedTests(null)
    setTestResult(null)
    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'user', content: `Generate comprehensive unit tests for the following code.\n\n${sampleCode}` }
          ],
          mode: 'codegen',
          language: 'en',
        }),
      })
      const data = await res.json()
      setGeneratedTests(data.message)
    } catch (e) {
      setGeneratedTests('Error: Unable to reach AI service.')
    } finally {
      setTestGenLoading(false)
    }
  }

  const handleRunTests = async () => {
    // Simulate test running: randomly pass or fail
    const pass = Math.random() > 0.3
    setTestResult(pass ? 'All tests passed!' : 'Some tests failed. AI will suggest a fix.')
    setAiFix(null)
    if (!pass) {
      setFixLoading(true)
      try {
        const res = await fetch('/api/ai-chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [
              { role: 'user', content: `The following code failed its tests. Suggest a fix and explain why.\n\n${sampleCode}` }
            ],
            mode: 'codegen',
            language: 'en',
          }),
        })
        const data = await res.json()
        setAiFix(data.message)
      } catch (e) {
        setAiFix('Error: Unable to reach AI service.')
      } finally {
        setFixLoading(false)
      }
    }
  }

  const handleRunAnalysis = async () => {
    setAnalysisLoading(true)
    setAnalysisResult(null)
    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'user', content: `Perform a static analysis and security review of the following code. List any issues and suggest fixes.\n\n${sampleCode}` }
          ],
          mode: 'review',
          language: 'en',
        }),
      })
      const data = await res.json()
      setAnalysisResult(data.message)
    } catch (e) {
      setAnalysisResult('Error: Unable to reach AI service.')
    } finally {
      setAnalysisLoading(false)
    }
  }

  const handleGenerateDocs = async () => {
    setDocsLoading(true)
    setGeneratedDocs(null)
    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'user', content: `Generate or update docstrings, README, and API documentation for the following code.\n\n${sampleCode}` }
          ],
          mode: 'codegen',
          language: 'en',
        }),
      })
      const data = await res.json()
      setGeneratedDocs(data.message)
    } catch (e) {
      setGeneratedDocs('Error: Unable to reach AI service.')
    } finally {
      setDocsLoading(false)
    }
  }

  return (
    <div className="flex-1 flex h-screen">
      {/* File Explorer */}
      <div className="w-64 border-r bg-muted/20">
        <div className="p-3 border-b">
          <h3 className="font-semibold text-sm">{t('code_editor.explorer')}</h3>
        </div>
        <ScrollArea className="h-full">
          <div className="p-2">
            {fileTree.map((item, index) => (
              <FileTreeItem key={index} item={item} />
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col">
        {/* Editor Tabs */}
        <div className="flex items-center gap-2 p-2 border-b bg-muted/20">
          <div className="flex items-center gap-1 px-3 py-1 bg-background rounded-md text-sm">
            <FileText className="h-3 w-3" />
            {activeFile}
          </div>
          <Badge variant="secondary" className="text-xs">
            TypeScript
          </Badge>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between p-2 border-b">
          <div className="flex items-center gap-2">
            <Button size="sm" className="bg-green-600 hover:bg-green-700">
              <Play className="mr-2 h-3 w-3" />
              {t('code_editor.run')}
            </Button>
            <Button size="sm" variant="outline">
              <Save className="mr-2 h-3 w-3" />
              {t('code_editor.save')}
            </Button>
            <Button size="sm" variant="outline">
              <GitCommit className="mr-2 h-3 w-3" />
              {t('code_editor.commit')}
            </Button>
            <Button size="sm" variant="outline" onClick={handleAIReview} disabled={reviewLoading}>
              <Wand2 className="mr-2 h-3 w-3" />
              {reviewLoading ? t('code_editor.reviewing') : t('code_editor.ai_review')}
            </Button>
            <Button size="sm" variant="outline" onClick={handleGenerateTests} disabled={testGenLoading}>
              <FlaskConical className="mr-2 h-3 w-3" />
              {testGenLoading ? t('code_editor.generating_tests') : t('code_editor.generate_tests')}
            </Button>
            <Button size="sm" variant="outline" onClick={handleRunAnalysis} disabled={analysisLoading}>
              <ShieldCheck className="mr-2 h-3 w-3" />
              {analysisLoading ? t('code_editor.analyzing') : t('code_editor.run_analysis')}
            </Button>
            <Button size="sm" variant="outline" onClick={handleGenerateDocs} disabled={docsLoading}>
              <BookOpen className="mr-2 h-3 w-3" />
              {docsLoading ? t('code_editor.generating_docs') : t('code_editor.generate_docs')}
            </Button>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{t('code_editor.line_column', { line: 23, column: 15 })}</span>
            <Badge variant="outline">UTF-8</Badge>
          </div>
        </div>

        {/* Split View */}
        <div className="flex-1 flex">
          {/* Code Editor */}
          <div className="flex-1 relative">
            <div className="absolute inset-0 bg-[#1e1e1e] text-gray-300 font-mono text-sm">
              <div className="flex">
                {/* Line Numbers */}
                <div className="w-12 bg-[#1e1e1e] border-r border-gray-700 text-gray-500 text-right pr-2 py-4 select-none">
                  {sampleCode.split("\n").map((_, index) => (
                    <div key={index} className="leading-6">
                      {index + 1}
                    </div>
                  ))}
                </div>
                {/* Code Content */}
                <div className="flex-1 p-4 overflow-auto">
                  <pre className="leading-6">
                    <code
                      dangerouslySetInnerHTML={{
                        __html: sampleCode
                          .replace(
                            /import|export|from|interface|function|const|let|var|if|else|return/g,
                            '<span style="color: #569cd6">$&</span>',
                          )
                          .replace(/React|useState|TodoItem/g, '<span style="color: #4ec9b0">$&</span>')
                          .replace(/'[^']*'/g, '<span style="color: #ce9178">$&</span>')
                          .replace(/\/\/.*$/gm, '<span style="color: #6a9955">$&</span>'),
                      }}
                    />
                  </pre>
                </div>
              </div>
            </div>
            {generatedDocs && (
              <div className="absolute left-0 right-0 bottom-0 bg-green-50 text-black p-4 border-t border-green-300 max-h-60 overflow-auto z-50">
                <div className="font-semibold mb-2">{t('code_editor.generated_docs')}</div>
                <pre className="bg-gray-900 text-green-200 rounded p-2 text-xs overflow-x-auto mb-2">
                  {generatedDocs}
                </pre>
                <Button size="sm" variant="outline" onClick={() => {/* TODO: Copy or insert docs */}}>
                  {t('code_editor.copy_docs')}
                </Button>
              </div>
            )}
            {analysisResult && (
              <div className="absolute left-0 right-0 bottom-0 bg-red-50 text-black p-4 border-t border-red-300 max-h-60 overflow-auto z-40">
                <div className="font-semibold mb-2">{t('code_editor.analysis_result')}</div>
                <pre className="bg-gray-900 text-red-300 rounded p-2 text-xs overflow-x-auto mb-2">
                  {analysisResult}
                </pre>
                <Button size="sm" variant="outline" onClick={() => {/* TODO: Apply suggested fixes */}}>
                  {t('code_editor.apply_fixes')}
                </Button>
              </div>
            )}
            {generatedTests && (
              <div className="absolute left-0 right-0 bottom-0 bg-blue-50 text-black p-4 border-t border-blue-300 max-h-60 overflow-auto z-30">
                <div className="font-semibold mb-2">{t('code_editor.generated_tests')}</div>
                <pre className="bg-gray-900 text-green-300 rounded p-2 text-xs overflow-x-auto mb-2">
                  {generatedTests}
                </pre>
                <Button size="sm" className="mt-2" onClick={handleRunTests} disabled={fixLoading}>
                  {fixLoading ? t('code_editor.self_healing') : t('code_editor.run_tests')}
                </Button>
                {testResult && (
                  <div className="mt-2 font-semibold text-sm">
                    {testResult}
                  </div>
                )}
                {aiFix && (
                  <div className="mt-2 p-2 bg-yellow-100 border border-yellow-400 rounded">
                    <div className="font-semibold mb-1">{t('code_editor.ai_suggested_fix')}</div>
                    <pre className="bg-gray-900 text-yellow-300 rounded p-2 text-xs overflow-x-auto mb-2">{aiFix}</pre>
                    <Button size="sm" variant="outline" onClick={() => {/* TODO: Apply fix to code */}}>
                      {t('code_editor.apply_fix')}
                    </Button>
                  </div>
                )}
              </div>
            )}
            {aiReview && (
              <div className="absolute left-0 right-0 bottom-0 bg-white/90 text-black p-4 border-t border-gray-300 max-h-60 overflow-auto z-20">
                <div className="font-semibold mb-2">{t('code_editor.ai_review_feedback')}</div>
                <div className="whitespace-pre-line text-sm">{aiReview}</div>
              </div>
            )}
          </div>

          {/* Terminal */}
          <div className="w-1/3 border-l flex flex-col">
            <Tabs defaultValue="terminal" className="flex-1 flex flex-col">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="terminal">{t('code_editor.terminal')}</TabsTrigger>
                <TabsTrigger value="output">{t('code_editor.output')}</TabsTrigger>
              </TabsList>
              <TabsContent value="terminal" className="flex-1 m-0">
                <div className="h-full bg-black text-green-400 font-mono text-sm p-4 overflow-auto">
                  <pre>{terminalOutput}</pre>
                  <div className="flex items-center">
                    <span className="text-blue-400">$</span>
                    <span className="ml-2 bg-gray-700 w-2 h-4 animate-pulse"></span>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="output" className="flex-1 m-0">
                <div className="h-full bg-muted/20 p-4 overflow-auto">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>{t('code_editor.build_successful')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>{t('code_editor.server_running')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span>{t('code_editor.hot_reload_enabled')}</span>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
