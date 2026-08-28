import { NextResponse } from 'next/server';
import { db } from '@/lib/supabase';
import { requestFingerprints } from '@/lib/inquiry-security';

export const dynamic = 'force-dynamic';

function clipped(value: unknown, length = 500) {
  return typeof value === 'string' ? value.slice(0, length) : null;
}

export async function POST(request: Request) {
  const hostname = new URL(request.url).hostname.toLowerCase();
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1') {
    return new NextResponse(null, { status: 204 });
  }

  const contentLength = Number(request.headers.get('content-length') || 0);
  if (contentLength > 8192) return new NextResponse(null, { status: 413 });

  const fingerprint = requestFingerprints(request, 'csp-report').ipFingerprint;
  const { data: allowed } = await db().rpc('consume_inquiry_rate_limit', {
    p_key: `csp:report:ip:hour:${fingerprint}`,
    p_limit: 30,
    p_window_seconds: 3600,
  });
  if (!allowed) return new NextResponse(null, { status: 204 });

  try {
    const body = await request.json() as Record<string, unknown>;
    const report = (body['csp-report'] && typeof body['csp-report'] === 'object'
      ? body['csp-report']
      : body) as Record<string, unknown>;
    console.warn(JSON.stringify({
      level: 'warn',
      message: 'csp_violation',
      documentUri: clipped(report['document-uri']),
      violatedDirective: clipped(report['violated-directive'], 120),
      blockedUri: clipped(report['blocked-uri']),
      sourceFile: clipped(report['source-file']),
      lineNumber: typeof report['line-number'] === 'number' ? report['line-number'] : null,
    }));
  } catch {
    // 브라우저별 보고 형식 차이는 운영 페이지 동작에 영향을 주지 않는다.
  }
  return new NextResponse(null, { status: 204 });
}
