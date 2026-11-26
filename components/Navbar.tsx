'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
  ShieldCheck,
  Building2,
  GraduationCap,
  Briefcase,
  FileSearch,
  RefreshCw,
  Globe2,
  AlertTriangle,
  FileCheck2,
  SlidersHorizontal,
  ChevronDown,
  Layers,
  Sparkles,
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const {
    activeProfile,
    profiles,
    switchProfile,
    userRole,
    setUserRole,
    language,
    setLanguage,
    isSyncing,
    nextSyncCountdown,
    triggerSyncNow,
    t,
  } = useApp();

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [syncToast, setSyncToast] = useState<string | null>(null);

  const handleManualSync = async () => {
    const res = await triggerSyncNow();
    setSyncToast(res.message);
    setTimeout(() => setSyncToast(null), 4000);
  };

  const navLinks = [
    { href: '/', label: 'Overview', icon: Layers },
    { href: '/tenders', label: t('navTenders'), icon: FileSearch },
    { href: '/profile', label: t('navProfile'), icon: Building2 },
    { href: '/aicte/fraud-scanner', label: t('navAicteFraud'), icon: ShieldCheck, highlight: true },
    { href: '/aicte/internships', label: t('navInternships'), icon: GraduationCap },
    { href: '/collector', label: t('navCollector'), icon: RefreshCw },
    { href: '/aicte/complaints', label: t('navComplaints'), icon: AlertTriangle },
    { href: '/admin', label: t('navAdmin'), icon: SlidersHorizontal },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      {/* Top Government Tricolor & Security Bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-white to-emerald-600" />

      {/* Main Top Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Emblem */}
        <div className="flex items-center space-x-3">
          <div className="h-11 w-11 rounded-lg bg-gradient-to-br from-gov-navy to-gov-blue flex items-center justify-center text-white font-bold shadow-md ring-1 ring-slate-900/10">
            <ShieldCheck className="h-6 w-6 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-slate-900 tracking-tight text-lg sm:text-xl">
                MSME Tender<span className="text-gov-orange">&</span>AICTE Shield
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                Official GeM & AICTE Hub
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium hidden sm:block">
              {t('subtitle')}
            </p>
          </div>
        </div>

        {/* Action Center: Role Switcher, Profile Preset & Sync */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Periodic Sync Ticker & Button */}
          <button
            onClick={handleManualSync}
            disabled={isSyncing}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition border border-slate-300 disabled:opacity-50"
            title="Periodic tender collector monitors GeM, CPPP, IREPS, and Defense portals"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-gov-blue ${isSyncing ? 'animate-spin text-emerald-600' : ''}`} />
            <span>
              {isSyncing ? 'Syncing...' : `Sync (${nextSyncCountdown}s)`}
            </span>
          </button>

          {/* Role Switcher Pills */}
          <div className="inline-flex rounded-lg border border-slate-300 p-0.5 bg-slate-50 text-xs font-semibold">
            <button
              onClick={() => setUserRole('company')}
              className={`px-2.5 py-1 rounded-md transition flex items-center space-x-1 ${
                userRole === 'company'
                  ? 'bg-gov-blue text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="h-3 w-3" />
              <span>MSME</span>
            </button>
            <button
              onClick={() => setUserRole('student')}
              className={`px-2.5 py-1 rounded-md transition flex items-center space-x-1 ${
                userRole === 'student'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="h-3.5 w-3.5" />
              <span>Student</span>
            </button>
            <button
              onClick={() => setUserRole('admin')}
              className={`px-2.5 py-1 rounded-md transition flex items-center space-x-1 ${
                userRole === 'admin'
                  ? 'bg-gov-orange text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <SlidersHorizontal className="h-3 w-3" />
              <span>Admin</span>
            </button>
          </div>

          {/* Active Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-white border border-slate-300 hover:border-slate-400 shadow-sm text-slate-800"
            >
              <Building2 className="h-3.5 w-3.5 text-gov-blue" />
              <div className="text-left hidden md:block">
                <span className="block font-bold text-slate-900 truncate max-w-[130px]">
                  {activeProfile?.tradeName || activeProfile?.name}
                </span>
              </div>
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                activeProfile?.msmeCategory === 'Micro'
                  ? 'bg-purple-100 text-purple-700'
                  : activeProfile?.msmeCategory === 'Small'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-emerald-100 text-emerald-700'
              }`}>
                {activeProfile?.msmeCategory}
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>

            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Switch Active Enterprise Profile
                </div>
                {profiles.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      switchProfile(p.id);
                      setProfileDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs hover:bg-slate-50 transition flex items-start justify-between ${
                      p.id === activeProfile?.id ? 'bg-blue-50/70 border-l-4 border-gov-blue' : ''
                    }`}
                  >
                    <div>
                      <div className="font-bold text-slate-900">{p.tradeName || p.name}</div>
                      <div className="text-[11px] text-slate-500">
                        {p.primaryIndustry.slice(0, 32)}...
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        Turnover: ₹{p.annualTurnover} Cr • Plant: ₹{p.investmentInPlantMachinery} Cr
                      </div>
                    </div>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                      {p.msmeCategory}
                    </span>
                  </button>
                ))}
                <div className="border-t border-slate-100 px-3 pt-2">
                  <Link
                    href="/profile"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="text-xs text-gov-blue hover:underline font-semibold block text-center"
                  >
                    + Manage / Edit Company Profile
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            className="p-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 flex items-center space-x-1"
            title="Toggle Language: English / हिंदी"
          >
            <Globe2 className="h-3.5 w-3.5 text-gov-orange" />
            <span className="uppercase">{language}</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav className="bg-slate-50/80 border-t border-slate-200/80 px-4 sm:px-6 lg:px-8 overflow-x-auto">
        <div className="max-w-7xl mx-auto flex items-center space-x-1 py-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition ${
                  isActive
                    ? 'bg-gov-navy text-white shadow-sm'
                    : link.highlight
                    ? 'text-gov-red bg-red-50 hover:bg-red-100 font-bold border border-red-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-emerald-300' : ''}`} />
                <span>{link.label}</span>
                {link.highlight && (
                  <span className="flex h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Temporary Sync Notification Toast */}
      {syncToast && (
        <div className="bg-emerald-600 text-white text-xs py-1.5 px-4 text-center font-medium animate-in fade-in">
          {syncToast}
        </div>
      )}
    </header>
  );
}
