import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_TENDERS } from '@/lib/mockData';
import { Tender } from '@/lib/types';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const query = searchParams.get('q')?.toLowerCase();

  let results = [...INITIAL_TENDERS];

  if (category && category !== 'all') {
    results = results.filter((t) => t.category.toLowerCase().includes(category.toLowerCase()));
  }

  if (query) {
    results = results.filter(
      (t) =>
        t.title.toLowerCase().includes(query) ||
        t.referenceNumber.toLowerCase().includes(query) ||
        t.issuingAuthority.toLowerCase().includes(query) ||
        t.ministry.toLowerCase().includes(query) ||
        t.category.toLowerCase().includes(query)
    );
  }

  return NextResponse.json({
    success: true,
    count: results.length,
    tenders: results,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const incomingTenders: Tender[] = Array.isArray(body) ? body : [body];

    const added: Tender[] = [];
    const duplicates: string[] = [];

    for (const tender of incomingTenders) {
      if (!tender.referenceNumber || !tender.title) {
        continue;
      }
      // Check if reference exists in seed
      const exists = INITIAL_TENDERS.some(
        (t) => t.referenceNumber.toLowerCase() === tender.referenceNumber.toLowerCase()
      );
      if (exists) {
        duplicates.push(tender.referenceNumber);
      } else {
        added.push(tender);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${incomingTenders.length} tenders: ${added.length} added, ${duplicates.length} duplicate(s) skipped.`,
      addedCount: added.length,
      duplicateCount: duplicates.length,
      duplicates,
      added,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
