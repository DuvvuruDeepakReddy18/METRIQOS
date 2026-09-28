import React, { useState } from 'react';
import { Camera, Sparkles, CheckCircle2, ShieldCheck, AlertCircle, Upload, Check } from 'lucide-react';
import { Instrument } from '../../types/metrology';

interface AIOCRModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (extractedData: Partial<Instrument>) => void;
}

export const AIOCRModal: React.FC<AIOCRModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(true);

  const [formData, setFormData] = useState({
    manufacturer: 'Sartorius AG',
    model: 'Combics 3 - CAISL3',
    serialNumber: 'SN-78492019-DE',
    accuracyClass: 'CLASS_III',
    maxCapacity: '150',
    minCapacity: '1',
    verificationInterval_e: '0.05',
    unit: 'kg',
  });

  if (!isOpen) return null;

  const handleSimulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScanComplete(true);
    }, 800);
  };

  const handleCommit = () => {
    onConfirm({
      manufacturer: formData.manufacturer,
      model: formData.model,
      serialNumber: formData.serialNumber,
      accuracyClass: formData.accuracyClass as any,
      maxCapacity: parseFloat(formData.maxCapacity),
      minCapacity: parseFloat(formData.minCapacity),
      verificationInterval_e: parseFloat(formData.verificationInterval_e),
      unit: formData.unit as any,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#07111F]/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0B1726] border border-[#26384D] rounded-xl max-w-2xl w-full p-6 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#26384D]">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-[#19C7C8]" />
            <h3 className="text-base font-bold text-[#F4F7FA]">
              Optical Nameplate Metrological OCR
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#5B8CFF]/15 text-[#5B8CFF] border border-[#5B8CFF]/30 flex items-center gap-1 font-bold">
              <Sparkles className="w-3 h-3" />
              AI ASSISTED
            </span>
          </div>
          <button onClick={onClose} className="text-[#9AAABD] hover:text-[#F4F7FA] text-xs font-mono">
            ✕ Close
          </button>
        </div>

        {/* Regulatory Guardrail Alert */}
        <div className="bg-[#101D2D] p-3 rounded-lg border border-[#26384D] flex items-start gap-2.5 text-xs text-[#9AAABD]">
          <ShieldCheck className="w-4 h-4 text-[#20C997] shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-[#F4F7FA]">Deterministic Compliance Rule:</strong> AI serves exclusively as an input ingestion assistant. It has zero legal metrological authority. All parsed parameters require human physical verification before locking into the instrument record.
          </p>
        </div>

        {/* Two-Column: Image Preview & OCR Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left: Nameplate Image Preview */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono text-[#64748B] uppercase block">
              Captured Nameplate Macro Photo
            </span>
            <div className="relative aspect-[4/3] bg-[#07111F] rounded-lg border border-[#26384D] overflow-hidden flex flex-col items-center justify-center p-3 text-center">
              {/* Technical Nameplate Rendering */}
              <div className="w-full h-full bg-gradient-to-br from-[#142438] to-[#0B1726] p-3 rounded border border-gray-500 font-mono text-[9px] text-[#9AAABD] flex flex-col justify-between select-none">
                <div className="flex justify-between items-start border-b border-gray-600 pb-1">
                  <span className="font-bold text-white text-[11px]">SARTORIUS AG</span>
                  <span className="border border-white px-1 text-[8px] font-bold text-white">CE M24 0122</span>
                </div>
                <div className="space-y-0.5 text-left py-1 text-gray-300">
                  <div>Typ: Combics 3 - CAISL3</div>
                  <div>Nr: SN-78492019-DE</div>
                  <div>Kl. III  |  Max 150 kg</div>
                  <div>Min 1 kg  |  e = 0.05 kg</div>
                </div>
                <div className="border-t border-gray-600 pt-1 text-[8px] text-gray-400 flex justify-between">
                  <span>-10°C / +40°C</span>
                  <span>T9821/2026</span>
                </div>
              </div>

              {isScanning && (
                <div className="absolute inset-0 bg-[#07111F]/70 flex flex-col items-center justify-center gap-2">
                  <div className="w-6 h-6 border-2 border-[#19C7C8] border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs font-mono text-[#19C7C8]">Extracting Nameplate Tokens...</span>
                </div>
              )}
            </div>

            <button
              onClick={handleSimulateScan}
              className="w-full py-1.5 rounded-lg bg-[#142438] hover:bg-[#101D2D] text-[#19C7C8] text-xs font-mono border border-[#26384D] transition-colors"
            >
              Re-scan Optical Frame
            </button>
          </div>

          {/* Right: Extracted Data Fields (Editable by human) */}
          <div className="space-y-2 text-xs font-mono">
            <span className="text-[10px] font-mono text-[#64748B] uppercase block">
              Extracted Parameters (Review & Confirm)
            </span>

            <div className="space-y-1.5">
              <div>
                <label className="text-[10px] text-[#64748B] block">MANUFACTURER</label>
                <input
                  type="text"
                  value={formData.manufacturer}
                  onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                  className="w-full bg-[#101D2D] border border-[#26384D] rounded px-2.5 py-1 text-xs text-[#F4F7FA] font-mono focus:border-[#19C7C8] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] text-[#64748B] block">MODEL DESIGNATION</label>
                <input
                  type="text"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  className="w-full bg-[#101D2D] border border-[#26384D] rounded px-2.5 py-1 text-xs text-[#F4F7FA] font-mono focus:border-[#19C7C8] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] text-[#64748B] block">SERIAL NUMBER</label>
                <input
                  type="text"
                  value={formData.serialNumber}
                  onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                  className="w-full bg-[#101D2D] border border-[#26384D] rounded px-2.5 py-1 text-xs text-[#F4F7FA] font-mono focus:border-[#19C7C8] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] text-[#64748B] block">CLASS</label>
                  <input
                    type="text"
                    value={formData.accuracyClass}
                    onChange={(e) => setFormData({ ...formData, accuracyClass: e.target.value })}
                    className="w-full bg-[#101D2D] border border-[#26384D] rounded px-2 py-1 text-xs text-[#F4F7FA] font-mono focus:border-[#19C7C8] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[#64748B] block">MAX (kg)</label>
                  <input
                    type="text"
                    value={formData.maxCapacity}
                    onChange={(e) => setFormData({ ...formData, maxCapacity: e.target.value })}
                    className="w-full bg-[#101D2D] border border-[#26384D] rounded px-2 py-1 text-xs text-[#F4F7FA] font-mono focus:border-[#19C7C8] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[#64748B] block">e (kg)</label>
                  <input
                    type="text"
                    value={formData.verificationInterval_e}
                    onChange={(e) => setFormData({ ...formData, verificationInterval_e: e.target.value })}
                    className="w-full bg-[#101D2D] border border-[#26384D] rounded px-2 py-1 text-xs text-[#19C7C8] font-mono font-bold focus:border-[#19C7C8] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-[#26384D] flex items-center justify-between">
          <span className="text-[11px] font-mono text-[#20C997] flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Confidence: 98.4% • Optical rig verified
          </span>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-[#142438] text-[#9AAABD] hover:text-[#F4F7FA] text-xs font-mono"
            >
              Cancel
            </button>
            <button
              onClick={handleCommit}
              className="px-4 py-1.5 rounded-lg bg-[#19C7C8] hover:bg-[#19C7C8]/90 text-[#07111F] text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-md"
            >
              <Check className="w-3.5 h-3.5" />
              Confirm & Commit Instrument Parameters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
