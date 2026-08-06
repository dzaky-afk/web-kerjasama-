import React, { useState } from 'react';
import { 
  Activity, 
  Search, 
  Filter, 
  FileCheck, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  TrendingUp, 
  History, 
  ChevronRight, 
  Plus, 
  FileText, 
  BarChart3, 
  User, 
  Building2, 
  MessageSquare,
  Sparkles,
  AlertCircle,
  Eye,
  Calendar,
  Download,
  Layers,
  MapPin,
  Tag,
  X
} from 'lucide-react';
import { Proposal, ProposalStatus, MonevReport, MonevPeriod } from '../types';
import { downloadDocument } from '../utils/downloadHelper';

interface TrackingMonevDashboardProps {
  proposals: Proposal[];
  onUpdateProposal: (updated: Proposal) => void;
}

export const TrackingMonevDashboard: React.FC<TrackingMonevDashboardProps> = ({ 
  proposals, 
  onUpdateProposal 
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(proposals[0] || null);
  const [showLogModal, setShowLogModal] = useState<boolean>(false);
  const [showAddMonevModal, setShowAddMonevModal] = useState<boolean>(false);

  // Form State for new Monev Report
  const [monevPeriod, setMonevPeriod] = useState<MonevPeriod>('TRIWULAN_1');
  const [progressPercentage, setProgressPercentage] = useState<number>(75);
  const [indicator, setIndicator] = useState<string>('Tercapainya 80% sasaran program kemitraan daerah');
  const [achievementDetails, setAchievementDetails] = useState<string>('Telah dilaksanakan kegiatan tahap awal dengan tingkat keikutsertaan 150 peserta.');
  const [obstacle, setObstacle] = useState<string>('Penyesuaian jadwal sarana prasarana teknis lapangan.');
  const [solution, setSolution] = useState<string>('Fasilitasi dukungan pendampingan dari OPD teknis terkait.');

  // Timeline stage config
  const pipelineStages: { id: ProposalStatus; label: string; sub: string }[] = [
    { id: 'VERIFICATION_FILES', label: 'Verifikasi Berkas', sub: 'Administrasi TKKSD' },
    { id: 'REVIEW_DINAS', label: 'Review Sub-Komisi', sub: 'Kajian Teknis OPD' },
    { id: 'APPROVED', label: 'Disetujui / PKS', sub: 'Penandatanganan PKS' },
    { id: 'MONEV_PHASE', label: 'Monev Berkala', sub: 'Evaluasi Realisasi' }
  ];

  // Helper stage index
  const getStageIndex = (status: ProposalStatus): number => {
    switch (status) {
      case 'VERIFICATION_FILES': return 0;
      case 'REVIEW_DINAS': return 1;
      case 'APPROVED': return 2;
      case 'MONEV_PHASE': return 3;
      case 'REJECTED': return -1;
      default: return 0;
    }
  };

  // Filtered proposals list
  const filteredProposals = proposals.filter((p) => {
    const matchesSearch = 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.registrationCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.institutionName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddMonevReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProposal) {
      const newReport: MonevReport = {
        id: `monev-${Date.now()}`,
        proposalId: selectedProposal.id,
        period: monevPeriod,
        progressPercentage,
        indicator,
        achievementDetails,
        obstacle,
        solution,
        evaluatedBy: 'Tim Monev TKKSD / Sub-Komisi',
        evaluatedAt: new Date().toISOString()
      };

      const updatedLogs = [
        ...selectedProposal.logs,
        {
          id: `log-${Date.now()}`,
          proposalId: selectedProposal.id,
          status: selectedProposal.status,
          actorName: 'Tim Monev TKKSD',
          actorRole: 'Evaluator Lapangan',
          comment: `Laporan Monev ${monevPeriod} ditambahkan. Progress Capaian: ${progressPercentage}%.`,
          createdAt: new Date().toISOString()
        }
      ];

      const updatedProposal: Proposal = {
        ...selectedProposal,
        status: 'MONEV_PHASE',
        monevReports: [...selectedProposal.monevReports, newReport],
        logs: updatedLogs
      };

      onUpdateProposal(updatedProposal);
      setSelectedProposal(updatedProposal);
      setShowAddMonevModal(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl border border-amber-500/30">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center space-x-2 glass-badge px-3 py-0.5 rounded-full text-[11px] font-bold border-amber-400 text-amber-800 bg-amber-50">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>SISTEM INFORMASI KEMITRAN DAERAH (MEMITRAN)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Dashboard Real-Time Tracking & Monev
            </h1>
            <p className="text-xs sm:text-sm text-slate-700 font-medium">
              Pemantauan alur verifikasi berkas, persetujuan PKS, dan evaluasi capaian triwulanan secara transparan sesuai Permendagri No. 22 Tahun 2020.
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0 bg-white/90 p-3 rounded-2xl border border-amber-300 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Status Integrasi</span>
              <p className="text-xs font-black text-slate-900">100% Aktif & Terverifikasi</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Stat Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-2xl flex items-center justify-between border-l-4 border-l-amber-500 bg-white/90 shadow-sm">
          <div>
            <p className="text-[10px] uppercase tracking-wider font-bold text-slate-500">Total Usulan Proposal</p>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5">{proposals.length} <span className="text-xs text-slate-500 font-semibold">Berkas</span></h3>
          </div>
          <div className="p-3 bg-amber-100 text-amber-700 rounded-xl">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl flex items-center justify-between border-l-4 border-l-amber-600 bg-white/90 shadow-sm">
          <div>
            <p className="text-[10px] uppercase tracking-wider font-bold text-slate-500">Dalam Review TKKSD</p>
            <h3 className="text-2xl font-black text-amber-800 mt-0.5">
              {proposals.filter(p => p.status === 'REVIEW_DINAS' || p.status === 'VERIFICATION_FILES').length} <span className="text-xs text-slate-500 font-semibold">Usulan</span>
            </h3>
          </div>
          <div className="p-3 bg-amber-100 text-amber-700 rounded-xl">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl flex items-center justify-between border-l-4 border-l-emerald-500 bg-white/90 shadow-sm">
          <div>
            <p className="text-[10px] uppercase tracking-wider font-bold text-slate-500">PKS Disetujui</p>
            <h3 className="text-2xl font-black text-emerald-700 mt-0.5">
              {proposals.filter(p => p.status === 'APPROVED' || p.status === 'MONEV_PHASE').length} <span className="text-xs text-slate-500 font-semibold">Disetujui</span>
            </h3>
          </div>
          <div className="p-3 bg-emerald-100 text-emerald-700 rounded-xl">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl flex items-center justify-between border-l-4 border-l-sky-500 bg-white/90 shadow-sm">
          <div>
            <p className="text-[10px] uppercase tracking-wider font-bold text-slate-500">Evaluasi Monev Aktif</p>
            <h3 className="text-2xl font-black text-sky-800 mt-0.5">
              {proposals.filter(p => p.status === 'MONEV_PHASE').length} <span className="text-xs text-slate-500 font-semibold">Program</span>
            </h3>
          </div>
          <div className="p-3 bg-sky-100 text-sky-700 rounded-xl">
            <Activity className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Filter & Proposal Selection List (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel p-4 sm:p-5 rounded-3xl space-y-4 bg-white/90 shadow-lg">
            
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-amber-600" />
                <span>Daftar Usulan Kemitraan</span>
              </h3>
              <span className="text-[10px] text-slate-500 font-bold bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                {filteredProposals.length} ditemukan
              </span>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Cari kode registrasi, nama instansi, judul..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full glass-input rounded-xl pl-10 pr-3 py-2.5 text-xs text-slate-900 placeholder-slate-400 font-medium"
              />
            </div>

            {/* Status Filter Tabs */}
            <div className="flex overflow-x-auto pb-1 gap-1.5 no-scrollbar">
              {[
                { id: 'ALL', label: 'Semua' },
                { id: 'VERIFICATION_FILES', label: 'Verifikasi' },
                { id: 'REVIEW_DINAS', label: 'Review' },
                { id: 'APPROVED', label: 'Disetujui' },
                { id: 'MONEV_PHASE', label: 'Monev' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition cursor-pointer ${
                    statusFilter === tab.id
                      ? 'glass-button-primary text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Proposal List Cards */}
            <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
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
                          p.status === 'MONEV_PHASE' ? 'bg-sky-100 text-sky-900 border border-sky-300' :
                          p.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' :
                          p.status === 'REVIEW_DINAS' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                          'bg-slate-100 text-slate-700 border border-slate-300'
                        }`}>
                          {p.status === 'VERIFICATION_FILES' ? 'Verifikasi Berkas' :
                           p.status === 'REVIEW_DINAS' ? 'Review TKKSD' :
                           p.status === 'APPROVED' ? 'Disetujui' : 'Monev Aktif'}
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
                  Tidak ditemukan proposal usulan yang sesuai dengan kata kunci pencarian.
                </div>
              )}
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN: Detail Inspector & Interactive Flow Timeline (7 cols) */}
        <div className="lg:col-span-7">
          {selectedProposal ? (
            <div className="glass-panel p-6 rounded-3xl space-y-6 bg-white/90 shadow-lg">
              
              {/* Proposal Header Info */}
              <div className="border-b border-slate-200 pb-5">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-bold text-amber-900 bg-amber-100 px-3 py-1 rounded-lg border border-amber-300">
                      {selectedProposal.registrationCode}
                    </span>
                    <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                      Sektor: {selectedProposal.sector.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => downloadDocument(
                        selectedProposal.documentProposalUrl || `Proposal_${selectedProposal.registrationCode}.pdf`,
                        `Dokumen Proposal - ${selectedProposal.registrationCode}`,
                        `Proposal Kerja Sama Resmi: "${selectedProposal.title}". Diajukan oleh: ${selectedProposal.institutionName}. Sektor: ${selectedProposal.sector}. Nilai Investasi: Rp ${selectedProposal.budgetEstimate.toLocaleString('id-ID')}. Deskripsi: ${selectedProposal.description}`
                      )}
                      className="flex items-center space-x-1.5 text-xs text-amber-900 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-xl font-bold transition border border-amber-300 cursor-pointer shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5 text-amber-700" />
                      <span>Unduh PDF</span>
                    </button>

                    <button
                      onClick={() => setShowLogModal(true)}
                      className="flex items-center space-x-1.5 text-xs text-slate-800 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl font-bold transition border border-slate-300 cursor-pointer shadow-xs"
                    >
                      <History className="w-3.5 h-3.5 text-amber-700" />
                      <span>Log Audit</span>
                    </button>
                  </div>
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
                    <span className="text-[10px] text-emerald-800 font-bold block uppercase">Perkiraan Investasi</span>
                    <p className="font-black text-emerald-900">
                      Rp {selectedProposal.budgetEstimate.toLocaleString('id-ID')}
                    </p>
                  </div>

                  <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                    <span className="text-[10px] text-amber-800 font-bold block uppercase">Durasi Kerjasama</span>
                    <p className="font-extrabold text-amber-900">{selectedProposal.durationMonths} Bulan</p>
                  </div>
                </div>
              </div>

              {/* TIMELINE ALUR VERIFIKASI STEPPER */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-amber-600" />
                  <span>Tahapan Alur Verifikasi & Persetujuan TKKSD</span>
                </h4>

                <div className="grid grid-cols-4 gap-2 relative pt-2">
                  {pipelineStages.map((stage, idx) => {
                    const currentIndex = getStageIndex(selectedProposal.status);
                    const isCompleted = currentIndex > idx;
                    const isCurrent = currentIndex === idx;

                    return (
                      <div key={stage.id} className="flex flex-col items-center text-center relative z-10">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-xs mb-2 transition shadow-md ${
                          isCompleted
                            ? 'bg-emerald-600 text-white ring-4 ring-emerald-500/20'
                            : isCurrent
                            ? 'bg-amber-500 text-white ring-4 ring-amber-500/30 animate-pulse'
                            : 'bg-white border border-slate-300 text-slate-400'
                        }`}>
                          {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                        </div>
                        
                        <span className={`text-[11px] font-extrabold leading-tight ${
                          isCurrent ? 'text-amber-700' : isCompleted ? 'text-emerald-700' : 'text-slate-500'
                        }`}>
                          {stage.label}
                        </span>
                        
                        <span className="text-[9px] text-slate-500 font-medium hidden sm:inline mt-0.5">
                          {stage.sub}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* MONITORING & EVALUASI (MONEV) SECTION */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-amber-600" />
                      <span>Pelaporan Monitoring & Evaluasi (Monev) Berkala</span>
                    </h4>
                    <p className="text-[11px] text-slate-600 font-medium">Realisasi indikator capaian lapangan triwulanan.</p>
                  </div>

                  <button
                    onClick={() => setShowAddMonevModal(true)}
                    className="flex items-center space-x-1.5 px-3.5 py-2 glass-button-primary text-white text-xs font-bold rounded-xl transition shadow-md cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Input Monev</span>
                  </button>
                </div>

                {selectedProposal.monevReports.length > 0 ? (
                  <div className="space-y-3">
                    {selectedProposal.monevReports.map((report) => (
                      <div key={report.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 shadow-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-amber-900 bg-amber-100 border border-amber-300 px-3 py-0.5 rounded-lg">
                            {report.period}
                          </span>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-slate-600 font-bold">Capaian Progress:</span>
                            <span className="text-sm font-black text-emerald-700">{report.progressPercentage}%</span>
                          </div>
                        </div>

                        {/* Progress Bar Visual */}
                        <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden border border-slate-300">
                          <div
                            className="bg-gradient-to-r from-amber-500 to-emerald-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${report.progressPercentage}%` }}
                          />
                        </div>

                        <div className="text-xs text-slate-800 space-y-1.5 pt-1 font-medium">
                          <p><strong className="text-slate-900 font-extrabold">Indikator Kinerja Utama:</strong> {report.indicator}</p>
                          <p><strong className="text-slate-900 font-extrabold">Realisasi Lapangan:</strong> {report.achievementDetails}</p>
                          {report.obstacle && <p className="text-amber-900"><strong className="text-slate-900 font-extrabold">Kendala:</strong> {report.obstacle}</p>}
                          {report.solution && <p className="text-emerald-900"><strong className="text-slate-900 font-extrabold">Tindak Lanjut Solusi:</strong> {report.solution}</p>}
                        </div>

                        <div className="pt-2 border-t border-slate-200 flex justify-end">
                          <button
                            onClick={() => downloadDocument(
                              report.reportFileUrl || `Laporan_Monev_${report.period}_${selectedProposal.registrationCode}.pdf`,
                              `Laporan Monev ${report.period} - ${selectedProposal.registrationCode}`,
                              `Laporan Monitoring & Evaluasi Berkala (${report.period}) untuk proposal "${selectedProposal.title}". Indikator: ${report.indicator}. Realisasi Lapangan: ${report.achievementDetails}. Evaluator: ${report.evaluatedBy}.`
                            )}
                            className="text-[11px] text-amber-800 font-bold hover:underline flex items-center gap-1.5 cursor-pointer bg-white px-3 py-1 rounded-lg border border-amber-300 shadow-xs"
                          >
                            <Download className="w-3.5 h-3.5 text-amber-700" /> Unduh Laporan Monev PDF
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 border border-dashed border-slate-300 rounded-2xl text-slate-500 text-xs font-medium bg-slate-50/50">
                    Belum ada data laporan Monev. Klik tombol "Input Monev" untuk memasukkan capaian triwulanan.
                  </div>
                )}
              </div>

            </div>
          ) : (
            <div className="glass-panel p-10 rounded-3xl text-center text-slate-500 text-xs font-medium bg-white">
              Pilih salah satu usulan proposal di kolom sebelah kiri untuk menampilkan detail tracking dan laporan Monev.
            </div>
          )}
        </div>

      </div>

      {/* MODAL AUDIT LOG HISTORI */}
      {showLogModal && selectedProposal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="glass-panel max-w-lg w-full rounded-3xl p-6 space-y-4 border border-amber-500/40 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <History className="w-4 h-4 text-amber-600" />
                <span>Histori Audit Log Verifikasi ({selectedProposal.registrationCode})</span>
              </h3>
              <button 
                onClick={() => setShowLogModal(false)} 
                className="text-slate-400 hover:text-slate-800 p-1 rounded-lg hover:bg-slate-100 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {selectedProposal.logs.map((log) => (
                <div key={log.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs space-y-1.5">
                  <div className="flex justify-between text-[10px] text-slate-500 border-b border-slate-200 pb-1 font-semibold">
                    <span className="font-bold text-amber-800">{log.actorName} ({log.actorRole})</span>
                    <span>{new Date(log.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <p className="text-slate-800 font-medium">{log.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL ADD MONEV REPORT */}
      {showAddMonevModal && selectedProposal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="glass-panel max-w-lg w-full rounded-3xl p-6 space-y-4 border border-amber-500/40 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-amber-600" />
                <span>Input Laporan Monev Berkala</span>
              </h3>
              <button 
                onClick={() => setShowAddMonevModal(false)} 
                className="text-slate-400 hover:text-slate-800 p-1 rounded-lg hover:bg-slate-100 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddMonevReport} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Periode Evaluasi</label>
                  <select
                    value={monevPeriod}
                    onChange={(e) => setMonevPeriod(e.target.value as MonevPeriod)}
                    className="w-full glass-input rounded-xl p-2.5 text-xs font-semibold text-slate-900 bg-white"
                  >
                    <option value="TRIWULAN_1">Triwulan I (Jan - Mar)</option>
                    <option value="TRIWULAN_2">Triwulan II (Apr - Jun)</option>
                    <option value="TRIWULAN_3">Triwulan III (Jul - Sep)</option>
                    <option value="TRIWULAN_4">Triwulan IV (Okt - Des)</option>
                    <option value="TAHUNAN">Laporan Tahunan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Progress Capaian (%)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={progressPercentage}
                    onChange={(e) => setProgressPercentage(Number(e.target.value))}
                    className="w-full glass-input rounded-xl p-2.5 text-xs font-semibold text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Indikator Kinerja Utama (IKU)</label>
                <input
                  type="text"
                  value={indicator}
                  onChange={(e) => setIndicator(e.target.value)}
                  className="w-full glass-input rounded-xl p-2.5 text-xs font-medium text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Realisasi & Hasil Lapangan</label>
                <textarea
                  rows={2}
                  value={achievementDetails}
                  onChange={(e) => setAchievementDetails(e.target.value)}
                  className="w-full glass-input rounded-xl p-2.5 text-xs font-medium text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kendala Lapangan</label>
                  <input
                    type="text"
                    value={obstacle}
                    onChange={(e) => setObstacle(e.target.value)}
                    className="w-full glass-input rounded-xl p-2.5 text-xs font-medium text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tindak Lanjut Solusi</label>
                  <input
                    type="text"
                    value={solution}
                    onChange={(e) => setSolution(e.target.value)}
                    className="w-full glass-input rounded-xl p-2.5 text-xs font-medium text-slate-900"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 glass-button-primary text-white font-bold text-xs rounded-xl transition shadow-md cursor-pointer"
              >
                Simpan Laporan Monev
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
