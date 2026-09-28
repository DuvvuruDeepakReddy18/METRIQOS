import { AccuracyClass, ComplianceState, ApplicableTestRequirement, Instrument } from '../types/metrology';

/**
 * Deterministic OIML R76-1:2006 Maximum Permissible Error (MPE) Engine
 * Table 6 (Clause 3.5.1)
 */
export function calculateMPE(
  loadKg: number,
  accuracyClass: AccuracyClass,
  e_kg: number,
  isInService: boolean = false
): { mpeKg: number; formula: string; intervalCount: number } {
  const m = Math.abs(loadKg);
  const n = m / e_kg; // Number of verification scale intervals

  let mpeMultiplier = 0.5;

  if (accuracyClass === 'CLASS_I') {
    if (n <= 50000) mpeMultiplier = 0.5;
    else if (n <= 200000) mpeMultiplier = 1.0;
    else mpeMultiplier = 1.5;
  } else if (accuracyClass === 'CLASS_II') {
    if (n <= 5000) mpeMultiplier = 0.5;
    else if (n <= 20000) mpeMultiplier = 1.0;
    else mpeMultiplier = 1.5;
  } else if (accuracyClass === 'CLASS_IIII') {
    if (n <= 50) mpeMultiplier = 0.5;
    else if (n <= 200) mpeMultiplier = 1.0;
    else mpeMultiplier = 1.5;
  } else {
    // Default: CLASS_III (Medium accuracy - commercial & industrial scales)
    if (n <= 500) mpeMultiplier = 0.5;
    else if (n <= 2000) mpeMultiplier = 1.0;
    else mpeMultiplier = 1.5;
  }

  // In-service MPE is 2x initial verification MPE per OIML R76 Clause 3.5.2
  const serviceFactor = isInService ? 2.0 : 1.0;
  const effectiveMultiplier = mpeMultiplier * serviceFactor;
  const mpeKg = parseFloat((effectiveMultiplier * e_kg).toFixed(6));

  const formula = isInService
    ? `2 × (±${mpeMultiplier} × e) [${n.toFixed(1)} e ∈ ${accuracyClass}]`
    : `±${mpeMultiplier} × e [${n.toFixed(1)} e ∈ ${accuracyClass}]`;

  return { mpeKg, formula, intervalCount: n };
}

/**
 * ENGINE A: Primary Deterministic Calculation Engine
 * High-precision direct evaluation of Indicated vs Reference Load against OIML MPE boundaries.
 */
export function executeEngineA(
  referenceLoad: number,
  indicatedValue: number,
  mpeLimit: number
): {
  error: number;
  result: ComplianceState;
  explanation: string;
} {
  const error = parseFloat((indicatedValue - referenceLoad).toFixed(6));
  const absError = Math.abs(error);

  if (absError <= mpeLimit) {
    return {
      error,
      result: 'VERIFIED',
      explanation: `Observed error |${error.toFixed(4)}| kg ≤ MPE limit ±${mpeLimit.toFixed(4)} kg`,
    };
  } else if (absError <= mpeLimit * 1.05) {
    // Within 5% boundary margin -> Requires review
    return {
      error,
      result: 'REVIEW_REQUIRED',
      explanation: `Observed error |${error.toFixed(4)}| kg exceeds nominal MPE limit ±${mpeLimit.toFixed(4)} kg within expanded measurement uncertainty boundary`,
    };
  } else {
    return {
      error,
      result: 'NON_COMPLIANT',
      explanation: `Observed error |${error.toFixed(4)}| kg exceeds allowable MPE threshold ±${mpeLimit.toFixed(4)} kg`,
    };
  }
}

/**
 * ENGINE B: Independent Verification Calculation Engine
 * Re-computes verification using normalized epsilon ratios and distinct numerical rounding pipelines
 * to detect compiler, floating-point, or logic drift.
 */
export function executeEngineB(
  referenceLoad: number,
  indicatedValue: number,
  mpeLimit: number
): {
  error: number;
  result: ComplianceState;
  explanation: string;
} {
  // Independent calculation path via scaled integer arithmetic to eliminate floating-point representation drift
  const scaleFactor = 1000000;
  const refScaled = Math.round(referenceLoad * scaleFactor);
  const indScaled = Math.round(indicatedValue * scaleFactor);
  const mpeScaled = Math.round(mpeLimit * scaleFactor);
  const diffScaled = indScaled - refScaled;
  const absDiffScaled = Math.abs(diffScaled);

  const error = diffScaled / scaleFactor;

  if (absDiffScaled <= mpeScaled) {
    return {
      error,
      result: 'VERIFIED',
      explanation: `Independent Engine B integer verification: |Δ|=${absDiffScaled}µ ≤ ${mpeScaled}µ MPE ceiling`,
    };
  } else if (absDiffScaled <= Math.round(mpeScaled * 1.05)) {
    return {
      error,
      result: 'REVIEW_REQUIRED',
      explanation: `Independent Engine B flagged near-boundary observation requiring metrologist assessment`,
    };
  } else {
    return {
      error,
      result: 'NON_COMPLIANT',
      explanation: `Independent Engine B confirmed out-of-tolerance deviation`,
    };
  }
}

