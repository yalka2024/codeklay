"use client"

import React from "react"
import { AlertTriangle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useI18n } from '../../app/i18n'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>
}

class ErrorBoundaryClass extends React.Component<ErrorBoundaryProps & { t: (key: string) => string }, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps & { t: (key: string) => string }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ error, errorInfo })

    // Log error to monitoring service
    console.error("Error Boundary caught an error:", error, errorInfo)

    // Send to Sentry
    if (typeof window !== "undefined") {
      const { captureException, setContext } = require('@/lib/sentry');
      setContext('errorBoundary', {
        componentStack: errorInfo.componentStack,
        errorBoundary: true,
      });
      captureException(error);
      
      // @ts-ignore
      window.gtag?.("event", "exception", {
        description: error.toString(),
        fatal: false,
      })
    }
  }

  retry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  render() {
    const { t } = this.props
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return <FallbackComponent error={this.state.error!} retry={this.retry} />
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle className="text-xl">{t('something_went_wrong')}</CardTitle>
              <CardDescription>We encountered an unexpected error. Our team has been notified.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={this.retry} className="w-full">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
              <Button variant="outline" className="w-full" onClick={() => window.location.reload()}>
                Reload Page
              </Button>
              {process.env.NODE_ENV === "development" && this.state.error && (
                <details className="mt-4 p-4 bg-gray-100 rounded-md text-sm">
                  <summary className="cursor-pointer font-medium">{t('error_details')}</summary>
                  <pre className="mt-2 whitespace-pre-wrap text-xs">
                    {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              )}
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

export function ErrorBoundary({ children, fallback }: ErrorBoundaryProps) {
  const { t } = useI18n()
  return (
    <ErrorBoundaryClass t={t} fallback={fallback}>
      {children}
    </ErrorBoundaryClass>
  )
}

export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>,
) {
  return function WithErrorBoundaryComponent(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    )
  }
}
