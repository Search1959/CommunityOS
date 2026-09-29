import React, { useState, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  Award, 
  HeartHandshake, 
  IndianRupee, 
  Receipt, 
  Calendar, 
  GraduationCap, 
  FileText, 
  Globe, 
  Network, 
  Droplet, 
  Stethoscope, 
  Briefcase, 
  Landmark, 
  MessageSquareShare, 
  BarChart3, 
  ShieldCheck, 
  Sparkles,
  LayoutGrid, 
  List, 
  Search, 
  X, 
  ChevronRight,
  CheckCircle2,
  SlidersHorizontal,
  Flame
} from 'lucide-react';
import { Organization } from '../types';

export interface MobileMenuItem {
  key: string;
  label: string;
  shortLabel?: string;
  description: string;
  category: 'operations' | 'welfare' | 'ai' | 'governance';
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
  badge?: string;
  badgeColor?: string;
  highlight?: boolean;
}

interface MobileMenuCardsProps {
  isOpen: boolean;
  onClose: () => void;
  activeModule: string;
  onSelectModule: (key: string) => void;
  activeOrg: Organization;
}

export const MobileMenuCards: React.FC<MobileMenuCardsProps> = ({
  isOpen,
  onClose,
  activeModule,
  onSelectModule,
  activeOrg,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'operations' | 'welfare' | 'ai' | 'governance'>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'list'>('cards');

  const menuItems: MobileMenuItem[] = useMemo(() => [
    // Operations
    {
      key: 'dashboard',
      label: 'Analytics Dashboard',
      shortLabel: 'Dashboard',
      description: 'Real-time KPIs, footfall, donations & trend charts',
      category: 'operations',
      icon: LayoutDashboard,
      iconBg: 'bg-indigo-100 dark:bg-indigo-950/80',
      iconColor: 'text-indigo-600 dark:text-indigo-400',
    },
    {
      key: 'membership',
      label: 'Membership Directory',
      shortLabel: 'Members',
      description: 'Search members, blood groups, KYC status & smart ID cards',
      category: 'operations',
      icon: Users,
      iconBg: 'bg-blue-100 dark:bg-blue-950/80',
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      key: 'donations',
      label: 'Donations & 80G Receipts',
      shortLabel: 'Donations 80G',
      description: 'Instant tax-exempt receipts, 80G ledger & cash/UPI logs',
      category: 'operations',
      icon: IndianRupee,
      iconBg: 'bg-emerald-100 dark:bg-emerald-950/80',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      badge: '80G Tax',
      badgeColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
    },
    {
      key: 'finance',
      label: 'Expenses & Financial Dashboard',
      shortLabel: 'Expenses & Finance',
      description: 'Expenses tracker, cash flow charts, vendor vouchers & CAG balance sheet',
      category: 'operations',
      icon: Receipt,
      iconBg: 'bg-teal-100 dark:bg-teal-950/80',
      iconColor: 'text-teal-600 dark:text-teal-400',
      badge: 'Audit Ready',
      badgeColor: 'bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300 border-teal-300 dark:border-teal-800',
    },
    {
      key: 'events',
      label: 'Events & Puja Pandal',
      shortLabel: 'Events & Puja',
      description: 'Pandal crowd tracking, gate passes, duties & certificates',
      category: 'operations',
      icon: Calendar,
      iconBg: 'bg-rose-100 dark:bg-rose-950/80',
      iconColor: 'text-rose-600 dark:text-rose-400',
      badge: 'Festivals',
      badgeColor: 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border-rose-300 dark:border-rose-800',
    },
    {
      key: 'committee',
      label: 'Committee & Meetings',
      shortLabel: 'Meetings',
      description: 'Executive committee, AGM/EGM resolutions & digital minutes',
      category: 'operations',
      icon: Award,
      iconBg: 'bg-amber-100 dark:bg-amber-950/80',
      iconColor: 'text-amber-600 dark:text-amber-400',
    },
    {
      key: 'org-profile',
      label: 'Organization Profile',
      shortLabel: 'Org Profile',
      description: 'Registration deed, 12A/80G certificates & office bearers',
      category: 'operations',
      icon: Building2,
      iconBg: 'bg-sky-100 dark:bg-sky-950/80',
      iconColor: 'text-sky-600 dark:text-sky-400',
    },

    // Welfare & Health
    {
      key: 'welfare',
      label: 'Welfare Schemes',
      shortLabel: 'Welfare Aid',
      description: 'Medical relief, education aid, widow pensions & disbursals',
      category: 'welfare',
      icon: HeartHandshake,
      iconBg: 'bg-pink-100 dark:bg-pink-950/80',
      iconColor: 'text-pink-600 dark:text-pink-400',
      badge: 'Assistance',
      badgeColor: 'bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300 border-pink-300 dark:border-pink-800',
    },
    {
      key: 'blood-bank',
      label: 'Emergency Blood Bank',
      shortLabel: 'Blood SOS',
      description: 'Live donor registry, blood group search & instant SOS requests',
      category: 'welfare',
      icon: Droplet,
      iconBg: 'bg-red-100 dark:bg-red-950/80',
      iconColor: 'text-red-600 dark:text-red-400',
      badge: 'SOS 24/7',
      badgeColor: 'bg-red-500 text-white border-red-600 animate-pulse',
    },
    {
      key: 'medical-camp',
      label: 'Medical Camp Portal',
      shortLabel: 'Health Camps',
      description: 'Free eye checkups, cataract triage, doctor queue & Rx logs',
      category: 'welfare',
      icon: Stethoscope,
      iconBg: 'bg-cyan-100 dark:bg-cyan-950/80',
      iconColor: 'text-cyan-600 dark:text-cyan-400',
    },
    {
      key: 'citizen-portal',
      label: 'Citizen Services Portal',
      shortLabel: 'Citizen Portal',
      description: 'Community hall bookings, grievance redressal & public notice board',
      category: 'welfare',
      icon: Globe,
      iconBg: 'bg-emerald-100 dark:bg-emerald-950/80',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      badge: 'Public',
      badgeColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
    },
    {
      key: 'family-tree',
      label: 'Community Family Tree',
      shortLabel: 'Family Tree',
      description: 'Multi-generation family lineage, elders & relationship graph',
      category: 'welfare',
      icon: Network,
      iconBg: 'bg-orange-100 dark:bg-orange-950/80',
      iconColor: 'text-orange-600 dark:text-orange-400',
    },
    {
      key: 'businesses',
      label: 'Business & Jobs Portal',
      shortLabel: 'Jobs & Biz',
      description: 'Member businesses, service directory & community jobs portal',
      category: 'welfare',
      icon: Briefcase,
      iconBg: 'bg-amber-100 dark:bg-amber-950/80',
      iconColor: 'text-amber-700 dark:text-amber-400',
    },

    // AI & Smart Tools
    {
      key: 'vault',
      label: 'AI Document Intelligence',
      shortLabel: 'AI Vault',
      description: 'AI OCR scanner for trust deeds, balance sheets & receipts',
      category: 'ai',
      icon: FileText,
      iconBg: 'bg-emerald-100 dark:bg-emerald-950/80',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      badge: 'AI OCR',
      badgeColor: 'bg-emerald-600 text-white border-emerald-500',
    },
    {
      key: 'notifications',
      label: 'WhatsApp & Alert Centre',
      shortLabel: 'WhatsApp Alerts',
      description: 'Official WhatsApp broadcasts, payment alerts & meeting reminders',
      category: 'ai',
      icon: MessageSquareShare,
      iconBg: 'bg-green-100 dark:bg-green-950/80',
      iconColor: 'text-green-600 dark:text-green-400',
      badge: 'WhatsApp',
      badgeColor: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300 border-green-300 dark:border-green-800',
    },

    // Governance & Compliance
    {
      key: 'school',
      label: 'School Management',
      shortLabel: 'School Portal',
      description: 'Admissions, student roll numbers, attendance & fee registers',
      category: 'governance',
      icon: GraduationCap,
      iconBg: 'bg-violet-100 dark:bg-violet-950/80',
      iconColor: 'text-violet-600 dark:text-violet-400',
      highlight: activeOrg.type.includes('School'),
    },
    {
      key: 'govt-schemes',
      label: 'Citizen Service Centre (CSC)',
      shortLabel: 'CSC Schemes',
      description: 'Aadhaar, Ration, Ayushman Bharat, widow pensions & services',
      category: 'governance',
      icon: Landmark,
      iconBg: 'bg-blue-100 dark:bg-blue-950/80',
      iconColor: 'text-blue-600 dark:text-blue-400',
      badge: 'Govt Portal',
      badgeColor: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border-blue-300 dark:border-blue-800',
    },
    {
      key: 'reports',
      label: 'Export Reports & Audits',
      shortLabel: 'CA Reports',
      description: 'Official CA audit packages, registers, PDF exports & backups',
      category: 'governance',
      icon: BarChart3,
      iconBg: 'bg-slate-200 dark:bg-slate-800',
      iconColor: 'text-slate-700 dark:text-slate-300',
    },
    {
      key: 'super-admin',
      label: 'Super Admin SaaS Panel',
      shortLabel: 'Super Admin',
      description: 'Multi-tenant management, organization onboarding & settings',
      category: 'governance',
      icon: ShieldCheck,
      iconBg: 'bg-purple-100 dark:bg-purple-950/80',
      iconColor: 'text-purple-600 dark:text-purple-400',
      badge: 'System Admin',
      badgeColor: 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border-purple-300 dark:border-purple-800',
    },
  ], [activeOrg.type]);

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesSearch = 
        item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.shortLabel && item.shortLabel.toLowerCase().includes(searchQuery.toLowerCase())) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.badge && item.badge.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = 
        selectedCategory === 'all' || item.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [menuItems, searchQuery, selectedCategory]);

  const handleCardClick = (key: string) => {
    onSelectModule(key);
    onClose();
    // Scroll window to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end animate-in fade-in duration-200">
      
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm transition-opacity"
      />

      {/* Main Drawer Container */}
      <div className="relative z-10 w-full max-h-[92vh] flex flex-col bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 rounded-t-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300">
        
        {/* Drag Handle Bar */}
        <div className="pt-3 pb-1 flex justify-center">
          <div className="w-12 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
        </div>

        {/* Header with Title, Active Org & Close button */}
        <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black shadow-md shadow-indigo-600/30 shrink-0">
              <LayoutGrid className="w-5 h-5" />
            </div>
            <div className="truncate">
              <div className="flex items-center gap-1.5">
                <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  Menu Cards
                </h2>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  {menuItems.length} Tools
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                {activeOrg.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-200 dark:bg-slate-800 rounded-lg p-0.5">
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                className={`p-1.5 rounded-md transition-all ${
                  viewMode === 'cards' 
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
                }`}
                title="Cards Grid"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md transition-all ${
                  viewMode === 'list' 
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
                }`}
                title="Compact List"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              title="Close Menu Cards"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Real-time Search Box */}
        <div className="p-3 pb-2 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xs border-b border-slate-100 dark:border-slate-800/80">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 20 modules (e.g. donations, blood, members, 80g, puja)..."
              className="w-full pl-9 pr-9 py-2.5 text-xs bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Tabs (Swipeable pills) */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-2 no-scrollbar">
            {[
              { key: 'all', label: '🌟 All Cards' },
              { key: 'operations', label: '💼 Operations' },
              { key: 'welfare', label: '❤️ Welfare & Health' },
              { key: 'ai', label: '⚡ AI & Alerts' },
              { key: 'governance', label: '📜 Governance' },
            ].map((tab) => {
              const isSelected = selectedCategory === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setSelectedCategory(tab.key as any)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Modules Content Area */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 overscroll-contain">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center">
              <Search className="w-8 h-8 mx-auto text-slate-400 mb-2" />
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">No matching module found</p>
              <p className="text-[11px] text-slate-500 mt-1">Try searching for "members", "donations", "blood", or "events"</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                className="mt-3 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs font-bold"
              >
                Reset Search
              </button>
            </div>
          ) : viewMode === 'cards' ? (
            /* Cards Grid Layout (2-columns on mobile, touch-friendly) */
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
              {filteredItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeModule === item.key;

                return (
                  <button
                    key={item.key}
                    id={`mobile-card-${item.key}`}
                    onClick={() => handleCardClick(item.key)}
                    className={`relative p-3 rounded-2xl text-left flex flex-col justify-between transition-all duration-150 active:scale-95 cursor-pointer border ${
                      isActive
                        ? 'bg-indigo-50/90 dark:bg-indigo-950/50 border-indigo-500 shadow-sm ring-2 ring-indigo-500/20'
                        : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs'
                    }`}
                  >
                    {/* Top Row: Icon + Badge */}
                    <div className="flex items-start justify-between gap-1.5 mb-2.5">
                      <div className={`p-2 rounded-xl ${item.iconBg} ${item.iconColor} shadow-xs`}>
                        <Icon className="w-5 h-5" />
                      </div>

                      {isActive ? (
                        <span className="flex items-center gap-1 text-[9px] font-black px-2 py-0.5 rounded-full bg-indigo-600 text-white uppercase tracking-wider shadow-xs">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          <span>Active</span>
                        </span>
                      ) : item.badge ? (
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md border uppercase tracking-wider ${item.badgeColor || 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'}`}>
                          {item.badge}
                        </span>
                      ) : null}
                    </div>

                    {/* Middle: Title & Friendly Description */}
                    <div>
                      <h3 className={`text-xs font-extrabold leading-tight ${
                        isActive ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-900 dark:text-white'
                      }`}>
                        {item.label}
                      </h3>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {/* Bottom Status bar */}
                    <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px]">
                      <span className="text-slate-400 font-medium capitalize">
                        {item.category === 'operations' ? 'Core' : item.category === 'welfare' ? 'Social' : item.category === 'ai' ? 'Smart' : 'Admin'}
                      </span>
                      <ChevronRight className={`w-3 h-3 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            /* Compact List Layout */
            <div className="space-y-1.5">
              {filteredItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeModule === item.key;

                return (
                  <button
                    key={item.key}
                    id={`mobile-list-${item.key}`}
                    onClick={() => handleCardClick(item.key)}
                    className={`w-full p-2.5 rounded-xl text-left flex items-center justify-between transition-all active:scale-98 cursor-pointer border ${
                      isActive
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 font-semibold'
                        : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`p-2 rounded-lg ${item.iconBg} ${item.iconColor} shrink-0`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <div className="flex items-center gap-2">
                          <h3 className={`text-xs font-bold truncate ${
                            isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-900 dark:text-white'
                          }`}>
                            {item.label}
                          </h3>
                          {isActive && (
                            <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-indigo-600 text-white uppercase">
                              Active
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                      {item.badge && !isActive && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                          {item.badge}
                        </span>
                      )}
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer info & quick buttons */}
        <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>CommunityOS Mobile Suite</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-extrabold text-xs shadow-sm cursor-pointer transition-all"
          >
            Close Menu
          </button>
        </div>

      </div>
    </div>
  );
};
