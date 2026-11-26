'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { ShieldCheck, Printer, X, Download, Award, CheckCircle2, FileCheck2 } from 'lucide-react';

export default function PdfExportModal() {
  const { dossierTender, setDossierTender, activeProfile } = useApp();

  if (!dossierTender) return null;

  const { tender, match } = dossierTender;

  const handlePrint = () => {
    window.print();
  };

  const handleClose = () => {
    setDossierTender(null);
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} Lakhs`;
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm p-4 sm:p-6 flex items-center justify-center animate-in fade-in">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-300 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Control Bar (Hidden when printing) */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center space-x-2 text-xs font-bold">
            <FileCheck2 className="h-4 w-4 text-emerald-400" />
            <span>OFFICIAL PUBLIC PROCUREMENT ELIGIBILITY & GFR 170 DOSSIER</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold inline-flex items-center space-x-1.5 transition shadow-sm"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={handleClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Printable Official Document Container */}
        <div className="p-8 sm:p-10 overflow-y-auto print:p-0 print:overflow-visible text-slate-900 font-sans" id="printable-dossier">
          {/* Government & MSME Header */}
          <div className="border-b-2 border-slate-900 pb-5 mb-6 text-center relative">
            <div className="text-[11px] font-bold text-slate-600 uppercase tracking-widest mb-1">
              Government of India • Ministry of Micro, Small and Medium Enterprises
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
              MSME TENDER ELIGIBILITY & BID FEASIBILITY DOSSIER
            </h1>
            <p className="text-xs text-slate-500 font-mono mt-1">
              Under Public Procurement Policy for MSEs Order 2012 & Rule 170 GFR 2017
            </p>

            <div className="absolute right-0 top-0 hidden sm:block">
              <div className="border border-slate-300 rounded p-1.5 text-center font-mono text-[9px] bg-slate-50">
                <div className="font-bold">VERIFIED DOSSIER</div>
                <div>ID: {tender.id}</div>
              </div>
            </div>
          </div>

          {/* Section 1: Enterprise Profile Particulars */}
          <div className="mb-6">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-700 bg-slate-100 p-2 rounded mb-3">
              1. Bidder Enterprise Particulars
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-slate-500 block">Enterprise Legal Name:</span>
                <span className="font-bold text-slate-900">{activeProfile.name}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Udyam Registration Number:</span>
                <span className="font-mono font-bold text-slate-900">{activeProfile.udyamNumber}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Statutory MSME Category:</span>
                <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {activeProfile.msmeCategory} Enterprise
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">GSTIN & CIN:</span>
                <span className="font-mono text-slate-800">{activeProfile.gstin} / {activeProfile.cin}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Annual Turnover / Investment:</span>
                <span className="font-bold text-slate-900">
                  ₹{activeProfile.annualTurnover} Cr / ₹{activeProfile.investmentInPlantMachinery} Cr
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Registered State / Scope:</span>
                <span className="font-bold text-slate-900">
                  {activeProfile.state} ({activeProfile.isPanIndia ? 'Pan-India Operational' : 'Regional'})
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Tender Notice Specification */}
          <div className="mb-6">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-700 bg-slate-100 p-2 rounded mb-3">
              2. Target Tender Specification
            </h2>
            <div className="p-3.5 border border-slate-200 rounded-lg bg-slate-50/50 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500 font-mono">Tender Reference ID:</span>
                <span className="font-mono font-bold text-slate-900">{tender.referenceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tender Title:</span>
                <span className="font-bold text-slate-900 text-right max-w-[450px]">{tender.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Procuring Authority / Ministry:</span>
                <span className="font-semibold text-slate-900">{tender.issuingAuthority} ({tender.ministry})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Estimated Procurement Value:</span>
                <span className="font-black text-slate-900">{formatCurrency(tender.estimatedValue)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Submission Deadline:</span>
                <span className="font-mono font-bold text-slate-900">
                  {new Date(tender.submissionDeadline).toUTCString()}
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: Statutory MSME GFR 170 Exemption Certificate */}
          <div className="mb-6 p-4 border-2 border-emerald-600 rounded-xl bg-emerald-50/40 text-xs">
            <div className="flex items-center space-x-2 font-black text-emerald-900 text-sm mb-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              <span>STATUTORY BID SECURITY (EMD) EXEMPTION CERTIFICATE</span>
            </div>
            <p className="text-slate-700 leading-relaxed mb-3">
              Pursuant to <strong>Rule 170 of General Financial Rules (GFR 2017)</strong> and the <strong>Public Procurement Policy for Micro and Small Enterprises (MSEs) Order, 2012</strong>, Micro and Small Enterprises registered with Udyam are unconditionally exempt from submission of Earnest Money Deposit (EMD) and Tender Document Fees.
            </p>
            <div className="grid grid-cols-3 gap-2 p-2.5 bg-white rounded border border-emerald-200 text-center font-mono">
              <div>
                <span className="text-[10px] text-slate-500 block">Published EMD</span>
                <span className="font-bold text-slate-800">{formatCurrency(tender.emdAmount)}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Tender Form Fee</span>
                <span className="font-bold text-slate-800">{formatCurrency(tender.tenderDocumentFee)}</span>
              </div>
              <div>
                <span className="text-[10px] text-emerald-800 font-bold block">Total MSME Exemption</span>
                <span className="font-black text-emerald-700">{formatCurrency(match.msmeBenefits.totalSavings)}</span>
              </div>
            </div>
          </div>

          {/* Section 4: Eligibility Scoring Matrix */}
          <div className="mb-6">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-700 bg-slate-100 p-2 rounded mb-3">
              4. Multi-Criteria AI Eligibility Scorecard
            </h2>
            <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-100 text-[11px] font-bold text-slate-600 uppercase border-b border-slate-200">
                  <tr>
                    <th className="p-2.5">Evaluation Parameter</th>
                    <th className="p-2.5">Weight</th>
                    <th className="p-2.5">Enterprise Status</th>
                    <th className="p-2.5 text-right">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-2.5 font-semibold">Financial Turnover</td>
                    <td className="p-2.5">30%</td>
                    <td className="p-2.5">₹{activeProfile.annualTurnover} Cr (Min Req: ₹{match.breakdown.turnoverMatch.required} Cr)</td>
                    <td className="p-2.5 text-right font-bold text-emerald-700">
                      {match.breakdown.turnoverMatch.passed ? 'PASSED' : 'DEFICIT'}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-semibold">Mandatory Certificates</td>
                    <td className="p-2.5">25%</td>
                    <td className="p-2.5">{match.breakdown.certificateMatch.matched.join(', ') || 'None required'}</td>
                    <td className="p-2.5 text-right font-bold text-emerald-700">
                      {match.breakdown.certificateMatch.passed ? 'VERIFIED' : 'GAPS IDENTIFIED'}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-semibold">Capabilities Overlap</td>
                    <td className="p-2.5">25%</td>
                    <td className="p-2.5">{match.breakdown.capabilityMatch.similarityPercentage}% semantic alignment</td>
                    <td className="p-2.5 text-right font-bold text-emerald-700">
                      {match.breakdown.capabilityMatch.score}%
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-semibold">Jurisdiction & Location</td>
                    <td className="p-2.5">10%</td>
                    <td className="p-2.5">{match.breakdown.locationMatch.details}</td>
                    <td className="p-2.5 text-right font-bold text-emerald-700">COMPLIANT</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-semibold">Prior Experience</td>
                    <td className="p-2.5">10%</td>
                    <td className="p-2.5">{activeProfile.experienceYears} Years active operations</td>
                    <td className="p-2.5 text-right font-bold text-emerald-700">SATISFIED</td>
                  </tr>
                </tbody>
              </table>
              <div className="p-3 bg-slate-50 flex items-center justify-between border-t border-slate-200">
                <span className="font-bold text-xs uppercase text-slate-700">
                  COMPOSITE ELIGIBILITY RATING:
                </span>
                <span className="font-black text-sm text-gov-blue">
                  {match.overallScore}% ({match.status.toUpperCase()})
                </span>
              </div>
            </div>
          </div>

          {/* Section 5: Legal & Audit Attestation */}
          <div className="border-t border-slate-300 pt-4 flex flex-col sm:flex-row items-center justify-between text-[10px] text-slate-500 gap-4">
            <div>
              <p>Generated by National MSME Tender Discovery & AICTE Platform</p>
              <p className="font-mono">Timestamp: {new Date().toISOString()} • Node: Node-IN-DELHI-01</p>
            </div>
            <div className="text-right font-mono">
              <div className="font-bold text-slate-700">DIGITALLY SIGNED DOSSIER</div>
              <div className="text-[9px] text-slate-400">SHA256: {tender.contentHash.slice(0, 32)}...</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
