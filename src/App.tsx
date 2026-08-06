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
    const savedProp = await dbService.saveProposal(updated);
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
        
        {/* DEDICATED STAFF SETDA / TKKSD APPROVAL PORTAL */}
        {activeTab === 'setda_admin' && currentUser.role === 'TKKSD_ADMIN' && (
          <SetdaAdminDashboard
            user={currentUser}
            proposals={proposals}
            onUpdateProposal={handleUpdateProposal}
          />
        )}

        {/* OVERVIEW HERO SECTION */}
        {activeTab === 'overview' && (
          <div className="space-y-8 md:space-y-12 animate-fade-in">
            
            {/* MOBILE ONLY (SMARTPHONE UI): Mobile App Quick Access Dashboard */}
            <div className="md:hidden space-y-4">
              {/* Mobile Welcome Banner */}
              <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-white rounded-2xl p-4 shadow-lg flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider opacity-90">MEMITRAN Mobile Portal</span>
                  <h2 className="text-lg font-extrabold leading-tight">Halo, {currentUser.name.split(',')[0]}</h2>
                  <p className="text-[11px] opacity-90 font-medium">
                    {currentUser.role === 'TKKSD_ADMIN' ? 'Verifikator TKKSD Setda' : currentUser.institutionName}
                  </p>
                </div>
                <div className="w-12 h-14 bg-white/20 backdrop-blur-md rounded-xl p-1 shrink-0 flex items-center justify-center border border-white/30 shadow-xs">
                  <img src="/logo-gunungkidul.svg" alt="Logo" className="w-full h-full object-contain" />
                </div>
              </div>

              {/* 4 Mobile Shortcut Touch Cards */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setActiveTab('registration')}
                  className="bg-white hover:bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200 shadow-xs flex flex-col justify-between text-left space-y-2 cursor-pointer transition active:scale-95"
                >
                  <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-xs text-slate-900">Registrasi Instansi</h3>
                    <p className="text-[10px] text-slate-500 font-medium">Daftar Lembaga & 2 PIC</p>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('proposal')}
                  className="bg-white hover:bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200 shadow-xs flex flex-col justify-between text-left space-y-2 cursor-pointer transition active:scale-95"
                >
                  <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
                    <FilePlus className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-xs text-slate-900">Ajukan Proposal</h3>
                    <p className="text-[10px] text-slate-500 font-medium">Checklist Permendagri</p>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('tracking')}
                  className="bg-white hover:bg-sky-50/80 p-3.5 rounded-2xl border border-sky-200 shadow-xs flex flex-col justify-between text-left space-y-2 cursor-pointer transition active:scale-95"
                >
                  <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-xs text-slate-900">Tracking Proposal</h3>
                    <p className="text-[10px] text-slate-500 font-medium">Status & Monev Real-time</p>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('regulations')}
                  className="bg-white hover:bg-emerald-50/80 p-3.5 rounded-2xl border border-emerald-200 shadow-xs flex flex-col justify-between text-left space-y-2 cursor-pointer transition active:scale-95"
                >
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-xs text-slate-900">Katalog Regulasi</h3>
                    <p className="text-[10px] text-slate-500 font-medium">Permendagri & Perda KSDPK</p>
                  </div>
                </button>
              </div>

              {currentUser.role === 'TKKSD_ADMIN' && (
                <button
                  onClick={() => setActiveTab('setda_admin')}
                  className="w-full p-3.5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl font-extrabold text-xs flex items-center justify-between shadow-md cursor-pointer active:scale-95 transition"
                >
                  <div className="flex items-center space-x-2">
                    <CheckSquare className="w-5 h-5" />
                    <span>Portal ACC & Verifikasi Staff Setda</span>
                  </div>
                  <span className="bg-white/20 px-2 py-0.5 rounded text-[10px]">Buka Dashboard &rarr;</span>
                </button>
              )}
            </div>

            {/* Hero Card with Official Logo Light Mode */}
            <div className="glass-panel rounded-3xl p-6 sm:p-8 lg:p-12 relative overflow-hidden shadow-xl border border-amber-500/30">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
                
                <div className="max-w-2xl space-y-6">
                  <div className="inline-flex items-center space-x-2 glass-badge px-3.5 py-1 rounded-full text-xs font-bold border-amber-400 text-amber-800 bg-amber-50">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>MEMITRAN • Kepatuhan Permendagri No. 22 Tahun 2020</span>
                  </div>

                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                    Pengelolaan & Verifikasi <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 bg-clip-text text-transparent">Kerja Sama Daerah</span> Gunungkidul
                  </h1>

                  <p className="text-slate-700 text-sm sm:text-base leading-relaxed font-normal">
                    Platform layanan digital resmi Tim Kerja Sama Daerah (TKKSD) Kabupaten Gunungkidul yang mengacu penuh pada <strong>Permendagri No. 22 Tahun 2020</strong> dan <strong>Perda KSDPK</strong> untuk mengelola usulan kemitraan daerah multi-sektor (*DUDI, Akademisi, Komunitas, UMKM*).
                  </p>
                </div>

                {/* Hero Lambang Gunungkidul Display */}
                <div className="w-48 h-60 shrink-0 glass-card p-6 rounded-3xl flex flex-col items-center justify-center text-center space-y-3 border border-amber-300 shadow-xl bg-white/80">
                  <img 
                    src="/logo-gunungkidul.svg" 
                    alt="Lambang Daerah Kabupaten Gunungkidul" 
                    className="w-28 h-36 object-contain filter drop-shadow-xl hover:scale-105 transition"
                  />
                  <div className="text-[11px] font-extrabold text-amber-800">
                    DHAKSINARGA BHUMIKARTA
                  </div>
                </div>

              </div>
            </div>

            {/* 4 Pilar Kemitraan Sektor */}
            <div className="space-y-4">
              <div className="text-center max-w-xl mx-auto space-y-1">
                <h2 className="text-xl font-extrabold text-slate-900">4 Pilar Kemitraan Multi-Sektor</h2>
                <p className="text-slate-600 text-xs font-medium">Mendorong percepatan pembangunan Kabupaten Gunungkidul berbasis kolaborasi inklusif</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="glass-card p-5 rounded-2xl space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-lg border border-amber-300">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-900">DUDI / Swasta</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Investasi pariwisata, CSR/TJSL daerah, infrastruktur publik, dan teknologi ramah lingkungan.
                  </p>
                </div>

                <div className="glass-card p-5 rounded-2xl space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-lg border border-sky-300">
                    <Award className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-900">Akademisi / Riset</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Riset Geopark Gunungsewu, pengabdian masyarakat, magang mahasiswa, dan inovasi daerah.
                  </p>
                </div>

                <div className="glass-card p-5 rounded-2xl space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg border border-emerald-300">
                    <Users className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-900">Komunitas / LSM</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Pemberdayaan desa wisata, konservasi alam karst & laut, serta penguatan budaya lokal.
                  </p>
                </div>

                <div className="glass-card p-5 rounded-2xl space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-lg border border-orange-300">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-900">UMKM & Koperasi</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Pemasaran olahan pangan lokal, kerajinan batu & kayu, sertifikasi halal, dan pasar digital.
                  </p>
                </div>
              </div>
            </div>

            {/* Workflow Banner */}
            <div className="glass-panel p-6 rounded-2xl space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-amber-600" />
                <span>Alur Kerja Pengajuan & Verifikasi TKKSD Kabupaten Gunungkidul</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                <div className="glass-card p-4 rounded-xl space-y-1">
                  <span className="text-amber-700 font-bold font-mono">Tahap 1</span>
                  <h4 className="font-bold text-slate-900">Registrasi 2 PIC Resmi</h4>
                  <p className="text-slate-600 text-[11px]">Input data instansi, PIC Utama & Pendamping, upload Pasfoto & Surat Tugas TKKSD.</p>
                </div>

                <div className="glass-card p-4 rounded-xl space-y-1">
                  <span className="text-amber-700 font-bold font-mono">Tahap 2</span>
                  <h4 className="font-bold text-slate-900">Submit Proposal & Berkas</h4>
                  <p className="text-slate-600 text-[11px]">Input detail naskah usulan, sektor, anggaran, lokasi, dan dokumen legalitas PDF.</p>
                </div>

                <div className="glass-card p-4 rounded-xl space-y-1">
                  <span className="text-amber-700 font-bold font-mono">Tahap 3</span>
                  <h4 className="font-bold text-slate-900">Review Dinas & TKKSD</h4>
                  <p className="text-slate-600 text-[11px]">Kajian teknis oleh sub-komisi dinas terkait dan sidang pleno persetujuan PKS.</p>
                </div>

                <div className="glass-card p-4 rounded-xl space-y-1">
                  <span className="text-emerald-700 font-bold font-mono">Tahap 4</span>
                  <h4 className="font-bold text-slate-900">Monev Berkala</h4>
                  <p className="text-slate-600 text-[11px]">Pelaksanaan program, input progress triwulanan %, dan evaluasi lapangan.</p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* REGISTRATION FORM VIEW */}
        {activeTab === 'registration' && (
          <RegistrationMultiStepForm onSuccess={handleRegisterSuccess} onNavigateTab={setActiveTab} />
        )}

        {/* PROPOSAL SUBMISSION VIEW */}
        {activeTab === 'proposal' && (
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
