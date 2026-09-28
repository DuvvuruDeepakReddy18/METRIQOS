import React, { useState, useEffect, useRef } from 'react';
import { 
  Scale, Cpu, ShieldCheck, Play, Pause, AlertTriangle, CheckCircle2, 
  RotateCcw, RefreshCw, Camera, Upload, Lock, FileText, ChevronRight, 
  Binary, Hash, Terminal, AlertCircle, UserCheck, ShieldAlert 
} from 'lucide-react';
import { Instrument, MeasurementEvent, ReferenceEquipment, EnvironmentContext, ComplianceState, AcquisitionSource } from '../../types/metrology';
import { runDualEngineVerification, calculateMPE } from '../../core/ruleEngine';
import { generateMeasurementHash, buildProofObject } from '../../core/integrity';
import { AutoPortSimulator, SerialPacket } from '../../core/autoPortSimulator';
import { DEMO_MEASUREMENTS, DEMO_REFERENCE_EQUIPMENT, DEMO_ENVIRONMENT, DEMO_EVIDENCE } from '../../data/initialData';

interface TestingWorkbenchProps {
  instrument: Instrument;
  onOpenReplay?: (mevId: string) => void;
  onOpenReport?: () => void;
}

export const TestingWorkbench: React.FC<TestingWorkbenchProps> = ({
  instrument,
  onOpenReplay,
  onOpenReport,
}) => {
  // Active test steps
  const TEST_STEPS = [
    { step: 1, name: 'Step 1: Min Capacity', load: 1.0, oimlClause: 'A.4.4.1 (Ascending)' },
    { step: 2, name: 'Step 2: 25% Max Load', load: 37.5, oimlClause: 'A.4.4.1 (Ascending)' },
    { step: 3, name: 'Step 3: 50% Max Load', load: 75.0, oimlClause: 'A.4.4.1 (Ascending)' },
    { step: 4, name: 'Step 4: 67% Max Load', load: 100.0, oimlClause: 'A.4.4.1 (Ascending)' },
    { step: 5, name: 'Step 5: 100% Max Load', load: 150.0, oimlClause: 'A.4.4.1 (Ascending)' },
    { step: 6, name: 'Step 6: Eccentricity Pos 1', load: 50.0, oimlClause: 'A.4.7 (Center)' },
    { step: 7, name: 'Step 7: Repeatability Run 1', load: 75.0, oimlClause: 'A.4.10 (50% Max)' },
  ];

  const [activeStepIndex, setActiveStepIndex] = useState(3); // Step 4 (100 kg)
  const currentStep = TEST_STEPS[activeStepIndex];

  // Equipment & Environment
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string>('STD-WEIGHT-M1-042');
  const [envContext, setEnvContext] = useState<EnvironmentContext>(DEMO_ENVIRONMENT);

  // AutoPort Hardware Simulator
  const autoPortRef = useRef<AutoPortSimulator>(new AutoPortSimulator('COM3 (RS-232 FTDI)', 9600));
  const [autoPortConnected, setAutoPortConnected] = useState(false);
  const [recentPackets, setRecentPackets] = useState<SerialPacket[]>([]);
  const [liveIndicatedKg, setLiveIndicatedKg] = useState<number>(100.012);
  const [isStable, setIsStable] = useState<boolean>(true);
  const [isDeliberateOutTolerance, setIsDeliberateOutTolerance] = useState(false);

  // Measurement Mode (AutoPort vs Manual)
  const [isManualMode, setIsManualMode] = useState(false);
  const [manualInputKg, setManualInputKg] = useState<string>('100.012');
  const [manualReason, setManualReason] = useState<string>('');

  // Readiness Gate Modal & State
  const [showReadinessGate, setShowReadinessGate] = useState(false);
  const [readinessForceBlocked, setReadinessForceBlocked] = useState(false);

  // Override Modal
  const [showOverrideModal, setShowOverrideModal] = useState(false);
  const [overrideReason, setOverrideReason] = useState('');
  const [overrideDecision, setOverrideDecision] = useState<ComplianceState>('VERIFIED');

  // Captured Measurements in this session
  const [measurements, setMeasurements] = useState<MeasurementEvent[]>(DEMO_MEASUREMENTS);
  const [selectedMev, setSelectedMev] = useState<MeasurementEvent>(DEMO_MEASUREMENTS[0]);

  // Active Reference Equipment selected
  const activeEquipment = DEMO_REFERENCE_EQUIPMENT.find((e) => e.id === selectedEquipmentId) || DEMO_REFERENCE_EQUIPMENT[0];
  const isEquipmentExpired = activeEquipment.calibrationStatus === 'EXPIRED';

  // Wire AutoPort listeners
  useEffect(() => {
    const simulator = autoPortRef.current;
    simulator.setNominalLoad(currentStep.load, isDeliberateOutTolerance);

    const unsubPacket = simulator.onPacket((packet) => {
      setLiveIndicatedKg(packet.weight);
      setIsStable(packet.isStable);
      setRecentPackets((prev) => [packet, ...prev.slice(0, 14)]);
    });

    const unsubState = simulator.onStateChange((state) => {
      setAutoPortConnected(state === 'STREAMING' || state === 'CONNECTED');
    });

    return () => {
      unsubPacket();
      unsubState();
      simulator.disconnect();
    };
  }, [currentStep.load, isDeliberateOutTolerance]);

  // Connect / Disconnect AutoPort
  const toggleAutoPort = () => {
    if (autoPortConnected) {
      autoPortRef.current.disconnect();
    } else {
      autoPortRef.current.connect();
    }
  };

  // Determine current active reading depending on mode
  const currentIndicated = isManualMode ? parseFloat(manualInputKg) || 0 : liveIndicatedKg;

  // Run Real-Time Dual Engine Verification
  const verification = runDualEngineVerification(
    currentStep.load,
    currentIndicated,
    instrument.accuracyClass,
    instrument.verificationInterval_e,
    false
  );

  // Capture Measurement Event (Immutable Record)
  const handleCaptureMeasurement = () => {
    // Check Readiness
    if (isEquipmentExpired || readinessForceBlocked) {
      setShowReadinessGate(true);
      return;
    }

    if (isManualMode && !manualReason.trim()) {
      alert('Metrological Integrity Guardrail: Manual observations require a mandatory justification note.');
      return;
    }

    const mevId = `MEV-${String(Math.floor(100000 + Math.random() * 900000))}`;
    const timestamp = new Date().toISOString();

    const rawEvent: Omit<MeasurementEvent, 'integrityHash'> = {
      id: mevId,
      testId: 'TP-2026-0089',
      instrumentId: instrument.id,
      testType: `${currentStep.name} (${currentStep.load} kg)`,
      referenceLoad: currentStep.load,
      indicatedValue: currentIndicated,
      difference: parseFloat((currentIndicated - currentStep.load).toFixed(4)),
      mpeCriterion: verification.mpeLimitKg,
      unit: instrument.unit,
      timestamp,
      source: isManualMode ? 'MANUAL_OBSERVATION' : 'AUTOPORT_RS232',
      operatorId: 'USR-MET-088',
      operatorName: 'Banu Priya (Lead Verification Officer)',
      manualReason: isManualMode ? manualReason : undefined,
      referenceEquipmentId: activeEquipment.id,
      environmentContextId: envContext.id,
      evidenceIds: isManualMode ? [] : ['EVD-2026-00918', 'EVD-2026-00921'],
      ruleVersion: 'RULE-PACK-R76-2006-V3 (v3.2.0)',
      softwareVersion: 'METRIQOS-CORE-v2.8.4-RELEASE',
      engineAResult: verification.engineAResult,
      engineBResult: verification.engineBResult,
      dualCalculationMatch: verification.calculationMatch,
      validationState: verification.finalValidationState,
      rawSerialFrame: isManualMode ? undefined : recentPackets[0]?.rawFrame,
    };

    const integrityHash = generateMeasurementHash(rawEvent);
    const newMev: MeasurementEvent = { ...rawEvent, integrityHash };

    setMeasurements([newMev, ...measurements]);
    setSelectedMev(newMev);

    // Auto-advance step if verified
    if (newMev.validationState === 'VERIFIED' && activeStepIndex < TEST_STEPS.length - 1) {
      setTimeout(() => {
        setActiveStepIndex((prev) => prev + 1);
      }, 600);
    }
  };

  // Human Override Execution
  const handleApplyOverride = () => {
    if (!overrideReason.trim()) {
      alert('Reviewer justification note is legally required for human override.');
      return;
    }

    const updatedMev: MeasurementEvent = {
      ...selectedMev,
      humanOverride: {
        reviewerId: 'USR-REV-001',
        reviewerName: 'Dr. Arthur Vance (Chief Metrologist)',
        originalState: selectedMev.validationState,
        newState: overrideDecision,
        reason: overrideReason,
        timestamp: new Date().toISOString(),
      },
    };

    setSelectedMev(updatedMev);
    setMeasurements(measurements.map((m) => (m.id === updatedMev.id ? updatedMev : m)));
    setShowOverrideModal(false);
    setOverrideReason('');
  };

  return (
    <div className="space-y-4">
      {/* Top Telemetry & Context Bar */}
      <div className="bg-[#0B1726] border border-[#26384D] rounded-xl p-3 shadow-lg flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#142438] border border-[#26384D] flex items-center justify-center">
            <Scale className="w-5 h-5 text-[#19C7C8]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-[#F4F7FA]">{instrument.name}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#19C7C8]/10 text-[#19C7C8] border border-[#19C7C8]/30">
                {instrument.id}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#5B8CFF]/10 text-[#5B8CFF] border border-[#5B8CFF]/30">
                {instrument.accuracyClass}
              </span>
            </div>
            <div className="text-xs text-[#9AAABD] font-mono mt-0.5">
              Max: {instrument.maxCapacity} {instrument.unit} • e: {instrument.verificationInterval_e} {instrument.unit} • d: {instrument.actualInterval_d} {instrument.unit}
            </div>
          </div>
        </div>

        {/* Reference & Environment Context Pills */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          {/* Reference equipment selector */}
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${
            isEquipmentExpired
              ? 'bg-[#EF5B5B]/10 border-[#EF5B5B]/50 text-[#EF5B5B]'
              : 'bg-[#101D2D] border-[#26384D] text-[#F4F7FA]'
          }`}>
            <ShieldCheck className="w-3.5 h-3.5 text-[#19C7C8]" />
            <span>Ref Standard:</span>
            <select
              value={selectedEquipmentId}
              onChange={(e) => setSelectedEquipmentId(e.target.value)}
              className="bg-transparent text-xs font-mono text-[#F4F7FA] focus:outline-none cursor-pointer"
            >
              {DEMO_REFERENCE_EQUIPMENT.map((eq) => (
                <option key={eq.id} value={eq.id} className="bg-[#0B1726] text-[#F4F7FA]">
                  {eq.id} ({eq.calibrationStatus})
                </option>
              ))}
            </select>
          </div>

          {/* Environment context lock */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#101D2D] border border-[#26384D] text-[#19C7C8]">
            <Lock className="w-3.5 h-3.5 text-[#20C997]" />
            <span>{envContext.temperature}°C / {envContext.humidity}% RH</span>
          </div>

          {/* Readiness Gate Button */}
          <button
            onClick={() => setShowReadinessGate(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
              isEquipmentExpired || readinessForceBlocked
                ? 'bg-[#EF5B5B] text-white border-[#EF5B5B] animate-pulse'
                : 'bg-[#142438] text-[#20C997] border-[#20C997]/40 hover:bg-[#101D2D]'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            {isEquipmentExpired || readinessForceBlocked ? 'READINESS: BLOCKED' : 'READINESS: READY'}
          </button>
        </div>
      </div>

      {/* Main 3-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* LEFT COLUMN: Test Sequence Navigation (3 cols) */}
        <div className="lg:col-span-3 space-y-3">
          <div className="bg-[#0B1726] border border-[#26384D] rounded-xl p-3.5 shadow-xl">
            <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-[#26384D]">
              <span className="text-xs font-mono font-bold text-[#19C7C8] uppercase tracking-wider">
                OIML R76 Test Steps
              </span>
              <span className="text-[10px] font-mono text-[#64748B]">
                {activeStepIndex + 1}/{TEST_STEPS.length}
              </span>
            </div>

            <div className="space-y-1.5">
              {TEST_STEPS.map((step, idx) => {
                const isCurrent = idx === activeStepIndex;
                const isPast = idx < activeStepIndex;

                return (
                  <div
                    key={step.step}
                    onClick={() => {
                      setActiveStepIndex(idx);
                      autoPortRef.current.setNominalLoad(step.load, isDeliberateOutTolerance);
                    }}
                    className={`cursor-pointer p-2.5 rounded-lg border transition-all flex items-center justify-between ${
                      isCurrent
                        ? 'bg-[#142438] border-[#19C7C8] shadow-md'
                        : isPast
                        ? 'bg-[#101D2D]/60 border-[#26384D] text-[#9AAABD]'
                        : 'bg-[#101D2D]/30 border-[#26384D]/40 text-[#64748B]'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-semibold text-[#F4F7FA]">
                        {step.name}
                      </div>
                      <div className="text-[10px] font-mono text-[#64748B]">
                        Load: {step.load} {instrument.unit} • {step.oimlClause}
                      </div>
                    </div>

                    {isPast ? (
                      <CheckCircle2 className="w-4 h-4 text-[#20C997]" />
                    ) : isCurrent ? (
                      <div className="w-2 h-2 rounded-full bg-[#19C7C8] animate-ping" />
                    ) : (
                      <span className="text-[10px] font-mono text-[#64748B]">Pending</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick AutoPort Hardware Status Widget */}
          <div className="bg-[#0B1726] border border-[#26384D] rounded-xl p-3.5 shadow-xl">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#26384D]">
              <div className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-[#19C7C8]" />
                <span className="text-xs font-mono font-bold text-[#F4F7FA]">
                  AutoPort Hardware
                </span>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                autoPortConnected
                  ? 'bg-[#20C997]/10 text-[#20C997] border border-[#20C997]/30'
                  : 'bg-[#64748B]/10 text-[#64748B]'
              }`}>
                {autoPortConnected ? 'CONNECTED' : 'OFFLINE'}
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between text-[#9AAABD]">
                <span>Port / Channel:</span>
                <span className="text-[#F4F7FA]">COM3 (RS-232 FTDI)</span>
              </div>
              <div className="flex justify-between text-[#9AAABD]">
                <span>Baud Rate:</span>
                <span className="text-[#F4F7FA]">9600-8-N-1 Continuous</span>
              </div>
              <div className="flex justify-between text-[#9AAABD]">
                <span>Transducer Flag:</span>
                <span className={isStable ? 'text-[#20C997]' : 'text-[#F4B740]'}>
                  {isStable ? 'STABLE INDICATION' : 'DYNAMIC MOTION'}
                </span>
              </div>

              <button
                onClick={toggleAutoPort}
                className={`w-full mt-2 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                  autoPortConnected
                    ? 'bg-[#EF5B5B]/15 text-[#EF5B5B] border border-[#EF5B5B]/30 hover:bg-[#EF5B5B]/25'
                    : 'bg-[#19C7C8] text-[#07111F] hover:bg-[#19C7C8]/90'
                }`}
              >
                {autoPortConnected ? 'Disconnect AutoPort' : 'Connect AutoPort Indicator'}
              </button>
            </div>
          </div>
        </div>

        {/* CENTER COLUMN: Large Measurement Workspace (6 cols) */}
        <div className="lg:col-span-6 space-y-3">
          {/* Main Large Industrial Metrology Display */}
          <div className="bg-[#0B1726] border border-[#26384D] rounded-xl p-5 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#26384D]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-[#64748B] uppercase">Test Phase:</span>
                <span className="text-xs font-mono font-bold text-[#19C7C8]">
                  {currentStep.name}
                </span>
              </div>

              {/* Mode switch */}
              <div className="flex items-center gap-1 bg-[#101D2D] p-1 rounded-lg border border-[#26384D]">
                <button
                  onClick={() => setIsManualMode(false)}
                  className={`text-[10px] font-mono px-2.5 py-1 rounded transition-colors ${
                    !isManualMode
                      ? 'bg-[#19C7C8] text-[#07111F] font-bold'
                      : 'text-[#9AAABD] hover:text-[#F4F7FA]'
                  }`}
                >
                  AutoPort Direct
                </button>
                <button
                  onClick={() => setIsManualMode(true)}
                  className={`text-[10px] font-mono px-2.5 py-1 rounded transition-colors ${
                    isManualMode
                      ? 'bg-[#5B8CFF] text-[#F4F7FA] font-bold'
                      : 'text-[#9AAABD] hover:text-[#F4F7FA]'
                  }`}
                >
                  Manual Entry
                </button>
              </div>
            </div>

            {/* Huge Readout Panels Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {/* Reference Standard Load */}
              <div className="bg-[#101D2D] p-3.5 rounded-xl border border-[#26384D]">
                <span className="text-[10px] font-mono uppercase text-[#64748B] block mb-1">
                  Reference Standard Load (m)
                </span>
                <div className="text-2xl sm:text-3xl font-mono font-bold text-[#F4F7FA] tabular-nums">
                  {currentStep.load.toFixed(3)}
                </div>
                <span className="text-xs text-[#9AAABD] font-mono">
                  {instrument.unit} • {activeEquipment.id}
                </span>
              </div>

              {/* Indicated Load Readout */}
              <div className="bg-[#101D2D] p-3.5 rounded-xl border border-[#26384D] relative">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono uppercase text-[#64748B]">
                    Indicated Value (I)
                  </span>
                  <span className={`w-2 h-2 rounded-full ${isStable ? 'bg-[#20C997]' : 'bg-[#F4B740] animate-ping'}`} />
                </div>

                {isManualMode ? (
                  <input
                    type="number"
                    step="0.001"
                    value={manualInputKg}
                    onChange={(e) => setManualInputKg(e.target.value)}
                    className="w-full bg-[#07111F] border border-[#26384D] rounded px-2 py-1 text-2xl font-mono font-bold text-[#20C997] focus:outline-none focus:border-[#19C7C8]"
                  />
                ) : (
                  <div className="text-2xl sm:text-3xl font-mono font-bold text-[#20C997] tabular-nums">
                    {currentIndicated.toFixed(3)}
                  </div>
                )}
                <span className="text-xs text-[#9AAABD] font-mono">
                  {instrument.unit} • {isManualMode ? 'MANUAL INPUT' : 'AUTOPORT RX'}
                </span>
              </div>
            </div>

            {/* Manual justification input if manual mode is enabled */}
            {isManualMode && (
              <div className="mb-4 bg-[#142438] p-3 rounded-lg border border-[#F4B740]/40">
                <div className="flex items-center gap-1.5 text-xs font-mono text-[#F4B740] mb-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Mandatory Manual Observation Justification</span>
                </div>
                <input
                  type="text"
                  placeholder="e.g. Optical camera lens obstructed by temporary crane hoist rigging..."
                  value={manualReason}
                  onChange={(e) => setManualReason(e.target.value)}
                  className="w-full bg-[#07111F] border border-[#26384D] rounded px-3 py-1.5 text-xs text-[#F4F7FA] font-mono focus:outline-none focus:border-[#F4B740]"
                />
              </div>
            )}

            {/* Error Calculation & Compliance Bar */}
            <div className="bg-[#142438] p-4 rounded-xl border border-[#26384D] space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono text-[#64748B] uppercase block">
                    Observed Error (E = I - m)
                  </span>
                  <div className="text-lg font-mono font-bold text-[#F4F7FA]">
                    {verification.errorKg > 0 ? '+' : ''}{verification.errorKg.toFixed(4)} {instrument.unit}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-mono text-[#64748B] uppercase block">
                    Permissible Error Boundary
                  </span>
                  <div className="text-lg font-mono font-bold text-[#19C7C8]">
                    ± {verification.mpeLimitKg.toFixed(4)} {instrument.unit}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-mono text-[#64748B] uppercase block">
                    Metrological Status
                  </span>
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-md text-xs font-mono font-bold border ${
                    verification.finalValidationState === 'VERIFIED'
                      ? 'bg-[#20C997]/15 text-[#20C997] border-[#20C997]/40'
                      : verification.finalValidationState === 'REVIEW_REQUIRED'
                      ? 'bg-[#F4B740]/15 text-[#F4B740] border-[#F4B740]/40'
                      : 'bg-[#EF5B5B]/15 text-[#EF5B5B] border-[#EF5B5B]/40'
                  }`}>
                    {verification.finalValidationState === 'VERIFIED' && <CheckCircle2 className="w-3.5 h-3.5" />}
                    {verification.finalValidationState === 'REVIEW_REQUIRED' && <AlertTriangle className="w-3.5 h-3.5" />}
                    {verification.finalValidationState}
                  </span>
                </div>
              </div>

              {/* Dual Engine Side-by-Side Verification Banner */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#26384D] text-[11px] font-mono">
                <div className="bg-[#101D2D] p-2 rounded border border-[#26384D]">
                  <span className="text-[#64748B] block text-[9px] uppercase">Engine A (Primary Boundary)</span>
                  <span className="text-[#20C997] font-semibold">{verification.engineAResult}</span>
                </div>
                <div className="bg-[#101D2D] p-2 rounded border border-[#26384D]">
                  <span className="text-[#64748B] block text-[9px] uppercase">Engine B (Independent Integer)</span>
                  <span className="text-[#20C997] font-semibold">{verification.engineBResult}</span>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
              {/* Controlled Failure Demo Injection Toggle */}
              <button
                onClick={() => {
                  const nextVal = !isDeliberateOutTolerance;
                  setIsDeliberateOutTolerance(nextVal);
                  autoPortRef.current.setNominalLoad(currentStep.load, nextVal);
                }}
                className={`text-xs font-mono px-3 py-2 rounded-lg border transition-colors ${
                  isDeliberateOutTolerance
                    ? 'bg-[#EF5B5B]/20 text-[#EF5B5B] border-[#EF5B5B]'
                    : 'bg-[#101D2D] text-[#9AAABD] border-[#26384D] hover:text-[#F4F7FA]'
                }`}
                title="Inject an artificial physical load cell deviation to demonstrate the Controlled Failure & Human Override workflow"
              >
                {isDeliberateOutTolerance ? '⚠ Deviation Injected (Active)' : 'Inject Controlled Deviation (Demo)'}
              </button>

              {/* Main Capture Button */}
              <button
                onClick={handleCaptureMeasurement}
                className="py-2.5 px-6 rounded-lg bg-[#19C7C8] hover:bg-[#19C7C8]/90 text-[#07111F] text-xs font-mono font-bold tracking-wide transition-all shadow-lg shadow-[#19C7C8]/20 flex items-center gap-2"
              >
                <Hash className="w-4 h-4" />
                Capture Measurement Event
              </button>
            </div>
          </div>

          {/* Live AutoPort Raw UART Frame Terminal */}
          <div className="bg-[#07111F] border border-[#26384D] rounded-xl p-3 shadow-xl">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#26384D]">
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-[#19C7C8]" />
                <span className="text-xs font-mono text-[#19C7C8] font-bold">
                  AutoPort Hardware UART Stream (Raw ASCII Frames)
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#64748B]">
                Port: COM3 FTDI • 9600 Baud
              </span>
            </div>

            <div className="font-mono text-[11px] text-[#20C997] space-y-0.5 max-h-24 overflow-y-auto bg-[#040910] p-2.5 rounded border border-[#26384D]/50">
              {recentPackets.length > 0 ? (
                recentPackets.map((pkt, i) => (
                  <div key={i} className="flex justify-between hover:bg-[#101D2D]/50 px-1 py-0.5 rounded">
                    <span>{pkt.rawFrame.replace('\r\n', '')}</span>
                    <span className="text-[#64748B] text-[10px]">{pkt.timestamp.split('T')[1].replace('Z', '')}</span>
                  </div>
                ))
              ) : (
                <div className="text-[#64748B] italic">
                  AutoPort daemon waiting for hardware connection. Click "Connect AutoPort Indicator" above to start live stream.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Evidence Passport & Event Inspector (3 cols) */}
        <div className="lg:col-span-3 space-y-3">
          {/* Active Measurement Event Inspector */}
          <div className="bg-[#0B1726] border border-[#26384D] rounded-xl p-3.5 shadow-xl">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#26384D]">
              <span className="text-xs font-mono font-bold text-[#19C7C8] uppercase tracking-wide">
                Active Event Passport
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#101D2D] text-[#5B8CFF] border border-[#26384D]">
                {selectedMev.id}
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="bg-[#101D2D] p-2 rounded border border-[#26384D]">
                <span className="text-[9px] text-[#64748B] block uppercase">Acquisition Source</span>
                <span className="text-[#F4F7FA] font-semibold">{selectedMev.source}</span>
              </div>

              <div className="bg-[#101D2D] p-2 rounded border border-[#26384D]">
                <span className="text-[9px] text-[#64748B] block uppercase">Observed Error / MPE</span>
                <span className="text-[#F4F7FA]">
                  {selectedMev.difference > 0 ? '+' : ''}{selectedMev.difference} kg / ±{selectedMev.mpeCriterion} kg
                </span>
              </div>

              <div className="bg-[#101D2D] p-2 rounded border border-[#26384D]">
                <span className="text-[9px] text-[#64748B] block uppercase">SHA-256 Ledger Hash</span>
                <span className="text-[#19C7C8] break-all text-[10px] block mt-0.5">
                  {selectedMev.integrityHash}
                </span>
              </div>

              {/* Controlled Human Override Button if review required */}
              {selectedMev.validationState === 'REVIEW_REQUIRED' && !selectedMev.humanOverride && (
                <button
                  onClick={() => setShowOverrideModal(true)}
                  className="w-full py-2 px-3 rounded-lg bg-[#F4B740]/15 hover:bg-[#F4B740]/25 text-[#F4B740] font-bold border border-[#F4B740]/40 transition-colors flex items-center justify-center gap-1.5"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  Reviewer Controlled Override
                </button>
              )}

              {selectedMev.humanOverride && (
                <div className="bg-[#142438] p-2.5 rounded-lg border border-[#20C997]/40">
                  <div className="flex items-center gap-1 text-[#20C997] text-[10px] font-bold mb-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>HUMAN OVERRIDE RECORDED</span>
                  </div>
                  <div className="text-[10px] text-[#9AAABD]">
                    Signer: {selectedMev.humanOverride.reviewerName}
                  </div>
                  <div className="text-[10px] text-[#F4F7FA] italic mt-0.5">
                    "{selectedMev.humanOverride.reason}"
                  </div>
                </div>
              )}

              {/* Link to Full Replay */}
              <button
                onClick={() => onOpenReplay && onOpenReplay(selectedMev.id)}
                className="w-full py-1.5 rounded-lg bg-[#142438] hover:bg-[#101D2D] text-[#19C7C8] text-xs font-mono border border-[#26384D] transition-colors flex items-center justify-center gap-1.5"
              >
                <RefreshCw className="w-3 h-3" />
                Open Event Replay
              </button>
            </div>
          </div>

          {/* Evidence Documents Widget */}
          <div className="bg-[#0B1726] border border-[#26384D] rounded-xl p-3.5 shadow-xl">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#26384D]">
              <span className="text-xs font-mono font-bold text-[#F4F7FA]">
                Evidence Passport
              </span>
              <button
                onClick={() => alert('Simulated Optical Rig Snapshot captured: Saved as EVD-2026-00922')}
                className="text-[10px] font-mono text-[#19C7C8] hover:underline flex items-center gap-1"
              >
                <Camera className="w-3 h-3" />
                Snapshot Rig
              </button>
            </div>

            <div className="space-y-1.5">
              {DEMO_EVIDENCE.map((ev) => (
                <div
                  key={ev.id}
                  className="bg-[#101D2D] p-2 rounded-lg border border-[#26384D] text-xs font-mono"
                >
                  <div className="text-[#F4F7FA] font-semibold truncate">{ev.title}</div>
                  <div className="flex justify-between text-[#64748B] text-[10px] mt-0.5">
                    <span>{ev.id}</span>
                    <span>{ev.fileSize}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* READINESS GATE MODAL */}
      {showReadinessGate && (
        <div className="fixed inset-0 z-50 bg-[#07111F]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0B1726] border border-[#26384D] rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#26384D]">
              <div className="flex items-center gap-2 text-[#EF5B5B]">
                <ShieldAlert className="w-5 h-5" />
                <h3 className="text-base font-bold">Test Readiness Gate Intercept</h3>
              </div>
              <button
                onClick={() => setShowReadinessGate(false)}
                className="text-[#9AAABD] hover:text-[#F4F7FA] text-xs font-mono"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="p-3 rounded-lg bg-[#EF5B5B]/15 border border-[#EF5B5B]/30 text-[#F4F7FA]">
                <strong className="text-[#EF5B5B] block mb-1">MANDATORY PRE-TEST VALIDATION BLOCKED</strong>
                The selected reference standard <strong className="text-[#19C7C8]">{activeEquipment.id}</strong> has a calibration certificate status of <span className="text-[#EF5B5B] font-bold">{activeEquipment.calibrationStatus}</span>. Under OIML R76, testing with uncertified standards is strictly prohibited.
              </div>

              <div className="space-y-1.5 pt-2">
                <div className="flex items-center justify-between p-2 rounded bg-[#101D2D]">
                  <span>Instrument Identity Confirmed</span>
                  <CheckCircle2 className="w-4 h-4 text-[#20C997]" />
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-[#101D2D]">
                  <span>Configuration Hash Locked</span>
                  <CheckCircle2 className="w-4 h-4 text-[#20C997]" />
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-[#101D2D]">
                  <span>Ambient Environment Compliant (20.4°C)</span>
                  <CheckCircle2 className="w-4 h-4 text-[#20C997]" />
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-[#101D2D]">
                  <span>Reference Equipment Validity</span>
                  <span className="text-[#EF5B5B] font-bold">BLOCKED (EXPIRED)</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#26384D]">
              <button
                onClick={() => {
                  setSelectedEquipmentId('STD-WEIGHT-M1-042');
                  setReadinessForceBlocked(false);
                  setShowReadinessGate(false);
                }}
                className="px-4 py-2 rounded-lg bg-[#20C997] text-[#07111F] text-xs font-mono font-bold hover:bg-[#20C997]/90"
              >
                Resolve: Swap to Valid Weight Standard (STD-WEIGHT-M1-042)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONTROLLED HUMAN OVERRIDE MODAL */}
      {showOverrideModal && (
        <div className="fixed inset-0 z-50 bg-[#07111F]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0B1726] border border-[#26384D] rounded-xl max-w-md w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#26384D]">
              <div className="flex items-center gap-2 text-[#F4B740]">
                <UserCheck className="w-5 h-5" />
                <h3 className="text-sm font-bold">Controlled Reviewer Override</h3>
              </div>
              <button onClick={() => setShowOverrideModal(false)} className="text-[#9AAABD] text-xs font-mono">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="bg-[#101D2D] p-2.5 rounded border border-[#26384D]">
                <span className="text-[#64748B] block text-[10px]">Target Measurement</span>
                <span className="text-[#F4F7FA] font-bold">{selectedMev.id} ({selectedMev.testType})</span>
              </div>

              <div>
                <label className="text-[#9AAABD] block mb-1">New Reviewer Decision</label>
                <select
                  value={overrideDecision}
                  onChange={(e) => setOverrideDecision(e.target.value as ComplianceState)}
                  className="w-full bg-[#101D2D] border border-[#26384D] rounded p-2 text-xs text-[#F4F7FA] font-mono"
                >
                  <option value="VERIFIED">VERIFIED (Conditional Authorization)</option>
                  <option value="NON_COMPLIANT">NON_COMPLIANT (Confirm Rejection)</option>
                </select>
              </div>

              <div>
                <label className="text-[#9AAABD] block mb-1">Mandatory Regulatory Justification</label>
                <textarea
                  rows={3}
                  placeholder="State technical basis, expanded uncertainty evaluation, or remedial mechanical adjustment..."
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  className="w-full bg-[#07111F] border border-[#26384D] rounded p-2 text-xs text-[#F4F7FA] font-mono focus:border-[#F4B740] focus:outline-none"
                />
              </div>

              <div className="text-[10px] text-[#64748B]">
                Note: Original system decision will remain permanently recorded in the immutable audit ledger alongside this override.
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#26384D]">
              <button
                onClick={() => setShowOverrideModal(false)}
                className="px-3 py-1.5 rounded-lg bg-[#142438] text-[#9AAABD] text-xs font-mono"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyOverride}
                className="px-4 py-1.5 rounded-lg bg-[#F4B740] text-[#07111F] text-xs font-mono font-bold hover:bg-[#F4B740]/90"
              >
                Sign & Authorize Override
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
