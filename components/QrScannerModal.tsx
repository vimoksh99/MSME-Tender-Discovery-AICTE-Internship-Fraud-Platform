'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { analyzeInternshipFraud } from '@/lib/fraudDetectionEngine';
import { QrCode, X, CheckCircle2, AlertTriangle, ShieldCheck, ShieldAlert, Sparkles, KeyRound } from 'lucide-react';

export default function QrScannerModal() {
  const { qrModalOpen, setQrModalOpen, logEvent } = useApp();

  const [qrInput, setQrInput] = useState('');
  const [digitalHashInput, setDigitalHashInput] = useState('');
  const [studentNameInput, setStudentNameInput] = useState('');
  const [serialInput, setSerialInput] = useState('');
  const [result, setResult] = useState<any | null>(null);

  if (!qrModalOpen) return null;

  const handleTestPreset = (presetType: 'valid' | 'scam' | 'duplicate') => {
    if (presetType === 'valid') {
      setQrInput('https://verify.aicte-india.org/token/AICTE-2026-NEAT-99120');
      setDigitalHashInput('a8b79c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef');
      setStudentNameInput('TechNova Intern Candidate');
      setSerialInput('CERT-NEW-GENUINE-2026');
    } else if (presetType === 'scam') {
      setQrInput('http://aicte-online-gov.in/payment/verify?id=99281');
      setDigitalHashInput('invalid-short-hash-tampered');
      setStudentNameInput('Unsuspecting Student');
      setSerialInput('SCAM-FAKE-001');
    } else {
      setQrInput('AICTE-SECURE-SHA256:recycled-token-4412');
      setDigitalHashInput('998877665544332211ffeeddccbbaa00998877665544332211ffeeddccbbaa00');
      setStudentNameInput('Vikram Singh'); // Different from original holder 'Rahul Sharma'
      setSerialInput('CERT-AICTE-2025-9811'); // Registered to Rahul Sharma!
    }
  };

  const handleScan = () => {
    const analysis = analyzeInternshipFraud({
      textToScan: 'QR Code & Digital Credential Verification Request',
      qrPayload: qrInput,
      digitalSignatureHash: digitalHashInput,
      claimedStudentName: studentNameInput,
      certificateSerialNumber: serialInput,
    });
    setResult(analysis);
    logEvent(
      'QR Code Verification Scan',
      'Fraud Check',
      `Scanned payload "${qrInput.slice(0, 40)}...". Result: Risk ${analysis.riskScore}% (${analysis.riskLevel}).`
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm p-4 flex items-center justify-center animate-in fade-in">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-300 overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs font-bold">
            <QrCode className="h-4 w-4 text-emerald-400" />
            <span>AICTE QR CODE & DIGITAL SIGNATURE AUTHENTICITY VALIDATOR</span>
          </div>
          <button
            onClick={() => setQrModalOpen(false)}
            className="p-1 rounded text-slate-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6 space-y-5 text-xs text-slate-700">
          <p className="text-slate-600">
            Validate whether a certificate QR code or digital signature seal genuinely originates from AICTE e-Governance servers or is a forged replica.
          </p>

          {/* Quick Demo Presets */}
          <div>
            <span className="font-bold text-slate-900 block mb-1.5">
              1-Click Demo Test Presets:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleTestPreset('valid')}
                className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-300 font-semibold hover:bg-emerald-100"
              >
                ✓ Genuine AICTE Certificate QR
              </button>
              <button
                onClick={() => handleTestPreset('scam')}
                className="px-2.5 py-1 rounded-lg bg-red-50 text-red-800 border border-red-300 font-semibold hover:bg-red-100"
              >
                🚨 Forged Lookalike Scam QR
              </button>
              <button
                onClick={() => handleTestPreset('duplicate')}
                className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-300 font-semibold hover:bg-amber-100"
              >
                ⚠️ Recycled / Duplicate Serial
              </button>
            </div>
          </div>

          {/* Input Fields */}
          <div className="space-y-3">
            <div>
              <label className="font-bold text-slate-900 block mb-1">
                Scanned QR Payload or URL:
              </label>
              <input
                type="text"
                value={qrInput}
                onChange={(e) => setQrInput(e.target.value)}
                placeholder="e.g. https://verify.aicte-india.org/token/AICTE-2026-..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-gov-blue outline-none text-xs font-mono"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-900 block mb-1">
                  Certificate Serial Number:
                </label>
                <input
                  type="text"
                  value={serialInput}
                  onChange={(e) => setSerialInput(e.target.value)}
                  placeholder="e.g. CERT-AICTE-2025-9811"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-gov-blue outline-none text-xs font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-900 block mb-1">
                  Claimed Student Name:
                </label>
                <input
                  type="text"
                  value={studentNameInput}
                  onChange={(e) => setStudentNameInput(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-gov-blue outline-none text-xs"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-900 block mb-1">
                Digital Signature SHA-256 Stamp (Optional):
              </label>
              <input
                type="text"
                value={digitalHashInput}
                onChange={(e) => setDigitalHashInput(e.target.value)}
                placeholder="64-character hexadecimal SHA-256 hash"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-gov-blue outline-none text-xs font-mono"
              />
            </div>
          </div>

          <button
            onClick={handleScan}
            className="w-full py-2.5 rounded-xl bg-gov-navy hover:bg-gov-blue text-white font-bold transition flex items-center justify-center space-x-2 shadow-md"
          >
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Execute Cryptographic Authenticity Audit</span>
          </button>

          {/* Results Display */}
          {result && (
            <div className={`p-4 rounded-xl border mt-4 space-y-3 animate-in fade-in ${
              result.riskScore >= 60
                ? 'bg-red-50 border-red-200 text-red-950'
                : result.riskScore >= 30
                ? 'bg-amber-50 border-amber-200 text-amber-950'
                : 'bg-emerald-50 border-emerald-200 text-emerald-950'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {result.riskScore < 30 ? (
                    <ShieldCheck className="h-5 w-5 text-emerald-600" />
                  ) : (
                    <ShieldAlert className="h-5 w-5 text-red-600" />
                  )}
                  <span className="font-black text-sm uppercase">
                    {result.riskLevel}
                  </span>
                </div>
                <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-white/80">
                  Risk Score: {result.riskScore}/100
                </span>
              </div>

              {result.qrValidation && (
                <div className="p-3 bg-white/90 rounded-lg border border-slate-200 space-y-1">
                  <div className="flex justify-between">
                    <span className="font-bold">QR Destination Validity:</span>
                    <span className={`font-bold ${result.qrValidation.isValid ? 'text-emerald-700' : 'text-red-600'}`}>
                      {result.qrValidation.isValid ? '✓ Genuine AICTE Portal' : '✕ Forged External URL'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500">Issuer: </span>
                    <span className="font-semibold">{result.qrValidation.issuer}</span>
                  </div>
                  <div className="font-mono text-[11px] truncate text-slate-500">
                    Target: {result.qrValidation.verificationUrl}
                  </div>
                </div>
              )}

              {/* Forensic Evidence Items */}
              {result.explainableEvidence.length > 0 && (
                <div className="space-y-2 pt-1">
                  <span className="font-bold text-xs uppercase tracking-wide block">
                    Forensic Findings:
                  </span>
                  {result.explainableEvidence.map((ev: any, idx: number) => (
                    <div key={idx} className="p-2.5 rounded bg-white/90 border border-slate-200 text-xs">
                      <div className="flex justify-between font-bold text-slate-900 mb-0.5">
                        <span>{ev.label}</span>
                        <span className="text-red-700 uppercase font-mono text-[10px]">{ev.severity}</span>
                      </div>
                      <p className="text-slate-600 text-[11px]">{ev.explanation}</p>
                      <div className="text-[10px] font-mono text-slate-500 mt-1 bg-slate-50 p-1 rounded">
                        Evidence: {ev.rawEvidenceFound}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
