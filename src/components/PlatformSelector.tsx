'use client'

import { useState, useEffect } from 'react'
import { Check } from 'lucide-react'
import { ALL_SOCIAL_PLATFORMS, type SocialPlatform } from '@/lib/tier-limits'

const PLATFORM_INFO: Record<SocialPlatform, { label: string; description: string }> = {
  twitter: { label: 'Twitter/X', description: 'Monitor for impersonation accounts' },
  facebook: { label: 'Facebook', description: 'Check pages and profiles' },
  instagram: { label: 'Instagram', description: 'Scan for fake brand accounts' },
  linkedin: { label: 'LinkedIn', description: 'Company page impersonation' },
  tiktok: { label: 'TikTok', description: 'Short video platform accounts' },
  youtube: { label: 'YouTube', description: 'Channel impersonation' },
  telegram: { label: 'Telegram', description: 'Group and channel monitoring' },
  discord: { label: 'Discord', description: 'Server impersonation detection' },
}

interface PlatformSelectorProps {
  value: SocialPlatform[]
  onChange: (platforms: SocialPlatform[]) => void
  maxPlatforms: number
  disabled?: boolean
}

export function PlatformSelector({
  value,
  onChange,
  maxPlatforms,
  disabled = false,
}: PlatformSelectorProps) {
  const isRadioMode = maxPlatforms === 1
  const selectedCount = value.length

  const handleToggle = (platform: SocialPlatform) => {
    if (disabled) return

    if (isRadioMode) {
      // Radio mode - single selection
      onChange([platform])
      return
    }

    // Checkbox mode
    if (value.includes(platform)) {
      // Remove platform
      onChange(value.filter((p) => p !== platform))
    } else if (selectedCount < maxPlatforms) {
      // Add platform (if under limit)
      onChange([...value, platform])
    }
  }

  const isSelected = (platform: SocialPlatform) => value.includes(platform)
  const isDisabled = (platform: SocialPlatform) => {
    if (disabled) return true
    if (isRadioMode) return false
    // Disable unselected platforms if at limit
    return !isSelected(platform) && selectedCount >= maxPlatforms
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-foreground">
          {isRadioMode
            ? 'Select 1 social platform to monitor'
            : `Select up to ${maxPlatforms} platforms to monitor`}
        </p>
        {!isRadioMode && (
          <span className="text-xs text-muted-foreground">
            {selectedCount}/{maxPlatforms} selected
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {ALL_SOCIAL_PLATFORMS.map((platform) => {
          const info = PLATFORM_INFO[platform]
          const selected = isSelected(platform)
          const platformDisabled = isDisabled(platform)

          return (
            <button
              key={platform}
              type="button"
              onClick={() => handleToggle(platform)}
              disabled={platformDisabled}
              className={`
                relative flex flex-col items-start p-3 rounded-lg border text-left transition-all
                ${
                  selected
                    ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-500'
                    : platformDisabled
                    ? 'border-border bg-muted cursor-not-allowed opacity-50'
                    : 'border-border hover:border-accent-foreground hover:bg-accent cursor-pointer'
                }
              `}
            >
              {selected && (
                <div className="absolute top-2 right-2">
                  <Check className="h-4 w-4 text-primary-600" />
                </div>
              )}
              <span className="text-sm font-medium text-foreground">{info.label}</span>
              <span className="text-xs text-muted-foreground line-clamp-1">{info.description}</span>
            </button>
          )
        })}
      </div>

      {maxPlatforms < 8 && (
        <p className="text-xs text-muted-foreground">
          Upgrade your plan to monitor more social platforms.
        </p>
      )}
    </div>
  )
}
