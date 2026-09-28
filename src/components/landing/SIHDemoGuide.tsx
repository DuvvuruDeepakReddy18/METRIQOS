import React, { useState } from 'react';
import { 
  Sparkles, ChevronRight, ChevronLeft, CheckCircle2, 
  Play, RotateCcw, X, ShieldAlert, FileText, ArrowRight 
} from 'lucide-react';

export interface SIHDemoStep {
  step: number;
  title: string;
  route: string;
  instruction: string;
  actionLabel?: string;
  highlightCategory: string;
}

export const SIH_DEMO_STEPS: SIHDemoStep[] = [
  {
    step: 1,
    title: 'Select Demo Instrument',
    route: 'instruments',
    instruction: 'Inspect registered NAWI candidates. Select NAWI-2026-00142 (Sartorius Combics 3 Industrial Platform Scale).',
    actionLabel: 'View Digital Twin',
    highlightCategory: 'INSTRUMENT REGISTRY',
  },
  {
    step: 2,
    title: 'Explore 3D Digital Twin',
    route: 'digital-twin',
    instruction: 'Interact with the 3D model: rotate the scale, toggle Exploded View to separate load-cells and receptor, and click parts.',
    actionLabel: 'Compile Test Plan',
    highlightCategory: 'DIGITAL TWIN',
  },
  {
    step: 3,
    title: 'Generate Applicable Test Plan',
    route: 'applicability',
    instruction: 'The Applicability Compiler analyzes Class III, Max 150 kg, e=0.05 kg and determines 5 mandatory OIML R76 tests. Click "Why?".',
    actionLabel: 'Check Readiness Gate',
    highlightCategory: 'APPLICABILITY COMPILER',
  },
  {
    step: 4,
    title: 'Pass Test Readiness Gate',
    route: 'workbench',
    instruction: 'Verify calibration certificates of reference standards and ambient stability (20.4°C). The gate authorizes test execution.',
    actionLabel: 'Open AutoPort',
    highlightCategory: 'READINESS GATE',
  },
  {
    step: 5,
    title: 'Connect Simulated Indicator (AutoPort)',
    route: 'workbench',
    instruction: 'Click "Connect AutoPort Indicator". Continuous 9600-baud RS-232 telemetry frames stream directly into the terminal.',
    actionLabel: 'Stream Packets',
    highlightCategory: 'AUTOPORT TELEMETRY',
  },
  {
    step: 6,
    title: 'Capture Real-Time Measurement',
    route: 'workbench',
    instruction: 'At Step 4 (100 kg load step), capture the stable indicated value 100.012 kg directly from the serial stream.',
    actionLabel: 'Create MEV',
    highlightCategory: 'DATA CAPTURE',
  },
  {
    step: 7,
    title: 'Create Immutable Measurement Event',
    route: 'workbench',
    instruction: 'System generates MEV-000481 with timestamp, operator ID, and a 64-character SHA-256 fingerprint.',
    actionLabel: 'Attach Proofs',
    highlightCategory: 'MEASUREMENT EVENT',
  },
  {
    step: 8,
    title: 'Attach Multi-Modal Evidence',
    route: 'workbench',
    instruction: 'Link optical indicator screen capture, NPL calibration certificate PDF, and raw UART serial dump.',
    actionLabel: 'Run Dual Engines',
    highlightCategory: 'EVIDENCE PASSPORT',
  },
  {
    step: 9,
    title: 'Calculate Deterministic OIML Result',
    route: 'workbench',
    instruction: 'Primary Engine A evaluates observed deviation (+0.012 kg) against OIML R76 Table 6 MPE (±0.050 kg). Result: VERIFIED.',
    actionLabel: 'Run Independent Verifier',
    highlightCategory: 'RULE ENGINE',
  },
  {
    step: 10,
    title: 'Run Independent Verification Engine',
    route: 'workbench',
    instruction: 'Engine B independently calculates compliance via scaled integer arithmetic. Numerical convergence: PERFECT MATCH.',
    actionLabel: 'Inspect Proof Object',
    highlightCategory: 'DUAL VERIFICATION',
  },
  {
    step: 11,
    title: 'Show Metrology Proof Object',
    route: 'dashboard',
    instruction: 'Inspect the Proof Object on the Command Center tracer showing: Raw Observation ✓ Rule ✓ Calculation ✓ Evidence ✓ Standards ✓.',
    actionLabel: 'Inspect Evidence Graph',
    highlightCategory: 'PROOF OBJECT',
  },
  {
    step: 12,
    title: 'Inspect Interactive Evidence Graph',
    route: 'evidence-graph',
    instruction: 'Navigate the complete cryptographic DAG linking Physical Scale → AutoPort UART → MEV → Proof Object → Sealed Report.',
    actionLabel: 'Trigger Controlled Failure',
    highlightCategory: 'PROVENANCE GRAPH',
  },
  {
    step: 13,
    title: 'Trigger Controlled Data Inconsistency',
    route: 'workbench',
    instruction: 'Click "Inject Controlled Deviation (Demo)" to simulate a physical sensor drift or near-boundary observation.',
    actionLabel: 'Observe Safety Status',
    highlightCategory: 'CONTROLLED FAILURE',
  },
  {
    step: 14,
    title: 'Observe REVIEW REQUIRED Status',
    route: 'workbench',
    instruction: 'Notice METRIQOS refuses to silently guess! It flags the observation as REVIEW REQUIRED under expanded uncertainty.',
    actionLabel: 'Review & Adjudicate',
    highlightCategory: 'COMPLIANCE INTEGRITY',
  },
  {
    step: 15,
    title: 'Perform Controlled Human Override',
    route: 'workbench',
    instruction: 'Open Reviewer Controlled Override. Provide mandatory justification note: "Corner dampener serviced". Authorize pass.',
    actionLabel: 'Verify Dual Audit',
    highlightCategory: 'HUMAN OVERRIDE',
  },
  {
    step: 16,
    title: 'Approve & Confirm Final Callset',
    route: 'workbench',
    instruction: 'All 5 ascending and descending load steps confirmed. Both original and overridden records remain intact in the ledger.',
    actionLabel: 'Generate Sealed Report',
    highlightCategory: 'AUDIT LEDGER',
  },
  {
    step: 17,
    title: 'Generate Cryptographically Sealed Report',
    route: 'reports',
    instruction: 'View the formal white technical certificate REP-R76-2026-00412 with all 12 OIML sections, tables, formulas, and signatures.',
    actionLabel: 'Scan Verification QR',
    highlightCategory: 'SEALED REPORT',
  },
  {
    step: 18,
    title: 'Verify Report QR Code Integrity',
    route: 'verify-report',
    instruction: 'Open the digital verification page. Test bit-flip tampering simulation to demonstrate tamper-evident detection.',
    actionLabel: 'Open Event Replay',
    highlightCategory: 'QR VERIFICATION',
  },
  {
    step: 19,
    title: 'Run Measurement Event Replay',
    route: 'replay',
    instruction: 'Step through the forensic engineering timeline: Test Started → Identity Locked → Standards Verified → Telemetry Captured.',
    actionLabel: 'Run Regulation Replay',
    highlightCategory: 'EVENT REPLAY',
  },
  {
    step: 20,
    title: 'Run Regulation Replay (Prospective Sandbox)',
    route: 'regulation-replay',
    instruction: 'Apply the candidate OIML 2026 Draft rule package (10% tighter MPE) against historical data to evaluate impact.',
    actionLabel: 'Verify Immutability',
    highlightCategory: 'REGULATION REPLAY',
  },
  {
    step: 21,
    title: 'Historical Report Unchanged (Trace the Result)',
    route: 'dashboard',
    instruction: 'Demonstrate that historical report REP-R76-2026-00412 remains 100% immutable while new standards are evaluated safely!',
    actionLabel: 'SIH Demo Complete ✓',
    highlightCategory: 'METROLOGY ASSURANCE',
  },
];

