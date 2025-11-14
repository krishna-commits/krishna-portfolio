import { NextRequest, NextResponse } from 'next/server'
import { allResearchCores, allProjects, allBlogPosts } from 'contentlayer/generated'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface SearchResult {
  type: 'research' | 'project' | 'blog'
  title: string
  description?: string
  url: string
  content?: string
  tags?: string[]
  date?: string
  score?: number
}

// Simple full-text search implementation
function searchContent(query: string, content: string): number {
  const lowerQuery = query.toLowerCase()
  const lowerContent = content.toLowerCase()
  
  // Exact match
  if (lowerContent.includes(lowerQuery)) {
    return 10
  }
  
  // Word match
  const queryWords = lowerQuery.split(/\s+/)
  const contentWords = lowerContent.split(/\s+/)
  const matchedWords = queryWords.filter(word => 
    contentWords.some(cw => cw.includes(word))
  )
  
  return (matchedWords.length / queryWords.length) * 5
}

// Calculate relevance score
function calculateScore(item: any, query: string): number {
  let score = 0
  const lowerQuery = query.toLowerCase()
  
  // Title match (highest weight)
  if (item.title?.toLowerCase().includes(lowerQuery)) {
    score += 10
  }
  
  // Description match
  if (item.description?.toLowerCase().includes(lowerQuery)) {
    score += 5
  }
  
  // Content match
  if (item.body?.raw) {
    score += searchContent(query, item.body.raw) * 0.5
  }
  
  // Tags/keywords match (blog posts use keywords, others use tags)
  const tagsField = item.tags || item.keywords
  if (tagsField) {
    const tags = Array.isArray(tagsField) ? tagsField : [tagsField]
    const matchedTags = tags.filter((tag: string) => 
      tag.toLowerCase().includes(lowerQuery)
    )
    score += matchedTags.length * 3
  }
  
  // Date relevance (more recent = higher score)
  if (item.date) {
    const date = new Date(item.date)
    const now = new Date()
    const daysDiff = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    if (daysDiff < 30) score += 2
    else if (daysDiff < 90) score += 1
  }
  
  return score
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q') || ''
    const type = searchParams.get('type') || 'all'
    const limit = parseInt(searchParams.get('limit') || '20')
    
    if (!query.trim()) {
      return NextResponse.json({
        results: [],
        total: 0,
        query: '',
      })
    }
    
    const results: SearchResult[] = []
    
    // Search Research Core
    if (type === 'all' || type === 'research') {
      allResearchCores
        .filter((r: any) => r.parent == null && r.grand_parent == null)
        .forEach((item: any) => {
          const score = calculateScore(item, query)
          if (score > 0) {
            results.push({
              type: 'research',
              title: item.title,
              description: item.description,
              url: item.url,
              content: item.body?.raw?.substring(0, 200),
              tags: item.tags,
              date: item.date,
              score,
            })
          }
        })
    }
    
    // Search Projects
    if (type === 'all' || type === 'project') {
      allProjects.forEach((item: any) => {
        const score = calculateScore(item, query)
        if (score > 0) {
          results.push({
            type: 'project',
            title: item.title,
            description: item.description,
            url: item.link || '#',
            content: item.body?.raw?.substring(0, 200),
            tags: item.tags,
            date: item.date,
            score,
          })
        }
      })
    }
    
    // Search Blog Posts
    if (type === 'all' || type === 'blog') {
      allBlogPosts.forEach((item: any) => {
        const score = calculateScore(item, query)
        if (score > 0) {
          results.push({
            type: 'blog',
            title: item.title,
            description: item.description,
            url: item.url || `/blog/${item.slugAsParams}`,
            content: item.body?.raw?.substring(0, 200),
            tags: item.keywords || item.tags,
            date: item.date,
            score,
          })
        }
      })
    }
    
    // Sort by score (highest first)
    results.sort((a, b) => (b.score || 0) - (a.score || 0))
    
    // Limit results
    const limitedResults = results.slice(0, limit)
    
    return NextResponse.json({
      results: limitedResults,
      total: results.length,
      query,
      type,
    })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

