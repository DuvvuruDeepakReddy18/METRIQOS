import React, { useState } from 'react';
import { 
  FileCheck, ShieldCheck, Scale, Cpu, Binary, Layers, 
  Thermometer, UserCheck, Eye, Hash, ExternalLink, Info, CheckCircle2, AlertTriangle 
} from 'lucide-react';

interface GraphNode {
  id: string;
  type: 'REPORT' | 'TEST' | 'CALCULATION' | 'MEASUREMENT' | 'EVIDENCE' | 'RULE' | 'EQUIPMENT' | 'ENVIRONMENT' | 'REVIEWER' | 'INSTRUMENT';
  label: string;
  sublabel: string;
  x: number;
  y: number;
  status: 'VERIFIED' | 'ACTIVE' | 'LOCKED' | 'REVIEW_REQUIRED';
  data: Record<string, string>;
}

interface GraphEdge {
  from: string;
  to: string;
  label?: string;
}

const INITIAL_NODES: GraphNode[] = [
  {
    id: 'node-report',
    type: 'REPORT',
    label: 'Sealed Report REP-R76-2026-00412',
    sublabel: 'Cryptographic Certificate of Verification',
    x: 480,
    y: 50,
    status: 'VERIFIED',
    data: {
      'Report ID': 'REP-R76-2026-00412',
      'Authority': 'National Metrology Laboratory',
      'Signer': 'Dr. Arthur Vance (Chief Metrologist)',
      'Document SHA-256': 'd94a8f902b1c834719280ef1102938475bcae8840219582d90ef019283471029',
      'Accreditation': 'ISO/IEC 17025:2017 & Legal Metrology Act',
    },
  },
  {
    id: 'node-reviewer',
    type: 'REVIEWER',
    label: 'Authorized Reviewer Sign-off',
    sublabel: 'Dr. Arthur Vance (Chief Metrologist)',
    x: 750,
    y: 80,
    status: 'VERIFIED',
    data: {
      'Officer': 'Dr. Arthur Vance',
      'Credential': 'LEGAL-MET-SIGNER-01',
      'Decision': 'SEALED & APPROVED',
      'Audit Timestamp': '2026-09-28T10:00:00Z',
    },
  },
  {
    id: 'node-test',
    type: 'TEST',
    label: 'Test Plan TP-2026-0089',
    sublabel: 'OIML R76 Weighing Performance Routine',
    x: 480,
    y: 160,
    status: 'VERIFIED',
    data: {
      'Test Plan ID': 'TP-2026-0089',
      'Standard': 'OIML R76-1:2006 Clause A.4.4.1',
      'Verification Officer': 'Banu Priya (Lead Verification Officer)',
      'Total Load Steps': '5 Completed Ascending & Descending',
    },
  },
  {
    id: 'node-calc',
    type: 'CALCULATION',
    label: 'Dual Engine Metrological Calculation',
    sublabel: 'Engine A (Boundary) & Engine B (Integer SIMD)',
    x: 480,
    y: 270,
    status: 'VERIFIED',
    data: {
      'Formula': '|Indicated - Load| ≤ MPE(m, Class III, e=0.05kg)',
      'Engine A Result': 'VERIFIED (+0.012 kg ≤ ±0.050 kg)',
      'Engine B Result': 'VERIFIED (Scaled Integer Arithmetic)',
      'Convergence': 'PERFECT NUMERICAL CONVERGENCE',
    },
  },
  {
    id: 'node-rule',
    type: 'RULE',
    label: 'OIML R76-1:2006 (v3.2.0)',
    sublabel: 'Statutory Table 6 MPE Rule Package',
    x: 820,
    y: 270,
    status: 'ACTIVE',
    data: {
      'Rule Package': 'RULE-PACK-R76-2006-V3',
      'Version': 'v3.2.0',
      'Clause': 'OIML R76-1 Clause 3.5.1 Table 6',
      'Strictness Multiplier': '1.0 (Standard Initial Verification)',
    },
  },
  {
    id: 'node-mev',
    type: 'MEASUREMENT',
    label: 'Measurement Event MEV-000481',
    sublabel: '100.012 kg Indicated @ 100.000 kg Nominal',
    x: 480,
    y: 390,
    status: 'VERIFIED',
    data: {
      'Event ID': 'MEV-000481',
      'Load Standard': '100.000 kg',
      'Indicated Value': '100.012 kg',
      'Observed Deviation': '+0.012 kg',
      'Integrity Hash': '8b7d91e604f27ca34b899120de84021948ba9e120894acdf1092837461520abc',
      'Acquisition Source': 'AutoPort Continuous RS-232 Stream',
    },
  },
  {
    id: 'node-equipment',
    type: 'EQUIPMENT',
    label: 'Reference Weights STD-WEIGHT-M1-042',
    sublabel: 'Class M1 Standard 500kg Series (NPL Cert W-8921)',
    x: 140,
    y: 360,
    status: 'VERIFIED',
    data: {
      'Standard ID': 'STD-WEIGHT-M1-042',
      'Accuracy Class': 'OIML Class M1',
      'Certifying Body': 'National Physical Laboratory (NPL)',
      'Validity Expiry': '2026-12-10 (ACTIVE)',
      'Uncertainty': '± 0.25 g at 20 kg',
    },
  },
  {
    id: 'node-env',
    type: 'ENVIRONMENT',
    label: 'Environment Context ENV-2026-0928-01',
    sublabel: '20.4°C • 51.2% RH • 1013.2 hPa (LOCKED)',
    x: 140,
    y: 470,
    status: 'LOCKED',
    data: {
      'Context ID': 'ENV-2026-0928-01',
      'Ambient Temperature': '20.4 °C (Permissible: 20 ± 2°C)',
      'Relative Humidity': '51.2 % (Permissible: 45 - 65%)',
      'Barometric Pressure': '1013.25 hPa',
      'Sensor Probe': 'Vaisala Indigo520 PT100',
    },
  },
  {
    id: 'node-evidence-img',
    type: 'EVIDENCE',
    label: 'Evidence Passport: EVD-2026-00918',
    sublabel: 'Optical Terminal Screen Capture @ 100.012 kg',
    x: 820,
    y: 390,
    status: 'VERIFIED',
    data: {
      'Evidence ID': 'EVD-2026-00918',
      'Type': 'Optical Indicator Snapshot',
      'Source': 'Inspection Rig Camera Lens 2',
      'SHA-256 Hash': '7c89f02a34b9d10e82c7a5f6e1b3d4a89c72e104f58a91bc...',
      'Timestamp': '2026-09-28T09:42:10Z',
    },
  },
  {
    id: 'node-evidence-serial',
    type: 'EVIDENCE',
    label: 'Evidence Dump: EVD-2026-00921',
    sublabel: 'Continuous 120-Frame RS-232 UART Capture',
    x: 820,
    y: 490,
    status: 'VERIFIED',
    data: {
      'Evidence ID': 'EVD-2026-00921',
      'Type': 'Raw Serial Stream Telemetry Dump',
      'Port': '/dev/ttyUSB0 (COM3 FTDI)',
      'SHA-256 Hash': '89a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2...',
    },
  },
  {
    id: 'node-instrument',
    type: 'INSTRUMENT',
    label: 'Instrument NAWI-2026-00142',
    sublabel: 'Sartorius Combics 3 Industrial Platform Scale',
    x: 480,
    y: 520,
    status: 'VERIFIED',
    data: {
      'Instrument ID': 'NAWI-2026-00142',
      'Manufacturer': 'Sartorius AG',
      'Accuracy Class': 'Class III Medium Accuracy',
      'Max / Min': '150 kg / 1 kg',
      'Interval e / d': '0.05 kg / 0.01 kg',
      'Serial Number': 'SN-78492019-DE',
      'Digital Twin': 'Active Synchronized Instance',
    },
  },
];

