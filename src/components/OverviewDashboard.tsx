import React from 'react';
import { 
  Building2, 
  MapPin, 
  Users, 
  TrendingUp, 
  Sparkles, 
  BookOpen, 
  FileCheck2, 
  Award, 
  ShieldCheck, 
  CheckSquare, 
  Globe, 
  Layers, 
  ArrowUpRight, 
  Compass, 
  Handshake, 
  Mountain, 
  Droplets, 
  Zap, 
  ChevronDown, 
  CheckCircle2,
  FilePlus,
  Activity
} from 'lucide-react';
import { UserSession } from './LoginPage';

interface OverviewDashboardProps {
  user: UserSession;
  onNavigateTab: (tab: 'overview' | 'registration' | 'proposal' | 'tracking' | 'regulations' | 'setda_admin') => void;
  pendingApprovalCount?: number;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({ 
  user, 
  onNavigateTab,
  pendingApprovalCount = 0
}) => {

  // Stacked Section Cards Data for Gunungkidul Regional Cooperation
  const cooperationThemes = [
    {
      id: 'ksad',
      title: '1. Kerja Sama Antar Daerah (KSAD)',
      subtitle: 'Sinergi Pembangunan Lintas Kabupaten/Kota & Skema Pawonsari',
      badge: 'KSAD Pemkab',
      badgeBg: 'bg-amber-500/10 text-amber-800 border-amber-400',
      icon: MapPin,
      gradient: 'from-amber-500/10 via-amber-600/5 to-transparent',
      borderColor: 'border-amber-400/60',
      description: 'Kabupaten Gunungkidul aktif menjalin Kerja Sama Antar Daerah (KSAD) dalam wadah kerja sama kawasan seperti Pawonsari (Pacitan, Wonogiri, Gunungkidul) dan Kartamantul DIY.',
      highlights: [
        { label: 'Ketahanan Pangan & Pertanian Lahan Kering', detail: 'Suplai pasokan komoditas jagung, singkong (gaplek), dan kedelai antar wilayah perbatasan DIY - Jateng.' },
        { label: 'Pengelolaan Air Bersih & Karst', detail: 'Konservasi sistem sungai bawah tanah karst Gua Bribin & Seropan lintas perbatasan wilayah administrasi.' },
        { label: 'Koridor Pariwisata Pawonsari', detail: 'Integrasi paket wisata Geopark Gunungsewu (Pantai Klayar Pacitan, Museum Karst Wonogiri, & Pantai Gunungkidul).' }
      ],
      metrics: { title: 'Mitra Daerah Aktif', value: '8 Kab/Kota', icon: Globe }
    },
    {
      id: 'ksdpk',
      title: '2. Kerja Sama Pihak Ketiga & Swasta (KSDPK)',
      subtitle: 'Investasi Inklusi, CSR/TJSL Daerah, & Pengembangan DUDI',
      badge: 'KSDPK Swasta',
      badgeBg: 'bg-emerald-500/10 text-emerald-800 border-emerald-400',
      icon: Handshake,
      gradient: 'from-emerald-500/10 via-teal-600/5 to-transparent',
      borderColor: 'border-emerald-400/60',
      description: 'Mendorong masuknya investasi sektor swasta dan Tanggung Jawab Sosial Lingkungan (TJSL/CSR) yang berdampak langsung pada kesejahteraan masyarakat pedesaan.',
      highlights: [
        { label: 'Investasi Pariwisata Ramah Lingkungan', detail: 'Pengembangan beach club bernuansa kearifan lokal, resort Geopark, dan fasilitas sport-tourism maritim.' },
        { label: 'CSR Digitalisasi Agro-Komoditas', detail: 'Program modernisasi alat panen & green-house berbasis IoT kerja sama dengan korporasi nasional.' },
        { label: 'Jaringan Energi Terbarukan (PLTS)', detail: 'Pemasangan panel surya pompa air bawah tanah karst untuk suplai air minum daerah rawan kekeringan.' }
      ],
      metrics: { title: 'Realisasi Komitmen CSR', value: 'Rp 42.8 Miliar', icon: TrendingUp }
    },
    {
      id: 'ksdpt',
      title: '3. Kerja Sama Perguruan Tinggi & Riset (KSDPT)',
      subtitle: 'KKN Tematik, Inovasi Inovatif, & Pendampingan BUMDes',
      badge: 'Akademisi & Riset',
      badgeBg: 'bg-sky-500/10 text-sky-800 border-sky-400',
      icon: Mountain,
      gradient: 'from-sky-500/10 via-blue-600/5 to-transparent',
      borderColor: 'border-sky-400/60',
      description: 'Kolaborasi riset terapan dengan Universitas Terkemuka (UGM, UNY, UPN, UIN) untuk mengakselerasi potensi lokal dan tata kelola pemerintahan desa.',
      highlights: [
        { label: 'KKN Tematik Pembinaan BUMDes', detail: 'Penerjun ribuan mahasiswa tiap semester untuk digitalisasi 144 BUMDes dan Desa Wisata Gunungkidul.' },
        { label: 'Riset Pelestarian Geopark UNESCO', detail: 'Studi ilmiah keberlanjutan ekosistem bentang alam karst Gunungsewu dan biota laut pantai selatan.' },
        { label: 'Riset Teknologi Pengolahan Pangan', detail: 'Hilirisasi produk olahan mocaf, thiwul instant, serta teknologi pengawetan makanan tradisional.' }
      ],
      metrics: { title: 'Kampus Mitra MoU', value: '24 Kampus', icon: BookOpen }
    },
    {
      id: 'ksd-umkm',
      title: '4. Kemitraan Komunitas & Penguatan UMKM Lokal',
      subtitle: 'Pemberdayaan Warga Kapanewon & Pasar Digital Produk Lokal',
      badge: 'Komunitas & UMKM',
      badgeBg: 'bg-orange-500/10 text-orange-800 border-orange-400',
      icon: Users,
      gradient: 'from-orange-500/10 via-amber-600/5 to-transparent',
      borderColor: 'border-orange-400/60',
      description: 'Wadah kolaborasi inklusif yang menghubungkan Pokdarwis, Lembaga Swadaya Masyarakat, dan asosiasi UMKM dengan jaringan pasar nasional.',
      highlights: [
        { label: 'Sertifikasi Halal & PIRT Gratis', detail: 'Fasilitasi legalitas produk kuliner olahan khas Gunungkidul kerja sama dengan Badan Penyelenggara JPH.' },
        { label: 'Pendampingan Desa Wisata Berkelanjutan', detail: 'Standardisasi homestay warga dan sertifikasi CHSE untuk 40+ destinasi wisata berbasis komunitas.' },
        { label: 'Pemasaran E-Commerce Produk Kerajinan', detail: 'Bimbingan teknis ekspor batu alam, batik kayu, dan produk kerajinan bambu ke pasar mancanegara.' }
      ],
      metrics: { title: 'Binaan UMKM Terfasilitasi', value: '1,280 Unit', icon: Award }
    }
  ];

  return (
    <div className="space-y-10 animate-fade-in relative pb-12">
      
      {/* SMARTPHONE MOBILE DASHBOARD DASHBOARD QUICK ACCESS CARDS */}
      <div className="md:hidden space-y-4">
        <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-white rounded-2xl p-4 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider opacity-90">MEMITRAN Mobile Portal</span>
            <h2 className="text-lg font-extrabold leading-tight">Halo, {user.name.split(',')[0]}</h2>
            <p className="text-[11px] opacity-90 font-medium">
              {user.role === 'TKKSD_ADMIN' ? 'Verifikator TKKSD Setda' : user.institutionName}
            </p>
          </div>
          <div className="w-12 h-14 bg-white/20 backdrop-blur-md rounded-xl p-1 shrink-0 flex items-center justify-center border border-white/30 shadow-xs">
            <img src="/logo-gunungkidul.svg" alt="Logo" className="w-full h-full object-contain" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onNavigateTab('registration')}
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
            onClick={() => onNavigateTab('proposal')}
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
            onClick={() => onNavigateTab('tracking')}
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
            onClick={() => onNavigateTab('regulations')}
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

        {user.role === 'TKKSD_ADMIN' && (
          <button
            onClick={() => onNavigateTab('setda_admin')}
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

      {/* HERO CARD HEADER WITH REGIONAL EMBLEM */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 lg:p-10 relative overflow-hidden shadow-xl border border-amber-500/30">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
          
          <div className="max-w-2xl space-y-5">
            <div className="inline-flex items-center space-x-2 glass-badge px-3.5 py-1 rounded-full text-xs font-bold border-amber-400 text-amber-800 bg-amber-50">
              <Sparkles className="w-4 h-4 text-amber-600 animate-pulse" />
              <span>MEMITRAN • Dashboard Kerja Sama Daerah Kabupaten Gunungkidul</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Sinergi Pembangunan <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 bg-clip-text text-transparent">
                Kerja Sama Daerah Gunungkidul
              </span>
            </h1>

            <p className="text-slate-700 text-sm sm:text-base leading-relaxed font-normal">
              Informasi lengkap dan pengelolaan kemitraan strategis Pemerintah Kabupaten Gunungkidul berdasarkan <strong>Permendagri No. 22 Tahun 2020</strong>. Mengakselerasi potensi pariwisata pantai, Geopark Gunungsewu, inovasi pertanian karst, dan kesejahteraan masyarakat 18 Kapanewon.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onNavigateTab('proposal')}
                className="glass-button-primary px-5 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 shadow-lg hover:scale-105 transition cursor-pointer"
              >
                <span>Ajukan Kerja Sama Sekarang</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => onNavigateTab('regulations')}
                className="px-5 py-2.5 bg-white/90 hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold flex items-center space-x-2 shadow-xs transition cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-amber-600" />
                <span>Lihat Regulasi Resmi</span>
              </button>
            </div>
          </div>

          {/* Hero Lambang Gunungkidul Display */}
          <div className="w-48 h-60 shrink-0 glass-card p-6 rounded-3xl flex flex-col items-center justify-center text-center space-y-3 border border-amber-300 shadow-xl bg-white/80">
            <img 
              src="/logo-gunungkidul.svg" 
              alt="Lambang Daerah Kabupaten Gunungkidul" 
              className="w-28 h-36 object-contain filter drop-shadow-xl hover:scale-105 transition animate-logo-glow"
            />
            <div className="text-[11px] font-extrabold text-amber-800 tracking-wider">
              DHAKSINARGA BHUMIKARTA
            </div>
          </div>

        </div>
      </div>

      {/* STATISTICAL SUMMARY HIGHLIGHTS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-2xl border border-amber-300/60 bg-white/80 space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold text-slate-600">Total MoU & PKS</span>
            <Handshake className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">142</p>
          <p className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> 118 Aktif Berjalan
          </p>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-emerald-300/60 bg-white/80 space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold text-slate-600">Mitra Terverifikasi</span>
            <Building2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">86 Instansi</p>
          <p className="text-[10px] text-slate-500 font-semibold">Swasta, Perguruan Tinggi & Pemkab</p>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-sky-300/60 bg-white/80 space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold text-slate-600">Wilayah Jangkauan</span>
            <MapPin className="w-4 h-4 text-sky-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">18 Kapanewon</p>
          <p className="text-[10px] text-sky-700 font-semibold">144 Kalurahan Terfasilitasi</p>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-orange-300/60 bg-white/80 space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold text-slate-600">Skor Evaluasi Monev</span>
            <Award className="w-4 h-4 text-orange-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">94.8%</p>
          <p className="text-[10px] text-amber-700 font-bold">Predikat Sangat Efektif (A)</p>
        </div>
      </div>

      {/* SECTION HEADER FOR STACKED CARDS */}
      <div className="text-center max-w-2xl mx-auto space-y-2 pt-4">
        <div className="inline-flex items-center space-x-1.5 bg-amber-100 text-amber-900 px-3 py-1 rounded-full text-xs font-extrabold border border-amber-300">
          <Layers className="w-3.5 h-3.5 text-amber-600" />
          <span>EKSPLORASI TEMA KERJA SAMA (STACKED SCROLL)</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Fokus & Bidang Kerja Sama Kabupaten Gunungkidul
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 font-medium">
          Gulir ke bawah (*scroll down*) untuk melihat setiap tema kerja sama yang saling menumpuk secara dinamis.
        </p>
      </div>

      {/* DYNAMIC STACKED CARDS CONTAINER ON SCROLL */}
      <div className="space-y-10 relative pt-2">
        {cooperationThemes.map((theme, index) => {
          const Icon = theme.icon;
          const MetricIcon = theme.metrics.icon;

          // Top offset calculation for sticky stack effect (top-24, top-28, top-32, top-36 etc.)
          const stickyTopClasses = [
            'top-24',
            'top-28',
            'top-32',
            'top-36'
          ];
          const stickyTopClass = stickyTopClasses[index % stickyTopClasses.length];
          const zIndexStyle = { zIndex: 10 + index * 5 };

          return (
            <div
              key={theme.id}
              style={zIndexStyle}
              className={`sticky ${stickyTopClass} transition-all duration-300`}
            >
              <div 
                className={`glass-panel rounded-3xl p-6 sm:p-8 border ${theme.borderColor} shadow-2xl bg-white/95 backdrop-blur-xl relative overflow-hidden space-y-6 transform hover:-translate-y-1 transition duration-300`}
              >
                {/* Background Gradient Glow */}
                <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} pointer-events-none`} />

                {/* Card Header & Badge */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10 border-b border-slate-200 pb-5">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-md shrink-0">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-extrabold text-slate-900 leading-tight">
                        {theme.title}
                      </h3>
                      <p className="text-xs font-semibold text-slate-600 pt-0.5">
                        {theme.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0">
                    <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${theme.badgeBg}`}>
                      {theme.badge}
                    </span>
                    <span className="text-[10px] text-slate-600 font-mono font-bold bg-slate-100 border border-slate-200 px-2 py-1 rounded-lg">
                      Kartu #{index + 1}
                    </span>
                  </div>
                </div>

                {/* Description Body */}
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed relative z-10 font-normal">
                  {theme.description}
                </p>

                {/* Highlights List */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
                  {theme.highlights.map((item, hIdx) => (
                    <div 
                      key={hIdx} 
                      className="bg-white/80 border border-slate-200/80 p-4 rounded-2xl space-y-1.5 shadow-xs hover:border-amber-400 transition"
                    >
                      <div className="flex items-center space-x-1.5 text-slate-900 font-bold text-xs">
                        <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>{item.label}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-normal font-medium">
                        {item.detail}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Card Footer with Metrics & Action Button */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-slate-200/80 relative z-10">
                  <div className="flex items-center space-x-2 text-xs font-bold text-slate-800">
                    <MetricIcon className="w-4 h-4 text-amber-600" />
                    <span>Capaian Kunci:</span>
                    <span className="bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full font-black text-xs border border-amber-300">
                      {theme.metrics.value}
                    </span>
                  </div>

                  <button
                    onClick={() => onNavigateTab('proposal')}
                    className="inline-flex items-center justify-center space-x-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer active:scale-95"
                  >
                    <span>Ajukan Kerjasama Tema Ini</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-amber-400" />
                  </button>
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* WORKFLOW BANNER SECTION */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-5 border border-amber-400/50 shadow-xl bg-white/90 relative z-40">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <FileCheck2 className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                Alur Resmi Verifikasi Kerja Sama TKKSD Kabupaten Gunungkidul
              </h3>
              <p className="text-[11px] text-slate-600 font-medium">Sesuai Permendagri No. 22 Tahun 2020</p>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('registration')}
            className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer"
          >
            <span>Mulai Pendaftaran &rarr;</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="glass-card p-4 rounded-2xl space-y-1.5 border border-amber-200">
            <span className="text-amber-800 font-black font-mono text-[10px] bg-amber-100 px-2 py-0.5 rounded">Tahap 1</span>
            <h4 className="font-extrabold text-slate-900">Registrasi 2 PIC Resmi</h4>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Input data instansi, PIC Utama & Pendamping, serta unggah Surat Tugas TKKSD Gunungkidul.
            </p>
          </div>

          <div className="glass-card p-4 rounded-2xl space-y-1.5 border border-amber-200">
            <span className="text-amber-800 font-black font-mono text-[10px] bg-amber-100 px-2 py-0.5 rounded">Tahap 2</span>
            <h4 className="font-extrabold text-slate-900">Submit Naskah Proposal</h4>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Pilih sektor, input rincian kegiatan, estimasi anggaran, lokasi Kapanewon, dan berkas PDF.
            </p>
          </div>

          <div className="glass-card p-4 rounded-2xl space-y-1.5 border border-amber-200">
            <span className="text-amber-800 font-black font-mono text-[10px] bg-amber-100 px-2 py-0.5 rounded">Tahap 3</span>
            <h4 className="font-extrabold text-slate-900">Sidang Pleno TKKSD</h4>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Kajian teknis Dinas Terkait, rekomendasi Sekretariat Setda, dan penyusunan Draf PKS.
            </p>
          </div>

          <div className="glass-card p-4 rounded-2xl space-y-1.5 border border-emerald-300 bg-emerald-50/40">
            <span className="text-emerald-800 font-black font-mono text-[10px] bg-emerald-100 px-2 py-0.5 rounded">Tahap 4</span>
            <h4 className="font-extrabold text-slate-900">Monev & Laporan %</h4>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Pelaksanaan kemitraan daerah, pelaporan progres berkala, dan evaluasi capaian tahunan.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
