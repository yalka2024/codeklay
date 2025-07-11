import type React from "react"
import type { Metadata } from "next"
import { AIChatFAB } from '../components/ai/ai-chat-fab'
import { AuthProvider } from '../components/auth-provider'
import { UserProfile } from '../components/user-profile'
import { Inter } from 'next/font/google'
import { ErrorBoundary } from '../components/ui/error-boundary'
import { AccessibilityProvider } from '../components/accessibility/accessibility-provider'
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "CodePal - AI-Powered Development Platform",
  description: "Advanced AI-powered development platform with code generation, review, testing, and collaboration features",
  generator: "CodePal",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <AccessibilityProvider>
          <ErrorBoundary>
            <AuthProvider>
              {children}
              <AIChatFAB />
            </AuthProvider>
          </ErrorBoundary>
        </AccessibilityProvider>
      </body>
    </html>
  )
}
