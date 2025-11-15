import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from 'lib/auth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const fetchCache = 'force-no-store';

// Lazy import to avoid build-time execution
const getAuthFunction = async () => {
  const { isAuthenticated } = await import('lib/auth');
  return isAuthenticated;
};

interface CloudflareAnalyticsResponse {
  data: {
    viewer: {
      zones: Array<{
        httpRequests1dGroups: Array<{
          dimensions: {
            date: string;
          };
          sum: {
            requests: number;
            bytes: number;
            cachedBytes: number;
            cachedRequests: number;
            pageViews: number;
          };
        }>;
      }>;
    };
  };
}

/**
 * Fetch Cloudflare Analytics using GraphQL API
 */
async function fetchCloudflareAnalytics(
  zoneId: string,
  apiToken: string,
  startDate: string,
  endDate: string
): Promise<any> {
  const query = `
    query {
      viewer {
        zones(filter: { zoneTag: "${zoneId}" }) {
          httpRequests1dGroups(
            limit: 10000
            filter: {
              date_geq: "${startDate}"
              date_leq: "${endDate}"
            }
            orderBy: [date_ASC]
          ) {
            dimensions {
              date
            }
            sum {
              requests
              bytes
              cachedBytes
              cachedRequests
              pageViews
            }
          }
        }
      }
    }
  `;

  const response = await fetch('https://api.cloudflare.com/client/v4/graphql', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Cloudflare API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return data;
}

/**
 * GET - Fetch Cloudflare Analytics
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const isAuthenticated = await getAuthFunction();
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');
    const zoneId = process.env.CLOUDFLARE_ZONE_ID || '';
    const apiToken = process.env.CLOUDFLARE_API_TOKEN || '';

    if (!zoneId || !apiToken) {
      return NextResponse.json({
        error: 'Cloudflare credentials not configured',
        message: 'Please set CLOUDFLARE_ZONE_ID and CLOUDFLARE_API_TOKEN in environment variables',
      }, { status: 400 });
    }

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];

    try {
      const data = await fetchCloudflareAnalytics(zoneId, apiToken, startDateStr, endDateStr);

      // Process the data
      const zones = data?.data?.viewer?.zones || [];
      if (zones.length === 0) {
        return NextResponse.json({
          error: 'No zone found',
          message: 'Zone ID not found or no access',
        }, { status: 404 });
      }

      const zone = zones[0];
      const httpRequests = zone.httpRequests1dGroups || [];

      // Aggregate data
      let totalRequests = 0;
      let totalBytes = 0;
      let totalCachedBytes = 0;
      let totalCachedRequests = 0;
      let totalPageViews = 0;

      const dailyData = httpRequests.map((item: any) => {
        const requests = item.sum?.requests || 0;
        const bytes = item.sum?.bytes || 0;
        const cachedBytes = item.sum?.cachedBytes || 0;
        const cachedRequests = item.sum?.cachedRequests || 0;
        const pageViews = item.sum?.pageViews || 0;

        totalRequests += requests;
        totalBytes += bytes;
        totalCachedBytes += cachedBytes;
        totalCachedRequests += cachedRequests;
        totalPageViews += pageViews;

        return {
          date: item.dimensions?.date || '',
          requests,
          bytes,
          cachedBytes,
          cachedRequests,
          pageViews,
          cacheHitRate: requests > 0 ? (cachedRequests / requests) * 100 : 0,
          bandwidthSaved: cachedBytes,
        };
      });

      // Calculate cache hit rate
      const cacheHitRate = totalRequests > 0 ? (totalCachedRequests / totalRequests) * 100 : 0;

      // Calculate bandwidth saved (cached bytes)
      const bandwidthSaved = totalCachedBytes;

      // Calculate average requests per day
      const avgRequestsPerDay = dailyData.length > 0 ? totalRequests / dailyData.length : 0;

      return NextResponse.json({
        summary: {
          totalRequests,
          totalBytes,
          totalCachedBytes,
          totalCachedRequests,
          totalPageViews,
          cacheHitRate: Math.round(cacheHitRate * 100) / 100,
          bandwidthSaved,
          avgRequestsPerDay: Math.round(avgRequestsPerDay),
          days: dailyData.length,
        },
        dailyData,
        chartData: {
          requests: dailyData.map((d: any) => ({ date: d.date, value: d.requests })),
          bandwidth: dailyData.map((d: any) => ({ date: d.date, value: Math.round(d.bytes / 1024 / 1024) })), // MB
          cacheHitRate: dailyData.map((d: any) => ({ date: d.date, value: d.cacheHitRate })),
          pageViews: dailyData.map((d: any) => ({ date: d.date, value: d.pageViews })),
        },
      }, { status: 200 });
    } catch (apiError: any) {
      console.error('[Cloudflare Analytics API] Error:', apiError);
      return NextResponse.json({
        error: 'Failed to fetch Cloudflare analytics',
        message: apiError.message || 'Unknown error',
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error('[Cloudflare Analytics API] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch Cloudflare analytics' },
      { status: 500 }
    );
  }
}