interface SIHDemoGuideProps {
  currentStepIndex: number;
  onNavigateStep: (stepIndex: number, targetRoute: string) => void;
  onClose: () => void;
}

export const SIHDemoGuide: React.FC<SIHDemoGuideProps> = ({
  currentStepIndex,
  onNavigateStep,
  onClose,
}) => {
  const currentStep = SIH_DEMO_STEPS[currentStepIndex] || SIH_DEMO_STEPS[0];

  const handleNext = () => {
    if (currentStepIndex < SIH_DEMO_STEPS.length - 1) {
      const nextIdx = currentStepIndex + 1;
      onNavigateStep(nextIdx, SIH_DEMO_STEPS[nextIdx].route);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      const prevIdx = currentStepIndex - 1;
      onNavigateStep(prevIdx, SIH_DEMO_STEPS[prevIdx].route);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md w-full bg-[#0B1726]/95 backdrop-blur-xl border-2 border-[#19C7C8] rounded-xl p-4 shadow-2xl space-y-3 font-mono">
      {/* Header bar */}
      <div className="flex items-center justify-between pb-2 border-b border-[#26384D]">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#19C7C8] animate-pulse" />
          <span className="text-xs font-bold text-[#19C7C8] uppercase tracking-wide">
            SIH Guided Evaluator Tour
          </span>
          <span className="text-[10px] text-[#F4F7FA] bg-[#142438] px-2 py-0.5 rounded border border-[#26384D]">
            Step {currentStep.step} of 21
          </span>
        </div>
        <button onClick={onClose} className="text-[#9AAABD] hover:text-[#F4F7FA] text-xs">
          ✕
        </button>
      </div>

      {/* Step Content */}
      <div>
        <div className="text-[10px] uppercase text-[#5B8CFF] font-bold">
          {currentStep.highlightCategory}
        </div>
        <h4 className="text-sm font-bold text-[#F4F7FA] mt-0.5">
          {currentStep.title}
        </h4>
        <p className="text-xs text-[#9AAABD] font-sans mt-1 leading-relaxed">
          {currentStep.instruction}
        </p>
      </div>

      {/* Action / Next Step Bar */}
      <div className="pt-2 border-t border-[#26384D] flex items-center justify-between">
        <div className="flex items-center gap-1">
          <button
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            className="p-1 rounded bg-[#101D2D] text-[#9AAABD] hover:text-[#F4F7FA] disabled:opacity-30 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            disabled={currentStepIndex === SIH_DEMO_STEPS.length - 1}
            className="p-1 rounded bg-[#101D2D] text-[#9AAABD] hover:text-[#F4F7FA] disabled:opacity-30 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={handleNext}
          className="px-3.5 py-1.5 rounded-lg bg-[#19C7C8] hover:bg-[#19C7C8]/90 text-[#07111F] text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
        >
          <span>{currentStep.actionLabel || 'Proceed to Next Step'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
