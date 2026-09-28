import React, { useState } from 'react';
import { 
  Hash, Search, Filter, ShieldCheck, CheckCircle2, AlertTriangle, 
  ExternalLink, Eye, RefreshCw, Cpu 
} from 'lucide-react';
import { MeasurementEvent } from '../../types/metrology';
import { DEMO_MEASUREMENTS } from '../../data/initialData';

interface MeasurementEventsViewProps {
  onOpenReplay: (mevId: string) => void;
}

export const MeasurementEventsView: React.FC<MeasurementEventsViewProps> = ({
  onOpenReplay,
}) => {
  const [measurements, setMeasurements] = useState<MeasurementEvent[]>(DEMO_MEASUREMENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMev, setSelectedMev] = useState<MeasurementEvent | null>(DEMO_MEASUREMENTS[0]);

  const filteredMevs = measurements.filter((m) =>
    m.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.testType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.integrityHash.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#26384D] gap-2">
        <div>
          <div className="flex items-center gap-2">
            <Hash className="w-4 h-4 text-[#19C7C8]" />
            <h2 className="text-base font-bold text-[#F4F7FA]">
              Immutable Measurement Events (MEV) Ledger
            </h2>
          </div>
          <p className="text-xs text-[#9AAABD] mt-0.5">
            Atomic legal metrology observation records with cryptographic binding to raw serial telemetry, reference standards, and environment context.
          </p>
        </div>

        <span className="text-xs font-mono text-[#20C997] bg-[#20C997]/10 px-3 py-1 rounded-lg border border-[#20C997]/30">
          Append-Only Immutability Enforced
        </span>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-[#0B1726] p-3 rounded-xl border border-[#26384D]">
        <input
          type="text"
          placeholder="Filter by MEV ID, test type, or hash..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-96 bg-[#101D2D] border border-[#26384D] rounded-lg px-3 py-1.5 text-xs text-[#F4F7FA] font-mono focus:border-[#19C7C8] focus:outline-none"
        />
      </div>

      {/* Main Grid: Table & Inspection Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Table (8 cols) */}
        <div className="lg:col-span-8 bg-[#0B1726] border border-[#26384D] rounded-xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#101D2D] text-[#64748B] uppercase text-[10px] border-b border-[#26384D]">
                <tr>
                  <th className="py-2.5 px-4">MEV ID</th>
                  <th className="py-2.5 px-4">Test Step</th>
                  <th className="py-2.5 px-3">Nominal (kg)</th>
                  <th className="py-2.5 px-3">Indicated</th>
                  <th className="py-2.5 px-3">Deviation</th>
                  <th className="py-2.5 px-3">MPE Limit</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Acquisition</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#26384D]/60 text-[#F4F7FA]">
                {filteredMevs.map((mev) => {
                  const isSelected = selectedMev?.id === mev.id;

                  return (
                    <tr
                      key={mev.id}
                      onClick={() => setSelectedMev(mev)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-[#142438]' : 'hover:bg-[#101D2D]/60'
                      }`}
                    >
                      <td className="py-3 px-4 font-bold text-[#19C7C8]">{mev.id}</td>
                      <td className="py-3 px-4 text-[#9AAABD]">{mev.testType}</td>
                      <td className="py-3 px-3 tabular-nums">{mev.referenceLoad.toFixed(3)}</td>
                      <td className="py-3 px-3 tabular-nums">{mev.indicatedValue.toFixed(3)}</td>
                      <td className="py-3 px-3 tabular-nums">
                        {mev.difference > 0 ? '+' : ''}{mev.difference.toFixed(3)}
                      </td>
                      <td className="py-3 px-3">±{mev.mpeCriterion.toFixed(3)}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                          mev.validationState === 'VERIFIED'
                            ? 'bg-[#20C997]/15 text-[#20C997] border-[#20C997]/30'
                            : 'bg-[#F4B740]/15 text-[#F4B740] border-[#F4B740]/30'
                        }`}>
                          {mev.validationState}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-[#64748B] text-[10px]">
                        {mev.source.replace('AUTOPORT_', '')}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Event Detail Drawer (4 cols) */}
        <div className="lg:col-span-4 bg-[#0B1726] border border-[#26384D] rounded-xl p-4 shadow-xl flex flex-col justify-between space-y-4">
          {selectedMev ? (
            <div className="space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#26384D]">
                <span className="text-xs font-bold text-[#19C7C8]">{selectedMev.id} Event Record</span>
                <span className="text-[10px] text-[#64748B]">
                  {selectedMev.timestamp.split('T')[1].replace('Z', '')}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-[#64748B] uppercase block">Test Step</span>
                <div className="font-bold text-[#F4F7FA] mt-0.5">{selectedMev.testType}</div>
              </div>

              <div className="bg-[#101D2D] p-3 rounded-lg border border-[#26384D] space-y-1.5">
                <span className="text-[10px] text-[#64748B] uppercase block">Numerical Metrics</span>
                <div className="flex justify-between">
                  <span className="text-[#9AAABD]">Reference Load:</span>
                  <span className="text-[#F4F7FA]">{selectedMev.referenceLoad} {selectedMev.unit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9AAABD]">Indicated Readout:</span>
                  <span className="text-[#F4F7FA] font-bold">{selectedMev.indicatedValue} {selectedMev.unit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9AAABD]">Observed Deviation:</span>
                  <span className="text-[#19C7C8] font-bold">
                    {selectedMev.difference > 0 ? '+' : ''}{selectedMev.difference} {selectedMev.unit}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9AAABD]">Permissible MPE:</span>
                  <span className="text-[#20C997]">±{selectedMev.mpeCriterion} {selectedMev.unit}</span>
                </div>
              </div>

              <div className="bg-[#101D2D] p-3 rounded-lg border border-[#26384D] space-y-1">
                <span className="text-[10px] text-[#64748B] uppercase block">Cryptographic Hash</span>
                <span className="text-[#19C7C8] break-all text-[10px] block font-mono">
                  {selectedMev.integrityHash}
                </span>
              </div>

              {selectedMev.rawSerialFrame && (
                <div className="bg-[#07111F] p-2.5 rounded-lg border border-[#26384D] space-y-1">
                  <span className="text-[10px] text-[#20C997] uppercase block font-bold">Raw Serial Frame</span>
                  <div className="text-[#20C997] text-[11px] font-mono">
                    {selectedMev.rawSerialFrame.replace('\r\n', '')}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-16 text-xs text-[#64748B]">Select an event to inspect its cryptographic record</div>
          )}

          {selectedMev && (
            <div className="pt-3 border-t border-[#26384D]">
              <button
                onClick={() => onOpenReplay(selectedMev.id)}
                className="w-full py-2 px-3 rounded-lg bg-[#142438] hover:bg-[#101D2D] text-[#19C7C8] text-xs font-mono font-bold border border-[#26384D] transition-colors flex items-center justify-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Open Event Replay Timeline
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
