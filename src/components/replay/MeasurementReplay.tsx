import React, { useState, useEffect } from 'react';
import { 
  Play, Pause, SkipBack, SkipForward, RotateCcw, Clock, ShieldCheck, 
  Cpu, Scale, Thermometer, Binary, FileCheck, Hash, UserCheck, CheckCircle2 
} from 'lucide-react';
import { MeasurementEvent } from '../../types/metrology';
import { DEMO_MEASUREMENTS } from '../../data/initialData';

interface ReplayStep {
  id: string;
  stepIndex: number;
  timestamp: string;
  title: string;
  category: string;
  icon: any;
  summary: string;
  telemetry: Record<string, string>;
  evidenceRef?: string;
}

const REPLAY_STEPS: ReplayStep[] = [
  {
    id: 'rep-01',
    stepIndex: 1,
    timestamp: '09:15:00.000',
    title: 'TEST PROCEDURE INITIATED',
    category: 'SESSION_INIT',
    icon: Clock,
    summary: 'Test plan TP-2026-0089 spawned under OIML R76-1:2006 Standard Routine.',
    telemetry: {
      'Operator': 'Banu Priya (Lead Verification Officer)',
      'Laboratory': 'National Metrology Lab — Division 4',
      'Software Core': 'METRIQOS-v2.8.4',
    },
  },
  {
    id: 'rep-02',
    stepIndex: 2,
    timestamp: '09:22:14.210',
    title: 'INSTRUMENT IDENTITY LOCKED',
    category: 'INSTRUMENT_CONFIG',
    icon: Scale,
    summary: 'Sartorius Combics 3 (SN-78492019-DE) metrological parameters confirmed & locked.',
    telemetry: {
      'Instrument ID': 'NAWI-2026-00142',
      'Accuracy Class': 'CLASS_III (Medium Accuracy)',
      'Max / Min': '150 kg / 1 kg',
      'e / d': '0.05 kg / 0.01 kg',
      'Configuration Hash': '9e7b21a88df54817a2cd3c990b7e41c4...',
    },
    evidenceRef: 'EVD-2026-00920 (Nameplate OCR Confirmed)',
  },
  {
    id: 'rep-03',
    stepIndex: 3,
    timestamp: '09:28:40.115',
    title: 'REFERENCE EQUIPMENT VERIFIED',
    category: 'STANDARD_WEIGHTS',
    icon: ShieldCheck,
    summary: 'NPL Traceable M1 Weight Standard Set STD-WEIGHT-M1-042 confirmed active.',
    telemetry: {
      'Standard ID': 'STD-WEIGHT-M1-042',
      'Certificate No': 'NPL/LM/2025/W-8921',
      'Expiry Date': '2026-12-10 (VALID)',
      'Uncertainty': '±0.25g @ 20kg (k=2)',
    },
    evidenceRef: 'EVD-2026-00919 (NPL Certificate PDF)',
  },
  {
    id: 'rep-04',
    stepIndex: 4,
    timestamp: '09:40:02.890',
    title: 'ENVIRONMENT CONTEXT SEALED',
    category: 'AMBIENT_LOCK',
    icon: Thermometer,
    summary: 'Ambient climate logged: 20.4°C, 51.2% RH. Within OIML nominal stability envelope.',
    telemetry: {
      'Context ID': 'ENV-2026-0928-01',
      'Temperature': '20.4 °C (Permissible: 20 ± 2°C)',
      'Relative Humidity': '51.2 % (Permissible: 45 - 65%)',
      'Mains Voltage': '230.1 V (Clean Sine)',
    },
  },
  {
    id: 'rep-05',
    stepIndex: 5,
    timestamp: '09:42:11.042',
    title: 'AUTOPORT TELEMETRY ACQUIRED',
    category: 'DATA_ACQUISITION',
    icon: Cpu,
    summary: 'Direct RS-232 telemetry packet captured from Sartorius indicator terminal.',
    telemetry: {
      'Raw Frame': 'ST,GS,+000100.012,kg\\r\\n',
      'Baud Rate': '9600-8-N-1 Continuous Stream',
      'Indicated Value': '100.012 kg',
      'Motion Detector': 'STABLE (0.000 kg/s)',
    },
    evidenceRef: 'EVD-2026-00921 (UART Dump)',
  },
  {
    id: 'rep-06',
    stepIndex: 6,
    timestamp: '09:42:11.085',
    title: 'DETERMINISTIC VALIDATION',
    category: 'RULE_EVALUATION',
    icon: Binary,
    summary: 'Observed deviation +0.012 kg evaluated against OIML R76 Table 6 MPE ±0.050 kg.',
    telemetry: {
      'Rule Package': 'RULE-PACK-R76-2006-V3',
      'OIML Clause': 'Clause 3.5.1 Table 6 (2000e)',
      'Calculated MPE': '±0.050 kg',
      'Observed Error': '+0.012 kg (PASS)',
    },
  },
  {
    id: 'rep-07',
    stepIndex: 7,
    timestamp: '09:42:11.092',
    title: 'INDEPENDENT DUAL ENGINE VERIFICATION',
    category: 'ENGINE_CONVERGENCE',
    icon: ShieldCheck,
    summary: 'Engine B (scaled integer arithmetic) verified identical compliance without floating drift.',
    telemetry: {
      'Engine A Status': 'VERIFIED',
      'Engine B Status': 'VERIFIED',
      'Numerical Convergence': '100% MATCH (|Δ| = 0.000000)',
    },
  },
  {
    id: 'rep-08',
    stepIndex: 8,
    timestamp: '09:42:12.000',
    title: 'PROOF OBJECT SEALED & HASHED',
    category: 'CRYPTOGRAPHIC_SEAL',
    icon: Hash,
    summary: 'SHA-256 fingerprint generated over raw values, standards, and rule version.',
    telemetry: {
      'Event ID': 'MEV-000481',
      'SHA-256 Hash': '8b7d91e604f27ca34b899120de84021948ba9e120894acdf1092837461520abc',
      'Ledger Index': '#884102',
    },
  },
  {
    id: 'rep-09',
    stepIndex: 9,
    timestamp: '09:50:30.000',
    title: 'HUMAN REVIEW SIGN-OFF',
    category: 'REVIEWER_AUTHORITY',
    icon: UserCheck,
    summary: 'Chief Metrologist Dr. Arthur Vance reviewed provenance and confirmed verification.',
    telemetry: {
      'Reviewer': 'Dr. Arthur Vance (Chief Metrologist)',
      'Review Decision': 'APPROVED AS RECORDED',
      'Audit Note': 'Traceability chain intact; all evidence verified.',
    },
  },
  {
    id: 'rep-10',
    stepIndex: 10,
    timestamp: '10:00:00.000',
    title: 'TAMPER-EVIDENT REPORT SEALED',
    category: 'CERTIFICATE_SEALED',
    icon: FileCheck,
    summary: 'Legal verification certificate REP-R76-2026-00412 published with QR traceability.',
    telemetry: {
      'Report ID': 'REP-R76-2026-00412',
      'Document Hash': 'd94a8f902b1c834719280ef1102938475bcae8840219582d90ef019283471029',
      'QR Verification URL': 'http://localhost:5173/verify/REP-R76-2026-00412',
    },
  },
];

