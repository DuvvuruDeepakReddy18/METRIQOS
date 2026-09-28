import React, { useState, useEffect } from 'react';
import { Sidebar, NavigationRoute } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { CommandPalette } from './components/layout/CommandPalette';
import { CommandCenter } from './components/dashboard/CommandCenter';
import { TestingWorkbench } from './components/testing/TestingWorkbench';
import { MeasurementEventsView } from './components/testing/MeasurementEventsView';
import { EvidenceGraph } from './components/evidence/EvidenceGraph';
import { MeasurementReplay } from './components/replay/MeasurementReplay';
import { RegulationReplay } from './components/replay/RegulationReplay';
import { ReportViewer } from './components/reports/ReportViewer';
import { QRVerificationView } from './components/reports/QRVerificationView';
import { RulePackageViewer } from './components/rules/RulePackageViewer';
import { InstrumentRegistry } from './components/instruments/InstrumentRegistry';
import { DigitalTwinPage } from './components/instruments/DigitalTwinPage';
import { ApplicabilityCompiler } from './components/applicability/ApplicabilityCompiler';
import { ReferenceEquipmentRegistry } from './components/equipment/ReferenceEquipmentRegistry';
import { IncidentCenter } from './components/incidents/IncidentCenter';
import { AuditTrailView } from './components/audit/AuditTrailView';
import { LaboratoryAnalytics } from './components/analytics/LaboratoryAnalytics';
import { AdministrationView } from './components/admin/AdministrationView';
import { LandingPage } from './components/landing/LandingPage';
import { ArchitectureModal } from './components/landing/ArchitectureModal';
import { SIHDemoGuide, SIH_DEMO_STEPS } from './components/landing/SIHDemoGuide';
import { AIOCRModal } from './components/evidence/AIOCRModal';
import { Instrument, UserRole } from './types/metrology';
import { DEMO_INSTRUMENTS } from './data/initialData';

