import React, { useState } from 'react';
import { 
  Building2, 
  UserCheck, 
  Users, 
  Upload, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  FileText, 
  Image as ImageIcon, 
  ShieldCheck,
  AlertCircle,
  Sparkles,
  Phone,
  Mail,
  Briefcase,
  MapPin,
  Activity,
  FilePlus
} from 'lucide-react';
import { Institution, PicUser, InstitutionCategory } from '../types';

interface RegistrationFormProps {
  onSuccess: (data: Institution) => void;
  onNavigateTab?: (tab: 'overview' | 'registration' | 'proposal' | 'tracking' | 'regulations' | 'setda_admin') => void;
}

export const RegistrationMultiStepForm: React.FC<RegistrationFormProps> = ({ onSuccess, onNavigateTab }) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form State
  const [institutionData, setInstitutionData] = useState<{
    name: string;
    category: InstitutionCategory;
    registrationNo: string;
    npwp: string;
    address: string;
    city: string;
    province: string;
    phone: string;
    email: string;
    website: string;
  }>({
    name: '',
    category: 'DUDI_SWASTA',
    registrationNo: '',
    npwp: '',
    address: '',
    city: 'Wonosari, Gunungkidul',
    province: 'D.I. Yogyakarta',
    phone: '',
    email: '',
    website: ''
  });

  const [picPrimary, setPicPrimary] = useState<PicUser>({
    picType: 'PRIMARY',
    fullName: '',
    position: '',
    phone: '',
    email: '',
    pasfotoFileName: '',
    suratTugasFileName: ''
  });

  const [picSecondary, setPicSecondary] = useState<PicUser>({
    picType: 'SECONDARY',
    fullName: '',
    position: '',
    phone: '',
    email: '',
    pasfotoFileName: '',
    suratTugasFileName: ''
  });

  // Steps Configuration
  const steps = [
    { id: 1, title: 'Profil Instansi', sub: 'Identitas Lembaga Pengaju', icon: Building2 },
    { id: 2, title: 'PIC 1 (Utama)', sub: 'Penanggung Jawab Operasional', icon: UserCheck },
    { id: 3, title: 'PIC 2 (Pendamping)', sub: 'Kontak Alternatif / Legal', icon: Users },
    { id: 4, title: 'Verifikasi & Upload', sub: 'Surat Tugas & Pasfoto TKKSD', icon: Upload }
  ];

  // Validation Logic per Step
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!institutionData.name.trim()) newErrors.inst_name = 'Nama instansi wajib diisi';
      if (!institutionData.email.trim() || !institutionData.email.includes('@')) newErrors.inst_email = 'Email resmi tidak valid';
      if (!institutionData.phone.trim()) newErrors.inst_phone = 'No. Telepon kantor wajib diisi';
      if (!institutionData.address.trim()) newErrors.inst_address = 'Alamat lengkap wajib diisi';
      if (!institutionData.city.trim()) newErrors.inst_city = 'Kota/Kabupaten wajib diisi';
    }

    if (step === 2) {
      if (!picPrimary.fullName.trim()) newErrors.pic1_name = 'Nama lengkap PIC 1 wajib diisi';
      if (!picPrimary.position.trim()) newErrors.pic1_pos = 'Jabatan PIC 1 wajib diisi';
      if (!picPrimary.phone.trim()) newErrors.pic1_phone = 'No. WhatsApp/HP wajib diisi';
      if (!picPrimary.email.trim() || !picPrimary.email.includes('@')) newErrors.pic1_email = 'Email PIC 1 tidak valid';
    }

    if (step === 3) {
      if (!picSecondary.fullName.trim()) newErrors.pic2_name = 'Nama lengkap PIC 2 wajib diisi';
      if (!picSecondary.position.trim()) newErrors.pic2_pos = 'Jabatan PIC 2 wajib diisi';
      if (!picSecondary.phone.trim()) newErrors.pic2_phone = 'No. WhatsApp/HP wajib diisi';
      if (!picSecondary.email.trim() || !picSecondary.email.includes('@')) newErrors.pic2_email = 'Email PIC 2 tidak valid';
    }

    if (step === 4) {
      if (!picPrimary.pasfotoFileName) newErrors.pic1_pasfoto = 'Pasfoto PIC 1 wajib diunggah';
      if (!picPrimary.suratTugasFileName) newErrors.pic1_surat = 'Surat Tugas TKKSD PIC 1 wajib diunggah';
      if (!picSecondary.pasfotoFileName) newErrors.pic2_pasfoto = 'Pasfoto PIC 2 wajib diunggah';
      if (!picSecondary.suratTugasFileName) newErrors.pic2_surat = 'Surat Tugas TKKSD PIC 2 wajib diunggah';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 4) {
        setCurrentStep(prev => prev + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        // Final Submission
        const fullData: Institution = {
          ...institutionData,
          pics: [picPrimary, picSecondary]
        };
        setIsSubmitted(true);
        onSuccess(fullData);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleFileUpload = (
    target: 'pic1' | 'pic2',
    field: 'pasfoto' | 'suratTugas',
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileName = file.name;
      if (target === 'pic1') {
        setPicPrimary(prev => ({
          ...prev,
          [field === 'pasfoto' ? 'pasfotoFileName' : 'suratTugasFileName']: fileName,
          [field === 'pasfoto' ? 'pasfotoUrl' : 'suratTugasUrl']: URL.createObjectURL(file)
        }));
      } else {
        setPicSecondary(prev => ({
          ...prev,
          [field === 'pasfoto' ? 'pasfotoFileName' : 'suratTugasFileName']: fileName,
          [field === 'pasfoto' ? 'pasfotoUrl' : 'suratTugasUrl']: URL.createObjectURL(file)
        }));
      }
    }
  };

  if (isSubmitted) {
    return (
      <div className="glass-panel rounded-3xl p-8 text-center max-w-2xl mx-auto shadow-2xl border border-emerald-500/40 bg-white/90 animate-fade-in">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 ring-8 ring-emerald-500/10">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h3 className="text-2xl font-extrabold text-slate-900 mb-2">Registrasi Instansi & PIC Berhasil!</h3>
        <p className="text-slate-700 text-sm mb-6 leading-relaxed font-medium">
          Data lembaga <span className="text-amber-700 font-bold">{institutionData.name}</span> beserta 2 (dua) PIC resmi TKKSD Kabupaten Gunungkidul telah tersimpan dalam sistem MEMITRAN. Anda sekarang dapat melanjutkan ke pengajuan proposal kerja sama.
        </p>

        <div className="bg-slate-50 rounded-2xl p-4 text-left border border-slate-200 text-xs text-slate-800 space-y-2 mb-6 shadow-inner">
          <div className="flex justify-between py-1 border-b border-slate-200">
            <span className="text-slate-500 font-medium">Instansi Pengaju:</span>
            <span className="font-bold text-slate-900">{institutionData.name} ({institutionData.category.replace('_', ' ')})</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-200">
            <span className="text-slate-500 font-medium">PIC Utama (Penanggung Jawab):</span>
            <span className="font-bold text-slate-900">{picPrimary.fullName} ({picPrimary.position})</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-slate-500 font-medium">PIC Pendamping:</span>
            <span className="font-bold text-slate-900">{picSecondary.fullName} ({picSecondary.position})</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onNavigateTab?.('tracking')}
            className="w-full sm:w-auto px-5 py-2.5 glass-button-primary text-white text-xs font-bold rounded-xl transition shadow-md flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Activity className="w-4 h-4" />
            <span>Buka Dashboard Tracking</span>
          </button>

          <button
            onClick={() => onNavigateTab?.('proposal')}
            className="w-full sm:w-auto px-5 py-2.5 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 text-xs font-bold rounded-xl transition flex items-center justify-center space-x-2 cursor-pointer"
          >
            <FilePlus className="w-4 h-4 text-amber-700" />
            <span>Lengkapi Berkas Proposal</span>
          </button>

          <button
            onClick={() => {
              setIsSubmitted(false);
              setCurrentStep(1);
            }}
            className="w-full sm:w-auto px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl transition cursor-pointer"
          >
            Daftarkan Instansi Lain
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-3xl p-6 lg:p-8 max-w-4xl mx-auto shadow-xl border border-amber-500/30 bg-white/85 relative">
      {/* Header Banner */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-200 mb-8">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Formulir Pendaftaran Lembaga Mitra TKKSD</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Registrasi Instansi & 2 (Dua) PIC Resmi</h2>
          <p className="text-slate-600 text-xs font-medium mt-1">
            Lengkapi profil instansi pengaju kerja sama dan 2 orang PIC ber-Surat Tugas TKKSD Kabupaten Gunungkidul.
          </p>
        </div>
        <div className="hidden sm:flex items-center space-x-2 bg-amber-50 border border-amber-300 px-3.5 py-1.5 rounded-full text-xs text-amber-900 font-bold shadow-sm">
          <ShieldCheck className="w-4 h-4 text-amber-600" />
          <span>Verifikasi TKKSD</span>
        </div>
      </div>

      {/* Stepper Progress Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {steps.map((s) => {
          const IconComponent = s.icon;
          const isActive = currentStep === s.id;
          const isDone = currentStep > s.id;

          return (
            <div 
              key={s.id}
              className={`flex flex-col p-3.5 rounded-2xl border transition-all duration-200 ${
                isActive 
                  ? 'bg-amber-50 border-amber-500 text-slate-900 shadow-md ring-2 ring-amber-500/20' 
                  : isDone
                  ? 'bg-emerald-50 border-emerald-400 text-emerald-900'
                  : 'bg-white/60 border-slate-200 text-slate-500'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-xl ${
                  isActive ? 'bg-amber-500 text-white shadow-sm' : isDone ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  {isDone ? <CheckCircle2 className="w-4 h-4" /> : <IconComponent className="w-4 h-4" />}
                </div>
                <span className="text-[10px] font-extrabold tracking-widest uppercase text-slate-400">Step 0{s.id}</span>
              </div>
              <span className="font-extrabold text-xs text-slate-900 truncate">{s.title}</span>
              <span className="text-[10px] text-slate-500 font-medium truncate hidden md:inline">{s.sub}</span>
            </div>
          );
        })}
      </div>

      {/* STEP 1: PROFIL INSTANSI */}
      {currentStep === 1 && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-white/90 border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center space-x-2 border-b border-slate-200 pb-3">
              <Building2 className="w-4 h-4 text-amber-600" />
              <span>Informasi Utama Instansi / Lembaga</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Nama Resmi Instansi / Perusahaan <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: PT Kerjasama Teknologi Nusantara / Universitas Merdeka"
                  value={institutionData.name}
                  onChange={(e) => setInstitutionData({ ...institutionData, name: e.target.value })}
                  className={`w-full glass-input rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-900 placeholder-slate-400 ${errors.inst_name ? 'border-rose-500' : ''}`}
                />
                {errors.inst_name && <p className="text-[10px] text-rose-500 font-semibold mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{errors.inst_name}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Kategori Sektor Mitra <span className="text-rose-500">*</span>
                </label>
                <select
                  value={institutionData.category}
                  onChange={(e) => setInstitutionData({ ...institutionData, category: e.target.value as InstitutionCategory })}
                  className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 bg-white"
                >
                  <option value="DUDI_SWASTA">DUDI / Swasta (Dunia Usaha & Industri)</option>
                  <option value="AKADEMISI">Akademisi (Perguruan Tinggi / Riset)</option>
                  <option value="KOMUNITAS_LSM">Komunitas / LSM / NGO</option>
                  <option value="UMKM">UMKM / Koperasi Daerah</option>
                  <option value="LAINNYA">Lembaga / BUMD / Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Nomor Legalitas / NIB / Akta Notaris
                </label>
                <input
                  type="text"
                  placeholder="Nomor Izin Usaha / Akta Pendirian"
                  value={institutionData.registrationNo}
                  onChange={(e) => setInstitutionData({ ...institutionData, registrationNo: e.target.value })}
                  className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-900 placeholder-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  NPWP Lembaga
                </label>
                <input
                  type="text"
                  placeholder="00.000.000.0-000.000"
                  value={institutionData.npwp}
                  onChange={(e) => setInstitutionData({ ...institutionData, npwp: e.target.value })}
                  className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-900 placeholder-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Email Official Lembaga <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="kerjasama@lembaga.co.id / info@perusahaan.com"
                  value={institutionData.email}
                  onChange={(e) => setInstitutionData({ ...institutionData, email: e.target.value })}
                  className={`w-full glass-input rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-900 placeholder-slate-400 ${errors.inst_email ? 'border-rose-500' : ''}`}
                />
                {errors.inst_email && <p className="text-[10px] text-rose-500 font-semibold mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{errors.inst_email}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Telepon Kantor <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="(0274) 391-xxx / 0812xxxx"
                  value={institutionData.phone}
                  onChange={(e) => setInstitutionData({ ...institutionData, phone: e.target.value })}
                  className={`w-full glass-input rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-900 placeholder-slate-400 ${errors.inst_phone ? 'border-rose-500' : ''}`}
                />
                {errors.inst_phone && <p className="text-[10px] text-rose-500 font-semibold mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{errors.inst_phone}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Alamat Lengkap Kantor <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Jl. Pemuda No. 45 Wonosari"
                  value={institutionData.address}
                  onChange={(e) => setInstitutionData({ ...institutionData, address: e.target.value })}
                  className={`w-full glass-input rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-900 placeholder-slate-400 ${errors.inst_address ? 'border-rose-500' : ''}`}
                />
                {errors.inst_address && <p className="text-[10px] text-rose-500 font-semibold mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{errors.inst_address}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Kota / Kabupaten <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Wonosari, Gunungkidul"
                  value={institutionData.city}
                  onChange={(e) => setInstitutionData({ ...institutionData, city: e.target.value })}
                  className={`w-full glass-input rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-900 placeholder-slate-400 ${errors.inst_city ? 'border-rose-500' : ''}`}
                />
                {errors.inst_city && <p className="text-[10px] text-rose-500 font-semibold mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{errors.inst_city}</p>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: PIC 1 (UTAMA) */}
      {currentStep === 2 && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 text-xs text-amber-900 flex items-start space-x-3 shadow-sm">
            <UserCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block mb-0.5">Ketentuan PIC Utama (Point of Contact 1):</span>
              PIC Utama bertindak sebagai Penanggung Jawab Operasional pelaksanaan kerja sama daerah yang berwenang berkoordinasi secara berkala dengan Tim Kerja Sama Daerah (TKKSD) Kabupaten Gunungkidul.
            </div>
          </div>

          <div className="bg-white/90 border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center space-x-2 border-b border-slate-200 pb-3">
              <UserCheck className="w-4 h-4 text-amber-600" />
              <span>Data Diri Person In Charge (PIC) 1 - Utama</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Nama Lengkap & Gelar <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Dr. Ahmad Subagja, S.T., M.T."
                  value={picPrimary.fullName}
                  onChange={(e) => setPicPrimary({ ...picPrimary, fullName: e.target.value })}
                  className={`w-full glass-input rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-900 placeholder-slate-400 ${errors.pic1_name ? 'border-rose-500' : ''}`}
                />
                {errors.pic1_name && <p className="text-[10px] text-rose-500 font-semibold mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{errors.pic1_name}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Jabatan Resmi <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Direktur Kemitraan / Manajer CSR"
                  value={picPrimary.position}
                  onChange={(e) => setPicPrimary({ ...picPrimary, position: e.target.value })}
                  className={`w-full glass-input rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-900 placeholder-slate-400 ${errors.pic1_pos ? 'border-rose-500' : ''}`}
                />
                {errors.pic1_pos && <p className="text-[10px] text-rose-500 font-semibold mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{errors.pic1_pos}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  No. WhatsApp / HP Aktif <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="081234567890"
                  value={picPrimary.phone}
                  onChange={(e) => setPicPrimary({ ...picPrimary, phone: e.target.value })}
                  className={`w-full glass-input rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-900 placeholder-slate-400 ${errors.pic1_phone ? 'border-rose-500' : ''}`}
                />
                {errors.pic1_phone && <p className="text-[10px] text-rose-500 font-semibold mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{errors.pic1_phone}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Email Aktif PIC 1 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="ahmad.subagja@lembaga.co.id"
                  value={picPrimary.email}
                  onChange={(e) => setPicPrimary({ ...picPrimary, email: e.target.value })}
                  className={`w-full glass-input rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-900 placeholder-slate-400 ${errors.pic1_email ? 'border-rose-500' : ''}`}
                />
                {errors.pic1_email && <p className="text-[10px] text-rose-500 font-semibold mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{errors.pic1_email}</p>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: PIC 2 (PENDAMPING) */}
      {currentStep === 3 && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-sky-50 border border-sky-300 rounded-2xl p-4 text-xs text-sky-900 flex items-start space-x-3 shadow-sm">
            <Users className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block mb-0.5">Ketentuan PIC Pendamping (Point of Contact 2):</span>
              Setiap pengajuan wajib mendaftarkan 2 (dua) PIC resmi untuk menjamin kontinuitas komunikasi administrasi dan verifikasi dokumen legalitas TKKSD.
            </div>
          </div>

          <div className="bg-white/90 border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center space-x-2 border-b border-slate-200 pb-3">
              <Users className="w-4 h-4 text-sky-600" />
              <span>Data Diri Person In Charge (PIC) 2 - Pendamping</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Nama Lengkap & Gelar <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Siti Rahmawati, S.H., M.H."
                  value={picSecondary.fullName}
                  onChange={(e) => setPicSecondary({ ...picSecondary, fullName: e.target.value })}
                  className={`w-full glass-input rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-900 placeholder-slate-400 ${errors.pic2_name ? 'border-rose-500' : ''}`}
                />
                {errors.pic2_name && <p className="text-[10px] text-rose-500 font-semibold mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{errors.pic2_name}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Jabatan Resmi <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Staf Legal / Koordinator Hubungan Antar Lembaga"
                  value={picSecondary.position}
                  onChange={(e) => setPicSecondary({ ...picSecondary, position: e.target.value })}
                  className={`w-full glass-input rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-900 placeholder-slate-400 ${errors.pic2_pos ? 'border-rose-500' : ''}`}
                />
                {errors.pic2_pos && <p className="text-[10px] text-rose-500 font-semibold mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{errors.pic2_pos}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  No. WhatsApp / HP Aktif <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="081987654321"
                  value={picSecondary.phone}
                  onChange={(e) => setPicSecondary({ ...picSecondary, phone: e.target.value })}
                  className={`w-full glass-input rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-900 placeholder-slate-400 ${errors.pic2_phone ? 'border-rose-500' : ''}`}
                />
                {errors.pic2_phone && <p className="text-[10px] text-rose-500 font-semibold mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{errors.pic2_phone}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Email Aktif PIC 2 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="siti.rahmawati@lembaga.co.id"
                  value={picSecondary.email}
                  onChange={(e) => setPicSecondary({ ...picSecondary, email: e.target.value })}
                  className={`w-full glass-input rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-900 placeholder-slate-400 ${errors.pic2_email ? 'border-rose-500' : ''}`}
                />
                {errors.pic2_email && <p className="text-[10px] text-rose-500 font-semibold mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{errors.pic2_email}</p>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: UPLOAD BERKAS PIC */}
      {currentStep === 4 && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* UPLOAD PIC 1 */}
            <div className="bg-white/90 border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
              <div className="flex items-center space-x-2 border-b border-slate-200 pb-3">
                <UserCheck className="w-4 h-4 text-amber-600" />
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900">Berkas Digital PIC 1 (Utama)</h4>
                  <p className="text-[10px] text-slate-500 font-medium">{picPrimary.fullName || 'PIC Utama'}</p>
                </div>
              </div>

              {/* Pasfoto PIC 1 */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>Pasfoto Resmi 4x6 (JPG/PNG) <span className="text-rose-500">*</span></span>
                  <span className="text-[10px] text-slate-500">Maks. 2MB</span>
                </label>
                <label className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-4 cursor-pointer transition ${
                  errors.pic1_pasfoto ? 'border-rose-400 bg-rose-50' : 'border-slate-300 hover:border-amber-500 bg-slate-50'
                }`}>
                  <ImageIcon className="w-6 h-6 text-amber-600 mb-1" />
                  <span className="text-xs text-slate-800 font-bold">
                    {picPrimary.pasfotoFileName ? picPrimary.pasfotoFileName : 'Pilih Berkas Pasfoto'}
                  </span>
                  <span className="text-[10px] text-slate-500 mt-0.5">Format JPG / PNG Latar Merah/Biru</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload('pic1', 'pasfoto', e)}
                    className="hidden"
                  />
                </label>
                {errors.pic1_pasfoto && <p className="text-[10px] text-rose-500 font-semibold mt-1">{errors.pic1_pasfoto}</p>}
              </div>

              {/* Surat Tugas TKKSD PIC 1 */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>Surat Tugas TKKSD Pimpinan (PDF) <span className="text-rose-500">*</span></span>
                  <span className="text-[10px] text-slate-500">Maks. 5MB</span>
                </label>
                <label className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-4 cursor-pointer transition ${
                  errors.pic1_surat ? 'border-rose-400 bg-rose-50' : 'border-slate-300 hover:border-amber-500 bg-slate-50'
                }`}>
                  <FileText className="w-6 h-6 text-emerald-600 mb-1" />
                  <span className="text-xs text-slate-800 font-bold truncate max-w-[200px]">
                    {picPrimary.suratTugasFileName ? picPrimary.suratTugasFileName : 'Pilih Berkas Surat Tugas'}
                  </span>
                  <span className="text-[10px] text-slate-500 mt-0.5">Format PDF Bertanda Tangan Pimpinan</span>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => handleFileUpload('pic1', 'suratTugas', e)}
                    className="hidden"
                  />
                </label>
                {errors.pic1_surat && <p className="text-[10px] text-rose-500 font-semibold mt-1">{errors.pic1_surat}</p>}
              </div>
            </div>

            {/* UPLOAD PIC 2 */}
            <div className="bg-white/90 border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
              <div className="flex items-center space-x-2 border-b border-slate-200 pb-3">
                <Users className="w-4 h-4 text-sky-600" />
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900">Berkas Digital PIC 2 (Pendamping)</h4>
                  <p className="text-[10px] text-slate-500 font-medium">{picSecondary.fullName || 'PIC Pendamping'}</p>
                </div>
              </div>

              {/* Pasfoto PIC 2 */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>Pasfoto Resmi 4x6 (JPG/PNG) <span className="text-rose-500">*</span></span>
                  <span className="text-[10px] text-slate-500">Maks. 2MB</span>
                </label>
                <label className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-4 cursor-pointer transition ${
                  errors.pic2_pasfoto ? 'border-rose-400 bg-rose-50' : 'border-slate-300 hover:border-sky-500 bg-slate-50'
                }`}>
                  <ImageIcon className="w-6 h-6 text-sky-600 mb-1" />
                  <span className="text-xs text-slate-800 font-bold">
                    {picSecondary.pasfotoFileName ? picSecondary.pasfotoFileName : 'Pilih Berkas Pasfoto'}
                  </span>
                  <span className="text-[10px] text-slate-500 mt-0.5">Format JPG / PNG Latar Merah/Biru</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload('pic2', 'pasfoto', e)}
                    className="hidden"
                  />
                </label>
                {errors.pic2_pasfoto && <p className="text-[10px] text-rose-500 font-semibold mt-1">{errors.pic2_pasfoto}</p>}
              </div>

              {/* Surat Tugas TKKSD PIC 2 */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>Surat Tugas TKKSD Pimpinan (PDF) <span className="text-rose-500">*</span></span>
                  <span className="text-[10px] text-slate-500">Maks. 5MB</span>
                </label>
                <label className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-4 cursor-pointer transition ${
                  errors.pic2_surat ? 'border-rose-400 bg-rose-50' : 'border-slate-300 hover:border-sky-500 bg-slate-50'
                }`}>
                  <FileText className="w-6 h-6 text-emerald-600 mb-1" />
                  <span className="text-xs text-slate-800 font-bold truncate max-w-[200px]">
                    {picSecondary.suratTugasFileName ? picSecondary.suratTugasFileName : 'Pilih Berkas Surat Tugas'}
                  </span>
                  <span className="text-[10px] text-slate-500 mt-0.5">Format PDF Bertanda Tangan Pimpinan</span>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => handleFileUpload('pic2', 'suratTugas', e)}
                    className="hidden"
                  />
                </label>
                {errors.pic2_surat && <p className="text-[10px] text-rose-500 font-semibold mt-1">{errors.pic2_surat}</p>}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between border-t border-slate-200 pt-6 mt-8">
        <button
          type="button"
          onClick={handleBack}
          disabled={currentStep === 1}
          className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold transition ${
            currentStep === 1
              ? 'opacity-40 cursor-not-allowed bg-slate-100 text-slate-400'
              : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Sebelumnya</span>
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="flex items-center space-x-2 px-6 py-2.5 rounded-xl text-xs font-bold glass-button-primary text-white shadow-lg transition transform active:scale-95"
        >
          <span>{currentStep === 4 ? 'Simpan & Kirim Registrasi' : 'Langkah Selanjutnya'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
