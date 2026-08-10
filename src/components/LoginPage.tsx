import React, { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Sparkles, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  UserCheck, 
  KeyRound, 
  HelpCircle,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export interface UserSession {
  email: string;
  name: string;
  role: 'MITRA' | 'TKKSD_ADMIN';
  institutionName?: string;
  picType?: string;
}

interface LoginPageProps {
  onLoginSuccess: (session: UserSession) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  // Set ke true untuk development/testing lokal, set ke false jika siap dipublikasikan (production)
  const SHOW_QUICK_DEMO = false;

  const [loginRole, setLoginRole] = useState<'MITRA' | 'TKKSD_ADMIN'>('MITRA');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Helper untuk membuat nama dinamis dari email
  const generateNameFromEmail = (emailStr: string): string => {
    if (!emailStr || !emailStr.includes('@')) return 'Pengguna MEMITRAN';
    const namePart = emailStr.split('@')[0];
    return namePart
      .split(/[._-]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Email / NIP Pengguna wajib diisi.');
      return;
    }
    if (!password.trim()) {
      setError('Kata sandi wajib diisi.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const dynamicName = generateNameFromEmail(email);
      onLoginSuccess({
        email,
        name: dynamicName,
        role: loginRole,
        institutionName: loginRole === 'TKKSD_ADMIN' ? 'Setda Kab. Gunungkidul' : 'PT Kerjasama Teknologi Nusantara',
        picType: loginRole === 'MITRA' ? 'PIC Utama (Penanggung Jawab)' : undefined
      });
    }, 600);
  };

  // Quick Demo Login Handler
  const handleQuickLogin = (role: 'MITRA' | 'TKKSD_ADMIN', demoEmail: string) => {
    setLoginRole(role);
    setEmail(demoEmail);
    setPassword('demopassword123');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const dynamicName = generateNameFromEmail(demoEmail);
      onLoginSuccess({
        email: demoEmail,
        name: dynamicName,
        role,
        institutionName: role === 'TKKSD_ADMIN' ? 'Setda Kab. Gunungkidul' : 'PT Kerjasama Teknologi Nusantara',
        picType: role === 'MITRA' ? 'PIC Utama' : undefined
      });
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-amber-50/60 via-slate-100 to-sky-50/60">
      
      {/* Background Ambient Glows - Light Mode */}
      <div className="ambient-glow-amber top-[10%] left-[10%]" />
      <div className="ambient-glow-blue bottom-[10%] right-[10%]" />

      <div className="max-w-md w-full glass-panel rounded-3xl p-8 space-y-6 relative z-10 shadow-2xl border border-amber-500/30">
        
        {/* Official Regional Logo & Brand Header */}
        <div className="text-center space-y-3">
          <div className="w-20 h-24 mx-auto filter drop-shadow-xl hover:scale-105 transition transform">
            <img 
              src="/logo-gunungkidul.svg" 
              alt="Lambang Kabupaten Gunungkidul" 
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <div className="inline-flex items-center space-x-1.5 glass-badge px-3.5 py-0.5 rounded-full text-[11px] font-bold mb-1 border-amber-400 text-amber-800 bg-amber-50">
              <span>PEMERINTAH KABUPATEN GUNUNGKIDUL</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Portal MEMITRAN</h1>
            <p className="text-xs text-amber-900 font-medium">Sistem Pengajuan & Verifikasi Kerja Sama Daerah (TKKSD)</p>
          </div>
        </div>

        {/* Role Selector Tabs */}
        <div className="flex bg-slate-200/80 p-1 rounded-2xl border border-slate-300 backdrop-blur-md">
          <button
            type="button"
            onClick={() => {
              setLoginRole('MITRA');
              setError('');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
              loginRole === 'MITRA'
                ? 'glass-button-primary text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Mitra Lembaga</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setLoginRole('TKKSD_ADMIN');
              setError('');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
              loginRole === 'TKKSD_ADMIN'
                ? 'glass-button-primary text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Aparatur TKKSD</span>
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {error && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs text-rose-700 flex items-center space-x-2 animate-fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {loginRole === 'MITRA' ? 'Email Official Lembaga / PIC' : 'NIP / Email Dinas Verifikator'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                placeholder={loginRole === 'MITRA' ? 'pic.kerjasama@lembaga.co.id' : 'supriyadi@gunungkidulkab.go.id'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full glass-input rounded-xl pl-10 pr-3 py-2.5 text-xs text-slate-900 placeholder-slate-400 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Kata Sandi (Password)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full glass-input rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-900 placeholder-slate-400 font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-700"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-700 pt-1 font-medium">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-300 text-amber-600 focus:ring-amber-500/20"
              />
              <span>Ingat Saya</span>
            </label>

            <a href="#" onClick={(e) => { e.preventDefault(); alert('Hubungi Sekretariat TKKSD Kabupaten Gunungkidul untuk reset kata sandi.'); }} className="text-amber-700 font-semibold hover:underline">
              Lupa Password?
            </a>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 glass-button-primary text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/25 transition transform active:scale-95 cursor-pointer"
          >
            {isLoading ? (
              <span>Memproses Autentikasi...</span>
            ) : (
              <>
                <span>Masuk Portal MEMITRAN</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Divider Atau Masuk Dengan */}
        <div className="relative flex items-center justify-center my-4">
          <div className="border-t border-slate-300 w-full" />
          <span className="bg-white px-3 text-[10px] uppercase tracking-wider font-extrabold text-slate-600 shrink-0">
            Atau Masuk Menggunakan
          </span>
          <div className="border-t border-slate-300 w-full" />
        </div>

        {/* Social SSO Login Options (Google, Microsoft, SSO Pemkab) */}
        <div className="space-y-2">
          <button
            type="button"
            disabled={isLoading}
            onClick={() => {
              setIsLoading(true);
              const loginEmail = email.trim() || (loginRole === 'TKKSD_ADMIN' ? 'supriyadi.google@gunungkidulkab.go.id' : 'mitra.google@gmail.com');
              const dynamicName = `${generateNameFromEmail(loginEmail)} (Google SSO)`;
              setTimeout(() => {
                setIsLoading(false);
                onLoginSuccess({
                  email: loginEmail,
                  name: dynamicName,
                  role: loginRole,
                  institutionName: loginRole === 'TKKSD_ADMIN' ? 'TKKSD Kab. Gunungkidul' : 'PT Mitra Terpadu Indonesia',
                  picType: loginRole === 'MITRA' ? 'PIC Utama (Google SSO)' : undefined
                });
              }, 700);
            }}
            className="w-full py-2.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-xl font-bold text-xs flex items-center justify-center transition shadow-xs cursor-pointer"
          >
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Masuk dengan akun Google</span>
          </button>

          <button
            type="button"
            disabled={isLoading}
            onClick={() => {
              setIsLoading(true);
              const loginEmail = email.trim() || (loginRole === 'TKKSD_ADMIN' ? 'supriyadi@gunungkidulkab.go.id' : 'mitra.office365@lembaga.co.id');
              const dynamicName = `${generateNameFromEmail(loginEmail)} (Office 365)`;
              setTimeout(() => {
                setIsLoading(false);
                onLoginSuccess({
                  email: loginEmail,
                  name: dynamicName,
                  role: loginRole,
                  institutionName: loginRole === 'TKKSD_ADMIN' ? 'TKKSD Kab. Gunungkidul' : 'PT Mitra Terpadu Indonesia',
                  picType: loginRole === 'MITRA' ? 'PIC Utama' : undefined
                });
              }, 700);
            }}
            className="w-full py-2.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-xl font-bold text-xs flex items-center justify-center transition shadow-xs cursor-pointer"
          >
            <svg className="w-4 h-4 mr-2" viewBox="0 0 23 23">
              <path fill="#f35325" d="M1 1h10v10H1z"/>
              <path fill="#81bc06" d="M12 1h10v10H12z"/>
              <path fill="#05a6f0" d="M1 12h10v10H1z"/>
              <path fill="#ffba08" d="M12 12h10v10H12z"/>
            </svg>
            <span>Masuk dengan SSO Pemkab / Microsoft</span>
          </button>

          <button
            type="button"
            disabled={isLoading}
            onClick={() => {
              setIsLoading(true);
              const loginEmail = email.trim() || (loginRole === 'TKKSD_ADMIN' ? 'supriyadi.apple@gunungkidulkab.go.id' : 'mitra.apple@privaterelay.appleid.com');
              const dynamicName = `${generateNameFromEmail(loginEmail)} (Apple ID)`;
              setTimeout(() => {
                setIsLoading(false);
                onLoginSuccess({
                  email: loginEmail,
                  name: dynamicName,
                  role: loginRole,
                  institutionName: loginRole === 'TKKSD_ADMIN' ? 'TKKSD Kab. Gunungkidul' : 'PT Mitra Terpadu Indonesia',
                  picType: loginRole === 'MITRA' ? 'PIC Utama (Apple SSO)' : undefined
                });
              }, 700);
            }}
            className="w-full py-2.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-xl font-bold text-xs flex items-center justify-center transition shadow-xs cursor-pointer"
          >
            <svg className="w-4 h-4 mr-2 fill-slate-900" viewBox="0 0 170 170">
              <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.34.13-9.14-1.9-14.4-6.1-3.26-2.64-7.14-7.25-11.64-13.84-6.19-9.13-11.05-19.57-14.57-31.34-3.52-11.76-5.28-23.01-5.28-33.74 0-15.09 3.65-27.46 10.95-37.1 7.3-9.64 16.51-14.54 27.63-14.7 5.09.12 10.45 1.41 16.08 3.87 5.63 2.46 9.42 3.73 11.37 3.82 2.29 0 6.32-1.34 12.09-4.02 5.77-2.68 11.1-4.04 15.98-4.08 8.01.12 15.28 2.37 21.82 6.75 6.54 4.38 11.2 10.23 13.98 17.55-12.59 7.61-18.76 17.84-18.52 30.7.24 10.2 4.13 18.66 11.67 25.37 7.54 6.71 16.36 10.51 26.46 11.4-2.18 6.53-4.99 13.23-8.43 20.1zM119.22 31.62c0-7.39 2.65-14.35 7.95-20.88C132.47 4.21 139.69.75 148.83 0c.24.97.36 1.94.36 2.91 0 7.33-2.73 14.35-8.19 21.06-5.46 6.71-12.63 10.36-21.5 10.95-.08-1.09-.28-2.2-.28-3.3z"/>
            </svg>
            <span>Masuk dengan Apple ID</span>
          </button>
        </div>

        {/* Demo Quick-Login Presets */}
        {SHOW_QUICK_DEMO && (
          <div className="pt-4 border-t border-slate-200 space-y-2">
            <p className="text-[10px] uppercase tracking-wider font-extrabold text-amber-800 text-center">
              Akses Uji Coba Cepat (Quick Demo)
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('MITRA', 'budi.santoso@kerjasamaterdepan.co.id')}
                className="px-3 py-2.5 glass-card hover:bg-amber-50 text-[11px] text-amber-900 font-bold rounded-xl flex items-center space-x-1.5 border border-amber-300 transition cursor-pointer"
              >
                <Building2 className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                <span>Login Mitra DUDI</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('TKKSD_ADMIN', 'supriyadi@gunungkidulkab.go.id')}
                className="px-3 py-2.5 glass-card hover:bg-emerald-50 text-[11px] text-emerald-900 font-bold rounded-xl flex items-center space-x-1.5 border border-emerald-300 transition cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span>Login Tim TKKSD</span>
              </button>
            </div>
          </div>
        )}

        {/* Footnote */}
        <p className="text-[10px] text-slate-500 text-center font-medium">
          Tim Kerja Sama Daerah (TKKSD) Kabupaten Gunungkidul
        </p>

      </div>
    </div>
  );
};
