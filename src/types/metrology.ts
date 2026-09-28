export type UserRole = 
  | 'ADMIN' 
  | 'LAB_MANAGER' 
  | 'TEST_ENGINEER' 
  | 'REVIEWER' 
  | 'AUDITOR' 
  | 'VIEWER';

export type AccuracyClass = 'CLASS_I' | 'CLASS_II' | 'CLASS_III' | 'CLASS_IIII';

export type ComplianceState = 
  | 'VERIFIED' 
  | 'REVIEW_REQUIRED' 
  | 'NON_COMPLIANT' 
  | 'UNABLE_TO_VERIFY' 
  | 'BLOCKED';

export type AcquisitionSource = 
  | 'AUTOPORT_RS232' 
  | 'AUTOPORT_USB' 
  | 'AUTOPORT_BLE' 
  | 'MANUAL_OBSERVATION';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  laboratory: string;
  badgeNumber: string;
  avatarUrl?: string;
}

export interface Instrument {
  id: string; // e.g. NAWI-2026-00142
  name: string;
  manufacturer: string;
  model: string;
  serialNumber: string;
  accuracyClass: AccuracyClass;
  maxCapacity: number; // e.g. 150
  minCapacity: number; // e.g. 1
  verificationInterval_e: number; // e.g. 0.05 kg
  actualInterval_d: number; // e.g. 0.01 kg
  unit: 'kg' | 'g';
  tareCapacity: number;
  loadReceptorType: string;
  indicatorModel: string;
  communicationPort: string;
  baudRate: number;
  status: 'REGISTERED' | 'CONFIGURED' | 'READY' | 'IN_TESTING' | 'VERIFIED' | 'LOCKED' | 'FLAGGED';
  lastVerificationDate: string;
  nextVerificationDue: string;
  configurationHash: string;
  digitalTwinAvailable: boolean;
  notes?: string;
}

export interface ReferenceEquipment {
  id: string; // e.g. STD-WEIGHT-M1-042
  name: string;
  type: 'E2_WEIGHT_SET' | 'F1_WEIGHT_SET' | 'M1_WEIGHT_SET' | 'THERMO_HYGROMETER' | 'PRECISION_MULTIMETER';
  manufacturer: string;
  model: string;
  serialNumber: string;
  calibrationStatus: 'VALID' | 'EXPIRED' | 'PENDING_RECALIBRATION';
  calibrationDate: string;
  validUntil: string;
  certificateNumber: string;
  uncertainty: string;
  nominalRange: string;
  location: string;
}

export interface EnvironmentContext {
  id: string;
  temperature: number; // Celsius
  humidity: number; // %
  pressure: number; // hPa
  voltage: number; // V
  sensorId: string;
  timestamp: string;
  locked: boolean;
  isCompliantRange: boolean;
}

export interface ApplicableTestRequirement {
  id: string;
  testCode: 'WEIGHING_PERFORMANCE' | 'REPEATABILITY' | 'ECCENTRICITY' | 'ZERO_SETTING' | 'TARE' | 'CREEP' | 'ENVIRONMENTAL_TEMP';
  name: string;
  oimlClause: string;
  status: 'APPLICABLE' | 'NOT_APPLICABLE' | 'CONDITIONALLY_APPLICABLE' | 'REQUIRES_REVIEW';
  reason: string;
  criteriaFormula: string;
  mpeDescription: string;
  requiredLoadSteps: number[];
  mandatoryEvidence: string[];
}

export interface TestPlan {
  id: string;
  instrumentId: string;
  name: string;
  rulePackageId: string;
  rulePackageVersion: string;
  operatorId: string;
  createdDate: string;
  status: 'REGISTERED' | 'CONFIGURED' | 'READY' | 'MEASURING' | 'VALIDATING' | 'REVIEW' | 'SEALED';
  applicableTests: ApplicableTestRequirement[];
  currentTestCode: string;
}

export interface EvidenceItem {
  id: string;
  title: string;
  type: 'INDICATOR_SNAPSHOT' | 'CALIBRATION_CERT' | 'NAMEPLATE_PHOTO' | 'SERIAL_LOG_DUMP' | 'ENVIRONMENT_LOGGER';
  timestamp: string;
  linkedMeasurementId?: string;
  hash: string;
  uploader: string;
  source: string;
  fileSize: string;
  mimeType: string;
  previewUrl?: string;
  ocrExtracted?: {
    manufacturer?: string;
    model?: string;
    serialNumber?: string;
    max?: string;
    min?: string;
    e?: string;
    class?: string;
    confirmed: boolean;
    confidence: number;
  };
}

export interface MeasurementEvent {
  id: string; // MEV-000481
  testId: string;
  instrumentId: string;
  testType: string;
  referenceLoad: number;
  indicatedValue: number;
  difference: number; // indicated - reference
  mpeCriterion: number; // ± allowed error
  unit: string;
  timestamp: string;
  source: AcquisitionSource;
  operatorId: string;
  operatorName: string;
  manualReason?: string;
  referenceEquipmentId: string;
  environmentContextId: string;
  evidenceIds: string[];
  ruleVersion: string;
  softwareVersion: string;
  engineAResult: ComplianceState;
  engineBResult: ComplianceState;
  dualCalculationMatch: boolean;
  validationState: ComplianceState;
  integrityHash: string;
  rawSerialFrame?: string;
  humanOverride?: {
    reviewerId: string;
    reviewerName: string;
    originalState: ComplianceState;
    newState: ComplianceState;
    reason: string;
    timestamp: string;
  };
}

export interface MetrologyProofObject {
  id: string;
  measurementEventId: string;
  testId: string;
  instrumentId: string;
  requirementName: string;
  oimlClause: string;
  ruleVersion: string;
  rawLoad: number;
  rawIndicated: number;
  observedError: number;
  mpeLimit: number;
  unit: string;
  formula: string;
  engineAOutput: string;
  engineBOutput: string;
  dualEngineMatch: boolean;
  evidenceAttached: boolean;
  evidenceIds: string[];
  referenceEquipmentValid: boolean;
  environmentWithinLimits: boolean;
  reviewerApproved: boolean;
  reviewerNotes?: string;
  finalDecision: ComplianceState;
  proofSignature: string;
  timestamp: string;
}

export interface Report {
  id: string; // REP-R76-2026-00412
  instrumentId: string;
  testPlanId: string;
  laboratoryName: string;
  laboratoryLocation: string;
  accreditationStandard: string;
  issueDate: string;
  sealedBy: string;
  reviewerName: string;
  documentHash: string;
  overallCompliance: ComplianceState;
  status: 'DRAFT' | 'AWAITING_REVIEW' | 'SEALED' | 'SUPERSEDED';
  qrVerificationUrl: string;
  testedUnderRulePackage: string;
  measurementEventsCount: number;
  evidenceCount: number;
}

export interface Incident {
  id: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  title: string;
  description: string;
  relatedMeasurementId?: string;
  relatedInstrumentId: string;
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED';
  detectedTime: string;
  owner: string;
  resolution?: string;
  evidenceId?: string;
}

export interface RulePackage {
  id: string;
  name: string;
  version: string;
  effectiveDate: string;
  status: 'DRAFT' | 'VALIDATION' | 'APPROVAL' | 'ACTIVE' | 'RETIRED';
  createdBy: string;
  approvedBy?: string;
  description: string;
  applicableStandards: string[];
  testsAffected: string[];
  strictnessFactor: number;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  user: string;
  role: UserRole;
  action: string;
  entityId: string;
  entityType: string;
  details: string;
  hash: string;
}
