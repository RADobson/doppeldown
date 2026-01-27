'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface ScanProgressProps {
  scanId: string;
  onComplete?: () => void;
  onError?: (error: string) => void;
  onCancel?: () => void;
}

type ScanStep = 'domains' | 'web' | 'logo' | 'social' | 'finalizing';

const STEP_LABELS: Record<ScanStep, string> = {
  domains: 'Checking domain variations',
  web: 'Scanning web for lookalikes',
  logo: 'Searching for logo usage',
  social: 'Scanning social media',
  finalizing: 'Finalizing results'
};

interface ScanData {
  status: string;
  current_step?: string;
  step_progress?: number;
  step_total?: number;
  overall_progress?: number;
  domains_checked?: number;
  pages_scanned?: number;
  threats_found?: number;
  retry_count?: number;
  error?: string;
}

export function ScanProgress({ scanId, onComplete, onError, onCancel }: ScanProgressProps) {
  const [scan, setScan] = useState<ScanData | null>(null);
  const [polling, setPolling] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  // Cancel scan handler (HARD-04)
  const handleCancel = async () => {
    if (cancelling) return;
    setCancelling(true);

    try {
      const response = await fetch('/api/scan/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scanId })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to cancel scan');
      }

      setPolling(false);
      onCancel?.();
    } catch (err) {
      console.error('Failed to cancel scan:', err);
      // Still allow retry
      setCancelling(false);
    }
  };

  useEffect(() => {
    if (!polling) return;

    const supabase = createClient();
    let timeoutId: NodeJS.Timeout;

    const fetchProgress = async () => {
      const { data, error } = await supabase
        .from('scans')
        .select('status, current_step, step_progress, step_total, overall_progress, domains_checked, pages_scanned, threats_found, retry_count, error')
        .eq('id', scanId)
        .single();

      if (error) {
        console.error('Failed to fetch scan progress:', error);
        return;
      }

      setScan(data);

      if (data.status === 'completed') {
        setPolling(false);
        onComplete?.();
      } else if (data.status === 'failed') {
        setPolling(false);
        onError?.(data.error || 'Scan failed');
      } else {
        // Continue polling
        timeoutId = setTimeout(fetchProgress, 4000);
      }
    };

    fetchProgress();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [scanId, polling, onComplete, onError]);

  if (!scan) {
    return (
      <div className="animate-pulse bg-muted rounded-lg p-4">
        <div className="h-4 bg-muted rounded w-1/4 mb-2"></div>
        <div className="h-2 bg-muted rounded"></div>
      </div>
    );
  }

  const progress = scan.overall_progress ?? 0;
  const step = (scan.current_step as ScanStep) || 'domains';
  const stepLabel = STEP_LABELS[step] || 'Scanning...';
  const isRunning = scan.status === 'running' || scan.status === 'queued' || scan.status === 'pending';
  const retryCount = scan.retry_count || 0;

  return (
    <div className="bg-card border rounded-lg p-4 shadow-sm">
      {/* Header with cancel button */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">
            {scan.status === 'running' ? stepLabel : scan.status === 'completed' ? 'Scan Complete' : scan.status === 'queued' || scan.status === 'pending' ? 'Queued...' : 'Scan Failed'}
          </span>
          {/* Retry indicator (HARD-03 visibility) */}
          {retryCount > 0 && isRunning && (
            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
              Retry {retryCount}/3
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-indigo-600">
            {progress}%
          </span>
          {/* Cancel button (HARD-04) */}
          {isRunning && (
            <button
              onClick={handleCancel}
              disabled={cancelling}
              className="text-xs px-2 py-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Cancel scan"
            >
              {cancelling ? 'Cancelling...' : 'Cancel'}
            </button>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-muted rounded-full h-2.5 mb-3">
        <div
          className={`h-2.5 rounded-full transition-all duration-500 ${
            scan.status === 'failed' ? 'bg-red-500' :
            scan.status === 'completed' ? 'bg-green-500' : 'bg-indigo-500'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Step progress detail */}
      {scan.status === 'running' && scan.step_total && scan.step_total > 0 && (
        <div className="text-xs text-muted-foreground mb-2">
          Step progress: {scan.step_progress || 0} / {scan.step_total}
        </div>
      )}

      {/* Stats */}
      <div className="flex gap-4 text-xs text-muted-foreground">
        {scan.domains_checked !== undefined && scan.domains_checked > 0 && (
          <span>Domains: {scan.domains_checked}</span>
        )}
        {scan.pages_scanned !== undefined && scan.pages_scanned > 0 && (
          <span>Pages: {scan.pages_scanned}</span>
        )}
        {scan.threats_found !== undefined && scan.threats_found > 0 && (
          <span className="text-red-600 font-medium">Threats: {scan.threats_found}</span>
        )}
      </div>

      {/* Error message */}
      {scan.status === 'failed' && scan.error && (
        <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
          {scan.error}
        </div>
      )}
    </div>
  );
}
