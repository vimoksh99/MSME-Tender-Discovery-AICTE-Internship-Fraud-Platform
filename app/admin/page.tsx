'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { ComplaintStatus, AuditLog } from '@/lib/types';
import {
  SlidersHorizontal,
  ShieldCheck,
  Building2,
  AlertTriangle,
  FileCheck2,
  CheckCircle2,
  XCircle,
  Filter,
  Download,
  Search,
  Clock,
  Sparkles,
} from 'lucide-react';

export default function AdminPage() {
  const {
    profiles,
    complaints,
    auditLogs,
    adminUpdateComplaint,
    saveProfileChanges,
    tenders,
    logEvent,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'audit' | 'complaints' | 'companies'>('audit');
  const [auditFilter, setAuditFilter] = useState<'All' | AuditLog['category']>('All');
  const [auditSearch, setAuditSearch] = useState('');
  const [remarkInput, setRemarkInput] = useState<Record<string, string>>({});

  const filteredLogs = auditLogs.filter((log) => {
    if (auditFilter !== 'All' && log.category !== auditFilter) return false;
    if (auditSearch) {
      const q = auditSearch.toLowerCase();
      return (
        log.action.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q) ||
        log.role.toLowerCase().includes(q) ||
        log.id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleUpdateComplaintStatus = (
    id: string,
    newStatus: ComplaintStatus
  ) => {
    const remark = remarkInput[id] || 'Processed by Administrator';
    adminUpdateComplaint(id, newStatus, remark);
  };

  const handleToggleVerification = (profileId: string) => {
    const target = profiles.find((p) => p.id === profileId);
    if (!target) return;
    const newStatus = target.aicteVerificationStatus === 'Verified' ? 'Flagged' : 'Verified';
    saveProfileChanges({
      ...target,
      aicteVerificationStatus: newStatus,
      aicteVerificationBadgeDate: newStatus === 'Verified' ? new Date().toISOString() : undefined,
    });
    logEvent(
      'Enterprise Verification Status Toggled',
      'Admin',
      `Admin toggled verification for ${target.name} to ${newStatus}.`
    );
  };

  const exportAuditLogsJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(auditLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `aicte-msme-audit-logs-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-gov-orange uppercase tracking-wider mb-1">
            <SlidersHorizontal className="h-4 w-4" />
            <span>Master Governance & Compliance Console</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Administrator Portal & Immutable Audit Trail
          </h1>
          <p className="text-xs text-slate-500">
            Monitor tender ingestion telemetry, review student scam complaints, and manage enterprise AICTE verification credentials.
          </p>
        </div>

        <button
          onClick={exportAuditLogsJson}
          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs inline-flex items-center space-x-2 shadow-sm"
        >
          <Download className="h-4 w-4 text-emerald-400" />
          <span>Export Audit Trail (JSON)</span>
        </button>
      </div>

      {/* Admin KPI Quick Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
          <span className="text-slate-400 block font-bold uppercase text-[10px]">Tenders Monitored</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">{tenders.length}</span>
          <span className="text-[10px] text-emerald-600 font-semibold">Active GeM / CPPP sync</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
          <span className="text-slate-400 block font-bold uppercase text-[10px]">Registered MSMEs</span>
          <span className="text-2xl font-black text-gov-blue mt-1 block">{profiles.length}</span>
          <span className="text-[10px] text-slate-500">Statutory Udyam audited</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
          <span className="text-slate-400 block font-bold uppercase text-[10px]">Grievances Logged</span>
          <span className="text-2xl font-black text-red-600 mt-1 block">{complaints.length}</span>
          <span className="text-[10px] text-red-700 font-semibold">
            {complaints.filter((c) => c.status === 'Company Blacklisted & Resolved').length} Blacklisted
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
          <span className="text-slate-400 block font-bold uppercase text-[10px]">Audit Log Entries</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">{auditLogs.length}</span>
          <span className="text-[10px] text-slate-500">Immutable trail</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 flex space-x-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('audit')}
          className={`py-2.5 px-4 rounded-t-lg transition flex items-center space-x-2 ${
            activeTab === 'audit'
              ? 'bg-white border-t-2 border-gov-blue text-gov-blue shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Clock className="h-4 w-4" />
          <span>System Audit Trail ({auditLogs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('complaints')}
          className={`py-2.5 px-4 rounded-t-lg transition flex items-center space-x-2 ${
            activeTab === 'complaints'
              ? 'bg-white border-t-2 border-red-600 text-red-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <AlertTriangle className="h-4 w-4" />
          <span>Grievance Triage Console ({complaints.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('companies')}
          className={`py-2.5 px-4 rounded-t-lg transition flex items-center space-x-2 ${
            activeTab === 'companies'
              ? 'bg-white border-t-2 border-emerald-600 text-emerald-800 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Building2 className="h-4 w-4" />
          <span>Enterprise Verification Queue ({profiles.length})</span>
        </button>
      </div>

      {/* Tab 1: Audit Log Stream */}
      {activeTab === 'audit' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between text-xs">
            <div className="relative flex-1 w-full">
              <input
                type="text"
                value={auditSearch}
                onChange={(e) => setAuditSearch(e.target.value)}
                placeholder="Search audit trail by event action, role, or keywords..."
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-1 focus:ring-gov-blue outline-none"
              />
              <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <span className="font-bold text-slate-700">Category:</span>
              <select
                value={auditFilter}
                onChange={(e) => setAuditFilter(e.target.value as any)}
                className="px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs font-medium text-slate-800 outline-none"
              >
                <option value="All">All Categories</option>
                <option value="Tender">Tender Collection</option>
                <option value="Profile">Profile Updates</option>
                <option value="Fraud Check">Fraud Scans</option>
                <option value="Complaint">Complaints</option>
                <option value="Admin">Admin Actions</option>
              </select>
            </div>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {filteredLogs.map((log) => (
              <div key={log.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-slate-900 text-[11px] bg-slate-100 px-1.5 py-0.5 rounded">
                      {log.id}
                    </span>
                    <span className="font-extrabold text-slate-900">{log.action}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 uppercase">
                      {log.category}
                    </span>
                    <span className="text-[11px] font-bold text-gov-blue">
                      [{log.role}]
                    </span>
                  </div>
                  <p className="text-slate-600 text-xs">{log.details}</p>
                </div>
                <div className="text-right text-[11px] text-slate-400 font-mono flex-shrink-0">
                  {new Date(log.timestamp).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Grievance Triage Console */}
      {activeTab === 'complaints' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
            Student Complaint Adjudication Console
          </h2>

          <div className="space-y-4">
            {complaints.map((c) => (
              <div
                key={c.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3 text-xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="font-mono font-bold text-slate-900 mr-2">{c.id}</span>
                    <span className="font-extrabold text-slate-900 text-sm">
                      {c.companyName}
                    </span>
                    <span className="text-slate-500 ml-2">
                      ({c.studentName} - {c.collegeName})
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-white border border-slate-300">
                    Status: {c.status}
                  </span>
                </div>

                <p className="text-slate-700">{c.description}</p>

                {c.evidenceText && (
                  <div className="p-2 rounded bg-white font-mono text-[11px] text-slate-600">
                    Proof: {c.evidenceText}
                  </div>
                )}

                {/* Admin Status Actions */}
                <div className="p-3 bg-white rounded-lg border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <input
                    type="text"
                    placeholder="Enter adjudication remark..."
                    value={remarkInput[c.id] || ''}
                    onChange={(e) => setRemarkInput({ ...remarkInput, [c.id]: e.target.value })}
                    className="w-full sm:w-80 px-2.5 py-1.5 rounded border border-slate-300 text-xs"
                  />

                  <div className="flex flex-wrap gap-1.5">
                    <button
                      onClick={() => handleUpdateComplaintStatus(c.id, 'Under AICTE Review')}
                      className="px-2.5 py-1 rounded bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-[11px]"
                    >
                      Under Review
                    </button>
                    <button
                      onClick={() => handleUpdateComplaintStatus(c.id, 'Escalated to Cyber Cell')}
                      className="px-2.5 py-1 rounded bg-red-100 hover:bg-red-200 text-red-900 font-bold text-[11px]"
                    >
                      Escalate Cyber Cell
                    </button>
                    <button
                      onClick={() => handleUpdateComplaintStatus(c.id, 'Company Blacklisted & Resolved')}
                      className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px]"
                    >
                      Blacklist Entity
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Enterprise Verification Queue */}
      {activeTab === 'companies' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
            MSME Company Accreditation Verification Queue
          </h2>

          <div className="divide-y divide-slate-100 text-xs">
            {profiles.map((p) => (
              <div key={p.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-extrabold text-slate-900 text-sm">{p.name}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                      {p.msmeCategory}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        p.aicteVerificationStatus === 'Verified'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {p.aicteVerificationStatus}
                    </span>
                  </div>
                  <div className="text-slate-500">
                    Udyam: <span className="font-mono font-bold text-slate-700">{p.udyamNumber}</span> • GSTIN: {p.gstin} • State: {p.state}
                  </div>
                  <div className="text-slate-500 text-[11px]">
                    Turnover: ₹{p.annualTurnover} Cr • Plant & Machinery: ₹{p.investmentInPlantMachinery} Cr • Accreditations: {p.certificates.map((c) => c.code).join(', ')}
                  </div>
                </div>

                <div>
                  <button
                    onClick={() => handleToggleVerification(p.id)}
                    className={`px-3.5 py-1.5 rounded-lg font-bold text-xs transition ${
                      p.aicteVerificationStatus === 'Verified'
                        ? 'bg-red-100 hover:bg-red-200 text-red-800'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    }`}
                  >
                    {p.aicteVerificationStatus === 'Verified' ? 'Revoke Verification' : 'Grant AICTE Verified Partner'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
