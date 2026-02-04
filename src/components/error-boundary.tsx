'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { logger } from '@/lib/logger'
import { trackError } from '@/lib/error-tracking'
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react'
import { Button } from '@/components/ui/button'

// ============================================================================
// Types
// ============================================================================

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  onReset?: () => void
  componentName?: string
  showDetails?: boolean
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

// ============================================================================
// Default Error Fallback UI
// ============================================================================

function DefaultErrorFallback({
  error,
  onReset,
  showDetails = false,
}: {
  error: Error
  onReset?: () => void
  showDetails?: boolean
}) {
  const handleRefresh = () => {
    window.location.reload()
  }

  const handleGoHome = () => {
    window.location.href = '/'
  }

  return (
    <div className="min-h-[400px] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6 text-center">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
        </div>
        
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Something went wrong
        </h2>
        
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          We apologize for the inconvenience. The error has been logged and we&apos;ll look into it.
        </p>

        {showDetails && process.env.NODE_ENV === 'development' && (
          <div className="mb-6 text-left">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 mb-2 overflow-auto max-h-40">
              <code className="text-xs text-red-600 dark:text-red-400 font-mono block">
                {error.name}: {error.message}
              </code>
              {error.stack && (
                <pre className="text-xs text-gray-600 dark:text-gray-400 font-mono mt-2 whitespace-pre-wrap">
                  {error.stack}
                </pre>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {onReset && (
            <Button
              onClick={onReset}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Button>
          )}
          
          <Button
            onClick={handleRefresh}
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh Page
          </Button>
          
          <Button
            onClick={handleGoHome}
            variant="ghost"
            className="flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Button>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// Error Boundary Component
// ============================================================================

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error
    logger.error(
      `React error boundary caught error in ${this.props.componentName || 'unknown component'}`,
      error,
      {
        component: this.props.componentName,
        errorInfo: errorInfo.componentStack,
      }
    )

    this.setState({ errorInfo })

    // Send to error tracking service
    trackError(error, {
      severity: 'error',
      context: {
        component: this.props.componentName || 'unknown',
        action: 'react-error-boundary',
        extra: {
          componentStack: errorInfo.componentStack,
        },
      },
    })

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
    
    if (this.props.onReset) {
      this.props.onReset()
    }
  }

  render() {
    if (this.state.hasError && this.state.error) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default fallback UI
      return (
        <DefaultErrorFallback
          error={this.state.error}
          onReset={this.handleReset}
          showDetails={this.props.showDetails}
        />
      )
    }

    return this.props.children
  }
}

// ============================================================================
// Section Error Boundary
// ============================================================================

interface SectionErrorBoundaryProps {
  children: ReactNode
  sectionName: string
  fallback?: ReactNode
  onReset?: () => void
}

function SectionErrorFallback({
  sectionName,
  onReset,
}: {
  sectionName: string
  onReset?: () => void
}) {
  return (
    <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <Bug className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-amber-900 dark:text-amber-200">
            {sectionName} is temporarily unavailable
          </h3>
          <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
            This section encountered an error. The rest of the page should work normally.
          </p>
          {onReset && (
            <button
              onClick={onReset}
              className="text-sm font-medium text-amber-800 dark:text-amber-200 underline mt-2 hover:text-amber-900 dark:hover:text-amber-100"
            >
              Try reloading this section
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export class SectionErrorBoundary extends Component<
  SectionErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: SectionErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error(
      `Section error boundary caught error in ${this.props.sectionName}`,
      error,
      {
        section: this.props.sectionName,
        errorInfo: errorInfo.componentStack,
      }
    )

    trackError(error, {
      severity: 'warning', // Section errors are non-fatal
      context: {
        component: this.props.sectionName,
        action: 'section-error-boundary',
        extra: {
          componentStack: errorInfo.componentStack,
        },
      },
    })

    this.setState({ errorInfo })
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
    
    if (this.props.onReset) {
      this.props.onReset()
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <SectionErrorFallback
          sectionName={this.props.sectionName}
          onReset={this.handleReset}
        />
      )
    }

    return this.props.children
  }
}

// ============================================================================
// Async Error Boundary (for async components)
// ============================================================================

interface AsyncErrorBoundaryProps {
  children: ReactNode
  error?: Error | null
  onReset?: () => void
}

export function AsyncErrorBoundary({
  children,
  error,
  onReset,
}: AsyncErrorBoundaryProps) {
  if (error) {
    return (
      <DefaultErrorFallback
        error={error}
        onReset={onReset}
        showDetails={true}
      />
    )
  }

  return <>{children}</>
}

// ============================================================================
// Hook for error handling
// ============================================================================

import { useState, useCallback } from 'react'

interface UseErrorHandlerResult {
  error: Error | null
  handleError: (error: Error) => void
  clearError: () => void
  ErrorFallback: React.FC<{ children: ReactNode }>
}

export function useErrorHandler(
  componentName?: string
): UseErrorHandlerResult {
  const [error, setError] = useState<Error | null>(null)

  const handleError = useCallback(
    (err: Error) => {
      logger.error(`Error in ${componentName || 'component'}`, err, {
        component: componentName,
      })
      setError(err)
    },
    [componentName]
  )

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const ErrorFallback: React.FC<{ children: ReactNode }> = useCallback(
    ({ children }) => {
      if (error) {
        return (
          <DefaultErrorFallback
            error={error}
            onReset={clearError}
            showDetails={true}
          />
        )
      }
      return <>{children}</>
    },
    [error, clearError]
  )

  return {
    error,
    handleError,
    clearError,
    ErrorFallback,
  }
}

export default ErrorBoundary
