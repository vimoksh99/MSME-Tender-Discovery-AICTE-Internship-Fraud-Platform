'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  CompanyProfile,
  Tender,
  Internship,
  StudentComplaint,
  AuditLog,
  UserRole,
  EligibilityMatch,
  ComplaintStatus,
} from '@/lib/types';
import {
  getActiveProfile,
  getStoredProfiles,
  setActiveProfileId,
  updateActiveProfile,
  getStoredTenders,
  saveTenders,
  addTenderWithDuplicateCheck,
  getStoredInternships,
  addInternship,
  getStoredComplaints,
  addComplaint,
  updateComplaintStatus,
  getStoredAuditLogs,
  appendAuditLog,
  getStoredUserRole,
  setStoredUserRole,
} from '@/lib/storage';
import { evaluateTenderEligibility } from '@/lib/matchingEngine';
import { TRANSLATIONS, LanguageCode } from '@/lib/i18n';

interface AppContextType {
  activeProfile: CompanyProfile;
  profiles: CompanyProfile[];
  userRole: UserRole;
  language: LanguageCode;
  tenders: Tender[];
  internships: Internship[];
  complaints: StudentComplaint[];
  auditLogs: AuditLog[];
  isSyncing: boolean;
  lastSyncTime: Date | null;
  nextSyncCountdown: number;
  autoSyncIntervalSec: number;
  setAutoSyncIntervalSec: (sec: number) => void;
  selectedTenderEligibility: { tender: Tender; match: EligibilityMatch } | null;
  setSelectedTenderEligibility: (item: { tender: Tender; match: EligibilityMatch } | null) => void;
  dossierTender: { tender: Tender; match: EligibilityMatch } | null;
  setDossierTender: (item: { tender: Tender; match: EligibilityMatch } | null) => void;
  qrModalOpen: boolean;
  setQrModalOpen: (open: boolean) => void;
  switchProfile: (profileId: string) => void;
  saveProfileChanges: (updated: CompanyProfile) => void;
  setUserRole: (role: UserRole) => void;
  setLanguage: (lang: LanguageCode) => void;
  triggerSyncNow: () => Promise<{ addedCount: number; message: string }>;
  importTendersData: (newTenders: Tender[]) => { added: number; duplicates: number };
  submitComplaint: (data: Omit<StudentComplaint, 'id' | 'status' | 'filedDate' | 'updatedDate'>) => void;
  adminUpdateComplaint: (id: string, status: ComplaintStatus, remarks?: string) => void;
  createNewInternship: (data: Omit<Internship, 'id' | 'postedDate'>) => void;
  logEvent: (action: string, category: AuditLog['category'], details: string) => void;
  t: (key: keyof typeof TRANSLATIONS.en) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [profiles, setProfiles] = useState<CompanyProfile[]>([]);
  const [activeProfile, setActiveProfileState] = useState<CompanyProfile | null>(null);
  const [userRole, setUserRoleState] = useState<UserRole>('company');
  const [language, setLanguageState] = useState<LanguageCode>('en');
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [internships, setInternships] = useState<Internship[]>([]);
  const [complaints, setComplaints] = useState<StudentComplaint[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [autoSyncIntervalSec, setAutoSyncIntervalSec] = useState<number>(45); // default 45s countdown
  const [nextSyncCountdown, setNextSyncCountdown] = useState<number>(45);
  const [selectedTenderEligibility, setSelectedTenderEligibility] = useState<{
    tender: Tender;
    match: EligibilityMatch;
  } | null>(null);
  const [dossierTender, setDossierTender] = useState<{ tender: Tender; match: EligibilityMatch } | null>(null);
  const [qrModalOpen, setQrModalOpen] = useState(false);

  // Initialize from storage on mount
  useEffect(() => {
    setMounted(true);
    setProfiles(getStoredProfiles());
    setActiveProfileState(getActiveProfile());
    setUserRoleState(getStoredUserRole());
    setTenders(getStoredTenders());
    setInternships(getStoredInternships());
    setComplaints(getStoredComplaints());
    setAuditLogs(getStoredAuditLogs());
    setLastSyncTime(new Date());
  }, []);

  // Background Periodic Tender Polling simulation
  useEffect(() => {
    if (!mounted) return;

    const timer = setInterval(() => {
      setNextSyncCountdown((prev) => {
        if (prev <= 1) {
          // Trigger automated background poll
          performBackgroundSync();
          return autoSyncIntervalSec;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [mounted, autoSyncIntervalSec]);

  const performBackgroundSync = async () => {
    try {
      setIsSyncing(true);
      const res = await fetch('/api/sync', { method: 'POST' });
      const data = await res.json();
      if (data.success && Array.isArray(data.tenders)) {
        let addedCount = 0;
        data.tenders.forEach((t: Tender) => {
          const res = addTenderWithDuplicateCheck(t);
          if (res.success) addedCount++;
        });
        setTenders(getStoredTenders());
        setLastSyncTime(new Date());
        if (addedCount > 0) {
          appendAuditLog({
            role: 'System Crawler',
            action: 'Automated Periodic Ingestion',
            category: 'Tender',
            details: `Scheduled collector ingested ${addedCount} permitted tender(s) from GeM/CPPP.`,
          });
          setAuditLogs(getStoredAuditLogs());
        }
      }
    } catch (e) {
      console.error('Periodic sync failed:', e);
    } finally {
      setIsSyncing(false);
    }
  };

  const triggerSyncNow = async (): Promise<{ addedCount: number; message: string }> => {
    setIsSyncing(true);
    try {
      const res = await fetch('/api/sync', { method: 'POST' });
      const data = await res.json();
      let addedCount = 0;
      if (data.success && Array.isArray(data.tenders)) {
        data.tenders.forEach((t: Tender) => {
          const res = addTenderWithDuplicateCheck(t);
          if (res.success) addedCount++;
        });
        setTenders(getStoredTenders());
        setLastSyncTime(new Date());
        setNextSyncCountdown(autoSyncIntervalSec);
        appendAuditLog({
          role: userRole === 'admin' ? 'Administrator' : 'Company',
          action: 'Manual Permitted Tender Sync',
          category: 'Tender',
          details: `Manual sync triggered across GeM, CPPP, IREPS. Added ${addedCount} new opportunities, filtered duplicates.`,
        });
        setAuditLogs(getStoredAuditLogs());
      }
      return { addedCount, message: `Successfully synchronized permitted portals. ${addedCount} new tenders added.` };
    } finally {
      setIsSyncing(false);
    }
  };

  const switchProfile = (profileId: string) => {
    setActiveProfileId(profileId);
    const updated = getActiveProfile();
    setActiveProfileState(updated);
    appendAuditLog({
      role: 'Company',
      action: 'Active Company Switched',
      category: 'Profile',
      details: `Switched active MSME context to ${updated.name} (${updated.msmeCategory} Enterprise).`,
    });
    setAuditLogs(getStoredAuditLogs());
  };

  const saveProfileChanges = (updated: CompanyProfile) => {
    updateActiveProfile(updated);
    setProfiles(getStoredProfiles());
    setActiveProfileState(getActiveProfile());
    appendAuditLog({
      role: 'Company',
      action: 'Profile Updated',
      category: 'Profile',
      details: `Updated profile for ${updated.name}. Auto-classified as ${updated.msmeCategory}. Turnover: ₹${updated.annualTurnover} Cr.`,
    });
    setAuditLogs(getStoredAuditLogs());
  };

  const setUserRole = (role: UserRole) => {
    setUserRoleState(role);
    setStoredUserRole(role);
    appendAuditLog({
      role: role === 'admin' ? 'Administrator' : role === 'student' ? 'Student' : 'Company',
      action: 'Role Switched',
      category: 'Admin',
      details: `Active portal view switched to ${role.toUpperCase()} dashboard.`,
    });
    setAuditLogs(getStoredAuditLogs());
  };

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
  };

  const importTendersData = (newTenders: Tender[]): { added: number; duplicates: number } => {
    let added = 0;
    let duplicates = 0;
    newTenders.forEach((t) => {
      const res = addTenderWithDuplicateCheck(t);
      if (res.success) added++;
      else duplicates++;
    });
    setTenders(getStoredTenders());
    appendAuditLog({
      role: userRole === 'admin' ? 'Administrator' : 'Company',
      action: 'Batch Tender Import',
      category: 'Tender',
      details: `Imported ${newTenders.length} tenders via CSV/JSON (${added} added, ${duplicates} duplicates skipped).`,
    });
    setAuditLogs(getStoredAuditLogs());
    return { added, duplicates };
  };

  const submitComplaint = (data: Omit<StudentComplaint, 'id' | 'status' | 'filedDate' | 'updatedDate'>) => {
    const newComplaint: StudentComplaint = {
      ...data,
      id: `CMP-${Date.now().toString().slice(-6)}`,
      status: 'Submitted',
      filedDate: new Date().toISOString(),
      updatedDate: new Date().toISOString(),
    };
    addComplaint(newComplaint);
    setComplaints(getStoredComplaints());
    appendAuditLog({
      role: 'Student',
      action: 'Grievance Filed',
      category: 'Complaint',
      details: `Student ${data.studentName} filed fraud complaint against "${data.companyName}" (${data.scamType}).`,
    });
    setAuditLogs(getStoredAuditLogs());
  };

  const adminUpdateComplaint = (id: string, status: ComplaintStatus, remarks?: string) => {
    updateComplaintStatus(id, status, remarks);
    setComplaints(getStoredComplaints());
    appendAuditLog({
      role: 'Administrator',
      action: 'Complaint Status Updated',
      category: 'Admin',
      details: `Complaint ${id} status updated to "${status}". Remarks: ${remarks || 'None'}`,
    });
    setAuditLogs(getStoredAuditLogs());
  };

  const createNewInternship = (data: Omit<Internship, 'id' | 'postedDate'>) => {
    const newInt: Internship = {
      ...data,
      id: `int-${Date.now().toString().slice(-5)}`,
      postedDate: new Date().toISOString().split('T')[0],
    };
    addInternship(newInt);
    setInternships(getStoredInternships());
    appendAuditLog({
      role: 'Company',
      action: 'Internship Listed',
      category: 'Profile',
      details: `Verified partner "${data.companyName}" published apprenticeship: "${data.title}" (Stipend ₹${data.stipendMonthly}/mo).`,
    });
    setAuditLogs(getStoredAuditLogs());
  };

  const logEvent = (action: string, category: AuditLog['category'], details: string) => {
    appendAuditLog({
      role: userRole === 'admin' ? 'Administrator' : userRole === 'student' ? 'Student' : 'Company',
      action,
      category,
      details,
    });
    setAuditLogs(getStoredAuditLogs());
  };

  const t = (key: keyof typeof TRANSLATIONS.en): string => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS.en[key] || String(key);
  };

  // Fallback before hydration
  const currentProfile = activeProfile || getActiveProfile();

  return (
    <AppContext.Provider
      value={{
        activeProfile: currentProfile,
        profiles,
        userRole,
        language,
        tenders,
        internships,
        complaints,
        auditLogs,
        isSyncing,
        lastSyncTime,
        nextSyncCountdown,
        autoSyncIntervalSec,
        setAutoSyncIntervalSec,
        selectedTenderEligibility,
        setSelectedTenderEligibility,
        dossierTender,
        setDossierTender,
        qrModalOpen,
        setQrModalOpen,
        switchProfile,
        saveProfileChanges,
        setUserRole,
        setLanguage,
        triggerSyncNow,
        importTendersData,
        submitComplaint,
        adminUpdateComplaint,
        createNewInternship,
        logEvent,
        t,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
