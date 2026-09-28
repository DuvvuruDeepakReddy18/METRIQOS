import React from 'react';
import { 
  Scale, ShieldCheck, Cpu, Binary, Layers, RefreshCw, 
  FileCheck, Lock, ArrowRight, Play, CheckCircle2, ChevronRight 
} from 'lucide-react';
import { MeasurementAssuranceFlow } from '../dashboard/MeasurementAssuranceFlow';

interface LandingPageProps {
  onEnterDemo: () => void;
  onOpenArchitecture: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterDemo,
  onOpenArchitecture,
}) => {
  return (
    <div className="min-h-screen bg-[#07111F] text-[#F4F7FA] font-sans antialiased selection:bg-[#19C7C8]/20 selection:text-[#19C7C8]">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-[#07111F]/90 backdrop-blur-md border-b border-[#26384D] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#0B1726] border border-[#19C7C8]/50 flex items-center justify-center p-1">
            <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
              <circle cx="32" cy="32" r="20" stroke="#19C7C8" strokeWidth="3" strokeDasharray="4 2" />
              <path d="M 12 32 L 24 32 L 28 20 L 32 44 L 36 24 L 40 32 L 52 32" stroke="#F4F7FA" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <span className="font-mono font-extrabold text-base tracking-wider text-[#F4F7FA]">METRIQOS</span>
            <span className="hidden sm:inline-block ml-2 text-[10px] font-mono text-[#19C7C8] uppercase tracking-widest px-2 py-0.5 rounded bg-[#19C7C8]/10 border border-[#19C7C8]/20">
              Digital Metrology OS
            </span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-xs font-mono text-[#9AAABD]">
          <a href="#how-it-works" className="hover:text-[#F4F7FA] transition-colors">How It Works</a>
          <a href="#evidence-model" className="hover:text-[#F4F7FA] transition-colors">Evidence Model</a>
          <a href="#digital-twin" className="hover:text-[#F4F7FA] transition-colors">Digital Twin</a>
          <a href="#replay" className="hover:text-[#F4F7FA] transition-colors">Event Replay</a>
          <button onClick={onOpenArchitecture} className="text-[#19C7C8] hover:underline flex items-center gap-1">
            Architecture Blueprint
          </button>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={onEnterDemo}
            className="px-4 py-2 rounded-lg bg-[#19C7C8] hover:bg-[#19C7C8]/90 text-[#07111F] text-xs font-mono font-bold transition-all shadow-lg shadow-[#19C7C8]/20 flex items-center gap-1.5"
          >
            <span>ENTER METRIQOS DEMO</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-6 max-w-7xl mx-auto overflow-hidden">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#101D2D] border border-[#26384D] text-[11px] font-mono text-[#19C7C8]">
            <span className="w-2 h-2 rounded-full bg-[#19C7C8] animate-pulse" />
            Designed for OIML R76 Legal Metrology Assurance
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#F4F7FA] leading-tight">
            Every measurement has a story. <br />
            <span className="text-[#19C7C8]">Make that story verifiable.</span>
          </h1>

          <p className="text-sm sm:text-base text-[#9AAABD] leading-relaxed font-sans max-w-2xl mx-auto">
            METRIQOS connects physical instrument telemetry, reference standards, deterministic OIML rule calculations, human review, and tamper-evident reporting into one cryptographically traceable workflow.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <button
              onClick={onEnterDemo}
              className="px-6 py-3 rounded-lg bg-[#19C7C8] hover:bg-[#19C7C8]/90 text-[#07111F] text-xs font-mono font-bold tracking-wide transition-all shadow-xl shadow-[#19C7C8]/20 flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              LAUNCH 21-STEP SIH DEMO
            </button>

            <button
              onClick={onOpenArchitecture}
              className="px-5 py-3 rounded-lg bg-[#101D2D] hover:bg-[#142438] text-[#F4F7FA] text-xs font-mono font-medium border border-[#26384D] transition-all flex items-center gap-2"
            >
              <Layers className="w-4 h-4 text-[#5B8CFF]" />
              View 10-Tier Architecture
            </button>
          </div>
        </div>

        {/* Hero Interactive Visualization: Measurement Assurance Flow */}
        <div className="mt-14">
          <MeasurementAssuranceFlow />
        </div>
      </section>

      {/* Section 1: The Problem & The Metrology Solution */}
      <section id="how-it-works" className="py-16 bg-[#0B1726] border-y border-[#26384D] px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="text-[10px] font-mono text-[#5B8CFF] uppercase tracking-widest block">
              Core Metrological Differentiation
            </span>
            <h2 className="text-2xl font-bold text-[#F4F7FA]">
              Traditional systems automate the report.<br />
              <span className="text-[#19C7C8]">METRIQOS proves the measurement behind the report.</span>
            </h2>
            <p className="text-xs text-[#9AAABD] leading-relaxed">
              Traditional digital workflows merely act as glorified digital forms: an operator enters numbers into textboxes, a script computes Pass/Fail, and a PDF certificate is generated. If a commercial dispute arises, nobody can prove what the load-cell actually transmitted, whether the reference weights were expired, or if the environment was stable.
            </p>
            <p className="text-xs text-[#9AAABD] leading-relaxed">
              METRIQOS captures direct RS-232 telemetry, seals the ambient temperature context, locks the traceable standard certificates, executes dual-engine arithmetic verification, and binds every observation into an immutable cryptographic proof object.
            </p>
          </div>

          <div className="bg-[#101D2D] p-5 rounded-xl border border-[#26384D] space-y-3 font-mono text-xs">
            <span className="text-[10px] text-[#64748B] uppercase block">Architectural Comparison</span>

            <div className="bg-[#07111F] p-3 rounded border border-gray-700 space-y-1">
              <span className="text-[#EF5B5B] font-bold block text-[11px]">Conventional LIMS / Form Workflow:</span>
              <div className="text-[#9AAABD]">Fill Form → Calculate MPE → Generate PDF</div>
              <div className="text-[10px] text-[#64748B]">Zero raw data provenance; unprovable in court.</div>
            </div>

            <div className="bg-[#07111F] p-3 rounded border border-[#19C7C8]/50 space-y-1">
              <span className="text-[#20C997] font-bold block text-[11px]">METRIQOS Provenance Pipeline:</span>
              <div className="text-[#F4F7FA]">Instrument → Config → Applicability → Readiness → Raw Telemetry → Validation → Rule Engine → Dual Verification → Proof Object → Sealed Report → Replay</div>
              <div className="text-[10px] text-[#20C997]">Every result has a reason. Every reason has evidence.</div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Key Features Grid */}
      <section className="py-16 px-6 max-w-7xl mx-auto space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl font-bold text-[#F4F7FA]">
            Engineered for High-Consequence Metrology Labs
          </h2>
          <p className="text-xs text-[#9AAABD]">
            Built specifically to meet the statutory rigor of OIML R76, ISO/IEC 17025, and national legal metrology directorates.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          <div className="bg-[#0B1726] p-5 rounded-xl border border-[#26384D] space-y-2">
            <Cpu className="w-5 h-5 text-[#19C7C8]" />
            <h3 className="font-bold text-[#F4F7FA] text-sm font-sans">AutoPort Direct Telemetry</h3>
            <p className="text-[#9AAABD] leading-relaxed font-sans text-xs">
              Simulated & physical RS-232, USB, and BLE UART continuous frame ingestion. Eliminates transcription errors and manual fabrication.
            </p>
          </div>

          <div className="bg-[#0B1726] p-5 rounded-xl border border-[#26384D] space-y-2">
            <Binary className="w-5 h-5 text-[#5B8CFF]" />
            <h3 className="font-bold text-[#F4F7FA] text-sm font-sans">Dual-Engine Verification</h3>
            <p className="text-[#9AAABD] leading-relaxed font-sans text-xs">
              Runs two independent numerical calculation paths (boundary float vs scaled integer) on every observation to prevent computational drift.
            </p>
          </div>

          <div className="bg-[#0B1726] p-5 rounded-xl border border-[#26384D] space-y-2">
            <RefreshCw className="w-5 h-5 text-[#20C997]" />
            <h3 className="font-bold text-[#F4F7FA] text-sm font-sans">Regulation Replay Sandbox</h3>
            <p className="text-[#9AAABD] leading-relaxed font-sans text-xs">
              Prospective impact testing that re-evaluates historical raw callsets against future candidate standards without ever altering historical sealed records.
            </p>
          </div>
        </div>

        {/* Final CTA Banner */}
        <div className="bg-gradient-to-r from-[#0B1726] via-[#101D2D] to-[#0B1726] border border-[#26384D] rounded-2xl p-8 text-center space-y-4 shadow-2xl">
          <h3 className="text-xl font-bold text-[#F4F7FA]">
            Ready to experience the complete metrology assurance lifecycle?
          </h3>
          <p className="text-xs text-[#9AAABD] max-w-xl mx-auto">
            Test the live 3D Digital Twin, stream real-time AutoPort UART frames, inspect the cryptographic Evidence Graph, and evaluate prospective regulation replay.
          </p>
          <button
            onClick={onEnterDemo}
            className="px-6 py-3 rounded-lg bg-[#19C7C8] hover:bg-[#19C7C8]/90 text-[#07111F] text-xs font-mono font-bold tracking-wide transition-all shadow-xl shadow-[#19C7C8]/20"
          >
            ENTER METRIQOS DEMO NOW →
          </button>
        </div>
      </section>
    </div>
  );
};
