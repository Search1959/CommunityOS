import React, { useState } from 'react';
import { 
  Building2, 
  UserCheck, 
  Search, 
  Moon, 
  Sun, 
  Bot, 
  QrCode, 
  Globe, 
  ShieldAlert, 
  Sparkles,
  ChevronDown,
  PhoneCall,
  Download
} from 'lucide-react';
import { Organization, UserRole } from '../types';

interface NavbarProps {
  organizations: Organization[];
  activeOrg: Organization;
  onSelectOrg: (org: Organization) => void;
  currentRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenAIChat: () => void;
  onOpenQRScanner: () => void;
  onNavigateModule: (moduleKey: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  organizations,
  activeOrg,
  onSelectOrg,
  currentRole,
  onChangeRole,
  isDarkMode,
  onToggleDarkMode,
  onOpenAIChat,
  onOpenQRScanner,
  onNavigateModule,
  searchQuery,
  onSearchChange,
}) => {
  const [showOrgDropdown, setShowOrgDropdown] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  const rolesList: UserRole[] = [
    'Super Admin',
    'Committee Admin',
    'President',
    'Secretary',
    'Treasurer',
    'Executive Member',
    'Volunteer',
    'School Admin',
    'Teacher',
    'Parent',
    'Student',
    'Member',
    'Public Citizen'
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand & Multi-Tenant Selector */}
        <div className="flex items-center gap-3">
          <div 
            onClick={() => onNavigateModule('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold shadow-sm shadow-indigo-600/30 group-hover:scale-105 transition-transform">
              <span className="text-sm font-black">D</span>
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight text-slate-900 dark:text-white">
                  CommunityOS
                </span>
                <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold rounded-full border border-emerald-200 dark:border-emerald-800">
                  LIVE DATA
                </span>
              </div>
            </div>
          </div>

          <div className="h-5 w-px bg-slate-200 dark:bg-slate-800 mx-1 hidden md:block" />

          {/* Tenant Switcher */}
          <div className="relative">
            <button
              id="btn-tenant-switcher"
              onClick={() => setShowOrgDropdown(!showOrgDropdown)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-all"
            >
              <Building2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span className="max-w-[140px] sm:max-w-[180px] truncate">{activeOrg.name}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showOrgDropdown && (
              <div className="absolute left-0 mt-2 w-72 sm:w-80 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-2 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Select Organization (Multi-Tenant)
                </div>
                <div className="space-y-1 max-h-64 overflow-y-auto">
                  {organizations.map((org) => (
                    <button
                      key={org.id}
                      onClick={() => {
                        onSelectOrg(org);
                        setShowOrgDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                        activeOrg.id === org.id
                          ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-semibold'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <div className="truncate">
                        <p className="font-medium truncate">{org.name}</p>
                        <p className="text-[10px] text-slate-400 truncate">{org.websiteDomain}</p>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 whitespace-nowrap ml-2">
                        {org.type}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Global AI Search Input */}
        <div className="hidden lg:flex items-center flex-1 max-w-xs relative">
          <Search className="w-4 h-4 absolute left-3 text-slate-400" />
          <input
            id="input-global-ai-search"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="AI Search anything..."
            className="w-full pl-9 pr-4 py-1.5 rounded-full text-xs bg-slate-100 dark:bg-slate-800 border border-transparent focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-200 placeholder-slate-400 outline-none transition-all"
          />
        </div>

        {/* Action Controls & Role Switcher */}
        <div className="flex items-center gap-2">
          
          {/* Public Citizen Portal Shortcut */}
          <button
            id="btn-nav-citizen-portal"
            onClick={() => onNavigateModule('citizen-portal')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Citizen Portal</span>
          </button>

          {/* AI Grounded Assistant Button */}
          <button
            id="btn-nav-ai-chat"
            onClick={onOpenAIChat}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            <span className="hidden sm:inline">AI Assistant</span>
            <span className="sm:hidden">AI</span>
          </button>

          {/* QR Scanner Trigger */}
          <button
            id="btn-nav-qr-scanner"
            onClick={onOpenQRScanner}
            title="Scan Member or Event Attendance QR"
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <QrCode className="w-4 h-4" />
          </button>

          {/* Role Switcher & User Profile */}
          <div className="relative flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
            <button
              id="btn-role-switcher"
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-300 text-xs font-semibold"
            >
              <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden md:inline">{currentRole}</span>
              <ChevronDown className="w-3 h-3 text-indigo-500" />
            </button>

            <div className="hidden xl:flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center font-bold text-xs text-indigo-700 dark:text-indigo-300">
                AK
              </div>
            </div>

            {showRoleDropdown && (
              <div className="absolute right-0 top-10 mt-2 w-48 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-1.5 z-50">
                <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Switch Role Preview
                </div>
                <div className="space-y-0.5 max-h-56 overflow-y-auto">
                  {rolesList.map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        onChangeRole(r);
                        setShowRoleDropdown(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs font-medium ${
                        currentRole === r
                          ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-900 dark:text-indigo-200 font-bold'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Dark Mode Toggle */}
          <button
            id="btn-toggle-dark-mode"
            onClick={onToggleDarkMode}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Toggle Light / Dark Mode"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

        </div>
      </div>
    </header>
  );
};
