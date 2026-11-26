'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Internship } from '@/lib/types';
import {
  GraduationCap,
  ShieldCheck,
  Building2,
  MapPin,
  Calendar,
  DollarSign,
  Plus,
  X,
  Search,
  Sparkles,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';

export default function VerifiedInternshipsPage() {
  const { internships, activeProfile, createNewInternship } = useApp();

  const [search, setSearch] = useState('');
  const [modeFilter, setModeFilter] = useState<'All' | 'Remote' | 'On-site' | 'Hybrid'>('All');
  const [modalOpen, setModalOpen] = useState(false);

  // New internship form state
  const [newTitle, setNewTitle] = useState('');
  const [newLocation, setNewLocation] = useState(activeProfile.city + ', ' + activeProfile.state);
  const [newMode, setNewMode] = useState<'Remote' | 'On-site' | 'Hybrid'>('Hybrid');
  const [newStipend, setNewStipend] = useState(18000);
  const [newDuration, setNewDuration] = useState(6);
  const [newSkills, setNewSkills] = useState('React, TypeScript, Cloud Security');
  const [newDescription, setNewDescription] = useState('');

  const filteredInternships = internships.filter((item) => {
    if (search) {
      const q = search.toLowerCase();
      const match =
        item.title.toLowerCase().includes(q) ||
        item.companyName.toLowerCase().includes(q) ||
        item.requiredSkills.some((s) => s.toLowerCase().includes(q));
      if (!match) return false;
    }
    if (modeFilter !== 'All' && item.mode !== modeFilter) return false;
    return true;
  });

  const handlePostInternship = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    createNewInternship({
      title: newTitle,
      companyId: activeProfile.id,
      companyName: activeProfile.name,
      companyUdyam: activeProfile.udyamNumber,
      location: newLocation,
      mode: newMode,
      stipendMonthly: Number(newStipend),
      durationMonths: Number(newDuration),
      requiredSkills: newSkills.split(',').map((s) => s.trim()).filter(Boolean),
      openingsCount: 3,
      aicteApproved: true,
      verifiedPartner: true,
      deadline: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().split('T')[0],
      description: newDescription || `Apprenticeship offered by verified MSME ${activeProfile.name} in ${activeProfile.primaryIndustry}.`,
      contactEmail: activeProfile.contactEmail,
    });

    setModalOpen(false);
    setNewTitle('');
    setNewDescription('');
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>AICTE Shared Trust Bridge</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Verified MSME Apprenticeship Exchange
          </h1>
          <p className="text-xs text-slate-500">
            Exclusive to statutory verified MSMEs with zero fraud records. All postings guarantee transparent monthly stipends with zero fees.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs inline-flex items-center space-x-2 shadow-sm transition"
        >
          <Plus className="h-4 w-4" />
          <span>Post Verified Internship (as {activeProfile.tradeName})</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between text-xs">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search verified apprenticeships by title, company, or technical skills..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-1 focus:ring-emerald-500 outline-none"
          />
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <span className="font-bold text-slate-700">Mode:</span>
          <select
            value={modeFilter}
            onChange={(e) => setModeFilter(e.target.value as any)}
            className="px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs font-medium text-slate-800 outline-none"
          >
            <option value="All">All Modes</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Remote">Remote</option>
            <option value="On-site">On-site</option>
          </select>
        </div>
      </div>

      {/* Internships Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredInternships.map((int) => (
          <div
            key={int.id}
            className={`p-5 rounded-2xl border bg-white shadow-sm hover:shadow-md transition flex flex-col justify-between ${
              int.aicteApproved ? 'border-emerald-200' : 'border-red-200 bg-red-50/20'
            }`}
          >
            <div>
              {/* Card Top: Badges */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700">
                  {int.mode}
                </span>

                {int.aicteApproved ? (
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center space-x-1">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>AICTE Verified</span>
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-red-100 text-red-800 border border-red-300">
                    Flagged / Unverified
                  </span>
                )}
              </div>

              <h3 className="font-extrabold text-slate-900 text-base leading-snug hover:text-emerald-700 transition">
                {int.title}
              </h3>

              <div className="flex items-center space-x-1 text-xs text-slate-600 mt-1 mb-3">
                <Building2 className="h-3.5 w-3.5 text-slate-400" />
                <span className="font-bold text-slate-800">{int.companyName}</span>
              </div>

              <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed">
                {int.description}
              </p>

              {/* Stipend & Duration Banner */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 mb-4 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Monthly Stipend</span>
                  <span className="font-black text-emerald-700 text-sm">
                    ₹{int.stipendMonthly.toLocaleString('en-IN')}/mo
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Duration</span>
                  <span className="font-bold text-slate-800">
                    {int.durationMonths} Months
                  </span>
                </div>
              </div>

              {/* Required Skills */}
              <div className="flex flex-wrap gap-1 mb-4">
                {int.requiredSkills.map((sk) => (
                  <span
                    key={sk}
                    className="text-[10px] px-2 py-0.5 rounded font-semibold bg-slate-100 text-slate-700"
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            {/* Apply / Contact Footer */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-500 font-mono">
                Deadline: {int.deadline}
              </span>
              <a
                href={`mailto:${int.contactEmail}?subject=Application for ${encodeURIComponent(int.title)} (AICTE Portal)`}
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold transition text-xs inline-flex items-center space-x-1"
              >
                <span>Apply / Contact</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Post Internship Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm p-4 flex items-center justify-center animate-in fade-in">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-300 overflow-hidden">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs font-bold">
                <GraduationCap className="h-4 w-4 text-emerald-400" />
                <span>POST VERIFIED APPRENTICESHIP (AICTE PARTNERSHIP)</span>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handlePostInternship} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Apprenticeship / Job Title:
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Cloud Security & Microservices Engineering Intern"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-1 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Monthly Stipend (₹):</label>
                  <input
                    type="number"
                    required
                    min="1000"
                    value={newStipend}
                    onChange={(e) => setNewStipend(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Duration (Months):</label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="12"
                    value={newDuration}
                    onChange={(e) => setNewDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Working Mode:</label>
                  <select
                    value={newMode}
                    onChange={(e) => setNewMode(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                  >
                    <option value="Hybrid">Hybrid</option>
                    <option value="Remote">Remote</option>
                    <option value="On-site">On-site</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Location:</label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Required Skills (comma separated):
                </label>
                <input
                  type="text"
                  value={newSkills}
                  onChange={(e) => setNewSkills(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Job Description & Learning Outcomes:
                </label>
                <textarea
                  rows={4}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Describe practical projects, mentoring, and duties..."
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-xs outline-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition shadow-sm"
                >
                  Publish Verified Apprenticeship
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
