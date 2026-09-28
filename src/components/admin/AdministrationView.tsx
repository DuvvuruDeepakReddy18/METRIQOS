import React, { useState } from 'react';
import { Shield, Users, Building, Key, HardDrive, CheckCircle2, UserCheck } from 'lucide-react';
import { UserRole } from '../../types/metrology';

const USERS_LIST = [
  { id: 'USR-001', name: 'Dr. Arthur Vance', role: 'REVIEWER', lab: 'National Metrology Lab', badge: 'LM-DIR-01' },
  { id: 'USR-088', name: 'Banu Priya', role: 'TEST_ENGINEER', lab: 'Division 4 Legal Metrology', badge: 'NML-IN-2026-88' },
  { id: 'USR-042', name: 'Vikram Joshi', role: 'LAB_MANAGER', lab: 'Division 4 Legal Metrology', badge: 'NML-MGR-42' },
  { id: 'USR-019', name: 'Elena Rostova', role: 'AUDITOR', lab: 'BIPM Quality Assurance', badge: 'QA-EXT-19' },
];

export const AdministrationView: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-[#26384D]">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#19C7C8]" />
            <h2 className="text-base font-bold text-[#F4F7FA]">
              Laboratory Administration & Role-Based Access Control
            </h2>
          </div>
          <p className="text-xs text-[#9AAABD] mt-0.5">
            Strict RBAC least-privilege policies governing test creation, measurement capture, and cryptographic certificate sealing.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* User Directory (8 cols) */}
        <div className="lg:col-span-8 bg-[#0B1726] border border-[#26384D] rounded-xl overflow-hidden shadow-xl">
          <div className="px-4 py-3 border-b border-[#26384D] flex justify-between items-center">
            <span className="text-xs font-mono font-bold text-[#F4F7FA]">Authorized Personnel</span>
            <span className="text-[10px] font-mono text-[#19C7C8]">4 Active Credentials</span>
          </div>

          <div className="divide-y divide-[#26384D] text-xs font-mono">
            {USERS_LIST.map((u) => (
              <div key={u.id} className="p-3 flex items-center justify-between hover:bg-[#101D2D]/60">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#F4F7FA]">{u.name}</span>
                    <span className="text-[10px] text-[#64748B]">({u.badge})</span>
                  </div>
                  <div className="text-[11px] text-[#9AAABD]">{u.lab}</div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                    u.role === 'REVIEWER'
                      ? 'bg-[#20C997]/15 text-[#20C997] border-[#20C997]/30'
                      : u.role === 'TEST_ENGINEER'
                      ? 'bg-[#19C7C8]/15 text-[#19C7C8] border-[#19C7C8]/30'
                      : 'bg-[#5B8CFF]/15 text-[#5B8CFF] border-[#5B8CFF]/30'
                  }`}>
                    {u.role}
                  </span>
                  <button className="text-xs text-[#19C7C8] hover:underline">Edit Privileges</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security & System Storage Settings (4 cols) */}
        <div className="lg:col-span-4 bg-[#0B1726] border border-[#26384D] rounded-xl p-4 shadow-xl space-y-3 font-mono text-xs">
          <div className="pb-2 border-b border-[#26384D]">
            <span className="text-xs font-bold text-[#F4F7FA]">Hardware & Offline Security</span>
          </div>

          <div className="bg-[#101D2D] p-3 rounded-lg border border-[#26384D] space-y-1">
            <span className="text-[10px] text-[#64748B] uppercase block">Hardware Security Module (HSM)</span>
            <span className="text-[#20C997] font-bold">ACTIVE (FIPS 140-2 Level 3)</span>
            <div className="text-[10px] text-[#9AAABD] mt-1">Used for signing sealed report certificates</div>
          </div>

          <div className="bg-[#101D2D] p-3 rounded-lg border border-[#26384D] space-y-1">
            <span className="text-[10px] text-[#64748B] uppercase block">Local IndexedDB Cache</span>
            <span className="text-[#19C7C8] font-bold">SYNCHRONIZED (Zero Pending)</span>
            <div className="text-[10px] text-[#9AAABD] mt-1">Full offline measurement capture enabled</div>
          </div>
        </div>
      </div>
    </div>
  );
};
