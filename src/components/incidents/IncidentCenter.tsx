import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle2, Clock, Filter, Eye, ArrowRight } from 'lucide-react';
import { Incident } from '../../types/metrology';
import { DEMO_INCIDENTS } from '../../data/initialData';

export const IncidentCenter: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>(DEMO_INCIDENTS);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(DEMO_INCIDENTS[0]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#26384D] gap-2">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-[#EF5B5B]" />
            <h2 className="text-base font-bold text-[#F4F7FA]">
              Metrology Integrity Incident Center
            </h2>
          </div>
          <p className="text-xs text-[#9AAABD] mt-0.5">
            Automated detection and resolution log for measurement conflicts, calculation discrepancies, expired standards, and sync divergence.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-2.5 py-1 rounded bg-[#EF5B5B]/15 text-[#EF5B5B] border border-[#EF5B5B]/30 font-bold">
            1 Open Incident
          </span>
          <span className="px-2.5 py-1 rounded bg-[#20C997]/15 text-[#20C997] border border-[#20C997]/30">
            1 Resolved
          </span>
        </div>
      </div>

      {/* Incidents Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Incident List (7 cols) */}
        <div className="lg:col-span-7 bg-[#0B1726] border border-[#26384D] rounded-xl overflow-hidden shadow-xl divide-y divide-[#26384D]">
          {incidents.map((inc) => {
            const isSelected = selectedIncident?.id === inc.id;
            const isCritical = inc.severity === 'CRITICAL';
            const isOpen = inc.status === 'OPEN';

            return (
              <div
                key={inc.id}
                onClick={() => setSelectedIncident(inc)}
                className={`p-4 cursor-pointer transition-all space-y-2 ${
                  isSelected ? 'bg-[#142438]' : 'hover:bg-[#101D2D]/60'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#19C7C8]">{inc.id}</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold ${
                      isCritical
                        ? 'bg-[#EF5B5B]/15 text-[#EF5B5B] border-[#EF5B5B]/30'
                        : 'bg-[#F4B740]/15 text-[#F4B740] border-[#F4B740]/30'
                    }`}>
                      {inc.severity}
                    </span>
                  </div>

                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                    isOpen
                      ? 'bg-[#F4B740]/15 text-[#F4B740] border-[#F4B740]/30'
                      : 'bg-[#20C997]/15 text-[#20C997] border-[#20C997]/30'
                  }`}>
                    {inc.status}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-[#F4F7FA]">{inc.title}</h4>
                <p className="text-xs text-[#9AAABD] line-clamp-2">{inc.description}</p>

                <div className="flex justify-between text-[10px] font-mono text-[#64748B] pt-1">
                  <span>Instrument: {inc.relatedInstrumentId}</span>
                  <span>Owner: {inc.owner}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Incident Resolution Details (5 cols) */}
        <div className="lg:col-span-5 bg-[#0B1726] border border-[#26384D] rounded-xl p-4 shadow-xl flex flex-col justify-between">
          {selectedIncident ? (
            <div className="space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#26384D]">
                <span className="text-xs font-bold text-[#19C7C8]">{selectedIncident.id} Forensic Dossier</span>
                <span className="text-[10px] text-[#64748B]">{selectedIncident.detectedTime}</span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-[#F4F7FA]">{selectedIncident.title}</h4>
                <p className="text-xs text-[#9AAABD] mt-1 leading-relaxed">
                  {selectedIncident.description}
                </p>
              </div>

              <div className="bg-[#101D2D] p-3 rounded-lg border border-[#26384D] space-y-1">
                <span className="text-[10px] text-[#64748B] block uppercase">Related Measurement</span>
                <span className="text-[#19C7C8] font-bold">
                  {selectedIncident.relatedMeasurementId || 'Pre-Measurement Gate Event'}
                </span>
              </div>

              {selectedIncident.resolution && (
                <div className="bg-[#142438] p-3 rounded-lg border border-[#20C997]/40 space-y-1">
                  <div className="flex items-center gap-1.5 text-[#20C997] font-bold text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Resolution Record</span>
                  </div>
                  <p className="text-[#F4F7FA] text-xs leading-relaxed">
                    {selectedIncident.resolution}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-16 text-xs text-[#64748B]">Select an incident to view root-cause analysis</div>
          )}

          {selectedIncident?.status === 'OPEN' && (
            <div className="pt-3 border-t border-[#26384D]">
              <button
                onClick={() => {
                  alert('Incident resolved and added to audit trail');
                  setSelectedIncident({ ...selectedIncident, status: 'RESOLVED', resolution: 'Officer conducted corner dampener calibration and verified mechanical spirit level.' });
                }}
                className="w-full py-2 px-3 rounded-lg bg-[#20C997] hover:bg-[#20C997]/90 text-[#07111F] text-xs font-mono font-bold transition-all"
              >
                Document Remediation & Close Incident
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
