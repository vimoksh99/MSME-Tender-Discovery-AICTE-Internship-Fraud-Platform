import { CompanyProfile, Tender, EligibilityMatch, EligibilityGap } from './types';

// Semantic synonym dictionary to match related procurement terms
const SYNONYM_MAP: Record<string, string[]> = {
  'cloud': ['cloud computing', 'aws', 'azure', 'gcp', 'devops', 'kubernetes', 'hosting'],
  'cybersecurity': ['information security', 'vapt', 'iso 27001', 'soc', 'network security', 'pen-testing', 'firewall'],
  'ai': ['artificial intelligence', 'machine learning', 'deep learning', 'nlp', 'computer vision', 'data science'],
  'software': ['web development', 'full stack', 'next.js', 'react', 'api', 'mobile app', 'erp', 'crm'],
  'solar': ['solar pv', 'photovoltaic', 'renewable energy', 'inverter', 'green energy', 'rooftop solar'],
  'surveillance': ['cctv', 'ip cameras', 'access control', 'security systems', 'biometrics'],
  'civil': ['construction', 'roads', 'building', 'infrastructure', 'asphalting', 'structural engineering'],
  'medical': ['biomedical', 'hospital equipment', 'hvac', 'diagnostic', 'healthcare', 'ce certified'],
  'hardware': ['electronics', 'iot', 'sensors', 'embedded systems', 'pcb', 'firmware'],
};

/**
 * Checks semantic tag similarity between company capabilities and tender requirements
 */
function calculateSemanticOverlap(
  companyCapabilities: string[],
  tenderRequirements: string[]
): {
  matchedTags: string[];
  missingTags: string[];
  similarityPercentage: number;
} {
  if (tenderRequirements.length === 0) {
    return { matchedTags: [], missingTags: [], similarityPercentage: 100 };
  }

  const normalizedCompanyCaps = companyCapabilities.map((c) => c.toLowerCase().trim());
  const matched: string[] = [];
  const missing: string[] = [];

  for (const req of tenderRequirements) {
    const reqLower = req.toLowerCase().trim();
    let isMatched = false;

    // Direct match
    if (normalizedCompanyCaps.some((cap) => cap.includes(reqLower) || reqLower.includes(cap))) {
      isMatched = true;
    } else {
      // Check synonym maps
      for (const [key, synonyms] of Object.entries(SYNONYM_MAP)) {
        const reqMatchesKey = reqLower.includes(key) || synonyms.some((s) => reqLower.includes(s));
        const companyMatchesKey = normalizedCompanyCaps.some(
          (c) => c.includes(key) || synonyms.some((s) => c.includes(s))
        );
        if (reqMatchesKey && companyMatchesKey) {
          isMatched = true;
          break;
        }
      }
    }

    if (isMatched) {
      matched.push(req);
    } else {
      missing.push(req);
    }
  }

  const similarityPercentage = Math.round((matched.length / tenderRequirements.length) * 100);
  return {
    matchedTags: matched,
    missingTags: missing,
    similarityPercentage,
  };
}

/**
 * Evaluates a single tender against a company profile
 */
