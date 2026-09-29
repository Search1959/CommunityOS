import React from 'react';
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
  Bot, 
  Globe, 
  Network, 
  Droplet, 
  Stethoscope, 
  Briefcase, 
  Landmark, 
  MessageSquareShare, 
  BarChart3, 
  ShieldCheck, 
  Menu, 
  X 
} from 'lucide-react';
import { Organization } from '../types';
import { MobileMenuCards } from './MobileMenuCards';

interface SidebarProps {
  activeModule: string;
  onSelectModule: (key: string) => void;
  isOpenMobile: boolean;
  onToggleMobile: () => void;
  activeOrgType: string;
  activeOrg?: Organization;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeModule,
  onSelectModule,
  isOpenMobile,
  onToggleMobile,
  activeOrgType,
  activeOrg,
}) => {
  const defaultOrg: Organization = activeOrg || {
    id: 'org-1',
    name: 'Ekdalia Evergreen Durga Puja & Welfare Committee',
    slug: 'ekdalia-evergreen',
    type: 'Puja & Festival Committee',
    registrationNo: 'S/12890/2005',
    panNo: 'AAATE4521P',
    darpanId: 'WB/2021/0289451',
    taxExemption80G: 'CIT(E)/KOL/80G/2021-22/A/104',
    taxExemption12A: 'CIT(E)/KOL/12A/2021-22/A/89',
    establishedYear: 1943,
    address: '15, Ekdalia Road, Gariahat, Kolkata - 700019',
    phone: '+91 33 2460 1943',
    email: 'contact@ekdaliaevergreen.org',
    membersCount: 420,
    totalDonationsYTD: 2850000,
    welfareFundsDisbursed: 1420000,
  };
  const menuItems = [
    { key: 'dashboard', label: 'Analytics Dashboard', icon: LayoutDashboard },
    { key: 'org-profile', label: 'Organization Profile', icon: Building2 },
    { key: 'membership', label: 'Membership Directory', icon: Users },
    { key: 'committee', label: 'Committee & Meetings', icon: Award },
    { key: 'welfare', label: 'Welfare Schemes', icon: HeartHandshake },
    { key: 'donations', label: 'Donations & 80G Receipts', icon: IndianRupee },
    { key: 'finance', label: 'Expenses & Financial Dashboard', icon: Receipt },
    { key: 'events', label: 'Events & Puja Pandal', icon: Calendar },
    { key: 'school', label: 'School Management', icon: GraduationCap, highlight: activeOrgType.includes('School') },
    { key: 'vault', label: 'AI Document Intelligence', icon: FileText, badge: 'AI' },
    { key: 'ai-chat', label: 'AI RAG Chat Assistant', icon: Bot, badge: 'AI' },
    { key: 'citizen-portal', label: 'Citizen Services Portal', icon: Globe, badge: 'Public' },
    { key: 'family-tree', label: 'Community Family Tree', icon: Network },
    { key: 'blood-bank', label: 'Emergency Blood Bank', icon: Droplet },
    { key: 'medical-camp', label: 'Medical Camp Portal', icon: Stethoscope },
    { key: 'businesses', label: 'Business & Jobs Portal', icon: Briefcase },
    { key: 'govt-schemes', label: 'Citizen Service Centre (CSC)', icon: Landmark, badge: 'Govt' },
    { key: 'notifications', label: 'WhatsApp & Alert Centre', icon: MessageSquareShare },
    { key: 'reports', label: 'Export Reports', icon: BarChart3 },
    { key: 'super-admin', label: 'Super Admin SaaS Panel', icon: ShieldCheck },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-950 text-slate-300 w-64 border-r border-slate-800">
      
      {/* Command Center Header */}
      <div className="p-5 border-b border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white shadow-md transition-all"
              style={{ backgroundColor: activeOrg?.themeColor || '#dc2626' }}
            >
              {activeOrg?.name ? activeOrg.name.charAt(0) : 'D'}
            </div>
            <div>
              <h1 className="text-sm font-bold text-white tracking-tight leading-none">CommunityOS</h1>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1 font-semibold">Institutional Suite</p>
            </div>
          </div>
          <button
            onClick={onToggleMobile}
            className="lg:hidden text-slate-400 hover:text-white p-1 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Navigation Modules */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider px-3 py-2">Core Modules</div>
        {menuItems.slice(0, 9).map((item) => {
          const Icon = item.icon;
          const isActive = activeModule === item.key;

          return (
            <button
              key={item.key}
              id={`nav-item-${item.key}`}
              onClick={() => {
                onSelectModule(item.key);
                if (isOpenMobile) onToggleMobile();
              }}
              style={
                isActive
                  ? {
                      backgroundColor: 'var(--community-badge-bg, rgba(220,38,38,0.15))',
                      color: 'var(--community-text-accent, #ef4444)',
                      borderColor: 'var(--community-border, rgba(220,38,38,0.3))',
                    }
                  : {}
              }
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'font-semibold border shadow-xs'
                  : item.highlight
                  ? 'bg-slate-900/60 text-slate-200 hover:bg-slate-900 border border-slate-800'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon 
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? '' : 'text-slate-400'
                  }`} 
                  style={isActive ? { color: 'var(--community-color, #dc2626)' } : {}}
                />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span 
                  className="text-[9px] font-bold px-1.5 py-0.5 rounded tracking-wider border border-white/10"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.06)',
                    color: isActive ? 'var(--community-text-accent)' : '#94a3b8'
                  }}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider px-3 py-2 mt-3">AI & Advanced</div>
        {menuItems.slice(9).map((item) => {
          const Icon = item.icon;
          const isActive = activeModule === item.key;

          return (
            <button
              key={item.key}
              id={`nav-item-${item.key}`}
              onClick={() => {
                onSelectModule(item.key);
                if (isOpenMobile) onToggleMobile();
              }}
              style={
                isActive
                  ? {
                      backgroundColor: 'var(--community-badge-bg, rgba(220,38,38,0.15))',
                      color: 'var(--community-text-accent, #ef4444)',
                      borderColor: 'var(--community-border, rgba(220,38,38,0.3))',
                    }
                  : {}
              }
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'font-semibold border shadow-xs'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon 
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? '' : item.badge === 'AI' ? 'text-emerald-400' : 'text-slate-400'
                  }`} 
                  style={isActive ? { color: 'var(--community-color, #dc2626)' } : {}}
                />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className="text-[9px] font-bold px-1.5 py-0.5 rounded tracking-wider border"
                  style={{
                    backgroundColor: item.badge === 'AI' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255,255,255,0.06)',
                    borderColor: item.badge === 'AI' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255,255,255,0.1)',
                    color: item.badge === 'AI' ? '#34d399' : '#94a3b8'
                  }}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Tenant Context Footer */}
      <div className="p-3 border-t border-slate-800 bg-slate-950">
        <div className="bg-slate-900 rounded-lg p-3 border border-slate-800">
          <p className="text-[10px] text-slate-400 uppercase font-semibold">Active Tenant Context</p>
          <p className="text-xs font-bold text-white mt-0.5 truncate">{activeOrgType}</p>
          <button 
            onClick={() => onSelectModule('super-admin')}
            className="mt-2 w-full text-[10px] bg-slate-800 text-slate-300 py-1.5 rounded hover:bg-indigo-600 hover:text-white transition-colors uppercase font-bold tracking-wider"
          >
            Switch SaaS Org
          </button>
        </div>
      </div>

    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block shrink-0 h-[calc(100vh-4rem)] sticky top-16 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Menu Cards System */}
      <MobileMenuCards
        isOpen={isOpenMobile}
        onClose={onToggleMobile}
        activeModule={activeModule}
        onSelectModule={onSelectModule}
        activeOrg={defaultOrg}
      />
    </>
  );
};
