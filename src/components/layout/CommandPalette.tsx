import React, { useState, useEffect } from 'react';
import { Search, Scale, FileText, Hash, Binary, ShieldCheck, AlertTriangle, Cpu, X, ArrowRight } from 'lucide-react';
import { NavigationRoute } from './Sidebar';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (route: NavigationRoute) => void;
}

interface SearchItem {
  id: string;
  type: 'INSTRUMENT' | 'TEST' | 'MEASUREMENT' | 'EVIDENCE' | 'REPORT' | 'RULE' | 'EQUIPMENT' | 'INCIDENT';
  title: string;
  subtitle: string;
  route: NavigationRoute;
}

const SEARCHABLE_ITEMS: SearchItem[] = [
  { id: 'NAWI-2026-00142', type: 'INSTRUMENT', title: 'NAWI-2026-00142', subtitle: 'Sartorius Combics 3 Industrial Platform Scale (Class III)', route: 'instruments' },
  { id: 'NAWI-2026-00215', type: 'INSTRUMENT', title: 'NAWI-2026-00215', subtitle: 'Mettler Toledo PBK989-CC300 Bench Scale (Class II)', route: 'instruments' },
  { id: 'TP-2026-0089', type: 'TEST', title: 'TP-2026-0089', subtitle: 'Initial Verification per OIML R76-1:2006 (Standard Routine)', route: 'workbench' },
  { id: 'MEV-000481', type: 'MEASUREMENT', title: 'MEV-000481', subtitle: '100.012 kg Indicated @ 100 kg Nominal (VERIFIED)', route: 'measurements' },
  { id: 'MEV-000482', type: 'MEASUREMENT', title: 'MEV-000482', subtitle: '150.024 kg Indicated @ 150 kg Nominal (VERIFIED)', route: 'measurements' },
  { id: 'MEV-000484', type: 'MEASUREMENT', title: 'MEV-000484', subtitle: 'Eccentricity Corner 4 Reading (REVIEW REQUIRED)', route: 'measurements' },
  { id: 'EVD-2026-00918', type: 'EVIDENCE', title: 'EVD-2026-00918', subtitle: 'Optical Indicator Screen Snapshot @ 100.012 kg', route: 'evidence-graph' },
  { id: 'REP-R76-2026-00412', type: 'REPORT', title: 'REP-R76-2026-00412', subtitle: 'Sealed Certificate of Verification (Dr. Arthur Vance)', route: 'reports' },
  { id: 'RULE-PACK-R76-2006-V3', type: 'RULE', title: 'RULE-PACK-R76-2006-V3', subtitle: 'Statutory OIML R76 Table 6 MPE Rule Engine (Active)', route: 'rules' },
  { id: 'STD-WEIGHT-M1-042', type: 'EQUIPMENT', title: 'STD-WEIGHT-M1-042', subtitle: 'OIML Class M1 500kg Standard Weights (Cert NPL W-8921)', route: 'reference-equipment' },
  { id: 'INC-2026-042', type: 'INCIDENT', title: 'INC-2026-042', subtitle: 'Near MPE Limit Observation on Eccentricity Quadrant 4', route: 'incidents' },
];

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const results = SEARCHABLE_ITEMS.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
    item.type.toLowerCase().includes(query.toLowerCase())
  );

  const getItemIcon = (type: SearchItem['type']) => {
    switch (type) {
      case 'INSTRUMENT': return Scale;
      case 'TEST': return Cpu;
      case 'MEASUREMENT': return Hash;
      case 'EVIDENCE': return FileText;
      case 'REPORT': return FileText;
      case 'RULE': return Binary;
      case 'EQUIPMENT': return ShieldCheck;
      case 'INCIDENT': return AlertTriangle;
      default: return Search;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#07111F]/80 backdrop-blur-md flex items-start justify-center pt-20 p-4">
      <div className="bg-[#0B1726] border border-[#26384D] rounded-xl max-w-xl w-full shadow-2xl overflow-hidden font-mono text-xs">
        {/* Input bar */}
        <div className="p-3 border-b border-[#26384D] flex items-center gap-2">
          <Search className="w-4 h-4 text-[#19C7C8]" />
          <input
            type="text"
            autoFocus
            placeholder="Search instruments, tests, MEVs, evidence, rules, standards, incidents..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-[#F4F7FA] focus:outline-none placeholder:text-[#64748B]"
          />
          <button onClick={onClose} className="text-[#64748B] hover:text-[#F4F7FA]">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto divide-y divide-[#26384D]">
          {results.length > 0 ? (
            results.map((item) => {
              const Icon = getItemIcon(item.type);

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.route);
                    onClose();
                  }}
                  className="p-3 hover:bg-[#142438] cursor-pointer transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded bg-[#101D2D] border border-[#26384D] flex items-center justify-center shrink-0">
                      <Icon className="w-3.5 h-3.5 text-[#19C7C8]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#F4F7FA]">{item.title}</span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#5B8CFF]/15 text-[#5B8CFF] border border-[#5B8CFF]/30">
                          {item.type}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#9AAABD] mt-0.5 truncate">{item.subtitle}</div>
                    </div>
                  </div>

                  <ArrowRight className="w-3.5 h-3.5 text-[#64748B]" />
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-[#64748B]">No metrology records found matching "{query}"</div>
          )}
        </div>

        <div className="p-2.5 bg-[#07111F] border-t border-[#26384D] text-[10px] text-[#64748B] flex justify-between">
          <span>Use ESC to close</span>
          <span>Tip: Press CTRL+K anytime</span>
        </div>
      </div>
    </div>
  );
};
