import React, { useState } from 'react';
import { 
  Layers, Scale, Cpu, ShieldCheck, Binary, Hash, FileCheck, 
  UserCheck, RefreshCw, X, ArrowDown, ExternalLink 
} from 'lucide-react';

interface ArchLayer {
  id: string;
  name: string;
  subtitle: string;
  icon: any;
  techStack: string;
  coreResponsibility: string;
  guarantee: string;
}

const ARCH_LAYERS: ArchLayer[] = [
  {
    id: 'l1',
    name: '1. PHYSICAL INSTRUMENT LAYER',
    subtitle: 'Industrial Weighing Apparatus',
    icon: Scale,
    techStack: '4-Point Shear Beam Transducers, Toledo/Sartorius Indicators',
    coreResponsibility: 'Continuous analog-to-digital force measurement, strain bridge voltage conversion.',
    guarantee: 'Real-world physical force conversion adhering to OIML R76 accuracy classes.',
  },
  {
    id: 'l2',
    name: '2. ACQUISITION LAYER (AutoPort)',
    subtitle: 'Physical Telemetry Telecommunications',
    icon: Cpu,
    techStack: 'Direct Kernel UART, RS-232, WebSerial, USB-CDC 9600-8-N-1',
    coreResponsibility: 'Continuous continuous-print ASCII frame ingestion without human intermediary.',
    guarantee: 'Authentic hardware packet stream provenance; direct device signature.',
  },
  {
    id: 'l3',
    name: '3. MEASUREMENT EVENT (MEV)',
    subtitle: 'Immutable Atomic Ledger Record',
    icon: Hash,
    techStack: 'Strict TypeScript Domain Model + WebCrypto SHA-256 Fingerprint',
    coreResponsibility: 'Binds observation value, timestamp, environment context, standard weight ID, and rule version.',
    guarantee: 'Append-only immutability. No retroactive edits permitted without append revision.',
  },
  {
    id: 'l4',
    name: '4. VALIDATION & STABILITY LAYER',
    subtitle: 'Context & Environmental Guardrails',
    icon: ShieldCheck,
    techStack: 'Vaisala Indigo PT100 RTD + Barometric Sensor Context Lock',
    coreResponsibility: 'Enforces OIML R76 Clause A.5.3 temperature & motion stability prerequisites.',
    guarantee: 'Measurements outside the validated ambient stability window are blocked.',
  },
  {
    id: 'l5',
    name: '5. DETERMINISTIC OIML RULE ENGINE',
    subtitle: 'Statutory Tolerance Arithmetic',
    icon: Binary,
    techStack: 'Deterministic Pure TypeScript / High-Precision Numerical Core',
    coreResponsibility: 'Direct evaluation of Table 6 Maximum Permissible Error (MPE) thresholds.',
    guarantee: 'Zero black-box or non-deterministic compliance decisions. 100% reproducible.',
  },
  {
    id: 'l6',
    name: '6. INDEPENDENT DUAL VERIFICATION',
    subtitle: 'Cross-Engine Discrepancy Detection',
    icon: ShieldCheck,
    techStack: 'Engine A (Boundary Evaluation) + Engine B (Scaled Integer Arithmetic)',
    coreResponsibility: 'Detects compiler optimization drifts, IEEE-754 floating-point errors, or logic divergence.',
    guarantee: 'Any calculation discrepancy triggers immediate CALCULATION CONFLICT status.',
  },
  {
    id: 'l7',
    name: '7. CRYPTOGRAPHIC EVIDENCE GRAPH',
    subtitle: 'Directed Acyclic Provenance DAG',
    icon: Layers,
    techStack: 'SVG Topological DAG + JSON-LD Linked Data Graph',
    coreResponsibility: 'Bi-directional traversal from certificate to load-cell serial stream.',
    guarantee: 'Mathematically proves the chain of custody behind every verification decision.',
  },
  {
    id: 'l8',
    name: '8. CONTROLLED HUMAN REVIEW & OVERRIDE',
    subtitle: 'Statutory Metrologist Authority',
    icon: UserCheck,
    techStack: 'RBAC Authorization + Mandatory Cryptographic Justification Ledger',
    coreResponsibility: 'Enables authorized verification officers to adjudicate boundary observations.',
    guarantee: 'Preserves original system decision permanently alongside human override.',
  },
  {
    id: 'l9',
    name: '9. TAMPER-EVIDENT SEALED REPORT',
    subtitle: 'Accredited Verification Certificate',
    icon: FileCheck,
    techStack: 'SHA-256 Digest Seal + Dynamic Public QR Verification Gateway',
    coreResponsibility: 'Issues formal ISO/IEC 17025 compliant digital verification certificate.',
    guarantee: 'Public verification of certificate authenticity and bit-level integrity.',
  },
  {
    id: 'l10',
    name: '10. HISTORICAL & REGULATION REPLAY',
    subtitle: 'Forensic Audit & Prospective Sandbox',
    icon: RefreshCw,
    techStack: 'Time-Series Event Sourcing Engine + Non-Destructive Rule Sandbox',
    coreResponsibility: 'Plays back exact historical test states and assesses future regulatory revisions.',
    guarantee: 'Evaluates candidate standards without ever altering historical legal certificates.',
  },
];

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedLayerId, setSelectedLayerId] = useState<string>('l5');

  if (!isOpen) return null;

  const activeLayer = ARCH_LAYERS.find((l) => l.id === selectedLayerId) || ARCH_LAYERS[4];

  return (
    <div className="fixed inset-0 z-50 bg-[#07111F]/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0B1726] border border-[#26384D] rounded-xl max-w-4xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#26384D]">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#19C7C8]" />
              <h2 className="text-base font-bold text-[#F4F7FA]">
                METRIQOS Architectural Blueprint (Judge Experience)
              </h2>
            </div>
            <p className="text-xs text-[#9AAABD] mt-0.5 font-mono">
              Complete 10-tier deterministic metrology assurance pipeline from physical scale to sealed replay
            </p>
          </div>
          <button onClick={onClose} className="text-[#9AAABD] hover:text-[#F4F7FA] text-xs font-mono">
            ✕ Close
          </button>
        </div>

        {/* 2-Column: Pipeline Stack on Left, Inspector on Right */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 flex-1 overflow-hidden">
          {/* 10-Tier Vertical Stack (6 cols) */}
          <div className="md:col-span-6 space-y-1.5 overflow-y-auto pr-1">
            {ARCH_LAYERS.map((layer) => {
              const isSelected = layer.id === selectedLayerId;
              const Icon = layer.icon;

              return (
                <div
                  key={layer.id}
                  onClick={() => setSelectedLayerId(layer.id)}
                  className={`p-2.5 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-[#142438] border-[#19C7C8] text-[#F4F7FA] shadow-md'
                      : 'bg-[#101D2D]/60 border-[#26384D] text-[#9AAABD] hover:bg-[#101D2D]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-[#19C7C8]' : 'text-[#64748B]'}`} />
                    <div className="truncate">
                      <div className="text-xs font-bold truncate">{layer.name}</div>
                      <div className="text-[10px] text-[#64748B] font-mono truncate">{layer.subtitle}</div>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono text-[#5B8CFF] shrink-0">Inspect →</span>
                </div>
              );
            })}
          </div>

          {/* Deep-Dive Inspector (6 cols) */}
          <div className="md:col-span-6 bg-[#101D2D] p-5 rounded-xl border border-[#26384D] flex flex-col justify-between overflow-y-auto">
            <div className="space-y-3 font-mono text-xs">
              <div className="flex items-center gap-2 pb-2 border-b border-[#26384D]">
                <activeLayer.icon className="w-5 h-5 text-[#19C7C8]" />
                <div>
                  <h3 className="text-sm font-bold text-[#F4F7FA]">{activeLayer.name}</h3>
                  <span className="text-[10px] text-[#5B8CFF]">{activeLayer.subtitle}</span>
                </div>
              </div>

              <div className="bg-[#07111F] p-3 rounded-lg border border-[#26384D] space-y-1">
                <span className="text-[10px] text-[#64748B] uppercase block">Implementation Technology Stack</span>
                <span className="text-[#19C7C8] font-bold block">{activeLayer.techStack}</span>
              </div>

              <div className="bg-[#07111F] p-3 rounded-lg border border-[#26384D] space-y-1">
                <span className="text-[10px] text-[#64748B] uppercase block">Core Metrological Responsibility</span>
                <p className="text-[#F4F7FA] leading-relaxed text-xs">
                  {activeLayer.coreResponsibility}
                </p>
              </div>

              <div className="bg-[#07111F] p-3 rounded-lg border border-[#20C997]/40 space-y-1">
                <span className="text-[10px] text-[#20C997] uppercase block font-bold">Scientific & Legal Metrology Guarantee</span>
                <p className="text-[#20C997] text-xs leading-relaxed">
                  {activeLayer.guarantee}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-[#26384D] text-center text-[10px] text-[#64748B] font-mono">
              Designed for Smart India Hackathon (SIH) High-Integrity Metrology Evaluation
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
