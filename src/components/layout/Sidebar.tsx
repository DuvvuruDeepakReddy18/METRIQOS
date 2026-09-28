import React from 'react';
import { 
  LayoutDashboard, Scale, Layers, Wrench, Binary, Hash, FileCheck, 
  GitBranch, RefreshCw, ShieldCheck, AlertTriangle, Activity, Lock, 
  Users, ChevronLeft, ChevronRight, Cpu 
} from 'lucide-react';
import { UserRole } from '../../types/metrology';

export type NavigationRoute = 
  | 'dashboard'
  | 'instruments'
  | 'digital-twin'
  | 'applicability'
  | 'workbench'
  | 'measurements'
  | 'evidence-graph'
  | 'replay'
  | 'regulation-replay'
  | 'reports'
  | 'verify-report'
  | 'rules'
  | 'reference-equipment'
  | 'incidents'
  | 'analytics'
  | 'audit'
  | 'admin';

interface SidebarProps {
  currentRoute: NavigationRoute;
  onNavigate: (route: NavigationRoute) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  currentRole: UserRole;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRoute,
  onNavigate,
  collapsed,
  onToggleCollapse,
  currentRole,
}) => {
  const MENU_SECTIONS = [
    {
      title: 'COMMAND CENTER',
      items: [
        { route: 'dashboard', label: 'Overview', icon: LayoutDashboard },
      ],
    },
    {
      title: 'OPERATIONS',
      items: [
        { route: 'instruments', label: 'Instruments', icon: Scale },
        { route: 'digital-twin', label: 'Digital Twin (3D)', icon: Cpu },
        { route: 'applicability', label: 'Applicability Compiler', icon: Binary },
        { route: 'workbench', label: 'Testing Workbench', icon: Wrench },
        { route: 'measurements', label: 'Measurement Events', icon: Hash },
      ],
    },
    {
      title: 'ASSURANCE',
      items: [
        { route: 'evidence-graph', label: 'Evidence Graph', icon: Layers },
        { route: 'replay', label: 'Measurement Replay', icon: RefreshCw },
        { route: 'regulation-replay', label: 'Regulation Replay', icon: GitBranch },
        { route: 'reports', label: 'Sealed Reports', icon: FileCheck },
        { route: 'incidents', label: 'Incident Center', icon: AlertTriangle },
      ],
    },
    {
      title: 'GOVERNANCE',
      items: [
        { route: 'rules', label: 'Rule Packages', icon: Binary },
        { route: 'reference-equipment', label: 'Reference Equipment', icon: ShieldCheck },
        { route: 'audit', label: 'Audit Trail', icon: Lock },
      ],
    },
    {
      title: 'ANALYTICS & ADMIN',
      items: [
        { route: 'analytics', label: 'Lab Analytics', icon: Activity },
        { route: 'admin', label: 'Administration', icon: Users },
      ],
    },
  ];

  return (
    <aside
      className={`bg-[#0B1726] border-r border-[#26384D] flex flex-col justify-between transition-all duration-300 z-30 shrink-0 select-none ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Top Logo Header */}
      <div>
        <div className="h-16 px-4 border-b border-[#26384D] flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#101D2D] border border-[#19C7C8]/50 flex items-center justify-center p-1">
                <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
                  <circle cx="32" cy="32" r="20" stroke="#19C7C8" strokeWidth="3" strokeDasharray="4 2" />
                  <path d="M 12 32 L 24 32 L 28 20 L 32 44 L 36 24 L 40 32 L 52 32" stroke="#F4F7FA" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <span className="font-mono font-bold text-sm text-[#F4F7FA] tracking-wider">
                  METRIQOS
                </span>
                <span className="text-[9px] font-mono text-[#19C7C8] block tracking-tight uppercase">
                  Digital Metrology OS
                </span>
              </div>
            </div>
          )}

          {collapsed && (
            <div className="mx-auto w-8 h-8 rounded-lg bg-[#101D2D] border border-[#19C7C8]/50 flex items-center justify-center p-1">
              <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
                <circle cx="32" cy="32" r="20" stroke="#19C7C8" strokeWidth="3" strokeDasharray="4 2" />
                <path d="M 12 32 L 24 32 L 28 20 L 32 44 L 36 24 L 40 32 L 52 32" stroke="#F4F7FA" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          )}

          <button
            onClick={onToggleCollapse}
            className="hidden sm:flex text-[#9AAABD] hover:text-[#F4F7FA] p-1 rounded hover:bg-[#142438] transition-colors"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Sections */}
        <div className="py-3 space-y-4 max-h-[calc(100vh-140px)] overflow-y-auto">
          {MENU_SECTIONS.map((section) => (
            <div key={section.title} className="px-2">
              {!collapsed && (
                <div className="text-[9px] font-mono font-bold text-[#64748B] px-3 mb-1 uppercase tracking-widest">
                  {section.title}
                </div>
              )}

              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive = currentRoute === item.route;
                  const Icon = item.icon;

                  return (
                    <button
                      key={item.route}
                      onClick={() => onNavigate(item.route as NavigationRoute)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-mono transition-all ${
                        isActive
                          ? 'bg-[#142438] text-[#19C7C8] font-bold border-l-2 border-[#19C7C8]'
                          : 'text-[#9AAABD] hover:text-[#F4F7FA] hover:bg-[#101D2D]'
                      }`}
                      title={collapsed ? item.label : undefined}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#19C7C8]' : 'text-[#64748B]'}`} />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom System & Laboratory Status */}
      <div className="p-3 border-t border-[#26384D] bg-[#07111F]/50">
        {!collapsed ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-[#64748B]">METROLOGY CORE</span>
              <span className="text-[#20C997] font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#20C997] animate-pulse" />
                ONLINE
              </span>
            </div>
            <div className="text-[10px] font-mono text-[#9AAABD] truncate" title="National Metrology Laboratory (NML Div 4)">
              Lab: NML Division 4
            </div>
            <div className="text-[10px] font-mono text-[#5B8CFF]">
              Role: {currentRole}
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-[#20C997] animate-pulse" title="System Online" />
          </div>
        )}
      </div>
    </aside>
  );
};
