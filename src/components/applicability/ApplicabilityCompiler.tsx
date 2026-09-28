import React, { useState } from 'react';
import { 
  Binary, HelpCircle, CheckCircle2, AlertTriangle, XCircle, 
  ArrowRight, ShieldCheck, Scale, Cpu, Info 
} from 'lucide-react';
import { Instrument, ApplicableTestRequirement } from '../../types/metrology';
import { compileApplicability } from '../../core/ruleEngine';
import { DEMO_INSTRUMENTS } from '../../data/initialData';

interface ApplicabilityCompilerProps {
  onProceedToWorkbench?: () => void;
}

export const ApplicabilityCompiler: React.FC<ApplicabilityCompilerProps> = ({
  onProceedToWorkbench,
}) => {
  const [selectedInstrumentId, setSelectedInstrumentId] = useState<string>(DEMO_INSTRUMENTS[0].id);
  const [selectedRequirement, setSelectedRequirement] = useState<ApplicableTestRequirement | null>(null);

  const instrument = DEMO_INSTRUMENTS.find((i) => i.id === selectedInstrumentId) || DEMO_INSTRUMENTS[0];
  const compiledRequirements = compileApplicability(instrument);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#26384D] gap-2">
        <div>
          <div className="flex items-center gap-2">
            <Binary className="w-4 h-4 text-[#19C7C8]" />
            <h2 className="text-base font-bold text-[#F4F7FA]">
              OIML R76 Test Applicability Compiler
            </h2>
          </div>
          <p className="text-xs text-[#9AAABD] mt-0.5">
            Deterministic inference engine compiling exact statutory test requirements from instrument metrological parameters.
          </p>
        </div>

        {/* Instrument Selector */}
        <div className="flex items-center gap-2 bg-[#0B1726] px-3 py-1.5 rounded-lg border border-[#26384D]">
          <span className="text-xs text-[#64748B] font-mono">Compile For:</span>
          <select
            value={selectedInstrumentId}
            onChange={(e) => {
              setSelectedInstrumentId(e.target.value);
              setSelectedRequirement(null);
            }}
            className="bg-[#101D2D] border border-[#26384D] rounded px-2.5 py-1 text-xs text-[#F4F7FA] font-mono focus:border-[#19C7C8] focus:outline-none"
          >
            {DEMO_INSTRUMENTS.map((inst) => (
              <option key={inst.id} value={inst.id}>
                {inst.id} — {inst.name} ({inst.accuracyClass})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Selected Instrument Parameters Card */}
      <div className="bg-[#0B1726] border border-[#26384D] rounded-xl p-4 shadow-xl">
        <span className="text-[10px] font-mono uppercase text-[#64748B] tracking-wider block mb-2">
          Active Instrument Metrological Parameters
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-xs font-mono">
          <div className="bg-[#101D2D] p-2.5 rounded-lg border border-[#26384D]">
            <span className="text-[#64748B] text-[10px] block">ACCURACY CLASS</span>
            <span className="text-[#F4F7FA] font-bold">{instrument.accuracyClass}</span>
          </div>
          <div className="bg-[#101D2D] p-2.5 rounded-lg border border-[#26384D]">
            <span className="text-[#64748B] text-[10px] block">MAX CAPACITY</span>
            <span className="text-[#F4F7FA] font-bold">{instrument.maxCapacity} {instrument.unit}</span>
          </div>
          <div className="bg-[#101D2D] p-2.5 rounded-lg border border-[#26384D]">
            <span className="text-[#64748B] text-[10px] block">MIN CAPACITY</span>
            <span className="text-[#F4F7FA] font-bold">{instrument.minCapacity} {instrument.unit}</span>
          </div>
          <div className="bg-[#101D2D] p-2.5 rounded-lg border border-[#26384D]">
            <span className="text-[#64748B] text-[10px] block">VERIFICATION 'e'</span>
            <span className="text-[#19C7C8] font-bold">{instrument.verificationInterval_e} {instrument.unit}</span>
          </div>
          <div className="bg-[#101D2D] p-2.5 rounded-lg border border-[#26384D]">
            <span className="text-[#64748B] text-[10px] block">INTERVAL 'd'</span>
            <span className="text-[#F4F7FA] font-bold">{instrument.actualInterval_d} {instrument.unit}</span>
          </div>
          <div className="bg-[#101D2D] p-2.5 rounded-lg border border-[#26384D]">
            <span className="text-[#64748B] text-[10px] block">TARE DEVICE</span>
            <span className="text-[#F4F7FA] font-bold">{instrument.tareCapacity > 0 ? `${instrument.tareCapacity} ${instrument.unit}` : 'None'}</span>
          </div>
        </div>
      </div>

      {/* Main Requirements Matrix Table & Why Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Table of Tests (8 cols) */}
        <div className="lg:col-span-8 bg-[#0B1726] border border-[#26384D] rounded-xl overflow-hidden shadow-xl">
          <div className="px-4 py-3 border-b border-[#26384D] flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-[#F4F7FA]">
              Compiled Test Matrix • OIML R76-1:2006
            </span>
            <span className="text-xs font-mono text-[#19C7C8]">
              {compiledRequirements.filter((r) => r.status === 'APPLICABLE').length} Applicable Tests
            </span>
          </div>

          <div className="divide-y divide-[#26384D]">
            {compiledRequirements.map((req) => {
              const isSelected = selectedRequirement?.id === req.id;

              return (
                <div
                  key={req.id}
                  onClick={() => setSelectedRequirement(req)}
                  className={`p-3.5 cursor-pointer transition-all flex items-start justify-between gap-3 ${
                    isSelected ? 'bg-[#142438]' : 'hover:bg-[#101D2D]/60'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#F4F7FA]">{req.name}</span>
                      <span className="text-[10px] font-mono text-[#5B8CFF] bg-[#5B8CFF]/10 px-1.5 py-0.5 rounded border border-[#5B8CFF]/20">
                        {req.oimlClause}
                      </span>
                    </div>
                    <p className="text-xs text-[#9AAABD] line-clamp-2">
                      {req.reason}
                    </p>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                      req.status === 'APPLICABLE'
                        ? 'bg-[#20C997]/15 text-[#20C997] border-[#20C997]/30'
                        : req.status === 'CONDITIONALLY_APPLICABLE'
                        ? 'bg-[#F4B740]/15 text-[#F4B740] border-[#F4B740]/30'
                        : 'bg-[#64748B]/15 text-[#64748B] border-[#64748B]/30'
                    }`}>
                      {req.status.replace('_', ' ')}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedRequirement(req);
                      }}
                      className="text-xs font-mono text-[#19C7C8] hover:underline flex items-center gap-0.5"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      Why?
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* "Why?" Deep-Dive Explainability Drawer (4 cols) */}
        <div className="lg:col-span-4 bg-[#0B1726] border border-[#26384D] rounded-xl p-4 shadow-xl flex flex-col justify-between">
          {selectedRequirement ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#26384D]">
                <span className="text-xs font-mono font-bold text-[#19C7C8] uppercase tracking-wide">
                  Explainable Compliance Rationale
                </span>
                <span className="text-[10px] font-mono text-[#64748B]">
                  {selectedRequirement.oimlClause}
                </span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-[#F4F7FA]">
                  {selectedRequirement.name}
                </h4>
                <div className="mt-2 bg-[#101D2D] p-3 rounded-lg border border-[#26384D] text-xs font-mono space-y-1">
                  <span className="text-[#64748B] text-[10px] uppercase block">Statutory Logic & Rationale</span>
                  <p className="text-[#F4F7FA] leading-relaxed">
                    {selectedRequirement.reason}
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="bg-[#101D2D] p-2.5 rounded-lg border border-[#26384D]">
                  <span className="text-[#64748B] text-[10px] uppercase block">Acceptance Criterion Formula</span>
                  <span className="text-[#19C7C8] font-bold mt-0.5 block">
                    {selectedRequirement.criteriaFormula}
                  </span>
                </div>

                <div className="bg-[#101D2D] p-2.5 rounded-lg border border-[#26384D]">
                  <span className="text-[#64748B] text-[10px] uppercase block">MPE Specification</span>
                  <span className="text-[#9AAABD] mt-0.5 block">
                    {selectedRequirement.mpeDescription}
                  </span>
                </div>

                <div className="bg-[#101D2D] p-2.5 rounded-lg border border-[#26384D]">
                  <span className="text-[#64748B] text-[10px] uppercase block">Required Mass Load Steps</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedRequirement.requiredLoadSteps.map((s, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-[#142438] text-[#F4F7FA] border border-[#26384D]">
                        {s} {instrument.unit}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 space-y-2 text-xs text-[#64748B]">
              <HelpCircle className="w-8 h-8 text-[#26384D] mx-auto" />
              <p>Select any test from the matrix to inspect its legal metrology derivation rationale.</p>
            </div>
          )}

          {/* Action button at bottom */}
          <div className="pt-3 border-t border-[#26384D]">
            <button
              onClick={onProceedToWorkbench}
              className="w-full py-2.5 px-4 rounded-lg bg-[#19C7C8] hover:bg-[#19C7C8]/90 text-[#07111F] text-xs font-mono font-bold transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <span>Compile Into Active Test Plan</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
