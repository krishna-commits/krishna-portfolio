'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import useSWR from 'swr'
import { Activity, Calendar, TrendingUp, Clock } from 'lucide-react'
import { cn } from 'app/theme/lib/utils'
import Link from 'next/link'
import { siteConfig } from 'config/site'
import moment from 'moment'
import { GitHubMetricsSkeleton } from 'app/components/skeleton-loaders'

interface ContributionDay {
  date: string
  count: number
  level: 0 | 1 | 2 | 3 | 4
}

interface ContributionData {
  contributions: ContributionDay[]
  totalContributions: number
  longestStreak: number
  currentStreak: number
  timestamp: string
}

const fetcher = async (url: string) => {
  const res = await fetch(url)
  const data = await res.json()
  
  if (!res.ok || data.error) {
    throw new Error(data.error || `HTTP error! status: ${res.status}`)
  }
  
  return data
}

function generateContributionsGrid(contributions: ContributionDay[]): ContributionDay[][] {
  // Create a map of date to contribution
  const contributionMap = new Map<string, ContributionDay>()
  contributions.forEach(contrib => {
    contributionMap.set(contrib.date, contrib)
  })

  // Generate last 53 weeks (371 days)
  const grid: ContributionDay[][] = []
  const today = moment().startOf('day')
  const startDate = moment(today).subtract(371, 'days')
  
  // Initialize all days
  const allDays: ContributionDay[] = []
  for (let i = 0; i < 371; i++) {
    const date = moment(startDate).add(i, 'days')
    const dateStr = date.format('YYYY-MM-DD')
    const existing = contributionMap.get(dateStr)
    
    if (existing) {
      allDays.push(existing)
    } else {
      allDays.push({
        date: dateStr,
        count: 0,
        level: 0,
      })
    }
  }

  // Group by weeks (53 weeks)
  for (let week = 0; week < 53; week++) {
    const weekDays: ContributionDay[] = []
    for (let day = 0; day < 7; day++) {
      const index = week * 7 + day
      if (index < allDays.length) {
        weekDays.push(allDays[index])
      }
    }
    if (weekDays.length > 0) {
      grid.push(weekDays)
    }
  }

  return grid
}

function getContributionLevel(count: number): 0 | 1 | 2 | 3 | 4 {
  if (count === 0) return 0
  if (count <= 3) return 1
  if (count <= 6) return 2
  if (count <= 10) return 3
  return 4
}

function getContributionColor(level: number, isDark: boolean = false): string {
  const colors = {
    light: {
      0: 'bg-slate-100 dark:bg-slate-800',
      1: 'bg-green-200 dark:bg-green-900/40',
      2: 'bg-green-400 dark:bg-green-800/60',
      3: 'bg-green-600 dark:bg-green-700',
      4: 'bg-green-800 dark:bg-green-600',
    },
    dark: {
      0: 'bg-slate-800',
      1: 'bg-green-900/40',
      2: 'bg-green-800/60',
      3: 'bg-green-700',
      4: 'bg-green-600',
    }
  }
  const palette = isDark ? colors.dark : colors.light
  return palette[level as keyof typeof palette] || palette[0]
}

