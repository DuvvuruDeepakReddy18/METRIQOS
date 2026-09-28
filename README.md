# METRIQOS — Evidence-First Digital Metrology Operating System

> **Every result has a reason. Every reason has evidence.**  
> *Turn every Non-Automatic Weighing Instrument (NAWI) measurement into a traceable, replayable and verifiable compliance decision according to OIML R76.*

🌐 **Live Vercel Production Deployment**: [https://metriqos.vercel.app](https://metriqos.vercel.app)

---

## 🏛️ Problem Domain & Engineering Philosophy
In traditional legal metrology and calibration software, applications simply function as basic form-fillers: an operator types in numbers, a script checks bounds, and a generic PDF certificate is printed. If a regulatory audit or high-stakes trade dispute occurs, conventional systems cannot mathematically prove what the load-cell sensor actually transmitted, whether the ambient temperature remained stable, or if reference standards were valid at that exact millisecond.

**METRIQOS is an SIH-grade engineering platform that proves the measurement behind the report.**

```
PHYSICAL INSTRUMENT
  ↓
ACQUISITION LAYER (AutoPort)
  ↓
MEASUREMENT EVENT (MEV)
  ↓
VALIDATION & CONTEXT LOCK
  ↓
DETERMINISTIC OIML RULE ENGINE
  ↓
INDEPENDENT DUAL-ENGINE VERIFICATION
  ↓
CRYPTOGRAPHIC PROOF OBJECT
  ↓
EVIDENCE GRAPH (Topological DAG)
  ↓
CONTROLLED HUMAN OVERRIDE
  ↓
TAMPER-EVIDENT SEALED REPORT
  ↓
MEASUREMENT & REGULATION REPLAY
```

---

## ⚡ Key Architectural Differentiators

### 1. AutoPort Direct Telemetry Channel
Simulates hardware acquisition from RS-232 (9600-8-N-1 continuous print frames), USB-CDC, and BLE UART interfaces directly into the kernel ingestion daemon. Eliminates transcription errors and manual fabrication.

### 2. Deterministic Dual Calculation Verification
- **Engine A**: Evaluates primary boundary thresholds according to OIML R76-1:2006 Table 6 Maximum Permissible Error (MPE) curves.
- **Engine B**: Independent calculation pipeline implemented in scaled 64-bit integer arithmetic to prevent compiler floating-point optimization drift.
- **Discrepancy Gate**: Any divergence between Engine A and Engine B immediately halts automated verification with a `CALCULATION CONFLICT` review block.

### 3. Interactive 3D Digital Twin
Built with Three.js, accurately rendering an industrial electronic platform scale with load receptor deck, 4-point shear beam force transducers, digital indicator terminal with live telemetry readout, and leveling feet. Includes real-time orbital controls, exploded assembly view, and subsystem metadata inspection.

### 4. Interactive Cryptographic Evidence Graph
Visualizes the complete directed acyclic graph (DAG) linking physical scale telemetry, reference working standards (NPL traceable), ambient context locks (20.4°C / 51.2% RH), deterministic rule versions, and signed reports.

### 5. Non-Destructive Regulation Replay
Allows laboratory directors to safely evaluate candidate future standards (e.g. OIML 2026 Draft with 10% tighter MPE) against historical raw measurement callsets without ever modifying sealed historical certificates.

### 6. Controlled Human Override with Dual Audit
When an observation lands in `REVIEW_REQUIRED`, an authorized metrologist can provide a formal justification note (e.g., corner dampener serviced) to override the decision. The original system status remains permanently recorded in the immutable audit ledger alongside the override.

### 7. Tamper-Evident Report & QR Verification Gateway
White technical document certificate layout with 12 formal OIML sections, mathematical formulas, and a digital QR verification page (`/verify-report`) with real-time bit-flip tampering simulation.

### 8. AI-Assisted Nameplate OCR with Regulatory Guardrails
Optical OCR ingestion for instrument nameplates and calibration certificates with a prominent `[ AI ASSISTED ]` badge and mandatory human verification before committing parameters to official records.

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+ (tested on Node v24)
- npm v9+

### Installation & Execution
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build production bundle
npm run build
```

---

## 🏆 21-Step SIH Guided Evaluator Tour
Click the **"Launch 21-Step Demo"** button in the top navigation bar to activate the interactive guided presentation tour:

1. **Select Demo Instrument**: Inspect registered NAWI candidates (`NAWI-2026-00142`).
2. **Explore 3D Digital Twin**: Orbit scale, inspect subsystems, toggle Exploded View.
3. **Compile Test Plan**: Evaluate OIML R76 test matrix and inspect "Why?" derivations.
4. **Test Readiness Gate**: Validate reference weight calibration certificates and environment stability.
5. **Connect AutoPort**: Stream live continuous ASCII frames from the Toledo/Sartorius indicator.
6. **Capture Measurement Event**: Capture stable weight reading into immutable MEV.
7. **Generate Proof Object**: Review cryptographic SHA-256 fingerprint.
8. **Attach Multi-Modal Evidence**: Bind photos, UART dump, and NPL certificate.
9. **Dual-Engine Calculation**: Observe Engine A boundary evaluation.
10. **Independent Verification**: Confirm Engine B integer arithmetic convergence.
11. **Why This Result?**: Trace provenance path from decision to physical standard.
12. **Evidence Graph**: Explore DAG provenance from report to load-cells.
13. **Controlled Failure Demo**: Inject artificial sensor deviation.
14. **Observe Safety Status**: Verify system flags `REVIEW_REQUIRED`.
15. **Human Override**: Provide required justification note and sign override.
16. **Immutable Ledger**: Verify original and override records coexist.
17. **Generate Sealed Report**: Inspect technical white certificate with QR.
18. **QR Verification**: Test bit-flip tampering simulation.
19. **Event Replay**: Step through the engineering forensic timeline.
20. **Regulation Replay**: Re-evaluate historical data under draft OIML 2026 rules.
21. **Historical Immutability**: Confirm historical report remains unaltered.
