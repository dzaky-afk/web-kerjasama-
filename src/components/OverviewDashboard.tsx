import React, { useState } from 'react';
import { createPortal } from 'react-dom';
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
  Handshake, 
  Mountain, 
  CheckCircle2,
  FilePlus,
  Activity,
  Info,
  X,
  FileText,
  PhoneCall,
  Building,
  ChevronRight
} from 'lucide-react';
import { UserSession } from './LoginPage';

interface OverviewDashboardProps {
  user: UserSession;
  onNavigateTab: (tab: 'overview' | 'registration' | 'proposal' | 'tracking' | 'regulations' | 'setda_admin') => void;
  pendingApprovalCount?: number;
}

interface CooperationTheme {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  badgeBg: string;
  icon: any;
  gradient: string;
  borderColor: string;
  description: string;
  highlights: { label: string; detail: string }[];
  metrics: { title: string; value: string; icon: any };
  details: {
    legalBasis: string[];
    activePartners: string[];
    priorityLocations: string[];
    activities: string[];
    requiredDocs: string[];
    expectedImpact: string[];
    contactSubKomisi: string;
  };
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({ 
  user, 
  onNavigateTab,
  pendingApprovalCount = 0
}) => {
  const [selectedThemeModal, setSelectedThemeModal] = useState<CooperationTheme | null>(null);

  // ESC Key listener to close modal smoothly
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedThemeModal(null);
      }
    };
    if (selectedThemeModal) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedThemeModal]);

  // Lock body scroll when modal is open to prevent background scrolling bug
  React.useEffect(() => {
    if (selectedThemeModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedThemeModal]);

  // Stacked Section Cards Data for Gunungkidul Regional Cooperation
  const cooperationThemes: CooperationTheme[] = [
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
      metrics: { title: 'Mitra Daerah Aktif', value: '8 Kab/Kota', icon: Globe },
      details: {
        legalBasis: [
          'Permendagri No. 22 Tahun 2020 tentang Tata Cara Kerja Sama Daerah dengan Daerah Lain',
          'Peraturan Daerah Kabupaten Gunungkidul No. 4 Tahun 2021 tentang Kerjasama Daerah',
          'Naskah Kesepakatan Bersama Kawasan Pawonsari (Pacitan, Wonogiri, Gunungkidul)'
        ],
        activePartners: [
          'Pemerintah Kota Yogyakarta',
          'Pemerintah Kabupaten Bantul',
          'Pemerintah Kabupaten Sleman',
          'Pemerintah Kabupaten Kulon Progo',
          'Pemerintah Kabupaten Pacitan (Jawa Timur)',
          'Pemerintah Kabupaten Wonogiri (Jawa Tengah)'
        ],
        priorityLocations: [
          'Kapanewon Semanu (Fasilitas Pompa Air Karst Bribin)',
          'Kapanewon Ponjong & Karangmojo (Pertanian Pangan Lahan Kering)',
          'Kapanewon Girisubo & Rongkop (Perbatasan Pacitan - Jateng)',
          'Kapanewon Patuk (Gerbang Pintu Masuk Pariwisata DIY)'
        ],
        activities: [
          'Pengembangan Sistem Informasi Pasar Hasil Tani Perbatasan Lintas Kabupaten.',
          'Pembangunan Infrastruktur Bersama Jalur Jalan Lintas Selatan (JJLS) Koridor Pariwisata.',
          'Konservasi Gabungan Daerah Aliran Sungai (DAS) & Gua Karst Subterranean Water.',
          'Pelatihan Bersama Mitigasi Bencana Kekeringan & Penanganan Kebakaran Hutan.'
        ],
        requiredDocs: [
          'Naskah Kesepakatan Bersama (MoU) antar Kepala Daerah (Bupati/Walikota).',
          'Perjanjian Kerja Sama (PKS) antar Kepala Dinas/Organisasi Perangkat Daerah (OPD).',
          'Kerangka Acuan Kerja (KAK) & Analisis Kebutuhan Anggaran APBD Bersama.',
          'Surat Keputusan Tim Kerja Sama Daerah (TKKSD) Kedua Belah Pihak.'
        ],
        expectedImpact: [
          'Menjamin ketersediaan pasokan air bersih 12.000 KK di wilayah karst selatan.',
          'Meningkatkan kunjungan wisatawan Geopark Gunungsewu hingga +35% per tahun.',
          'Stabilisasi harga komoditas jagung & kedelai lokal di tingkat petani.'
        ],
        contactSubKomisi: 'Sub-Komisi KSAD Sekretariat TKKSD Setda Gunungkidul (Telp: 0274-391002 / Email: ksad@gunungkidulkab.go.id)'
      }
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
      metrics: { title: 'Realisasi Komitmen CSR', value: 'Rp 42.8 Miliar', icon: TrendingUp },
      details: {
        legalBasis: [
          'Permendagri No. 22 Tahun 2020 Tata Cara KSDPK (Kerja Sama Daerah dengan Pihak Ketiga)',
          'Perda Kabupaten Gunungkidul No. 5 Tahun 2021 tentang Tanggung Jawab Sosial Perusahaan (TJSP)',
          'Perbup Gunungkidul No. 18 Tahun 2022 tentang Insentif & Kemudahan Berinvestasi'
        ],
        activePartners: [
          'PT Kerjasama Teknologi Nusantara',
          'PT Pembangunan Pariwisata Gunungkidul (BUMD)',
          'Bank BPD DIY Cabang Wonosari',
          'Danone Aqua Indonesia (Program Konservasi Air)',
          'PT Telkom Indonesia (Digitalisasi Desa Wisata)'
        ],
        priorityLocations: [
          'Kapanewon Tanjungsari & Tepus (Kawasan Destinasi Pantai Selatan)',
          'Kapanewon Panggang & Purwosari (Investasi Pariwisata Karst)',
          'Kapanewon Nglipar & Playen (Kawasan Pertanian & Kehutanan)',
          'Kapanewon Wonosari (Pusat Sentra Kuliner & UMKM)'
        ],
        activities: [
          'Penyediaan Fasilitas Umum & Ruang Terbuka Hijau melalui Program CSR Korporasi.',
          'Pembangunan Dermaga Wisata & Fasilitas Olahraga Maritim Pantai Selatan.',
          'Pemberdayaan Petani Karst dengan Pembagian 50.000 Bibit Pohon Buah Produktif.',
          'Pemasangan WiFi Gratis & Sensor Kualitas Air Bawah Tanah di 40 Desa.'
        ],
        requiredDocs: [
          'Akta Pendirian Perusahaan & Pengesahan Kemenkumham RI.',
          'Nomor Induk Berusaha (NIB) Berbasis Risiko (OSS RBA).',
          'Profil Perusahaan & Laporan Keuangan Audit 2 Tahun Terakhir.',
          'Naskah Proposal Usulan Kemitraan (Feasibility Study) Lengkap.'
        ],
        expectedImpact: [
          'Penyerapan tenaga kerja lokal Gunungkidul hingga 1.800+ pekerja baru.',
          'Peningkatan Pendapatan Asli Daerah (PAD) dari sektor retribusi & pajak investasi.',
          'Penyediaan fasilitas air minum bersih berbasis Solar Cell di 12 titik rawan.'
        ],
        contactSubKomisi: 'Sub-Komisi KSDPK Dinas Penanaman Modal & Pelayanan Terpadu Satu Pintu (DPMPTSP) / TKKSD Gunungkidul'
      }
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
      metrics: { title: 'Kampus Mitra MoU', value: '24 Kampus', icon: BookOpen },
      details: {
        legalBasis: [
          'Permendagri No. 22 Tahun 2020 Bab IV Kerja Sama Riset & Pendidikan Tinggi',
          'Nota Kesepahaman (MoU) Bupati Gunungkidul dengan Rektor Universitas Mitra',
          'Pedoman Pelaksanaan KKN Tematik & MBKM Kementerian Pendikti RI'
        ],
        activePartners: [
          'Universitas Gadjah Mada (UGM Yogyakarta)',
          'Universitas Negeri Yogyakarta (UNY Wonosari Campus)',
          'UPN "Veteran" Yogyakarta',
          'UIN Sunan Kalijaga Yogyakarta',
          'Universitas Atma Jaya Yogyakarta',
          'Institut Teknologi Nasional Yogyakarta (ITNY)'
        ],
        priorityLocations: [
          'Kapanewon Patuk (Kawasan Gunung Nglanggeran - Riset Volkano-Karst)',
          'Kapanewon Semanu & Bedoyo (Riset Sumber Daya Geologi & Goa Karst)',
          'Kapanewon Paliyan & Saptosari (Pendampingan BUMDes & Olahan Pangan)',
          'Seluruh 144 Kalurahan Kabupaten Gunungkidul (Lokasi KKN Tematik)'
        ],
        activities: [
          'Penerjunan Mahasiswa KKN Tematik (Tiap Januari & Juli) untuk Digitalisasi Kalurahan.',
          'Riset Pemetaan Potensi Air Bawah Tanah Menggunakan Metode Geolistrik.',
          'Pendampingan Inkubasi Bisnis UMKM Produk Pangan Olahan Mocaf & Kakao.',
          'Pelatihan Tata Kelola Keuangan BUMDes Berbasis Aplikasi Akuntansi Digital.'
        ],
        requiredDocs: [
          'Surat Permohonan Kerja Sama Riset / KKN resmi dari Rektor/Dekan.',
          'Dokumen Kerangka Acuan Kerja (KAK) Riset atau Program Pengabdian Masyarakat.',
          'Surat Tugas Dosen Pembimbing Lapangan (DPL) & Daftar Mahasiswa.',
          'Rancangan Perjanjian Kerja Sama (PKS) Fakultas dengan OPD Teknis.'
        ],
        expectedImpact: [
          'Digitalisasi 100% profil desa dan pemetaan potensi UMKM di 144 Kalurahan.',
          'Inovasi alat filtrasi air minum murah berbasis batuan zeolit alami.',
          'Publikasi jurnal ilmiah internasional bertema pelestarian Geopark UNESCO.'
        ],
        contactSubKomisi: 'Sub-Komisi KSDPT Badan Planning & Riset Daerah (Bapperida) Kab. Gunungkidul'
      }
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
      metrics: { title: 'Binaan UMKM Terfasilitasi', value: '1,280 Unit', icon: Award },
      details: {
        legalBasis: [
          'Permendagri No. 22 Tahun 2020 Bab V Pelibatan Ormas & Komunitas Masyarakat',
          'Perda Kab. Gunungkidul No. 8 Tahun 2020 tentang Pemberdayaan Usaha Mikro',
          'SK Bupati tentang Penetapan Desa Wisata & Pokdarwis Kabupaten Gunungkidul'
        ],
        activePartners: [
          'Forum Pokdarwis Kabupaten Gunungkidul',
          'Asosiasi Pengusaha Kuliner & Olahan Pangan Gunungkidul',
          'Koperasi Batik Kayu Bobung Nglipar',
          'Yayasan Konservasi Alam Nusantara (YKAN)',
          'Himpunan Pramuwisata Indonesia (HPI) Cabang Gunungkidul'
        ],
        priorityLocations: [
          'Kalurahan Bobung Kapanewon Nglipar (Sentra Batik Kayu)',
          'Kalurahan Nglanggeran Kapanewon Patuk (Desa Wisata UNWTO)',
          'Kalurahan Bleberan Kapanewon Playen (Wisata Sri Gethuk)',
          'Kalurahan Tepus & Purwosari (Olahan Pangan & Homestay)'
        ],
        activities: [
          'Bimbingan Teknis Digital Marketing & Onboarding E-Commerce Tokopedia/Shopee.',
          'Pelatihan Manajerial Pengelolaan Homestay & Sertifikasi CHSE Kebersihan.',
          'Fasilitasi Uji Laboratorium & Sertifikasi Halal Gratis bagi 500 Olahan Pangan.',
          'Penyelenggaraan Festival Kuliner Khas & Pameran Kerajinan Batu Alam.'
        ],
        requiredDocs: [
          'Surat Keputusan (SK) Pengesahan Komunitas / Kelompok dari Lurah/Kapanewon.',
          'Struktur Pengurus Resmi & Daftar Anggota Aktif.',
          'Profil Komunitas & Portofolio Kegiatan Pemberdayaan Masyarakat.',
          'Surat Permohonan Kemitraan Program Kerja Sama TKKSD.'
        ],
        expectedImpact: [
          'Kenaikan omzet penjualan produk UMKM lokal rata-rata +45% per semester.',
          'Legalitas sertifikat Halal & PIRT lengkap untuk 1.200+ produk olahan.',
          'Penghargaan Desa Wisata Berkelanjutan Tingkat Nasional & Internasional.'
        ],
        contactSubKomisi: 'Sub-Komisi Kemitraan Komunitas Dinas Koperasi & UMKM / Dinas Pariwisata Kab. Gunungkidul'
      }
    }
  ];

  return (
    <div className="space-y-10 animate-fade-in relative pb-12">
      
      {/* SMARTPHONE MOBILE QUICK ACCESS CARDS */}
      <div className="md:hidden space-y-4">
        <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-white rounded-2xl p-4 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider opacity-90">MEMITRAN Mobile</span>
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
              <span>ACC & Verifikasi Staff Setda</span>
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
        <div className="inline-flex items-center space-x-1.5 bg-amber-100 text-amber-900 px-3.5 py-1 rounded-full text-xs font-extrabold border border-amber-300">
          <Layers className="w-3.5 h-3.5 text-amber-600" />
          <span>TEMA KERJA SAMA DAERAH STRATEGIS</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Fokus & Bidang Kerja Sama Kabupaten Gunungkidul
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 font-medium">
          Gulir ke bawah (*scroll down*) dan klik <strong>"Lihat Informasi Detail"</strong> pada tiap kartu untuk melihat rincian lengkap.
        </p>
      </div>

      {/* DYNAMIC STACKED CARDS CONTAINER ON SCROLL */}
      <div className="space-y-10 relative pt-2">
        {cooperationThemes.map((theme, index) => {
          const Icon = theme.icon;
          const MetricIcon = theme.metrics.icon;

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
                  <div className="flex items-center space-x-3.5 cursor-pointer" onClick={() => setSelectedThemeModal(theme)}>
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center font-bold shadow-md shrink-0 border border-white/20">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-extrabold text-slate-900 leading-tight hover:text-amber-700 transition">
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
                    <button
                      onClick={() => setSelectedThemeModal(theme)}
                      className="px-3.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-extrabold flex items-center space-x-1.5 shadow-xs transition cursor-pointer"
                    >
                      <Info className="w-3.5 h-3.5 text-amber-700" />
                      <span>Lihat Informasi Detail</span>
                    </button>
                  </div>
                </div>

                {/* Description Body */}
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed relative z-10 font-medium">
                  {theme.description}
                </p>

                {/* Highlights List */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
                  {theme.highlights.map((item, hIdx) => (
                    <div 
                      key={hIdx} 
                      onClick={() => setSelectedThemeModal(theme)}
                      className="bg-white/90 border border-slate-200/90 p-4 rounded-2xl space-y-1.5 shadow-xs hover:border-amber-400 transition cursor-pointer group"
                    >
                      <div className="flex items-center justify-between text-slate-900 font-bold text-xs">
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                          {item.label}
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-600 transition" />
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

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setSelectedThemeModal(theme)}
                      className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-extrabold flex items-center space-x-1.5 transition cursor-pointer"
                    >
                      <Info className="w-3.5 h-3.5 text-amber-700" />
                      <span>Detail Selengkapnya</span>
                    </button>

                    {user.role !== 'TKKSD_ADMIN' && (
                      <button
                        onClick={() => onNavigateTab('proposal')}
                        className="inline-flex items-center justify-center space-x-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer active:scale-95"
                      >
                        <span>Ajukan Kerjasama Tema Ini</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-amber-400" />
                      </button>
                    )}
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* DETAILED INFORMATION MODAL POPUP - PORTAL RENDER DIRECTLY ON BODY */}
      {selectedThemeModal && createPortal(
        <div 
          onClick={() => setSelectedThemeModal(null)}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto"
        >
          
          {/* Main Card Wrapper - STRICT OVERFLOW HIDDEN + FLEX COL + PERFECT CENTER */}
          <div 
            onClick={(e) => e.stopPropagation()}
            className="max-w-3xl w-full max-h-[85vh] flex flex-col bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden relative animate-scale-up"
          >
            
            {/* Header Banner - Fixed at Top */}
            <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white p-6 sm:p-8 relative shrink-0">
              {/* Background Light Pattern Blobs */}
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-amber-400/20 rounded-full blur-xl pointer-events-none" />

              <div className="flex items-start justify-between relative z-10 gap-4">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center font-bold shadow-lg shrink-0 border border-white/30">
                    {React.createElement(selectedThemeModal.icon, { className: "w-7 h-7" })}
                  </div>
                  <div>
                    <span className="inline-block bg-white/20 backdrop-blur-md text-white border border-white/40 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider">
                      {selectedThemeModal.badge}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-white leading-tight pt-1 tracking-tight">
                      {selectedThemeModal.title}
                    </h3>
                    <p className="text-xs text-amber-100 font-medium pt-0.5 opacity-95">
                      {selectedThemeModal.subtitle}
                    </p>
                  </div>
                </div>

                <button 
                  onClick={() => setSelectedThemeModal(null)}
                  className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-full transition cursor-pointer shrink-0 backdrop-blur-md border border-white/20"
                  title="Tutup Modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Content Body - Inner Scroll Only */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 bg-slate-50/50 pr-5 sm:pr-7">
              
              {/* Description Box */}
              <div className="bg-amber-50/80 border border-amber-200 p-4 sm:p-5 rounded-2xl space-y-2 shadow-xs">
                <h4 className="text-xs font-black text-amber-900 flex items-center gap-2 uppercase tracking-wide">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Deskripsi & Gambaran Umum Kemitraan</span>
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {selectedThemeModal.description}
                </p>
              </div>

              {/* Grid 2 Columns for Info Sections */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                
                {/* 1. Dasar Regulasi & Payung Hukum */}
                <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-3 shadow-xs hover:border-amber-400 transition">
                  <div className="flex items-center space-x-2 border-b border-slate-100 pb-2.5">
                    <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                      <FileText className="w-4 h-4" />
                    </div>
                    <h4 className="font-extrabold text-slate-900 text-xs">
                      Dasar Regulasi & Payung Hukum
                    </h4>
                  </div>
                  <ul className="space-y-2">
                    {selectedThemeModal.details.legalBasis.map((legal, lIdx) => (
                      <li key={lIdx} className="flex items-start gap-2 text-slate-700 text-[11px] leading-relaxed">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <span className="font-medium">{legal}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 2. Mitra Strategis & Lembaga Terlibat */}
                <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-3 shadow-xs hover:border-emerald-400 transition">
                  <div className="flex items-center space-x-2 border-b border-slate-100 pb-2.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                      <Building className="w-4 h-4" />
                    </div>
                    <h4 className="font-extrabold text-slate-900 text-xs">
                      Mitra Strategis & Lembaga Terlibat
                    </h4>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-0.5">
                    {selectedThemeModal.details.activePartners.map((partner, pIdx) => (
                      <span 
                        key={pIdx} 
                        className="bg-emerald-50 text-emerald-900 border border-emerald-200 px-2.5 py-1 rounded-xl text-[10px] font-extrabold flex items-center gap-1 shadow-2xs"
                      >
                        <Building2 className="w-3 h-3 text-emerald-600" />
                        {partner}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 3. Lokasi & Kapanewon Prioritas */}
                <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-3 shadow-xs hover:border-sky-400 transition">
                  <div className="flex items-center space-x-2 border-b border-slate-100 pb-2.5">
                    <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <h4 className="font-extrabold text-slate-900 text-xs">
                      Lokasi & Kapanewon Prioritas
                    </h4>
                  </div>
                  <ul className="space-y-2 text-slate-700 text-[11px]">
                    {selectedThemeModal.details.priorityLocations.map((loc, locIdx) => (
                      <li key={locIdx} className="flex items-center gap-2 bg-sky-50/60 p-2 rounded-xl border border-sky-100">
                        <span className="w-2 h-2 rounded-full bg-sky-500 shrink-0" />
                        <span className="font-medium text-slate-800">{loc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 4. Dampak & Capaian Kemitraan */}
                <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-3 shadow-xs hover:border-orange-400 transition">
                  <div className="flex items-center space-x-2 border-b border-slate-100 pb-2.5">
                    <div className="w-7 h-7 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center font-bold">
                      <Award className="w-4 h-4" />
                    </div>
                    <h4 className="font-extrabold text-slate-900 text-xs">
                      Dampak & Target Hasil
                    </h4>
                  </div>
                  <ul className="space-y-2 text-slate-700 text-[11px]">
                    {selectedThemeModal.details.expectedImpact.map((imp, impIdx) => (
                      <li key={impIdx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="font-medium">{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

              {/* 5. Bentuk Kegiatan & Program Kerja Utama */}
              <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-3 shadow-xs">
                <div className="flex items-center space-x-2 border-b border-slate-100 pb-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                    <Activity className="w-4 h-4 text-indigo-600" />
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-xs">
                    Bentuk Kegiatan & Program Kerja Utama
                  </h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[11px]">
                  {selectedThemeModal.details.activities.map((act, aIdx) => (
                    <div key={aIdx} className="bg-indigo-50/60 p-3 rounded-xl border border-indigo-100 flex items-start gap-2.5">
                      <span className="bg-indigo-600 text-white font-mono font-black px-1.5 py-0.5 rounded text-[9px] shrink-0">
                        #{aIdx + 1}
                      </span>
                      <span className="text-slate-800 font-medium leading-relaxed">{act}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dokumen Persyaratan & Prosedur Submit */}
              <div className="bg-white border border-amber-300 p-5 rounded-2xl space-y-3 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-black text-slate-900 flex items-center gap-2">
                    <FileCheck2 className="w-4 h-4 text-amber-600" />
                    <span>Checklist Dokumen Syarat PDF (Permendagri No. 22/2020)</span>
                  </h4>
                  <span className="text-[10px] bg-amber-100 text-amber-900 font-extrabold px-2 py-0.5 rounded">
                    Wajib Upload PDF
                  </span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[11px]">
                  {selectedThemeModal.details.requiredDocs.map((doc, dIdx) => (
                    <div key={dIdx} className="bg-amber-50/60 p-3 rounded-xl border border-amber-200/80 flex items-start gap-2.5 shadow-2xs">
                      <span className="bg-amber-500 text-white font-mono font-black px-1.5 py-0.5 rounded text-[9px] shrink-0">
                        DOC #{dIdx + 1}
                      </span>
                      <span className="text-slate-800 font-medium">{doc}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Premium Dark Footer - Fixed at Bottom */}
            <div className="bg-slate-950 text-white p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0 border-t border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold shrink-0 border border-amber-400/30">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">Kontak Layanan TKKSD Gunungkidul</span>
                  <p className="text-[11px] opacity-90 font-medium text-slate-300">{selectedThemeModal.details.contactSubKomisi}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 shrink-0">
                <button
                  onClick={() => setSelectedThemeModal(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold cursor-pointer transition text-xs border border-slate-700"
                >
                  Tutup
                </button>
                {user.role === 'TKKSD_ADMIN' ? (
                  <button
                    onClick={() => {
                      setSelectedThemeModal(null);
                      onNavigateTab('setda_admin');
                    }}
                    className="px-5 py-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-600 hover:to-teal-600 text-white font-extrabold text-xs rounded-xl shadow-lg cursor-pointer transition flex items-center gap-1.5 border border-emerald-300/40 active:scale-95"
                  >
                    <span>Buka Menu ACC Setda</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setSelectedThemeModal(null);
                      onNavigateTab('proposal');
                    }}
                    className="px-5 py-2 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold text-xs rounded-xl shadow-lg cursor-pointer transition flex items-center gap-1.5 border border-amber-300/40 active:scale-95"
                  >
                    <span>Ajukan Proposal Sekarang</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>,
        document.body
      )}

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

          {user.role === 'TKKSD_ADMIN' ? (
            <button
              onClick={() => onNavigateTab('setda_admin')}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
            >
              <span>Kelola Berkas Masuk &rarr;</span>
            </button>
          ) : (
            <button
              onClick={() => onNavigateTab('registration')}
              className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer"
            >
              <span>Mulai Pendaftaran &rarr;</span>
            </button>
          )}
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
