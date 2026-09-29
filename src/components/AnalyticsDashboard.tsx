import React from 'react';
import { 
  IndianRupee, 
  Users, 
  HeartHandshake, 
  GraduationCap, 
  AlertCircle, 
  TrendingUp, 
  ArrowUpRight, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Download, 
  QrCode,
  LayoutGrid
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  BarChart, 
  Bar, 
  CartesianGrid, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { Organization, SchemeApplication, Donation } from '../types';

interface AnalyticsDashboardProps {
  activeOrg: Organization;
  applications: SchemeApplication[];
  donations: Donation[];
  onApproveApplication: (appId: string) => void;
  onRejectApplication: (appId: string) => void;
  onNavigateModule: (key: string) => void;
  onOpenAIChat: () => void;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  activeOrg,
  applications,
  donations,
  onApproveApplication,
  onRejectApplication,
  onNavigateModule,
  onOpenAIChat,
}) => {

  const donationTrendData = [
    { month: 'Jan', amount: 320000 },
    { month: 'Feb', amount: 480000 },
    { month: 'Mar', amount: 610000 },
    { month: 'Apr', amount: 540000 },
    { month: 'May', amount: 720000 },
    { month: 'Jun', amount: 890000 },
    { month: 'Jul', amount: 1250000 },
  ];

  const expenseBreakdownData = [
    { name: 'Pandal & Cultural', value: 45, color: '#e11d48' },
    { name: 'Medical Aid', value: 25, color: '#0284c7' },
    { name: 'Scholarships', value: 18, color: '#16a34a' },
    { name: 'Admin & Maintenance', value: 12, color: '#d97706' },
  ];

  const pendingApplications = applications.filter((a) => a.status === 'Pending Verification' || a.status === 'Under Review');

  return (
    <div className="space-y-6">
      
      {/* Header Bar Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Operational Overview</h1>
            <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live Analytics</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time analytics for {activeOrg.name} ({activeOrg.type})
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateModule('donations')}
            className="px-4 py-2 rounded-xl text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 hover:opacity-95 cursor-pointer"
            style={{ backgroundColor: activeOrg.themeColor || '#dc2626' }}
          >
            <IndianRupee className="w-3.5 h-3.5" />
            <span>Collect Donation</span>
          </button>
        </div>
      </div>

      {/* Mobile Quick Menu Cards Banner */}
      <div 
        className="lg:hidden p-3.5 rounded-2xl text-white shadow-md flex items-center justify-between gap-3 transition-colors"
        style={{
          background: `linear-gradient(135deg, ${activeOrg.themeColor || '#dc2626'}ee, #1e293b)`
        }}
      >
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-white/20 backdrop-blur-sm shrink-0">
            <LayoutGrid className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-xs font-black tracking-tight">Explore 20 Mobile Menu Cards</p>
            <p className="text-[10px] text-white/80">Touch-friendly cards for Members, 80G, Events & Blood SOS</p>
          </div>
        </div>
        <button
          onClick={() => {
            const btn = document.getElementById('btn-open-mobile-sidebar') || document.getElementById('btn-mobile-nav-all-cards');
            btn?.click();
          }}
          className="px-3 py-1.5 rounded-xl bg-white text-slate-900 font-extrabold text-xs shadow-sm hover:bg-slate-100 active:scale-95 transition-all shrink-0 cursor-pointer"
        >
          Open Cards
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Active Members */}
        <div 
          className="bg-white dark:bg-slate-900/90 p-5 rounded-2xl border shadow-xs transition-all"
          style={{ borderColor: 'var(--community-border, rgba(0,0,0,0.08))' }}
        >
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Active Members</p>
          <div className="flex items-end justify-between mt-2">
            <h3 className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
              {activeOrg.membersCount.toLocaleString('en-IN')}
            </h3>
            <span className="text-emerald-600 dark:text-emerald-400 text-xs font-semibold tabular-nums">+12% MoM</span>
          </div>
        </div>

        {/* Donations YTD */}
        <div 
          className="bg-white dark:bg-slate-900/90 p-5 rounded-2xl border shadow-xs transition-all"
          style={{ borderColor: 'var(--community-border, rgba(0,0,0,0.08))' }}
        >
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Donations (YTD)</p>
          <div className="flex items-end justify-between mt-2">
            <h3 className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
              ₹{(activeOrg.totalDonationsYTD / 100000).toFixed(2)}L
            </h3>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">80G Tax Exempt</span>
          </div>
        </div>

        {/* Welfare Disbursed */}
        <div 
          className="bg-white dark:bg-slate-900/90 p-5 rounded-2xl border shadow-xs transition-all"
          style={{ borderColor: 'var(--community-border, rgba(0,0,0,0.08))' }}
        >
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Scholarships & Welfare</p>
          <div className="flex items-end justify-between mt-2">
            <h3 className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
              {activeOrg.activeSchemesCount} Schemes
            </h3>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">₹12.4L Disbursed</span>
          </div>
        </div>

        {/* Pending Requests */}
        <div 
          className="bg-white dark:bg-slate-900/90 p-5 rounded-2xl border shadow-xs transition-all"
          style={{ borderColor: 'var(--community-border, rgba(0,0,0,0.08))' }}
        >
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Pending Verification</p>
          <div className="flex items-end justify-between mt-2">
            <h3 className="text-2xl font-bold font-mono tabular-nums text-amber-600 dark:text-amber-400">
              {pendingApplications.length}
            </h3>
            <span 
              className="text-xs font-bold underline cursor-pointer" 
              style={{ color: 'var(--community-text-accent, #dc2626)' }}
              onClick={() => onNavigateModule('welfare')}
            >
              Action Needed
            </span>
          </div>
        </div>

      </div>

      {/* Operational Highlights: Pending Approvals & Event Roadmap */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        
        {/* Pending Approvals Card */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col min-h-[220px]">
          <div className="p-3.5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <h3 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">Pending Approvals</h3>
            <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide cursor-pointer hover:underline" onClick={() => onNavigateModule('welfare')}>View All</span>
          </div>
          <div className="flex-1 p-2 space-y-1.5 overflow-y-auto custom-scrollbar">
            {pendingApplications.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400">All applications approved!</div>
            ) : (
              pendingApplications.slice(0, 4).map((app) => (
                <div key={app.id} className="flex items-center justify-between p-2 hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-lg transition-colors">
                  <div className="truncate pr-2">
                    <p className="text-[11px] font-bold text-slate-900 dark:text-white truncate">{app.applicantName}</p>
                    <p className="text-[9px] text-slate-500 truncate">{app.schemeName}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button 
                      onClick={() => onApproveApplication(app.id)}
                      className="p-1 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950 rounded"
                      title="Approve"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => onRejectApplication(app.id)}
                      className="p-1 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 rounded"
                      title="Reject"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Event Roadmap */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 min-h-[220px] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">Event Roadmap</h3>
              <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 cursor-pointer hover:underline" onClick={() => onNavigateModule('events')}>Calendar →</span>
            </div>
            <div className="space-y-3">
              <div className="flex gap-3 items-center">
                <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-950 border border-indigo-100 dark:border-indigo-800 rounded-lg flex flex-col items-center justify-center shrink-0">
                  <span className="text-[9px] font-bold text-indigo-600 dark:text-indigo-400">OCT</span>
                  <span className="text-xs font-black text-slate-800 dark:text-white leading-none">20</span>
                </div>
                <div className="truncate">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">Annual Maha Utsav & Cultural Nights</p>
                  <p className="text-[10px] text-slate-500 truncate">Mega Pandal, Free Food Distribution</p>
                </div>
              </div>

              <div className="flex gap-3 items-center">
                <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-950 border border-emerald-100 dark:border-emerald-800 rounded-lg flex flex-col items-center justify-center shrink-0">
                  <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400">OCT</span>
                  <span className="text-xs font-black text-slate-800 dark:text-white leading-none">25</span>
                </div>
                <div className="truncate">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">Emergency Blood Donation Drive</p>
                  <p className="text-[10px] text-slate-500 truncate">Free Medical Checkup & Blood Camp</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
            <span>2 upcoming community initiatives</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-semibold cursor-pointer hover:underline" onClick={() => onNavigateModule('events')}>View Schedule</span>
          </div>
        </div>

      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Donation Trend Area Chart */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Monthly Donation & Revenue Trend
              </h2>
              <p className="text-xs text-slate-500">Includes Online UPI, 80G Receipts & Bank Transfers</p>
            </div>
            <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
              FY 2026-27
            </span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={donationTrendData}>
                <defs>
                  <linearGradient id="colorDonation" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                <YAxis tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v/1000}k`} tick={{ fontSize: 11 }} />
                <Tooltip 
                  formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, 'Donations']}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', borderColor: '#334155', color: '#fff', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="amount" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorDonation)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense Category Breakdown */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
              Expenditure Breakdown
            </h2>
            <p className="text-xs text-slate-500 mb-3">Allocation across core committees</p>

            <div className="h-40 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseBreakdownData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {expenseBreakdownData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [`${value}%`, 'Share']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-1.5 pt-3 border-t border-slate-100 dark:border-slate-800">
            {expenseBreakdownData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-600 dark:text-slate-300">{item.name}</span>
                </div>
                <span className="font-bold text-slate-900 dark:text-white">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
