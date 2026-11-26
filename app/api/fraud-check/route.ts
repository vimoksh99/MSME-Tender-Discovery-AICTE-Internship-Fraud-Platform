import { NextRequest, NextResponse } from 'next/server';
import { analyzeInternshipFraud } from '@/lib/fraudDetectionEngine';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = analyzeInternshipFraud({
      textToScan: body.textToScan || '',
      recruiterEmail: body.recruiterEmail,
      companyWebsite: body.companyWebsite,
      gstin: body.gstin,
      cin: body.cin,
      qrPayload: body.qrPayload,
      certificateSerialNumber: body.certificateSerialNumber,
      digitalSignatureHash: body.digitalSignatureHash,
      claimedStudentName: body.claimedStudentName,
    });

    return NextResponse.json({
      success: true,
      analysis: result,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
