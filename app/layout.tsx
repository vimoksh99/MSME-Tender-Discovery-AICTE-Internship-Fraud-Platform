import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import Navbar from '@/components/Navbar';
import EligibilityDrawer from '@/components/EligibilityDrawer';
import PdfExportModal from '@/components/PdfExportModal';
import QrScannerModal from '@/components/QrScannerModal';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'MSME Tender Discovery & AICTE Internship Fraud Detection Platform',
  description: 'Integrated government procurement eligibility engine, periodic tender collector, and AICTE explainable internship fraud prevention platform.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans antialiased selection:bg-gov-blue selection:text-white">
        <AppProvider>
          <Navbar />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </main>
          <EligibilityDrawer />
          <PdfExportModal />
          <QrScannerModal />
          {/* Official Footer */}
          <footer className="bg-slate-900 text-slate-400 text-xs py-8 border-t border-slate-800 mt-12 print:hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-white">
                  GOV
                </div>
                <div>
                  <div className="font-bold text-slate-200">
                    National MSME Tender Discovery & AICTE Internship Fraud Platform
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Designed for Government Procurement Compliance (GFR 2017) & Student Cyber Safety
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-6 text-[11px]">
                <span>GeM & CPPP Sync Engine Active</span>
                <span>•</span>
                <span>Rule 170 GFR 2017 Compliant</span>
                <span>•</span>
                <span>AICTE e-Governance Verified</span>
              </div>
            </div>
          </footer>
        </AppProvider>
      </body>
    </html>
  );
}