export function GitHubContributionGraph() {
  const [hoveredDay, setHoveredDay] = useState<ContributionDay | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
  const [isDark, setIsDark] = useState(false)
  
  const { data, error, isLoading, mutate } = useSWR<ContributionData>(
    '/api/github/contributions',
    fetcher,
    {
      refreshInterval: 300000, // Refresh every 5 minutes
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  )

  useEffect(() => {
    // Check if dark mode is enabled
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains('dark'))
    }
    checkDarkMode()
    
    // Listen for dark mode changes
    const observer = new MutationObserver(checkDarkMode)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })
    
    return () => observer.disconnect()
  }, [])

  const contributionsGrid = useMemo(() => {
    if (!data?.contributions) return []
    return generateContributionsGrid(data.contributions)
  }, [data])

  const weekLabels = useMemo(() => {
    const labels: string[] = []
    const today = moment()
    for (let i = 52; i >= 0; i--) {
      const weekStart = moment(today).subtract(i * 7, 'days')
      if (i % 4 === 0 || i === 52) {
        labels.push(weekStart.format('MMM'))
      } else {
        labels.push('')
      }
    }
    return labels
  }, [])

  const dayLabels = ['Mon', 'Wed', 'Fri']

  if (isLoading) {
    return (
      <section className="relative w-full">
        <GitHubMetricsSkeleton />
      </section>
    )
  }

  if (error || !data) {
    return (
      <section className="relative w-full">
        <div className="p-8 rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/40">
              <Activity className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50 mb-1">
                GitHub Contributions Unavailable
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                {error?.message || 'Unable to load GitHub contributions. Please check the server logs.'}
              </p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative w-full">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6"
      >
        <div className="space-y-2">
          <div className="inline-flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-500 shadow-md">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                GitHub Contributions
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-500 mt-1 flex items-center gap-2">
                <Clock className="h-3 w-3" />
                Last updated: {data.timestamp ? moment(data.timestamp).fromNow() : 'Never'}
              </p>
            </div>
          </div>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
            {data.totalContributions.toLocaleString()} contributions in the last year
          </p>
        </div>
        <Link
          href={siteConfig.links.github}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
        >
          View GitHub
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </Link>
      </motion.div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
          className="relative overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-blue-50 to-sky-50 dark:from-blue-950/20 dark:to-sky-950/20 p-4 shadow-sm hover:shadow-md transition-all duration-300"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-sky-500" />
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Total Contributions</p>
              <p className="text-2xl font-bold bg-gradient-to-br from-blue-400 to-sky-500 bg-clip-text text-transparent">
                {data.totalContributions.toLocaleString()}
              </p>
            </div>
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-400 to-sky-500 shadow-sm">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="relative overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950/20 dark:to-amber-950/20 p-4 shadow-sm hover:shadow-md transition-all duration-300"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600" />
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Longest Streak</p>
              <p className="text-2xl font-bold bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-600 bg-clip-text text-transparent">
                {data.longestStreak} days
              </p>
            </div>
            <div className="p-2 rounded-lg bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-600 shadow-sm">
              <Calendar className="h-5 w-5 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="relative overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 p-4 shadow-sm hover:shadow-md transition-all duration-300"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-emerald-500" />
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Current Streak</p>
              <p className="text-2xl font-bold bg-gradient-to-br from-green-400 to-emerald-500 bg-clip-text text-transparent">
                {data.currentStreak} days
              </p>
            </div>
            <div className="p-2 rounded-lg bg-gradient-to-br from-green-400 to-emerald-500 shadow-sm">
              <Activity className="h-5 w-5 text-white" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Contribution Graph */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm"
      >
        {/* Tooltip */}
        {hoveredDay && (
          <div
            className="fixed z-50 px-3 py-2 text-xs font-medium text-white bg-slate-900 dark:bg-slate-800 rounded-lg shadow-lg pointer-events-none"
            style={{
              left: `${tooltipPosition.x}px`,
              top: `${tooltipPosition.y}px`,
              transform: 'translate(-50%, -100%)',
              marginTop: '-8px',
            }}
          >
            <div className="mb-1">
              <strong>{hoveredDay.count}</strong> {hoveredDay.count === 1 ? 'contribution' : 'contributions'}
            </div>
            <div className="text-slate-400">
              {moment(hoveredDay.date).format('MMM D, YYYY')}
            </div>
          </div>
        )}

        {/* Graph Container */}
        <div className="flex gap-2">
          {/* Day Labels */}
          <div className="flex flex-col gap-1 pt-8">
            {dayLabels.map((label, idx) => {
              const dayIndex = idx === 0 ? 0 : idx === 1 ? 2 : 4
              return (
                <div
                  key={label}
                  className="text-xs text-slate-500 dark:text-slate-400 font-medium h-3 flex items-center"
                  style={{ height: '12px' }}
                >
                  {idx === 0 || idx === 2 || idx === 4 ? label : ''}
                </div>
              )
            })}
          </div>

          {/* Contribution Grid */}
          <div className="flex-1">
            {/* Week Labels */}
            <div className="flex gap-1 mb-2">
              {weekLabels.map((label, idx) => (
                <div
                  key={idx}
                  className="text-xs text-slate-500 dark:text-slate-400 font-medium text-center"
                  style={{ width: '12px' }}
                >
                  {label}
                </div>
              ))}
            </div>

            {/* Grid */}
            <div className="flex gap-1">
              {contributionsGrid.map((week, weekIdx) => (
                <div key={weekIdx} className="flex flex-col gap-1">
                  {week.map((day, dayIdx) => {
                    const contributionDate = moment(day.date)
                    const isToday = contributionDate.isSame(moment(), 'day')
                    
                    return (
                      <motion.div
                        key={`${weekIdx}-${dayIdx}`}
                        className={cn(
                          'w-3 h-3 rounded-sm transition-all duration-200 cursor-pointer',
                          getContributionColor(day.level, isDark),
                          'hover:ring-2 hover:ring-slate-400 dark:hover:ring-slate-600',
                          isToday && 'ring-2 ring-blue-500 dark:ring-blue-400'
                        )}
                        onMouseEnter={(e) => {
                          setHoveredDay(day)
                          const rect = e.currentTarget.getBoundingClientRect()
                          setTooltipPosition({
                            x: rect.left + rect.width / 2,
                            y: rect.top,
                          })
                        }}
                        onMouseLeave={() => setHoveredDay(null)}
                        whileHover={{ scale: 1.2 }}
                        title={`${day.count} contributions on ${moment(day.date).format('MMM D, YYYY')}`}
                      />
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-end gap-2 mt-4 text-xs text-slate-500 dark:text-slate-400">
          <span>Less</span>
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className={cn('w-3 h-3 rounded-sm', getContributionColor(level, isDark))}
              />
            ))}
          </div>
          <span>More</span>
        </div>
      </motion.div>
    </section>
  )
}

