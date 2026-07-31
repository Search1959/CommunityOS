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

interface SidebarProps {
  activeModule: string;
  onSelectModule: (key: string) => void;
  isOpenMobile: boolean;
  onToggleMobile: () => void;
  activeOrgType: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeModule,
  onSelectModule,
  isOpenMobile,
  onToggleMobile,
  activeOrgType,
}) => {
  const menuItems = [
    { key: 'dashboard', label: 'Analytics Dashboard', icon: LayoutDashboard },
    { key: 'org-profile', label: 'Organization Profile', icon: Building2 },
    { key: 'membership', label: 'Membership Directory', icon: Users },
    { key: 'committee', label: 'Committee & Meetings', icon: Award },
    { key: 'welfare', label: 'Welfare Schemes', icon: HeartHandshake },
    { key: 'donations', label: 'Donations & 80G Receipts', icon: IndianRupee },
    { key: 'finance', label: 'Finance & Cash Book', icon: Receipt },
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
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white shadow-md shadow-indigo-600/30">
              D
            </div>
            <div>
              <h1 className="text-base font-bold text-white tracking-tight leading-none">CommunityOS</h1>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1 font-semibold">Enterprise Suite</p>
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
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-all ${
                isActive
                  ? 'bg-indigo-600/15 text-indigo-400 font-semibold border border-indigo-500/30'
                  : item.highlight
                  ? 'bg-indigo-950/40 text-indigo-300 hover:bg-slate-900 border border-indigo-900/50'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
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
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-all ${
                isActive
                  ? 'bg-indigo-600/15 text-indigo-400 font-semibold border border-indigo-500/30'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-indigo-400' : item.badge === 'AI' ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                    item.badge === 'AI'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                  }`}
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

      {/* Mobile Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div 
            onClick={onToggleMobile} 
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200" 
          />
          <div className="relative z-10 w-64 h-full animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
