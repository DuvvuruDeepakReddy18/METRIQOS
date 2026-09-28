import React, { useState } from 'react';
import { Scale, Cpu, ShieldCheck, Binary, FileCheck, CheckCircle2, ChevronRight, Hash, ArrowRight } from 'lucide-react';

interface Stage {
  id: string;
  name: string;
  tagline: string;
  icon: any;
  metric: string;
  details: string;
  dataSnippet: string;
}

const FLOW_STAGES: Stage[] = [
  {
    id: 'physical',
    name: 'PHYSICAL INSTRUMENT',
    tagline: 'Force applied to strain load-cell matrix',
    icon: Scale,
    metric: '100.000 kg Nominal',
    details: 'Mechanical force transferred via 4-point shear beam platform to 2.0 mV/V strain gauges.',
    dataSnippet: 'Transducer ΔV: +1.9984 mV | Spirit Level: VERIFIED',
  },
  {
    id: 'digital',
    name: 'DIGITAL MEASUREMENT',
    tagline: 'AutoPort serial telemetry capture',
    icon: Cpu,
    metric: '100.012 kg Indicated',
    details: 'Continuous 9600-baud RS-232 telemetry frame captured directly by kernel UART daemon.',
    dataSnippet: 'RAW FRAME: ST,GS,+000100.012,kg\\r\\n',
  },
  {
    id: 'validation',
    name: 'VALIDATION',
    tagline: 'Stability & context verification',
    icon: ShieldCheck,
    metric: 'Stability: 100% Stable',
    details: 'Zero-drift, motion detection flag verified; ambient temperature within 20°C ± 2°C window.',
    dataSnippet: 'Context Lock: ENV-2026-0928-01 (20.4°C) | Δt < 15ms',
  },
  {
    id: 'rules',
    name: 'RULE ENGINE',
    tagline: 'Deterministic OIML R76 MPE evaluation',
    icon: Binary,
    metric: 'MPE: ±0.050 kg',
    details: 'Dual-Engine verification (Engine A boundary + Engine B integer arithmetic) evaluated.',
    dataSnippet: 'Error: +0.012 kg ≤ MPE(2000e) ±0.050 kg | Dual Match: TRUE',
  },
  {
    id: 'proof',
    name: 'PROOF OBJECT',
    tagline: 'Immutable cryptographic binding',
    icon: Hash,
    metric: 'SHA-256 Fingerprint',
    details: 'Raw measurement, equipment certs, rule version, and environment sealed into proof card.',
    dataSnippet: 'HASH: 8b7d91e604f27ca34b899120de84021948ba9e120894acdf...',
  },
  {
    id: 'report',
    name: 'SEALED REPORT',
    tagline: 'Tamper-evident legal certificate',
    icon: FileCheck,
    metric: 'REP-R76-2026-00412',
    details: 'Cryptographically signed verification certificate with public QR traceability link.',
    dataSnippet: 'Status: SEALED | Accreditation: ISO/IEC 17025 Compliant',
  },
];

export const MeasurementAssuranceFlow: React.FC = () => {
  const [activeStageId, setActiveStageId] = useState<string>('rules');

  const activeStage = FLOW_STAGES.find((s) => s.id === activeStageId) || FLOW_STAGES[0];

  return (
    <div className="bg-[#0B1726] border border-[#26384D] rounded-xl p-5 shadow-xl relative overflow-hidden">
      {/* Background subtle technical grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-[#26384D] relative z-10 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#19C7C8]" />
            <h3 className="text-xs font-mono font-bold tracking-widest text-[#19C7C8] uppercase">
              Core Architecture Assurance Flow
            </h3>
          </div>
          <p className="text-sm font-semibold text-[#F4F7FA] mt-0.5">
            Physical Measurement to Cryptographic Proof Decision
          </p>
        </div>
        <div className="text-[11px] font-mono text-[#9AAABD] bg-[#101D2D] px-3 py-1.5 rounded-lg border border-[#26384D]">
          Deterministic Pipeline • Zero Black-Box Decisions
        </div>
      </div>

      {/* Horizontal Flow Pipeline */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5 relative z-10">
        {FLOW_STAGES.map((stage, idx) => {
          const Icon = stage.icon;
          const isSelected = stage.id === activeStageId;

          return (
            <div
              key={stage.id}
              onClick={() => setActiveStageId(stage.id)}
              className={`cursor-pointer group relative p-3 rounded-lg border transition-all ${
                isSelected
                  ? 'bg-[#142438] border-[#19C7C8] shadow-lg shadow-[#19C7C8]/10'
                  : 'bg-[#101D2D]/80 border-[#26384D] hover:border-[#5B8CFF]/50 hover:bg-[#101D2D]'
              }`}
            >
              {/* Step indicator header */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-[#64748B]">
                  0{idx + 1}
                </span>
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isSelected ? 'text-[#19C7C8]' : 'text-[#9AAABD] group-hover:text-[#F4F7FA]'
                  }`}
                />
              </div>

              {/* Title & metrics */}
              <div className="text-xs font-bold text-[#F4F7FA] mb-1 truncate">
                {stage.name}
              </div>
              <div className="text-[11px] font-mono text-[#19C7C8] truncate">
                {stage.metric}
              </div>

              {/* Connector line for large screens */}
              {idx < FLOW_STAGES.length - 1 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-20 text-[#26384D]">
                  <ChevronRight className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Active Stage Deep-Dive Inspection Strip */}
      <div className="mt-4 pt-3 border-t border-[#26384D] relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#101D2D]/60 p-3 rounded-lg border border-[#26384D]/60">
        <div className="flex items-start md:items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#142438] border border-[#26384D] flex items-center justify-center shrink-0">
            <activeStage.icon className="w-4 h-4 text-[#19C7C8]" />
          </div>
          <div>
            <div className="text-xs font-semibold text-[#F4F7FA] flex items-center gap-2">
              <span>{activeStage.name} Details</span>
              <span className="text-[10px] font-mono text-[#5B8CFF] px-1.5 py-0.5 rounded bg-[#5B8CFF]/10">
                {activeStage.tagline}
              </span>
            </div>
            <div className="text-xs text-[#9AAABD] mt-0.5">
              {activeStage.details}
            </div>
          </div>
        </div>

        {/* Technical Data Monospace Snippet */}
        <div className="font-mono text-xs text-[#20C997] bg-[#07111F] px-3 py-1.5 rounded border border-[#26384D] truncate max-w-full md:max-w-md">
          {activeStage.dataSnippet}
        </div>
      </div>
    </div>
  );
};
