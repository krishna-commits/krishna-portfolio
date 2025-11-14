import { NextRequest, NextResponse } from 'next/server'
import moment from 'moment'

const GITHUB_API_BASE = 'https://api.github.com'
const OWNER = 'krishna-commits'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface ContributionDay {
  date: string
  count: number
  level: 0 | 1 | 2 | 3 | 4
}

function getContributionLevel(count: number): 0 | 1 | 2 | 3 | 4 {
  if (count === 0) return 0
  if (count <= 3) return 1
  if (count <= 6) return 2
  if (count <= 10) return 3
  return 4
}

async function fetchGitHubData(token: string, endpoint: string) {
  try {
    const url = `${GITHUB_API_BASE}${endpoint}`
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`[GitHub API] Error ${response.status} for ${endpoint}:`, errorText)
      return { error: true, status: response.status, message: errorText }
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error(`[GitHub API] Exception fetching ${endpoint}:`, error)
    return { error: true, message: error instanceof Error ? error.message : 'Unknown error' }
  }
}

async function fetchAllCommits(token: string) {
  try {
    // Fetch all repositories
    const reposResponse = await fetchGitHubData(token, `/users/${OWNER}/repos?sort=updated&per_page=100`)
    
    if (reposResponse?.error || !Array.isArray(reposResponse)) {
      console.error('[GitHub API] Error fetching repositories:', reposResponse)
      return []
    }

    const repos = reposResponse.filter((repo: any) => !repo.fork && !repo.archived)
    console.log(`[GitHub API] Found ${repos.length} repositories`)

    // Fetch commits from last 371 days (53 weeks)
    const endDate = moment()
    const startDate = moment(endDate).subtract(371, 'days')
    
    // Create a map to store commits per day
    const commitsByDay = new Map<string, number>()
    
    // Initialize all days with 0
    for (let i = 0; i < 371; i++) {
      const date = moment(startDate).add(i, 'days').format('YYYY-MM-DD')
      commitsByDay.set(date, 0)
    }

    // Fetch commits from each repository
    const commitsPromises = repos.map(async (repo: any) => {
      if (!repo || !repo.name) return []
      
      try {
        // Fetch commits since startDate
        const since = startDate.toISOString()
        const commitsData = await fetchGitHubData(
          token,
          `/repos/${OWNER}/${repo.name}/commits?since=${since}&per_page=100`
        )
        
        if (commitsData?.error || !Array.isArray(commitsData)) {
          return []
        }

        return commitsData.map((commit: any) => {
          const commitDate = moment(commit.commit?.author?.date || commit.commit?.committer?.date)
          return commitDate.format('YYYY-MM-DD')
        })
      } catch (error) {
        console.warn(`[GitHub API] Error fetching commits for ${repo.name}:`, error)
        return []
      }
    })

    const allCommitDates = (await Promise.all(commitsPromises)).flat()
    
    // Count commits per day
    allCommitDates.forEach((date: string) => {
      if (commitsByDay.has(date)) {
        commitsByDay.set(date, (commitsByDay.get(date) || 0) + 1)
      }
    })

    // Convert to array
    const contributions: ContributionDay[] = Array.from(commitsByDay.entries()).map(([date, count]) => ({
      date,
      count,
      level: getContributionLevel(count),
    }))

    return contributions
  } catch (error) {
    console.error('[GitHub API] Exception in fetchAllCommits:', error)
    return []
  }
}

function calculateStreaks(contributions: ContributionDay[]): { longestStreak: number; currentStreak: number } {
  // Sort contributions by date
  const sorted = [...contributions].sort((a, b) => 
    moment(a.date).valueOf() - moment(b.date).valueOf()
  )

  let longestStreak = 0
  let currentStreak = 0
  let tempStreak = 0
  const today = moment().startOf('day')

  for (let i = 0; i < sorted.length; i++) {
    const day = sorted[i]
    const date = moment(day.date)
    
    if (day.count > 0) {
      tempStreak++
      
      // Check if this is today or yesterday for current streak
      if (date.isSame(today, 'day') || date.isSame(moment(today).subtract(1, 'day'), 'day')) {
        currentStreak = tempStreak
      }
    } else {
      longestStreak = Math.max(longestStreak, tempStreak)
      tempStreak = 0
    }
  }

  longestStreak = Math.max(longestStreak, tempStreak)

  return { longestStreak, currentStreak }
}

export async function GET(request: NextRequest) {
  try {
    const token = process.env.GITHUB_ACCESS_TOKEN

    if (!token) {
      console.error('[GitHub API] GITHUB_ACCESS_TOKEN is not set')
      return NextResponse.json({
        error: 'GITHUB_ACCESS_TOKEN not configured',
        contributions: [],
        totalContributions: 0,
        longestStreak: 0,
        currentStreak: 0,
        timestamp: new Date().toISOString(),
      })
    }

    console.log(`[GitHub API] Fetching contributions for user: ${OWNER}`)

    // Fetch all commits
    const contributions = await fetchAllCommits(token)
    
    if (contributions.length === 0) {
      return NextResponse.json({
        contributions: [],
        totalContributions: 0,
        longestStreak: 0,
        currentStreak: 0,
        timestamp: new Date().toISOString(),
      })
    }

    // Calculate stats
    const totalContributions = contributions.reduce((sum, day) => sum + day.count, 0)
    const { longestStreak, currentStreak } = calculateStreaks(contributions)

    console.log(`[GitHub API] Found ${totalContributions} total contributions`)

    return NextResponse.json({
      contributions,
      totalContributions,
      longestStreak,
      currentStreak,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('[GitHub API] Exception in GET handler:', error)
    return NextResponse.json({
      error: 'Internal server error',
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      contributions: [],
      totalContributions: 0,
      longestStreak: 0,
      currentStreak: 0,
      timestamp: new Date().toISOString(),
    })
  }
}