/**
 * DUAL CALCULATION VERIFICATION
 * Compares Engine A and Engine B. If they disagree, a CALCULATION CONFLICT is raised.
 */
export function runDualEngineVerification(
  referenceLoad: number,
  indicatedValue: number,
  accuracyClass: AccuracyClass,
  e_kg: number,
  isInService: boolean = false
): {
  errorKg: number;
  mpeLimitKg: number;
  mpeFormula: string;
  engineAResult: ComplianceState;
  engineBResult: ComplianceState;
  calculationMatch: boolean;
  finalValidationState: ComplianceState;
  reasoning: string;
} {
  const { mpeKg, formula } = calculateMPE(referenceLoad, accuracyClass, e_kg, isInService);
  const resA = executeEngineA(referenceLoad, indicatedValue, mpeKg);
  const resB = executeEngineB(referenceLoad, indicatedValue, mpeKg);

  const calculationMatch = resA.result === resB.result && Math.abs(resA.error - resB.error) < 0.000001;

  let finalValidationState: ComplianceState = resA.result;
  let reasoning = `${resA.explanation} | Dual-engine verification: ${calculationMatch ? 'PERFECT CONVERGENCE' : 'MISMATCH'}`;

  if (!calculationMatch) {
    finalValidationState = 'REVIEW_REQUIRED';
    reasoning = `CALCULATION CONFLICT: Engine A determined ${resA.result} while Engine B determined ${resB.result}. Metrologist review required.`;
  }

  return {
    errorKg: resA.error,
    mpeLimitKg: mpeKg,
    mpeFormula: formula,
    engineAResult: resA.result,
    engineBResult: resB.result,
    calculationMatch,
    finalValidationState,
    reasoning,
  };
}

/**
 * APPLICABILITY COMPILER
 * Evaluates instrument metrological parameters against OIML R76-1:2006
 * and compiles the exact Applicable Test Matrix with explainable logic.
 */
