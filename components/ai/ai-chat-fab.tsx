"use client"

import * as React from "react"
import { AIChat, AIChatMessage } from "./ai-chat"
import { Bot, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { usePathname } from 'next/navigation'
import { localesList } from '../../app/i18n'
import { getRecentFeedback, addFeedback } from '../../lib/ai-feedback'

export function AIChatFAB() {
  const [open, setOpen] = React.useState(false)
  const [messages, setMessages] = React.useState<AIChatMessage[]>([])
  const [loading, setLoading] = React.useState(false)
  const [mode, setMode] = React.useState<'codegen' | 'review' | 'chat'>('chat')
  const [language, setLanguage] = React.useState('en')
  const [tab, setTab] = React.useState<'chat' | 'feedback'>('chat')
  const recentFeedback = getRecentFeedback(10)
  const pathname = usePathname()
  React.useEffect(() => {
    // Try to detect locale from the URL (e.g., /es/..., /fr/..., etc.)
    const match = pathname?.split('/')?.[1]
    if (match && localesList.includes(match)) {
      setLanguage(match)
    }
  }, [pathname])

  const handleSend = async (input: string) => {
    setMessages((prev) => [...prev, { role: 'user', content: input }])
    setLoading(true)
    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, { role: 'user', content: input }],
          mode,
          language,
        }),
      })
      const data = await res.json()
      setMessages((prev) => [...prev, { role: 'assistant', content: data.message }])
    } catch (e) {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Error: Unable to reach AI service.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          className="rounded-full shadow-lg bg-gradient-to-r from-teal-500 to-purple-600 hover:from-teal-600 hover:to-purple-700 h-14 w-14 p-0 flex items-center justify-center"
          onClick={() => setOpen((v) => !v)}
          aria-label="Open AI Assistant"
        >
          {open ? <X className="h-7 w-7 text-white" /> : <Bot className="h-7 w-7 text-white" />}
        </Button>
      </div>
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[350px] max-w-full h-[500px] bg-white rounded shadow-lg flex flex-col">
          <div className="flex items-center border-b">
            <button className={`flex-1 py-2 text-sm ${tab === 'chat' ? 'font-bold border-b-2 border-primary' : ''}`} onClick={() => setTab('chat')}>Chat</button>
            <button className={`flex-1 py-2 text-sm ${tab === 'feedback' ? 'font-bold border-b-2 border-primary' : ''}`} onClick={() => setTab('feedback')}>Feedback</button>
          </div>
          {tab === 'feedback' ? (
            <div className="flex-1 overflow-auto p-2">
              <div className="font-semibold mb-2">Recent Feedback</div>
              <ul className="text-xs space-y-2">
                {recentFeedback.length === 0 && <li>No feedback yet.</li>}
                {recentFeedback.map((fb, i) => (
                  <li key={i} className="border-b pb-1">
                    <div><b>{fb.type}</b> <span className="text-muted-foreground">{new Date(fb.timestamp).toLocaleString()}</span></div>
                    <div>{fb.content}</div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <label htmlFor="ai-chat-lang" className="text-xs text-muted-foreground">Language:</label>
                <select
                  id="ai-chat-lang"
                  value={language}
                  onChange={e => setLanguage(e.target.value)}
                  className="text-xs border rounded px-2 py-1"
                >
                  {localesList.map((loc) => (
                    <option key={loc} value={loc}>{loc.toUpperCase()}</option>
                  ))}
                </select>
              </div>
              <AIChat
                onSend={handleSend}
                messages={messages}
                loading={loading}
                language={language}
                recentFeedback={recentFeedback}
                onInsertCode={(code) => {
                  toast({
                    title: 'Code Inserted',
                    description: 'The generated code was inserted into the editor (simulation).',
                    duration: 3000,
                  })
                  // TODO: Integrate with real editor state
                }}
              />
            </div>
          )}
        </div>
      )}
    </>
  )
} 