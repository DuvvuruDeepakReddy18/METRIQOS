import React, { useState } from 'react';
import { 
  Search, Bell, Wifi, WifiOff, RefreshCw, HelpCircle, 
  ChevronDown, ShieldCheck, UserCheck, Sparkles 
} from 'lucide-react';
import { NavigationRoute } from './Sidebar';
import { UserRole } from '../../types/metrology';

interface TopBarProps {
  currentRoute: NavigationRoute;
  onOpenSearch: () => void;
  onOpenArchitecture: () => void;
  onStartSIHDemo: () => void;
  currentRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  isOffline: boolean;
  onToggleOffline: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentRoute,
  onOpenSearch,
  onOpenArchitecture,
  onStartSIHDemo,
  currentRole,
  onChangeRole,
  isOffline,
  onToggleOffline,
}) => {
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const getBreadcrumb = () => {
    switch (currentRoute) {
      case 'dashboard': return 'Command Center / Laboratory Overview';
      case 'instruments': return 'Operations / NAWI Registry';
      case 'digital-twin': return 'Operations / 3D Digital Twin';
      case 'applicability': return 'Operations / Applicability Compiler';
      case 'workbench': return 'Operations / Testing Workbench';
      case 'measurements': return 'Operations / Measurement Events';
      case 'evidence-graph': return 'Assurance / Provenance Evidence Graph';
      case 'replay': return 'Assurance / Measurement Event Replay';
      case 'regulation-replay': return 'Assurance / Regulation Replay Sandbox';
      case 'reports': return 'Assurance / Sealed Technical Certificates';
      case 'verify-report': return 'Assurance / QR Integrity Verification';
      case 'rules': return 'Governance / OIML Rule Packages';
      case 'reference-equipment': return 'Governance / Reference Standards Registry';
      case 'incidents': return 'Assurance / Incident Center';
      case 'analytics': return 'Analytics / Metrology Intelligence';
      case 'audit': return 'Governance / Immutable Audit Trail';
      case 'admin': return 'Administration / Laboratory Access Control';
      default: return 'METRIQOS / System';
    }
  };

  const NOTIFICATIONS = [
    { id: 1, text: 'Reference weight STD-WEIGHT-M1-042 verified valid through 2026-12-10', time: '12m ago', type: 'info' },
    { id: 2, text: 'Reviewer override authorized for MEV-000484 by Dr. Arthur Vance', time: '18m ago', type: 'warning' },
    { id: 3, text: 'Certificate REP-R76-2026-00412 cryptographically sealed & hashed', time: '40m ago', type: 'success' },
  ];

  return (
    <header className="h-14 bg-[#0B1726] border-b border-[#26384D] px-4 flex items-center justify-between z-20 shrink-0 font-mono text-xs select-none">
      {/* Breadcrumb path */}
      <div className="flex items-center gap-2 text-[#9AAABD] truncate">
        <span className="text-[#64748B]">METRIQOS</span>
        <span className="text-[#26384D]">/</span>
        <span className="text-[#F4F7FA] font-medium truncate">{getBreadcrumb()}</span>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* SIH Interactive Demo Trigger Pill */}
        <button
          onClick={onStartSIHDemo}
          className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#19C7C8]/15 hover:bg-[#19C7C8]/25 text-[#19C7C8] border border-[#19C7C8]/40 font-bold transition-all shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Launch 21-Step Demo</span>
        </button>

        {/* Global Search Button (CTRL + K) */}
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#101D2D] hover:bg-[#142438] text-[#9AAABD] hover:text-[#F4F7FA] border border-[#26384D] transition-colors"
          title="Open Global Search (Ctrl+K)"
        >
          <Search className="w-3.5 h-3.5 text-[#19C7C8]" />
          <span className="hidden lg:inline text-[11px]">Search...</span>
          <kbd className="hidden sm:inline bg-[#07111F] px-1.5 py-0.5 rounded text-[9px] text-[#64748B] border border-[#26384D]">
            Ctrl K
          </kbd>
        </button>

        {/* Offline / Online Simulation Toggle */}
        <button
          onClick={onToggleOffline}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-colors ${
            isOffline
              ? 'bg-[#F4B740]/15 text-[#F4B740] border-[#F4B740]/40'
              : 'bg-[#101D2D] text-[#20C997] border-[#26384D]'
          }`}
          title="Toggle network connectivity simulation"
        >
          {isOffline ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
          <span className="text-[10px] hidden sm:inline font-bold">
            {isOffline ? 'OFFLINE (LOCAL CAPTURE)' : 'ONLINE'}
          </span>
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-1.5 rounded-lg bg-[#101D2D] text-[#9AAABD] hover:text-[#F4F7FA] border border-[#26384D] relative"
            title="System Metrology Notifications"
          >
            <Bell className="w-3.5 h-3.5" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#19C7C8]" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-9 w-80 bg-[#0B1726] border border-[#26384D] rounded-xl p-3 shadow-2xl space-y-2 z-50">
              <div className="flex justify-between items-center pb-1.5 border-b border-[#26384D]">
                <span className="font-bold text-[#F4F7FA]">Metrology Notifications</span>
                <span className="text-[10px] text-[#19C7C8]">3 Unread</span>
              </div>
              <div className="space-y-1.5 max-h-60 overflow-y-auto">
                {NOTIFICATIONS.map((n) => (
                  <div key={n.id} className="p-2 rounded bg-[#101D2D] text-[11px] space-y-0.5">
                    <div className="text-[#F4F7FA]">{n.text}</div>
                    <div className="text-[9px] text-[#64748B]">{n.time}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RBAC Role Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#142438] text-[#F4F7FA] border border-[#26384D] hover:bg-[#101D2D] transition-colors"
          >
            <span className="text-[#5B8CFF] font-bold text-[10px]">{currentRole}</span>
            <ChevronDown className="w-3 h-3 text-[#64748B]" />
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 top-9 w-48 bg-[#0B1726] border border-[#26384D] rounded-xl p-1.5 shadow-2xl space-y-0.5 z-50">
              <div className="px-2 py-1 text-[9px] text-[#64748B] uppercase">Switch RBAC Persona</div>
              {(['ADMIN', 'LAB_MANAGER', 'TEST_ENGINEER', 'REVIEWER', 'AUDITOR', 'VIEWER'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    onChangeRole(r);
                    setShowRoleMenu(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded text-xs transition-colors ${
                    currentRole === r ? 'bg-[#19C7C8]/20 text-[#19C7C8] font-bold' : 'text-[#9AAABD] hover:text-[#F4F7FA] hover:bg-[#101D2D]'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Architecture View Trigger */}
        <button
          onClick={onOpenArchitecture}
          className="p-1.5 rounded-lg bg-[#101D2D] text-[#9AAABD] hover:text-[#19C7C8] border border-[#26384D]"
          title="Open Architecture Blueprint (Judge Experience)"
        >
          <HelpCircle className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};
