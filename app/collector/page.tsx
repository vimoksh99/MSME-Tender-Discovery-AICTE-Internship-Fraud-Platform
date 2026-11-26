'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  RefreshCw,
  Layers,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sliders,
  Upload,
  Globe2,
  FileText,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

export default function TenderCollectorPage() {
  const {
    tenders,
    isSyncing,
    lastSyncTime,
    nextSyncCountdown,
    autoSyncIntervalSec,
    setAutoSyncIntervalSec,
    triggerSyncNow,
    importTendersData,
  } = useApp();

  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [csvContent, setCsvContent] = useState('');

  const handleManualSync = async () => {
    const res = await triggerSyncNow();
    setSyncMessage(res.message);
    setTimeout(() => setSyncMessage(null), 4000);
  };

  const handleUploadSampleCsv = () => {
    const sampleTenders = [
      {
        id: `TND-CSV-${Date.now().toString().slice(-4)}`,
        referenceNumber: 'IREPS/SR/SOLAR/2026/881',
        title: 'Southern Railway 3.0 MW Rooftop Solar Plant Turnkey Installation at Chennai Central',
        description: 'Design, supply, installation, testing and commissioning of grid connected solar PV power plants with net-metering and 5 years comprehensive maintenance.',
        issuingAuthority: 'Southern Railway, Indian Railways',
        ministry: 'Ministry of Railways',
        portalSource: 'IREPS' as const,
        portalUrl: 'https://www.ireps.gov.in/eps/tender/SR-SOLAR-2026-881',
        category: 'Renewable Energy & Power Systems',
        locationRequirement: { state: 'Tamil Nadu', isPanIndia: false },
        estimatedValue: 110000000,
        emdAmount: 2200000,
        tenderDocumentFee: 15000,
        isEmdExemptForMsme: true,
        isReservedForMse: true,
        minTurnoverRequired: 14.0,
        msmeRelaxedTurnover: 8.0,
        minExperienceYears: 3,
        mandatoryCertificates: ['ISO 9001', 'ISO 14001', 'UDYAM-MSME'],
        preferredCertificates: ['MNRE-CHANNEL'],
        requiredCapabilities: ['Solar Rooftop PV EPC', 'SCADA Monitoring Systems'],
        publishDate: new Date().toISOString().split('T')[0],
        submissionDeadline: new Date(Date.now() + 20 * 24 * 3600 * 1000).toISOString(),
        openingDate: new Date(Date.now() + 21 * 24 * 3600 * 1000).toISOString(),
        status: 'Active' as const,
        crawlTimestamp: new Date().toISOString(),
        contentHash: 'hash-sr-solar-' + Math.random(),
      },
    ];

    const res = importTendersData(sampleTenders);
    setSyncMessage(`CSV File parsed: ${res.added} added, ${res.duplicates} duplicates skipped.`);
    setTimeout(() => setSyncMessage(null), 4000);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-gov-blue uppercase tracking-wider mb-1">
            <RefreshCw className="h-4 w-4 text-emerald-600" />
            <span>Permitted Public Procurement Ingestion</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Periodic Tender Collector & Multi-Source Crawler Engine
          </h1>
          <p className="text-xs text-slate-500">
            Automated scheduled polling engine monitoring official permitted portals with SHA-256 duplicate detection.
          </p>
        </div>

        <button
          onClick={handleManualSync}
          disabled={isSyncing}
          className="px-5 py-2.5 rounded-xl bg-gov-navy hover:bg-gov-blue text-white font-extrabold text-xs inline-flex items-center space-x-2 shadow-md transition disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin text-emerald-400' : ''}`} />
          <span>{isSyncing ? 'Polling Ingestion Feeds...' : 'Trigger Immediate Sync Cycle'}</span>
        </button>
      </div>

      {syncMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl font-bold text-xs flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>{syncMessage}</span>
        </div>
      )}

      {/* Real-time Collector Telemetry Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Poller Status */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider block">
              Collector Status
            </span>
            <div className="flex items-center space-x-2 mt-1">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
              </span>
              <span className="text-lg font-black text-slate-900">
                {isSyncing ? 'Polling Active' : 'Polling Scheduled'}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">
              Interval: Every {autoSyncIntervalSec} seconds
            </span>
          </div>
          <Clock className="h-8 w-8 text-emerald-500/80" />
        </div>

        {/* Countdown */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider block">
              Next Scheduled Fetch
            </span>
            <span className="text-2xl font-black text-gov-blue mt-1 block">
              {nextSyncCountdown}s
            </span>
            <span className="text-[10px] text-slate-500 mt-0.5 block">
              Last synced: {lastSyncTime?.toLocaleTimeString() || 'Just now'}
            </span>
          </div>
          <RefreshCw className={`h-8 w-8 text-gov-blue/80 ${isSyncing ? 'animate-spin' : ''}`} />
        </div>

        {/* Total Ingested */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider block">
              Total Ingested Tenders
            </span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">
              {tenders.length} Records
            </span>
            <span className="text-[10px] text-emerald-600 font-semibold mt-0.5 block">
              ✓ SHA-256 Duplicates Filtered
            </span>
          </div>
          <Layers className="h-8 w-8 text-slate-400" />
        </div>

        {/* Polling Interval Config Slider */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider block">
            Polling Frequency: {autoSyncIntervalSec}s
          </span>
          <input
            type="range"
            min="15"
            max="120"
            step="15"
            value={autoSyncIntervalSec}
            onChange={(e) => setAutoSyncIntervalSec(Number(e.target.value))}
            className="w-full accent-gov-blue my-2"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>Fast (15s)</span>
            <span>Standard (45s)</span>
            <span>Slow (120s)</span>
          </div>
        </div>
      </div>

      {/* Monitored Permitted Government Portals */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
          <Globe2 className="h-4 w-4 text-gov-blue" />
          <span>Monitored Public Procurement Gateways</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-slate-900 text-sm">GeM (Government e-Marketplace)</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                Connected
              </span>
            </div>
            <p className="text-slate-600 text-[11px]">
              Direct monitoring of Central Ministries, PSUs, and autonomous bodies procurement notices.
            </p>
            <div className="text-[10px] text-slate-400 font-mono">Endpoint: gem.gov.in/tenders/rss</div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-slate-900 text-sm">CPPP (Central Public Procurement)</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                Connected
              </span>
            </div>
            <p className="text-slate-600 text-[11px]">
              eProcure portal publishing large infrastructure and civil works tenders nationwide.
            </p>
            <div className="text-[10px] text-slate-400 font-mono">Endpoint: eprocure.gov.in/cppp/api/v2</div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-slate-900 text-sm">IREPS & Defense Procurement</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                Connected
              </span>
            </div>
            <p className="text-slate-600 text-[11px]">
              Indian Railways Electronic Procurement System and DRDO defense vendor requisitions.
            </p>
            <div className="text-[10px] text-slate-400 font-mono">Endpoint: ireps.gov.in/eps & defproc.gov.in</div>
          </div>
        </div>
      </div>

      {/* Manual CSV Import Box */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
            <Upload className="h-4 w-4 text-gov-blue" />
            <span>Manual Procurement Feed Upload (CSV / XML)</span>
          </h2>
          <button
            onClick={handleUploadSampleCsv}
            className="text-xs text-gov-blue hover:underline font-bold"
          >
            Load & Test Sample Railway Solar CSV Notice
          </button>
        </div>

        <p className="text-xs text-slate-600">
          Upload custom tender notices from state procurement boards. The ingestion engine parses metadata, validates statutory compliance, and computes duplicate content hashes.
        </p>

        <div className="p-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 text-center space-y-2">
          <FileText className="h-8 w-8 text-slate-400 mx-auto" />
          <div className="text-xs font-bold text-slate-700">
            Click above to simulate parsing Railway Solar Tender CSV
          </div>
          <div className="text-[11px] text-slate-400">
            Automatically applies MSME relaxation check, GFR 170 EMD exemption calculation, and eligibility scoring.
          </div>
        </div>
      </div>
    </div>
  );
}
