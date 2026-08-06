import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  FileText, 
  Search, 
  Filter, 
  MessageSquare, 
  AlertCircle, 
  FileCheck2, 
  Building2, 
  UserCheck, 
  Eye, 
  Sparkles,
  ChevronRight,
  Send,
  History,
  Tag,
  DollarSign,
  Calendar,
  FolderCheck,
  Download,
  X,
  Bell
} from 'lucide-react';
import { Proposal, ProposalStatus, ProposalLog } from '../types';
import { UserSession } from './LoginPage';
import { downloadDocument } from '../utils/downloadHelper';

interface SetdaAdminDashboardProps {
  user: UserSession;
  proposals: Proposal[];
  onUpdateProposal: (updated: Proposal) => void;
}

export const SetdaAdminDashboard: React.FC<SetdaAdminDashboardProps> = ({ 
  user, 
  proposals, 
  onUpdateProposal 
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [tabFilter, setTabFilter] = useState<'BELUM_ACC' | 'APPROVED' | 'REJECTED' | 'ALL'>('BELUM_ACC');
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(proposals[0] || null);

  // Approval Modal State
  const [showActionModal, setShowActionModal] = useState<boolean>(false);
  const [targetAction, setTargetAction] = useState<'APPROVE_NEXT' | 'APPROVE_FINAL' | 'REJECT'>('APPROVE_NEXT');
  const [reviewerComment, setReviewerComment] = useState<string>('');
  const [actorRole, setActorRole] = useState<string>('Staff Sekretariat TKKSD Setda');

  // Categorize Proposals
  const pendingCount = proposals.filter(p => p.status === 'VERIFICATION_FILES' || p.status === 'REVIEW_DINAS').length;
  const approvedCount = proposals.filter(p => p.status === 'APPROVED' || p.status === 'MONEV_PHASE').length;
  const rejectedCount = proposals.filter(p => p.status === 'REJECTED').length;

  const filteredProposals = proposals.filter((p) => {
    const matchesSearch = 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.registrationCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.institutionName.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (tabFilter === 'BELUM_ACC') {
      return matchesSearch && (p.status === 'VERIFICATION_FILES' || p.status === 'REVIEW_DINAS');
    }
    if (tabFilter === 'APPROVED') {
      return matchesSearch && (p.status === 'APPROVED' || p.status === 'MONEV_PHASE');
    }
    if (tabFilter === 'REJECTED') {
      return matchesSearch && p.status === 'REJECTED';
    }
    return matchesSearch;
  });

  const handleOpenActionModal = (action: 'APPROVE_NEXT' | 'APPROVE_FINAL' | 'REJECT') => {
    setTargetAction(action);
    if (action === 'APPROVE_NEXT') {
      setReviewerComment('Seluruh 4 berkas persyaratan regulasi (Permendagri No. 22 Th 2020) & Surat Tugas 2 PIC resmi telah diverifikasi LENGKAP & SAH. Diteruskan ke Sub-Komisi Dinas Terkait.');
    } else if (action === 'APPROVE_FINAL') {
      setReviewerComment('Usulan kerja sama disetujui. Naskah Perjanjian Kerja Sama (PKS) diterbitkan.');
    } else {
      setReviewerComment('Berkas dikembalikan untuk perbaikan. Harap melengkapi dokumen legalitas dan perbaikan proposal.');
    }
    setShowActionModal(true);
  };

  const handleConfirmApprovalAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProposal) return;

    let newStatus: ProposalStatus = selectedProposal.status;
    if (targetAction === 'APPROVE_NEXT') {
      newStatus = selectedProposal.status === 'VERIFICATION_FILES' ? 'REVIEW_DINAS' : 'APPROVED';
    } else if (targetAction === 'APPROVE_FINAL') {
      newStatus = 'APPROVED';
    } else if (targetAction === 'REJECT') {
      newStatus = 'REJECTED';
    }

    const newLog: ProposalLog = {
      id: `log-${Date.now()}`,
      proposalId: selectedProposal.id,
      status: newStatus,
      actorName: user.name,
      actorRole: actorRole,
      comment: reviewerComment,
      createdAt: new Date().toISOString()
    };

    const updatedProposal: Proposal = {
      ...selectedProposal,
      status: newStatus,
      logs: [newLog, ...selectedProposal.logs]
    };

    onUpdateProposal(updatedProposal);
    setSelectedProposal(updatedProposal);
    setShowActionModal(false);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Top Banner Verification Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-500/10 via-white to-sky-500/10 border border-amber-500/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-2xl">
          <div className="inline-flex items-center space-x-2 glass-badge px-3 py-0.5 rounded-full text-[11px] font-bold border-amber-400 text-amber-800 bg-amber-50">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
            <span>KEPATUHAN REGULASI: PERMENDAGRI NO. 22 TAHUN 2020 & PERDA KSDPK</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Portal Verifikasi & Persetujuan Staff Setda
          </h1>
          <p className="text-xs sm:text-sm text-slate-700 font-medium">
            Pemeriksaan 4 kelengkapan berkas persyaratan regulasi dan pemberian ACC usulan kerja sama Kabupaten Gunungkidul.
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-4 py-3 rounded-2xl text-center shadow-lg border border-amber-400 flex items-center space-x-3">
            <div className="p-2 bg-white/20 backdrop-blur-md rounded-xl relative shrink-0">
              <Bell className="w-5 h-5 text-white" />
              {pendingCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full animate-ping border border-white" />
              )}
            </div>
            <div className="text-left">
              <span className="text-[10px] uppercase tracking-wider font-extrabold block text-amber-100">Antrean Perlu ACC</span>
              <span className="text-xl font-black leading-tight">{pendingCount} <span className="text-xs text-amber-100 font-bold">Usulan Baru</span></span>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => setTabFilter('BELUM_ACC')}
          className={`glass-card p-4 rounded-2xl text-left border transition cursor-pointer ${
            tabFilter === 'BELUM_ACC' ? 'bg-amber-100/90 border-amber-500 shadow-md ring-2 ring-amber-500/20' : 'bg-white/80 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-700">Belum di-ACC (Pending)</span>
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
          <h3 className="text-2xl font-black text-amber-900 mt-1">{pendingCount} <span className="text-xs text-slate-500 font-bold">Usulan</span></h3>
        </button>

        <button
          onClick={() => setTabFilter('APPROVED')}
          className={`glass-card p-4 rounded-2xl text-left border transition cursor-pointer ${
            tabFilter === 'APPROVED' ? 'bg-emerald-100/90 border-emerald-500 shadow-md ring-2 ring-emerald-500/20' : 'bg-white/80 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-700">Telah Disetujui (ACC)</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <h3 className="text-2xl font-black text-emerald-900 mt-1">{approvedCount} <span className="text-xs text-slate-500 font-bold">PKS Aktif</span></h3>
        </button>

        <button
          onClick={() => setTabFilter('REJECTED')}
          className={`glass-card p-4 rounded-2xl text-left border transition cursor-pointer ${
            tabFilter === 'REJECTED' ? 'bg-rose-100/90 border-rose-500 shadow-md ring-2 ring-rose-500/20' : 'bg-white/80 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-700">Perlu Perbaikan</span>
            <XCircle className="w-5 h-5 text-rose-600" />
          </div>
          <h3 className="text-2xl font-black text-rose-900 mt-1">{rejectedCount} <span className="text-xs text-slate-500 font-bold">Berkas</span></h3>
        </button>
      </div>

      {/* Main Grid: Left Filtered Queue List, Right Examination & Approval Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Queue List & Search (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel p-4 sm:p-5 rounded-3xl space-y-4 bg-white/90 shadow-lg">
            
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-amber-600" />
                <span>Antrean Verifikasi Proposal</span>
              </h3>
              <span className="text-[10px] text-slate-500 font-bold bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                {filteredProposals.length} Berkas
              </span>
            </div>

            {/* Filter Tabs */}
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-[11px] font-bold">
              <button
                onClick={() => setTabFilter('BELUM_ACC')}
                className={`flex-1 py-1.5 rounded-lg transition cursor-pointer ${tabFilter === 'BELUM_ACC' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Belum ACC ({pendingCount})
              </button>
              <button
                onClick={() => setTabFilter('APPROVED')}
                className={`flex-1 py-1.5 rounded-lg transition cursor-pointer ${tabFilter === 'APPROVED' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Disetujui ({approvedCount})
              </button>
              <button
                onClick={() => setTabFilter('ALL')}
                className={`flex-1 py-1.5 rounded-lg transition cursor-pointer ${tabFilter === 'ALL' ? 'bg-slate-800 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Semua
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Cari kode registrasi, nama instansi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full glass-input rounded-xl pl-10 pr-3 py-2.5 text-xs text-slate-900 font-medium placeholder-slate-400"
              />
            </div>

            {/* Proposal Queue Cards */}
            <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1">
              {filteredProposals.length > 0 ? (
                filteredProposals.map((p) => {
                  const isSelected = selectedProposal?.id === p.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => setSelectedProposal(p)}
                      className={`p-4 rounded-2xl border transition cursor-pointer ${
                        isSelected
                          ? 'bg-amber-50/90 border-amber-500 shadow-md ring-2 ring-amber-500/20'
                          : 'bg-white/80 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded border border-amber-300">
                          {p.registrationCode}
                        </span>
                        <span className={`text-[10px] px-2.5 py-0.5 rounded font-extrabold ${
                          p.status === 'APPROVED' || p.status === 'MONEV_PHASE' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' :
                          p.status === 'REJECTED' ? 'bg-rose-100 text-rose-900 border border-rose-300' :
                          'bg-amber-100 text-amber-900 border border-amber-300'
                        }`}>
                          {p.status === 'VERIFICATION_FILES' ? 'PERLU ACC ADM' :
                           p.status === 'REVIEW_DINAS' ? 'REVIEW SUB-KOMISI' :
                           p.status === 'APPROVED' ? 'DI-ACC / PKS' :
                           p.status === 'REJECTED' ? 'PERLU PERBAIKAN' : 'MONEV AKTIF'}
                        </span>
                      </div>

                      <h4 className="text-xs font-extrabold text-slate-900 line-clamp-2 mb-1.5 leading-snug">
                        {p.title}
                      </h4>

                      <div className="flex items-center justify-between text-[10px] text-slate-600 font-semibold pt-1 border-t border-slate-100">
                        <span className="flex items-center gap-1 text-slate-800">
                          <Building2 className="w-3 h-3 text-amber-600" />
                          {p.institutionName}
                        </span>
                        <span className="text-slate-500 font-mono">
                          {new Date(p.submittedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-10 text-slate-500 text-xs font-medium bg-white/50 rounded-2xl border border-dashed border-slate-300 p-4">
                  Tidak ada usulan proposal dalam kriteria antrean ini.
                </div>
              )}
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN: Examination Checklist & Action Approval Panel (7 cols) */}
        <div className="lg:col-span-7">
          {selectedProposal ? (
            <div className="glass-panel p-6 rounded-3xl space-y-6 bg-white/90 shadow-lg border border-amber-500/30">
              
              {/* Proposal Header Details */}
              <div className="border-b border-slate-200 pb-4">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-mono font-bold text-amber-900 bg-amber-100 px-3 py-1 rounded-lg border border-amber-300">
                    {selectedProposal.registrationCode}
                  </span>
                  <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                    Tanggal Masuk: {new Date(selectedProposal.submittedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </div>

                <h2 className="text-lg font-black text-slate-900 leading-snug mb-2">
                  {selectedProposal.title}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs font-medium">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 font-bold block uppercase">Lembaga Pengaju</span>
                    <p className="font-extrabold text-slate-900 truncate">{selectedProposal.institutionName}</p>
                  </div>

                  <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                    <span className="text-[10px] text-emerald-800 font-bold block uppercase">Estimasi Nilai Investasi</span>
                    <p className="font-black text-emerald-900">
                      Rp {selectedProposal.budgetEstimate.toLocaleString('id-ID')}
                    </p>
                  </div>

                  <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                    <span className="text-[10px] text-amber-800 font-bold block uppercase">Sektor Kemitraan</span>
                    <p className="font-extrabold text-amber-900">{selectedProposal.sector.replace('_', ' ')}</p>
                  </div>
                </div>
              </div>

              {/* ACTION BUTTONS FOR STAFF SETDA */}
              <div className="bg-amber-50/90 border border-amber-300 rounded-2xl p-5 space-y-3 shadow-xs">
                <h4 className="text-xs font-black uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>Tindakan Keputusan Staff Setda (ACC / Minta Perbaikan)</span>
                </h4>

                <div className="flex flex-wrap gap-2.5 pt-1">
                  {selectedProposal.status === 'VERIFICATION_FILES' && (
                    <button
                      onClick={() => handleOpenActionModal('APPROVE_NEXT')}
                      className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center space-x-2 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>ACC & Teruskan ke Review Sub-Komisi</span>
                    </button>
                  )}

                  {selectedProposal.status === 'REVIEW_DINAS' && (
                    <button
                      onClick={() => handleOpenActionModal('APPROVE_FINAL')}
                      className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center space-x-2 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>ACC Final & Terbitkan Naskah PKS</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleOpenActionModal('REJECT')}
                    className="px-5 py-3 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center space-x-2 cursor-pointer"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Tolak / Minta Perbaikan Berkas</span>
                  </button>
                </div>
              </div>

              {/* CHECKLIST REGULASI PERMENDAGRI NO. 22 TAHUN 2020 */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900 flex items-center gap-2">
                      <FolderCheck className="w-4 h-4 text-amber-600" />
                      <span>Checklist 4 Berkas Verifikasi Regulasi Permendagri 22/2020</span>
                    </h4>
                    <p className="text-[11px] text-slate-500 font-medium">Persyaratan administrasi resmi TKKSD Kabupaten Gunungkidul.</p>
                  </div>

                  <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-1 rounded-lg font-extrabold">
                    Syarat Mutlak
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  
                  {/* Card 1 */}
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5">
                    <span className="text-[10px] text-slate-500 font-bold block uppercase">1. Surat Permohonan Resmi (LoI):</span>
                    <span className="font-extrabold text-slate-900 block truncate">
                      {selectedProposal.documentSuratPermohonanUrl || 'Surat_Permohonan_Bupati.pdf'}
                    </span>
                    <button 
                      onClick={() => downloadDocument(
                        selectedProposal.documentSuratPermohonanUrl || 'Surat_Permohonan_Bupati.pdf', 
                        `Surat Permohonan Resmi - ${selectedProposal.title}`,
                        `Surat Permohonan / Letter of Intent (LoI) Resmi Bupati untuk pengajuan kerja sama: "${selectedProposal.title}". Diajukan oleh ${selectedProposal.institutionName}.`
                      )} 
                      className="text-[11px] text-amber-800 font-bold hover:underline flex items-center gap-1.5 cursor-pointer bg-white px-2.5 py-1 rounded-lg border border-amber-300 shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5 text-amber-700" /> Unduh PDF
                    </button>
                  </div>

                  {/* Card 2 */}
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5">
                    <span className="text-[10px] text-slate-500 font-bold block uppercase">2. Naskah Proposal Lengkap:</span>
                    <span className="font-extrabold text-slate-900 block truncate">{selectedProposal.documentProposalUrl}</span>
                    <button 
                      onClick={() => downloadDocument(
                        selectedProposal.documentProposalUrl, 
                        `Naskah Proposal - ${selectedProposal.title}`,
                        `Naskah Proposal Kerja Sama Lengkap Sektor ${selectedProposal.sector}. Judul: "${selectedProposal.title}". Nilai Investasi: Rp ${selectedProposal.budgetEstimate.toLocaleString('id-ID')}. Deskripsi: ${selectedProposal.description}`
                      )} 
                      className="text-[11px] text-amber-800 font-bold hover:underline flex items-center gap-1.5 cursor-pointer bg-white px-2.5 py-1 rounded-lg border border-amber-300 shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5 text-amber-700" /> Unduh PDF
                    </button>
                  </div>

                  {/* Card 3 */}
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5">
                    <span className="text-[10px] text-slate-500 font-bold block uppercase">3. Dokumen Legalitas (NIB/NPWP):</span>
                    <span className="font-extrabold text-slate-900 block truncate">{selectedProposal.documentLegalUrl}</span>
                    <button 
                      onClick={() => downloadDocument(
                        selectedProposal.documentLegalUrl, 
                        `Dokumen Legalitas - ${selectedProposal.institutionName}`,
                        `Berkas Legalitas Resmi (NIB / SK Kemenkumham / NPWP / Akta Pendirian) untuk lembaga mitra pengaju: ${selectedProposal.institutionName}.`
                      )} 
                      className="text-[11px] text-amber-800 font-bold hover:underline flex items-center gap-1.5 cursor-pointer bg-white px-2.5 py-1 rounded-lg border border-amber-300 shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5 text-amber-700" /> Unduh PDF
                    </button>
                  </div>

                  {/* Card 4 */}
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5">
                    <span className="text-[10px] text-slate-500 font-bold block uppercase">4. Pernyataan Bebas Sengketa:</span>
                    <span className="font-extrabold text-slate-900 block truncate">
                      {selectedProposal.documentSuratBebasSengketaUrl || 'Surat_Bebas_Sengketa.pdf'}
                    </span>
                    <button 
                      onClick={() => downloadDocument(
                        selectedProposal.documentSuratBebasSengketaUrl || 'Surat_Bebas_Sengketa.pdf', 
                        `Surat Bebas Sengketa Hukum - ${selectedProposal.institutionName}`,
                        `Surat Pernyataan Bebas Sengketa Hukum Bermaterai Resmi sesuai Permendagri No. 22 Tahun 2020 untuk pengajuan kerja sama oleh ${selectedProposal.institutionName}.`
                      )} 
                      className="text-[11px] text-amber-800 font-bold hover:underline flex items-center gap-1.5 cursor-pointer bg-white px-2.5 py-1 rounded-lg border border-amber-300 shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5 text-amber-700" /> Unduh PDF
                    </button>
                  </div>

                </div>
              </div>

              {/* AUDIT LOG RIWAYAT CATATAN REVIEW */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold text-slate-900 flex items-center gap-2">
                  <History className="w-4 h-4 text-amber-600" />
                  <span>Histori Catatan Verifikasi & Review Staff</span>
                </h4>

                <div className="space-y-2 max-h-[220px] overflow-y-auto">
                  {selectedProposal.logs.map((log) => (
                    <div key={log.id} className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs space-y-1">
                      <div className="flex justify-between text-[10px] text-slate-500 border-b border-slate-200 pb-1 font-bold">
                        <span className="text-amber-800">{log.actorName} ({log.actorRole})</span>
                        <span>{new Date(log.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </div>
                      <p className="text-slate-800 font-medium">{log.comment}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="glass-panel p-10 rounded-3xl text-center text-slate-500 text-xs font-medium bg-white">
              Pilih salah satu usulan proposal dari antrean di kolom sebelah kiri untuk melakukan pemeriksaan berkas dan memberikan keputusan ACC.
            </div>
          )}
        </div>

      </div>

      {/* MODAL ACTION APPROVAL / REJECTION (CLEAN NEUMORPHIC SOFT UI) */}
      {showActionModal && selectedProposal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4 z-[100] animate-fade-in">
          <div className="bg-slate-50 max-w-lg w-full rounded-3xl p-6 sm:p-7 space-y-5 border border-slate-200/60 shadow-2xl relative overflow-hidden">
            
            {/* Executive Neumorphic Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-200/60 pb-4 relative z-10">
              <div className="flex items-center space-x-3">
                <div className={`p-2.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs ${
                  targetAction === 'REJECT' 
                    ? 'text-rose-600' 
                    : 'text-emerald-600'
                }`}>
                  {targetAction === 'REJECT' ? (
                    <XCircle className="w-6 h-6" />
                  ) : (
                    <CheckCircle2 className="w-6 h-6" />
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 tracking-tight">
                    {targetAction === 'REJECT' ? 'Konfirmasi Penolakan / Perbaikan Berkas' : 'Konfirmasi ACC Proposal Kerja Sama'}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-semibold mt-0.5">
                    Kode: <strong className="font-mono text-amber-900">{selectedProposal.registrationCode}</strong> • {selectedProposal.institutionName}
                  </p>
                </div>
              </div>

              <button 
                onClick={() => setShowActionModal(false)} 
                className="bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 p-2 rounded-xl transition cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmApprovalAction} className="space-y-4 relative z-10">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                  Jabatan / Wewenang Verifikator <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={actorRole}
                  onChange={(e) => setActorRole(e.target.value)}
                  className="w-full bg-white border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 rounded-2xl p-3 text-xs font-bold text-slate-900 transition"
                  placeholder="Masukkan jabatan resmi verifikator..."
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                  Catatan Resmi Reviewer Staff Setda <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={reviewerComment}
                  onChange={(e) => setReviewerComment(e.target.value)}
                  className="w-full bg-white border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 rounded-2xl p-3 text-xs font-semibold text-slate-900 leading-relaxed placeholder-slate-400 transition"
                  placeholder="Masukkan alasan persetujuan atau poin perbaikan berkas..."
                />
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowActionModal(false)}
                  className="px-5 py-3 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs rounded-2xl transition cursor-pointer"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  className={`flex-1 py-3.5 text-white font-extrabold text-xs rounded-2xl transition flex items-center justify-center space-x-2 cursor-pointer ${
                    targetAction === 'REJECT' 
                      ? 'neu-button-primary' 
                      : 'neu-button-emerald'
                  }`}
                >
                  {targetAction === 'REJECT' ? (
                    <>
                      <XCircle className="w-4 h-4" />
                      <span>Simpan Keputusan Penolakan</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Simpan & Berikan ACC Proposal</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
