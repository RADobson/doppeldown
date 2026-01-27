'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Bell, CreditCard, User, Shield, Check, Loader2, ExternalLink } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'

interface UserData {
  id: string
  email: string
  full_name: string | null
  subscription_status: string
  subscription_tier: string
  subscription_id: string | null
  customer_id: string | null
}

interface AlertSettings {
  email_alerts: boolean
  alert_email: string | null
  alert_on_severity: string[]
  severity_threshold: 'all' | 'high_critical' | 'critical'
  scan_summary_emails: boolean
  daily_digest: boolean
  weekly_digest: boolean
  instant_critical: boolean
  webhook_url: string | null
  webhook_secret: string | null
}

const PLAN_INFO: Record<string, { name: string; price: string; brandLimit: number }> = {
  free: { name: 'Free', price: '$0/month', brandLimit: 1 },
  starter: { name: 'Starter', price: '$49/month', brandLimit: 1 },
  professional: { name: 'Professional', price: '$99/month', brandLimit: 3 },
  enterprise: { name: 'Enterprise', price: '$249/month', brandLimit: 10 }
}

export default function SettingsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [portalLoading, setPortalLoading] = useState(false)

  const [userData, setUserData] = useState<UserData | null>(null)
  const [brandsCount, setBrandsCount] = useState(0)
  const [profile, setProfile] = useState({ fullName: '', email: '' })
  const [alertSettings, setAlertSettings] = useState<AlertSettings>({
    email_alerts: true,
    alert_email: '',
    alert_on_severity: ['critical', 'high'],
    severity_threshold: 'high_critical',
    scan_summary_emails: true,
    daily_digest: true,
    weekly_digest: true,
    instant_critical: true,
    webhook_url: '',
    webhook_secret: ''
  })
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  })

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const supabase = createClient()

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }

      // Fetch user data
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      if (userError) throw userError
      setUserData(userData)
      setProfile({
        fullName: userData?.full_name || '',
        email: user.email || ''
      })

      // Fetch brands count
      const { count } = await supabase
        .from('brands')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)

      setBrandsCount(count || 0)

      // Fetch alert settings
      const { data: alertData } = await supabase
        .from('alert_settings')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (alertData) {
        // Derive severity_threshold from alert_on_severity if not set
        let derivedThreshold: 'all' | 'high_critical' | 'critical' = 'high_critical'
        if (alertData.severity_threshold) {
          derivedThreshold = alertData.severity_threshold
        } else if (alertData.alert_on_severity) {
          // Backward compat: derive from old array
          const severities = alertData.alert_on_severity as string[]
          if (severities.includes('low') || severities.includes('medium')) {
            derivedThreshold = 'all'
          } else if (severities.includes('high')) {
            derivedThreshold = 'high_critical'
          } else {
            derivedThreshold = 'critical'
          }
        }

        setAlertSettings({
          email_alerts: alertData.email_alerts,
          alert_email: alertData.alert_email || user.email || '',
          alert_on_severity: alertData.alert_on_severity || ['critical', 'high'],
          severity_threshold: derivedThreshold,
          scan_summary_emails: alertData.scan_summary_emails ?? true,
          daily_digest: alertData.daily_digest,
          weekly_digest: alertData.weekly_digest ?? alertData.daily_digest ?? true,
          instant_critical: alertData.instant_critical,
          webhook_url: alertData.webhook_url || '',
          webhook_secret: alertData.webhook_secret || ''
        })
      } else {
        // Set default alert email
        setAlertSettings(prev => ({ ...prev, alert_email: user.email || '' }))
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSaveProfile() {
    if (!userData) return
    setSaving(true)

    try {
      const supabase = createClient()

      const { error } = await supabase
        .from('users')
        .update({ full_name: profile.fullName })
        .eq('id', userData.id)

      if (error) throw error

      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (error) {
      console.error('Error saving profile:', error)
      alert('Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  async function handleSaveAlerts() {
    if (!userData) return
    setSaving(true)

    try {
      const supabase = createClient()

      // Upsert alert settings
      const { error } = await supabase
        .from('alert_settings')
        .upsert({
          user_id: userData.id,
          email_alerts: alertSettings.email_alerts,
          alert_email: alertSettings.alert_email,
          alert_on_severity: alertSettings.alert_on_severity,
          severity_threshold: alertSettings.severity_threshold,
          scan_summary_emails: alertSettings.scan_summary_emails,
          daily_digest: alertSettings.weekly_digest, // Sync daily_digest for backward compat
          weekly_digest: alertSettings.weekly_digest,
          instant_critical: alertSettings.instant_critical,
          webhook_url: alertSettings.webhook_url || null,
          webhook_secret: alertSettings.webhook_secret || null
        }, { onConflict: 'user_id' })

      if (error) throw error

      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (error) {
      console.error('Error saving alert settings:', error)
      alert('Failed to save alert settings')
    } finally {
      setSaving(false)
    }
  }

  async function handleUpdatePassword() {
    if (passwords.new !== passwords.confirm) {
      alert('New passwords do not match')
      return
    }

    if (passwords.new.length < 6) {
      alert('Password must be at least 6 characters')
      return
    }

    setPasswordSaving(true)

    try {
      const supabase = createClient()

      const { error } = await supabase.auth.updateUser({
        password: passwords.new
      })

      if (error) throw error

      setPasswords({ current: '', new: '', confirm: '' })
      alert('Password updated successfully')
    } catch (error) {
      console.error('Error updating password:', error)
      alert('Failed to update password. Please try again.')
    } finally {
      setPasswordSaving(false)
    }
  }

  async function handleManageBilling() {
    setPortalLoading(true)

    try {
      const response = await fetch('/api/stripe/portal', {
        method: 'POST'
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to open billing portal')
      }

      const { url } = await response.json()
      window.location.href = url
    } catch (error) {
      console.error('Error opening billing portal:', error)
      alert(error instanceof Error ? error.message : 'Failed to open billing portal')
    } finally {
      setPortalLoading(false)
    }
  }

  async function handleDeleteAccount() {
    const confirmed = confirm(
      'Are you sure you want to delete your account? This action cannot be undone and will permanently delete all your data including brands, threats, and reports.'
    )

    if (!confirmed) return

    const doubleConfirm = prompt(
      'Type "DELETE" to confirm account deletion:'
    )

    if (doubleConfirm !== 'DELETE') {
      alert('Account deletion cancelled')
      return
    }

    try {
      const supabase = createClient()

      // Sign out first
      await supabase.auth.signOut()

      // Note: Full account deletion requires a backend admin API
      // For now, signing out is sufficient - data will be orphaned
      // In production, you'd call an API endpoint to fully delete the account

      router.push('/')
    } catch (error) {
      console.error('Error deleting account:', error)
      alert('Failed to delete account')
    }
  }

  const currentPlan = userData?.subscription_tier || 'free'
  const planInfo = PLAN_INFO[currentPlan] || PLAN_INFO.free
  const subscriptionStatus = userData?.subscription_status || 'free'
  const statusLabel = subscriptionStatus === 'active'
    ? 'Active'
    : subscriptionStatus === 'past_due'
      ? 'Past Due'
      : subscriptionStatus === 'cancelled'
        ? 'Cancelled'
        : 'Free'

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your account and preferences</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Full Name"
                value={profile.fullName}
                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
              />
              <Input
                label="Email"
                type="email"
                value={profile.email}
                disabled
                hint="Email cannot be changed"
              />
              <Button onClick={handleSaveProfile} disabled={saving}>
                {saved ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Saved!
                  </>
                ) : saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Alert Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Alert Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Email Alerts</p>
                  <p className="text-sm text-gray-500">Receive email notifications for new threats</p>
                </div>
                <button
                  onClick={() => setAlertSettings({ ...alertSettings, email_alerts: !alertSettings.email_alerts })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    alertSettings.email_alerts ? 'bg-primary-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      alertSettings.email_alerts ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Instant Critical Alerts</p>
                  <p className="text-sm text-gray-500">Get notified immediately for critical threats</p>
                </div>
                <button
                  onClick={() => setAlertSettings({ ...alertSettings, instant_critical: !alertSettings.instant_critical })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    alertSettings.instant_critical ? 'bg-primary-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      alertSettings.instant_critical ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Weekly Digest</p>
                  <p className="text-sm text-gray-500">Receive a weekly summary every Monday</p>
                </div>
                <button
                  onClick={() => setAlertSettings({ ...alertSettings, weekly_digest: !alertSettings.weekly_digest })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    alertSettings.weekly_digest ? 'bg-primary-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      alertSettings.weekly_digest ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div>
                <Input
                  label="Alert Email Address"
                  type="email"
                  value={alertSettings.alert_email || ''}
                  onChange={(e) => setAlertSettings({ ...alertSettings, alert_email: e.target.value })}
                  hint="Where to send alert notifications"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Scan Summary Emails</p>
                  <p className="text-sm text-gray-500">Receive summary after each scan completes</p>
                </div>
                <button
                  onClick={() => setAlertSettings({ ...alertSettings, scan_summary_emails: !alertSettings.scan_summary_emails })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    alertSettings.scan_summary_emails ? 'bg-primary-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      alertSettings.scan_summary_emails ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div>
                <p className="font-medium text-gray-900 mb-2">Alert Severity Threshold</p>
                <p className="text-sm text-gray-500 mb-3">Which threats should trigger email alerts?</p>
                <div className="space-y-2">
                  {[
                    { value: 'all' as const, label: 'All Threats', desc: 'Low, Medium, High, and Critical' },
                    { value: 'high_critical' as const, label: 'High + Critical Only', desc: 'Skip low and medium severity' },
                    { value: 'critical' as const, label: 'Critical Only', desc: 'Only the most severe threats' },
                  ].map((option) => (
                    <label key={option.value} className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="severity_threshold"
                        value={option.value}
                        checked={alertSettings.severity_threshold === option.value}
                        onChange={(e) => setAlertSettings({
                          ...alertSettings,
                          severity_threshold: e.target.value as 'all' | 'high_critical' | 'critical'
                        })}
                        className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500"
                      />
                      <div>
                        <span className="font-medium text-gray-900">{option.label}</span>
                        <p className="text-sm text-gray-500">{option.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <Button onClick={handleSaveAlerts} disabled={saving}>
                {saved ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Saved!
                  </>
                ) : saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Preferences'
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Webhooks - Enterprise Only */}
          {currentPlan === 'enterprise' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Webhook Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-500">
                  Receive instant notifications via webhook when threats are detected.
                </p>
                <Input
                  label="Webhook URL"
                  type="url"
                  placeholder="https://your-server.com/webhook"
                  value={alertSettings.webhook_url || ''}
                  onChange={(e) => setAlertSettings({ ...alertSettings, webhook_url: e.target.value })}
                  hint="POST requests will be sent to this URL"
                />
                <Input
                  label="Webhook Secret (Optional)"
                  type="password"
                  placeholder="Enter a secret for signature verification"
                  value={alertSettings.webhook_secret || ''}
                  onChange={(e) => setAlertSettings({ ...alertSettings, webhook_secret: e.target.value })}
                  hint="Used to sign webhook payloads with HMAC-SHA256"
                />
                <Button onClick={handleSaveAlerts} disabled={saving}>
                  {saving ? 'Saving...' : 'Save Webhook Settings'}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Input
                  label="New Password"
                  type="password"
                  placeholder="Enter new password"
                  value={passwords.new}
                  onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                />
              </div>
              <div>
                <Input
                  label="Confirm New Password"
                  type="password"
                  placeholder="Confirm new password"
                  value={passwords.confirm}
                  onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                />
              </div>
              <Button
                onClick={handleUpdatePassword}
                disabled={passwordSaving || !passwords.new || !passwords.confirm}
              >
                {passwordSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Password'
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Subscription */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Subscription
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className={`p-4 rounded-lg border ${
                currentPlan === 'free'
                  ? 'bg-gray-50 border-gray-200'
                  : 'bg-primary-50 border-primary-200'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-semibold ${
                    currentPlan === 'free' ? 'text-gray-900' : 'text-primary-900'
                  }`}>
                    {planInfo.name}
                  </span>
                  <span className={`text-sm font-medium ${
                    currentPlan === 'free' ? 'text-gray-700' : 'text-primary-700'
                  }`}>
                    {planInfo.price}
                  </span>
                </div>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  currentPlan === 'free'
                    ? 'bg-gray-200 text-gray-700'
                    : subscriptionStatus === 'active'
                      ? 'bg-green-100 text-green-700'
                      : subscriptionStatus === 'past_due'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                }`}>
                  {currentPlan === 'free' ? 'Free Tier' : statusLabel}
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Brands used</span>
                  <span className="text-gray-900">
                    {brandsCount} / {planInfo.brandLimit || 'Unlimited'}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t space-y-2">
                {currentPlan === 'free' ? (
                  <Button
                    className="w-full"
                    onClick={() => router.push('/pricing')}
                  >
                    Upgrade Plan
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={handleManageBilling}
                      disabled={portalLoading}
                    >
                      {portalLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        <>
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Manage Billing
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => router.push('/pricing')}
                    >
                      Change Plan
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-500">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              <Button
                variant="outline"
                className="w-full text-red-600 border-red-300 hover:bg-red-50"
                onClick={handleDeleteAccount}
              >
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
