import { CompanyProfile, Tender, Internship, StudentComplaint, AuditLog, UserRole } from './types';
import { INITIAL_PROFILES, INITIAL_TENDERS, INITIAL_INTERNSHIPS, INITIAL_COMPLAINTS, INITIAL_AUDIT_LOGS } from './mockData';
import { calculateMsmeClassification, refreshCertificatesStatus } from './classificationEngine';

const KEYS = {
  PROFILES: 'msme_profiles_v1',
  ACTIVE_PROFILE_ID: 'msme_active_profile_id_v1',
  TENDERS: 'msme_tenders_v1',
  INTERNSHIPS: 'msme_internships_v1',
  COMPLAINTS: 'msme_complaints_v1',
  AUDIT_LOGS: 'msme_audit_logs_v1',
  USER_ROLE: 'msme_user_role_v1',
  LANGUAGE: 'msme_language_v1',
  COLLECTOR_INTERVAL: 'msme_collector_interval_v1',
};

// SSR safe helper
function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

export function getStoredProfiles(): CompanyProfile[] {
  if (!isBrowser()) return INITIAL_PROFILES;
  try {
    const raw = localStorage.getItem(KEYS.PROFILES);
    if (!raw) {
      localStorage.setItem(KEYS.PROFILES, JSON.stringify(INITIAL_PROFILES));
      return INITIAL_PROFILES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_PROFILES;
  }
}

export function saveProfiles(profiles: CompanyProfile[]): void {
  if (!isBrowser()) return;
  localStorage.setItem(KEYS.PROFILES, JSON.stringify(profiles));
}

export function getActiveProfileId(): string {
  if (!isBrowser()) return INITIAL_PROFILES[0].id;
  return localStorage.getItem(KEYS.ACTIVE_PROFILE_ID) || INITIAL_PROFILES[0].id;
}

export function setActiveProfileId(id: string): void {
  if (!isBrowser()) return;
  localStorage.setItem(KEYS.ACTIVE_PROFILE_ID, id);
}

export function getActiveProfile(): CompanyProfile {
  const profiles = getStoredProfiles();
  const activeId = getActiveProfileId();
  const profile = profiles.find((p) => p.id === activeId) || profiles[0] || INITIAL_PROFILES[0];
  // Ensure classification and certificate statuses are always live
  const refreshedCerts = refreshCertificatesStatus(profile.certificates);
  const classification = calculateMsmeClassification(profile.investmentInPlantMachinery, profile.annualTurnover);
  return {
    ...profile,
    certificates: refreshedCerts,
    msmeCategory: classification.category,
  };
}

export function updateActiveProfile(updated: CompanyProfile): void {
  const profiles = getStoredProfiles();
  const classification = calculateMsmeClassification(updated.investmentInPlantMachinery, updated.annualTurnover);
  const refreshedCerts = refreshCertificatesStatus(updated.certificates);

  const finalProfile: CompanyProfile = {
    ...updated,
    msmeCategory: classification.category,
    certificates: refreshedCerts,
  };

  const index = profiles.findIndex((p) => p.id === finalProfile.id);
  if (index >= 0) {
    profiles[index] = finalProfile;
  } else {
    profiles.push(finalProfile);
  }
  saveProfiles(profiles);
}

export function getStoredTenders(): Tender[] {
  if (!isBrowser()) return INITIAL_TENDERS;
  try {
    const raw = localStorage.getItem(KEYS.TENDERS);
    if (!raw) {
      localStorage.setItem(KEYS.TENDERS, JSON.stringify(INITIAL_TENDERS));
      return INITIAL_TENDERS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_TENDERS;
  }
}

export function saveTenders(tenders: Tender[]): void {
  if (!isBrowser()) return;
  localStorage.setItem(KEYS.TENDERS, JSON.stringify(tenders));
}

export function addTenderWithDuplicateCheck(newTender: Tender): { success: boolean; isDuplicate: boolean; tender: Tender } {
  const tenders = getStoredTenders();
  // Check duplicate by reference number or content hash
  const existing = tenders.find(
    (t) =>
      t.referenceNumber.toLowerCase() === newTender.referenceNumber.toLowerCase() ||
      (t.contentHash && t.contentHash === newTender.contentHash)
  );

  if (existing) {
    return { success: false, isDuplicate: true, tender: existing };
  }

  const updatedList = [newTender, ...tenders];
  saveTenders(updatedList);
  return { success: true, isDuplicate: false, tender: newTender };
}

export function getStoredInternships(): Internship[] {
  if (!isBrowser()) return INITIAL_INTERNSHIPS;
  try {
    const raw = localStorage.getItem(KEYS.INTERNSHIPS);
    if (!raw) {
      localStorage.setItem(KEYS.INTERNSHIPS, JSON.stringify(INITIAL_INTERNSHIPS));
      return INITIAL_INTERNSHIPS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_INTERNSHIPS;
  }
}

export function saveInternships(internships: Internship[]): void {
  if (!isBrowser()) return;
  localStorage.setItem(KEYS.INTERNSHIPS, JSON.stringify(internships));
}

export function addInternship(internship: Internship): void {
  const list = getStoredInternships();
  saveInternships([internship, ...list]);
}

export function getStoredComplaints(): StudentComplaint[] {
  if (!isBrowser()) return INITIAL_COMPLAINTS;
  try {
    const raw = localStorage.getItem(KEYS.COMPLAINTS);
    if (!raw) {
      localStorage.setItem(KEYS.COMPLAINTS, JSON.stringify(INITIAL_COMPLAINTS));
      return INITIAL_COMPLAINTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_COMPLAINTS;
  }
}

export function saveComplaints(complaints: StudentComplaint[]): void {
  if (!isBrowser()) return;
  localStorage.setItem(KEYS.COMPLAINTS, JSON.stringify(complaints));
}

export function addComplaint(complaint: StudentComplaint): void {
  const list = getStoredComplaints();
  saveComplaints([complaint, ...list]);
}

export function updateComplaintStatus(
  id: string,
  newStatus: StudentComplaint['status'],
  remarks?: string
): void {
  const list = getStoredComplaints();
  const item = list.find((c) => c.id === id);
  if (item) {
    item.status = newStatus;
    item.updatedDate = new Date().toISOString();
    if (remarks) item.adminRemarks = remarks;
    saveComplaints([...list]);
  }
}

export function getStoredAuditLogs(): AuditLog[] {
  if (!isBrowser()) return INITIAL_AUDIT_LOGS;
  try {
    const raw = localStorage.getItem(KEYS.AUDIT_LOGS);
    if (!raw) {
      localStorage.setItem(KEYS.AUDIT_LOGS, JSON.stringify(INITIAL_AUDIT_LOGS));
      return INITIAL_AUDIT_LOGS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_AUDIT_LOGS;
  }
}

export function appendAuditLog(entry: Omit<AuditLog, 'id' | 'timestamp'>): void {
  if (!isBrowser()) return;
  const list = getStoredAuditLogs();
  const newEntry: AuditLog = {
    ...entry,
    id: `LOG-${Date.now().toString().slice(-6)}`,
    timestamp: new Date().toISOString(),
  };
  localStorage.setItem(KEYS.AUDIT_LOGS, JSON.stringify([newEntry, ...list.slice(0, 99)]));
}

export function getStoredUserRole(): UserRole {
  if (!isBrowser()) return 'company';
  return (localStorage.getItem(KEYS.USER_ROLE) as UserRole) || 'company';
}

export function setStoredUserRole(role: UserRole): void {
  if (!isBrowser()) return;
  localStorage.setItem(KEYS.USER_ROLE, role);
}

export function resetAllToDefault(): void {
  if (!isBrowser()) return;
  localStorage.removeItem(KEYS.PROFILES);
  localStorage.removeItem(KEYS.ACTIVE_PROFILE_ID);
  localStorage.removeItem(KEYS.TENDERS);
  localStorage.removeItem(KEYS.INTERNSHIPS);
  localStorage.removeItem(KEYS.COMPLAINTS);
  localStorage.removeItem(KEYS.AUDIT_LOGS);
}
