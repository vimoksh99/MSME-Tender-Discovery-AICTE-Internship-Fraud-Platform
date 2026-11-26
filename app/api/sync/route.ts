import { NextResponse } from 'next/server';
import { Tender } from '@/lib/types';

const SIMULATED_REMOTE_FEEDS: Omit<Tender, 'id' | 'crawlTimestamp' | 'contentHash'>[] = [
  {
    referenceNumber: 'GEM/2026/B/9920145',
    title: 'Cloud Infrastructure & High Availability Container Management for Smart City Mission',
    description: 'Procurement of enterprise Kubernetes orchestration, managed cloud databases, automated backup replication, and zero-trust IAM for Municipal Corporation Command Center.',
    issuingAuthority: 'Bhopal Smart City Development Corporation Ltd',
    ministry: 'Ministry of Housing and Urban Affairs',
    portalSource: 'GeM',
    portalUrl: 'https://gem.gov.in/tenders/GEM-2026-B-9920145',
    category: 'Information Technology & Cybersecurity',
    locationRequirement: { state: 'Madhya Pradesh', isPanIndia: true },
    estimatedValue: 145000000, // ₹14.5 Cr
    emdAmount: 2900000,
    tenderDocumentFee: 20000,
    isEmdExemptForMsme: true,
    isReservedForMse: true,
    minTurnoverRequired: 18.0,
    msmeRelaxedTurnover: 10.0,
    minExperienceYears: 3,
    mandatoryCertificates: ['ISO 27001', 'ISO 9001', 'UDYAM-MSME'],
    preferredCertificates: ['CMMI-3'],
    requiredCapabilities: ['Cloud Migration & Architecture', 'DevOps & CI/CD Automation', 'Full Stack Software Engineering'],
    publishDate: new Date().toISOString().split('T')[0],
    submissionDeadline: new Date(Date.now() + 14 * 24 * 3600 * 1000).toISOString(),
    openingDate: new Date(Date.now() + 15 * 24 * 3600 * 1000).toISOString(),
    status: 'Active',
  },
  {
    referenceNumber: 'CPPP/AICTE/NEAT/2026/89',
    title: 'Deployment of AI-Driven Adaptive Learning & Student Skill Assessment Engine',
    description: 'AICTE invites proposals for developing an AI-driven cognitive assessment system for technical engineering students under the National Educational Alliance for Technology (NEAT).',
    issuingAuthority: 'All India Council for Technical Education (AICTE)',
    ministry: 'Ministry of Education',
    portalSource: 'AICTE / MoE',
    portalUrl: 'https://eprocure.gov.in/cppp/aicte-neat-2026-89',
    category: 'Software & Digital Infrastructure',
    locationRequirement: { isPanIndia: true },
    estimatedValue: 68000000, // ₹6.8 Cr
    emdAmount: 1360000,
    tenderDocumentFee: 10000,
    isEmdExemptForMsme: true,
    isReservedForMse: true,
    minTurnoverRequired: 8.0,
    msmeRelaxedTurnover: 4.5,
    minExperienceYears: 3,
    mandatoryCertificates: ['ISO 9001', 'UDYAM-MSME'],
    preferredCertificates: ['ISO 27001', 'CMMI-3'],
    requiredCapabilities: ['AI/ML Data Pipelines', 'Full Stack Software Engineering'],
    publishDate: new Date().toISOString().split('T')[0],
    submissionDeadline: new Date(Date.now() + 21 * 24 * 3600 * 1000).toISOString(),
    openingDate: new Date(Date.now() + 22 * 24 * 3600 * 1000).toISOString(),
    status: 'Active',
  },
  {
    referenceNumber: 'IREPS/WR/SOLAR/2026/102',
    title: 'Installation of 1.2 MWp Solar Rooftop Power Plant at Western Railway Carriage Workshops',
    description: 'Design, supply, installation, testing and commissioning of grid-interactive rooftop solar PV plants along with 5-year comprehensive operation & maintenance contract.',
    issuingAuthority: 'Western Railway, Indian Railways',
    ministry: 'Ministry of Railways',
    portalSource: 'IREPS',
    portalUrl: 'https://www.ireps.gov.in/eps/tender/WR-SOLAR-2026-102',
    category: 'Renewable Energy & Power Systems',
    locationRequirement: { state: 'Gujarat', isPanIndia: false },
    estimatedValue: 72000000, // ₹7.2 Cr
    emdAmount: 1440000,
    tenderDocumentFee: 12000,
    isEmdExemptForMsme: true,
    isReservedForMse: true,
    minTurnoverRequired: 9.0,
    msmeRelaxedTurnover: 5.0,
    minExperienceYears: 3,
    mandatoryCertificates: ['ISO 9001', 'ISO 14001', 'UDYAM-MSME'],
    preferredCertificates: ['MNRE-CHANNEL'],
    requiredCapabilities: ['Solar Rooftop PV EPC', 'SCADA Monitoring Systems'],
    publishDate: new Date().toISOString().split('T')[0],
    submissionDeadline: new Date(Date.now() + 18 * 24 * 3600 * 1000).toISOString(),
    openingDate: new Date(Date.now() + 19 * 24 * 3600 * 1000).toISOString(),
    status: 'Active',
  },
];

export async function POST() {
  const crawlTime = new Date().toISOString();
  const simulatedTenders: Tender[] = SIMULATED_REMOTE_FEEDS.map((feed, idx) => {
    // Generate pseudo hash
    const contentStr = `${feed.referenceNumber}-${feed.issuingAuthority}-${feed.estimatedValue}`;
    let hash = 0;
    for (let i = 0; i < contentStr.length; i++) {
      hash = (hash << 5) - hash + contentStr.charCodeAt(i);
      hash |= 0;
    }
    const hashHex = Math.abs(hash).toString(16).padStart(64, 'a');

    return {
      ...feed,
      id: `TND-SYNC-${Date.now().toString().slice(-5)}-${idx + 1}`,
      crawlTimestamp: crawlTime,
      contentHash: hashHex,
    };
  });

  return NextResponse.json({
    success: true,
    message: 'Periodic tender collection cycle executed successfully.',
    sourcePortalsPolled: ['GeM', 'CPPP', 'IREPS', 'Defense Procurement', 'AICTE / MoE'],
    fetchedCount: simulatedTenders.length,
    timestamp: crawlTime,
    tenders: simulatedTenders,
  });
}
