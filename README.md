# National MSME Tender Discovery & AICTE Internship Fraud Detection Platform

> **Assessment / Course:** INT257 CA1 (Registration: 12401916 / 2401916)  
> **Framework:** Next.js 14 (App Router) • TypeScript • Tailwind CSS • Lucide Icons  
> **Zero External Dependencies Required:** Works out of the box with `npm run dev`

---

## 🎯 Dual Problem Statement Alignment

This platform directly integrates and solves both key requirements:

1. **MSME Tender Discovery Platform**:
   - Businesses maintain an exhaustive company profile containing industry, location, certificates (Udyam, ISO, ZED, CMMI), turnover, investment, and capabilities.
   - Periodically collects permitted public tender information (from GeM, CPPP, IREPS, Defense Procurement, and AICTE).
   - Dynamically matches tenders against company eligibility criteria with multi-criteria scoring, GFR 2017 Rule 170 EMD exemption calculations, and gap remediation roadmaps.

2. **AICTE Internship Fraud Detection Hub**:
   - Advanced Explainable AI fraud pattern recognition for internship postings and offer letters.
   - Recruiter identity and corporate domain verification (detecting free Gmail/Yahoo/Outlook impersonations).
   - QR-code authenticity and digital signature verification against AICTE e-Governance standards.
   - Duplicate certificate serial number detection.
   - Student grievance filing and cyber cell complaint management workflow.

3. **Shared Trust Bridge**:
   - Verified MSMEs with active Udyam, valid GSTIN, and clean grievance records earn the **AICTE Verified Industrial Partner** badge.
   - Verified companies can publish genuine, stipend-funded apprenticeships directly to engineering students, eliminating predatory middleman syndicates.

---

## 🚀 Quick Start Guide

### 1. Run Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 2. Build for Production
```bash
npm run build
npm run start
```

---

## 🌟 Key Features & Functional Modules

### 1. MSME Tender Discovery & Eligibility Engine (`/tenders`)
- **Multi-Vector AI Match Score (0–100%)**:
  - Financial Turnover (30% weight) with automatic MSME relaxed turnover guidelines.
  - Mandatory & Preferred Certifications (25% weight).
  - Capabilities & Scope Semantic Overlap (25% weight).
  - Geographic & Regional Preference (10% weight).
  - Experience & Track Record (10% weight).
- **GFR 2017 Rule 170 EMD Exemption Calculator**:
  - Automatically calculates exact financial savings (e.g., ₹37 Lakhs EMD waived for Udyam MSMEs).
- **Eligibility Gap Analysis & Remediation**:
  - Identifies specific missing credentials (e.g. ISO 27001) and recommends consortium joint ventures.
- **Tender Closing Countdown**:
  - Real-time countdown timer with urgent warnings for tenders closing within 48 hours.

### 2. Company Profile & MSME Auto-Classification (`/profile`)
- **Official Ministry of MSME Composite Criteria**:
  - Input: Investment in Plant & Machinery (₹ Cr) + Annual Turnover (₹ Cr).
  - Computes: **Micro** (Inv ≤ ₹1 Cr & Turn ≤ ₹5 Cr), **Small** (Inv ≤ ₹10 Cr & Turn ≤ ₹50 Cr), **Medium** (Inv ≤ ₹50 Cr & Turn ≤ ₹250 Cr).
- **Certificate Expiry Monitor**:
  - Live badges: `Active` (green), `Expiring in X days` (amber), `Expired` (red).
- **Capability Tags & Keyword Taxonomy**:
  - Interactive tag editor for CPV, HSN, and domain capabilities.

### 3. Permitted Tender Ingestion & Periodic Collector (`/collector`)
- **Scheduled Background Polling**:
  - Configurable polling frequency (15s, 30s, 60s, 120s) with live countdown ticker.
- **SHA-256 Duplicate Detection**:
  - Automatically identifies and discards duplicate postings from regional aggregators.
- **Multi-Source Permitted Gateways**:
  - GeM, CPPP, IREPS (Railways), and Defense Procurement.
- **Manual CSV/JSON Import**:
  - Upload external tender datasets with live validation.

### 4. AICTE Internship Fraud Forensics Hub (`/aicte/fraud-scanner`)
- **Explainable AI Pattern Recognition**:
  - Transparent evidence cards with severity levels (Critical, High, Medium).
  - Detects upfront registration fees, security deposits, and training kit charges.
- **Recruiter Domain & Statutory Verification**:
  - Flags public webmail domains (`@gmail.com`, `@yahoo.com`) pretending to be corporate recruiters.
  - Validates statutory GSTIN and MCA Corporate CIN structure.
- **QR Code & Digital Signature Authenticity Validator**:
  - Interactive simulator verifying cryptographic tokens against `verify.aicte-india.org`.
- **1-Click Demo Scenarios**:
  - Instant pre-loaded test samples for examiners (Scam Fee Offer Letter, Phishing Lure, Verified MSME).

### 5. Verified MSME Apprenticeship Exchange (`/aicte/internships`)
- Genuine, audited apprenticeships published exclusively by verified MSMEs.
- Guaranteed monthly stipends, zero applicant fees, and verified contact points.

### 6. Student Grievance & Scam Redressal Cell (`/aicte/complaints`)
- Student complaint filing system with evidence attachments.
- Live progress tracker: `Submitted` ➔ `Under AICTE Review` ➔ `Escalated to Cyber Cell` ➔ `Company Blacklisted`.

### 7. Master Administrator Console & Audit Trail (`/admin`)
- Immutable, tamper-evident audit logging for every system event.
- Export audit trail to JSON.
- Adjudicate complaints and toggle enterprise verification badges.

### 8. Downloadable Official GFR 170 Dossier (PDF)
- Click **"Dossier / PDF"** on any tender card to generate and print a formal Government of India procurement dossier complete with exemption certification.

---

## 🏛️ Technology Stack

- **Framework**: Next.js 14.2.18 (App Router)
- **Language**: TypeScript 5.6
- **Styling**: Tailwind CSS 3.4
- **Icons**: Lucide React
- **Architecture**: Self-contained client and server API route state with local persistence. Zero database setup needed.
