'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { analyzeInternshipFraud } from '@/lib/fraudDetectionEngine';
import { FraudAnalysisResult } from '@/lib/types';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  FileSearch,
  QrCode,
  Mail,
  Globe,
  Building,
  KeyRound,
  FileCheck2,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Info,
} from 'lucide-react';

export default function AicteFraudScannerPage() {
  const { setQrModalOpen, logEvent } = useApp();

  const [textInput, setTextInput] = useState('');
  const [recruiterEmail, setRecruiterEmail] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [gstin, setGstin] = useState('');
  const [cin, setCin] = useState('');
  const [analysisResult, setAnalysisResult] = useState<FraudAnalysisResult | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  // 1-Click Test Scenarios
  const handleLoadScenario = (type: 'scam-fee' | 'scam-phish' | 'verified-msme') => {
    if (type === 'scam-fee') {
      setTextInput(
        `CONGRATULATIONS! You have been selected for the National AICTE Web Developer Apprenticeship 2026.
Stipend: ₹35,000/month.
Direct Selection without interview.
To finalize your joining kit and laptop dispatch, you are required to pay a refundable security deposit and documentation processing fee of ₹3,500 via UPI (GPay/PhonePe) to hr.innotech@oksbi within 24 hours. Offer letter release fee applies.`
      );
      setRecruiterEmail('aicte.recruitment.official2026@gmail.com');
      setCompanyWebsite('http://aicte-internships-online.net');
      setGstin('07INVALID123');
      setCin('U12345DL2026PTC999999');
    } else if (type === 'scam-phish') {
      setTextInput(
        `Immediate Work From Home Internship for Freshers.
Earn up to ₹65,000 per month for part time data entry.
100% guaranteed job placement. No interview or test required.
Selected candidates must send Aadhaar OTP and share bank details for stipend disbursement verification.`
      );
      setRecruiterEmail('careers.apexgroup@yahoo.com');
      setCompanyWebsite('http://apex-global-offers.in');
      setGstin('');
      setCin('');
    } else {
      setTextInput(
        `TechNova Cyber & Cloud Systems is pleased to offer you the position of Cloud Security Research Intern.
Duration: 6 Months. Monthly Stipend: ₹22,000 (direct bank transfer).
This apprenticeship is approved under AICTE NEAT partnership.
Zero fees of any kind are payable by the applicant under AICTE National Internship Policy.`
      );
      setRecruiterEmail('internships@technova-systems.in');
      setCompanyWebsite('https://technova-systems.in');
      setGstin('07AAACT1234F1Z5');
      setCin('U72200DL2018PTC334512');
    }
  };

  const handleRunAnalysis = () => {
    if (!textInput.trim() && !recruiterEmail && !companyWebsite) {
      alert('Please enter offer letter text, recruiter email, or company website to scan.');
      return;
    }

    setIsScanning(true);
    setTimeout(() => {
      const result = analyzeInternshipFraud({
        textToScan: textInput,
        recruiterEmail,
        companyWebsite,
        gstin,
        cin,
      });
      setAnalysisResult(result);
      setIsScanning(false);
      logEvent(
        'Fraud Scanner Analysis',
        'Fraud Check',
        `Analyzed posting/offer letter. Risk: ${result.riskScore}% (${result.riskLevel}). Found ${result.explainableEvidence.length} evidence triggers.`
      );
    }, 400);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-red-600 uppercase tracking-wider mb-1">
            <ShieldAlert className="h-4 w-4" />
            <span>AICTE National Student Cyber Defense</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            AICTE Internship Fraud & Offer Letter Forensics Hub
          </h1>
          <p className="text-xs text-slate-500">
            Powered by explainable AI pattern heuristics to identify fee extortion, unverified recruiter webmails, and fraudulent certificates.
          </p>
        </div>

        <button
          onClick={() => setQrModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs inline-flex items-center space-x-2 shadow-sm"
        >
          <QrCode className="h-4 w-4 text-emerald-400" />
          <span>Launch QR Authenticity Validator</span>
        </button>
      </div>

      {/* 1-Click Interactive Demo Presets */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
        <span className="font-extrabold text-slate-800 flex items-center space-x-1.5">
          <Sparkles className="h-3.5 w-3.5 text-gov-orange" />
          <span>Quick Demo Test Scenarios (Click to Load & Test):</span>
        </span>
        <div className="flex flex-wrap gap-2 pt-1">
          <button
            onClick={() => handleLoadScenario('scam-fee')}
            className="px-3 py-1.5 rounded-lg bg-red-100 hover:bg-red-200 text-red-900 font-bold border border-red-300 transition"
          >
            🚨 Sample 1: Upfront ₹3,500 Fee Extortion & Free Gmail Recruiter
          </button>
          <button
            onClick={() => handleLoadScenario('scam-phish')}
            className="px-3 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold border border-amber-300 transition"
          >
            ⚠️ Sample 2: Exorbitant Fresher Stipend & Aadhaar OTP Phishing
          </button>
          <button
            onClick={() => handleLoadScenario('verified-msme')}
            className="px-3 py-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold border border-emerald-300 transition"
          >
            ✓ Sample 3: Legitimate AICTE Verified MSME Apprenticeship
          </button>
        </div>
      </div>

      {/* Main Scanner Form and Forensics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Input Form (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
            <FileSearch className="h-4 w-4 text-gov-blue" />
            <span>Inspection Parameters</span>
          </h2>

          <div>
            <label className="font-bold text-slate-800 text-xs block mb-1">
              Offer Letter Content or Internship Description:
            </label>
            <textarea
              rows={8}
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Paste offer letter text, WhatsApp message, email invite, or internship terms here..."
              className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-red-500 outline-none"
            />
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Recruiter Email Address:
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={recruiterEmail}
                  onChange={(e) => setRecruiterEmail(e.target.value)}
                  placeholder="e.g. hr@company.com or hr.xyz@gmail.com"
                  className="w-full pl-8 pr-3 py-2 rounded-lg border border-slate-300 text-xs outline-none focus:ring-1 focus:ring-red-500 font-mono"
                />
                <Mail className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Company Portal / Website URL:
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={companyWebsite}
                  onChange={(e) => setCompanyWebsite(e.target.value)}
                  placeholder="e.g. https://company.com"
                  className="w-full pl-8 pr-3 py-2 rounded-lg border border-slate-300 text-xs outline-none focus:ring-1 focus:ring-red-500 font-mono"
                />
                <Globe className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Claimed GSTIN:</label>
                <input
                  type="text"
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value)}
                  placeholder="15-char GSTIN"
                  className="w-full px-2.5 py-2 rounded-lg border border-slate-300 text-xs font-mono outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Claimed CIN:</label>
                <input
                  type="text"
                  value={cin}
                  onChange={(e) => setCin(e.target.value)}
                  placeholder="21-char CIN"
                  className="w-full px-2.5 py-2 rounded-lg border border-slate-300 text-xs font-mono outline-none"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleRunAnalysis}
            disabled={isScanning}
            className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs transition flex items-center justify-center space-x-2 shadow-md disabled:opacity-50"
          >
            <ShieldAlert className="h-4 w-4 text-white" />
            <span>{isScanning ? 'Executing Heuristic Audit...' : 'Run Explainable AI Fraud Scan'}</span>
          </button>
        </div>

        {/* Right Column: Explainable AI Forensic Results (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {analysisResult ? (
            <div className="space-y-4 animate-in fade-in">
              {/* Verdict Banner */}
              <div
                className={`p-6 rounded-2xl border shadow-sm ${
                  analysisResult.riskScore >= 60
                    ? 'bg-red-50 border-red-300 text-red-950'
                    : analysisResult.riskScore >= 30
                    ? 'bg-amber-50 border-amber-300 text-amber-950'
                    : 'bg-emerald-50 border-emerald-300 text-emerald-950'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`h-16 w-16 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-md ${
                        analysisResult.riskScore >= 60
                          ? 'bg-red-600'
                          : analysisResult.riskScore >= 30
                          ? 'bg-amber-600'
                          : 'bg-emerald-600'
                      }`}
                    >
                      {analysisResult.riskScore}%
                    </div>
                    <div>
                      <span className="text-xs uppercase font-extrabold tracking-wider block">
                        Fraud Threat Score
                      </span>
                      <h3 className="text-xl font-black">
                        {analysisResult.riskLevel}
                      </h3>
                      <p className="text-xs mt-0.5 opacity-90">
                        Recommended Action: <strong>{analysisResult.recommendedAction}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <Link
                      href="/aicte/complaints"
                      className="px-3.5 py-2 rounded-xl bg-red-700 hover:bg-red-800 text-white font-bold text-xs inline-flex items-center space-x-1 shadow-sm"
                    >
                      <span>File Grievance</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Explainable Evidence Chain Cards */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center space-x-2">
                    <FileCheck2 className="h-4 w-4 text-gov-blue" />
                    <span>Explainable Evidence Chain ({analysisResult.explainableEvidence.length} Found)</span>
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    Audit Date: {new Date(analysisResult.analyzedAt).toLocaleTimeString()}
                  </span>
                </div>

                {analysisResult.explainableEvidence.length > 0 ? (
                  <div className="space-y-3">
                    {analysisResult.explainableEvidence.map((ev, i) => (
                      <div
                        key={i}
                        className={`p-4 rounded-xl border text-xs space-y-1.5 ${
                          ev.severity === 'Critical'
                            ? 'bg-red-50/70 border-red-200 text-red-950'
                            : ev.severity === 'High'
                            ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                            : 'bg-blue-50/70 border-blue-200 text-blue-950'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-sm">{ev.label}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase bg-white/80 border border-slate-200">
                            {ev.severity} Severity
                          </span>
                        </div>
                        <p className="text-slate-700 leading-relaxed">{ev.explanation}</p>
                        <div className="p-2 rounded bg-white/90 border border-slate-200 font-mono text-[11px] text-slate-800">
                          {ev.rawEvidenceFound}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center text-slate-500 text-xs">
                    <ShieldCheck className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
                    <span className="font-bold text-slate-800 block text-sm">
                      Zero Known Fraud Patterns Identified
                    </span>
                    No upfront fee requests, suspicious public webmail domains, or coercive phrasing detected.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white p-12 rounded-2xl border border-dashed border-slate-300 text-center space-y-3 text-slate-500">
              <ShieldAlert className="h-10 w-10 text-slate-400 mx-auto" />
              <h3 className="font-bold text-slate-800 text-base">
                Forensics Engine Ready
              </h3>
              <p className="text-xs max-w-md mx-auto">
                Paste any suspicious internship invitation, email, or offer letter on the left to extract explainable evidence, or click one of the 1-click test scenario presets above.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