export function compileApplicability(instrument: Instrument): ApplicableTestRequirement[] {
  const tests: ApplicableTestRequirement[] = [
    {
      id: 'req-01',
      testCode: 'WEIGHING_PERFORMANCE',
      name: 'Weighing Performance Test (Clause A.4.4.1)',
      oimlClause: 'OIML R76-1 Clause A.4.4.1',
      status: 'APPLICABLE',
      reason: `Mandatory baseline metrological test for all ${instrument.accuracyClass} NAWIs across minimum 5 ascending & descending load steps.`,
      criteriaFormula: `|Error| ≤ MPE(m, ${instrument.accuracyClass}, e=${instrument.verificationInterval_e}${instrument.unit})`,
      mpeDescription: `Initial verification MPE: ±0.5e (0 to 500e), ±1.0e (500e to 2000e), ±1.5e (>2000e)`,
      requiredLoadSteps: [
        instrument.minCapacity,
        parseFloat((instrument.maxCapacity * 0.25).toFixed(2)),
        parseFloat((instrument.maxCapacity * 0.5).toFixed(2)),
        parseFloat((instrument.maxCapacity * 0.75).toFixed(2)),
        instrument.maxCapacity,
      ],
      mandatoryEvidence: ['Indicator Snapshot', 'Reference Weight Cal Cert', 'Serial Log Stream'],
    },
    {
      id: 'req-02',
      testCode: 'REPEATABILITY',
      name: 'Repeatability Test (Clause A.4.10)',
      oimlClause: 'OIML R76-1 Clause A.4.10',
      status: 'APPLICABLE',
      reason: `Required for Class ${instrument.accuracyClass}. 3 consecutive weighings at ~50% Max and 3 weighings at ~100% Max to verify standard deviation and maximum span difference.`,
      criteriaFormula: `Max(Indicated) - Min(Indicated) ≤ |MPE(m)| for each load series`,
      mpeDescription: `Span difference must not exceed the absolute value of the MPE for that test load.`,
      requiredLoadSteps: [
        parseFloat((instrument.maxCapacity * 0.5).toFixed(2)),
        instrument.maxCapacity,
      ],
      mandatoryEvidence: ['Load Receptor Observation', 'Indicator Log Series'],
    },
    {
      id: 'req-03',
      testCode: 'ECCENTRICITY',
      name: 'Eccentricity Test (Clause A.4.7)',
      oimlClause: 'OIML R76-1 Clause A.4.7',
      status: 'APPLICABLE',
      reason: `Receptor has 4 corner quadrants. Requires 1/3 Max (or 1/(N-1) Max for N-point supports) applied sequentially at Center, Front-Left, Front-Right, Back-Left, and Back-Right.`,
      criteriaFormula: `|Corner Error| ≤ MPE(m=Max/3)`,
      mpeDescription: `Errors at each of the 4 off-center positions must remain within MPE for test load ${parseFloat((instrument.maxCapacity / 3).toFixed(2))} ${instrument.unit}.`,
      requiredLoadSteps: [
        parseFloat((instrument.maxCapacity / 3).toFixed(2)),
      ],
      mandatoryEvidence: ['Quarter Load Position Photo', 'Quadrant Reading Log'],
    },
    {
      id: 'req-04',
      testCode: 'ZERO_SETTING',
      name: 'Zero-Setting & Zero-Tracking Test (Clause A.4.2 & A.4.3)',
      oimlClause: 'OIML R76-1 Clause A.4.2 / A.4.3',
      status: 'APPLICABLE',
      reason: `Electronic scale with automated zero-tracking device. Error at zero after zero-setting must not exceed ±0.25e.`,
      criteriaFormula: `|E_0| ≤ 0.25 × e (${parseFloat((0.25 * instrument.verificationInterval_e).toFixed(4))} ${instrument.unit})`,
      mpeDescription: `Zero-setting accuracy limit is ±0.25 e.`,
      requiredLoadSteps: [0],
      mandatoryEvidence: ['Zero Indication Screenshot', 'Zero Tracking Checkpoint'],
    },
    {
      id: 'req-05',
      testCode: 'TARE',
      name: 'Tare Mechanism Weighing Test (Clause A.4.6)',
      oimlClause: 'OIML R76-1 Clause A.4.6',
      status: instrument.tareCapacity > 0 ? 'APPLICABLE' : 'NOT_APPLICABLE',
      reason: instrument.tareCapacity > 0
        ? `Instrument configuration specifies subtractive tare device with capacity ${instrument.tareCapacity} ${instrument.unit}. Verification of net weighing accuracy required.`
        : `Instrument has no tare facility configured.`,
      criteriaFormula: `|Net Error| ≤ MPE(Net Load)`,
      mpeDescription: `Net weight indications must satisfy MPE applicable to identical gross load.`,
      requiredLoadSteps: [
        parseFloat((instrument.tareCapacity * 0.5).toFixed(2)),
        instrument.tareCapacity,
      ],
      mandatoryEvidence: ['Tare Balancing Photo', 'Net Load Readout Log'],
    },
    {
      id: 'req-06',
      testCode: 'CREEP',
      name: 'Creep Test (Clause A.4.11)',
      oimlClause: 'OIML R76-1 Clause A.4.11',
      status: instrument.accuracyClass === 'CLASS_I' || instrument.accuracyClass === 'CLASS_II'
        ? 'APPLICABLE'
        : 'CONDITIONALLY_APPLICABLE',
      reason: instrument.accuracyClass === 'CLASS_I' || instrument.accuracyClass === 'CLASS_II'
        ? `Mandatory for high-precision Class I/II scales. 30-minute constant load test at ~Max capacity.`
        : `Conditionally applicable for Class ${instrument.accuracyClass} if load cell lacks OIML R60 OIML-CS certificate.`,
      criteriaFormula: `|Indication(t=30m) - Indication(t=initial)| ≤ 0.5 e`,
      mpeDescription: `Difference between indication at 30 min and initial indication shall not exceed 0.5 e.`,
      requiredLoadSteps: [instrument.maxCapacity],
      mandatoryEvidence: ['Creep Time Series Data', 'Thermal Monitor Log'],
    },
    {
      id: 'req-07',
      testCode: 'ENVIRONMENTAL_TEMP',
      name: 'Static Temperature Influence Test (Clause A.5.3)',
      oimlClause: 'OIML R76-1 Clause A.5.3',
      status: 'CONDITIONALLY_APPLICABLE',
      reason: `Pattern approval requirement. For initial laboratory verification of pre-pattern-approved NAWI, ambient verification at nominal range (20°C ± 2°C) is required; thermal chamber cycling is conditionally waived if Type Approval Certificate is locked.`,
      criteriaFormula: `Span shift ≤ 1 e per 5°C variation`,
      mpeDescription: `Zero and span drift must remain within standard bounds across declared range.`,
      requiredLoadSteps: [0, instrument.maxCapacity],
      mandatoryEvidence: ['Environmental Sensor Log', 'Chamber Temperature Plot'],
    },
  ];

  return tests;
}
