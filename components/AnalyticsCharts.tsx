'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { evaluateTenderEligibility } from '@/lib/matchingEngine';
import { BarChart3, PieChart, TrendingUp, ShieldCheck, DollarSign, Award, Layers } from 'lucide-react';

export default function AnalyticsCharts() {
  const { tenders, activeProfile, complaints } = useApp();

  // 1. Calculate Category Distribution
  const categoriesMap: Record<string, number> = {};
  tenders.forEach((t) => {
    categoriesMap[t.category] = (categoriesMap[t.category] || 0) + 1;
  });

  // 2. Calculate Eligibility Distribution
  let eligibleCount = 0;
  let partialCount = 0;
  let ineligibleCount = 0;
  let totalSavings = 0;
  let totalPipelineValue = 0;

  tenders.forEach((t) => {
    totalPipelineValue += t.estimatedValue;
    const match = evaluateTenderEligibility(t, activeProfile);
    if (match.status === 'Eligible') eligibleCount++;
    else if (match.status === 'Partial') partialCount++;
    else ineligibleCount++;

    totalSavings += match.msmeBenefits.totalSavings;
  });

  const totalTenders = tenders.length || 1;
  const eligiblePct = Math.round((eligibleCount / totalTenders) * 100);
  const partialPct = Math.round((partialCount / totalTenders) * 100);
  const ineligiblePct = 100 - eligiblePct - partialPct;

  // Format currency
  const formatCr = (val: number) => `₹${(val / 10000000).toFixed(1)} Cr`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* KPI Card 1: Total Pipeline Value */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">
            Monitored Pipeline Value
          </span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">
            {formatCr(totalPipelineValue)}
          </span>
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center space-x-1 mt-0.5">
            <TrendingUp className="h-3 w-3" />
            <span>Across GeM, CPPP & Defense</span>
          </span>
        </div>
        <div className="h-12 w-12 rounded-xl bg-blue-50 text-gov-blue flex items-center justify-center">
          <Layers className="h-6 w-6" />
        </div>
      </div>

      {/* KPI Card 2: Cumulative GFR 170 Savings */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">
            MSME GFR 170 EMD Savings
          </span>
          <span className="text-2xl font-black text-emerald-700 mt-1 block">
            {formatCr(totalSavings)}
          </span>
          <span className="text-[11px] text-slate-500 font-medium mt-0.5">
            Waived for {activeProfile.msmeCategory} Enterprise
          </span>
        </div>
        <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
          <DollarSign className="h-6 w-6" />
        </div>
      </div>

      {/* KPI Card 3: Eligible Bidding Opportunities */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">
            Eligible Opportunities
          </span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl font-black text-slate-900">
              {eligibleCount}
            </span>
            <span className="text-xs text-slate-500 font-bold">
              of {totalTenders} Tenders ({eligiblePct}%)
            </span>
          </div>
          <span className="text-[11px] text-blue-600 font-medium mt-0.5 block">
            + {partialCount} Conditional Partial Matches
          </span>
        </div>
        <div className="h-12 w-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
          <Award className="h-6 w-6" />
        </div>
      </div>

      {/* KPI Card 4: AICTE Student Grievances Solved */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">
            AICTE Fraud Cases Handled
          </span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">
            {complaints.length} Filed
          </span>
          <span className="text-[11px] text-emerald-600 font-semibold mt-0.5 block">
            {complaints.filter((c) => c.status === 'Company Blacklisted & Resolved').length} Entities Blacklisted
          </span>
        </div>
        <div className="h-12 w-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
          <ShieldCheck className="h-6 w-6" />
        </div>
      </div>

      {/* Interactive Visual Breakdown: Eligibility Distribution Bar */}
      <div className="col-span-1 md:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4 text-gov-blue" />
            <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
              Tender Match Distribution for {activeProfile.tradeName}
            </h4>
          </div>
          <span className="text-xs font-mono font-bold text-slate-500">
            {totalTenders} Monitored
          </span>
        </div>

        {/* Multi-segment Progress Bar */}
        <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
          <div
            style={{ width: `${eligiblePct}%` }}
            className="bg-emerald-500 hover:bg-emerald-600 transition"
            title={`Eligible: ${eligibleCount} (${eligiblePct}%)`}
          />
          <div
            style={{ width: `${partialPct}%` }}
            className="bg-amber-400 hover:bg-amber-500 transition"
            title={`Partial: ${partialCount} (${partialPct}%)`}
          />
          <div
            style={{ width: `${ineligiblePct}%` }}
            className="bg-red-400 hover:bg-red-500 transition"
            title={`Ineligible: ${ineligibleCount} (${ineligiblePct}%)`}
          />
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
          <div className="flex items-center space-x-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span className="font-semibold text-slate-800">High Match ({eligibleCount})</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            <span className="font-semibold text-slate-800">Partial Match ({partialCount})</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <span className="font-semibold text-slate-800">Disqualified ({ineligibleCount})</span>
          </div>
        </div>
      </div>

      {/* Sector Category Distribution */}
      <div className="col-span-1 md:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <PieChart className="h-4 w-4 text-gov-orange" />
            <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
              Procurement Sectors Ingested
            </h4>
          </div>
          <span className="text-xs text-slate-500">Live Feed</span>
        </div>

        <div className="space-y-2">
          {Object.entries(categoriesMap).slice(0, 4).map(([category, count]) => {
            const pct = Math.round((count / totalTenders) * 100);
            return (
              <div key={category} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-700 font-medium truncate max-w-[280px]">
                    {category}
                  </span>
                  <span className="font-mono text-slate-500">
                    {count} ({pct}%)
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${pct}%` }}
                    className="h-full bg-gov-blue rounded-full"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
