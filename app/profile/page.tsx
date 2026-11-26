'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { calculateMsmeClassification, getCertificateStatus } from '@/lib/classificationEngine';
import { CompanyProfile, Certificate } from '@/lib/types';
import {
  Building2,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Award,
  Calendar,
  Save,
  Plus,
  Trash2,
  FileCheck2,
  Sliders,
  Sparkles,
  Info,
} from 'lucide-react';

export default function ProfilePage() {
  const { activeProfile, saveProfileChanges, logEvent } = useApp();

  const [formData, setFormData] = useState<CompanyProfile>({ ...activeProfile });
  const [newCapInput, setNewCapInput] = useState('');
  const [savedFeedback, setSavedFeedback] = useState(false);

  // New certificate modal state
  const [newCertName, setNewCertName] = useState('');
  const [newCertCode, setNewCertCode] = useState('');
  const [newCertExpiry, setNewCertExpiry] = useState('');

  // Live auto-classification preview
  const liveClassification = calculateMsmeClassification(
    Number(formData.investmentInPlantMachinery) || 0,
    Number(formData.annualTurnover) || 0
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: CompanyProfile = {
      ...formData,
      annualTurnover: Number(formData.annualTurnover),
      investmentInPlantMachinery: Number(formData.investmentInPlantMachinery),
      msmeCategory: liveClassification.category,
    };
    saveProfileChanges(updated);
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 3000);
  };

  const handleAddCapability = () => {
    if (newCapInput.trim() && !formData.capabilities.includes(newCapInput.trim())) {
      setFormData({
        ...formData,
        capabilities: [...formData.capabilities, newCapInput.trim()],
      });
      setNewCapInput('');
    }
  };

  const handleRemoveCapability = (capToRemove: string) => {
    setFormData({
      ...formData,
      capabilities: formData.capabilities.filter((c) => c !== capToRemove),
    });
  };

  const handleAddCertificate = () => {
    if (newCertName && newCertCode && newCertExpiry) {
      const { status } = getCertificateStatus(newCertExpiry);
      const newCert: Certificate = {
        id: `cert-${Date.now().toString().slice(-5)}`,
        name: newCertName,
        code: newCertCode.toUpperCase(),
        issuedBy: 'Accreditation Body',
        issueDate: new Date().toISOString().split('T')[0],
        expiryDate: newCertExpiry,
        isVerified: true,
        status,
      };
      setFormData({
        ...formData,
        certificates: [...formData.certificates, newCert],
      });
      setNewCertName('');
      setNewCertCode('');
      setNewCertExpiry('');
    }
  };

  const handleRemoveCertificate = (id: string) => {
    setFormData({
      ...formData,
      certificates: formData.certificates.filter((c) => c.id !== id),
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-gov-blue uppercase tracking-wider mb-1">
            <Building2 className="h-4 w-4 text-emerald-600" />
            <span>Enterprise Registry & Statutory Compliance</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Company Profile & Automatic MSME Classification
          </h1>
          <p className="text-xs text-slate-500">
            Maintain statutory financial data, Udyam certificates, and core capabilities. All tender match scores update instantly.
          </p>
        </div>

        {/* AICTE Verified Partner Badge */}
        <div className="flex items-center space-x-2 bg-emerald-50 border border-emerald-300 p-2.5 rounded-xl text-xs">
          <ShieldCheck className="h-5 w-5 text-emerald-600" />
          <div>
            <span className="font-extrabold text-emerald-950 block">AICTE Verified Partner</span>
            <span className="text-[10px] text-emerald-800">Eligible to host student apprentices</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Statutory MSME Classification Hero Card */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-gov-navy to-slate-900 text-white shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-4 w-4 text-gov-gold" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                Official Ministry of MSME 2020 Auto-Classification Engine
              </span>
            </div>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-white/10 text-slate-200">
              Gazette Notification S.O. 2119(E)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Computed Category Badge */}
            <div className="p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
              <span className="text-[11px] text-slate-300 uppercase font-bold block mb-1">
                Calculated Statutory Class
              </span>
              <div className="text-2xl sm:text-3xl font-black text-emerald-400">
                {liveClassification.category} Enterprise
              </div>
              <span className="text-xs text-slate-300 mt-1 block">
                {liveClassification.isEligibleForMseQuota ? '✓ 25% MSE Procurement Priority' : 'Large Scale / Standard'}
              </span>
            </div>

            {/* Investment Input */}
            <div>
              <label className="text-xs font-bold text-slate-200 block mb-1">
                Investment in Plant & Machinery (₹ Cr):
              </label>
              <input
                type="number"
                step="0.05"
                min="0"
                value={formData.investmentInPlantMachinery}
                onChange={(e) =>
                  setFormData({ ...formData, investmentInPlantMachinery: parseFloat(e.target.value) || 0 })
                }
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-600 text-white font-mono text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Micro ≤ ₹1 Cr | Small ≤ ₹10 Cr | Medium ≤ ₹50 Cr
              </span>
            </div>

            {/* Turnover Input */}
            <div>
              <label className="text-xs font-bold text-slate-200 block mb-1">
                Annual Turnover (₹ Cr):
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={formData.annualTurnover}
                onChange={(e) =>
                  setFormData({ ...formData, annualTurnover: parseFloat(e.target.value) || 0 })
                }
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-600 text-white font-mono text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Micro ≤ ₹5 Cr | Small ≤ ₹50 Cr | Medium ≤ ₹250 Cr
              </span>
            </div>
          </div>

          <div className="text-xs text-slate-300 bg-slate-800/80 p-3 rounded-lg border border-slate-700 font-medium">
            💡 <strong>Statutory Criteria Rationale: </strong>
            {liveClassification.explanation}
          </div>
        </div>

        {/* Section 1: Enterprise Legal Identifiers */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
            <Building2 className="h-4 w-4 text-gov-blue" />
            <span>1. Legal & Statutory Identifiers</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Legal Entity Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-1 focus:ring-gov-blue outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Trade / Brand Name</label>
              <input
                type="text"
                value={formData.tradeName}
                onChange={(e) => setFormData({ ...formData, tradeName: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-1 focus:ring-gov-blue outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Udyam Registration Number</label>
              <input
                type="text"
                value={formData.udyamNumber}
                onChange={(e) => setFormData({ ...formData, udyamNumber: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono font-bold text-gov-blue focus:ring-1 focus:ring-gov-blue outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">GSTIN</label>
              <input
                type="text"
                value={formData.gstin}
                onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono focus:ring-1 focus:ring-gov-blue outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Corporate CIN</label>
              <input
                type="text"
                value={formData.cin}
                onChange={(e) => setFormData({ ...formData, cin: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono focus:ring-1 focus:ring-gov-blue outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Years of Operation</label>
              <input
                type="number"
                value={formData.experienceYears}
                onChange={(e) => setFormData({ ...formData, experienceYears: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-1 focus:ring-gov-blue outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Industry & Geographic Scope */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
            <Sliders className="h-4 w-4 text-gov-blue" />
            <span>2. Industry Taxonomy & Location</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Primary Industry</label>
              <input
                type="text"
                value={formData.primaryIndustry}
                onChange={(e) => setFormData({ ...formData, primaryIndustry: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-1 focus:ring-gov-blue outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Registered State</label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-1 focus:ring-gov-blue outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Registered City / District</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-1 focus:ring-gov-blue outline-none"
              />
            </div>

            <div className="col-span-full pt-1">
              <label className="inline-flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isPanIndia}
                  onChange={(e) => setFormData({ ...formData, isPanIndia: e.target.checked })}
                  className="rounded text-gov-blue focus:ring-gov-blue h-4 w-4"
                />
                <span className="font-bold text-slate-800 text-xs">
                  Pan-India Operational Footprint (Qualifies for national procurement notices across all states)
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Section 3: Statutory Certificates with Expiry Tracking */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
              <Award className="h-4 w-4 text-gov-blue" />
              <span>3. Statutory Certificates & Expiry Alerts</span>
            </h2>
            <span className="text-xs text-slate-500 font-medium">
              {formData.certificates.length} registered accreditation(s)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {formData.certificates.map((cert) => {
              const { status, daysRemaining } = getCertificateStatus(cert.expiryDate);
              const badgeClass =
                status === 'Active'
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  : status === 'ExpiringSoon'
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : 'bg-red-100 text-red-900 border-red-300';

              return (
                <div
                  key={cert.id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex items-start justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-mono font-bold text-slate-900">{cert.code}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${badgeClass}`}>
                        {status === 'Active'
                          ? 'Active'
                          : status === 'ExpiringSoon'
                          ? `Expiring in ${daysRemaining}d`
                          : 'Expired'}
                      </span>
                    </div>
                    <div className="font-semibold text-slate-700">{cert.name}</div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      Expires: {cert.expiryDate} • Issued by {cert.issuedBy}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveCertificate(cert.id)}
                    className="text-slate-400 hover:text-red-600 p-1"
                    title="Remove certificate"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Add New Certificate Form */}
          <div className="p-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 text-xs space-y-3">
            <span className="font-bold text-slate-900 block">+ Add Accreditation / Certificate:</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Certificate Name (e.g. ISO 27001)"
                value={newCertName}
                onChange={(e) => setNewCertName(e.target.value)}
                className="px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white outline-none"
              />
              <input
                type="text"
                placeholder="Code (e.g. ISO 27001)"
                value={newCertCode}
                onChange={(e) => setNewCertCode(e.target.value)}
                className="px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white outline-none font-mono"
              />
              <input
                type="date"
                value={newCertExpiry}
                onChange={(e) => setNewCertExpiry(e.target.value)}
                className="px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white outline-none font-mono"
              />
            </div>
            <button
              type="button"
              onClick={handleAddCertificate}
              className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs"
            >
              Add Certificate
            </button>
          </div>
        </div>

        {/* Section 4: Capabilities & Keyword Tags */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
            <Sparkles className="h-4 w-4 text-gov-blue" />
            <span>4. Capabilities & Procurement Keywords</span>
          </h2>

          <div className="flex flex-wrap gap-2">
            {formData.capabilities.map((cap) => (
              <span
                key={cap}
                className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-blue-50 text-gov-blue text-xs font-semibold border border-blue-200"
              >
                <span>{cap}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveCapability(cap)}
                  className="hover:text-red-600"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <input
              type="text"
              value={newCapInput}
              onChange={(e) => setNewCapInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCapability())}
              placeholder="Add capability tag (e.g. 'Kubernetes', 'Solar PV', 'VAPT', 'HVAC Maintenance')..."
              className="flex-1 px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-1 focus:ring-gov-blue outline-none"
            />
            <button
              type="button"
              onClick={handleAddCapability}
              className="px-4 py-2 rounded-lg bg-gov-navy hover:bg-gov-blue text-white font-bold text-xs"
            >
              Add Tag
            </button>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div>
            {savedFeedback && (
              <span className="text-xs font-bold text-emerald-700 flex items-center space-x-1">
                <CheckCircle2 className="h-4 w-4" />
                <span>Profile saved successfully! Tender match scores recalculated.</span>
              </span>
            )}
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs inline-flex items-center space-x-2 shadow-md transition"
          >
            <Save className="h-4 w-4" />
            <span>Save Profile & Recalculate Matches</span>
          </button>
        </div>
      </form>
    </div>
  );
}
