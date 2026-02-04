'use client'

import { useEffect } from 'react'
import { logger } from '@/lib/logger'
import { trackError } from '@/lib/error-tracking'
import { AlertTriangle, RefreshCw, Home, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface GlobalErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Log the error when the component mounts
    logger.error('Global error boundary caught error', error, {
      digest: error.digest,
      stack: error.stack,
    })

    // Send to error tracking service
    trackError(error, {
      severity: 'fatal',
      context: {
        component: 'global-error-boundary',
        action: 'page-crash',
        extra: { digest: error.digest },
      },
      immediate: true,
    })
  }, [error])

  const handleRefresh = () => {
    window.location.reload()
  }

  const handleGoHome = () => {
    window.location.href = '/'
  }

  const handleContactSupport = () => {
    window.location.href = 'mailto:support@doppeldown.com?subject=Application Error&body=Error: ' + encodeURIComponent(error.message)
  }

  const isDev = process.env.NODE_ENV === 'development'

  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
        <div className="max-w-lg w-full bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-8 text-center">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-400" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            Application Error
          </h1>
          
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            We&apos;re sorry, but something went wrong on our end.
          </p>
          
          <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
            Our team has been notified and we&apos;re working to fix the issue.
          </p>

          {/* Error Details (Development Only) */}
          {isDev && (
            <div className="mb-6 text-left">
              <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg p-4 overflow-auto max-h-60">
                <h3 className="text-sm font-semibold text-red-900 dark:text-red-300 mb-2">
                  Error Details (Development Mode)
                </h3>
                <code className="text-xs text-red-700 dark:text-red-400 font-mono block">
                  {error.name}: {error.message}
                </code>
                {error.digest && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                    Error ID: {error.digest}
                  </p>
                )}
                {error.stack && (
                  <pre className="text-xs text-gray-600 dark:text-gray-500 font-mono mt-3 whitespace-pre-wrap border-t border-red-200 dark:border-red-800 pt-3">
                    {error.stack}
                  </pre>
                )}
              </div>
            </div>
          )}

          {/* Production Error ID */}
          {!isDev && error.digest && (
            <div className="mb-6">
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Error Reference: <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-xs font-mono">{error.digest}</code>
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">
                Please include this reference if you contact support.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={reset}
              variant="outline"
              className="flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Button>
            
            <Button
              onClick={handleRefresh}
              className="flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh Page
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-3">
            <Button
              onClick={handleGoHome}
              variant="ghost"
              className="flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              Go Home
            </Button>
            
            <Button
              onClick={handleContactSupport}
              variant="ghost"
              className="flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              Contact Support
            </Button>
          </div>
        </div>
      </body>
    </html>
  )
}