export function evaluateTenderEligibility(
  tender: Tender,
  company: CompanyProfile
): EligibilityMatch {
  const gaps: EligibilityGap[] = [];

  // 1. Turnover Evaluation (Weight: 30%)
  const isMsme = company.msmeCategory !== 'Non-MSME';
  const effectiveMinTurnover = isMsme && tender.msmeRelaxedTurnover
    ? tender.msmeRelaxedTurnover
    : tender.minTurnoverRequired;

  const turnoverPassed = company.annualTurnover >= effectiveMinTurnover;
  let turnoverScore = 0;
  if (company.annualTurnover >= tender.minTurnoverRequired) {
    turnoverScore = 100;
  } else if (isMsme && company.annualTurnover >= tender.msmeRelaxedTurnover) {
    turnoverScore = 85; // Relaxed MSME turnover criteria met
  } else {
    turnoverScore = Math.max(0, Math.round((company.annualTurnover / effectiveMinTurnover) * 70));
    gaps.push({
      id: `gap-turnover-${tender.id}`,
      type: 'Turnover',
      severity: 'Critical',
      title: 'Annual Turnover Shortfall',
      description: `Company turnover is ₹${company.annualTurnover} Cr against tender minimum requirement of ₹${effectiveMinTurnover} Cr (with MSME relaxation).`,
      remediation: 'Consider forming a consortium with a joint venture partner or bid for lower-tier packages under the sub-contracting clause.',
    });
  }

  // 2. Certificate Evaluation (Weight: 25%)
  const companyActiveCertCodes = company.certificates
    .filter((c) => c.status !== 'Expired')
    .map((c) => c.code.toUpperCase());
  const companyExpiringCertCodes = company.certificates
    .filter((c) => c.status === 'ExpiringSoon')
    .map((c) => c.code.toUpperCase());

  const matchedCerts: string[] = [];
  const missingCerts: string[] = [];
  const expiringSoonCerts: string[] = [];

  for (const certReq of tender.mandatoryCertificates) {
    const certReqUpper = certReq.toUpperCase();
    const found = companyActiveCertCodes.some((code) => code.includes(certReqUpper) || certReqUpper.includes(code));
    if (found) {
      matchedCerts.push(certReq);
      if (companyExpiringCertCodes.some((code) => code.includes(certReqUpper) || certReqUpper.includes(code))) {
        expiringSoonCerts.push(certReq);
      }
    } else {
      missingCerts.push(certReq);
    }
  }

  let certScore = 100;
  const certPassed = missingCerts.length === 0;
  if (tender.mandatoryCertificates.length > 0) {
    certScore = Math.round((matchedCerts.length / tender.mandatoryCertificates.length) * 100);
    if (!certPassed) {
      gaps.push({
        id: `gap-cert-${tender.id}`,
        type: 'Certificate',
        severity: 'Critical',
        title: `Missing Mandatory Certificates: ${missingCerts.join(', ')}`,
        description: `This tender mandates [${missingCerts.join(', ')}] which are not active in your company profile.`,
        remediation: `Expedite audit or certification renewal for ${missingCerts.join(', ')} or upload existing valid accreditation.`,
      });
    }
    if (expiringSoonCerts.length > 0) {
      gaps.push({
        id: `gap-cert-exp-${tender.id}`,
        type: 'Certificate',
        severity: 'Warning',
        title: `Certificates Expiring Soon: ${expiringSoonCerts.join(', ')}`,
        description: `Certificate(s) will expire within 30 days and might be rejected during bid evaluation opening date.`,
        remediation: 'Submit renewal application immediately to prevent disqualification during technical envelope opening.',
      });
    }
  }

  // 3. Capabilities & Scope Semantic Match (Weight: 25%)
  const { matchedTags, missingTags, similarityPercentage } = calculateSemanticOverlap(
    company.capabilities,
    tender.requiredCapabilities
  );
  const capabilityScore = similarityPercentage;
  const capabilityPassed = capabilityScore >= 60;
  if (!capabilityPassed) {
    gaps.push({
      id: `gap-cap-${tender.id}`,
      type: 'Capability',
      severity: 'Warning',
      title: 'Capability & Scope Gap',
      description: `Missing specific technical capabilities required by tender scope: ${missingTags.join(', ')}.`,
      remediation: 'Partner with specialized domain sub-contractors or update profile with relevant projects.',
    });
  }

  // 4. Location Preference (Weight: 10%)
  let locationScore = 100;
  let locationPassed = true;
  let locationDetails = 'National / Pan-India eligibility confirmed.';

  if (!tender.locationRequirement.isPanIndia && tender.locationRequirement.state) {
    if (company.isPanIndia || company.state.toLowerCase() === tender.locationRequirement.state.toLowerCase()) {
      locationScore = 100;
      locationDetails = `Location matches state preference (${tender.locationRequirement.state}) or Pan-India scope.`;
    } else {
      locationScore = 40;
      locationPassed = false;
      locationDetails = `Tender has regional state preference for ${tender.locationRequirement.state}, but company is based in ${company.state}.`;
      gaps.push({
        id: `gap-loc-${tender.id}`,
        type: 'Location',
        severity: 'Info',
        title: 'Regional MSME Preference Policy',
        description: `Local state MSE procurement preference applies for ${tender.locationRequirement.state}. Non-local bidders may not receive 15% price purchase preference.`,
        remediation: 'Check tender clause 4.2 for non-local consortium eligibility or local branch office clause.',
      });
    }
  }

  // 5. Experience (Weight: 10%)
  const expPassed = company.experienceYears >= tender.minExperienceYears;
  let expScore = 100;
  if (!expPassed) {
    expScore = Math.max(0, Math.round((company.experienceYears / Math.max(1, tender.minExperienceYears)) * 80));
    gaps.push({
      id: `gap-exp-${tender.id}`,
      type: 'Experience',
      severity: 'Critical',
      title: 'Past Experience Deficit',
      description: `Requires ${tender.minExperienceYears} years of proven domain experience. Company has ${company.experienceYears} years.`,
      remediation: 'Submit past completed work orders or include founder credentials if allowed under Startup India waiver.',
    });
  }

  // Overall Weighted Score Computation:
  // Turnover: 30%, Certificate: 25%, Capability: 25%, Location: 10%, Experience: 10%
  const overallScore = Math.round(
    turnoverScore * 0.30 +
    certScore * 0.25 +
    capabilityScore * 0.25 +
    locationScore * 0.10 +
    expScore * 0.10
  );

  let status: 'Eligible' | 'Partial' | 'Ineligible';
  if (overallScore >= 78 && turnoverPassed && certPassed) {
    status = 'Eligible';
  } else if (overallScore >= 50) {
    status = 'Partial';
  } else {
    status = 'Ineligible';
  }

  // MSME Exemption Calculations under GFR Rule 170 (2017)
  const isUdyamRegistered = company.certificates.some(
    (c) => c.code.toLowerCase().includes('udyam') && c.status !== 'Expired'
  );
  const emdWaived = isUdyamRegistered && tender.isEmdExemptForMsme ? tender.emdAmount : 0;
  const tenderFeeWaived = isUdyamRegistered ? tender.tenderDocumentFee : 0;

  // AI Recommendation Text
  let aiRecommendationSummary = '';
  if (status === 'Eligible') {
    aiRecommendationSummary = `High compatibility (${overallScore}%). Your turnover, certifications, and technical capabilities align with ${tender.issuingAuthority}'s criteria. Recommended to prepare technical envelope and bid documents.`;
  } else if (status === 'Partial') {
    aiRecommendationSummary = `Moderate compatibility (${overallScore}%). You qualify on general criteria but have ${gaps.length} gaps (mainly: ${gaps.map((g) => g.title).slice(0, 2).join('; ')}). Can bid if resolved or via consortium.`;
  } else {
    aiRecommendationSummary = `Low compatibility (${overallScore}%). Significant critical disqualifications identified (${gaps.filter((g) => g.severity === 'Critical').map((g) => g.title).join(', ')}). Bidding not recommended without structural remediation.`;
  }

  return {
    tenderId: tender.id,
    overallScore,
    status,
    breakdown: {
      turnoverMatch: {
        score: turnoverScore,
        passed: turnoverPassed,
        weight: 30,
        details: turnoverPassed
          ? `Turnover of ₹${company.annualTurnover} Cr satisfies required threshold of ₹${effectiveMinTurnover} Cr.`
          : `Turnover of ₹${company.annualTurnover} Cr is below required threshold of ₹${effectiveMinTurnover} Cr.`,
        companyTurnover: company.annualTurnover,
        required: effectiveMinTurnover,
        isRelaxedApplied: isMsme && tender.msmeRelaxedTurnover < tender.minTurnoverRequired,
      },
      certificateMatch: {
        score: certScore,
        passed: certPassed,
        weight: 25,
        details: certPassed
          ? `All ${matchedCerts.length} mandatory certifications verified.`
          : `Missing ${missingCerts.length} required certificate(s): ${missingCerts.join(', ')}.`,
        matched: matchedCerts,
        missing: missingCerts,
        expiringSoon: expiringSoonCerts,
      },
      capabilityMatch: {
        score: capabilityScore,
        passed: capabilityPassed,
        weight: 25,
        details: `${matchedTags.length} of ${tender.requiredCapabilities.length} required capability tags match company profile.`,
        matchedTags,
        missingTags,
        similarityPercentage,
      },
      locationMatch: {
        score: locationScore,
        passed: locationPassed,
        weight: 10,
        details: locationDetails,
      },
      experienceMatch: {
        score: expScore,
        passed: expPassed,
        weight: 10,
        details: expPassed
          ? `${company.experienceYears} years experience exceeds required ${tender.minExperienceYears} years.`
          : `${company.experienceYears} years experience falls short of required ${tender.minExperienceYears} years.`,
        companyYears: company.experienceYears,
        requiredYears: tender.minExperienceYears,
      },
    },
    msmeBenefits: {
      emdWaivedAmount: emdWaived,
      tenderFeeWaivedAmount: tenderFeeWaived,
      totalSavings: emdWaived + tenderFeeWaived,
      policyReference: 'Rule 170 GFR 2017 & Public Procurement Policy for MSEs Order 2012',
    },
    gapAnalysis: {
      hasGaps: gaps.length > 0,
      gaps,
    },
    aiRecommendationSummary,
  };
}
