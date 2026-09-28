import React, { useState } from 'react';
import { 
  Binary, ShieldCheck, GitBranch, ArrowRight, CheckCircle2, 
  Clock, AlertTriangle, Play, FileCode, Layers 
} from 'lucide-react';
import { RulePackage } from '../../types/metrology';
import { DEMO_RULE_PACKAGES, DEMO_MEASUREMENTS } from '../../data/initialData';

const GOVERNANCE_LIFECYCLE_STAGES = [
  'DRAFT',
  'SCHEMA VALIDATION',
  'TEST SUITE',
  'REGRESSION TEST',
  'HISTORICAL REPLAY',
  'IMPACT ANALYSIS',
  'AUTHORIZED APPROVAL',
  'ACTIVE',
];

export const RulePackageViewer: React.FC = () => {
  const [rulePackages, setRulePackages] = useState<RulePackage[]>(DEMO_RULE_PACKAGES);
  const [selectedRuleId, setSelectedRuleId] = useState<string>('RULE-PACK-R76-2006-V3');
  const [sandboxFactor, setSandboxFactor] = useState<number>(0.9);
  const [simulationActive, setSimulationActive] = useState(false);

  const selectedRule = rulePackages.find((r) => r.id === selectedRuleId) || rulePackages[0];

  // Sandbox simulation metrics
  const affectedCount = DEMO_MEASUREMENTS.filter((m) => {
    const tighterMpe = m.mpeCriterion * sandboxFactor;
    return Math.abs(m.difference) > tighterMpe;
  }).length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#26384D] gap-2">
        <div>
          <div className="flex items-center gap-2">
            <Binary className="w-4 h-4 text-[#19C7C8]" />
            <h2 className="text-base font-bold text-[#F4F7FA]">
              OIML Rule Package Governance & Lifecycle Manager
            </h2>
          </div>
          <p className="text-xs text-[#9AAABD] mt-0.5">
            Strict multi-gate lifecycle protecting production compliance rules against unverified modifications.
          </p>
        </div>

        <button
          onClick={() => alert('New Rule Package Draft initialized')}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#19C7C8] text-[#07111F] text-xs font-mono font-bold hover:bg-[#19C7C8]/90 transition-colors shadow-md"
        >
          Draft New Rule Package
        </button>
      </div>

      {/* Governance Multi-Gate Workflow Visualization */}
      <div className="bg-[#0B1726] border border-[#26384D] rounded-xl p-4 shadow-xl">
        <span className="text-[10px] font-mono text-[#64748B] uppercase tracking-wider block mb-2">
          Mandatory 8-Stage Regulatory Release Gate
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {GOVERNANCE_LIFECYCLE_STAGES.map((stage, idx) => (
            <div
              key={stage}
              className={`p-2 rounded-lg border text-center text-xs font-mono ${
                stage === 'ACTIVE'
                  ? 'bg-[#20C997]/15 border-[#20C997]/40 text-[#20C997] font-bold'
                  : stage === 'AUTHORIZED APPROVAL'
                  ? 'bg-[#5B8CFF]/15 border-[#5B8CFF]/40 text-[#5B8CFF]'
                  : 'bg-[#101D2D] border-[#26384D] text-[#9AAABD]'
              }`}
            >
              <div className="text-[9px] text-[#64748B]">0{idx + 1}</div>
              <div className="text-[10px] font-semibold mt-0.5 truncate">{stage}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Grid: Rule Packages Table & Sandbox Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Packages List (7 cols) */}
        <div className="lg:col-span-7 bg-[#0B1726] border border-[#26384D] rounded-xl overflow-hidden shadow-xl">
          <div className="px-4 py-3 border-b border-[#26384D] flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-[#F4F7FA]">
              Registered Rule Packages
            </span>
            <span className="text-xs font-mono text-[#19C7C8]">
              {rulePackages.length} Installed
            </span>
          </div>

          <div className="divide-y divide-[#26384D]">
            {rulePackages.map((pkg) => {
              const isSelected = selectedRuleId === pkg.id;

              return (
                <div
                  key={pkg.id}
                  onClick={() => setSelectedRuleId(pkg.id)}
                  className={`p-4 cursor-pointer transition-all space-y-2 ${
                    isSelected ? 'bg-[#142438]' : 'hover:bg-[#101D2D]/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-[#19C7C8]">{pkg.id}</span>
                        <span className="text-xs font-bold text-[#F4F7FA]">{pkg.name}</span>
                      </div>
                      <div className="text-xs text-[#9AAABD] mt-0.5">{pkg.description}</div>
                    </div>

                    <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded border ${
                      pkg.status === 'ACTIVE'
                        ? 'bg-[#20C997]/15 text-[#20C997] border-[#20C997]/30'
                        : pkg.status === 'APPROVAL'
                        ? 'bg-[#F4B740]/15 text-[#F4B740] border-[#F4B740]/30'
                        : 'bg-[#5B8CFF]/15 text-[#5B8CFF] border-[#5B8CFF]/30'
                    }`}>
                      {pkg.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-[#64748B] pt-1">
                    <span>Version: <strong className="text-[#F4F7FA]">{pkg.version}</strong></span>
                    <span>Effective: <strong className="text-[#F4F7FA]">{pkg.effectiveDate}</strong></span>
                    <span>Created by: <strong className="text-[#F4F7FA]">{pkg.createdBy}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Rule Impact Simulator Sandbox (5 cols) */}
        <div className="lg:col-span-5 bg-[#0B1726] border border-[#26384D] rounded-xl p-4 shadow-xl flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#26384D]">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-[#19C7C8]" />
                <span className="text-xs font-mono font-bold text-[#19C7C8] uppercase tracking-wide">
                  Rule Impact Sandbox Simulator
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#101D2D] text-[#9AAABD]">
                Sandbox Isolated
              </span>
            </div>

            <p className="text-xs text-[#9AAABD] leading-relaxed">
              Test hypothetical MPE strictness criteria against historical measurement batches without impacting production ledgers.
            </p>

            {/* Sandbox Slider */}
            <div className="bg-[#101D2D] p-3 rounded-lg border border-[#26384D] space-y-2 font-mono text-xs">
              <div className="flex justify-between items-center">
                <span className="text-[#64748B]">Simulated MPE Multiplier:</span>
                <span className="text-[#19C7C8] font-bold">{sandboxFactor.toFixed(2)}x ({((1 - sandboxFactor) * 100).toFixed(0)}% Tighter)</span>
              </div>

              <input
                type="range"
                min="0.5"
                max="1.5"
                step="0.05"
                value={sandboxFactor}
                onChange={(e) => setSandboxFactor(parseFloat(e.target.value))}
                className="w-full accent-[#19C7C8]"
              />

              <div className="flex justify-between text-[10px] text-[#64748B]">
                <span>0.50x (Ultra Tight)</span>
                <span>1.00x (OIML Standard)</span>
                <span>1.50x (Expanded)</span>
              </div>
            </div>

            {/* Historical Impact Output */}
            <div className="bg-[#142438] p-3.5 rounded-lg border border-[#26384D] space-y-2 font-mono text-xs">
              <span className="text-[10px] text-[#64748B] uppercase block">
                Prospective Impact on Historical Callset
              </span>
              <div className="text-lg font-bold text-[#F4B740]">
                {affectedCount} Historical Measurements Shift Status
              </div>
              <p className="text-[11px] text-[#9AAABD]">
                Under a {((1 - sandboxFactor) * 100).toFixed(0)}% tighter MPE requirement, {affectedCount} observations in recent verification batches would transition from VERIFIED to REVIEW_REQUIRED.
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-[#26384D]">
            <button
              onClick={() => alert(`Simulated Impact Dossier generated for ${selectedRule.name}`)}
              className="w-full py-2 px-4 rounded-lg bg-[#142438] hover:bg-[#101D2D] text-[#19C7C8] text-xs font-mono font-bold border border-[#26384D] transition-colors flex items-center justify-center gap-2"
            >
              <Play className="w-3.5 h-3.5" />
              Generate Regulatory Impact Matrix
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
