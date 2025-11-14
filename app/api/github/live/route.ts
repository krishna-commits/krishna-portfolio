import { NextRequest, NextResponse } from 'next/server'

const GITHUB_API_BASE = 'https://api.github.com'
const OWNER = 'krishna-commits'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface GitHubCommit {
  sha: string
  commit: {
    message: string
    author: {
      name: string
      date: string
    }
  }
  author: {
    login: string
    avatar_url: string
  }
  repository: {
    name: string
    full_name: string
  }
}

interface GitHubPullRequest {
  id: number
  number: number
  title: string
  state: string
  created_at: string
  updated_at: string
  user: {
    login: string
    avatar_url: string
  }
  head: {
    ref: string
  }
  base: {
    ref: string
  }
  repository: {
    name: string
    full_name: string
  }
}

interface GitHubDeployment {
  id: number
  environment: string
  state: string
  created_at: string
  updated_at: string
  repository: {
    name: string
    full_name: string
  }
  creator: {
    login: string
    avatar_url: string
  }
}

async function fetchGitHubData(token: string, endpoint: string) {
  try {
    const url = `${GITHUB_API_BASE}${endpoint}`
    console.log(`[GitHub API] Fetching: ${endpoint}`)
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      next: { revalidate: 30 }, // Revalidate every 30 seconds
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`[GitHub API] Error ${response.status} ${response.statusText} for ${endpoint}:`, errorText)
      
      // Return error details for debugging
      return { 
        error: true, 
        status: response.status, 
        statusText: response.statusText,
        message: errorText 
      }
    }

    const data = await response.json()
    console.log(`[GitHub API] Success for ${endpoint}:`, Array.isArray(data) ? `${data.length} items` : 'data received')
    return data
  } catch (error) {
    console.error(`[GitHub API] Exception fetching ${endpoint}:`, error)
    return { 
      error: true, 
      message: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = process.env.GITHUB_ACCESS_TOKEN

    if (!token) {
      console.error('[GitHub API] GITHUB_ACCESS_TOKEN is not set in environment variables')
      // Return data with error flag for debugging
      return NextResponse.json({
        error: 'GITHUB_ACCESS_TOKEN not configured',
        stats: {
          totalCommits: 0,
          totalPullRequests: 0,
          totalDeployments: 0,
          activeRepos: 0,
          lastUpdated: new Date().toISOString(),
        },
        commits: [],
        pullRequests: [],
        deployments: [],
        timestamp: new Date().toISOString(),
      })
    }

    console.log(`[GitHub API] Token found, fetching data for user: ${OWNER}`)

    // Fetch recent commits from all repositories
    const reposResponse = await fetchGitHubData(token, `/users/${OWNER}/repos?sort=updated&per_page=10`)
    
    // Check if response has error
    if (reposResponse && typeof reposResponse === 'object' && 'error' in reposResponse) {
      console.error('[GitHub API] Error fetching repositories:', reposResponse)
      return NextResponse.json({
        error: reposResponse.message || 'Failed to fetch repositories',
        errorDetails: reposResponse,
        stats: {
          totalCommits: 0,
          totalPullRequests: 0,
          totalDeployments: 0,
          activeRepos: 0,
          lastUpdated: new Date().toISOString(),
        },
        commits: [],
        pullRequests: [],
        deployments: [],
        timestamp: new Date().toISOString(),
      })
    }
    
    if (!reposResponse || !Array.isArray(reposResponse)) {
      console.error('[GitHub API] Invalid repositories response:', reposResponse)
      return NextResponse.json({
        error: 'Invalid repositories response',
        stats: {
          totalCommits: 0,
          totalPullRequests: 0,
          totalDeployments: 0,
          activeRepos: 0,
          lastUpdated: new Date().toISOString(),
        },
        commits: [],
        pullRequests: [],
        deployments: [],
        timestamp: new Date().toISOString(),
      })
    }

    console.log(`[GitHub API] Found ${reposResponse.length} repositories`)

    const repos = reposResponse.slice(0, 5) // Top 5 most recently updated repos
    console.log(`[GitHub API] Processing ${repos.length} repositories for commits`)
    
    // Fetch recent commits from each repository
    const commitsPromises = repos.map(async (repo: any) => {
      if (!repo || !repo.name) {
        console.warn('[GitHub API] Skipping invalid repo:', repo)
        return []
      }
      
      const commitsData = await fetchGitHubData(token, `/repos/${OWNER}/${repo.name}/commits?per_page=5`)
      
      // Check if response has error
      if (commitsData && typeof commitsData === 'object' && 'error' in commitsData) {
        console.warn(`[GitHub API] Error fetching commits for ${repo.name}:`, commitsData)
        return []
      }
      
      if (!commitsData || !Array.isArray(commitsData)) {
        console.warn(`[GitHub API] Invalid commits data for ${repo.name}:`, commitsData)
        return []
      }
      
      return commitsData.map((commit: any) => ({
        sha: commit.sha,
        message: commit.commit?.message || 'No message',
        author: {
          name: commit.commit?.author?.name || 'Unknown',
          login: commit.author?.login || commit.commit?.author?.name || 'unknown',
          avatar_url: commit.author?.avatar_url || '',
          date: commit.commit?.author?.date || new Date().toISOString(),
        },
        repository: {
          name: repo.name,
          full_name: repo.full_name,
          url: repo.html_url,
        },
        url: commit.html_url || `https://github.com/${OWNER}/${repo.name}`,
      }))
    })

    const commits = (await Promise.all(commitsPromises)).flat().filter(Boolean).slice(0, 10)
    console.log(`[GitHub API] Found ${commits.length} commits`)

    // Fetch open pull requests
    const pullRequestsData = await fetchGitHubData(token, `/search/issues?q=author:${OWNER}+type:pr+state:open&per_page=10`)
    
    // Check if response has error
    if (pullRequestsData && typeof pullRequestsData === 'object' && 'error' in pullRequestsData) {
      console.warn('[GitHub API] Error fetching pull requests:', pullRequestsData)
    }
    
    const pullRequests = (pullRequestsData?.items && Array.isArray(pullRequestsData.items))
      ? pullRequestsData.items.map((pr: any) => ({
          id: pr.id,
          number: pr.number,
          title: pr.title || 'No title',
          state: pr.state || 'unknown',
          created_at: pr.created_at || new Date().toISOString(),
          updated_at: pr.updated_at || new Date().toISOString(),
          user: {
            login: pr.user?.login || 'unknown',
            avatar_url: pr.user?.avatar_url || '',
          },
          head: {
            ref: pr.head?.ref || 'unknown',
          },
          base: {
            ref: pr.base?.ref || 'main',
          },
          repository: {
            name: pr.repository?.name || 'unknown',
            full_name: pr.repository?.full_name || 'unknown',
          },
          url: pr.html_url || '#',
        }))
      : []
    console.log(`[GitHub API] Found ${pullRequests.length} pull requests`)

    // Fetch deployments (from GitHub Actions)
    const deploymentsPromises = repos.map(async (repo: any) => {
      if (!repo || !repo.name) return []
      
      const deploymentsData = await fetchGitHubData(token, `/repos/${OWNER}/${repo.name}/deployments?per_page=5`)
      
      // Check if response has error
      if (deploymentsData && typeof deploymentsData === 'object' && 'error' in deploymentsData) {
        console.warn(`[GitHub API] Error fetching deployments for ${repo.name}:`, deploymentsData)
        return []
      }
      
      if (!deploymentsData || !Array.isArray(deploymentsData)) {
        // Deployments might not exist for all repos, so this is not necessarily an error
        return []
      }
      
      return deploymentsData.map((deployment: any) => ({
        id: deployment.id,
        environment: deployment.environment || 'production',
        state: deployment.state || 'unknown',
        created_at: deployment.created_at || new Date().toISOString(),
        updated_at: deployment.updated_at || new Date().toISOString(),
        repository: {
          name: repo.name,
          full_name: repo.full_name,
        },
        creator: {
          login: deployment.creator?.login || 'unknown',
          avatar_url: deployment.creator?.avatar_url || '',
        },
        url: `https://github.com/${OWNER}/${repo.name}/deployments`,
      }))
    })

    const deployments = (await Promise.all(deploymentsPromises)).flat().filter(Boolean).slice(0, 10)
    console.log(`[GitHub API] Found ${deployments.length} deployments`)

    // Calculate stats
    const stats = {
      totalCommits: commits.length,
      totalPullRequests: pullRequests.length,
      totalDeployments: deployments.length,
      activeRepos: repos.length,
      lastUpdated: new Date().toISOString(),
    }

    return NextResponse.json({
      stats,
      commits,
      pullRequests,
      deployments,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('[GitHub API] Exception in GET handler:', error)
    // Return error details for debugging
    return NextResponse.json({
      error: 'Internal server error',
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      stats: {
        totalCommits: 0,
        totalPullRequests: 0,
        totalDeployments: 0,
        activeRepos: 0,
        lastUpdated: new Date().toISOString(),
      },
      commits: [],
      pullRequests: [],
      deployments: [],
      timestamp: new Date().toISOString(),
    })
  }
}

