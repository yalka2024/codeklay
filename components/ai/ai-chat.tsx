"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Loader2, Send } from "lucide-react"
import type { FeedbackEntry } from '../../lib/ai-feedback'
import { useState } from 'react';
import { UpgradePrompt } from '../ui/upgrade-prompt';

export type AIChatMessage = {
  role: "user" | "assistant" | "system"
  content: string
  code?: string
  language?: string
}

// Add a helper to detect and render task lists or status summaries
function renderAIContent(content: string) {
  // Simple heuristic: if the content contains numbered or bulleted lists, render as a list
  if (/\d+\./.test(content) || /\n- /.test(content)) {
    return (
      <ul className="list-disc pl-5 text-left">
        {content.split(/\n|\r/).map((line, i) =>
          line.match(/^\d+\./) || line.match(/^\s*- /) ? (
            <li key={i} className="mb-1">{line.replace(/^\s*- /, '').replace(/^\d+\.\s*/, '')}</li>
          ) : null
        )}
      </ul>
    )
  }
  // Otherwise, render as plain text
  return <span>{content}</span>
}

export function AIChat({
  onSend,
  messages,
  loading,
  placeholder = "Ask AI to generate code, review, or explain...",
  language = "en",
  onInsertCode,
  recentFeedback = [],
}: {
  onSend: (message: string) => void
  messages: AIChatMessage[]
  loading?: boolean
  placeholder?: string
  language?: string
  onInsertCode?: (code: string) => void
  recentFeedback?: FeedbackEntry[]
}) {
  const [input, setInput] = React.useState("")
  const inputRef = React.useRef<HTMLTextAreaElement>(null)
  const [upgradeError, setUpgradeError] = useState<string | null>(null);

  const handleSend = () => {
    if (input.trim()) {
      onSend(input)
      setInput("")
    }
  }

  React.useEffect(() => {
    if (!loading && inputRef.current) {
      inputRef.current.focus()
    }
  }, [loading])

  return (
    <Card className="w-full max-w-md h-full flex flex-col shadow-lg border-2 border-primary">
      <CardHeader>
        <CardTitle>AI Assistant</CardTitle>
        <div className="text-xs text-muted-foreground">Code generation, review, and chat ({language.toUpperCase()})</div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-2 p-2">
        <ScrollArea className="flex-1 h-80 max-h-96 pr-2">
          <div className="flex flex-col gap-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
                <div className={`rounded-lg px-3 py-2 ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                  {msg.role === 'assistant' ? renderAIContent(msg.content) : <span>{msg.content}</span>}
                  {msg.code && (
                    <>
                      <pre className="mt-2 bg-black text-white rounded p-2 text-xs overflow-x-auto">
                        <code>{msg.code}</code>
                      </pre>
                      {onInsertCode && (
                        <Button size="sm" className="mt-2" onClick={() => onInsertCode(msg.code!)}>
                          Insert Code
                        </Button>
                      )}
                    </>
                  )}
                </div>
                {msg.language && <Badge className="mt-1">{msg.language.toUpperCase()}</Badge>}
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="animate-spin h-4 w-4" /> AI is thinking...
              </div>
            )}
          </div>
        </ScrollArea>
        <div className="flex gap-2 mt-2">
          <Textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            placeholder={placeholder}
            className="flex-1 min-h-[40px] max-h-24 resize-none"
            disabled={loading}
            autoFocus
          />
          <Button onClick={handleSend} disabled={loading || !input.trim()} className="h-10 px-3">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
      {upgradeError && <UpgradePrompt message={upgradeError} />}
    </Card>
  )
} 