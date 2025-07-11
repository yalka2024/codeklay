// Simple in-memory feedback store for AI actions, test results, and user corrections

export type FeedbackEntry = {
  timestamp: number
  type: 'ai-suggestion' | 'test-result' | 'user-correction' | 'rating' | 'comment'
  content: string
  details?: any
}

const feedbackLog: FeedbackEntry[] = []

export function addFeedback(entry: FeedbackEntry) {
  feedbackLog.push({ ...entry, timestamp: Date.now() })
}

export function getRecentFeedback(limit = 10): FeedbackEntry[] {
  return feedbackLog.slice(-limit)
} 