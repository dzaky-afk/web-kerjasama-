import React, { useState } from 'react';
import { 
  FileText, 
  UploadCloud, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  DollarSign, 
  MapPin, 
  Calendar, 
  Sparkles, 
  FolderCheck, 
  ShieldAlert,
  Building,
  HelpCircle,
  ShieldCheck,
  FileCheck2,
  Clock,
  Printer,
  ArrowRight,
  Info,
  Check,
  Download
} from 'lucide-react';
import { Proposal, ProposalSector, Institution } from '../types';
import { downloadDocument } from '../utils/downloadHelper';

interface ProposalFormProps {
  registeredInstitutions: Institution[];
  onSubmitSuccess: (newProposal: Proposal) => void;
}

export const ProposalSubmissionForm: React.FC<ProposalFormProps> = ({ 
  registeredInstitutions, 
  onSubmitSuccess 
}) => {
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [submittedProposalData, setSubmittedProposalData] = useState<Proposal | null>(null);
  const [createdRegistrationCode, setCreatedRegistrationCode] = useState<string>('');
  const [submissionTimeFormatted, setSubmissionTimeFormatted] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form State
  const [selectedInstitutionId, setSelectedInstitutionId] = useState<string>(
    registeredInstitutions[0]?.id || 'inst-1'
  );

  // Auto sync selected institution when list loads
  React.useEffect(() => {
    if (registeredInstitutions.length > 0 && !registeredInstitutions.some(i => i.id === selectedInstitutionId)) {
      setSelectedInstitutionId(registeredInstitutions[0]?.id || 'inst-1');
    }
  }, [registeredInstitutions, selectedInstitutionId]);
  const [title, setTitle] = useState<string>('');
  const [sector, setSector] = useState<ProposalSector>('DIGITAL_TEKNOLOGI');
  const [description, setDescription] = useState<string>('');
  const [targetLocation, setTargetLocation] = useState<string>('');
  const [budgetEstimate, setBudgetEstimate] = useState<string>('');
  const [durationMonths, setDurationMonths] = useState<number>(12);

  // Regulatory Compliance File Upload State (Permendagri No. 22 Tahun 2020)
  const [suratPermohonanFile, setSuratPermohonanFile] = useState<{ name: string; size: string } | null>(null);
  const [proposalFile, setProposalFile] = useState<{ name: string; size: string } | null>(null);
  const [legalFile, setLegalFile] = useState<{ name: string; size: string } | null>(null);
  const [suratBebasSengketaFile, setSuratBebasSengketaFile] = useState<{ name: string; size: string } | null>(null);
  const [mouFile, setMouFile] = useState<{ name: string; size: string } | null>(null);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) newErrors.title = 'Judul usulan kerja sama wajib diisi';
    if (!targetLocation.trim()) newErrors.targetLocation = 'Lokasi pelaksanaan wajib diisi';
    if (!budgetEstimate.trim() || isNaN(Number(budgetEstimate))) newErrors.budgetEstimate = 'Anggaran harus berupa angka valid';
    if (!description.trim() || description.length < 20) newErrors.description = 'Deskripsi minimal 20 karakter';
    
    // Regulatory File Validations
    if (!suratPermohonanFile) newErrors.suratPermohonanFile = 'Surat Permohonan Resmi Bupati (LoI) wajib diunggah sesuai Permendagri 22/2020';
    if (!proposalFile) newErrors.proposalFile = 'Naskah Proposal PDF wajib diunggah';
    if (!legalFile) newErrors.legalFile = 'Dokumen Legalitas (NIB/Akta/NPWP) PDF wajib diunggah';
    if (!suratBebasSengketaFile) newErrors.suratBebasSengketaFile = 'Surat Pernyataan Bebas Sengketa Bermaterai wajib diunggah';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const availableInsts = registeredInstitutions.length > 0 ? registeredInstitutions : [
        { id: 'inst-demo-1', name: 'PT Pilar Komunikasi Nusantara', category: 'DUDI_SWASTA' as const },
        { id: 'inst-demo-2', name: 'Universitas Gadjah Mada (UGM)', category: 'AKADEMISI' as const },
        { id: 'inst-demo-3', name: 'Koperasi Pemuda Inovatif Gunungkidul', category: 'UMKM' as const },
        { id: 'inst-demo-4', name: 'Yayasan Kemitraan Daerah Gunungkidul', category: 'KOMUNITAS_LSM' as const }
      ];

      const selectedInst = availableInsts.find(i => i.id === selectedInstitutionId) || availableInsts[0];

      const now = new Date();
      const randomCode = `PRP-202608-${Math.floor(100 + Math.random() * 900)}`;

      // Format Jam dan Tanggal Pengajuan Presisi Bahasa Indonesia
      const formattedDateStr = new Intl.DateTimeFormat('id-ID', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
      }).format(now);

      const newProposal: Proposal = {
        id: `prop-${Date.now()}`,
        institutionId: selectedInstitutionId,
        institutionName: selectedInst.name,
        institutionCategory: selectedInst.category,
        registrationCode: randomCode,
        title,
        sector,
        description,
        targetLocation,
        budgetEstimate: Number(budgetEstimate),
        durationMonths,
        status: 'VERIFICATION_FILES',
        
        // Regulatory Document Attachments
        documentSuratPermohonanUrl: suratPermohonanFile?.name || 'Surat_Permohonan_Bupati.pdf',
        documentProposalUrl: proposalFile?.name || 'Proposal_Kerjasama.pdf',
        documentLegalUrl: legalFile?.name || 'Dokumen_Legalitas.pdf',
        documentSuratBebasSengketaUrl: suratBebasSengketaFile?.name || 'Surat_Pernyataan_Bebas_Sengketa.pdf',
        documentMouUrl: mouFile?.name,

        submittedAt: now.toISOString(),
        logs: [
          {
            id: `log-${Date.now()}`,
            proposalId: `prop-${Date.now()}`,
            status: 'VERIFICATION_FILES',
            actorName: 'Sistem MEMITRAN',
            actorRole: 'Online Submission Engine',
            comment: `Pengajuan proposal online diterima pada ${formattedDateStr}. Berkas masuk antrean verifikasi Sekretariat TKKSD.`,
            createdAt: now.toISOString()
          }
        ],
        monevReports: []
      };

      setCreatedRegistrationCode(randomCode);
      setSubmissionTimeFormatted(formattedDateStr);
      setSubmittedProposalData(newProposal);
      setIsSubmitted(true);
      onSubmitSuccess(newProposal);
    }
  };

  const handleFileDrop = (
    type: 'suratPermohonan' | 'proposal' | 'legal' | 'suratBebasSengketa' | 'mou',
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileObj = {
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`
      };
      if (type === 'suratPermohonan') setSuratPermohonanFile(fileObj);
      if (type === 'proposal') setProposalFile(fileObj);
      if (type === 'legal') setLegalFile(fileObj);
      if (type === 'suratBebasSengketa') setSuratBebasSengketaFile(fileObj);
      if (type === 'mou') setMouFile(fileObj);
    }
  };

  if (isSubmitted && submittedProposalData) {
    return (
      <div className="glass-panel rounded-3xl p-8 max-w-3xl mx-auto shadow-2xl border border-amber-500/40 bg-white/95 animate-fade-in space-y-6">
        
        {/* Top Header Tanda Terima */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-b border-slate-200 pb-6 gap-4 text-center sm:text-left">
          <div className="flex items-center space-x-3">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0 border border-emerald-300">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-full uppercase">
                Tanda Terima Digital Resmi (TKKSD)
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-0.5">Pengajuan Proposal Berhasil Terdaftar!</h3>
            </div>
          </div>

          <button
            onClick={() => window.print()}
            className="flex items-center space-x-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl border border-slate-300 transition shadow-xs"
          >
            <Printer className="w-4 h-4 text-amber-600" />
            <span>Cetak Tanda Terima</span>
          </button>
        </div>

        {/* INFORMASI JAM & TANGGAL PENGAJUAN (TIMESTAMP DETAILS) */}
        <div className="bg-amber-50/90 border border-amber-300 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-900 shadow-sm">
          <div className="flex items-center space-x-2.5">
            <Clock className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <span className="font-extrabold block text-slate-900">Waktu & Tanggal Resmi Pengajuan:</span>
              <span className="font-bold text-amber-900">{submissionTimeFormatted}</span>
            </div>
          </div>
          <div className="bg-white px-3 py-1.5 rounded-xl border border-amber-300 text-right">
            <span className="text-[10px] text-slate-500 font-bold block">No. Registrasi Pengajuan:</span>
            <span className="font-mono font-extrabold text-amber-800 text-xs">{createdRegistrationCode}</span>
          </div>
        </div>

        {/* RINGKASAN DATA PROPOSAL & CHECKLIST BERKAS */}
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-xs space-y-3 shadow-inner">
          <h4 className="font-black text-slate-900 border-b border-slate-200 pb-2 flex items-center justify-between">
            <span>Ringkasan Data Usulan Proposal</span>
            <span className="text-[10px] bg-slate-200 text-slate-800 px-2 py-0.5 rounded font-bold">Status: Perlu Verifikasi ADM</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-800 font-medium">
            <div>
              <span className="text-[10px] text-slate-500 block font-bold">Instansi Pengaju:</span>
              <span className="font-extrabold text-slate-900">{submittedProposalData.institutionName}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block font-bold">Sektor Kerja Sama:</span>
              <span className="font-bold text-slate-900">{submittedProposalData.sector.replace('_', ' ')}</span>
            </div>
            <div className="sm:col-span-2">
              <span className="text-[10px] text-slate-500 block font-bold">Judul Usulan:</span>
              <span className="font-extrabold text-slate-900">{submittedProposalData.title}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block font-bold">Estimasi Anggaran:</span>
              <span className="font-black text-emerald-700">Rp {submittedProposalData.budgetEstimate.toLocaleString('id-ID')}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block font-bold">Lokasi & Durasi:</span>
              <span className="font-bold text-slate-900">{submittedProposalData.targetLocation} ({submittedProposalData.durationMonths} Bulan)</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200">
            <span className="text-[10px] text-slate-500 block font-bold mb-1.5">Checklist Berkas Regulasi Terunggah (Permendagri 22/2020):</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px]">
              <div className="flex items-center text-emerald-800 font-bold gap-1"><Check className="w-3.5 h-3.5 text-emerald-600" /> Surat Permohonan Bupati (LoI)</div>
              <div className="flex items-center text-emerald-800 font-bold gap-1"><Check className="w-3.5 h-3.5 text-emerald-600" /> Naskah Proposal Lengkap</div>
              <div className="flex items-center text-emerald-800 font-bold gap-1"><Check className="w-3.5 h-3.5 text-emerald-600" /> Dokumen Legalitas (NIB/Akta)</div>
              <div className="flex items-center text-emerald-800 font-bold gap-1"><Check className="w-3.5 h-3.5 text-emerald-600" /> Surat Bebas Sengketa Hukum</div>
            </div>
          </div>
        </div>

        {/* KETERANGAN LANJUTAN & PETUNJUK PROSEDUR */}
        <div className="bg-sky-50/80 border border-sky-300 rounded-2xl p-5 space-y-3 text-xs text-sky-950">
          <h4 className="font-black text-slate-900 flex items-center space-x-2 border-b border-sky-200 pb-2">
            <Info className="w-4 h-4 text-sky-600" />
            <span>Keterangan Lanjutan & Petunjuk Prosedur Verifikasi:</span>
          </h4>

          <ul className="space-y-2 font-medium list-disc list-inside text-slate-800">
            <li>
              <strong className="text-slate-900">Verifikasi Berkas Administrasi (1x24 Jam Kerja):</strong> Tim Sekretariat TKKSD Kabupaten Gunungkidul akan mengecek keabsahan 4 dokumen regulasi yang diunggah.
            </li>
            <li>
              <strong className="text-slate-900">Notifikasi WhatsApp & Email:</strong> Pembaharuan status (ACC / Review Dinas / Minta Perbaikan) akan dikirim langsung ke **2 PIC Resmi** yang terdaftar.
            </li>
            <li>
              <strong className="text-slate-900">Penelaahan Sub-Komisi Dinas:</strong> Apabila berkas dinyatakan lengkap, usulan akan diteruskan ke Dinas Teknis terkait untuk kajian kelayakan lapangan.
            </li>
            <li>
              <strong className="text-slate-900">Pemantauan Real-Time:</strong> Anda dapat memantau posisi berkas sewaktu-waktu pada menu <strong className="text-amber-800">Dashboard Tracking & Monev</strong>.
            </li>
          </ul>
        </div>

        {/* Button Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <button
            onClick={() => downloadDocument(
              `Bukti_Registrasi_${createdRegistrationCode}.pdf`,
              `Bukti Registrasi Usulan Proposal - ${createdRegistrationCode}`,
              `Bukti Registrasi Resmi Pengajuan Usulan Kerja Sama Daerah Kabupaten Gunungkidul.\nKode Registrasi: ${createdRegistrationCode}\nJudul Proposal: "${submittedProposalData?.title || title}"\nMitra Pengaju: ${submittedProposalData?.institutionName || 'Lembaga Mitra'}\nSektor: ${submittedProposalData?.sector || sector}\nWaktu Submit: ${submissionTimeFormatted}\nStatus: VERIFICATION_FILES (Masuk Antrean Verifikasi TKKSD Setda)`
            )}
            className="w-full sm:w-auto px-5 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold rounded-xl transition flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Download className="w-4 h-4 text-amber-700" />
            <span>Unduh Bukti Registrasi PDF</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                setIsSubmitted(false);
                setTitle('');
                setDescription('');
                setBudgetEstimate('');
                setSuratPermohonanFile(null);
                setProposalFile(null);
                setLegalFile(null);
                setSuratBebasSengketaFile(null);
                setMouFile(null);
              }}
              className="w-full sm:w-auto px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl transition"
            >
              Buat Pengajuan Baru
            </button>
          </div>
        </div>

      </div>
    );
  }

  return (
    <div className="glass-panel rounded-3xl p-6 lg:p-8 max-w-4xl mx-auto shadow-xl border border-amber-500/30 bg-white/85 relative">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-200 mb-8">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Checklist Regulasi Permendagri No. 22 Tahun 2020 & Perda KSDPK</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Input Proposal & Berkas Persyaratan Regulasi</h2>
          <p className="text-slate-600 text-xs font-medium mt-1">
            Pengajuan naskah usulan kerja sama daerah beserta seluruh berkas legalitas resmi TKKSD Kabupaten Gunungkidul.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* SECTION 1: PILIH INSTANSI & INFORMASI DASAR */}
        <div className="bg-white/90 border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center space-x-2 border-b border-slate-200 pb-3">
            <Building className="w-4 h-4 text-amber-600" />
            <span>Data Lembaga Pengaju & Kategori Usulan</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Pilih Instansi Pengaju Terdaftar <span className="text-rose-500">*</span>
                </label>
                <span className="text-[10px] text-amber-800 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  {registeredInstitutions.length} Instansi Terdaftar
                </span>
              </div>

              <select
                value={selectedInstitutionId}
                onChange={(e) => setSelectedInstitutionId(e.target.value)}
                className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 bg-white"
              >
                {(registeredInstitutions.length > 0 ? registeredInstitutions : [
                  { id: 'inst-demo-1', name: 'PT Pilar Komunikasi Nusantara', category: 'DUDI_SWASTA' },
                  { id: 'inst-demo-2', name: 'Universitas Gadjah Mada (UGM)', category: 'AKADEMISI' },
                  { id: 'inst-demo-3', name: 'Koperasi Pemuda Inovatif Gunungkidul', category: 'UMKM' },
                  { id: 'inst-demo-4', name: 'Yayasan Kemitraan Daerah Gunungkidul', category: 'KOMUNITAS_LSM' }
                ]).map((inst) => (
                  <option key={inst.id} value={inst.id}>
                    {inst.name} ({inst.category.replace('_', ' ')})
                  </option>
                ))}
              </select>
              
              <p className="text-[10px] text-slate-500 mt-1 font-medium">
                Pilih lembaga mitra yang telah terdaftar di database Sekretariat TKKSD Gunungkidul.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Sektor Fokus Kerja Sama <span className="text-rose-500">*</span>
              </label>
              <select
                value={sector}
                onChange={(e) => setSector(e.target.value as ProposalSector)}
                className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 bg-white"
              >
                <option value="DIGITAL_TEKNOLOGI">Digitalisasi & Smart City</option>
                <option value="PENDIDIKAN_SDM">Pendidikan & Pelatihan SDM</option>
                <option value="KESEHATAN">Pelayanan & Fasilitas Kesehatan</option>
                <option value="INFRASTRUKTUR">Infrastruktur & Tata Ruang</option>
                <option value="EKONOMI_UMKM">Pemberdayaan Ekonomi & UMKM</option>
                <option value="LINGKUNGAN">Lingkungan Hidup & Energi Terbarukan</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Judul Usulan Kerja Sama <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Contoh: Pengembangan Ekosistem Geo-Tourism & Digital Smart Tourism Gunungkidul"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full glass-input rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-900 placeholder-slate-400 ${errors.title ? 'border-rose-500' : ''}`}
            />
            {errors.title && <p className="text-[10px] text-rose-500 font-semibold mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{errors.title}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-600" />
                <span>Lokasi Pelaksanaan <span className="text-rose-500">*</span></span>
              </label>
              <input
                type="text"
                placeholder="Kawasan Pantai Selatan / Kepanewon Wonosari"
                value={targetLocation}
                onChange={(e) => setTargetLocation(e.target.value)}
                className={`w-full glass-input rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-900 placeholder-slate-400 ${errors.targetLocation ? 'border-rose-500' : ''}`}
              />
              {errors.targetLocation && <p className="text-[10px] text-rose-500 font-semibold mt-1">{errors.targetLocation}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                <span>Estimasi Anggaran (Rp) <span className="text-rose-500">*</span></span>
              </label>
              <input
                type="number"
                placeholder="500000000"
                value={budgetEstimate}
                onChange={(e) => setBudgetEstimate(e.target.value)}
                className={`w-full glass-input rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-900 placeholder-slate-400 ${errors.budgetEstimate ? 'border-rose-500' : ''}`}
              />
              {errors.budgetEstimate && <p className="text-[10px] text-rose-500 font-semibold mt-1">{errors.budgetEstimate}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-sky-600" />
                <span>Durasi Kerja Sama (Bulan)</span>
              </label>
              <select
                value={durationMonths}
                onChange={(e) => setDurationMonths(Number(e.target.value))}
                className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 bg-white"
              >
                <option value={6}>6 Bulan</option>
                <option value={12}>12 Bulan (1 Tahun)</option>
                <option value={24}>24 Bulan (2 Tahun)</option>
                <option value={36}>36 Bulan (3 Tahun)</option>
                <option value={60}>60 Bulan (5 Tahun)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Deskripsi Ringkas & Ruang Lingkup (Scope of Work) <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              placeholder="Jelaskan latar belakang usulan, manfaat bagi Kabupaten Gunungkidul, ruang lingkup pekerjaan, serta indikator keberhasilan..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full glass-input rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-900 placeholder-slate-400 ${errors.description ? 'border-rose-500' : ''}`}
            />
            {errors.description && <p className="text-[10px] text-rose-500 font-semibold mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{errors.description}</p>}
          </div>
        </div>

        {/* SECTION 2: REGULATORY FILE UPLOADS CHECKLIST (PERMENDAGRI NO. 22 TAHUN 2020) */}
        <div className="bg-white/90 border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center space-x-2">
              <UploadCloud className="w-4 h-4 text-amber-600" />
              <span>Upload Berkas Persyaratan Regulasi (Permendagri 22/2020)</span>
            </h3>
            <span className="text-[10px] bg-amber-100 text-amber-800 border border-amber-300 px-2.5 py-0.5 rounded-full font-bold">
              Checklist Wajib Permendagri & Perda KSDPK
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* 1. Surat Permohonan Bupati (LoI) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                <span>1. Surat Permohonan Resmi Bupati (LoI) <span className="text-rose-500">*</span></span>
              </label>
              <p className="text-[10px] text-slate-500 mb-1.5">Surat permohonan kerja sama dari Pimpinan Lembaga ditujukan kepada Bupati Gunungkidul.</p>
              <label className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-3.5 cursor-pointer transition ${
                errors.suratPermohonanFile ? 'border-rose-400 bg-rose-50' : suratPermohonanFile ? 'border-emerald-500 bg-emerald-50' : 'border-slate-300 bg-slate-50 hover:border-amber-500'
              }`}>
                <FileText className={`w-6 h-6 mb-1 ${suratPermohonanFile ? 'text-emerald-600' : 'text-amber-600'}`} />
                <span className="text-xs text-slate-900 font-bold text-center truncate max-w-[200px]">
                  {suratPermohonanFile ? suratPermohonanFile.name : 'Upload Surat Permohonan (PDF)'}
                </span>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => handleFileDrop('suratPermohonan', e)}
                  className="hidden"
                />
              </label>
              {errors.suratPermohonanFile && <p className="text-[10px] text-rose-500 font-semibold mt-1">{errors.suratPermohonanFile}</p>}
            </div>

            {/* 2. Naskah Proposal Kerja Sama */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                <span>2. Naskah Proposal Kerja Sama Lengkap <span className="text-rose-500">*</span></span>
              </label>
              <p className="text-[10px] text-slate-500 mb-1.5">Dokumen proposal lengkap mencakup latar belakang, tujuan, scope, & RAB (PDF).</p>
              <label className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-3.5 cursor-pointer transition ${
                errors.proposalFile ? 'border-rose-400 bg-rose-50' : proposalFile ? 'border-emerald-500 bg-emerald-50' : 'border-slate-300 bg-slate-50 hover:border-amber-500'
              }`}>
                <FileText className={`w-6 h-6 mb-1 ${proposalFile ? 'text-emerald-600' : 'text-amber-600'}`} />
                <span className="text-xs text-slate-900 font-bold text-center truncate max-w-[200px]">
                  {proposalFile ? proposalFile.name : 'Upload Proposal Lengkap (PDF)'}
                </span>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => handleFileDrop('proposal', e)}
                  className="hidden"
                />
              </label>
              {errors.proposalFile && <p className="text-[10px] text-rose-500 font-semibold mt-1">{errors.proposalFile}</p>}
            </div>

            {/* 3. Dokumen Legalitas (NIB / Akta / NPWP) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                <span>3. Dokumen Legalitas & Keabsahan <span className="text-rose-500">*</span></span>
              </label>
              <p className="text-[10px] text-slate-500 mb-1.5">Gabungan PDF NIB / SK Kemenkumham / Akta Pendirian / NPWP Lembaga.</p>
              <label className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-3.5 cursor-pointer transition ${
                errors.legalFile ? 'border-rose-400 bg-rose-50' : legalFile ? 'border-emerald-500 bg-emerald-50' : 'border-slate-300 bg-slate-50 hover:border-amber-500'
              }`}>
                <FolderCheck className={`w-6 h-6 mb-1 ${legalFile ? 'text-emerald-600' : 'text-sky-600'}`} />
                <span className="text-xs text-slate-900 font-bold text-center truncate max-w-[200px]">
                  {legalFile ? legalFile.name : 'Upload Legalitas Lembaga (PDF)'}
                </span>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => handleFileDrop('legal', e)}
                  className="hidden"
                />
              </label>
              {errors.legalFile && <p className="text-[10px] text-rose-500 font-semibold mt-1">{errors.legalFile}</p>}
            </div>

            {/* 4. Surat Pernyataan Bebas Sengketa Hukum */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                <span>4. Pernyataan Bebas Sengketa Bermaterai <span className="text-rose-500">*</span></span>
              </label>
              <p className="text-[10px] text-slate-500 mb-1.5">Surat pernyataan lembaga tidak sedang dalam sengketa hukum (Permendagri 22/2020).</p>
              <label className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-3.5 cursor-pointer transition ${
                errors.suratBebasSengketaFile ? 'border-rose-400 bg-rose-50' : suratBebasSengketaFile ? 'border-emerald-500 bg-emerald-50' : 'border-slate-300 bg-slate-50 hover:border-amber-500'
              }`}>
                <FileCheck2 className={`w-6 h-6 mb-1 ${suratBebasSengketaFile ? 'text-emerald-600' : 'text-amber-600'}`} />
                <span className="text-xs text-slate-900 font-bold text-center truncate max-w-[200px]">
                  {suratBebasSengketaFile ? suratBebasSengketaFile.name : 'Upload Pernyataan Bebas Sengketa'}
                </span>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => handleFileDrop('suratBebasSengketa', e)}
                  className="hidden"
                />
              </label>
              {errors.suratBebasSengketaFile && <p className="text-[10px] text-rose-500 font-semibold mt-1">{errors.suratBebasSengketaFile}</p>}
            </div>

          </div>

          {/* 5. Draft MoU / PKS */}
          <div className="pt-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              5. Draft Naskah Kesepakatan Bersama (MoU / PKS) (Opsional)
            </label>
            <label className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-3.5 cursor-pointer transition ${
              mouFile ? 'border-emerald-500 bg-emerald-50' : 'border-slate-300 bg-slate-50 hover:border-amber-500'
            }`}>
              <FileText className={`w-6 h-6 mb-1 ${mouFile ? 'text-emerald-600' : 'text-slate-400'}`} />
              <span className="text-xs text-slate-900 font-bold text-center truncate max-w-[200px]">
                {mouFile ? mouFile.name : 'Upload Draft MoU / PKS (PDF)'}
              </span>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => handleFileDrop('mou', e)}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Submit Action */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <div className="flex items-center space-x-2 text-xs text-slate-600 font-medium">
            <HelpCircle className="w-4 h-4 text-amber-600" />
            <span>Seluruh berkas terverifikasi otomatis sesuai Permendagri No. 22 Tahun 2020</span>
          </div>

          <button
            type="submit"
            className="flex items-center space-x-2 px-6 py-2.5 rounded-xl text-xs font-bold glass-button-primary text-white shadow-lg transition transform active:scale-95"
          >
            <Send className="w-4 h-4" />
            <span>Kirim Proposal & Berkas Regulasi</span>
          </button>
        </div>
      </form>
    </div>
  );
};
