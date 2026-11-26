'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { StudentComplaint } from '@/lib/types';
import {
  AlertTriangle,
  ShieldAlert,
  Send,
  FileCheck2,
  Clock,
  CheckCircle2,
  Building,
  User,
  GraduationCap,
  Sparkles,
  Phone,
  Mail,
  DollarSign,
} from 'lucide-react';

export default function StudentComplaintsPage() {
  const { complaints, submitComplaint } = useApp();

  const [studentName, setStudentName] = useState('');
  const [studentRollNo, setStudentRollNo] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [recruiterEmail, setRecruiterEmail] = useState('');
  const [recruiterPhone, setRecruiterPhone] = useState('');
  const [scamType, setScamType] = useState<StudentComplaint['scamType']>('Upfront Fee Demanded');
  const [feeDemandedAmount, setFeeDemandedAmount] = useState<number>(3000);
  const [description, setDescription] = useState('');
  const [evidenceText, setEvidenceText] = useState('');
  const [submittedFeedback, setSubmittedFeedback] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName || !companyName || !description) return;

    submitComplaint({
      studentName,
      studentRollNo,
      collegeName,
      companyName,
      recruiterEmail,
      recruiterPhone,
      scamType,
      feeDemandedAmount: Number(feeDemandedAmount) || undefined,
      description,
      evidenceText,
    });

    setSubmittedFeedback(true);
    setCompanyName('');
    setDescription('');
    setEvidenceText('');
    setTimeout(() => setSubmittedFeedback(false), 5000);
  };

  const getStatusBadge = (status: StudentComplaint['status']) => {
    switch (status) {
      case 'Company Blacklisted & Resolved':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'Escalated to Cyber Cell':
        return 'bg-red-100 text-red-900 border-red-300 animate-pulse';
      case 'Under AICTE Review':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      default:
        return 'bg-blue-100 text-blue-900 border-blue-300';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-bold text-red-600 uppercase tracking-wider mb-1">
          <AlertTriangle className="h-4 w-4" />
          <span>AICTE National Grievance Redressal Mechanism</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Student Internship Scam Reporting & Redressal Cell
        </h1>
        <p className="text-xs text-slate-500">
          File a formal grievance against fraudulent recruitment syndicates demanding money or issuing fake certificates. Submissions are reviewed by the AICTE Cyber Cell.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Complaint Submission Form (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
            <ShieldAlert className="h-4 w-4 text-red-600" />
            <span>Lodge Formal Fraud Grievance</span>
          </h2>

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Your Full Name:</label>
                <input
                  type="text"
                  required
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 outline-none focus:ring-1 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Roll / Reg Number:</label>
                <input
                  type="text"
                  required
                  value={studentRollNo}
                  onChange={(e) => setStudentRollNo(e.target.value)}
                  placeholder="e.g. 12401916"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 outline-none focus:ring-1 focus:ring-red-500"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">College / University Name:</label>
              <input
                type="text"
                required
                value={collegeName}
                onChange={(e) => setCollegeName(e.target.value)}
                placeholder="e.g. Lovely Professional University"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Fraudulent Entity / Company Name:</label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Apex Global Tech Solutions"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 outline-none focus:ring-1 focus:ring-red-500 font-bold"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Recruiter Email:</label>
                <input
                  type="text"
                  value={recruiterEmail}
                  onChange={(e) => setRecruiterEmail(e.target.value)}
                  placeholder="e.g. scammer@gmail.com"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 outline-none focus:ring-1 focus:ring-red-500 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Recruiter Phone / UPI:</label>
                <input
                  type="text"
                  value={recruiterPhone}
                  onChange={(e) => setRecruiterPhone(e.target.value)}
                  placeholder="+91 98765..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 outline-none focus:ring-1 focus:ring-red-500 font-mono text-[11px]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Scam Pattern:</label>
                <select
                  value={scamType}
                  onChange={(e) => setScamType(e.target.value as any)}
                  className="w-full px-2.5 py-2 rounded-lg border border-slate-300 bg-white font-medium outline-none text-xs"
                >
                  <option value="Upfront Fee Demanded">Upfront Fee Demanded</option>
                  <option value="Fake Offer Letter">Fake Offer Letter</option>
                  <option value="Unpaid Labor / Breach">Unpaid Labor / Breach</option>
                  <option value="Ghost Company / Fake Certificate">Ghost Company / Fake Certificate</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Fee Demanded (₹):</label>
                <input
                  type="number"
                  min="0"
                  value={feeDemandedAmount}
                  onChange={(e) => setFeeDemandedAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Incident Narrative:</label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain how you were contacted, what was promised, and why money was demanded..."
                className="w-full p-2.5 rounded-lg border border-slate-300 outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Evidence Text / Payment Link / UPI Handle:</label>
              <input
                type="text"
                value={evidenceText}
                onChange={(e) => setEvidenceText(e.target.value)}
                placeholder="e.g. UPI Link: upi://pay?pa=scammer@oksbi or WhatsApp chat transcript excerpt"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono text-[11px]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs transition flex items-center justify-center space-x-2 shadow-md"
            >
              <Send className="h-4 w-4" />
              <span>Submit Formal Grievance to AICTE</span>
            </button>

            {submittedFeedback && (
              <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-lg font-bold flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Grievance lodged successfully! Assigned Ticket Tracking ID.</span>
              </div>
            )}
          </form>
        </div>

        {/* Right Column: Live Grievance Tracking Board (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
                <FileCheck2 className="h-4 w-4 text-gov-blue" />
                <span>Active Grievance Triage & Resolution Feed</span>
              </h2>
              <span className="text-xs font-mono font-bold text-slate-500">
                {complaints.length} Total Cases
              </span>
            </div>

            <div className="space-y-3">
              {complaints.map((c) => (
                <div
                  key={c.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white transition space-y-2.5 text-xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {c.id}
                      </span>
                      <span className="font-extrabold text-slate-900 text-sm">
                        {c.companyName}
                      </span>
                    </div>

                    <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] border ${getStatusBadge(c.status)}`}>
                      {c.status}
                    </span>
                  </div>

                  <p className="text-slate-700 leading-relaxed">
                    {c.description}
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-2.5 rounded-lg bg-white border border-slate-200/80 text-[11px]">
                    <div>
                      <span className="text-slate-400 block">Complainant</span>
                      <span className="font-bold text-slate-800">{c.studentName} ({c.studentRollNo})</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Scam Category</span>
                      <span className="font-bold text-red-700">{c.scamType}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Fee Extortion</span>
                      <span className="font-mono font-bold text-slate-900">
                        {c.feeDemandedAmount ? `₹${c.feeDemandedAmount.toLocaleString('en-IN')}` : 'N/A'}
                      </span>
                    </div>
                  </div>

                  {c.evidenceText && (
                    <div className="text-[11px] font-mono text-slate-600 bg-slate-100 p-2 rounded truncate">
                      Evidence: {c.evidenceText}
                    </div>
                  )}

                  {c.adminRemarks && (
                    <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-950 font-medium text-[11px]">
                      <strong>AICTE Cyber Cell Action: </strong>
                      {c.adminRemarks}
                    </div>
                  )}

                  <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1">
                    <span>Filed: {new Date(c.filedDate).toLocaleDateString()}</span>
                    <span>Recruiter: {c.recruiterEmail || c.recruiterPhone || 'Not provided'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
