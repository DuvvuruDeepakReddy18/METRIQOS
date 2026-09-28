import React, { useState } from 'react';
import { Clock, ShieldCheck, Hash, UserCheck, Lock, Search, Filter } from 'lucide-react';
import { AuditEvent } from '../../types/metrology';
import { DEMO_AUDIT_TRAIL } from '../../data/initialData';

export const AuditTrailView: React.FC = () => {
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>(DEMO_AUDIT_TRAIL);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEvents = auditEvents.filter((ev) =>
    ev.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ev.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ev.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ev.entityId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#26384D] gap-2">
        <div>
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#19C7C8]" />
            <h2 className="text-base font-bold text-[#F4F7FA]">
              Append-Only Immutable Legal Metrology Audit Trail
            </h2>
          </div>
          <p className="text-xs text-[#9AAABD] mt-0.5">
            Cryptographically chained timeline of all operator actions, telemetry captures, readiness gates, reviewer overrides, and sealed certificates.
          </p>
        </div>

        <span className="text-xs font-mono text-[#20C997] bg-[#20C997]/10 px-3 py-1.5 rounded-lg border border-[#20C997]/30 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5" />
          Tamper-Evident Chained Ledger
        </span>
      </div>

      {/* Search Bar */}
      <div className="bg-[#0B1726] p-3 rounded-xl border border-[#26384D]">
        <input
          type="text"
          placeholder="Filter audit trail by user, action, entity, or hash..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-96 bg-[#101D2D] border border-[#26384D] rounded-lg px-3 py-1.5 text-xs text-[#F4F7FA] font-mono focus:border-[#19C7C8] focus:outline-none"
        />
      </div>

      {/* Timeline Table */}
      <div className="bg-[#0B1726] border border-[#26384D] rounded-xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#101D2D] text-[#64748B] uppercase text-[10px] border-b border-[#26384D]">
              <tr>
                <th className="py-2.5 px-4">Time</th>
                <th className="py-2.5 px-4">Officer / Agent</th>
                <th className="py-2.5 px-3">Role</th>
                <th className="py-2.5 px-4">Action</th>
                <th className="py-2.5 px-4">Entity</th>
                <th className="py-2.5 px-4">Audit Details</th>
                <th className="py-2.5 px-4">Chained Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#26384D]/60 text-[#F4F7FA]">
              {filteredEvents.map((ev) => (
                <tr key={ev.id} className="hover:bg-[#142438]/50 transition-colors">
                  <td className="py-3 px-4 text-[#19C7C8] font-bold">
                    {ev.timestamp.split('T')[1].replace('Z', '')}
                  </td>
                  <td className="py-3 px-4 text-[#F4F7FA] font-medium">{ev.user}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded bg-[#5B8CFF]/15 text-[#5B8CFF] border border-[#5B8CFF]/30 text-[10px]">
                      {ev.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-[#20C997]">{ev.action}</td>
                  <td className="py-3 px-4 text-[#9AAABD]">
                    {ev.entityType} ({ev.entityId})
                  </td>
                  <td className="py-3 px-4 text-[#F4F7FA] max-w-xs">{ev.details}</td>
                  <td className="py-3 px-4 text-[#64748B] text-[10px] truncate max-w-[140px]" title={ev.hash}>
                    {ev.hash}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
