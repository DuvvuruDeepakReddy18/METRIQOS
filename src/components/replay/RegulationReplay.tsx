import React, { useState } from 'react';
import { 
  GitBranch, ShieldAlert, CheckCircle2, AlertTriangle, ArrowRight, 
  Lock, RefreshCw, FileText, Download, Info 
} from 'lucide-react';
import { DEMO_MEASUREMENTS, DEMO_RULE_PACKAGES } from '../../data/initialData';

export const RegulationReplay: React.FC = () => {
  const [candidateRuleId, setCandidateRuleId] = useState<string>('RULE-PACK-R76-2026-REVISED');
  const [isSimulating, setIsSimulating] = useState(false);

  const baselineRule = DEMO_RULE_PACKAGES[0]; // R76-1:2006 Standard
  const candidateRule = DEMO_RULE_PACKAGES.find((r) => r.id === candidateRuleId) || DEMO_RULE_PACKAGES[1];

  // Calculate impact of candidate rule (strictnessFactor 0.9 = 10% tighter MPE)
  const comparisonResults = DEMO_MEASUREMENTS.map((mev) => {
    const origMpe = mev.mpeCriterion;
    const newMpe = parseFloat((origMpe * candidateRule.strictnessFactor).toFixed(4));
    const absDiff = Math.abs(mev.difference);

    let reevaluatedState = 'VERIFIED';
    let impactNote = 'Passes both standards';

    if (absDiff > newMpe) {
      reevaluatedState = 'NON_COMPLIANT';
      impactNote = `Exceeds candidate MPE ±${newMpe.toFixed(4)} kg by ${parseFloat((absDiff - newMpe).toFixed(4))} kg`;
    } else if (absDiff > newMpe * 0.92) {
      reevaluatedState = 'REVIEW_REQUIRED';
      impactNote = `Within 8% expanded uncertainty of candidate boundary`;
    }

    const stateChanged = mev.validationState !== reevaluatedState;

    return {
      mevId: mev.id,
      testType: mev.testType,
      load: mev.referenceLoad,
      indicated: mev.indicatedValue,
      difference: mev.difference,
      origMpe,
      origState: mev.validationState,
      newMpe,
      newState: reevaluatedState,
      stateChanged,
      impactNote,
    };
  });

  const changedCount = comparisonResults.filter((r) => r.stateChanged).length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#26384D] gap-2">
        <div>
          <div className="flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-[#19C7C8]" />
            <h2 className="text-base font-bold text-[#F4F7FA]">
              Regulation Replay • Non-Destructive Impact Engine
            </h2>
          </div>
          <p className="text-xs text-[#9AAABD] mt-0.5">
            Safely re-evaluate historical raw measurements against newly drafted rule packages without altering sealed historical records.
          </p>
        </div>

        {/* Candidate Rule Switcher */}
        <div className="flex items-center gap-2 bg-[#0B1726] px-3 py-1.5 rounded-lg border border-[#26384D]">
          <span className="text-xs text-[#64748B] font-mono">Evaluate With:</span>
          <select
            value={candidateRuleId}
            onChange={(e) => setCandidateRuleId(e.target.value)}
            className="bg-[#101D2D] border border-[#26384D] rounded px-2 py-1 text-xs text-[#F4F7FA] font-mono focus:outline-none focus:border-[#19C7C8]"
          >
            {DEMO_RULE_PACKAGES.filter((r) => r.id !== baselineRule.id).map((r) => (
              <option key={r.id} value={r.id}>
                {r.name} ({r.version})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Security & Immutability Guarantee Banner */}
      <div className="bg-[#101D2D] border border-[#19C7C8]/40 rounded-xl p-3.5 flex items-start gap-3 shadow-lg">
        <Lock className="w-5 h-5 text-[#20C997] shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <div className="font-mono font-bold text-[#20C997] flex items-center gap-2">
            <span>IMMUTABLE HISTORICAL RECORD INTEGRITY PRESERVED</span>
            <span className="text-[10px] text-[#F4F7FA] bg-[#20C997]/20 px-2 py-0.5 rounded border border-[#20C997]/40">
              Zero Production Overwrite
            </span>
          </div>
          <p className="text-[#9AAABD] leading-relaxed">
            Historical test certificate <strong className="text-[#F4F7FA]">REP-R76-2026-00412</strong> and its underlying raw telemetry events remain permanently sealed with original SHA-256 signatures. This sandbox simulation isolates the effect of future regulatory revisions for prospective planning.
          </p>
        </div>
      </div>

      {/* Rules Comparison Metadata Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="bg-[#0B1726] p-3.5 rounded-xl border border-[#26384D]">
          <span className="text-[10px] font-mono text-[#64748B] uppercase block">Historical Baseline Rule</span>
          <h4 className="text-sm font-bold text-[#F4F7FA] mt-0.5">{baselineRule.name}</h4>
          <div className="text-xs text-[#5B8CFF] font-mono mt-1">
            Version: {baselineRule.version} • Status: {baselineRule.status}
          </div>
        </div>

        <div className="bg-[#0B1726] p-3.5 rounded-xl border border-[#5B8CFF]/50">
          <span className="text-[10px] font-mono text-[#5B8CFF] uppercase block">Candidate Proposed Rule</span>
          <h4 className="text-sm font-bold text-[#F4F7FA] mt-0.5">{candidateRule.name}</h4>
          <div className="text-xs text-[#F4B740] font-mono mt-1">
            Version: {candidateRule.version} • Status: {candidateRule.status} (Strictness: {candidateRule.strictnessFactor}x)
          </div>
        </div>
      </div>

      {/* Side-by-Side Comparison Table */}
      <div className="bg-[#0B1726] border border-[#26384D] rounded-xl overflow-hidden shadow-2xl">
        <div className="px-4 py-3 border-b border-[#26384D] flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-[#F4F7FA]">
            Historical Measurement Re-Evaluation Matrix (NAWI-2026-00142)
          </span>
          <span className="text-xs font-mono text-[#F4B740]">
            {changedCount} of {comparisonResults.length} Observations Impacted
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#101D2D] text-[#64748B] uppercase text-[10px] border-b border-[#26384D]">
              <tr>
                <th className="py-2.5 px-4">Event ID</th>
                <th className="py-2.5 px-4">Test Step</th>
                <th className="py-2.5 px-3">Nominal (kg)</th>
                <th className="py-2.5 px-3">Indicated</th>
                <th className="py-2.5 px-3">Deviation</th>
                <th className="py-2.5 px-3">Original Decision (v3.2)</th>
                <th className="py-2.5 px-3">Proposed Decision (v4.0)</th>
                <th className="py-2.5 px-4">Regulatory Impact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#26384D]/60 text-[#F4F7FA]">
              {comparisonResults.map((row) => (
                <tr
                  key={row.mevId}
                  className={`hover:bg-[#142438]/50 transition-colors ${
                    row.stateChanged ? 'bg-[#F4B740]/5' : ''
                  }`}
                >
                  <td className="py-2.5 px-4 font-bold text-[#19C7C8]">{row.mevId}</td>
                  <td className="py-2.5 px-4 text-[#9AAABD]">{row.testType}</td>
                  <td className="py-2.5 px-3 tabular-nums">{row.load.toFixed(3)}</td>
                  <td className="py-2.5 px-3 tabular-nums">{row.indicated.toFixed(3)}</td>
                  <td className="py-2.5 px-3 tabular-nums">
                    {row.difference > 0 ? '+' : ''}{row.difference.toFixed(3)}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded bg-[#20C997]/15 text-[#20C997] border border-[#20C997]/30 text-[10px]">
                      {row.origState} (±{row.origMpe})
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] border ${
                      row.newState === 'VERIFIED'
                        ? 'bg-[#20C997]/15 text-[#20C997] border-[#20C997]/30'
                        : row.newState === 'REVIEW_REQUIRED'
                        ? 'bg-[#F4B740]/15 text-[#F4F7FA] border-[#F4B740]/40'
                        : 'bg-[#EF5B5B]/15 text-[#EF5B5B] border-[#EF5B5B]/40'
                    }`}>
                      {row.newState} (±{row.newMpe})
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-[11px] text-[#9AAABD]">
                    {row.stateChanged ? (
                      <span className="text-[#F4B740] font-semibold flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        {row.impactNote}
                      </span>
                    ) : (
                      <span className="text-[#20C997] flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        Compliant under both standards
                      </span>
                    )}
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
