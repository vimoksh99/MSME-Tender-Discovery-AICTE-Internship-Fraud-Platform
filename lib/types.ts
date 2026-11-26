export type MsmeCategory = 'Micro' | 'Small' | 'Medium' | 'Non-MSME';

export interface Certificate {
  id: string;
  name: string;
  code: string;
  issuedBy: string;
  issueDate: string;
  expiryDate: string;
  documentUrl?: string;
  isVerified: boolean;
  status: 'Active' | 'ExpiringSoon' | 'Expired';
}

export interface CompanyProfile {
  id: string;
  name: string;
  tradeName: string;
  udyamNumber: string;
  gstin: string;
  pan: string;
  cin: string;
  foundedYear: number;
  primaryIndustry: string;
  secondaryIndustry: string;
  address: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
  isPanIndia: boolean;
  investmentInPlantMachinery: number; // in ₹ Crores
  annualTurnover: number; // in ₹ Crores
  past3YearsTurnover: [number, number, number]; // in ₹ Crores
  maxSingleProjectCapacity: number; // in ₹ Crores
  msmeCategory: MsmeCategory;
  certificates: Certificate[];
  capabilities: string[];
  hsnCpvCodes: string[];
  experienceYears: number;
  pastGovtContractsCount: number;
  trustScore: number; // 0 - 100
  aicteVerificationStatus: 'Verified' | 'Pending' | 'Flagged' | 'Unverified';
  aicteVerificationBadgeDate?: string;
  contactEmail: string;
  contactPhone: string;
  website: string;
}

export type TenderPortal = 'GeM' | 'CPPP' | 'IREPS' | 'Defense Procurement' | 'AICTE / MoE' | 'Manual Import';

export interface Tender {
  id: string;
  referenceNumber: string;
  title: string;
  description: string;
  issuingAuthority: string;
  ministry: string;
  portalSource: TenderPortal;
  portalUrl: string;
  category: string;
  locationRequirement: {
    state?: string;
    isPanIndia: boolean;
  };
  estimatedValue: number; // in INR
  emdAmount: number; // in INR
  tenderDocumentFee: number; // in INR
  isEmdExemptForMsme: boolean;
  isReservedForMse: boolean; // 25% MSE reservation
  minTurnoverRequired: number; // in ₹ Crores
  msmeRelaxedTurnover: number; // in ₹ Crores
  minExperienceYears: number;
  mandatoryCertificates: string[];
  preferredCertificates: string[];
  requiredCapabilities: string[];
  publishDate: string;
  preBidMeetingDate?: string;
  submissionDeadline: string; // ISO date string
  openingDate: string;
  status: 'Active' | 'Closing Soon' | 'Closed';
  crawlTimestamp: string;
  contentHash: string;
}

export interface CriteriaBreakdownItem {
  score: number; // 0 - 100
  passed: boolean;
  weight: number;
  details: string;
}

export interface EligibilityGap {
  id: string;
  type: 'Turnover' | 'Certificate' | 'Capability' | 'Experience' | 'Location';
  severity: 'Critical' | 'Warning' | 'Info';
  title: string;
  description: string;
  remediation: string;
}

export interface EligibilityMatch {
  tenderId: string;
  overallScore: number; // 0 - 100
  status: 'Eligible' | 'Partial' | 'Ineligible';
  breakdown: {
    turnoverMatch: CriteriaBreakdownItem & {
      companyTurnover: number;
      required: number;
      isRelaxedApplied: boolean;
    };
    certificateMatch: CriteriaBreakdownItem & {
      matched: string[];
      missing: string[];
      expiringSoon: string[];
    };
    capabilityMatch: CriteriaBreakdownItem & {
      matchedTags: string[];
      missingTags: string[];
      similarityPercentage: number;
    };
    locationMatch: CriteriaBreakdownItem;
    experienceMatch: CriteriaBreakdownItem & {
      companyYears: number;
      requiredYears: number;
    };
  };
  msmeBenefits: {
    emdWaivedAmount: number;
    tenderFeeWaivedAmount: number;
    totalSavings: number;
    policyReference: string;
  };
  gapAnalysis: {
    hasGaps: boolean;
    gaps: EligibilityGap[];
  };
  aiRecommendationSummary: string;
}

export interface Internship {
  id: string;
  title: string;
  companyId: string;
  companyName: string;
  companyUdyam: string;
  location: string;
  mode: 'Remote' | 'On-site' | 'Hybrid';
  stipendMonthly: number; // INR
  durationMonths: number;
  requiredSkills: string[];
  openingsCount: number;
  aicteApproved: boolean;
  verifiedPartner: boolean;
  postedDate: string;
  deadline: string;
  description: string;
  contactEmail: string;
}

export interface FraudEvidenceItem {
  ruleId: string;
  category:
    | 'Fee Extortion'
    | 'Domain & Recruiter'
    | 'Unrealistic Promise'
    | 'Identity Verification'
    | 'Signature / QR Fraud'
    | 'Duplicate Certificate';
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  label: string;
  explanation: string;
  rawEvidenceFound: string;
}

export interface FraudAnalysisResult {
  riskScore: number; // 0 - 100 (higher = more fraudulent)
  riskLevel: 'Safe / Low Risk' | 'Moderate Caution' | 'High Risk / Severe Scam';
  targetType: 'Internship Posting' | 'Offer Letter OCR' | 'Recruiter Entity' | 'Certificate';
  targetSummary: string;
  explainableEvidence: FraudEvidenceItem[];
  qrValidation?: {
    isValid: boolean;
    qrPayload: string;
    issuer: string;
    signedBy: string;
    timestamp: string;
    verificationUrl: string;
  };
  digitalSignatureStatus?: 'Valid Cryptographic Stamp' | 'Tampered / Invalid Hash' | 'Missing Digital Signature';
  recommendedAction: 'Safe to Apply' | 'Proceed with Caution' | 'Report & Do Not Pay';
  analyzedAt: string;
}

export type ComplaintStatus =
  | 'Submitted'
  | 'Under AICTE Review'
  | 'Escalated to Cyber Cell'
  | 'Company Blacklisted & Resolved';

export interface StudentComplaint {
  id: string;
  studentName: string;
  studentRollNo: string;
  collegeName: string;
  companyName: string;
  recruiterEmail: string;
  recruiterPhone: string;
  scamType:
    | 'Upfront Fee Demanded'
    | 'Fake Offer Letter'
    | 'Unpaid Labor / Breach'
    | 'Ghost Company / Fake Certificate';
  feeDemandedAmount?: number;
  description: string;
  evidenceText?: string;
  status: ComplaintStatus;
  filedDate: string;
  updatedDate: string;
  adminRemarks?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  role: 'Company' | 'Student' | 'Administrator' | 'System Crawler';
  action: string;
  category: 'Tender' | 'Profile' | 'Fraud Check' | 'Complaint' | 'Admin';
  details: string;
  ipAddress?: string;
}

export type UserRole = 'company' | 'student' | 'admin';
export type AppLanguage = 'en' | 'hi' | 'te' | 'ta' | 'mr';
