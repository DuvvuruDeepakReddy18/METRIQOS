import React, { useState } from 'react';
import { 
  ShieldCheck, ShieldAlert, AlertTriangle, Plus, Search, 
  FileText, ExternalLink, Calendar, CheckCircle2 
} from 'lucide-react';
import { ReferenceEquipment } from '../../types/metrology';
import { DEMO_REFERENCE_EQUIPMENT } from '../../data/initialData';

export const ReferenceEquipmentRegistry: React.FC = () => {
  const [equipmentList, setEquipmentList] = useState<ReferenceEquipment[]>(DEMO_REFERENCE_EQUIPMENT);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEquipment = equipmentList.filter((eq) =>
    eq.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    eq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    eq.certificateNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#26384D] gap-3">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#19C7C8]" />
            <h2 className="text-base font-bold text-[#F4F7FA]">
              Reference Working Standards & Traceability Registry
            </h2>
          </div>
          <p className="text-xs text-[#9AAABD] mt-0.5">
            Calibrated standard masses and environmental instrumentation traceable to National Metrology Institutes (NPL / BIPM).
          </p>
        </div>

        <button
          onClick={() => alert('Add Reference Equipment modal')}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#19C7C8] text-[#07111F] text-xs font-mono font-bold hover:bg-[#19C7C8]/90 transition-colors shadow-md"
        >
          <Plus className="w-3.5 h-3.5" />
          Register Working Standard
        </button>
      </div>

      {/* Security alert about expired standards */}
      <div className="bg-[#101D2D] p-3 rounded-xl border border-[#26384D] flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2 text-[#9AAABD]">
          <span className="w-2 h-2 rounded-full bg-[#EF5B5B] animate-pulse" />
          <span>Active Standards Quotas: 3 Certified Active • 1 Expired Quarantine</span>
        </div>
        <span className="text-[#EF5B5B] font-bold">
          Readiness Gate: Enforces Strict Cal-Block on Expired Sets
        </span>
      </div>

      {/* Equipment Table */}
      <div className="bg-[#0B1726] border border-[#26384D] rounded-xl overflow-hidden shadow-2xl">
        <div className="p-3 border-b border-[#26384D]">
          <input
            type="text"
            placeholder="Search standards by ID, cert number, or type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-80 bg-[#101D2D] border border-[#26384D] rounded-lg px-3 py-1.5 text-xs text-[#F4F7FA] font-mono focus:border-[#19C7C8] focus:outline-none"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#101D2D] text-[#64748B] uppercase text-[10px] border-b border-[#26384D]">
              <tr>
                <th className="py-2.5 px-4">Standard ID</th>
                <th className="py-2.5 px-4">Equipment Name</th>
                <th className="py-2.5 px-3">Class / Type</th>
                <th className="py-2.5 px-3">Certificate No</th>
                <th className="py-2.5 px-3">Validity Expiry</th>
                <th className="py-2.5 px-3">Uncertainty</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#26384D]/60 text-[#F4F7FA]">
              {filteredEquipment.map((eq) => {
                const isExpired = eq.calibrationStatus === 'EXPIRED';

                return (
                  <tr
                    key={eq.id}
                    className={`hover:bg-[#142438]/50 transition-colors ${
                      isExpired ? 'bg-[#EF5B5B]/5' : ''
                    }`}
                  >
                    <td className="py-3 px-4 font-bold text-[#19C7C8]">{eq.id}</td>
                    <td className="py-3 px-4 text-[#F4F7FA]">
                      <div>{eq.name}</div>
                      <div className="text-[10px] text-[#64748B]">{eq.manufacturer} • {eq.model}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-[#5B8CFF]/15 text-[#5B8CFF] border border-[#5B8CFF]/30 text-[10px]">
                        {eq.type}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[#9AAABD]">{eq.certificateNumber}</td>
                    <td className="py-3 px-3">
                      <div className={isExpired ? 'text-[#EF5B5B] font-bold' : 'text-[#20C997]'}>
                        {eq.validUntil}
                      </div>
                      <div className="text-[9px] text-[#64748B]">Cal: {eq.calibrationDate}</div>
                    </td>
                    <td className="py-3 px-3 text-[#9AAABD] text-[10px]">{eq.uncertainty}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        eq.calibrationStatus === 'VALID'
                          ? 'bg-[#20C997]/15 text-[#20C997] border-[#20C997]/30'
                          : 'bg-[#EF5B5B]/15 text-[#EF5B5B] border-[#EF5B5B]/40'
                      }`}>
                        {eq.calibrationStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => alert(`Opening Certificate Dossier for ${eq.id}`)}
                        className="text-xs text-[#19C7C8] hover:underline"
                      >
                        Inspect Dossier
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
