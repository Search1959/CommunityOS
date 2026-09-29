import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  IndianRupee, 
  Calendar, 
  LayoutGrid,
  HeartHandshake,
  Bot
} from 'lucide-react';

interface MobileBottomNavProps {
  activeModule: string;
  onSelectModule: (moduleKey: string) => void;
  onOpenMenuCards: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeModule,
  onSelectModule,
  onOpenMenuCards,
}) => {
  const navItems = [
    {
      key: 'dashboard',
      label: 'Home',
      icon: LayoutDashboard,
      onClick: () => {
        onSelectModule('dashboard');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      isActive: activeModule === 'dashboard',
    },
    {
      key: 'membership',
      label: 'Members',
      icon: Users,
      onClick: () => {
        onSelectModule('membership');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      isActive: activeModule === 'membership',
    },
    {
      key: 'donations',
      label: 'Donations',
      icon: IndianRupee,
      onClick: () => {
        onSelectModule('donations');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      isActive: activeModule === 'donations' || activeModule === 'finance',
    },
    {
      key: 'events',
      label: 'Events',
      icon: Calendar,
      onClick: () => {
        onSelectModule('events');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      isActive: activeModule === 'events',
    },
    {
      key: 'menu-cards',
      label: 'Menu Cards',
      icon: LayoutGrid,
      onClick: onOpenMenuCards,
      isSpecial: true,
      isActive: false,
    },
  ];

  return (
    <nav 
      aria-label="Mobile Bottom Navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 flex items-center justify-around shadow-lg select-none"
    >
      {navItems.map((item) => {
        const Icon = item.icon;

        if (item.isSpecial) {
          return (
            <button
              key={item.key}
              id="btn-mobile-nav-all-cards"
              type="button"
              onClick={item.onClick}
              className="relative flex flex-col items-center justify-center p-1 px-2.5 rounded-2xl active:scale-95 transition-all text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-rose-500 text-white flex items-center justify-center shadow-md shadow-indigo-600/25 group-hover:scale-105 transition-transform">
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 tracking-tight mt-0.5">
                {item.label}
              </span>
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse" />
            </button>
          );
        }

        return (
          <button
            key={item.key}
            id={`btn-mobile-nav-${item.key}`}
            type="button"
            onClick={item.onClick}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all active:scale-95 cursor-pointer ${
              item.isActive
                ? 'text-indigo-600 dark:text-indigo-400 font-extrabold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium'
            }`}
          >
            <div className="relative">
              <Icon className={`w-5 h-5 ${item.isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
              {item.isActive && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />
              )}
            </div>
            <span className="text-[10px] tracking-tight mt-1">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
