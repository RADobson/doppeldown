'use client'

import { useEffect, useState, useRef } from 'react'
import { TrendingUp, Clock, Shield, Users } from 'lucide-react'

interface AnimatedCounterProps {
  end: number
  suffix?: string
  prefix?: string
  duration?: number
}

function AnimatedCounter({ end, suffix = '', prefix = '', duration = 2000 }: AnimatedCounterProps) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.5 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return

    let startTime: number
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      setCount(Math.floor(easeOutQuart * end))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [isVisible, end, duration])

  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  )
}

export default function TrustSignals() {
  const stats = [
    {
      icon: TrendingUp,
      value: 500,
      suffix: '+',
      label: 'Domain variations checked',
      description: 'Per brand scan'
    },
    {
      icon: Clock,
      value: 4,
      suffix: 'min',
      label: 'Median detection time',
      description: 'From registration to alert'
    },
    {
      icon: Shield,
      value: 99,
      suffix: '%',
      label: 'Threat accuracy',
      description: 'AI-powered scoring'
    },
    {
      icon: Users,
      value: 7,
      suffix: '',
      label: 'Social platforms',
      description: 'Monitored continuously'
    }
  ]

  return (
    <section className="py-20 lg:py-28 bg-landing relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-600/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary-600/10 text-primary-400 text-sm font-medium mb-4">
            By the numbers
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-landing-foreground mb-4">
            Trusted by teams who take security seriously
          </h2>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div 
              key={i}
              className="group relative p-8 rounded-2xl bg-landing-elevated border border-landing-border hover:border-primary-500/30 transition-all text-center"
            >
              {/* Glow Effect */}
              <div className="absolute inset-0 rounded-2xl bg-primary-600/5 opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
              
              <div className="relative">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-primary-600/10 flex items-center justify-center mb-4 group-hover:bg-primary-600/20 transition-colors">
                  <stat.icon className="w-7 h-7 text-primary-400" />
                </div>
                
                <div className="text-4xl md:text-5xl font-bold text-landing-foreground mb-2">
                  <AnimatedCounter 
                    end={stat.value} 
                    suffix={stat.suffix}
                  />
                </div>
                
                <div className="text-landing-foreground font-medium mb-1">
                  {stat.label}
                </div>
                <div className="text-landing-muted text-sm">
                  {stat.description}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Trust Bar */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-landing-muted/60">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span className="text-sm">SOC 2 Type II Certified</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span className="text-sm">End-to-end encryption</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm">GDPR Compliant</span>
          </div>
        </div>
      </div>
    </section>
  )
}