const EDGES: GraphEdge[] = [
  { from: 'node-report', to: 'node-reviewer', label: 'Authorized by' },
  { from: 'node-report', to: 'node-test', label: 'Synthesizes' },
  { from: 'node-test', to: 'node-calc', label: 'Evaluates' },
  { from: 'node-calc', to: 'node-rule', label: 'Rule parameters' },
  { from: 'node-calc', to: 'node-mev', label: 'Validates' },
  { from: 'node-mev', to: 'node-equipment', label: 'Reference load' },
  { from: 'node-mev', to: 'node-env', label: 'Ambient context' },
  { from: 'node-mev', to: 'node-evidence-img', label: 'Attached proof' },
  { from: 'node-mev', to: 'node-evidence-serial', label: 'Raw UART dump' },
  { from: 'node-mev', to: 'node-instrument', label: 'Acquired from' },
];

export const EvidenceGraph: React.FC = () => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('node-mev');
  const [zoomLevel, setZoomLevel] = useState(1.0);

  const selectedNode = INITIAL_NODES.find((n) => n.id === selectedNodeId) || INITIAL_NODES[5];

  const getNodeColor = (type: GraphNode['type']) => {
    switch (type) {
      case 'REPORT': return { border: '#20C997', bg: '#0b2e25', text: '#20C997', icon: FileCheck };
      case 'TEST': return { border: '#19C7C8', bg: '#08262a', text: '#19C7C8', icon: Layers };
      case 'CALCULATION': return { border: '#5B8CFF', bg: '#0f1f3d', text: '#5B8CFF', icon: Binary };
      case 'MEASUREMENT': return { border: '#19C7C8', bg: '#102d33', text: '#19C7C8', icon: Cpu };
      case 'RULE': return { border: '#F4B740', bg: '#2b210a', text: '#F4B740', icon: ShieldCheck };
      case 'EQUIPMENT': return { border: '#20C997', bg: '#0e261f', text: '#20C997', icon: Scale };
      case 'ENVIRONMENT': return { border: '#5B8CFF', bg: '#0f1f3d', text: '#5B8CFF', icon: Thermometer };
      case 'EVIDENCE': return { border: '#19C7C8', bg: '#09272d', text: '#19C7C8', icon: Hash };
      case 'REVIEWER': return { border: '#20C997', bg: '#0c281e', text: '#20C997', icon: UserCheck };
      case 'INSTRUMENT': return { border: '#5B8CFF', bg: '#101d2d', text: '#5B8CFF', icon: Scale };
      default: return { border: '#26384D', bg: '#101D2D', text: '#F4F7FA', icon: Info };
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#26384D] gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#19C7C8]" />
            <h2 className="text-base font-bold text-[#F4F7FA]">
              Interactive Metrology Evidence & Provenance Graph
            </h2>
          </div>
          <p className="text-xs text-[#9AAABD] mt-0.5">
            Full cryptographic DAG linking physical scale telemetry, reference standards, deterministic rules, calculations, and signed reports.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono">
          <span className="flex items-center gap-1 text-[#20C997] bg-[#20C997]/10 px-2 py-0.5 rounded border border-[#20C997]/20">
            ● Report / Standard
          </span>
          <span className="flex items-center gap-1 text-[#19C7C8] bg-[#19C7C8]/10 px-2 py-0.5 rounded border border-[#19C7C8]/20">
            ● Measurement / Evidence
          </span>
          <span className="flex items-center gap-1 text-[#5B8CFF] bg-[#5B8CFF]/10 px-2 py-0.5 rounded border border-[#5B8CFF]/20">
            ● Calculation / Telemetry
          </span>
          <span className="flex items-center gap-1 text-[#F4B740] bg-[#F4B740]/10 px-2 py-0.5 rounded border border-[#F4B740]/20">
            ● OIML Rule
          </span>
        </div>
      </div>

      {/* Main Canvas + Inspector Drawer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* SVG Interactive Canvas */}
        <div className="lg:col-span-8 bg-[#07111F] rounded-xl border border-[#26384D] p-2 relative overflow-hidden shadow-2xl min-h-[580px] flex items-center justify-center">
          <div className="absolute inset-0 bg-grid-pattern opacity-15 pointer-events-none" />

          {/* Canvas Controls Overlay */}
          <div className="absolute top-3 left-3 z-10 flex items-center gap-2 bg-[#0B1726]/90 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-[#26384D] text-xs font-mono text-[#9AAABD]">
            <span>Click any node to inspect cryptographic lineage</span>
          </div>

          <svg
            className="w-full h-[560px]"
            viewBox="0 0 1020 600"
            style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center' }}
          >
            <defs>
              <marker
                id="arrowhead"
                markerWidth="8"
                markerHeight="6"
                refX="7"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 8 3, 0 6" fill="#26384D" />
              </marker>
              <marker
                id="arrowhead-active"
                markerWidth="8"
                markerHeight="6"
                refX="7"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 8 3, 0 6" fill="#19C7C8" />
              </marker>
            </defs>

            {/* Directed Edges */}
            {EDGES.map((edge) => {
              const sourceNode = INITIAL_NODES.find((n) => n.id === edge.from);
              const targetNode = INITIAL_NODES.find((n) => n.id === edge.to);
              if (!sourceNode || !targetNode) return null;

              const isEdgeHighlighted =
                selectedNodeId === edge.from || selectedNodeId === edge.to;

              // Cubic bezier connector path
              const dx = targetNode.x - sourceNode.x;
              const dy = targetNode.y - sourceNode.y;
              const pathD = `M ${sourceNode.x} ${sourceNode.y} C ${sourceNode.x} ${sourceNode.y + dy * 0.5}, ${targetNode.x} ${sourceNode.y + dy * 0.5}, ${targetNode.x} ${targetNode.y}`;

              return (
                <g key={`${edge.from}->${edge.to}`}>
                  <path
                    d={pathD}
                    fill="none"
                    stroke={isEdgeHighlighted ? '#19C7C8' : '#26384D'}
                    strokeWidth={isEdgeHighlighted ? 2.5 : 1.5}
                    strokeDasharray={isEdgeHighlighted ? '6 3' : undefined}
                    markerEnd={isEdgeHighlighted ? 'url(#arrowhead-active)' : 'url(#arrowhead)'}
                    className="transition-all duration-300"
                  />
                  {edge.label && (
                    <text
                      x={(sourceNode.x + targetNode.x) / 2}
                      y={(sourceNode.y + targetNode.y) / 2 - 4}
                      fill={isEdgeHighlighted ? '#19C7C8' : '#64748B'}
                      fontSize="9"
                      fontFamily="monospace"
                      textAnchor="middle"
                      className="select-none"
                    >
                      {edge.label}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Nodes */}
            {INITIAL_NODES.map((node) => {
              const style = getNodeColor(node.type);
              const isSelected = selectedNodeId === node.id;
              const Icon = style.icon;

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  onClick={() => setSelectedNodeId(node.id)}
                  className="cursor-pointer group"
                >
                  {/* Outer selection ring */}
                  {isSelected && (
                    <circle
                      cx="0"
                      cy="0"
                      r="30"
                      fill="none"
                      stroke="#19C7C8"
                      strokeWidth="2"
                      strokeDasharray="4 2"
                      className="animate-spin"
                      style={{ animationDuration: '8s' }}
                    />
                  )}

                  {/* Node Base Circle */}
                  <circle
                    cx="0"
                    cy="0"
                    r="22"
                    fill={style.bg}
                    stroke={isSelected ? '#19C7C8' : style.border}
                    strokeWidth={isSelected ? 2.5 : 1.5}
                    className="transition-all duration-200 group-hover:scale-110"
                  />

                  {/* Node Type Monogram */}
                  <text
                    x="0"
                    y="4"
                    fill={style.text}
                    fontSize="11"
                    fontFamily="monospace"
                    fontWeight="bold"
                    textAnchor="middle"
                    className="select-none pointer-events-none"
                  >
                    {node.type.slice(0, 3)}
                  </text>

                  {/* Node Text Label pill below */}
                  <g transform="translate(0, 34)">
                    <rect
                      x="-85"
                      y="-10"
                      width="170"
                      height="20"
                      rx="4"
                      fill="#0B1726"
                      stroke={isSelected ? '#19C7C8' : '#26384D'}
                      strokeWidth="1"
                    />
                    <text
                      x="0"
                      y="4"
                      fill="#F4F7FA"
                      fontSize="9.5"
                      fontFamily="sans-serif"
                      fontWeight="600"
                      textAnchor="middle"
                      className="select-none pointer-events-none"
                    >
                      {node.label.length > 24 ? node.label.slice(0, 24) + '...' : node.label}
                    </text>
                  </g>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Right Drawer: Node Forensic Inspector */}
        <div className="lg:col-span-4 bg-[#0B1726] rounded-xl border border-[#26384D] p-4 flex flex-col justify-between shadow-2xl">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#26384D]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#19C7C8]" />
                <span className="text-xs font-mono font-bold text-[#19C7C8] uppercase tracking-wide">
                  Node Inspector
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#20C997]/10 text-[#20C997] border border-[#20C997]/30">
                {selectedNode.status}
              </span>
            </div>

            <div className="mt-3">
              <span className="text-[10px] font-mono text-[#5B8CFF] uppercase tracking-wider">
                {selectedNode.type} OBJECT
              </span>
              <h3 className="text-base font-bold text-[#F4F7FA] mt-0.5">
                {selectedNode.label}
              </h3>
              <p className="text-xs text-[#9AAABD] mt-1">
                {selectedNode.sublabel}
              </p>
            </div>

            {/* Cryptographic Key-Value Attributes */}
            <div className="mt-4 space-y-2">
              <span className="text-[10px] font-mono text-[#64748B] uppercase tracking-wider block">
                Immutable Object Parameters
              </span>
              {Object.entries(selectedNode.data).map(([key, val]) => (
                <div key={key} className="bg-[#101D2D] p-2.5 rounded-lg border border-[#26384D]">
                  <div className="text-[10px] font-mono text-[#64748B] uppercase">
                    {key}
                  </div>
                  <div className="text-xs font-mono font-medium text-[#F4F7FA] mt-0.5 break-all">
                    {val}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions at bottom of Inspector */}
          <div className="mt-4 pt-3 border-t border-[#26384D] space-y-2">
            <div className="text-[11px] font-mono text-[#20C997] flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Cryptographic hash validated against ledger</span>
            </div>
            <button
              onClick={() => alert(`Verified Immutable Ledger Reference for ${selectedNode.id}`)}
              className="w-full py-2 px-3 rounded-lg bg-[#142438] hover:bg-[#101D2D] text-[#19C7C8] text-xs font-mono font-medium border border-[#26384D] transition-colors flex items-center justify-center gap-2"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              View Ledger Raw JSON-LD Proof
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
