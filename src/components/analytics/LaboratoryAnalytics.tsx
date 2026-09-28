import React from 'react';
import { Activity, ShieldCheck, CheckCircle2, AlertTriangle, Scale, PieChart, BarChart2, Info } from 'lucide-react';

export const LaboratoryAnalytics: React.FC = () => {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#26384D] gap-2">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#19C7C8]" />
            <h2 className="text-base font-bold text-[#F4F7FA]">
              Laboratory Metrology Analytics & Integrity Intelligence
            </h2>
          </div>
          <p className="text-xs text-[#9AAABD] mt-0.5">
            Operational verification throughput, evidence exception distribution, and cross-test consistency trends.
          </p>
        </div>

        <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-[#F4B740]/15 text-[#F4B740] border border-[#F4B740]/30 font-bold">
          DEMO DATA ENVIRONMENT
        </span>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-[#0B1726] p-4 rounded-xl border border-[#26384D] shadow-xl">
          <span className="text-[10px] font-mono text-[#64748B] uppercase block">Total Completed Verifications</span>
          <div className="text-2xl font-mono font-bold text-[#F4F7FA] mt-1">142</div>
          <span className="text-[11px] font-mono text-[#20C997] mt-1 block">98.6% Verification Rate</span>
        </div>

        <div className="bg-[#0B1726] p-4 rounded-xl border border-[#26384D] shadow-xl">
          <span className="text-[10px] font-mono text-[#64748B] uppercase block">Active Review Queue</span>
          <div className="text-2xl font-mono font-bold text-[#F4B740] mt-1">3</div>
          <span className="text-[11px] font-mono text-[#9AAABD] mt-1 block">Avg resolution: 18 mins</span>
        </div>

        <div className="bg-[#0B1726] p-4 rounded-xl border border-[#26384D] shadow-xl">
          <span className="text-[10px] font-mono text-[#64748B] uppercase block">Evidence Exceptions</span>
          <div className="text-2xl font-mono font-bold text-[#19C7C8] mt-1">1</div>
          <span className="text-[11px] font-mono text-[#20C997] mt-1 block">Controlled override applied</span>
        </div>

        <div className="bg-[#0B1726] p-4 rounded-xl border border-[#26384D] shadow-xl">
          <span className="text-[10px] font-mono text-[#64748B] uppercase block">Dual-Engine Convergence</span>
          <div className="text-2xl font-mono font-bold text-[#20C997] mt-1">100%</div>
          <span className="text-[11px] font-mono text-[#64748B] mt-1 block">Zero numerical divergence</span>
        </div>
      </div>

      {/* Distribution Bars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Test Type Distribution */}
        <div className="bg-[#0B1726] p-4 rounded-xl border border-[#26384D] shadow-xl space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#26384D]">
            <span className="text-xs font-mono font-bold text-[#F4F7FA]">Verifications by Accuracy Class</span>
            <span className="text-[10px] font-mono text-[#64748B]">OIML R76</span>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div>
              <div className="flex justify-between mb-1">
                <span>Class III (Commercial & Logistics)</span>
                <span className="text-[#19C7C8]">118 (83%)</span>
              </div>
              <div className="h-2 bg-[#101D2D] rounded-full overflow-hidden">
                <div className="h-full bg-[#19C7C8]" style={{ width: '83%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span>Class II (High Precision / Lab)</span>
                <span className="text-[#5B8CFF]">19 (13%)</span>
              </div>
              <div className="h-2 bg-[#101D2D] rounded-full overflow-hidden">
                <div className="h-full bg-[#5B8CFF]" style={{ width: '13%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span>Class I & IIII (Special & Heavy Weighbridge)</span>
                <span className="text-[#20C997]">5 (4%)</span>
              </div>
              <div className="h-2 bg-[#101D2D] rounded-full overflow-hidden">
                <div className="h-full bg-[#20C997]" style={{ width: '4%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Acquisition Source Telemetry Split */}
        <div className="bg-[#0B1726] p-4 rounded-xl border border-[#26384D] shadow-xl space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#26384D]">
            <span className="text-xs font-mono font-bold text-[#F4F7FA]">Telemetry Ingestion Channel Split</span>
            <span className="text-[10px] font-mono text-[#64748B]">AutoPort vs Manual</span>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div>
              <div className="flex justify-between mb-1">
                <span>AutoPort RS-232 Direct UART</span>
                <span className="text-[#20C997]">78%</span>
              </div>
              <div className="h-2 bg-[#101D2D] rounded-full overflow-hidden">
                <div className="h-full bg-[#20C997]" style={{ width: '78%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span>AutoPort USB-CDC / Ethernet</span>
                <span className="text-[#19C7C8]">18%</span>
              </div>
              <div className="h-2 bg-[#101D2D] rounded-full overflow-hidden">
                <div className="h-full bg-[#19C7C8]" style={{ width: '18%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span>Manual Observations (With Mandatory Reason)</span>
                <span className="text-[#F4B740]">4%</span>
              </div>
              <div className="h-2 bg-[#101D2D] rounded-full overflow-hidden">
                <div className="h-full bg-[#F4B740]" style={{ width: '4%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
