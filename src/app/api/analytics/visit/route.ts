import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

const VISIT_COOKIE = 'tryangle_home_visit_day';
const BOT_PATTERN = /bot|crawler|spider|slurp|facebookexternalhit|preview/i;

function kstDate(): string {
  return new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

export async function POST(request: NextRequest) {
  const today = kstDate();

  if (request.cookies.get(VISIT_COOKIE)?.value === today) {
    return NextResponse.json({ ok: true, counted: false });
  }

  if (BOT_PATTERN.test(request.headers.get('user-agent') ?? '')) {
    return NextResponse.json({ ok: true, counted: false });
  }

  const { error } = await db().rpc('increment_homepage_daily_visit', {
    p_visit_date: today,
  });

  if (error) {
    console.error('Failed to count homepage visit:', error.message);
    return NextResponse.json({ ok: false }, { status: 503 });
  }

  const response = NextResponse.json({ ok: true, counted: true });
  response.headers.set('Cache-Control', 'no-store');
  response.cookies.set(VISIT_COOKIE, today, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 26,
  });
  return response;
}
