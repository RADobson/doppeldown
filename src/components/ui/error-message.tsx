'use client'

import { AlertCircle } from 'lucide-react'

export interface ErrorMessageProps {
  message: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function ErrorMessage({ message, action }: ErrorMessageProps) {
  return (
    <div className="rounded-lg bg-red-50 border border-red-200 p-4">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm text-red-800">{message}</p>
          {action && (
            <button
              onClick={action.onClick}
              className="text-sm font-medium text-red-600 hover:text-red-700 mt-2 underline"
            >
              {action.label}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
