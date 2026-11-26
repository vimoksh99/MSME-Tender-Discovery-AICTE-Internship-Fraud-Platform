'use client';

import React from 'react';
import { Tender, EligibilityMatch } from '@/lib/types';
import { useApp } from '@/context/AppContext';
import {
  X,
  Award,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  FileText,
  Building2,
  Calendar,
  Sparkles,
  HelpCircle,
  Zap,
} from 'lucide-react';

export default function EligibilityDrawer() {
  const { selectedTenderEligibility, setSelectedTenderEligibility, setDossierTender, activeProfile } = useApp();

  if (!selectedTenderEligibility) return null;

  const { tender, match } = selectedTenderEligibility;

  const handleClose = () => setSelectedTenderEligibility(null);

  const handleOpenPdf = () => {
    setDossierTender({ tender, match });
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} Lakhs`;
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-sm flex justify-end animate-in fade-in">
      <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right">
        {/* Top Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-start justify-between sticky top-0 z-10">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-gov-blue mb-1">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>AI TENDER ELIGIBILITY & GAP AUDIT</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-600">{tender.portalSource} Feed</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 leading-snug">
              {tender.title}
            </h2>
            <div className="text-xs text-slate-500 font-mono mt-0.5">
              Ref: {tender.referenceNumber} • {tender.issuingAuthority}
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 flex-1">
          {/* Match Score Hero Card */}
          <div className={`p-5 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
            match.status === 'Eligible'
              ? 'bg-emerald-50/80 border-emerald-300'
              : match.status === 'Partial'
              ? 'bg-amber-50/80 border-amber-300'
              : 'bg-red-50/80 border-red-300'
          }`}>
            <div className="flex items-center space-x-4">
              <div className={`h-16 w-16 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-md ${
                match.status === 'Eligible'
                  ? 'bg-emerald-600'
                  : match.status === 'Partial'
                  ? 'bg-amber-600'
                  : 'bg-red-600'
              }`}>
                {match.overallScore}%
              </div>
              <div>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                  match.status === 'Eligible'
                    ? 'bg-emerald-200 text-emerald-900'
                    : match.status === 'Partial'
                    ? 'bg-amber-200 text-amber-900'
                    : 'bg-red-200 text-red-900'
                }`}>
                  {match.status === 'Eligible' ? 'Eligible to Bid' : match.status === 'Partial' ? 'Conditional Eligibility' : 'Ineligible'}
                </span>
                <h4 className="font-extrabold text-slate-900 text-base mt-1">
                  Evaluation for {activeProfile.name}
                </h4>
                <p className="text-xs text-slate-600">
                  Classified as: <strong>{activeProfile.msmeCategory} Enterprise</strong> (Ministry of MSME Criteria)
                </p>
              </div>
            </div>

            <div className="text-right sm:border-l sm:border-slate-300 sm:pl-4">
              <span className="text-[11px] text-slate-500 block uppercase font-bold">Estimated Contract</span>
              <span className="text-base font-black text-slate-900">
                {formatCurrency(tender.estimatedValue)}
              </span>
            </div>
          </div>

          {/* MSME GFR 170 Financial Waiver Benefit */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-900 to-gov-navy text-white shadow-md">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4 text-emerald-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                  Government of India MSME Benefit (Rule 170 GFR 2017)
                </span>
              </div>
              <span className="text-xs bg-emerald-500/20 text-emerald-200 px-2 py-0.5 rounded font-mono">
                100% Waived
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <div>
                <div className="text-2xl font-black text-white">
                  {formatCurrency(match.msmeBenefits.totalSavings)}
                </div>
                <div className="text-xs text-emerald-100/80">
                  Total Saved (EMD: {formatCurrency(match.msmeBenefits.emdWaivedAmount)} + Tender Fee: {formatCurrency(match.msmeBenefits.tenderFeeWaivedAmount)})
                </div>
              </div>
              <div className="text-right text-[11px] text-slate-300 max-w-[200px]">
                Valid under Udyam Registration <strong>{activeProfile.udyamNumber}</strong>
              </div>
            </div>
          </div>

          {/* AI Explainable Recommendation */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div className="flex items-center space-x-2 font-bold text-slate-900 mb-1.5">
              <Sparkles className="h-4 w-4 text-gov-orange" />
              <span>AI Procurement Advisor Rationale</span>
            </div>
            <p className="text-slate-700 leading-relaxed">
              {match.aiRecommendationSummary}
            </p>
          </div>

          {/* Multi-Criteria Parameter Breakdown */}
          <div className="space-y-4">
            <h4 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider text-slate-500">
              Criteria Evaluation Breakdown
            </h4>

            {/* 1. Turnover Requirement */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {match.breakdown.turnoverMatch.passed ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span className="font-bold text-slate-900 text-xs">
                    1. Financial Turnover (30% weight)
                  </span>
                </div>
                <span className="font-mono text-xs font-bold text-slate-700">
                  Score: {match.breakdown.turnoverMatch.score}/100
                </span>
              </div>
              <p className="text-xs text-slate-600">
                {match.breakdown.turnoverMatch.details}
              </p>
              {match.breakdown.turnoverMatch.isRelaxedApplied && (
                <div className="text-[11px] bg-blue-50 text-gov-blue p-2 rounded border border-blue-200 font-medium">
                  ℹ️ MSE Relaxed Turnover criteria of ₹{tender.msmeRelaxedTurnover} Cr was applied instead of general ₹{tender.minTurnoverRequired} Cr.
                </div>
              )}
            </div>

            {/* 2. Mandatory Certifications */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {match.breakdown.certificateMatch.passed ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                  )}
                  <span className="font-bold text-slate-900 text-xs">
                    2. Mandatory Certifications (25% weight)
                  </span>
                </div>
                <span className="font-mono text-xs font-bold text-slate-700">
                  Score: {match.breakdown.certificateMatch.score}/100
                </span>
              </div>
              <p className="text-xs text-slate-600">
                {match.breakdown.certificateMatch.details}
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {tender.mandatoryCertificates.map((cert) => {
                  const isMatched = match.breakdown.certificateMatch.matched.includes(cert);
                  return (
                    <span
                      key={cert}
                      className={`text-[11px] px-2 py-0.5 rounded font-semibold flex items-center space-x-1 ${
                        isMatched
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-red-100 text-red-800 border border-red-300'
                      }`}
                    >
                      {isMatched ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                      <span>{cert}</span>
                    </span>
                  );
                })}
              </div>
            </div>

            {/* 3. Capabilities & Scope */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {match.breakdown.capabilityMatch.passed ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                  )}
                  <span className="font-bold text-slate-900 text-xs">
                    3. Capabilities & Scope Alignment (25% weight)
                  </span>
                </div>
                <span className="font-mono text-xs font-bold text-slate-700">
                  {match.breakdown.capabilityMatch.similarityPercentage}% Match
                </span>
              </div>
              <p className="text-xs text-slate-600">
                {match.breakdown.capabilityMatch.details}
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {tender.requiredCapabilities.map((cap) => {
                  const isMatched = match.breakdown.capabilityMatch.matchedTags.includes(cap);
                  return (
                    <span
                      key={cap}
                      className={`text-[11px] px-2 py-0.5 rounded font-semibold ${
                        isMatched
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {isMatched ? '✓ ' : '✕ '} {cap}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* 4. Location & Experience */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
                <span className="font-bold text-slate-900 block mb-1">
                  4. Regional Preference (10%)
                </span>
                <p className="text-slate-600">
                  {match.breakdown.locationMatch.details}
                </p>
              </div>
              <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
                <span className="font-bold text-slate-900 block mb-1">
                  5. Experience Track Record (10%)
                </span>
                <p className="text-slate-600">
                  {match.breakdown.experienceMatch.details}
                </p>
              </div>
            </div>
          </div>

          {/* Gap Analysis & Actionable Remediation Roadmap */}
          {match.gapAnalysis.gaps.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <ShieldAlert className="h-4 w-4 text-amber-600" />
                <h4 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider">
                  Identified Eligibility Gaps & Action Roadmap
                </h4>
              </div>

              <div className="space-y-3">
                {match.gapAnalysis.gaps.map((gap) => (
                  <div
                    key={gap.id}
                    className={`p-4 rounded-xl border text-xs ${
                      gap.severity === 'Critical'
                        ? 'bg-red-50/70 border-red-200 text-red-900'
                        : gap.severity === 'Warning'
                        ? 'bg-amber-50/70 border-amber-200 text-amber-900'
                        : 'bg-blue-50/70 border-blue-200 text-blue-900'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm">{gap.title}</span>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-white/80">
                        {gap.severity}
                      </span>
                    </div>
                    <p className="text-xs mb-2 opacity-90">{gap.description}</p>
                    <div className="p-2.5 rounded-lg bg-white/90 border border-slate-200/60 font-medium">
                      <strong className="text-slate-900">Remediation Action: </strong>
                      {gap.remediation}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3 sticky bottom-0 z-10">
          <button
            onClick={handleClose}
            className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition"
          >
            Close Audit
          </button>

          <button
            onClick={handleOpenPdf}
            className="flex-1 py-2 px-4 rounded-lg bg-gov-navy hover:bg-gov-blue text-white font-bold text-xs transition inline-flex items-center justify-center space-x-2 shadow-md"
          >
            <FileText className="h-4 w-4 text-emerald-400" />
            <span>Export Official GFR 170 Dossier (PDF)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