export function App() {
  const [showLandingPage, setShowLandingPage] = useState(false);
  const [currentRoute, setCurrentRoute] = useState<NavigationRoute>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedInstrument, setSelectedInstrument] = useState<Instrument>(DEMO_INSTRUMENTS[0]);
  const [currentRole, setCurrentRole] = useState<UserRole>('TEST_ENGINEER');
  const [isOffline, setIsOffline] = useState(false);

  // Modals & Guided Experience
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isArchModalOpen, setIsArchModalOpen] = useState(false);
  const [isOCROpen, setIsOCROpen] = useState(false);
  const [showSIHDemoGuide, setShowSIHDemoGuide] = useState(false);
  const [sihStepIndex, setSihStepIndex] = useState(0);

  // Keyboard shortcut listener for Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleStartSIHDemo = () => {
    setShowLandingPage(false);
    setShowSIHDemoGuide(true);
    setSihStepIndex(0);
    setCurrentRoute('instruments');
  };

  const handleSIHStepNavigate = (stepIdx: number, targetRoute: string) => {
    setSihStepIndex(stepIdx);
    setCurrentRoute(targetRoute as NavigationRoute);
  };

  if (showLandingPage) {
    return (
      <div className="relative">
        <LandingPage
          onEnterDemo={() => {
            setShowLandingPage(false);
            setCurrentRoute('dashboard');
          }}
          onOpenArchitecture={() => setIsArchModalOpen(true)}
        />
        <ArchitectureModal
          isOpen={isArchModalOpen}
          onClose={() => setIsArchModalOpen(false)}
        />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#07111F] text-[#F4F7FA]">
      {/* Collapsible Left Sidebar */}
      <Sidebar
        currentRoute={currentRoute}
        onNavigate={(route) => setCurrentRoute(route)}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        currentRole={currentRole}
      />

      {/* Main View Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top App Bar */}
        <TopBar
          currentRoute={currentRoute}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenArchitecture={() => setIsArchModalOpen(true)}
          onStartSIHDemo={handleStartSIHDemo}
          currentRole={currentRole}
          onChangeRole={(r) => setCurrentRole(r)}
          isOffline={isOffline}
          onToggleOffline={() => setIsOffline(!isOffline)}
        />

        {/* Dynamic Content View Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#07111F]">
          {currentRoute === 'dashboard' && (
            <CommandCenter
              onNavigate={(route) => setCurrentRoute(route)}
              onOpenOCR={() => setIsOCROpen(true)}
            />
          )}

          {currentRoute === 'instruments' && (
            <InstrumentRegistry
              onSelectInstrument={(inst) => {
                setSelectedInstrument(inst);
                setCurrentRoute('workbench');
              }}
              onOpenDigitalTwin={(inst) => {
                setSelectedInstrument(inst);
                setCurrentRoute('digital-twin');
              }}
              onOpenOCR={() => setIsOCROpen(true)}
            />
          )}

          {currentRoute === 'digital-twin' && (
            <DigitalTwinPage
              instrument={selectedInstrument}
              onBackToRegistry={() => setCurrentRoute('instruments')}
              onProceedToTest={(inst) => {
                setSelectedInstrument(inst);
                setCurrentRoute('applicability');
              }}
            />
          )}

          {currentRoute === 'applicability' && (
            <ApplicabilityCompiler
              onProceedToWorkbench={() => setCurrentRoute('workbench')}
            />
          )}

          {currentRoute === 'workbench' && (
            <TestingWorkbench
              instrument={selectedInstrument}
              onOpenReplay={(mevId) => setCurrentRoute('replay')}
              onOpenReport={() => setCurrentRoute('reports')}
            />
          )}

          {currentRoute === 'measurements' && (
            <MeasurementEventsView
              onOpenReplay={(mevId) => setCurrentRoute('replay')}
            />
          )}

          {currentRoute === 'evidence-graph' && <EvidenceGraph />}

          {currentRoute === 'replay' && <MeasurementReplay />}

          {currentRoute === 'regulation-replay' && <RegulationReplay />}

          {currentRoute === 'reports' && (
            <ReportViewer
              instrument={selectedInstrument}
              onOpenVerify={(repId) => setCurrentRoute('verify-report')}
            />
          )}

          {currentRoute === 'verify-report' && (
            <QRVerificationView
              onBackToReport={() => setCurrentRoute('reports')}
            />
          )}

          {currentRoute === 'rules' && <RulePackageViewer />}

          {currentRoute === 'reference-equipment' && <ReferenceEquipmentRegistry />}

          {currentRoute === 'incidents' && <IncidentCenter />}

          {currentRoute === 'analytics' && <LaboratoryAnalytics />}

          {currentRoute === 'audit' && <AuditTrailView />}

          {currentRoute === 'admin' && <AdministrationView />}
        </main>
      </div>

      {/* Global Command Palette (Ctrl+K) */}
      <CommandPalette
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={(route) => setCurrentRoute(route)}
      />

      {/* Architecture View Modal (Judge Experience) */}
      <ArchitectureModal
        isOpen={isArchModalOpen}
        onClose={() => setIsArchModalOpen(false)}
      />

      {/* AI Nameplate OCR Modal */}
      <AIOCRModal
        isOpen={isOCROpen}
        onClose={() => setIsOCROpen(false)}
        onConfirm={(parsed) => {
          alert(`OCR Confirmed! Added/Updated Instrument: ${parsed.manufacturer} ${parsed.model} (${parsed.accuracyClass})`);
        }}
      />

      {/* SIH 21-Step Guided Walkthrough Floating Tour */}
      {showSIHDemoGuide && (
        <SIHDemoGuide
          currentStepIndex={sihStepIndex}
          onNavigateStep={handleSIHStepNavigate}
          onClose={() => setShowSIHDemoGuide(false)}
        />
      )}
    </div>
  );
}

export default App;
