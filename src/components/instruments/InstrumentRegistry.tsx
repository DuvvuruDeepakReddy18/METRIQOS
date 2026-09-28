import React, { useState } from 'react';
import { 
  Scale, Plus, Search, Filter, ShieldCheck, Cpu, 
  ExternalLink, CheckCircle2, AlertTriangle, Eye, Camera 
} from 'lucide-react';
import { Instrument } from '../../types/metrology';
import { DEMO_INSTRUMENTS } from '../../data/initialData';

interface InstrumentRegistryProps {
  onSelectInstrument: (inst: Instrument) => void;
  onOpenDigitalTwin: (inst: Instrument) => void;
  onOpenOCR: () => void;
}

export const InstrumentRegistry: React.FC<InstrumentRegistryProps> = ({
  onSelectInstrument,
  onOpenDigitalTwin,
  onOpenOCR,
}) => {
  const [instruments, setInstruments] = useState<Instrument[]>(DEMO_INSTRUMENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('ALL');

  const filteredInstruments = instruments.filter((inst) => {
    const matchesSearch =
      inst.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inst.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inst.serialNumber.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesClass = selectedClass === 'ALL' || inst.accuracyClass === selectedClass;

    return matchesSearch && matchesClass;
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#26384D] gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-[#19C7C8]" />
            <h2 className="text-base font-bold text-[#F4F7FA]">
              Legal Metrology NAWI Registry
            </h2>
          </div>
          <p className="text-xs text-[#9AAABD] mt-0.5">
            Registered Non-Automatic Weighing Instruments under laboratory jurisdiction and pattern approval oversight.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenOCR}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#142438] text-[#19C7C8] border border-[#26384D] hover:bg-[#101D2D] text-xs font-mono transition-colors"
          >
            <Camera className="w-3.5 h-3.5" />
            AI Nameplate OCR
          </button>

          <button
            onClick={() => alert('New Instrument Registration modal opened')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#19C7C8] text-[#07111F] text-xs font-mono font-bold hover:bg-[#19C7C8]/90 transition-colors shadow-md"
          >
            <Plus className="w-3.5 h-3.5" />
            Register Instrument
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#0B1726] p-3 rounded-xl border border-[#26384D]">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by ID, model, serial number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#101D2D] border border-[#26384D] rounded-lg pl-9 pr-3 py-1.5 text-xs text-[#F4F7FA] font-mono focus:border-[#19C7C8] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-[#64748B] font-mono shrink-0">Class:</span>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="bg-[#101D2D] border border-[#26384D] rounded px-3 py-1.5 text-xs text-[#F4F7FA] font-mono focus:outline-none"
          >
            <option value="ALL">All Accuracy Classes</option>
            <option value="CLASS_I">Class I (Special)</option>
            <option value="CLASS_II">Class II (High)</option>
            <option value="CLASS_III">Class III (Medium)</option>
            <option value="CLASS_IIII">Class IIII (Ordinary)</option>
          </select>
        </div>
      </div>

      {/* Premium Instrument Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredInstruments.map((inst) => (
          <div
            key={inst.id}
            className="bg-[#0B1726] border border-[#26384D] hover:border-[#19C7C8]/50 rounded-xl p-4 shadow-xl flex flex-col justify-between transition-all group"
          >
            <div className="space-y-3">
              {/* Card Header */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#19C7C8]">
                      {inst.id}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#5B8CFF]/15 text-[#5B8CFF] border border-[#5B8CFF]/30">
                      {inst.accuracyClass}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-[#F4F7FA] mt-1 group-hover:text-[#19C7C8] transition-colors">
                    {inst.name}
                  </h3>
                  <div className="text-xs text-[#9AAABD] font-mono">
                    {inst.manufacturer} • {inst.model}
                  </div>
                </div>

                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                  inst.status === 'VERIFIED'
                    ? 'bg-[#20C997]/15 text-[#20C997] border-[#20C997]/30'
                    : inst.status === 'IN_TESTING'
                    ? 'bg-[#19C7C8]/15 text-[#19C7C8] border-[#19C7C8]/30'
                    : 'bg-[#5B8CFF]/15 text-[#5B8CFF] border-[#5B8CFF]/30'
                }`}>
                  {inst.status}
                </span>
              </div>

              {/* Technical Specifications Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-[#101D2D] p-2.5 rounded-lg border border-[#26384D]">
                <div>
                  <span className="text-[#64748B] text-[9px] uppercase block">Max Capacity</span>
                  <span className="text-[#F4F7FA] font-bold">{inst.maxCapacity} {inst.unit}</span>
                </div>
                <div>
                  <span className="text-[#64748B] text-[9px] uppercase block">Min Capacity</span>
                  <span className="text-[#F4F7FA] font-bold">{inst.minCapacity} {inst.unit}</span>
                </div>
                <div>
                  <span className="text-[#64748B] text-[9px] uppercase block">Scale Interval (e)</span>
                  <span className="text-[#19C7C8] font-bold">{inst.verificationInterval_e} {inst.unit}</span>
                </div>
                <div>
                  <span className="text-[#64748B] text-[9px] uppercase block">Interval (d)</span>
                  <span className="text-[#F4F7FA] font-bold">{inst.actualInterval_d} {inst.unit}</span>
                </div>
              </div>

              {/* Telemetry Port & Serial Number */}
              <div className="text-[11px] font-mono text-[#9AAABD] space-y-1">
                <div className="truncate">Serial: {inst.serialNumber}</div>
                <div className="truncate text-[#64748B]">Port: {inst.communicationPort}</div>
              </div>
            </div>

            {/* Action Buttons at bottom */}
            <div className="pt-3 mt-3 border-t border-[#26384D] flex items-center justify-between gap-2">
              <button
                onClick={() => onOpenDigitalTwin(inst)}
                className="py-1.5 px-3 rounded-lg bg-[#142438] hover:bg-[#101D2D] text-[#19C7C8] text-xs font-mono border border-[#26384D] transition-colors flex items-center gap-1.5"
              >
                <Cpu className="w-3.5 h-3.5" />
                3D Digital Twin
              </button>

              <button
                onClick={() => onSelectInstrument(inst)}
                className="py-1.5 px-3 rounded-lg bg-[#19C7C8] hover:bg-[#19C7C8]/90 text-[#07111F] text-xs font-mono font-bold transition-colors"
              >
                Select for Test
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
