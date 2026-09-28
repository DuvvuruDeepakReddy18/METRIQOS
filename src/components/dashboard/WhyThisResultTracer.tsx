import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, ChevronRight, FileText, Scale, Thermometer, ShieldCheck, Binary, Eye } from 'lucide-react';
import { MeasurementEvent } from '../../types/metrology';
import { DEMO_MEASUREMENTS } from '../../data/initialData';

export const WhyThisResultTracer: React.FC = () => {
  const [selectedMevId, setSelectedMevId] = useState<string>('MEV-000481');
  const [showFullReasoning, setShowFullReasoning] = useState(false);

  const currentMev = DEMO_MEASUREMENTS.find((m) => m.id === selectedMevId) || DEMO_MEASUREMENTS[0];
  const isVerified = currentMev.validationState === 'VERIFIED';

  const PROVENANCE_STEPS = [
    {
      label: 'RESULT',
      value: currentMev.validationState,
      status: currentMev.validationState,
      icon: isVerified ? CheckCircle2 : AlertTriangle,
      color: isVerified ? 'text-[#20C997]' : 'text-[#F4B740]',
    },
    {
      label: 'CALCULATION',
      value: `Δ = ${currentMev.difference > 0 ? '+' : ''}${currentMev.difference.toFixed(3)} kg ≤ ±${currentMev.mpeCriterion.toFixed(3)} kg`,
      status: 'VERIFIED',
      icon: Binary,
      color: 'text-[#19C7C8]',
    },
    {
      label: 'RAW MEASUREMENT',
      value: `${currentMev.indicatedValue.toFixed(3)} kg (${currentMev.source.replace('AUTOPORT_', '')})`,
      status: 'CAPTURED',
      icon: Scale,
      color: 'text-[#5B8CFF]',
    },
    {
      label: 'REFERENCE STANDARD',
      value: currentMev.referenceEquipmentId,
      status: 'VALID CERT',
      icon: ShieldCheck,
      color: 'text-[#20C997]',
    },
    {
      label: 'ENVIRONMENT',
      value: '20.4°C / 51.2% RH (LOCKED)',
      status: 'COMPLIANT',
      icon: Thermometer,
      color: 'text-[#19C7C8]',
    },
    {
      label: 'EVIDENCE ATTACHED',
      value: `${currentMev.evidenceIds.length} Cryptographic Proofs`,
      status: 'SEALED',
      icon: FileText,
      color: 'text-[#5B8CFF]',
    },
    {
      label: 'RULE VERSION',
      value: 'OIML R76-1:2006 (v3.2.0)',
      status: 'ACTIVE',
      icon: Binary,
      color: 'text-[#9AAABD]',
    },
  ];

  return (
    <div className="bg-[#0B1726] border border-[#26384D] rounded-xl p-4 shadow-xl relative overflow-hidden">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-3 border-b border-[#26384D] gap-2">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#19C7C8]" />
          <h4 className="text-xs font-mono font-bold tracking-wider text-[#19C7C8] uppercase">
            Why This Result? • Provenance Path Tracer
          </h4>
        </div>

        {/* Measurement selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#64748B] font-mono">Trace Event:</span>
          <select
            value={selectedMevId}
            onChange={(e) => setSelectedMevId(e.target.value)}
            className="bg-[#101D2D] border border-[#26384D] rounded px-2.5 py-1 text-xs text-[#F4F7FA] font-mono focus:border-[#19C7C8] focus:outline-none"
          >
            {DEMO_MEASUREMENTS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.id} ({m.testType.split('(')[0].trim()} - {m.validationState})
              </option>
            ))}
          </select>

          <button
            onClick={() => setShowFullReasoning(!showFullReasoning)}
            className="flex items-center gap-1 text-xs font-mono px-2.5 py-1 rounded bg-[#142438] text-[#19C7C8] border border-[#26384D] hover:bg-[#101D2D] transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            {showFullReasoning ? 'Hide Details' : 'Show Reasoning'}
          </button>
        </div>
      </div>

      {/* Provenance chain nodes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-2">
        {PROVENANCE_STEPS.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={step.label}
              className="bg-[#101D2D] border border-[#26384D] rounded-lg p-2.5 relative flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono text-[#64748B] uppercase">
                  {step.label}
                </span>
                <Icon className={`w-3.5 h-3.5 ${step.color}`} />
              </div>

              <div className="text-xs font-mono font-semibold text-[#F4F7FA] truncate">
                {step.value}
              </div>

              <div className="mt-1 flex items-center justify-between">
                <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                  step.status === 'VERIFIED' || step.status === 'VALID CERT' || step.status === 'COMPLIANT'
                    ? 'bg-[#20C997]/10 text-[#20C997]'
                    : step.status === 'REVIEW_REQUIRED'
                    ? 'bg-[#F4B740]/10 text-[#F4B740]'
                    : 'bg-[#5B8CFF]/10 text-[#5B8CFF]'
                }`}>
                  {step.status}
                </span>
                <span className="text-[10px] font-mono text-[#64748B]">
                  0{idx + 1}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Expandable Reasoning Deep-Dive */}
      {showFullReasoning && (
        <div className="mt-3 pt-3 border-t border-[#26384D] bg-[#07111F] p-3 rounded-lg border border-[#26384D] text-xs space-y-2">
          <div className="text-[#19C7C8] font-mono font-semibold">
            METROLOGICAL PROVENANCE RATIONALE FOR {currentMev.id}
          </div>
          <p className="text-[#9AAABD] leading-relaxed">
            The observation of <strong className="text-[#F4F7FA]">{currentMev.indicatedValue} kg</strong> on standard nominal load of <strong className="text-[#F4F7FA]">{currentMev.referenceLoad} kg</strong> resulted in a net observed deviation of <strong className="text-[#F4F7FA]">{currentMev.difference > 0 ? '+' : ''}{currentMev.difference} kg</strong>.
            Under OIML R76-1:2006 Clause 3.5.1 Table 6 (verification scale interval <strong className="text-[#F4F7FA]">e = 0.05 kg</strong>), the applicable Maximum Permissible Error (MPE) for a test load of {currentMev.referenceLoad} kg ({currentMev.referenceLoad / 0.05} e) is <strong className="text-[#F4F7FA]">±{currentMev.mpeCriterion} kg</strong>.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 font-mono text-[11px] pt-1">
            <div className="bg-[#101D2D] p-2 rounded border border-[#26384D]">
              <span className="text-[#64748B] block">Primary Engine A:</span>
              <span className="text-[#20C997]">{currentMev.engineAResult} (Deviation within MPE)</span>
            </div>
            <div className="bg-[#101D2D] p-2 rounded border border-[#26384D]">
              <span className="text-[#64748B] block">Independent Engine B:</span>
              <span className="text-[#20C997]">{currentMev.engineBResult} (Integer Arithmetic Match)</span>
            </div>
            <div className="bg-[#101D2D] p-2 rounded border border-[#26384D]">
              <span className="text-[#64748B] block">Cryptographic Hash:</span>
              <span className="text-[#5B8CFF] truncate block">{currentMev.integrityHash.slice(0, 24)}...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
