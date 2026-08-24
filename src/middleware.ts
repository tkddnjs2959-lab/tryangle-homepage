import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { normalizeAttributionParams } from './lib/attribution';

export function middleware(request: NextRequest) {
  const destination = request.nextUrl.clone();

  if (!normalizeAttributionParams(destination.searchParams)) {
    return NextResponse.next();
  }

  return NextResponse.redirect(destination, 307);
}

export const config = {
  matcher: '/',
};
