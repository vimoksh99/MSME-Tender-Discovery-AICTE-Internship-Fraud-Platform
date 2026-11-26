import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_AUDIT_LOGS } from '@/lib/mockData';
import { AuditLog } from '@/lib/types';

export async function GET() {
  return NextResponse.json({
    success: true,
    logs: INITIAL_AUDIT_LOGS,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const log: AuditLog = {
      id: `LOG-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString(),
      role: body.role || 'Administrator',
      action: body.action || 'Generic Event',
      category: body.category || 'Admin',
      details: body.details || '',
      ipAddress: '127.0.0.1 (Local Verified Node)',
    };

    return NextResponse.json({
      success: true,
      log,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
