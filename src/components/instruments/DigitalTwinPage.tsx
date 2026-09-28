import React, { useState } from 'react';
import { Cpu, Scale, ShieldCheck, Thermometer, Clock, FileCheck, Layers, ArrowLeft } from 'lucide-react';
import { Instrument } from '../../types/metrology';
import { DigitalTwin3D } from '../3d/DigitalTwin3D';
import { DEMO_INSTRUMENTS, DEMO_MEASUREMENTS, DEMO_EVIDENCE, DEMO_AUDIT_TRAIL, DEMO_REPORT } from '../../data/initialData';

interface DigitalTwinPageProps {
  instrument?: Instrument;
  onBackToRegistry: () => void;
  onProceedToTest: (inst: Instrument) => void;
}

export const DigitalTwinPage: React.FC<DigitalTwinPageProps> = ({
  instrument = DEMO_INSTRUMENTS[0],
  onBackToRegistry,
  onProceedToTest,
}) => {
  const [activeTab, setActiveTab] = useState<'config' | 'tests' | 'evidence' | 'audit'>('config');

  return (
    <div className="space-y-4">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#26384D] gap-2">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToRegistry}
            className="p-1.5 rounded-lg bg-[#101D2D] hover:bg-[#142438] text-[#9AAABD] hover:text-[#F4F7FA] border border-[#26384D] transition-colors"
            title="Back to Registry"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#19C7C8]" />
              <h1 className="text-base font-bold text-[#F4F7FA]">
                Instrument Digital Twin • {instrument.id}
              </h1>
            </div>
            <p className="text-xs text-[#9AAABD] font-mono mt-0.5">
              Real-time physical-to-digital state synchronization and structural transducer telemetry.
            </p>
          </div>
        </div>

        <button
          onClick={() => onProceedToTest(instrument)}
          className="px-4 py-2 rounded-lg bg-[#19C7C8] hover:bg-[#19C7C8]/90 text-[#07111F] text-xs font-mono font-bold transition-all shadow-md"
        >
          Initialize OIML Verification Routine →
        </button>
      </div>

      {/* Main Grid: Left = 3D Model, Right = Instrument Identity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left 3D Canvas (7 cols) */}
        <div className="lg:col-span-7">
          <DigitalTwin3D instrument={instrument} liveReadingKg={100.012} />
        </div>

        {/* Right Metrological Identity Panel (5 cols) */}
        <div className="lg:col-span-5 bg-[#0B1726] border border-[#26384D] rounded-xl p-5 shadow-xl flex flex-col justify-between space-y-4 font-mono text-xs">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#26384D]">
              <span className="text-xs font-bold text-[#19C7C8] uppercase tracking-wide">
                Metrological Identity Record
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#20C997]/15 text-[#20C997] border border-[#20C997]/30 font-bold">
                {instrument.status}
              </span>
            </div>

            <div className="mt-3 space-y-2">
              <h3 className="text-base font-bold text-[#F4F7FA] font-sans">
                {instrument.name}
              </h3>
              <div className="text-[#9AAABD] text-xs">
                Manufacturer: <strong className="text-[#F4F7FA]">{instrument.manufacturer}</strong> • Model: <strong className="text-[#F4F7FA]">{instrument.model}</strong>
              </div>
            </div>

            {/* Metrological Specifications Table */}
            <div className="mt-4 space-y-2">
              <div className="bg-[#101D2D] p-2.5 rounded border border-[#26384D] flex justify-between">
                <span className="text-[#64748B]">ACCURACY CLASS</span>
                <span className="text-[#19C7C8] font-bold">{instrument.accuracyClass}</span>
              </div>
              <div className="bg-[#101D2D] p-2.5 rounded border border-[#26384D] flex justify-between">
                <span className="text-[#64748B]">CAPACITY (MAX / MIN)</span>
                <span className="text-[#F4F7FA] font-bold">{instrument.maxCapacity} {instrument.unit} / {instrument.minCapacity} {instrument.unit}</span>
              </div>
              <div className="bg-[#101D2D] p-2.5 rounded border border-[#26384D] flex justify-between">
                <span className="text-[#64748B]">SCALE INTERVALS (e / d)</span>
                <span className="text-[#F4F7FA] font-bold">{instrument.verificationInterval_e} {instrument.unit} / {instrument.actualInterval_d} {instrument.unit}</span>
              </div>
              <div className="bg-[#101D2D] p-2.5 rounded border border-[#26384D] flex justify-between">
                <span className="text-[#64748B]">LOAD RECEPTOR</span>
                <span className="text-[#F4F7FA] truncate max-w-[200px]" title={instrument.loadReceptorType}>
                  {instrument.loadReceptorType}
                </span>
              </div>
              <div className="bg-[#101D2D] p-2.5 rounded border border-[#26384D] flex justify-between">
                <span className="text-[#64748B]">COMMUNICATION PORT</span>
                <span className="text-[#5B8CFF] font-bold">{instrument.communicationPort}</span>
              </div>
            </div>
          </div>

          <div className="p-2.5 bg-[#07111F] rounded border border-[#26384D] space-y-1">
            <span className="text-[10px] text-[#64748B] block uppercase">Immutable Configuration Hash</span>
            <div className="text-[10px] text-[#19C7C8] break-all">
              {instrument.configurationHash}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Historical Tabs (Configuration, Tests, Evidence, Audit) */}
      <div className="bg-[#0B1726] border border-[#26384D] rounded-xl overflow-hidden shadow-xl">
        {/* Tabs Bar */}
        <div className="flex border-b border-[#26384D] bg-[#101D2D]/60 font-mono text-xs">
          <button
            onClick={() => setActiveTab('config')}
            className={`px-4 py-2.5 transition-colors ${
              activeTab === 'config'
                ? 'border-b-2 border-[#19C7C8] text-[#19C7C8] font-bold bg-[#142438]'
                : 'text-[#9AAABD] hover:text-[#F4F7FA]'
            }`}
          >
            Configuration History
          </button>
          <button
            onClick={() => setActiveTab('tests')}
            className={`px-4 py-2.5 transition-colors ${
              activeTab === 'tests'
                ? 'border-b-2 border-[#19C7C8] text-[#19C7C8] font-bold bg-[#142438]'
                : 'text-[#9AAABD] hover:text-[#F4F7FA]'
            }`}
          >
            Verification Tests (4)
          </button>
          <button
            onClick={() => setActiveTab('evidence')}
            className={`px-4 py-2.5 transition-colors ${
              activeTab === 'evidence'
                ? 'border-b-2 border-[#19C7C8] text-[#19C7C8] font-bold bg-[#142438]'
                : 'text-[#9AAABD] hover:text-[#F4F7FA]'
            }`}
          >
            Evidence Passport (4)
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-4 py-2.5 transition-colors ${
              activeTab === 'audit'
                ? 'border-b-2 border-[#19C7C8] text-[#19C7C8] font-bold bg-[#142438]'
                : 'text-[#9AAABD] hover:text-[#F4F7FA]'
            }`}
          >
            Audit Trail
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-4 text-xs font-mono text-[#F4F7FA]">
          {activeTab === 'config' && (
            <div className="space-y-2">
              <div className="text-[#9AAABD]">Configuration locked under Pattern Approval EC-D09-0012.</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                <div className="bg-[#101D2D] p-3 rounded border border-[#26384D]">
                  <span className="text-[#64748B] text-[10px] block">LAST FACTORY CALIBRATION</span>
                  <div className="font-bold text-[#F4F7FA] mt-0.5">2025-09-14 (Sartorius Service Center)</div>
                </div>
                <div className="bg-[#101D2D] p-3 rounded border border-[#26384D]">
                  <span className="text-[#64748B] text-[10px] block">GRAVITY CORRECTION FACTOR (g)</span>
                  <div className="font-bold text-[#F4F7FA] mt-0.5">9.79184 m/s² (New Delhi Lat/Alt)</div>
                </div>
                <div className="bg-[#101D2D] p-3 rounded border border-[#26384D]">
                  <span className="text-[#64748B] text-[10px] block">FIRMWARE VERSION</span>
                  <div className="font-bold text-[#19C7C8] mt-0.5">v2.10-OIML-SECURE</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tests' && (
            <div className="space-y-1.5">
              {DEMO_MEASUREMENTS.map((m) => (
                <div key={m.id} className="p-2.5 rounded bg-[#101D2D] border border-[#26384D] flex justify-between items-center">
                  <div>
                    <span className="font-bold text-[#19C7C8] mr-2">{m.id}</span>
                    <span>{m.testType}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[#9AAABD]">{m.referenceLoad} kg</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] ${
                      m.validationState === 'VERIFIED' ? 'bg-[#20C997]/20 text-[#20C997]' : 'bg-[#F4B740]/20 text-[#F4B740]'
                    }`}>
                      {m.validationState}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'evidence' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {DEMO_EVIDENCE.map((e) => (
                <div key={e.id} className="p-3 rounded bg-[#101D2D] border border-[#26384D] space-y-1">
                  <div className="font-bold text-[#F4F7FA] truncate">{e.title}</div>
                  <div className="text-[10px] text-[#64748B] flex justify-between">
                    <span>{e.id}</span>
                    <span>{e.fileSize}</span>
                  </div>
                  <div className="text-[9px] text-[#19C7C8] truncate">Hash: {e.hash}</div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="space-y-1.5">
              {DEMO_AUDIT_TRAIL.slice(0, 4).map((a) => (
                <div key={a.id} className="p-2 rounded bg-[#101D2D] border border-[#26384D] flex justify-between text-[11px]">
                  <span>{a.timestamp.split('T')[1].replace('Z', '')} • <strong className="text-[#19C7C8]">{a.action}</strong> by {a.user}</span>
                  <span className="text-[#64748B] truncate max-w-xs">{a.details}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
