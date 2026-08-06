import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Filter, 
  Download, 
  FileText, 
  Building2, 
  CheckCircle2, 
  Calendar, 
  DollarSign, 
  Sparkles, 
  ExternalLink,
  Layers,
  ShieldCheck,
  Tag
} from 'lucide-react';
import { Proposal, Regulation } from '../types';
import { downloadDocument } from '../utils/downloadHelper';

interface RegulationDatabasePageProps {
  regulations: Regulation[];
  activeProposals: Proposal[];
}

export const RegulationDatabasePage: React.FC<RegulationDatabasePageProps> = ({ 
  regulations, 
  activeProposals 
}) => {
  const [activeTab, setActiveTab] = useState<'regulations' | 'partnerships'>('regulations');
  
  // Regulations Filter & Search
  const [regSearch, setRegSearch] = useState<string>('');
  const [regCategory, setRegCategory] = useState<string>('ALL');

  // Partnerships Filter & Search
  const [partSearch, setPartSearch] = useState<string>('');
  const [sectorFilter, setSectorFilter] = useState<string>('ALL');

  const filteredRegulations = regulations.filter((r) => {
    const matchesSearch = 
      r.title.toLowerCase().includes(regSearch.toLowerCase()) ||
      r.number.toLowerCase().includes(regSearch.toLowerCase()) ||
      r.description.toLowerCase().includes(regSearch.toLowerCase());
    const matchesCat = regCategory === 'ALL' || r.category === regCategory;
    return matchesSearch && matchesCat;
  });

  const filteredPartnerships = activeProposals.filter((p) => {
    const matchesSearch = 
      p.title.toLowerCase().includes(partSearch.toLowerCase()) ||
      p.institutionName.toLowerCase().includes(partSearch.toLowerCase()) ||
      p.registrationCode.toLowerCase().includes(partSearch.toLowerCase());
    const matchesSector = sectorFilter === 'ALL' || p.sector === sectorFilter;
    return matchesSearch && matchesSector;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Banner Navigation Tabs Light Mode */}
      <div className="glass-panel p-5 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/85 border border-amber-500/30">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-600" />
            <span>Katalog Regulasi & Database Kerja Sama Daerah</span>
          </h2>
          <p className="text-slate-600 text-xs font-medium mt-0.5">
            Pusat data transparansi peraturan kerja sama Kabupaten Gunungkidul dan direktori kemitraan aktif.
          </p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-300 self-start sm:self-auto shadow-inner">
          <button
            onClick={() => setActiveTab('regulations')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'regulations'
                ? 'glass-button-primary text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Regulasi Daerah ({regulations.length})
          </button>
          <button
            onClick={() => setActiveTab('partnerships')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'partnerships'
                ? 'glass-button-primary text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Database Kemitraan Aktif ({activeProposals.length})
          </button>
        </div>
      </div>

      {/* TAB 1: REGULASI DAERAH */}
      {activeTab === 'regulations' && (
        <div className="space-y-4 animate-fade-in">
          {/* Controls Bar */}
          <div className="glass-card p-4 rounded-2xl flex flex-col md:flex-row gap-3 bg-white/80">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari nomor peraturan, judul, atau kata kunci..."
                value={regSearch}
                onChange={(e) => setRegSearch(e.target.value)}
                className="w-full glass-input rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 font-medium placeholder-slate-400"
              />
            </div>

            <select
              value={regCategory}
              onChange={(e) => setRegCategory(e.target.value)}
              className="glass-input rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold bg-white"
            >
              <option value="ALL">Semua Kategori Regulasi</option>
              <option value="PERDA">Peraturan Daerah (Perda)</option>
              <option value="PERBUP_PERWALI">Peraturan Bupati / Walikota</option>
              <option value="SK_BUPATI">Keputusan Bupati / Walikota</option>
              <option value="JUKNIS_TKKSD">Juknis & Panduan TKKSD</option>
            </select>
          </div>

          {/* Grid Cards Peraturan */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredRegulations.map((reg) => (
              <div key={reg.id} className="glass-panel p-6 rounded-3xl space-y-3 border border-slate-200 bg-white/90 hover:border-amber-400 shadow-sm transition">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-amber-900 bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-lg">
                    {reg.number}
                  </span>
                  <span className="text-[10px] text-slate-600 bg-slate-100 font-bold px-2 py-0.5 rounded-lg border border-slate-200">
                    Tahun {reg.year}
                  </span>
                </div>

                <h3 className="text-sm font-extrabold text-slate-900 leading-snug line-clamp-2">{reg.title}</h3>
                <p className="text-slate-700 text-xs font-medium line-clamp-2 leading-relaxed">{reg.description}</p>

                <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-[10px] text-slate-600 font-bold flex items-center gap-1">
                    <Tag className="w-3 h-3 text-amber-600" />
                    Kategori: {reg.category.replace('_', ' ')}
                  </span>

                  <button
                    onClick={() => downloadDocument(
                      reg.fileUrl && reg.fileUrl !== '#' ? reg.fileUrl : `${reg.number.replace(/\s+/g, '_')}.pdf`,
                      `Dokumen Peraturan - ${reg.number}`,
                      `Salinan Peraturan Resmi: ${reg.number} (${reg.year}). Judul: ${reg.title}. Kategori: ${reg.category}. Deskripsi: ${reg.description}`
                    )}
                    className="flex items-center space-x-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: DATABASE KEMITRAAN AKTIF */}
      {activeTab === 'partnerships' && (
        <div className="space-y-4 animate-fade-in">
          {/* Controls Bar */}
          <div className="glass-card p-4 rounded-2xl flex flex-col md:flex-row gap-3 bg-white/80">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari nama mitra, judul PKS, lokasi..."
                value={partSearch}
                onChange={(e) => setPartSearch(e.target.value)}
                className="w-full glass-input rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 font-medium placeholder-slate-400"
              />
            </div>

            <select
              value={sectorFilter}
              onChange={(e) => setSectorFilter(e.target.value)}
              className="glass-input rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold bg-white"
            >
              <option value="ALL">Semua Sektor Fokus</option>
              <option value="DIGITAL_TEKNOLOGI">Digitalisasi & Smart City</option>
              <option value="PENDIDIKAN_SDM">Pendidikan & Pelatihan SDM</option>
              <option value="KESEHATAN">Kesehatan</option>
              <option value="INFRASTRUKTUR">Infrastruktur</option>
              <option value="EKONOMI_UMKM">Ekonomi & UMKM</option>
              <option value="LINGKUNGAN">Lingkungan Hidup</option>
            </select>
          </div>

          {/* Interactive Table Database Light Mode */}
          <div className="glass-panel rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-800">
                <thead className="bg-slate-50 text-slate-700 text-[10px] uppercase font-black tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="p-4">Kode & Mitra Lembaga</th>
                    <th className="p-4">Judul Kerja Sama (PKS)</th>
                    <th className="p-4">Sektor</th>
                    <th className="p-4">Nilai Investasi</th>
                    <th className="p-4">Status & Monev</th>
                    <th className="p-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPartnerships.map((item) => (
                    <tr key={item.id} className="hover:bg-amber-50/50 transition">
                      <td className="p-4">
                        <div className="font-mono text-[10px] text-amber-800 font-extrabold mb-0.5">{item.registrationCode}</div>
                        <div className="font-extrabold text-slate-900 text-xs">{item.institutionName}</div>
                        <div className="text-[10px] text-slate-500 font-medium">{item.institutionCategory.replace('_', ' ')}</div>
                      </td>
                      <td className="p-4 max-w-[240px]">
                        <div className="font-bold text-slate-900 line-clamp-2">{item.title}</div>
                        <div className="text-[10px] text-slate-500 font-medium mt-0.5">{item.targetLocation} ({item.durationMonths} Bulan)</div>
                      </td>
                      <td className="p-4">
                        <span className="bg-slate-100 border border-slate-200 px-2 py-1 rounded-lg text-[10px] font-bold text-slate-800">
                          {item.sector.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-4 font-black text-emerald-700">
                        Rp {item.budgetEstimate.toLocaleString('id-ID')}
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col gap-1">
                          <span className="inline-flex items-center text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-lg w-fit">
                            <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" /> Aktif
                          </span>
                          <span className="text-[10px] text-slate-500 font-medium">
                            {item.monevReports.length > 0 ? `Laporan Monev: ${item.monevReports.length} Berkas` : 'Monev Berjalan'}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => downloadDocument(
                            item.documentMouUrl || `Dokumen_PKS_${item.registrationCode}.pdf`,
                            `Dokumen PKS - ${item.registrationCode}`,
                            `Perjanjian Kerja Sama (PKS) Resmi Nomor Registrasi ${item.registrationCode}. Judul: "${item.title}". Mitra: ${item.institutionName}. Sektor: ${item.sector}. Lokasi: ${item.targetLocation}. Durasi: ${item.durationMonths} Bulan.`
                          )}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-xl text-[11px] font-bold transition inline-flex items-center gap-1 shadow-xs cursor-pointer"
                        >
                          <FileText className="w-3 h-3 text-amber-600" />
                          <span>Download PKS PDF</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
