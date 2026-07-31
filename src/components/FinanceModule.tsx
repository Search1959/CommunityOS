import React, { useState } from 'react';
import { 
  Receipt, 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  FileCheck, 
  Download, 
  FileSpreadsheet, 
  CheckCircle2, 
  Clock, 
  IndianRupee,
  Search,
  BookOpen
} from 'lucide-react';
import { FinanceTransaction, Organization } from '../types';

interface FinanceModuleProps {
  transactions: FinanceTransaction[];
  activeOrg: Organization;
  onAddTransaction: (newTx: FinanceTransaction) => void;
}

export const FinanceModule: React.FC<FinanceModuleProps> = ({
  transactions,
  activeOrg,
  onAddTransaction,
}) => {
  const [activeTab, setActiveTab] = useState<'cashbook' | 'vouchers' | 'balancesheet'>('cashbook');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [type, setType] = useState<'Income' | 'Expense'>('Expense');
  const [category, setCategory] = useState('Cultural & Festival Expense');
  const [ledgerAccount, setLedgerAccount] = useState('Pandal Construction & Decorator');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [approvedBy, setApprovedBy] = useState('Debashis Roy (Treasurer)');

  const totalIncome = transactions.filter((t) => t.type === 'Income').reduce((acc, t) => acc + t.amount, 0);
  const totalExpense = transactions.filter((t) => t.type === 'Expense').reduce((acc, t) => acc + t.amount, 0);
  const netSurplus = totalIncome - totalExpense;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description) return;

    const newTx: FinanceTransaction = {
      id: `fin-${Date.now()}`,
      voucherNo: `VOU-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      orgId: activeOrg.id,
      type,
      category,
      ledgerAccount,
      amount: Number(amount),
      paymentMethod: 'Bank Transfer (NEFT)',
      approvedBy,
      date: new Date().toISOString().split('T')[0],
      description,
      projectName: 'Durga Puja 2026'
    };

    onAddTransaction(newTx);
    setShowAddModal(false);
    setAmount('');
    setDescription('');
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Receipt className="w-5 h-5 text-amber-500" />
            <span>Finance, Cash Book & Ledger Accounts</span>
          </h1>
          <p className="text-xs text-slate-500">
            Cash Book, Bank Ledger, Expense Vouchers, CAG Audit Reports & Balance Sheet
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="p-1 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center text-xs font-semibold">
            <button
              onClick={() => setActiveTab('cashbook')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'cashbook' ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 font-bold shadow-sm' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Cash & Bank Book
            </button>
            <button
              onClick={() => setActiveTab('vouchers')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'vouchers' ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 font-bold shadow-sm' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Payment Vouchers
            </button>
            <button
              onClick={() => setActiveTab('balancesheet')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'balancesheet' ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 font-bold shadow-sm' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Audit Balance Sheet
            </button>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Voucher</span>
          </button>
        </div>
      </div>

      {/* Financial Summary Metric Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Total Income Receipts</p>
            <p className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">₹{totalIncome.toLocaleString('en-IN')}</p>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Total Expenditures</p>
            <p className="text-xl font-black text-rose-600 dark:text-rose-400 mt-0.5">₹{totalExpense.toLocaleString('en-IN')}</p>
          </div>
          <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-600">
            <TrendingDown className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Net Corpus Surplus</p>
            <p className="text-xl font-black text-slate-900 dark:text-white mt-0.5">₹{netSurplus.toLocaleString('en-IN')}</p>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600">
            <IndianRupee className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* Tab 1: Cash & Bank Book Ledger */}
      {activeTab === 'cashbook' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Cash Book & Bank Ledger Entries</h2>

            <div className="flex items-center gap-2">
              <button
                onClick={() => alert('Exported Cash Book Ledger to Excel (.xlsx)')}
                className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center gap-1.5"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Export Excel</span>
              </button>

              <button
                onClick={() => alert('Exported Audit Statement to PDF')}
                className="px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 font-bold text-xs flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export PDF</span>
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {transactions.map((tx) => (
              <div key={tx.id} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      tx.type === 'Income' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {tx.type}
                    </span>
                    <span className="text-xs font-bold font-mono text-slate-800 dark:text-slate-200">{tx.voucherNo}</span>
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">{tx.ledgerAccount}</span>
                  </div>
                  <p className="text-xs text-slate-500">{tx.description}</p>
                  <p className="text-[10px] text-slate-400">Approved by: {tx.approvedBy} • Date: {tx.date}</p>
                </div>

                <div className={`text-base font-black ${
                  tx.type === 'Income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                }`}>
                  {tx.type === 'Income' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Balance Sheet Statement */}
      {activeTab === 'balancesheet' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Audited Balance Sheet & P&L Statement</h2>
              <p className="text-xs text-slate-500">As on March 31, 2026 • Certified by Sen & Partners CA</p>
            </div>
            <button
              onClick={() => alert('Downloaded Certified Balance Sheet PDF')}
              className="px-3 py-1.5 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Signed Audit Report</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Liabilities & Corpus */}
            <div className="space-y-3">
              <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] text-rose-500">Liabilities & Capital Corpus</h3>
              <div className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 space-y-2">
                <div className="flex justify-between"><span>General Community Corpus Fund</span><span className="font-mono font-bold">₹2,45,80,000</span></div>
                <div className="flex justify-between"><span>Welfare Reserve Fund</span><span className="font-mono font-bold">₹50,00,000</span></div>
                <div className="flex justify-between"><span>Durga Puja 2026 Advance Sponsorships</span><span className="font-mono font-bold">₹35,00,000</span></div>
                <div className="flex justify-between pt-2 border-t font-bold text-slate-900 dark:text-white"><span>Total Liabilities & Capital</span><span className="font-mono">₹3,30,80,000</span></div>
              </div>
            </div>

            {/* Assets */}
            <div className="space-y-3">
              <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] text-emerald-500">Assets & Bank Deposits</h3>
              <div className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 space-y-2">
                <div className="flex justify-between"><span>Gariahat Premises Land & Building</span><span className="font-mono font-bold">₹1,80,00,000</span></div>
                <div className="flex justify-between"><span>Fixed Deposits with State Bank of India</span><span className="font-mono font-bold">₹1,15,00,000</span></div>
                <div className="flex justify-between"><span>Savings Bank Account Balance (Yes Bank)</span><span className="font-mono font-bold">₹35,80,000</span></div>
                <div className="flex justify-between pt-2 border-t font-bold text-slate-900 dark:text-white"><span>Total Property & Assets</span><span className="font-mono">₹3,30,80,000</span></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Voucher Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Record Payment Voucher</h2>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Voucher Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  >
                    <option value="Expense">Expense</option>
                    <option value="Income">Income</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="e.g. 50000"
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 font-medium mb-1">Ledger Account</label>
                <input
                  type="text"
                  value={ledgerAccount}
                  onChange={(e) => setLedgerAccount(e.target.value)}
                  placeholder="e.g. Pandal Decoration / Medical Relief"
                  className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-medium mb-1">Description / Bill Memo *</label>
                <textarea
                  rows={2}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain transaction details..."
                  className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-rose-600 text-white font-bold"
                >
                  Approve & Post Voucher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
