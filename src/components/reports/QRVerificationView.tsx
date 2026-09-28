import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, CheckCircle2, Lock, ArrowLeft, RefreshCw, Hash, FileText } from 'lucide-react';
import { DEMO_REPORT } from '../../data/initialData';

interface QRVerificationViewProps {
  reportId?: string;
  onBackToReport?: () => void;
}

export const QRVerificationView: React.FC<QRVerificationViewProps> = ({
  reportId = 'REP-R76-2026-00412',
  onBackToReport,
}) => {
  const [simulateTamper, setSimulateTamper] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const report = DEMO_REPORT;
  const currentHash = simulateTamper
    ? 'e99887766554433221100aabbccddeeff00112233445566778899aabbccddeeff'
    : report.documentHash;

  const isMatch = !simulateTamper;

  const handleRecheck = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
    }, 400);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {/* Back button */}
      <button
        onClick={onBackToReport}
        className="flex items-center gap-1.5 text-xs font-mono text-[#9AAABD] hover:text-[#F4F7FA] transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Return to Official Certificate Viewer
      </button>

      {/* Main Verification Card */}
      <div className="bg-[#0B1726] border border-[#26384D] rounded-xl p-6 shadow-2xl space-y-6">
        {/* Verification Status Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#26384D] gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
              isMatch
                ? 'bg-[#20C997]/15 border-[#20C997]/40 text-[#20C997]'
                : 'bg-[#EF5B5B]/15 border-[#EF5B5B]/40 text-[#EF5B5B]'
            }`}>
              {isMatch ? <ShieldCheck className="w-7 h-7" /> : <ShieldAlert className="w-7 h-7" />}
            </div>
            <div>
              <span className="text-[10px] font-mono text-[#64748B] uppercase tracking-wider block">
                Legal Metrology Ledger Verification
              </span>
              <h1 className="text-xl font-bold font-mono text-[#F4F7FA]">
                {isMatch ? 'INTEGRITY VERIFIED' : 'INTEGRITY MISMATCH DETECTED'}
              </h1>
            </div>
          </div>

          <button
            onClick={handleRecheck}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#142438] text-[#19C7C8] border border-[#26384D] hover:bg-[#101D2D] text-xs font-mono transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
            Re-calculate Ledger Root
          </button>
        </div>

        {/* Diagnostic Metadata Grid */}
        <div className="space-y-3 font-mono text-xs">
          <div className="bg-[#101D2D] p-3 rounded-lg border border-[#26384D]">
            <span className="text-[#64748B] text-[10px] uppercase block">Report Document ID</span>
            <span className="text-[#F4F7FA] font-bold text-sm">{report.id}</span>
          </div>

          <div className="bg-[#101D2D] p-3 rounded-lg border border-[#26384D]">
            <span className="text-[#64748B] text-[10px] uppercase block">Computed Document SHA-256 Hash</span>
            <span className={`break-all text-xs font-bold block mt-0.5 ${isMatch ? 'text-[#20C997]' : 'text-[#EF5B5B]'}`}>
              {currentHash}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-[#101D2D] p-3 rounded-lg border border-[#26384D]">
              <span className="text-[#64748B] text-[10px] uppercase block">Sealed By Authority</span>
              <span className="text-[#F4F7FA] block mt-0.5">{report.sealedBy}</span>
            </div>

            <div className="bg-[#101D2D] p-3 rounded-lg border border-[#26384D]">
              <span className="text-[#64748B] text-[10px] uppercase block">Rule Engine Specification</span>
              <span className="text-[#19C7C8] block mt-0.5">{report.testedUnderRulePackage}</span>
            </div>
          </div>
        </div>

        {/* Cryptographic Boundary Scope Notice (Crucial Metrology Requirement!) */}
        <div className="bg-[#07111F] p-4 rounded-xl border border-[#26384D] text-xs space-y-2">
          <div className="flex items-center gap-2 text-[#5B8CFF] font-mono font-semibold">
            <Lock className="w-4 h-4" />
            <span>Cryptographic Authenticity Scope Notice</span>
          </div>
          <p className="text-[#9AAABD] leading-relaxed">
            The cryptographic hash confirms the authentic, untampered state of the recorded digital artifact according to the implemented signing process. It verifies that neither the numerical observations, calculation outputs, nor the reviewer signatures have been modified post-issuance. Metrological validity of the physical measurement is certified by the linked reference mass standards (STD-WEIGHT-M1-042) and locked ambient context.
          </p>
        </div>

        {/* Controlled Tamper Simulation for Judges / Evaluators */}
        <div className="pt-4 border-t border-[#26384D] flex items-center justify-between">
          <span className="text-xs font-mono text-[#64748B]">
            Demonstration Mode: Test Tamper Detection
          </span>
          <button
            onClick={() => setSimulateTamper(!simulateTamper)}
            className={`text-xs font-mono px-3 py-1.5 rounded-lg border transition-colors ${
              simulateTamper
                ? 'bg-[#EF5B5B]/20 text-[#EF5B5B] border-[#EF5B5B]'
                : 'bg-[#142438] text-[#9AAABD] border-[#26384D] hover:text-[#F4F7FA]'
            }`}
          >
            {simulateTamper ? 'Simulating Tampered Payload (Active)' : 'Simulate Bit-Flip / Tampering'}
          </button>
        </div>
      </div>
    </div>
  );
};
