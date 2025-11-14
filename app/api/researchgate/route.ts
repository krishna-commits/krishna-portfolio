import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 3600 // Revalidate every hour

/**
 * ResearchGate API Route
 * 
 * ResearchGate doesn't provide a public API, so we use environment variables
 * to store the metrics. You can manually update these values by:
 * 1. Visiting your ResearchGate stats page: https://www.researchgate.net/profile/Krishna-Neupane/stats
 * 2. Updating the environment variables in .env.local or Vercel
 * 
 * Source: https://www.researchgate.net/profile/Krishna-Neupane/stats
 */
export async function GET(request: NextRequest) {
	try {
		// ResearchGate Profile Stats URL
		// https://www.researchgate.net/profile/Krishna-Neupane/stats
		
		// Citations from ResearchGate
		const researchGateCitations = process.env.RESEARCHGATE_CITATIONS 
			? parseInt(process.env.RESEARCHGATE_CITATIONS, 10) 
			: 0
		
		// Total reads (default: 4550 from ResearchGate stats page)
		// Source: https://www.researchgate.net/profile/Krishna-Neupane/stats
		const researchGateTotalReads = process.env.RESEARCHGATE_TOTAL_READS 
			? parseInt(process.env.RESEARCHGATE_TOTAL_READS, 10) 
			: 4550
		
		// Publication reads (default: 4002 from ResearchGate stats page)
		const researchGatePublicationReads = process.env.RESEARCHGATE_PUBLICATION_READS 
			? parseInt(process.env.RESEARCHGATE_PUBLICATION_READS, 10) 
			: 4002
		
		// Full-text reads (default: 1512 from ResearchGate stats page)
		const researchGateFullTextReads = process.env.RESEARCHGATE_FULLTEXT_READS 
			? parseInt(process.env.RESEARCHGATE_FULLTEXT_READS, 10) 
			: 1512
		
		// Other reads (default: 2490 from ResearchGate stats page)
		const researchGateOtherReads = process.env.RESEARCHGATE_OTHER_READS 
			? parseInt(process.env.RESEARCHGATE_OTHER_READS, 10) 
			: 2490
		
		// Question reads (default: 494 from ResearchGate stats page)
		const researchGateQuestionReads = process.env.RESEARCHGATE_QUESTION_READS 
			? parseInt(process.env.RESEARCHGATE_QUESTION_READS, 10) 
			: 494
		
		// Answer reads (default: 54 from ResearchGate stats page)
		const researchGateAnswerReads = process.env.RESEARCHGATE_ANSWER_READS 
			? parseInt(process.env.RESEARCHGATE_ANSWER_READS, 10) 
			: 54

		// Legacy support: if only RESEARCHGATE_READS is set, use it for total reads
		const legacyReads = process.env.RESEARCHGATE_READS 
			? parseInt(process.env.RESEARCHGATE_READS, 10) 
			: 0
		
		const totalReads = researchGateTotalReads || legacyReads || 4550

		return NextResponse.json({
			citations: researchGateCitations || 0,
			reads: totalReads, // Total reads (for backward compatibility)
			totalReads: totalReads,
			publicationReads: researchGatePublicationReads || 4002,
			fullTextReads: researchGateFullTextReads || 1512,
			otherReads: researchGateOtherReads || 2490,
			questionReads: researchGateQuestionReads || 494,
			answerReads: researchGateAnswerReads || 54,
			profileUrl: 'https://www.researchgate.net/profile/Krishna-Neupane/stats',
			lastUpdated: new Date().toISOString(),
		})
	} catch (error) {
		console.error('[ResearchGate API] Exception:', error)
		return NextResponse.json(
			{
				citations: 0,
				reads: 4550, // Default total reads from ResearchGate stats
				totalReads: 4550,
				publicationReads: 4002,
				fullTextReads: 1512,
				otherReads: 2490,
				questionReads: 494,
				answerReads: 54,
				profileUrl: 'https://www.researchgate.net/profile/Krishna-Neupane/stats',
				error: error instanceof Error ? error.message : 'Unknown error',
				lastUpdated: new Date().toISOString(),
			},
			{ status: 200 } // Return 200 to prevent breaking the UI
		)
	}
}