export const MeasurementReplay: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(4); // Default at AutoPort telemetry
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);

  // Playback timer
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev >= REPLAY_STEPS.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 1800 / playbackSpeed);

    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed]);

  const activeStep = REPLAY_STEPS[currentStepIndex];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#26384D] gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#19C7C8]" />
            <h2 className="text-base font-bold text-[#F4F7FA]">
              Engineering Measurement Event Replay
            </h2>
          </div>
          <p className="text-xs text-[#9AAABD] mt-0.5">
            Step-by-step forensic recreation of data acquisition, environment lock, and rule evaluation for MEV-000481.
          </p>
        </div>

        {/* Playback Controls Strip */}
        <div className="flex items-center gap-1.5 bg-[#0B1726] p-1.5 rounded-xl border border-[#26384D] shadow-md">
          <button
            onClick={() => {
              setIsPlaying(false);
              setCurrentStepIndex(0);
            }}
            className="p-1.5 rounded-lg text-[#9AAABD] hover:text-[#F4F7FA] hover:bg-[#142438] transition-colors"
            title="Reset to beginning"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setIsPlaying(false);
              setCurrentStepIndex((prev) => Math.max(0, prev - 1));
            }}
            className="p-1.5 rounded-lg text-[#9AAABD] hover:text-[#F4F7FA] hover:bg-[#142438] transition-colors"
            title="Step backward"
          >
            <SkipBack className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-3 py-1.5 rounded-lg bg-[#19C7C8] text-[#07111F] font-bold text-xs flex items-center gap-1 hover:bg-[#19C7C8]/90 transition-colors"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isPlaying ? 'Pause' : 'Play Replay'}
          </button>
          <button
            onClick={() => {
              setIsPlaying(false);
              setCurrentStepIndex((prev) => Math.min(REPLAY_STEPS.length - 1, prev + 1));
            }}
            className="p-1.5 rounded-lg text-[#9AAABD] hover:text-[#F4F7FA] hover:bg-[#142438] transition-colors"
            title="Step forward"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-[#26384D] mx-1" />

          <button
            onClick={() => setPlaybackSpeed((s) => (s === 1 ? 2 : s === 2 ? 0.5 : 1))}
            className="text-[10px] font-mono px-2 py-1 rounded bg-[#101D2D] text-[#19C7C8] border border-[#26384D]"
          >
            {playbackSpeed}x Speed
          </button>
        </div>
      </div>

      {/* Replay Scrubbing Timeline Bar */}
      <div className="bg-[#0B1726] border border-[#26384D] rounded-xl p-4 shadow-xl">
        <div className="flex items-center justify-between text-xs font-mono text-[#9AAABD] mb-2">
          <span>T0: 09:15:00</span>
          <span className="text-[#19C7C8] font-bold">
            Step {currentStepIndex + 1} of {REPLAY_STEPS.length} • {activeStep.timestamp}
          </span>
          <span>T_FINAL: 10:00:00</span>
        </div>

        {/* Progress Bar with clickable tick points */}
        <div className="relative w-full h-3 bg-[#101D2D] rounded-full overflow-hidden border border-[#26384D] flex items-center">
          <div
            className="h-full bg-gradient-to-r from-[#5B8CFF] to-[#19C7C8] transition-all duration-300"
            style={{ width: `${((currentStepIndex + 1) / REPLAY_STEPS.length) * 100}%` }}
          />
        </div>

        {/* Step dots */}
        <div className="flex justify-between mt-2">
          {REPLAY_STEPS.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => {
                setIsPlaying(false);
                setCurrentStepIndex(idx);
              }}
              className={`text-[9px] font-mono transition-colors ${
                idx === currentStepIndex
                  ? 'text-[#19C7C8] font-bold underline'
                  : idx < currentStepIndex
                  ? 'text-[#20C997]'
                  : 'text-[#64748B]'
              }`}
            >
              0{idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Main Forensic Step Inspection Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Step Details (8 cols) */}
        <div className="lg:col-span-8 bg-[#0B1726] border border-[#26384D] rounded-xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#26384D]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#142438] border border-[#19C7C8]/40 flex items-center justify-center">
                <activeStep.icon className="w-5 h-5 text-[#19C7C8]" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#5B8CFF] uppercase tracking-wider block">
                  {activeStep.category}
                </span>
                <h3 className="text-base font-bold text-[#F4F7FA]">
                  {activeStep.title}
                </h3>
              </div>
            </div>

            <div className="text-right font-mono">
              <span className="text-[10px] text-[#64748B] block">METROLOGICAL TIMESTAMP</span>
              <span className="text-sm font-bold text-[#19C7C8]">{activeStep.timestamp}</span>
            </div>
          </div>

          <p className="text-sm text-[#9AAABD] leading-relaxed">
            {activeStep.summary}
          </p>

          {/* Telemetry Key-Value Matrix */}
          <div className="bg-[#101D2D] rounded-xl p-3.5 border border-[#26384D] space-y-2">
            <span className="text-[10px] font-mono text-[#64748B] uppercase tracking-wider block">
              Forensic Snapshot Telemetry
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono">
              {Object.entries(activeStep.telemetry).map(([k, v]) => (
                <div key={k} className="bg-[#07111F] p-2 rounded border border-[#26384D]">
                  <span className="text-[#64748B] text-[10px] block uppercase">{k}</span>
                  <span className="text-[#F4F7FA] font-medium mt-0.5 block break-all">{v}</span>
                </div>
              ))}
            </div>
          </div>

          {activeStep.evidenceRef && (
            <div className="flex items-center justify-between bg-[#142438] p-3 rounded-lg border border-[#20C997]/40 text-xs font-mono">
              <div className="flex items-center gap-2 text-[#20C997]">
                <CheckCircle2 className="w-4 h-4" />
                <span>Linked Evidence Artifact: {activeStep.evidenceRef}</span>
              </div>
              <span className="text-[10px] text-[#9AAABD]">Cryptographically bound</span>
            </div>
          )}
        </div>

        {/* Step Sequence List (4 cols) */}
        <div className="lg:col-span-4 bg-[#0B1726] border border-[#26384D] rounded-xl p-3.5 shadow-xl space-y-2 max-h-[460px] overflow-y-auto">
          <span className="text-xs font-mono font-bold text-[#19C7C8] uppercase tracking-wider block pb-1 border-b border-[#26384D]">
            Event Execution Sequence
          </span>

          <div className="space-y-1">
            {REPLAY_STEPS.map((s, idx) => {
              const isSelected = idx === currentStepIndex;
              const isCompleted = idx < currentStepIndex;

              return (
                <div
                  key={s.id}
                  onClick={() => {
                    setIsPlaying(false);
                    setCurrentStepIndex(idx);
                  }}
                  className={`cursor-pointer p-2 rounded-lg border transition-all flex items-center justify-between text-xs ${
                    isSelected
                      ? 'bg-[#142438] border-[#19C7C8] text-[#F4F7FA]'
                      : isCompleted
                      ? 'bg-[#101D2D]/60 border-[#26384D] text-[#9AAABD]'
                      : 'bg-[#07111F] border-transparent text-[#64748B]'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-[10px] font-mono text-[#64748B]">0{idx + 1}</span>
                    <span className="truncate font-semibold">{s.title}</span>
                  </div>
                  <span className="text-[10px] font-mono shrink-0 ml-1 text-[#64748B]">
                    {s.timestamp.split('.')[0]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
