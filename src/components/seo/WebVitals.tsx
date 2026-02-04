'use client'

/**
 * Web Vitals Reporter Component
 * 
 * Monitors Core Web Vitals and reports to analytics
 */

import { useEffect, useCallback } from 'react'
import { onCLS, onLCP, onFCP, onTTFB, onINP, type Metric } from 'web-vitals'
import { rateWebVital, type WebVitalMetric } from '@/lib/seo/performance'

export interface WebVitalsReportHandler {
  (metric: {
    name: string
    value: number
    rating: 'good' | 'needs-improvement' | 'poor'
    delta: number
    id: string
    navigationType: string
  }): void
}

interface WebVitalsProps {
  /**
   * Handler function called when a metric is recorded
   */
  onReport?: WebVitalsReportHandler
  
  /**
   * Enable console logging in development
   */
  debug?: boolean
  
  /**
   * Send to analytics endpoint
   */
  analyticsEndpoint?: string
}

/**
 * Default handler that logs to console and sends to analytics
 */
function defaultReportHandler(
  metric: Metric,
  debug: boolean,
  analyticsEndpoint?: string
) {
  const metricName = metric.name as WebVitalMetric
  const rating = rateWebVital(metricName, metric.value)
  
  const data = {
    name: metric.name,
    value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
    rating,
    delta: Math.round(metric.delta),
    id: metric.id,
    navigationType: metric.navigationType,
  }
  
  // Debug logging
  if (debug) {
    const color = rating === 'good' ? '🟢' : rating === 'needs-improvement' ? '🟡' : '🔴'
    console.log(`${color} ${metric.name}: ${data.value}${metric.name === 'CLS' ? '' : 'ms'} (${rating})`)
  }
  
  // Send to analytics endpoint
  if (analyticsEndpoint) {
    // Use sendBeacon for reliability
    if (navigator.sendBeacon) {
      navigator.sendBeacon(analyticsEndpoint, JSON.stringify(data))
    } else {
      fetch(analyticsEndpoint, {
        method: 'POST',
        body: JSON.stringify(data),
        keepalive: true,
        headers: {
          'Content-Type': 'application/json',
        },
      }).catch(() => {
        // Silently fail - analytics shouldn't break the app
      })
    }
  }
  
  return data
}

/**
 * Web Vitals monitoring component
 * 
 * Add this to your root layout to monitor Core Web Vitals:
 * 
 * ```tsx
 * <WebVitals debug={process.env.NODE_ENV === 'development'} />
 * ```
 * 
 * Automatically reports to /api/monitoring/vitals for server-side aggregation.
 */
export function WebVitals({ 
  onReport, 
  debug = false,
  analyticsEndpoint = '/api/monitoring/vitals',
}: WebVitalsProps) {
  const handleMetric = useCallback((metric: Metric) => {
    const data = defaultReportHandler(metric, debug, analyticsEndpoint)
    onReport?.(data)
  }, [onReport, debug, analyticsEndpoint])
  
  useEffect(() => {
    // Register all Web Vitals observers
    // Note: FID is deprecated in favor of INP (Interaction to Next Paint)
    onCLS(handleMetric)
    onLCP(handleMetric)
    onFCP(handleMetric)
    onTTFB(handleMetric)
    onINP(handleMetric)
  }, [handleMetric])
  
  // This component doesn't render anything
  return null
}

/**
 * Hook for accessing Web Vitals data
 */
export function useWebVitals(onMetric: WebVitalsReportHandler) {
  useEffect(() => {
    const handleMetric = (metric: Metric) => {
      const metricName = metric.name as WebVitalMetric
      const rating = rateWebVital(metricName, metric.value)
      
      onMetric({
        name: metric.name,
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        rating,
        delta: Math.round(metric.delta),
        id: metric.id,
        navigationType: metric.navigationType,
      })
    }
    
    // Note: FID is deprecated in favor of INP (Interaction to Next Paint)
    onCLS(handleMetric)
    onLCP(handleMetric)
    onFCP(handleMetric)
    onTTFB(handleMetric)
    onINP(handleMetric)
  }, [onMetric])
}

/**
 * Performance debug overlay (development only)
 */
export function PerformanceOverlay() {
  if (process.env.NODE_ENV !== 'development') {
    return null
  }
  
  return (
    <div className="fixed bottom-4 right-4 z-50 bg-black/90 text-white p-3 rounded-lg text-xs font-mono max-w-xs">
      <div className="font-bold mb-2">⚡ Web Vitals</div>
      <div className="space-y-1">
        <VitalDisplay name="LCP" />
        <VitalDisplay name="CLS" />
        <VitalDisplay name="INP" />
        <VitalDisplay name="FCP" />
        <VitalDisplay name="TTFB" />
      </div>
    </div>
  )
}

function VitalDisplay({ name }: { name: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-gray-400">{name}:</span>
      <span id={`vital-${name.toLowerCase()}`}>--</span>
    </div>
  )
}
