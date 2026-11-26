import { MsmeCategory, Certificate } from './types';

/**
 * Calculates official MSME Category per Ministry of Micro, Small and Medium Enterprises
 * Gazette Notification (Composite Criteria of Investment & Turnover):
 * - Micro: Investment <= ₹1 Cr AND Turnover <= ₹5 Cr
 * - Small: Investment <= ₹10 Cr AND Turnover <= ₹50 Cr
 * - Medium: Investment <= ₹50 Cr AND Turnover <= ₹250 Cr
 * - Non-MSME / Large: If exceeds Medium thresholds
 */
export function calculateMsmeClassification(
  investmentInCr: number,
  turnoverInCr: number
): {
  category: MsmeCategory;
  investmentTier: string;
  turnoverTier: string;
  isEligibleForMseQuota: boolean;
  explanation: string;
} {
  const inv = Math.max(0, investmentInCr);
  const turn = Math.max(0, turnoverInCr);

  // Micro: Inv <= 1 Cr AND Turn <= 5 Cr
  if (inv <= 1 && turn <= 5) {
    return {
      category: 'Micro',
      investmentTier: '≤ ₹1 Crore',
      turnoverTier: '≤ ₹5 Crores',
      isEligibleForMseQuota: true,
      explanation: 'Classified as Micro Enterprise under Ministry Criteria (Inv ≤ ₹1 Cr & Turnover ≤ ₹5 Cr). Eligible for 100% EMD exemption and 25% MSE public procurement priority.',
    };
  }

  // Small: Inv <= 10 Cr AND Turn <= 50 Cr
  if (inv <= 10 && turn <= 50) {
    return {
      category: 'Small',
      investmentTier: '≤ ₹10 Crores',
      turnoverTier: '≤ ₹50 Crores',
      isEligibleForMseQuota: true,
      explanation: 'Classified as Small Enterprise under Ministry Criteria (Inv ≤ ₹10 Cr & Turnover ≤ ₹50 Cr). Eligible for EMD waivers and public procurement tender benefits.',
    };
  }

  // Medium: Inv <= 50 Cr AND Turn <= 250 Cr
  if (inv <= 50 && turn <= 250) {
    return {
      category: 'Medium',
      investmentTier: '≤ ₹50 Crores',
      turnoverTier: '≤ ₹250 Crores',
      isEligibleForMseQuota: false, // Under PPP 2012, 25% quota specifically targets Micro & Small
      explanation: 'Classified as Medium Enterprise under Ministry Criteria (Inv ≤ ₹50 Cr & Turnover ≤ ₹250 Cr). Eligible for MSME interest subvention and technology upgrade schemes.',
    };
  }

  return {
    category: 'Non-MSME',
    investmentTier: '> ₹50 Crores',
    turnoverTier: '> ₹250 Crores',
    isEligibleForMseQuota: false,
    explanation: 'Exceeds MSME classification thresholds. Classified as Large Scale Enterprise.',
  };
}

/**
 * Evaluates certificate validity relative to today's date
 */
export function getCertificateStatus(
  expiryDateStr: string
): { status: 'Active' | 'ExpiringSoon' | 'Expired'; daysRemaining: number } {
  const today = new Date();
  const expiry = new Date(expiryDateStr);
  const diffTime = expiry.getTime() - today.getTime();
  const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (daysRemaining < 0) {
    return { status: 'Expired', daysRemaining };
  } else if (daysRemaining <= 30) {
    return { status: 'ExpiringSoon', daysRemaining };
  }
  return { status: 'Active', daysRemaining };
}

/**
 * Updates certificate statuses array
 */
export function refreshCertificatesStatus(certificates: Certificate[]): Certificate[] {
  return certificates.map((cert) => {
    const { status } = getCertificateStatus(cert.expiryDate);
    return { ...cert, status };
  });
}
