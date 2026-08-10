import React from 'react';
import { 
  Home, 
  Building2, 
  FilePlus, 
  Activity, 
  BookOpen, 
  CheckSquare 
} from 'lucide-react';
import { UserSession } from './LoginPage';

interface MobileBottomNavProps {
  activeTab: 'overview' | 'registration' | 'proposal' | 'tracking' | 'regulations' | 'setda_admin';
  setActiveTab: (tab: 'overview' | 'registration' | 'proposal' | 'tracking' | 'regulations' | 'setda_admin') => void;
  user: UserSession | null;
  pendingApprovalCount?: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ 
  activeTab, 
  setActiveTab, 
  user,
  pendingApprovalCount = 0
}) => {
  const baseNavItems = [
    { id: 'overview' as const, label: 'Beranda', icon: Home },
    { id: 'registration' as const, label: 'Daftar', icon: Building2 },
    { id: 'proposal' as const, label: 'Proposal', icon: FilePlus },
    { id: 'tracking' as const, label: 'Tracking', icon: Activity },
    { id: 'regulations' as const, label: 'Regulasi', icon: BookOpen }
  ];

  const navItems = user?.role === 'TKKSD_ADMIN' 
    ? [
        { id: 'setda_admin' as const, label: 'ACC Setda', icon: CheckSquare },
        ...baseNavItems.filter(i => i.id !== 'registration' && i.id !== 'proposal')
      ]
    : baseNavItems;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-slate-200 shadow-2xl px-2 py-1.5 flex items-center justify-around">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        const isApprovalTab = item.id === 'setda_admin';

        return (
          <button
            key={item.id}
            onClick={() => {
              setActiveTab(item.id);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all duration-300 transform active:scale-90 cursor-pointer relative ${
              isActive ? 'text-amber-600 font-extrabold scale-105' : 'text-slate-500 hover:text-slate-900 font-medium'
            }`}
          >
            <div className={`p-1 rounded-xl transition-all duration-300 relative ${isActive ? 'bg-amber-100/90 text-amber-700 shadow-xs' : ''}`}>
              <Icon className="w-5 h-5" />
              {isApprovalTab && pendingApprovalCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-pulse border border-white shadow-xs">
                  {pendingApprovalCount}
                </span>
              )}
            </div>
            <span className="text-[10px] tracking-tight mt-0.5">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};
