import React, { useRef } from 'react';
import { 
  Printer, Download, ShieldCheck, QrCode, ExternalLink, 
  CheckCircle2, FileText, Lock 
} from 'lucide-react';
import { Instrument, Report, MeasurementEvent } from '../../types/metrology';
import { DEMO_REPORT, DEMO_INSTRUMENTS, DEMO_MEASUREMENTS, DEMO_REFERENCE_EQUIPMENT, DEMO_ENVIRONMENT } from '../../data/initialData';

interface ReportViewerProps {
  report?: Report;
  instrument?: Instrument;
  onOpenVerify?: (reportId: string) => void;
}

export const ReportViewer: React.FC<ReportViewerProps> = ({
  report = DEMO_REPORT,
  instrument = DEMO_INSTRUMENTS[0],
  onOpenVerify,
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      {/* Top Action Bar (Dark Metrology UI) */}
      <div className="bg-[#0B1726] border border-[#26384D] rounded-xl p-3 shadow-lg flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#19C7C8]" />
            <h2 className="text-sm font-bold text-[#F4F7FA]">
              Legal Metrology Verification Report • {report.id}
            </h2>
          </div>
          <span className="text-xs text-[#9AAABD] font-mono">
            Cryptographically sealed per OIML R76-1:2006 Standard
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenVerify && onOpenVerify(report.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#142438] text-[#19C7C8] border border-[#26384D] hover:bg-[#101D2D] text-xs font-mono transition-colors"
          >
            <QrCode className="w-3.5 h-3.5" />
            Verify QR Integrity
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#19C7C8] text-[#07111F] text-xs font-mono font-bold hover:bg-[#19C7C8]/90 transition-colors shadow-md"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Technical Certificate
          </button>
        </div>
      </div>

      {/* RESTRAINED WHITE TECHNICAL DOCUMENT CONTAINER */}
      <div className="flex justify-center p-2 sm:p-6 bg-[#040910] rounded-xl border border-[#26384D] overflow-x-auto">
        <div
          ref={printRef}
          className="w-full max-w-4xl bg-white text-gray-900 p-8 sm:p-12 shadow-2xl rounded-sm font-sans text-xs leading-normal border border-gray-300 print:shadow-none print:border-none print:p-0"
        >
          {/* Section 1: Report Identity & Header */}
          <div className="border-b-2 border-gray-900 pb-4 mb-6 flex justify-between items-start">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-gray-500 font-mono">
                METRIQOS DIGITAL METROLOGY OPERATING SYSTEM
              </div>
              <h1 className="text-xl font-bold uppercase text-gray-900 mt-1 font-mono tracking-tight">
                CERTIFICATE OF VERIFICATION FOR NON-AUTOMATIC WEIGHING INSTRUMENT
              </h1>
              <div className="text-xs text-gray-700 font-serif mt-1">
                Conforming to OIML R76-1:2006 and National Legal Metrology Regulations
              </div>
              <div className="text-[11px] text-gray-600 mt-0.5">
                Testing Laboratory: {report.laboratoryName} • {report.laboratoryLocation}
              </div>
            </div>

            {/* QR Code and Report ID Block */}
            <div className="text-right shrink-0 ml-4 flex flex-col items-end">
              {/* Simulated QR Code SVG */}
              <div
                onClick={() => onOpenVerify && onOpenVerify(report.id)}
                className="w-20 h-20 border border-gray-400 p-1 cursor-pointer bg-white hover:border-gray-900"
                title="Click to open digital verification page"
              >
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <rect x="0" y="0" width="30" height="30" fill="#111" />
                  <rect x="5" y="5" width="20" height="20" fill="#fff" />
                  <rect x="10" y="10" width="10" height="10" fill="#111" />

                  <rect x="70" y="0" width="30" height="30" fill="#111" />
                  <rect x="75" y="5" width="20" height="20" fill="#fff" />
                  <rect x="80" y="10" width="10" height="10" fill="#111" />

                  <rect x="0" y="70" width="30" height="30" fill="#111" />
                  <rect x="5" y="75" width="20" height="20" fill="#fff" />
                  <rect x="10" y="80" width="10" height="10" fill="#111" />

                  {/* Random QR data matrix modules */}
                  <rect x="40" y="10" width="10" height="10" fill="#111" />
                  <rect x="50" y="20" width="10" height="10" fill="#111" />
                  <rect x="40" y="40" width="20" height="10" fill="#111" />
                  <rect x="70" y="40" width="10" height="20" fill="#111" />
                  <rect x="20" y="45" width="15" height="15" fill="#111" />
                  <rect x="45" y="70" width="15" height="10" fill="#111" />
                  <rect x="75" y="75" width="15" height="15" fill="#111" />
                </svg>
              </div>
              <span className="text-[10px] font-mono text-gray-500 mt-1">
                Scan / Click to Verify
              </span>
              <span className="text-xs font-mono font-bold text-gray-900 mt-0.5">
                {report.id}
              </span>
            </div>
          </div>

          {/* Section 2: Instrument Identification */}
          <div className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-wider bg-gray-100 p-1.5 border-l-4 border-gray-900 mb-2 font-mono">
              1. Instrument Identification
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
              <div className="p-2 border border-gray-200">
                <span className="text-gray-500 block text-[9px]">INSTRUMENT ID</span>
                <span className="font-bold text-gray-900">{instrument.id}</span>
              </div>
              <div className="p-2 border border-gray-200">
                <span className="text-gray-500 block text-[9px]">MANUFACTURER</span>
                <span className="font-bold text-gray-900">{instrument.manufacturer}</span>
              </div>
              <div className="p-2 border border-gray-200">
                <span className="text-gray-500 block text-[9px]">MODEL / TYPE</span>
                <span className="font-bold text-gray-900">{instrument.model}</span>
              </div>
              <div className="p-2 border border-gray-200">
                <span className="text-gray-500 block text-[9px]">SERIAL NUMBER</span>
                <span className="font-bold text-gray-900">{instrument.serialNumber}</span>
              </div>
              <div className="p-2 border border-gray-200">
                <span className="text-gray-500 block text-[9px]">ACCURACY CLASS</span>
                <span className="font-bold text-gray-900">{instrument.accuracyClass}</span>
              </div>
              <div className="p-2 border border-gray-200">
                <span className="text-gray-500 block text-[9px]">MAX CAPACITY (Max)</span>
                <span className="font-bold text-gray-900">{instrument.maxCapacity} {instrument.unit}</span>
              </div>
              <div className="p-2 border border-gray-200">
                <span className="text-gray-500 block text-[9px]">MIN CAPACITY (Min)</span>
                <span className="font-bold text-gray-900">{instrument.minCapacity} {instrument.unit}</span>
              </div>
              <div className="p-2 border border-gray-200">
                <span className="text-gray-500 block text-[9px]">SCALE INTERVAL (e / d)</span>
                <span className="font-bold text-gray-900">{instrument.verificationInterval_e} / {instrument.actualInterval_d} {instrument.unit}</span>
              </div>
            </div>
          </div>

          {/* Section 3 & 4: Environmental Conditions & Reference Standards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider bg-gray-100 p-1.5 border-l-4 border-gray-900 mb-2 font-mono">
                2. Environmental Conditions
              </h2>
              <div className="border border-gray-200 p-2.5 space-y-1 text-[11px] font-mono">
                <div className="flex justify-between">
                  <span className="text-gray-600">Ambient Temperature:</span>
                  <span className="font-bold">{DEMO_ENVIRONMENT.temperature} °C (Permissible: 20 ± 2°C)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Relative Humidity:</span>
                  <span className="font-bold">{DEMO_ENVIRONMENT.humidity} % RH</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Barometric Pressure:</span>
                  <span className="font-bold">{DEMO_ENVIRONMENT.pressure} hPa</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Context Lock Status:</span>
                  <span className="font-bold text-green-700">LOCKED (ENV-2026-0928-01)</span>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider bg-gray-100 p-1.5 border-l-4 border-gray-900 mb-2 font-mono">
                3. Reference Working Standards
              </h2>
              <div className="border border-gray-200 p-2.5 space-y-1 text-[11px] font-mono">
                <div className="flex justify-between">
                  <span className="text-gray-600">Standard Mass Set:</span>
                  <span className="font-bold">{DEMO_REFERENCE_EQUIPMENT[0].id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Accuracy Class:</span>
                  <span className="font-bold">{DEMO_REFERENCE_EQUIPMENT[0].type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Calibration Certificate:</span>
                  <span className="font-bold">{DEMO_REFERENCE_EQUIPMENT[0].certificateNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Traceability:</span>
                  <span className="font-bold text-green-700">National Physical Laboratory (VALID)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: Individual Tests & Results */}
          <div className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-wider bg-gray-100 p-1.5 border-l-4 border-gray-900 mb-2 font-mono">
              4. Verification Test Results (OIML R76-1:2006 Clause A.4)
            </h2>
            <table className="w-full text-left border border-gray-300 font-mono text-[11px]">
              <thead className="bg-gray-100 border-b border-gray-300 text-gray-700 text-[10px] uppercase">
                <tr>
                  <th className="p-2">Event ID</th>
                  <th className="p-2">Applied Load (m)</th>
                  <th className="p-2">Indication (I)</th>
                  <th className="p-2">Observed Error (E)</th>
                  <th className="p-2">MPE Limit</th>
                  <th className="p-2">Dual Verification</th>
                  <th className="p-2">Compliance Decision</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {DEMO_MEASUREMENTS.map((m) => (
                  <tr key={m.id}>
                    <td className="p-2 font-bold text-gray-900">{m.id}</td>
                    <td className="p-2">{m.referenceLoad.toFixed(3)} {m.unit}</td>
                    <td className="p-2">{m.indicatedValue.toFixed(3)} {m.unit}</td>
                    <td className="p-2">{m.difference > 0 ? '+' : ''}{m.difference.toFixed(3)} {m.unit}</td>
                    <td className="p-2">±{m.mpeCriterion.toFixed(3)} {m.unit}</td>
                    <td className="p-2 text-green-700 font-semibold">CONVERGED</td>
                    <td className="p-2 font-bold">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                        m.validationState === 'VERIFIED'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {m.validationState}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Section 6: Reviewer Sign-off & Integrity Signature */}
          <div className="border-t-2 border-gray-900 pt-4 mt-8 flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <div className="text-[10px] font-mono text-gray-500 uppercase">
                LEGAL METROLOGY DECISION
              </div>
              <div className="text-base font-bold font-mono text-green-800 mt-0.5">
                OVERALL STATUS: COMPLIANT / VERIFIED
              </div>
              <div className="text-[11px] text-gray-600 mt-1 max-w-md">
                Instrument conforms to all requirements of OIML R76-1:2006 for initial statutory verification. Calibration mark applied.
              </div>
              <div className="text-[10px] font-mono text-gray-500 mt-2">
                Evaluated under rule package: <strong className="text-gray-900">{report.testedUnderRulePackage}</strong>
              </div>
            </div>

            <div className="text-right sm:border-l sm:border-gray-200 sm:pl-6">
              <div className="text-[10px] font-mono text-gray-500 uppercase">
                DIGITALLY SEALED BY
              </div>
              <div className="font-serif italic font-bold text-sm text-gray-900 mt-1">
                {report.sealedBy}
              </div>
              <div className="text-[11px] text-gray-600">Director of Legal Verification</div>
              <div className="text-[10px] font-mono text-gray-400 mt-1">
                Date: {new Date(report.issueDate).toLocaleDateString()} • Hash: {report.documentHash.slice(0, 20)}...
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
