'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Building2,
  AlertTriangle,
  FileText,
  Settings,
  Shield,
  LogOut,
  Menu,
  X
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { isAllowedAdminEmail } from '@/lib/admin/allowed-admin'
import { NotificationDropdown } from '@/components/NotificationDropdown'
import { ThemeToggle } from '@/components/theme-toggle'
import { Logo } from '@/components/Logo'
import { ToastProvider } from '@/components/toast-provider'
import { SectionErrorBoundary } from '@/components/error-boundary'

const baseNavigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Brands', href: '/dashboard/brands', icon: Building2 },
  { name: 'Threats', href: '/dashboard/threats', icon: AlertTriangle },
  { name: 'Reports', href: '/dashboard/reports', icon: FileText },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showAdmin, setShowAdmin] = useState(false)

  useEffect(() => {
    ;(async () => {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        setShowAdmin(isAllowedAdminEmail(user?.email))
      } catch {
        setShowAdmin(false)
      }
    })()
  }, [])

  const navigation = useMemo(() => {
    if (!showAdmin) return baseNavigation
    return [
      ...baseNavigation,
      { name: 'Admin', href: '/dashboard/admin/model-usage', icon: Shield },
    ]
  }, [showAdmin])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <ToastProvider>
      <div className="min-h-screen bg-background">
        {/* Full-width header border line - spans both sidebar and content */}
        <div className="fixed top-16 left-0 right-0 h-px bg-border z-40 hidden lg:block" />

        {/* Mobile sidebar backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-foreground/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={cn(
            'fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-200 ease-in-out lg:translate-x-0',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="flex items-center justify-between h-16 px-4">
              <Link href="/dashboard" className="flex items-center">
                <Logo mode="dark" size="lg" />
              </Link>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-muted-foreground hover:bg-accent'
                    )}
                  >
                    <item.icon className={cn('h-5 w-5 mr-3', isActive ? 'text-primary-600' : 'text-muted-foreground')} />
                    {item.name}
                  </Link>
                )
              })}
            </nav>

            {/* User section */}
            <div className="p-3 border-t border-border">
              <button
                onClick={handleSignOut}
                className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent rounded-lg transition-colors"
              >
                <LogOut className="h-5 w-5 mr-3 text-muted-foreground" />
                Sign out
              </button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="lg:pl-64">
          {/* Top bar */}
          <header className="sticky top-0 z-30 bg-card">
            <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-muted-foreground hover:text-foreground"
              >
                <Menu className="h-6 w-6" />
              </button>

              <div className="flex-1" />

              <div className="flex items-center space-x-4">
                <ThemeToggle />
                <NotificationDropdown />
              </div>
            </div>
          </header>

          {/* Page content with error boundary */}
          <main className="p-4 sm:p-6 lg:p-8">
            <SectionErrorBoundary sectionName="Dashboard">
              {children}
            </SectionErrorBoundary>
          </main>
        </div>
      </div>
    </ToastProvider>
  )
}
