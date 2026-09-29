import React, { useMemo } from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell,
  CartesianGrid
} from 'recharts';
import { 
  IndianRupee, 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  ShieldCheck, 
  AlertCircle, 
  Download, 
  Plus, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  Receipt,
  FileSpreadsheet
} from 'lucide-react';
import { FinanceTransaction, Organization } from '../../types';

interface FinancialDashboardTabProps {
  transactions: FinanceTransaction[];
  activeOrg: Organization;
  onOpenAddModal: (defaultType?: 'Income' | 'Expense') => void;
  onSelectTab: (tab: 'dashboard' | 'expenses' | 'cashbook' | 'vouchers' | 'balancesheet') => void;
  onExportCSV: () => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  'Cultural & Festival Expense': '#f43f5e', // rose-500
  'Welfare Disbursement': '#10b981', // emerald-500
  'Civic & Utilities': '#3b82f6', // blue-500
  'Safety & Security': '#f59e0b', // amber-500
  'Administrative & Printing': '#8b5cf6', // purple-500
  'Education Scholarship': '#06b6d4', // cyan-500
  'Medical Emergency Fund': '#ec4899', // pink-500
  'Donation Received': '#14b8a6', // teal-500
  'Other Expenses': '#64748b', // slate-500
};

export const FinancialDashboardTab: React.FC<FinancialDashboardTabProps> = ({
  transactions,
  activeOrg,
  onOpenAddModal,
  onSelectTab,
  onExportCSV,
}) => {
  // Calculated high-level metrics
  const totalIncome = useMemo(() => 
    transactions.filter((t) => t.type === 'Income').reduce((acc, t) => acc + t.amount, 0),
    [transactions]
  );

  const totalExpense = useMemo(() => 
    transactions.filter((t) => t.type === 'Expense').reduce((acc, t) => acc + t.amount, 0),
    [transactions]
  );

  const netSurplus = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? Math.round((netSurplus / totalIncome) * 100) : 0;

  // Monthly trend aggregation (Jan to Aug 2026)
  const monthlyCashflowData = useMemo(() => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
    const dataMap: Record<string, { month: string; Income: number; Expense: number; Net: number }> = {};

    monthNames.forEach((m) => {
      dataMap[m] = { month: m, Income: 0, Expense: 0, Net: 0 };
    });

    transactions.forEach((tx) => {
      const d = new Date(tx.date);
      const monthIdx = d.getMonth();
      if (monthIdx >= 0 && monthIdx < monthNames.length) {
        const mName = monthNames[monthIdx];
        if (tx.type === 'Income') {
          dataMap[mName].Income += tx.amount;
        } else {
          dataMap[mName].Expense += tx.amount;
        }
        dataMap[mName].Net = dataMap[mName].Income - dataMap[mName].Expense;
      }
    });

    return Object.values(dataMap);
  }, [transactions]);

  // Expense breakdown by category for Pie Chart
  const expenseCategoryData = useMemo(() => {
    const catMap: Record<string, number> = {};
    transactions
      .filter((t) => t.type === 'Expense')
      .forEach((t) => {
        const cat = t.category || 'Other Expenses';
        catMap[cat] = (catMap[cat] || 0) + t.amount;
      });

    return Object.entries(catMap).map(([name, value]) => ({
      name,
      value,
      color: CATEGORY_COLORS[name] || '#94a3b8',
    }));
  }, [transactions]);

  // Payment methods distribution
  const paymentMethodData = useMemo(() => {
    const pmMap: Record<string, number> = {};
    transactions.forEach((t) => {
      const pm = t.paymentMethod.split(' ')[0] || 'Other';
      pmMap[pm] = (pmMap[pm] || 0) + t.amount;
    });

    return Object.entries(pmMap).map(([name, amount]) => ({
      name,
      amount,
      pct: totalIncome + totalExpense > 0 ? Math.round((amount / (totalIncome + totalExpense)) * 100) : 0,
    }));
  }, [transactions, totalIncome, totalExpense]);

  // Budget vs Actual spend items
  const budgetVsActualItems = useMemo(() => {
    return [
      {
        name: 'Durga Puja Pandal & Artistry',
        allocated: 750000,
        actual: 405000,
        category: 'Festive Structure',
      },
      {
        name: 'Chandannagar Lighting & 3D Gates',
        allocated: 450000,
        actual: 175000,
        category: 'Illumination',
      },
      {
        name: 'Sanjivani Medical Health Grants',
        allocated: 300000,
        actual: 105000,
        category: 'Healthcare',
      },
      {
        name: 'Swami Vivekananda Education Aid',
        allocated: 120000,
        actual: 45000,
        category: 'Scholarships',
      },
      {
        name: 'CESC Power & Civic Permissions',
        allocated: 180000,
        actual: 85000,
        category: 'Utilities',
      },
    ];
  }, []);

  // Recent 5 high-value expenses
  const recentExpenses = useMemo(() => {
    return transactions
      .filter((t) => t.type === 'Expense')
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [transactions]);

  return (
    <div className="space-y-6">
      
      {/* Top Banner with Quick Actions */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-md border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px] uppercase tracking-wider border border-emerald-500/30">
              CAG & 80G Statutory Compliant
            </span>
            <span className="text-xs text-slate-300">• FY 2026-2027</span>
          </div>
          <h2 className="text-lg font-black tracking-tight mt-1 text-white">
            {activeOrg.name} Financial Cockpit
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time cash flow monitoring, expense vouchers, vendor compliance, and budget variance.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onOpenAddModal('Expense')}
            className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Record Expense</span>
          </button>

          <button
            onClick={() => onSelectTab('expenses')}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/15 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Receipt className="w-4 h-4 text-amber-400" />
            <span>Expense Register</span>
          </button>

          <button
            onClick={onExportCSV}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
            title="Download full financial transaction ledger as CSV"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Export Excel/CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Income */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Income Receipts</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">
              ₹{totalIncome.toLocaleString('en-IN')}
            </h3>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" />
              <span>Donations, subscriptions & CSR</span>
            </p>
          </div>
        </div>

        {/* Total Expenses */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Expenditures</span>
            <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-rose-600 dark:text-rose-400">
              ₹{totalExpense.toLocaleString('en-IN')}
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold mt-1 flex items-center gap-1">
              <span>{transactions.filter((t) => t.type === 'Expense').length} approved payment vouchers</span>
            </p>
          </div>
        </div>

        {/* Net Operating Surplus */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Net Surplus / Liquidity</span>
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">
              ₹{netSurplus.toLocaleString('en-IN')}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                {savingsRate}% retention
              </span>
              <span className="text-[11px] text-slate-500">Bank & Cash In Hand</span>
            </div>
          </div>
        </div>

        {/* Compliance & Audit */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">TDS & Compliance Health</span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">
              ₹{(transactions.reduce((acc, t) => acc + (t.tdsDeducted || 0), 0)).toLocaleString('en-IN')}
            </h3>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Section 194C / 194J Compliant</span>
            </p>
          </div>
        </div>

      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Monthly Cash Flow Trend Chart */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <IndianRupee className="w-4 h-4 text-indigo-500" />
                <span>Monthly Cash Flow (Income vs Expenses)</span>
              </h3>
              <p className="text-[11px] text-slate-500">Direct comparison of monthly revenue collections versus vendor dispatches</p>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-bold">
              <span className="flex items-center gap-1 text-emerald-600">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Income
              </span>
              <span className="flex items-center gap-1 text-rose-500">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" /> Expenses
              </span>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyCashflowData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.15} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', fontSize: '11px', color: '#fff' }}
                  formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, '']}
                />
                <Bar dataKey="Income" fill="#10b981" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Expense" fill="#f43f5e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense Category Donut Breakdown */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>Expenses by Category</span>
            </h3>
            <p className="text-[11px] text-slate-500">Percentage distribution of operational funds</p>
          </div>

          <div className="h-44 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseCategoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={68}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {expenseCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', fontSize: '11px', color: '#fff' }}
                  formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Amount']}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] uppercase font-bold text-slate-400">Total Spent</span>
              <span className="text-xs font-black text-slate-900 dark:text-white">
                ₹{(totalExpense / 100000).toFixed(1)}L
              </span>
            </div>
          </div>

          {/* Mini Legend List */}
          <div className="space-y-1.5 pt-1 text-[11px]">
            {expenseCategoryData.slice(0, 4).map((cat, idx) => {
              const pct = totalExpense > 0 ? Math.round((cat.value / totalExpense) * 100) : 0;
              return (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 truncate max-w-[140px]">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                    <span className="truncate text-slate-700 dark:text-slate-300 font-medium">{cat.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-900 dark:text-white">₹{(cat.value / 1000).toFixed(0)}k</span>
                    <span className="text-[10px] text-slate-400 font-semibold w-8 text-right">{pct}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Secondary Row: Budget vs Actual & Payment Methods & Recent Vouchers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Budget vs Actual Tracker */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Budget vs Actual Spend</h3>
              <p className="text-[11px] text-slate-500">Major festival & community project expenditure caps</p>
            </div>
            <span className="px-2 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold text-[10px]">
              FY 2026 Caps
            </span>
          </div>

          <div className="space-y-3.5">
            {budgetVsActualItems.map((item, idx) => {
              const pct = Math.min(100, Math.round((item.actual / item.allocated) * 100));
              const isOver = item.actual > item.allocated;
              const isWarning = pct > 80 && !isOver;

              return (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">{item.name}</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white text-[11px]">
                      ₹{(item.actual / 1000).toFixed(0)}k / ₹{(item.allocated / 1000).toFixed(0)}k
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden relative">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        isOver 
                          ? 'bg-red-500' 
                          : isWarning 
                            ? 'bg-amber-500' 
                            : 'bg-indigo-600'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>{item.category}</span>
                    <span className={`font-bold ${isOver ? 'text-red-500' : isWarning ? 'text-amber-500' : 'text-slate-500'}`}>
                      {pct}% consumed ({`₹${((item.allocated - item.actual) / 1000).toFixed(0)}k remaining`})
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Payment Methods & Cash Balance Breakdown */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Payment Instruments</h3>
              <span className="text-[10px] text-slate-400 font-semibold">Audited Accounts</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">Banking, UPI and petty cash disbursements</p>

            <div className="space-y-3 mt-4">
              {paymentMethodData.map((pm, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{pm.name}</p>
                    <p className="text-[10px] text-slate-500">{pm.pct}% of total throughput</p>
                  </div>
                  <span className="font-mono font-bold text-xs text-slate-900 dark:text-white">
                    ₹{pm.amount.toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-start gap-2.5 mt-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-[11px] text-amber-900 dark:text-amber-200">
              <p className="font-bold">Statutory Cash Limit Warning</p>
              <p className="text-amber-700 dark:text-amber-300 mt-0.5">
                Under Income Tax Act Section 40A(3), cash expenditures above ₹10,000 per voucher are restricted. Use NEFT/RTGS/Cheque.
              </p>
            </div>
          </div>
        </div>

        {/* Recent High-Value Expense Approvals */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Recent Payment Approvals</h3>
            <button
              onClick={() => onSelectTab('expenses')}
              className="text-[11px] text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
            >
              View All
            </button>
          </div>
          <p className="text-[11px] text-slate-500 -mt-2">Latest verified payments cleared by Finance Board</p>

          <div className="space-y-2.5">
            {recentExpenses.map((exp) => (
              <div 
                key={exp.id} 
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs"
              >
                <div className="truncate max-w-[170px]">
                  <p className="font-bold text-slate-900 dark:text-white truncate">
                    {exp.vendorName || exp.ledgerAccount}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">
                    {exp.voucherNo} • {exp.date}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-mono font-bold text-rose-600 dark:text-rose-400">
                    -₹{exp.amount.toLocaleString('en-IN')}
                  </p>
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                    {exp.status || 'Paid'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
