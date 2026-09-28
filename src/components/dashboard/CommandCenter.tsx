import React from 'react';
import { 
  Play, Plus, Scale, ShieldCheck, AlertTriangle, FileCheck, 
  Activity, Clock, Cpu, Binary, ChevronRight, Hash, ArrowRight, Camera 
} from 'lucide-react';
import { MeasurementAssuranceFlow } from './MeasurementAssuranceFlow';
import { WhyThisResultTracer } from './WhyThisResultTracer';
import { NavigationRoute } from '../layout/Sidebar';
import { DEMO_MEASUREMENTS, DEMO_INSTRUMENTS, DEMO_REFERENCE_EQUIPMENT } from '../../data/initialData';

interface CommandCenterProps {
  onNavigate: (route: NavigationRoute) => void;
  onOpenOCR: () => void;
}

export const CommandCenter: React.FC<CommandCenterProps> = ({
  onNavigate,
  onOpenOCR,
}) => {
  const PIPELINE_STAGES = [
    { id: 'reg', name: 'REGISTERED', count: 3, status: 'Active Pool', color: 'text-[#5B8CFF]' },
    { id: 'conf', name: 'CONFIGURED', count: 2, status: 'Params Locked', color: 'text-[#19C7C8]' },
    { id: 'ready', name: 'READY', count: 1, status: 'Standards Calibrated', color: 'text-[#20C997]' },
    { id: 'meas', name: 'MEASURING', count: 1, status: 'AutoPort Stream', color: 'text-[#19C7C8]' },
    { id: 'valid', name: 'VALIDATING', count: 4, status: 'Dual Engine Pass', color: 'text-[#5B8CFF]' },
    { id: 'rev', name: 'REVIEW', count: 1, status: 'Override Pending', color: 'text-[#F4B740]' },
    { id: 'seal', name: 'SEALED', count: 142, status: 'QR Integrity Verified', color: 'text-[#20C997]' },
  ];

  const SYSTEM_ALERTS = [
    { id: 1, severity: 'WARNING', title: 'Marginal Deviation on Eccentricity Quadrant 4', desc: 'MEV-000484 produced +0.052 kg vs ±0.050 kg MPE threshold.', action: 'Review Incident', route: 'incidents' as NavigationRoute },
    { id: 2, severity: 'INFO', title: 'Quarantined Standard Weight Calibration Notice', desc: 'STD-WEIGHT-M1-EXPIRED validity expired on 2025-04-10 (Blocked).', action: 'Inspect Equipment', route: 'reference-equipment' as NavigationRoute },
    { id: 3, severity: 'INFO', title: 'Proposed OIML Revision Awaiting Approval', desc: 'RULE-PACK-R76-2026-REVISED ready for prospective regulation replay.', action: 'Run Sandbox Replay', route: 'regulation-replay' as NavigationRoute },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Header & Quick Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#26384D] gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#19C7C8]" />
            <h1 className="text-xl font-bold font-mono text-[#F4F7FA]">
              Metrology Command Center
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F4B740]/15 text-[#F4B740] border border-[#F4B740]/30 font-bold">
              DEMO DATA
            </span>
          </div>
          <p className="text-xs text-[#9AAABD] mt-1 font-mono">
            Monitor NAWI instruments, active OIML verification routines, measurement integrity, and legal compliance workflows.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          <button
            onClick={() => onNavigate('workbench')}
            className="px-3.5 py-2 rounded-lg bg-[#19C7C8] hover:bg-[#19C7C8]/90 text-[#07111F] font-bold transition-all shadow-md flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Launch Testing Workbench</span>
          </button>

          <button
            onClick={() => onNavigate('instruments')}
            className="px-3 py-2 rounded-lg bg-[#142438] hover:bg-[#101D2D] text-[#F4F7FA] border border-[#26384D] transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 text-[#19C7C8]" />
            <span>Register Instrument</span>
          </button>

          <button
            onClick={onOpenOCR}
            className="px-3 py-2 rounded-lg bg-[#101D2D] hover:bg-[#142438] text-[#19C7C8] border border-[#26384D] transition-colors flex items-center gap-1.5"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Scan Nameplate OCR</span>
          </button>
        </div>
      </div>

      {/* FIRST ROW: Stat Badges */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-[#0B1726] border border-[#26384D] rounded-xl p-4 shadow-xl">
          <span className="text-[10px] font-mono text-[#64748B] uppercase block">Active Laboratory Tests</span>
          <div className="text-2xl font-mono font-bold text-[#F4F7FA] mt-1">1 In Progress</div>
          <div className="text-[11px] font-mono text-[#19C7C8] mt-1">TP-2026-0089 (Step 4/7)</div>
        </div>

        <div className="bg-[#0B1726] border border-[#26384D] rounded-xl p-4 shadow-xl">
          <span className="text-[10px] font-mono text-[#64748B] uppercase block">Awaiting Officer Review</span>
          <div className="text-2xl font-mono font-bold text-[#F4B740] mt-1">1 Observation</div>
          <div className="text-[11px] font-mono text-[#9AAABD] mt-1">MEV-000484 (Eccentricity)</div>
        </div>

        <div className="bg-[#0B1726] border border-[#26384D] rounded-xl p-4 shadow-xl">
          <span className="text-[10px] font-mono text-[#64748B] uppercase block">Evidence Exceptions</span>
          <div className="text-2xl font-mono font-bold text-[#20C997] mt-1">0 Unresolved</div>
          <div className="text-[11px] font-mono text-[#20C997] mt-1">All standard certs active</div>
        </div>

        <div className="bg-[#0B1726] border border-[#26384D] rounded-xl p-4 shadow-xl">
          <span className="text-[10px] font-mono text-[#64748B] uppercase block">System Cryptographic Integrity</span>
          <div className="text-2xl font-mono font-bold text-[#20C997] mt-1">100% SECURE</div>
          <div className="text-[11px] font-mono text-[#64748B] mt-1">Ledger root hash verified</div>
        </div>
      </div>

      {/* SECOND ROW: Live Horizontal Test Pipeline */}
      <div className="bg-[#0B1726] border border-[#26384D] rounded-xl p-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#26384D]">
          <span className="text-xs font-mono font-bold text-[#F4F7FA] uppercase tracking-wider">
            Live NAWI Test Lifecycle Pipeline
          </span>
          <span className="text-[10px] font-mono text-[#19C7C8]">
            OIML R76-1:2006 Statutory Progression
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {PIPELINE_STAGES.map((stage, idx) => (
            <div
              key={stage.id}
              className="bg-[#101D2D] p-3 rounded-lg border border-[#26384D] flex flex-col justify-between"
            >
              <div className="flex justify-between items-center text-[10px] font-mono text-[#64748B]">
                <span>0{idx + 1}</span>
                <span className={`font-bold ${stage.color}`}>{stage.count} items</span>
              </div>
              <div className="text-xs font-mono font-bold text-[#F4F7FA] mt-1 truncate">
                {stage.name}
              </div>
              <div className="text-[10px] font-mono text-[#9AAABD] mt-1 truncate">
                {stage.status}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* HERO VISUAL: Measurement Assurance Flow */}
      <MeasurementAssuranceFlow />

      {/* MAIN VISUAL: WHY THIS RESULT? Tracer */}
      <WhyThisResultTracer />

      {/* THIRD & FOURTH ROWS: Measurement Integrity Donut & Active Laboratory Sessions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Third Row: Measurement Integrity Donut Visualization (4 cols) */}
        <div className="lg:col-span-4 bg-[#0B1726] border border-[#26384D] rounded-xl p-4 shadow-xl flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#26384D]">
            <span className="text-xs font-mono font-bold text-[#F4F7FA]">
              Measurement Integrity Ratio
            </span>
            <span className="text-[10px] font-mono text-[#20C997]">147 Observations</span>
          </div>

          {/* SVG Ring Donut Visualization */}
          <div className="flex items-center justify-center py-2">
            <div className="relative w-36 h-36">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                {/* Background Ring */}
                <circle cx="50" cy="50" r="38" stroke="#101D2D" strokeWidth="12" fill="none" />
                {/* Validated (96%) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  stroke="#20C997"
                  strokeWidth="12"
                  strokeDasharray="238.7"
                  strokeDashoffset="10"
                  fill="none"
                />
                {/* Requires Review (4%) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  stroke="#F4B740"
                  strokeWidth="12"
                  strokeDasharray="238.7"
                  strokeDashoffset="230"
                  fill="none"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center font-mono">
                <span className="text-xl font-bold text-[#20C997]">98.6%</span>
                <span className="text-[9px] text-[#64748B]">PASSED</span>
              </div>
            </div>
          </div>

          <div className="space-y-1.5 text-xs font-mono">
            <div className="flex justify-between items-center bg-[#101D2D] p-2 rounded">
              <span className="flex items-center gap-1.5 text-[#20C997]">
                <span className="w-2 h-2 rounded-full bg-[#20C997]" />
                Validated & Sealed
              </span>
              <span className="font-bold text-[#F4F7FA]">144 (98.0%)</span>
            </div>
            <div className="flex justify-between items-center bg-[#101D2D] p-2 rounded">
              <span className="flex items-center gap-1.5 text-[#F4B740]">
                <span className="w-2 h-2 rounded-full bg-[#F4B740]" />
                Requires Review
              </span>
              <span className="font-bold text-[#F4B740]">2 (1.3%)</span>
            </div>
            <div className="flex justify-between items-center bg-[#101D2D] p-2 rounded">
              <span className="flex items-center gap-1.5 text-[#EF5B5B]">
                <span className="w-2 h-2 rounded-full bg-[#EF5B5B]" />
                Non-Compliant
              </span>
              <span className="font-bold text-[#F4F7FA]">1 (0.7%)</span>
            </div>
          </div>
        </div>

        {/* Fourth Row: Active Laboratory Sessions Cards (8 cols) */}
        <div className="lg:col-span-8 bg-[#0B1726] border border-[#26384D] rounded-xl p-4 shadow-xl flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#26384D]">
            <span className="text-xs font-mono font-bold text-[#F4F7FA]">
              Active Laboratory Sessions
            </span>
            <span className="text-[10px] font-mono text-[#19C7C8]">Bay 4 • Live Telemetry</span>
          </div>

          <div className="bg-[#101D2D] p-4 rounded-xl border border-[#26384D] space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[#F4F7FA]">
                    {DEMO_INSTRUMENTS[0].name}
                  </span>
                  <span className="text-[10px] font-mono text-[#19C7C8] px-2 py-0.5 rounded bg-[#19C7C8]/10 border border-[#19C7C8]/30">
                    {DEMO_INSTRUMENTS[0].id}
                  </span>
                </div>
                <div className="text-xs text-[#9AAABD] font-mono mt-0.5">
                  Test Plan: Initial Verification per OIML R76 (TP-2026-0089)
                </div>
              </div>

              <span className="px-3 py-1 rounded bg-[#19C7C8]/15 text-[#19C7C8] text-xs font-mono font-bold border border-[#19C7C8]/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#19C7C8] animate-ping" />
                MEASURING STEP 4 (100 kg)
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono pt-2 border-t border-[#26384D]">
              <div className="bg-[#07111F] p-2 rounded border border-[#26384D]">
                <span className="text-[#64748B] text-[10px] block">OPERATOR</span>
                <span className="text-[#F4F7FA]">Banu Priya</span>
              </div>
              <div className="bg-[#07111F] p-2 rounded border border-[#26384D]">
                <span className="text-[#64748B] text-[10px] block">ENVIRONMENT</span>
                <span className="text-[#20C997]">20.4°C / 51.2% RH</span>
              </div>
              <div className="bg-[#07111F] p-2 rounded border border-[#26384D]">
                <span className="text-[#64748B] text-[10px] block">WORKING STANDARD</span>
                <span className="text-[#F4F7FA]">STD-WEIGHT-M1-042</span>
              </div>
              <div className="bg-[#07111F] p-2 rounded border border-[#26384D]">
                <span className="text-[#64748B] text-[10px] block">ELAPSED TIME</span>
                <span className="text-[#19C7C8]">00:32:14</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => onNavigate('workbench')}
                className="text-xs font-mono text-[#19C7C8] hover:underline flex items-center gap-1"
              >
                <span>Enter Test Workbench</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* FIFTH & SIXTH ROWS: Recent Measurement Events Timeline & System Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Fifth Row: Recent Measurement Events (7 cols) */}
        <div className="lg:col-span-7 bg-[#0B1726] border border-[#26384D] rounded-xl p-4 shadow-xl space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#26384D]">
            <span className="text-xs font-mono font-bold text-[#F4F7FA]">
              Recent Measurement Events (Audit Stream)
            </span>
            <button
              onClick={() => onNavigate('measurements')}
              className="text-xs font-mono text-[#19C7C8] hover:underline"
            >
              View All Events →
            </button>
          </div>

          <div className="space-y-2">
            {DEMO_MEASUREMENTS.map((mev) => (
              <div
                key={mev.id}
                className="bg-[#101D2D] p-3 rounded-lg border border-[#26384D] flex items-center justify-between gap-3 text-xs font-mono hover:bg-[#142438] transition-colors cursor-pointer"
                onClick={() => onNavigate('workbench')}
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#19C7C8]">{mev.id}</span>
                    <span className="text-[#F4F7FA] font-semibold">{mev.testType}</span>
                  </div>
                  <div className="text-[11px] text-[#9AAABD]">
                    Nominal: {mev.referenceLoad} kg • Indicated: {mev.indicatedValue} kg (Δ: {mev.difference > 0 ? '+' : ''}{mev.difference} kg)
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                    mev.validationState === 'VERIFIED'
                      ? 'bg-[#20C997]/15 text-[#20C997] border-[#20C997]/30'
                      : 'bg-[#F4B740]/15 text-[#F4B740] border-[#F4B740]/30'
                  }`}>
                    {mev.validationState}
                  </span>
                  <div className="text-[10px] text-[#64748B] mt-0.5">{mev.timestamp.split('T')[1].replace('Z', '')}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sixth Row: System Alerts (5 cols) */}
        <div className="lg:col-span-5 bg-[#0B1726] border border-[#26384D] rounded-xl p-4 shadow-xl space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#26384D]">
            <span className="text-xs font-mono font-bold text-[#F4F7FA]">
              Active Metrology System Alerts
            </span>
            <span className="text-[10px] font-mono text-[#EF5B5B]">3 Active</span>
          </div>

          <div className="space-y-2">
            {SYSTEM_ALERTS.map((alert) => (
              <div
                key={alert.id}
                className="bg-[#101D2D] p-3 rounded-lg border border-[#26384D] space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                    alert.severity === 'WARNING'
                      ? 'bg-[#F4B740]/15 text-[#F4B740] border-[#F4B740]/30'
                      : 'bg-[#5B8CFF]/15 text-[#5B8CFF] border-[#5B8CFF]/30'
                  }`}>
                    {alert.severity}
                  </span>
                  <button
                    onClick={() => onNavigate(alert.route)}
                    className="text-[10px] font-mono text-[#19C7C8] hover:underline"
                  >
                    {alert.action} →
                  </button>
                </div>
                <div className="text-xs font-bold text-[#F4F7FA]">{alert.title}</div>
                <p className="text-[11px] text-[#9AAABD] font-mono">{alert.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
