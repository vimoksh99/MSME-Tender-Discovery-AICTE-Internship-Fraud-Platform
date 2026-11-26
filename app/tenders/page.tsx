'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import TenderCard from '@/components/TenderCard';
import { evaluateTenderEligibility } from '@/lib/matchingEngine';
import { Tender } from '@/lib/types';
import {
  FileSearch,
  Filter,
  RefreshCw,
  Upload,
  Sparkles,
  SlidersHorizontal,
  Building2,
  Calendar,
  CheckCircle2,
  AlertCircle,
  FileText,
  X,
  Layers,
} from 'lucide-react';

export default function TendersPage() {
  const {
    activeProfile,
    tenders,
    isSyncing,
    nextSyncCountdown,
    triggerSyncNow,
    importTendersData,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPortal, setSelectedPortal] = useState('All');
  const [eligibilityFilter, setEligibilityFilter] = useState<'All' | 'Eligible' | 'Partial' | 'Ineligible'>('All');
  const [mseReservedOnly, setMseReservedOnly] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [importFeedback, setImportFeedback] = useState<string | null>(null);

  // Extract unique categories and portals
  const categories = useMemo(() => {
    const set = new Set(tenders.map((t) => t.category));
    return ['All', ...Array.from(set)];
  }, [tenders]);

  const portals = useMemo(() => {
    const set = new Set(tenders.map((t) => t.portalSource));
    return ['All', ...Array.from(set)];
  }, [tenders]);

  // Compute matches and filter
  const filteredTendersWithMatch = useMemo(() => {
    return tenders
      .map((tender) => {
        const match = evaluateTenderEligibility(tender, activeProfile);
        return { tender, match };
      })
      .filter(({ tender, match }) => {
        // Query search
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          const matchesQuery =
            tender.title.toLowerCase().includes(q) ||
            tender.referenceNumber.toLowerCase().includes(q) ||
            tender.issuingAuthority.toLowerCase().includes(q) ||
            tender.category.toLowerCase().includes(q) ||
            tender.requiredCapabilities.some((c) => c.toLowerCase().includes(q));
          if (!matchesQuery) return false;
        }

        // Category filter
        if (selectedCategory !== 'All' && tender.category !== selectedCategory) {
          return false;
        }

        // Portal filter
        if (selectedPortal !== 'All' && tender.portalSource !== selectedPortal) {
          return false;
        }

        // Eligibility Filter
        if (eligibilityFilter !== 'All' && match.status !== eligibilityFilter) {
          return false;
        }

        // MSE Reserved filter
        if (mseReservedOnly && !tender.isReservedForMse) {
          return false;
        }

        return true;
      })
      .sort((a, b) => b.match.overallScore - a.match.overallScore);
  }, [tenders, activeProfile, searchQuery, selectedCategory, selectedPortal, eligibilityFilter, mseReservedOnly]);

  const handleManualImport = () => {
    try {
      const parsed = JSON.parse(importJsonText);
      const items: Tender[] = Array.isArray(parsed) ? parsed : [parsed];
      const res = importTendersData(items);
      setImportFeedback(`Processed ${items.length} records: ${res.added} added, ${res.duplicates} duplicates skipped.`);
      setTimeout(() => {
        setImportModalOpen(false);
        setImportJsonText('');
        setImportFeedback(null);
      }, 2000);
    } catch (e: any) {
      setImportFeedback('Invalid JSON format: ' + e.message);
    }
  };

  const loadSampleTenderJson = () => {
    const sample = [
      {
        id: `TND-MANUAL-${Date.now().toString().slice(-4)}`,
        referenceNumber: 'GEM/2026/B/CSV-91823',
        title: 'Custom Ingested Infrastructure & CCTV Network for National Highway Authority',
        description: 'Supply, installation and maintenance of IP-based PTZ cameras and traffic data collection nodes across highway toll plazas.',
        issuingAuthority: 'National Highways Authority of India (NHAI)',
        ministry: 'Ministry of Road Transport and Highways',
        portalSource: 'Manual Import',
        portalUrl: 'https://gem.gov.in/tenders/manual-nhai',
        category: 'Civil Infrastructure & Surveillance',
        locationRequirement: { isPanIndia: true },
        estimatedValue: 48000000,
        emdAmount: 960000,
        tenderDocumentFee: 10000,
        isEmdExemptForMsme: true,
        isReservedForMse: true,
        minTurnoverRequired: 6.0,
        msmeRelaxedTurnover: 3.5,
        minExperienceYears: 3,
        mandatoryCertificates: ['ISO 9001', 'UDYAM-MSME'],
        preferredCertificates: ['ZED-GOLD'],
        requiredCapabilities: ['Security Operations Center (SOC)', 'Enterprise Network Security'],
        publishDate: new Date().toISOString().split('T')[0],
        submissionDeadline: new Date(Date.now() + 15 * 24 * 3600 * 1000).toISOString(),
        openingDate: new Date(Date.now() + 16 * 24 * 3600 * 1000).toISOString(),
        status: 'Active',
        crawlTimestamp: new Date().toISOString(),
        contentHash: 'manual-hash-' + Math.random(),
      },
    ];
    setImportJsonText(JSON.stringify(sample, null, 2));
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header & Ingestion Controller */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-gov-blue uppercase tracking-wider mb-1">
            <FileSearch className="h-4 w-4 text-emerald-600" />
            <span>Permitted Public Procurement Discovery</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            MSME Tender Discovery & Real-Time Eligibility Matcher
          </h1>
          <p className="text-xs text-slate-500">
            Matching live public tenders from GeM, CPPP, IREPS, and Defense against <strong>{activeProfile.name}</strong> ({activeProfile.msmeCategory} Enterprise).
          </p>
        </div>

        {/* Sync & Import Actions */}
        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => setImportModalOpen(true)}
            className="px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold inline-flex items-center space-x-1.5 shadow-sm transition"
          >
            <Upload className="h-3.5 w-3.5 text-gov-blue" />
            <span>Import CSV/JSON Feed</span>
          </button>

          <button
            onClick={triggerSyncNow}
            disabled={isSyncing}
            className="px-4 py-2 rounded-xl bg-gov-navy hover:bg-gov-blue text-white text-xs font-bold inline-flex items-center space-x-1.5 shadow-md transition disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? 'animate-spin text-emerald-400' : ''}`} />
            <span>{isSyncing ? 'Synchronizing...' : `Sync Permitted Feeds (${nextSyncCountdown}s)`}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
        {/* Top search input */}
        <div className="flex items-center space-x-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Tender Reference (e.g. GEM/2026/B...), keyword, ministry, or required capability..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-gov-blue focus:border-gov-blue outline-none text-xs text-slate-800 placeholder-slate-400"
            />
            <FileSearch className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Eligibility Filter */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Eligibility Status:
            </label>
            <select
              value={eligibilityFilter}
              onChange={(e) => setEligibilityFilter(e.target.value as any)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs font-medium text-slate-800 outline-none focus:ring-1 focus:ring-gov-blue"
            >
              <option value="All">All Tenders ({tenders.length})</option>
              <option value="Eligible">🟢 Eligible to Bid Only</option>
              <option value="Partial">🟡 Partial / Conditional</option>
              <option value="Ineligible">🔴 Disqualified / Ineligible</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Procurement Category:
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs font-medium text-slate-800 outline-none focus:ring-1 focus:ring-gov-blue"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Portal Filter */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Source Portal:
            </label>
            <select
              value={selectedPortal}
              onChange={(e) => setSelectedPortal(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs font-medium text-slate-800 outline-none focus:ring-1 focus:ring-gov-blue"
            >
              {portals.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* MSE Reservation Toggle */}
          <div className="flex items-center justify-between sm:justify-start sm:space-x-2 pt-5">
            <label className="inline-flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={mseReservedOnly}
                onChange={(e) => setMseReservedOnly(e.target.checked)}
                className="rounded text-gov-blue focus:ring-gov-blue h-4 w-4"
              />
              <span className="font-bold text-slate-800 text-xs">
                MSE 25% Reserved Only
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-600 px-1">
        <div>
          Showing <strong>{filteredTendersWithMatch.length}</strong> matching tenders for{' '}
          <span className="font-bold text-slate-900">{activeProfile.tradeName}</span>
        </div>
        {(searchQuery || selectedCategory !== 'All' || selectedPortal !== 'All' || eligibilityFilter !== 'All' || mseReservedOnly) && (
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setSelectedPortal('All');
              setEligibilityFilter('All');
              setMseReservedOnly(false);
            }}
            className="text-gov-blue hover:underline font-semibold"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Tenders Grid */}
      {filteredTendersWithMatch.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTendersWithMatch.map(({ tender, match }) => (
            <TenderCard key={tender.id} tender={tender} match={match} />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
          <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <FileSearch className="h-6 w-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">
            No Tenders Match Your Criteria
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try adjusting your search terms, changing the eligibility status filter, or switching the active enterprise profile.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setSelectedPortal('All');
              setEligibilityFilter('All');
              setMseReservedOnly(false);
            }}
            className="px-4 py-2 rounded-lg bg-gov-navy text-white text-xs font-bold"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Manual CSV/JSON Import Modal */}
      {importModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm p-4 flex items-center justify-center animate-in fade-in">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-300 overflow-hidden">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs font-bold">
                <Upload className="h-4 w-4 text-emerald-400" />
                <span>MANUAL TENDER IMPORT ENGINE (JSON / CSV SCHEMA)</span>
              </div>
              <button
                onClick={() => setImportModalOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <p className="text-slate-600">
                Paste permitted tender feed data in JSON array format. The system automatically applies SHA-256 fingerprinting to eliminate duplicate entries.
              </p>

              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-900">Payload JSON:</span>
                <button
                  onClick={loadSampleTenderJson}
                  className="text-gov-blue hover:underline font-bold text-xs"
                >
                  Load Sample NHAI Tender
                </button>
              </div>

              <textarea
                value={importJsonText}
                onChange={(e) => setImportJsonText(e.target.value)}
                placeholder="Paste JSON array of Tender objects here..."
                rows={8}
                className="w-full p-3 rounded-lg border border-slate-300 font-mono text-[11px] focus:ring-2 focus:ring-gov-blue outline-none"
              />

              {importFeedback && (
                <div className={`p-3 rounded-lg font-semibold text-xs ${
                  importFeedback.includes('Invalid') ? 'bg-red-50 text-red-800' : 'bg-emerald-50 text-emerald-800'
                }`}>
                  {importFeedback}
                </div>
              )}

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  onClick={() => setImportModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleManualImport}
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition shadow-sm"
                >
                  Validate & Ingest Tenders
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
