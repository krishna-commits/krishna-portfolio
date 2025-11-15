import { NextRequest, NextResponse } from 'next/server';
import { prisma } from 'lib/prisma';
import { isAuthenticated } from 'lib/auth';

export const dynamic = 'force-dynamic';

// GET - Get all site settings or specific setting
export async function GET(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!prisma) {
      return NextResponse.json({ settings: {} }, { status: 200 });
    }

    const searchParams = request.nextUrl.searchParams;
    const key = searchParams.get('key');

    if (key) {
      const setting = await prisma.siteSetting.findUnique({
        where: { key },
      });
      return NextResponse.json({ 
        setting: setting ? { key: setting.key, value: JSON.parse(setting.value) } : null 
      }, { status: 200 });
    }

    const settings = await prisma.siteSetting.findMany();
    const settingsObj: Record<string, any> = {};
    
    settings.forEach(setting => {
      try {
        settingsObj[setting.key] = JSON.parse(setting.value);
      } catch {
        settingsObj[setting.key] = setting.value;
      }
    });

    return NextResponse.json({ settings: settingsObj }, { status: 200 });
  } catch (error: any) {
    console.error('[Settings API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

// POST - Create or update site setting
export async function POST(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!prisma) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { key, value } = body;

    if (!key) {
      return NextResponse.json(
        { error: 'Missing required field: key' },
        { status: 400 }
      );
    }

    const valueString = typeof value === 'string' ? value : JSON.stringify(value);

    const setting = await prisma.siteSetting.upsert({
      where: { key },
      update: { value: valueString },
      create: { key, value: valueString },
    });

    return NextResponse.json(
      { message: 'Setting saved successfully', setting },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[Settings API] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to save setting' },
      { status: 500 }
    );
  }
}

// DELETE - Delete site setting
export async function DELETE(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!prisma) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const key = searchParams.get('key');

    if (!key) {
      return NextResponse.json({ error: 'Missing key parameter' }, { status: 400 });
    }

    await prisma.siteSetting.delete({
      where: { key },
    });

    return NextResponse.json(
      { message: 'Setting deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[Settings API] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete setting' },
      { status: 500 }
    );
  }
}

