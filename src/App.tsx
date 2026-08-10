import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  FilePlus, 
  Activity, 
  BookOpen, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Users, 
  CheckCircle2, 
  TrendingUp, 
  Lock,
  Globe,
  Layers,
  FileCheck2,
  Award,
  CheckSquare
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { LoginPage, UserSession } from './components/LoginPage';
import { OverviewDashboard } from './components/OverviewDashboard';
import { RegistrationMultiStepForm } from './components/RegistrationMultiStepForm';
import { ProposalSubmissionForm } from './components/ProposalSubmissionForm';
import { TrackingMonevDashboard } from './components/TrackingMonevDashboard';
import { RegulationDatabasePage } from './components/RegulationDatabasePage';
import { SetdaAdminDashboard } from './components/SetdaAdminDashboard';
import { MobileBottomNav } from './components/MobileBottomNav';
import { LoginWelcomeSplash } from './components/LoginWelcomeSplash';
import { Institution, Proposal, Regulation } from './types';
import { dbService } from './services/apiService';

export function App() {
  // Session State (null = show Login Page)
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [showSplash, setShowSplash] = useState<boolean>(false);
  
  // Navigation Active Tab State
  const [activeTab, setActiveTab] = useState<'overview' | 'registration' | 'proposal' | 'tracking' | 'regulations' | 'setda_admin'>('overview');
  
  // App Global State Data
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [regulations, setRegulations] = useState<Regulation[]>([]);
  const [isLoadingDb, setIsLoadingDb] = useState<boolean>(true);

  // Smooth scroll to top when activeTab changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  // Fetch Database Initial Data on Load
  useEffect(() => {
    async function loadDatabaseData() {
      setIsLoadingDb(true);
      try {
        const [instData, propData, regData] = await Promise.all([
          dbService.getInstitutions(),
          dbService.getProposals(),
          dbService.getRegulations(),
        ]);
        setInstitutions(instData);
        setProposals(propData);
        setRegulations(regData);
      } catch (error) {
        console.error('Failed to load database data:', error);
      } finally {
        setIsLoadingDb(false);
      }
    }
    loadDatabaseData();
  }, []);

  const handleLoginSuccess = (session: UserSession) => {
    setCurrentUser(session);
    setShowSplash(true);
    if (session.role === 'TKKSD_ADMIN') {
      setActiveTab('setda_admin');
    } else {
      setActiveTab('overview');
    }
  };

  const handleRegisterSuccess = async (newInst: Institution) => {
    const savedInst = await dbService.saveInstitution(newInst);
    setInstitutions(prev => [savedInst, ...prev.filter(i => i.id !== savedInst.id)]);

    // Automatically create tracking proposal entry so registered institution immediately appears in Tracking Dashboard
    const autoRegistrationCode = `PRP-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(Math.floor(100 + Math.random() * 900))}`;
    const initialProposal: Proposal = {
      id: `prop-${Date.now()}`,
      institutionId: savedInst.id || `inst-${Date.now()}`,
      institutionName: savedInst.name,
      institutionCategory: savedInst.category,
      registrationCode: autoRegistrationCode,
      title: `Registrasi & Permohonan Kemitraan - ${savedInst.name}`,
      sector: 'DIGITAL_TEKNOLOGI',
      description: `Registrasi resmi lembaga ${savedInst.name} beserta 2 (dua) PIC ber-Surat Tugas TKKSD Kabupaten Gunungkidul. Masuk antrean verifikasi administrasi TKKSD.`,
      targetLocation: `${savedInst.city || 'Wonosari'}, ${savedInst.province || 'D.I. Yogyakarta'}`,
      budgetEstimate: 0,
      durationMonths: 12,
      status: 'VERIFICATION_FILES',
      documentSuratPermohonanUrl: `Surat_Permohonan_${savedInst.name.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`,
      documentProposalUrl: `Proposal_Kemitraan_${savedInst.name.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`,
      documentLegalUrl: `Legalitas_${savedInst.registrationNo?.replace(/[^a-zA-Z0-9]/g, '_') || 'NIB'}.pdf`,
      documentSuratBebasSengketaUrl: `Surat_Bebas_Sengketa_${savedInst.name.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`,
      submittedAt: new Date().toISOString(),
      logs: [
        {
          id: `log-${Date.now()}`,
          proposalId: `prop-${Date.now()}`,
          status: 'VERIFICATION_FILES',
          actorName: 'Sistem MEMITRAN',
          actorRole: 'Registrasi Berkas TKKSD',
          comment: `Pendaftaran instansi ${savedInst.name} dan 2 PIC resmi berhasil terverifikasi. Berkas masuk antrean verifikasi administrasi Sekretariat TKKSD Setda Gunungkidul.`,
          createdAt: new Date().toISOString()
        }
      ],
      monevReports: []
    };

    const savedProp = await dbService.saveProposal(initialProposal);
    setProposals(prev => [savedProp, ...prev.filter(p => p.id !== savedProp.id)]);
  };

  const handleProposalSubmitSuccess = async (newProp: Proposal) => {
    const savedProp = await dbService.saveProposal(newProp);
    setProposals(prev => [savedProp, ...prev.filter(p => p.id !== savedProp.id)]);
  };

  const handleUpdateProposal = async (updated: Proposal) => {
    // Cari proposal lama di state
    const original = proposals.find(p => p.id === updated.id);
    if (!original) {
      const savedProp = await dbService.saveProposal(updated);
      setProposals(prev => [savedProp, ...prev.filter(p => p.id !== savedProp.id)]);
      return;
    }

    let savedProp: Proposal;
    
    // 1. Cek apakah ada penambahan MonevReport
    if (updated.monevReports.length > original.monevReports.length) {
      const newReport = updated.monevReports[updated.monevReports.length - 1];
      savedProp = await dbService.addMonevReport(updated.id, {
        period: newReport.period,
        progressPercentage: newReport.progressPercentage,
        indicator: newReport.indicator,
        achievementDetails: newReport.achievementDetails,
        obstacle: newReport.obstacle,
        solution: newReport.solution,
        reportFileUrl: newReport.reportFileUrl,
        evaluatedBy: newReport.evaluatedBy
      });
    } 
    // 2. Cek apakah ada perubahan status
    else if (updated.status !== original.status) {
      const newLog = updated.logs[0]; // Log baru biasanya berada di index pertama
      savedProp = await dbService.updateProposalStatus(
        updated.id,
        updated.status,
        newLog?.actorName || 'Staff Setda',
        newLog?.actorRole || 'Verifikator TKKSD',
        newLog?.comment || 'Status proposal diperbarui.'
      );
    } 
    // 3. Fallback jika tidak ada perubahan spesifik
    else {
      savedProp = await dbService.saveProposal(updated);
    }

    setProposals(prev => prev.map(p => p.id === savedProp.id ? savedProp : p));
  };

  // If not logged in, show Login Gate
  if (!currentUser) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  const pendingApprovalCount = proposals.filter(p => p.status === 'VERIFICATION_FILES' || p.status === 'REVIEW_DINAS').length;

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-amber-500 selection:text-white relative overflow-hidden bg-slate-100">
      
      {/* Login Welcome Splash Screen Overlay with Animated Gunungkidul Emblem Logo */}
      {showSplash && currentUser && (
        <LoginWelcomeSplash 
          user={currentUser} 
          onComplete={() => setShowSplash(false)} 
        />
      )}

      {/* Light Glassmorphism Ambient Glow Background Blobs */}
      <div className="ambient-glow-amber top-10 left-[-100px]" />
      <div className="ambient-glow-blue top-[400px] right-[-150px]" />
      <div className="ambient-glow-amber bottom-[100px] left-[20%]" />

      {/* Navigation Bar */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        user={currentUser}
        onLogout={() => setCurrentUser(null)}
        pendingApprovalCount={pendingApprovalCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div key={activeTab} className="animate-tab-switch">
          
          {/* DEDICATED STAFF SETDA / TKKSD APPROVAL PORTAL */}
          {activeTab === 'setda_admin' && currentUser.role === 'TKKSD_ADMIN' && (
            <SetdaAdminDashboard
              user={currentUser}
              proposals={proposals}
              onUpdateProposal={handleUpdateProposal}
            />
          )}

          {/* OVERVIEW HERO & STACKED CARDS DASHBOARD SECTION */}
          {activeTab === 'overview' && (
            <OverviewDashboard
              user={currentUser}
              onNavigateTab={setActiveTab}
              pendingApprovalCount={pendingApprovalCount}
            />
          )}

          {/* REGISTRATION FORM VIEW (MITRA ONLY) */}
          {activeTab === 'registration' && currentUser.role !== 'TKKSD_ADMIN' && (
            <RegistrationMultiStepForm onSuccess={handleRegisterSuccess} onNavigateTab={setActiveTab} />
          )}

          {/* PROPOSAL SUBMISSION VIEW (MITRA ONLY) */}
          {activeTab === 'proposal' && currentUser.role !== 'TKKSD_ADMIN' && (
            <ProposalSubmissionForm
              registeredInstitutions={institutions}
              onSubmitSuccess={handleProposalSubmitSuccess}
            />
          )}

          {/* TRACKING & MONEV DASHBOARD VIEW */}
          {activeTab === 'tracking' && (
            <TrackingMonevDashboard
              proposals={proposals}
              onUpdateProposal={handleUpdateProposal}
            />
          )}

          {/* REGULATION & DATABASE CATALOG VIEW */}
          {activeTab === 'regulations' && (
            <RegulationDatabasePage
              regulations={regulations}
              activeProposals={proposals.filter(p => p.status === 'APPROVED' || p.status === 'MONEV_PHASE')}
            />
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 glass-panel py-6 mt-12 text-center text-xs text-slate-600 space-y-1 relative z-10 mb-16 md:mb-0">
        <div className="flex items-center justify-center space-x-2 mb-1">
          <img src="/logo-gunungkidul.svg" alt="Logo" className="w-5 h-6 object-contain" />
          <p className="font-bold text-slate-900">MEMITRAN — Pemerintah Kabupaten Gunungkidul</p>
        </div>
        <p className="text-[10px] text-slate-600 font-medium">Tim Kerja Sama Daerah (TKKSD) Kabupaten Gunungkidul • D.I. Yogyakarta</p>
      </footer>

      {/* Mobile Bottom Navigation Bar (Android & iOS App Experience) */}
      <MobileBottomNav 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        user={currentUser} 
        pendingApprovalCount={pendingApprovalCount}
      />
    </div>
  );
}

export default App;
