'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import AnalyticsCharts from '@/components/AnalyticsCharts';
import TenderCard from '@/components/TenderCard';
import { evaluateTenderEligibility } from '@/lib/matchingEngine';
import {
  ShieldCheck,
  Building2,
  FileSearch,
  GraduationCap,
  Sparkles,
  ArrowRight,
  RefreshCw,
  AlertTriangle,
  Award,
  Zap,
  CheckCircle2,
  Lock,
  QrCode,
  FileCheck2,
} from 'lucide-react';

export default function HomePage() {
  const {
    activeProfile,
    tenders,
    internships,
    userRole,
    setUserRole,
    setQrModalOpen,
    nextSyncCountdown,
    triggerSyncNow,
    isSyncing,
    t,
  } = useApp();

  // Sort tenders by match score for active profile
  const sortedTendersWithMatch = tenders
    .map((tender) => ({
      tender,
      match: evaluateTenderEligibility(tender, activeProfile),
    }))
    .sort((a, b) => b.match.overallScore - a.match.overallScore);

  const topRecommended = sortedTendersWithMatch.slice(0, 3);
  const verifiedInternships = internships.filter((i) => i.aicteApproved && i.verifiedPartner).slice(0, 3);

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Hero Enterprise Banner */}
      <div className="bg-gradient-to-br from-gov-navy via-slate-900 to-gov-blue rounded-2xl text-white p-6 sm:p-8 shadow-xl relative overflow-hidden border border-slate-700">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-80 h-80 rounded-full bg-gov-orange/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-bold bg-white/10 backdrop-blur-md text-emerald-300 border border-white/10">
              <Sparkles className="h-3.5 w-3.5 text-gov-gold" />
              <span>National Public Procurement & Cyber Defense Portal</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
              MSME Tender Discovery <span className="text-emerald-400">&</span> AICTE Fraud Shield
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Empowering Indian MSMEs to discover and qualify for permitted tenders across GeM, CPPP, and Railways, while safeguarding students through explainable AI fraud detection and verified industrial apprenticeships.
            </p>

            {/* Quick Context Pill */}
            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
              <div className="flex items-center space-x-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
                <Building2 className="h-4 w-4 text-gov-gold" />
                <span>
                  Active Enterprise: <strong>{activeProfile.name}</strong>
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {activeProfile.msmeCategory} MSME
                </span>
              </div>
              <div className="flex items-center space-x-1.5 text-slate-300">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>Udyam: {activeProfile.udyamNumber}</span>
              </div>
            </div>
          </div>

          {/* Hero Action Buttons */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full sm:w-auto flex-shrink-0">
            <Link
              href="/tenders"
              className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs sm:text-sm transition flex items-center justify-center space-x-2 shadow-lg shadow-emerald-950/20"
            >
              <FileSearch className="h-4 w-4" />
              <span>Explore Matched Tenders</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/aicte/fraud-scanner"
              className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm transition border border-white/20 backdrop-blur-md flex items-center justify-center space-x-2"
            >
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Scan Offer Letter for Fraud</span>
            </Link>

            <button
              onClick={() => setQrModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition border border-slate-700 flex items-center justify-center space-x-2"
            >
              <QrCode className="h-4 w-4 text-gov-gold" />
              <span>Validate Certificate QR</span>
            </button>
          </div>
        </div>
      </div>

      {/* Real-time Analytics & KPI Stats */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
            <span>Executive Analytics & GFR 170 Telemetry</span>
            <span className="text-xs font-normal text-slate-500">
              (Live for {activeProfile.tradeName})
            </span>
          </h2>
          <span className="text-xs text-slate-500">
            Next scheduled sync in <strong>{nextSyncCountdown}s</strong>
          </span>
        </div>
        <AnalyticsCharts />
      </section>

      {/* Top Personalized Recommendations for Active MSME */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
              <Award className="h-5 w-5 text-gov-gold" />
              <span>Top AI-Recommended Tenders for {activeProfile.tradeName}</span>
            </h2>
            <p className="text-xs text-slate-500">
              Ranked dynamically by semantic capability alignment, financial threshold, and mandatory certifications.
            </p>
          </div>
          <Link
            href="/tenders"
            className="text-xs font-bold text-gov-blue hover:underline flex items-center space-x-1"
          >
            <span>View All ({tenders.length}) Tenders</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {topRecommended.map(({ tender, match }) => (
            <TenderCard key={tender.id} tender={tender} match={match} />
          ))}
        </div>
      </section>

      {/* AICTE Fraud Shield & Shared Trust Bridge Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Module 1: AICTE Internship Fraud Detector Card */}
        <div className="bg-white rounded-2xl border border-red-200 p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-red-600 font-extrabold text-xs tracking-wider uppercase">
              <AlertTriangle className="h-4 w-4" />
              <span>AICTE Student Cyber Defense</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              Internship Fraud & Offer Letter Analyzer
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Detect fake internships requesting upfront training fees, unverified recruiter webmails (@gmail/@yahoo), forged AICTE digital signatures, and duplicate certificate serials with transparent explainable AI evidence.
            </p>
            <div className="flex flex-wrap gap-2 text-xs pt-1">
              <span className="px-2 py-1 rounded bg-red-50 text-red-800 font-semibold border border-red-200">
                🚨 Fee Extortion Detection
              </span>
              <span className="px-2 py-1 rounded bg-red-50 text-red-800 font-semibold border border-red-200">
                🔍 Corporate Domain Audit
              </span>
              <span className="px-2 py-1 rounded bg-red-50 text-red-800 font-semibold border border-red-200">
                🔐 Cryptographic QR Check
              </span>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between gap-3 border-t border-slate-100">
            <Link
              href="/aicte/complaints"
              className="text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Report a Scam Recruiter →
            </Link>
            <Link
              href="/aicte/fraud-scanner"
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition inline-flex items-center space-x-1.5 shadow-sm"
            >
              <span>Launch Fraud Scanner</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Module 2: Shared Trust Bridge: Verified MSME Apprenticeships */}
        <div className="bg-white rounded-2xl border border-emerald-200 p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-emerald-700 font-extrabold text-xs tracking-wider uppercase">
              <ShieldCheck className="h-4 w-4" />
              <span>Shared Trust Bridge</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              Verified MSME Apprenticeship Exchange
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Companies verified on the tender platform with valid Udyam, active GSTIN, and clean grievance audits receive the <strong>AICTE Verified Industrial Partner</strong> badge and offer guaranteed stipend apprenticeships to engineering students.
            </p>

            <div className="space-y-2 pt-1">
              {verifiedInternships.map((int) => (
                <div
                  key={int.id}
                  className="p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-100 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-900 block">{int.title}</span>
                    <span className="text-slate-500 text-[11px]">{int.companyName}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-emerald-800">
                      ₹{int.stipendMonthly.toLocaleString('en-IN')}/mo
                    </span>
                    <span className="block text-[10px] text-emerald-600 font-bold">100% Verified</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between gap-3 border-t border-slate-100">
            <span className="text-xs text-slate-500">Zero-Fee Guaranteed</span>
            <Link
              href="/aicte/internships"
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition inline-flex items-center space-x-1.5 shadow-sm"
            >
              <span>Explore All Verified Internships</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
