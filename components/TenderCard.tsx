'use client';

import React from 'react';
import { Tender, EligibilityMatch } from '@/lib/types';
import { evaluateTenderEligibility } from '@/lib/matchingEngine';
import { useApp } from '@/context/AppContext';
import {
  Building2,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  FileText,
  ExternalLink,
  ShieldAlert,
  Award,
  Sparkles,
  ArrowRight,
  Bookmark,
} from 'lucide-react';

interface TenderCardProps {
  tender: Tender;
  match?: EligibilityMatch;
  onViewDetails?: (tender: Tender, match: EligibilityMatch) => void;
  onExportPdf?: (tender: Tender, match: EligibilityMatch) => void;
}

export default function TenderCard({ tender, match: propMatch, onViewDetails, onExportPdf }: TenderCardProps) {
  const { activeProfile, setSelectedTenderEligibility, setDossierTender } = useApp();

  const match = propMatch || evaluateTenderEligibility(tender, activeProfile);

  // Time remaining calculation
  const deadlineDate = new Date(tender.submissionDeadline);
  const diffHours = Math.round((deadlineDate.getTime() - Date.now()) / (1000 * 60 * 60));
  const diffDays = Math.ceil(diffHours / 24);
  const isUrgent = diffHours > 0 && diffHours <= 48;
  const isExpired = diffHours <= 0;

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} Lakhs`;
    }
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const handleOpenDetails = () => {
    if (onViewDetails) {
      onViewDetails(tender, match);
    } else {
      setSelectedTenderEligibility({ tender, match });
    }
  };

  const handleOpenPdf = () => {
    if (onExportPdf) {
      onExportPdf(tender, match);
    } else {
      setDossierTender({ tender, match });
    }
  };

  // Color theme by Match Status
  const scoreColor =
    match.status === 'Eligible'
      ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
      : match.status === 'Partial'
      ? 'border-amber-500 bg-amber-50 text-amber-800'
      : 'border-red-500 bg-red-50 text-red-800';

  const badgeColor =
    match.status === 'Eligible'
      ? 'bg-emerald-600 text-white'
      : match.status === 'Partial'
      ? 'bg-amber-600 text-white'
      : 'bg-red-600 text-white';

  return (
    <div className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md transition flex flex-col justify-between overflow-hidden relative">
      {/* Top Banner: Source Portal & Deadline */}
      <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2">
          <span className="font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-800">
            {tender.portalSource}
          </span>
          <span className="text-slate-500 font-mono text-[11px] truncate max-w-[160px]">
            {tender.referenceNumber}
          </span>
        </div>

        {/* Deadline countdown */}
        <div className="flex items-center space-x-1.5 font-medium">
          <Clock className={`h-3.5 w-3.5 ${isUrgent ? 'text-red-600 animate-bounce' : 'text-slate-500'}`} />
          {isExpired ? (
            <span className="text-slate-400 font-bold">Closed</span>
          ) : isUrgent ? (
            <span className="text-red-600 font-bold bg-red-100 px-2 py-0.5 rounded">
              Ends in {diffHours}h!
            </span>
          ) : (
            <span className="text-slate-600">
              {diffDays} days left ({deadlineDate.toLocaleDateString()})
            </span>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Header row: Title & Match Score Badge */}
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3 className="font-bold text-slate-900 text-base leading-snug hover:text-gov-blue transition line-clamp-2">
              {tender.title}
            </h3>
            {/* Match Score Badge */}
            <div className="flex flex-col items-end flex-shrink-0">
              <div className={`px-2.5 py-1 rounded-lg text-xs font-black flex items-center space-x-1 shadow-sm ${scoreColor}`}>
                <Award className="h-3.5 w-3.5" />
                <span>{match.overallScore}% MATCH</span>
              </div>
              <span className={`text-[10px] font-bold mt-1 px-1.5 py-0.5 rounded ${badgeColor}`}>
                {match.status === 'Eligible' ? 'Eligible to Bid' : match.status === 'Partial' ? 'Partial Match' : 'Ineligible'}
              </span>
            </div>
          </div>

          {/* Issuing Authority & Ministry */}
          <div className="flex items-center space-x-1.5 text-xs text-slate-600 mb-3">
            <Building2 className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
            <span className="font-medium text-slate-800 truncate">{tender.issuingAuthority}</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500 truncate">{tender.category}</span>
          </div>

          <p className="text-xs text-slate-600 mb-4 line-clamp-2">
            {tender.description}
          </p>

          {/* Key Procurement Numbers (Value, EMD Exemption, Turnover) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-200/80 mb-4 text-xs">
            <div>
              <span className="text-[11px] text-slate-500 block">Estimated Value</span>
              <span className="font-extrabold text-slate-900 text-sm">
                {formatCurrency(tender.estimatedValue)}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 block">MSME GFR 170 Savings</span>
              <span className="font-bold text-emerald-700 text-sm">
                {match.msmeBenefits.totalSavings > 0
                  ? formatCurrency(match.msmeBenefits.totalSavings)
                  : '₹0 (Standard)'}
              </span>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-[11px] text-slate-500 block">Min Turnover Required</span>
              <span className="font-semibold text-slate-800">
                ₹{tender.msmeRelaxedTurnover || tender.minTurnoverRequired} Cr
                {tender.msmeRelaxedTurnover < tender.minTurnoverRequired && (
                  <span className="text-[10px] text-gov-blue ml-1 font-bold">(MSE relaxed)</span>
                )}
              </span>
            </div>
          </div>

          {/* Quick Criteria Verification Checklist */}
          <div className="space-y-1.5 mb-4 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-600 flex items-center space-x-1.5">
                {match.breakdown.turnoverMatch.passed ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                ) : (
                  <XCircle className="h-3.5 w-3.5 text-red-500" />
                )}
                <span>Turnover Requirement</span>
              </span>
              <span className="font-semibold text-slate-700">
                ₹{activeProfile.annualTurnover} Cr vs ₹{match.breakdown.turnoverMatch.required} Cr
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-600 flex items-center space-x-1.5">
                {match.breakdown.certificateMatch.passed ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                ) : (
                  <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
                )}
                <span>Mandatory Certificates</span>
              </span>
              <span className="font-semibold text-slate-700">
                {match.breakdown.certificateMatch.matched.length} of {tender.mandatoryCertificates.length} verified
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-600 flex items-center space-x-1.5">
                {match.breakdown.capabilityMatch.passed ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                ) : (
                  <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
                )}
                <span>Capabilities Overlap</span>
              </span>
              <span className="font-semibold text-slate-700">
                {match.breakdown.capabilityMatch.similarityPercentage}% Tag Match
              </span>
            </div>
          </div>

          {/* Gap Alert Banner if critical gap exists */}
          {match.gapAnalysis.gaps.length > 0 && (
            <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 mb-4 flex items-start space-x-2">
              <ShieldAlert className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Gap Notice: </span>
                <span>{match.gapAnalysis.gaps[0].title}.</span>
                <span className="text-amber-800 text-[11px] block mt-0.5">
                  {match.gapAnalysis.gaps[0].remediation.slice(0, 80)}...
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Card Actions Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <button
            onClick={handleOpenPdf}
            className="px-2.5 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs inline-flex items-center space-x-1"
            title="Download printable Government GFR 170 compliance dossier"
          >
            <FileText className="h-3.5 w-3.5 text-gov-blue" />
            <span className="hidden sm:inline">Dossier</span>
          </button>

          <button
            onClick={handleOpenDetails}
            className="flex-1 py-1.5 px-3 rounded-lg bg-gov-navy hover:bg-gov-blue text-white font-semibold text-xs transition inline-flex items-center justify-center space-x-1.5 shadow-sm"
          >
            <span>Match & Gap Audit</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>

          <a
            href={tender.portalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-600 hover:text-gov-blue"
            title="Open official notice on Government portal"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
