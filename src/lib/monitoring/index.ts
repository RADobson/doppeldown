/**
 * DoppelDown Monitoring System
 * 
 * Centralized exports for the performance monitoring and error tracking infrastructure.
 * 
 * Architecture:
 * - StructuredLogger: Production-grade JSON logging with correlation IDs
 * - PerformanceMonitor: API request timing, DB query tracking, resource monitoring
 * - AnomalyDetector: Statistical anomaly detection with configurable alerting
 * - AlertManager: Multi-channel alert delivery (webhook, email, Slack)
 * - MonitoringDashboard: Aggregated system health view
 */

export { structuredLogger, createCorrelatedLogger, type LogEntry, type CorrelationContext } from './structured-logger'
export { performanceMonitor, withPerformanceTracking, type RequestMetrics } from './performance-monitor'
export { anomalyDetector, type AnomalyAlert, type AlertSeverity } from './anomaly-detector'
export { alertManager, type AlertChannel, type AlertPayload } from './alert-manager'
export { dbMonitor, type QueryMetrics } from './db-monitor'
export { getSystemSnapshot, type SystemSnapshot } from './dashboard'
