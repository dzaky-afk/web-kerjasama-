import React, { useState } from 'react';
import { 
  Building2, 
  FilePlus, 
  Activity, 
  BookOpen, 
  ShieldCheck, 
  Sparkles, 
  Home,
  LogOut,
  User,
  CheckSquare,
  Bell,
  X,
  Menu,
  ChevronRight,
  FileCheck2
} from 'lucide-react';
import { UserSession } from './LoginPage';

interface NavbarProps {
  activeTab: 'overview' | 'registration' | 'proposal' | 'tracking' | 'regulations' | 'setda_admin';
  setActiveTab: (tab: 'overview' | 'registration' | 'proposal' | 'tracking' | 'regulations' | 'setda_admin') => void;
  user: UserSession | null;
  onLogout: () => void;
  pendingApprovalCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  activeTab, 
  setActiveTab, 
  user, 
  onLogout,
  pendingApprovalCount = 0
}) => {
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const baseNavItems: { id: 'overview' | 'registration' | 'proposal' | 'tracking' | 'regulations' | 'setda_admin'; label: string; icon: any }[] = [
    { id: 'overview', label: 'Beranda', icon: Home },
    { id: 'registration', label: 'Registrasi', icon: Building2 },
    { id: 'proposal', label: 'Proposal', icon: FilePlus },
    { id: 'tracking', label: 'Tracking & Monev', icon: Activity },
    { id: 'regulations', label: 'Katalog Regulasi', icon: BookOpen }
  ];

  // If user is Staff Setda / TKKSD Admin, add dedicated Approval Portal tab
  const navItems = user?.role === 'TKKSD_ADMIN' 
    ? [
        { id: 'setda_admin' as const, label: 'ACC Setda', icon: CheckSquare },
        ...baseNavItems
      ]
    : baseNavItems;

  return (
    <header className="sticky top-0 z-50 glass-nav transition-all duration-300">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Official Regional Logo & Brand Header */}
          <div 
            onClick={() => setActiveTab(user?.role === 'TKKSD_ADMIN' ? 'setda_admin' : 'overview')}
            className="flex items-center space-x-3 cursor-pointer group shrink-0"
          >
            {/* Lambang Kabupaten Gunungkidul */}
            <div className="w-10 h-12 relative flex items-center justify-center filter drop-shadow-md group-hover:scale-105 transition transform shrink-0">
              <img 
                src="/logo-gunungkidul.svg" 
                alt="Lambang Kabupaten Gunungkidul" 
                className="w-full h-full object-contain animate-logo-glow"
              />
            </div>

            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 group-hover:text-amber-600 transition">
                  MEMITRAN
                </span>
                <span className="text-[9px] glass-badge px-1.5 py-0.5 rounded font-mono font-bold border-amber-500/40 text-amber-700 bg-amber-50">
                  GUNUNGKIDUL
                </span>
              </div>
              <p className="text-[10px] text-amber-800 font-semibold truncate hidden sm:block">
                Tim Kerja Sama Daerah (TKKSD) Kab. Gunungkidul
              </p>
            </div>
          </div>

          {/* Navigation Links Light Mode */}
          <nav className="hidden lg:flex items-center space-x-1 bg-white/80 p-1.5 rounded-2xl border border-slate-200 backdrop-blur-md shadow-sm">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const isApprovalTab = item.id === 'setda_admin';

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-300 transform active:scale-95 cursor-pointer relative ${
                    isActive
                      ? 'glass-button-primary text-white shadow-md scale-[1.02]'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 hover:scale-[1.02]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="whitespace-nowrap">{item.label}</span>
                  {isApprovalTab && pendingApprovalCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-rose-500 text-white font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center border border-white shadow-md animate-pulse">
                      {pendingApprovalCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* User Profile, Notification Bell (Admin Only) & Logout */}
          <div className="flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3 relative">
                
                {/* Notification Bell Button (Hanya untuk Admin TKKSD / Staff Setda) */}
                {user.role === 'TKKSD_ADMIN' && (
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowNotifications(!showNotifications)}
                      title="Pemberitahuan Lonceng MEMITRAN"
                      className="p-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl transition shadow-xs cursor-pointer relative"
                    >
                      <Bell className="w-4 h-4 text-amber-700" />
                      {pendingApprovalCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center animate-pulse shadow-xs">
                          {pendingApprovalCount}
                        </span>
                      )}
                    </button>

                    {/* Notification Dropdown Panel */}
                    {showNotifications && (
                      <div className="absolute right-0 mt-3 w-80 sm:w-96 glass-panel bg-white/95 rounded-2xl p-4 shadow-2xl border border-amber-500/40 z-50 animate-fade-in space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                          <div className="flex items-center space-x-2">
                            <Bell className="w-4 h-4 text-amber-600" />
                            <h4 className="text-xs font-black text-slate-900">Pemberitahuan TKKSD</h4>
                          </div>
                          <button 
                            onClick={() => setShowNotifications(false)}
                            className="text-slate-400 hover:text-slate-800 p-0.5 rounded"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1 text-xs">
                          {pendingApprovalCount > 0 ? (
                            <div 
                              onClick={() => {
                                setActiveTab('setda_admin');
                                setShowNotifications(false);
                              }}
                              className="bg-amber-50 border border-amber-300 p-3 rounded-xl space-y-1 cursor-pointer hover:bg-amber-100/80 transition"
                            >
                              <div className="flex items-center justify-between text-[10px] text-amber-900 font-extrabold">
                                <span className="flex items-center gap-1"><FileCheck2 className="w-3 h-3 text-amber-600"/> Antrean Verifikasi</span>
                                <span className="bg-rose-500 text-white px-1.5 py-0.5 rounded font-black">{pendingApprovalCount} Perlu ACC</span>
                              </div>
                              <p className="text-slate-800 font-bold text-[11px]">
                                Terdapat {pendingApprovalCount} usulan kerja sama baru yang membutuhkan verifikasi administrasi & ACC Staff Setda.
                              </p>
                              <span className="text-[10px] text-amber-700 font-bold flex items-center gap-0.5 pt-1">
                                Buka Portal Verifikasi &rarr;
                              </span>
                            </div>
                          ) : (
                            <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl space-y-1 text-slate-600">
                              <p className="font-semibold text-[11px] text-slate-800">Sistem MEMITRAN Berjalan Normal</p>
                              <p className="text-[10px] text-slate-500">Semua usulan dan regulasi kerja sama daerah terverifikasi sah.</p>
                            </div>
                          )}

                          <div 
                            onClick={() => {
                              setActiveTab('tracking');
                              setShowNotifications(false);
                            }}
                            className="bg-white border border-slate-200 p-3 rounded-xl space-y-1 cursor-pointer hover:bg-slate-50 transition"
                          >
                            <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold">
                              <span>Status Real-time</span>
                              <span>Baru</span>
                            </div>
                            <p className="text-slate-800 font-medium text-[11px]">
                              Pantau pergerakan berkas usulan dan laporan Monev triwulanan secara transparansi.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="hidden md:flex flex-col text-right max-w-[150px] lg:max-w-[200px] shrink-0">
                  <span className="text-xs font-black text-slate-900 leading-tight truncate" title={user.name}>
                    {user.name.replace(/\(.*\)/, '').trim()}
                  </span>
                  <span className="text-[10px] text-amber-800 font-bold truncate" title={user.role === 'TKKSD_ADMIN' ? 'Verifikator TKKSD' : user.institutionName}>
                    {user.role === 'TKKSD_ADMIN' ? 'Verifikator TKKSD' : user.institutionName}
                  </span>
                </div>
                <button
                  onClick={onLogout}
                  title="Keluar Akun"
                  className="flex items-center space-x-1 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition cursor-pointer shrink-0"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Keluar</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 bg-amber-50 border border-amber-300 px-3.5 py-1.5 rounded-full text-xs text-amber-800 font-semibold backdrop-blur-md">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>Portal Resmi TKKSD</span>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
