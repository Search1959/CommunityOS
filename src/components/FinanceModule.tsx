import React, { useState, useMemo } from 'react';
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
  BookOpen,
  Eye,
  Pencil,
  Trash2,
  X,
  LayoutDashboard,
  Wallet,
  Building2,
  Printer,
  ShieldCheck,
  Tag
} from 'lucide-react';
import { FinanceTransaction, Organization } from '../types';
import { Pagination } from './Pagination';
import { FinancialDashboardTab } from './finance/FinancialDashboardTab';
import { ExpenseTrackerTab } from './finance/ExpenseTrackerTab';

interface FinanceModuleProps {
  transactions: FinanceTransaction[];
  activeOrg: Organization;
  onAddTransaction: (newTx: FinanceTransaction) => void;
  onUpdateTransaction?: (updatedTx: FinanceTransaction) => void;
  onDeleteTransaction?: (txId: string) => void;
}

export const FinanceModule: React.FC<FinanceModuleProps> = ({
  transactions,
  activeOrg,
  onAddTransaction,
  onUpdateTransaction,
  onDeleteTransaction,
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'expenses' | 'cashbook' | 'vouchers' | 'balancesheet'>('dashboard');
  const [showAddModal, setShowAddModal] = useState(false);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewingTx, setViewingTx] = useState<FinanceTransaction | null>(null);
  const [editingTx, setEditingTx] = useState<FinanceTransaction | null>(null);

  // Form State for Add Voucher / Expense
  const [type, setType] = useState<'Income' | 'Expense'>('Expense');
  const [category, setCategory] = useState('Cultural & Festival Expense');
  const [ledgerAccount, setLedgerAccount] = useState('Pandal Construction & Decorator');
  const [amount, setAmount] = useState('');
  const [vendorName, setVendorName] = useState('');
  const [vendorGst, setVendorGst] = useState('');
  const [invoiceNo, setInvoiceNo] = useState('');
  const [tdsRate, setTdsRate] = useState('0'); // 0, 1, 2, 10
  const [paymentMethod, setPaymentMethod] = useState('Bank Transfer (NEFT)');
  const [projectName, setProjectName] = useState('Durga Puja 2026');
  const [status, setStatus] = useState<'Paid' | 'Approved' | 'Pending'>('Paid');
  const [description, setDescription] = useState('');
  const [approvedBy, setApprovedBy] = useState('Debashis Roy (Treasurer)');

  // Overall calculations
  const totalIncome = useMemo(() => 
    transactions.filter((t) => t.type === 'Income').reduce((acc, t) => acc + t.amount, 0),
    [transactions]
  );
  const totalExpense = useMemo(() => 
    transactions.filter((t) => t.type === 'Expense').reduce((acc, t) => acc + t.amount, 0),
    [transactions]
  );
  const netSurplus = totalIncome - totalExpense;

  // Filtered transactions for Cash & Bank Ledger and Vouchers tabs
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const q = search.toLowerCase();
      return (
        t.voucherNo.toLowerCase().includes(q) ||
        t.ledgerAccount.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.approvedBy.toLowerCase().includes(q) ||
        (t.vendorName && t.vendorName.toLowerCase().includes(q))
      );
    });
  }, [transactions, search]);

  const PAGE_SIZE = 20;
  const paginatedTransactions = useMemo(() => {
    return filteredTransactions.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  }, [filteredTransactions, currentPage]);

  const openAddModalWithType = (defaultType: 'Income' | 'Expense' = 'Expense') => {
    setType(defaultType);
    if (defaultType === 'Expense') {
      setCategory('Cultural & Festival Expense');
      setLedgerAccount('Pandal Construction & Decorator');
    } else {
      setCategory('Donation Received');
      setLedgerAccount('General Donation 80G');
    }
    setAmount('');
    setVendorName('');
    setVendorGst('');
    setInvoiceNo('');
    setTdsRate('0');
    setDescription('');
    setShowAddModal(true);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = Number(amount);
    if (!numAmount || !description) return;

    const rate = Number(tdsRate);
    const tdsAmount = rate > 0 ? Math.round((numAmount * rate) / 100) : 0;

    const newTx: FinanceTransaction = {
      id: `fin-${Date.now()}`,
      voucherNo: `VOU-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      orgId: activeOrg.id,
      type,
      category,
      ledgerAccount,
      amount: numAmount,
      vendorName: vendorName.trim() || undefined,
      vendorGst: vendorGst.trim() || undefined,
      invoiceNo: invoiceNo.trim() || undefined,
      tdsDeducted: tdsAmount,
      paymentMethod,
      approvedBy,
      date: new Date().toISOString().split('T')[0],
      description,
      projectName: projectName.trim() || undefined,
      status,
      receiptAttachment: invoiceNo ? `${invoiceNo.replace(/\//g, '_')}_Bill.pdf` : undefined,
    };

    onAddTransaction(newTx);
    setShowAddModal(false);
    setAmount('');
    setDescription('');
    setVendorName('');
  };

  const handleExportCSV = () => {
    const headers = [
      'Voucher No',
      'Date',
      'Type',
      'Category',
      'Ledger Account',
      'Payee / Vendor',
      'GSTIN',
      'Invoice No',
      'Gross Amount (INR)',
      'TDS Deducted (INR)',
      'Net Amount (INR)',
      'Payment Method',
      'Project',
      'Approved By',
      'Status',
      'Description'
    ];

    const rows = transactions.map((t) => [
      `"${t.voucherNo}"`,
      `"${t.date}"`,
      `"${t.type}"`,
      `"${t.category || ''}"`,
      `"${t.ledgerAccount}"`,
      `"${t.vendorName || ''}"`,
      `"${t.vendorGst || ''}"`,
      `"${t.invoiceNo || ''}"`,
      t.amount,
      t.tdsDeducted || 0,
      t.amount - (t.tdsDeducted || 0),
      `"${t.paymentMethod}"`,
      `"${t.projectName || ''}"`,
      `"${t.approvedBy}"`,
      `"${t.status || 'Paid'}"`,
      `"${(t.description || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${activeOrg.slug || 'community'}_financial_ledger_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Dynamic balance sheet tailored to activeOrg
  const getBalanceSheetInfo = (orgId: string) => {
    switch (orgId) {
      case 'org-2':
        return {
          auditor: 'M.K. Jaiswal & Co. Chartered Accountants',
          liabilities: [
            { label: 'Jaiswal Community General Corpus Fund', amount: '₹4,15,20,000' },
            { label: 'Matrimonial & Youth Sammelan Reserve', amount: '₹60,00,000' },
            { label: 'Life Membership Fee Advances', amount: '₹40,00,000' },
          ],
          totalLiabilities: '₹5,15,20,000',
          assets: [
            { label: 'Jaiswal Bhawan Premises & Community Hall', amount: '₹3,20,00,000' },
            { label: 'Fixed Deposits with Punjab National Bank', amount: '₹1,50,00,000' },
            { label: 'Savings Bank Account Balance (SBI)', amount: '₹45,20,000' },
          ],
          totalAssets: '₹5,15,20,000',
        };
      case 'org-3':
        return {
          auditor: 'R.K. Sharma & Associates CA',
          liabilities: [
            { label: 'Temple Seva & Construction Capital Corpus', amount: '₹12,00,00,000' },
            { label: 'Annakshetra & Bhandara Reserve Fund', amount: '₹1,05,00,000' },
            { label: 'Nitya Seva & Puja Advance Collections', amount: '₹50,00,000' },
          ],
          totalLiabilities: '₹13,55,00,000',
          assets: [
            { label: 'Temple Complex & Seva Sadan Land', amount: '₹8,50,00,000' },
            { label: 'Fixed Deposits with State Bank of India', amount: '₹4,20,00,000' },
            { label: 'Savings Bank Account (HDFC Bank)', amount: '₹85,00,000' },
          ],
          totalAssets: '₹13,55,00,000',
        };
      case 'org-4':
        return {
          auditor: 'Gupta & Roy CA',
          liabilities: [
            { label: 'Educational Trust Building & Infrastructure Fund', amount: '₹2,50,00,000' },
            { label: 'Student Scholarship Reserve', amount: '₹45,00,000' },
            { label: 'Annual Academic & Lab Deposits', amount: '₹17,50,000' },
          ],
          totalLiabilities: '₹3,12,50,000',
          assets: [
            { label: 'Vidyapeeth School Building & Computer Labs', amount: '₹2,10,00,000' },
            { label: 'Educational Fixed Deposits (ICICI Bank)', amount: '₹80,00,000' },
            { label: 'School Operating Bank Account Balance', amount: '₹22,50,000' },
          ],
          totalAssets: '₹3,12,50,000',
        };
      case 'org-5':
        return {
          auditor: 'D.B. Banerjee & Co. Chartered Accountants',
          liabilities: [
            { label: 'Chalta Bagan Durga Puja General Corpus Fund', amount: '₹1,95,00,000' },
            { label: 'Dhak Utsav & Cultural Festival Reserve', amount: '₹38,50,000' },
            { label: 'Durga Puja 2026 Corporate Advance Sponsorships', amount: '₹25,00,000' },
          ],
          totalLiabilities: '₹2,58,50,000',
          assets: [
            { label: 'Manicktala Lohapatty Community Hall & Storehouse', amount: '₹1,45,00,000' },
            { label: 'Emergency Reserve Fixed Deposit (SBI)', amount: '₹85,00,000' },
            { label: 'HDFC Bank Operating Account Balance', amount: '₹28,50,000' },
          ],
          totalAssets: '₹2,58,50,000',
        };
      case 'org-1':
      default:
        return {
          auditor: 'Sen & Partners CA',
          liabilities: [
            { label: 'General Community Corpus Fund', amount: '₹2,45,80,000' },
            { label: 'Welfare Reserve Fund', amount: '₹50,00,000' },
            { label: 'Durga Puja 2026 Advance Sponsorships', amount: '₹35,00,000' },
          ],
          totalLiabilities: '₹3,30,80,000',
          assets: [
            { label: `${activeOrg.name} Premises Land & Building`, amount: '₹1,80,00,000' },
            { label: 'Fixed Deposits with State Bank of India', amount: '₹1,15,00,000' },
            { label: 'Savings Bank Account Balance (Yes Bank)', amount: '₹35,80,000' },
          ],
          totalAssets: '₹3,30,80,000',
        };
    }
  };

  const bs = getBalanceSheetInfo(activeOrg.id);

  return (
    <div className="space-y-6">
      
      {/* Header & Tabs */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Receipt className="w-5 h-5 text-amber-500" />
            <span>Expenses & Financial Dashboard</span>
          </h1>
          <p className="text-xs text-slate-500">
            Real-time financial analytics, expense tracking, vendor vouchers, bank ledger & CAG balance sheet
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Navigation Pill Tabs */}
          <div className="p-1 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center text-xs font-semibold overflow-x-auto max-w-full">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'dashboard' 
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 font-bold shadow-xs' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('expenses')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'expenses' 
                  ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 font-bold shadow-xs' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>Expenses</span>
            </button>

            <button
              onClick={() => setActiveTab('cashbook')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'cashbook' 
                  ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 font-bold shadow-xs' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Cash & Bank Book</span>
            </button>

            <button
              onClick={() => setActiveTab('vouchers')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'vouchers' 
                  ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 font-bold shadow-xs' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>Vouchers</span>
            </button>

            <button
              onClick={() => setActiveTab('balancesheet')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'balancesheet' 
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 font-bold shadow-xs' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Audit Balance Sheet</span>
            </button>
          </div>

          <button
            onClick={() => openAddModalWithType('Expense')}
            className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs shrink-0 cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>New Voucher</span>
          </button>
        </div>
      </div>

      {/* Tab Content Render */}
      {activeTab === 'dashboard' && (
        <FinancialDashboardTab
          transactions={transactions}
          activeOrg={activeOrg}
          onOpenAddModal={openAddModalWithType}
          onSelectTab={setActiveTab}
          onExportCSV={handleExportCSV}
        />
      )}

      {activeTab === 'expenses' && (
        <ExpenseTrackerTab
          transactions={transactions}
          activeOrg={activeOrg}
          onOpenAddModal={openAddModalWithType}
          onViewTransaction={setViewingTx}
          onEditTransaction={setEditingTx}
          onDeleteTransaction={onDeleteTransaction}
          onExportCSV={handleExportCSV}
        />
      )}

      {/* Tab 3 & 4: Cash & Bank Book / Vouchers */}
      {(activeTab === 'cashbook' || activeTab === 'vouchers') && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {activeTab === 'vouchers' ? 'Payment & Receipt Vouchers' : 'Cash Book & Bank Ledger Entries'} ({filteredTransactions.length})
              </h2>
              <p className="text-xs text-slate-500">
                {activeTab === 'vouchers' 
                  ? 'Sequential payment debit vouchers with signatory authorization' 
                  : 'Dual-entry financial ledger recording all debit and credit flows'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                  placeholder="Search voucher, ledger, vendor..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-400 outline-none focus:border-rose-500"
                />
              </div>

              <button
                onClick={handleExportCSV}
                className="px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                title="Download CSV"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {paginatedTransactions.map((tx) => (
              <div key={tx.id} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      tx.type === 'Income' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    }`}>
                      {tx.type}
                    </span>
                    <span className="text-xs font-bold font-mono text-slate-800 dark:text-slate-200">{tx.voucherNo}</span>
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">{tx.ledgerAccount}</span>
                    {tx.vendorName && (
                      <span className="text-xs text-slate-500">• Payee: {tx.vendorName}</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{tx.description}</p>
                  <p className="text-[10px] text-slate-400">
                    Approved by: {tx.approvedBy} • Date: {tx.date} • Instrument: {tx.paymentMethod}
                  </p>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2">
                  <div className={`text-base font-black ${
                    tx.type === 'Income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                  }`}>
                    {tx.type === 'Income' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setViewingTx(tx)}
                      className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition-colors"
                      title="View Voucher Details"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => setEditingTx(tx)}
                      className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-amber-950 text-slate-600 dark:text-slate-300 hover:text-amber-600 transition-colors"
                      title="Edit Voucher"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>

                    {onDeleteTransaction && (
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete voucher ${tx.voucherNo}?`)) {
                            onDeleteTransaction(tx.id);
                          }
                        }}
                        className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950 text-slate-600 dark:text-slate-300 hover:text-rose-600 transition-colors"
                        title="Delete Voucher"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalItems={filteredTransactions.length}
            pageSize={PAGE_SIZE}
            onPageChange={(p) => setCurrentPage(p)}
          />
        </div>
      )}

      {/* Tab 5: Balance Sheet Statement */}
      {activeTab === 'balancesheet' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Audited Balance Sheet & P&L Statement</h2>
              <p className="text-xs text-slate-500">
                {activeOrg.name} • As on March 31, 2026 • Certified by {bs.auditor}
              </p>
            </div>
            <button
              onClick={() => alert(`Downloaded Certified Balance Sheet PDF for ${activeOrg.name}`)}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition-all self-start sm:self-auto cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Download Signed Audit Report</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Liabilities & Corpus */}
            <div className="space-y-3">
              <h3 className="font-bold uppercase tracking-wider text-[11px] text-rose-500 flex items-center gap-1.5">
                <span>Liabilities & Capital Corpus</span>
              </h3>
              <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 space-y-2.5 bg-slate-50/50 dark:bg-slate-800/30">
                {bs.liabilities.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-slate-700 dark:text-slate-300">
                    <span>{item.label}</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">{item.amount}</span>
                  </div>
                ))}
                <div className="flex justify-between pt-2.5 border-t border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white">
                  <span>Total Liabilities & Capital</span>
                  <span className="font-mono text-rose-600 dark:text-rose-400">{bs.totalLiabilities}</span>
                </div>
              </div>
            </div>

            {/* Assets */}
            <div className="space-y-3">
              <h3 className="font-bold uppercase tracking-wider text-[11px] text-emerald-500 flex items-center gap-1.5">
                <span>Assets & Bank Deposits</span>
              </h3>
              <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 space-y-2.5 bg-slate-50/50 dark:bg-slate-800/30">
                {bs.assets.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-slate-700 dark:text-slate-300">
                    <span>{item.label}</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">{item.amount}</span>
                  </div>
                ))}
                <div className="flex justify-between pt-2.5 border-t border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white">
                  <span>Total Property & Assets</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400">{bs.totalAssets}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Voucher / Expense Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative my-8">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Receipt className="w-5 h-5 text-rose-500" />
              <span>Record Financial Voucher ({type})</span>
            </h2>

            <form onSubmit={handleAddSubmit} className="space-y-3.5 text-xs">
              
              {/* Type Switcher */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Voucher Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white"
                  >
                    <option value="Expense">Expense (Payment Voucher)</option>
                    <option value="Income">Income (Receipt Voucher)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-500 font-medium mb-1">Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="e.g. 75000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Category & Ledger */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Accounting Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                  >
                    {type === 'Expense' ? (
                      <>
                        <option value="Cultural & Festival Expense">Cultural & Festival Expense</option>
                        <option value="Welfare Disbursement">Welfare Disbursement</option>
                        <option value="Civic & Utilities">Civic & Utilities</option>
                        <option value="Safety & Security">Safety & Security</option>
                        <option value="Administrative & Printing">Administrative & Printing</option>
                        <option value="Education Scholarship">Education Scholarship</option>
                      </>
                    ) : (
                      <>
                        <option value="Donation Received">Donation Received (80G)</option>
                        <option value="Membership Subscription">Membership Subscription</option>
                        <option value="Souvenir & Sponsorship">Souvenir & Sponsorship</option>
                        <option value="Bank Interest">Bank Fixed Deposit Interest</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-500 font-medium mb-1">Ledger Account Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pandal Bamboo & Framing"
                    value={ledgerAccount}
                    onChange={(e) => setLedgerAccount(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>

              {/* Vendor & Invoice (for expenses) */}
              {type === 'Expense' && (
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-2.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-500 font-medium mb-1">Vendor / Payee Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Midnapore Decorators LLP"
                        value={vendorName}
                        onChange={(e) => setVendorName(e.target.value)}
                        className="w-full p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-500 font-medium mb-1">Vendor GSTIN (Optional)</label>
                      <input
                        type="text"
                        placeholder="e.g. 19AAECM4421P1Z9"
                        value={vendorGst}
                        onChange={(e) => setVendorGst(e.target.value)}
                        className="w-full p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-500 font-medium mb-1">Bill / Invoice No.</label>
                      <input
                        type="text"
                        placeholder="e.g. INV/2026/089"
                        value={invoiceNo}
                        onChange={(e) => setInvoiceNo(e.target.value)}
                        className="w-full p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-500 font-medium mb-1">TDS Withholding Rate</label>
                      <select
                        value={tdsRate}
                        onChange={(e) => setTdsRate(e.target.value)}
                        className="w-full p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                      >
                        <option value="0">0% (Nil / Exempted)</option>
                        <option value="1">1% (Section 194C Individual Contractor)</option>
                        <option value="2">2% (Section 194C Company Contractor)</option>
                        <option value="10">10% (Section 194J Professional Services)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Method, Project & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                  >
                    <option value="Bank Transfer (NEFT)">Bank Transfer (NEFT)</option>
                    <option value="RTGS">RTGS</option>
                    <option value="UPI / QR">UPI / QR Code</option>
                    <option value="Cheque">Bank Cheque</option>
                    <option value="Cash">Cash (Petty Cash)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-500 font-medium mb-1">Project / Initiative</label>
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 font-medium mb-1">Voucher Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium"
                  >
                    <option value="Paid">Paid / Settled</option>
                    <option value="Approved">Approved (Awaiting Clearing)</option>
                    <option value="Pending">Pending Audit Verification</option>
                  </select>
                </div>
              </div>

              {/* Description & Approval */}
              <div>
                <label className="block text-slate-500 font-medium mb-1">Description / Memo *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Detail the purpose of expenditure and statutory approval reference..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-medium mb-1">Approved By (Signatory)</label>
                <input
                  type="text"
                  required
                  value={approvedBy}
                  onChange={(e) => setApprovedBy(e.target.value)}
                  className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold hover:bg-slate-200 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition-all shadow-xs cursor-pointer"
                >
                  Post Voucher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Transaction Modal */}
      {viewingTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setViewingTx(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Receipt className="w-4 h-4 text-rose-500" />
                <span>Payment Voucher Receipt</span>
              </h2>
              <button
                onClick={() => window.print()}
                className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900"
                title="Print Voucher"
              >
                <Printer className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs space-y-2.5 border border-slate-200 dark:border-slate-700 font-medium">
              <div className="flex justify-between">
                <span className="text-slate-400">Voucher No:</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{viewingTx.voucherNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Date:</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">{viewingTx.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Type:</span>
                <span className={`font-bold uppercase ${viewingTx.type === 'Income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {viewingTx.type}
                </span>
              </div>
              {viewingTx.vendorName && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Vendor / Payee:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{viewingTx.vendorName}</span>
                </div>
              )}
              {viewingTx.invoiceNo && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Invoice Ref:</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200">{viewingTx.invoiceNo}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-400">Ledger Account:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{viewingTx.ledgerAccount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Category:</span>
                <span className="text-slate-800 dark:text-slate-200">{viewingTx.category}</span>
              </div>

              {viewingTx.tdsDeducted ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Gross Amount:</span>
                    <span className="font-mono text-slate-800 dark:text-slate-200">₹{viewingTx.amount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-amber-600 dark:text-amber-400">
                    <span>Less: TDS Deducted:</span>
                    <span className="font-mono font-bold">-₹{viewingTx.tdsDeducted.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-200 dark:border-slate-700">
                    <span className="font-bold text-slate-900 dark:text-white">Net Paid Amount:</span>
                    <span className="font-black text-slate-900 dark:text-white text-sm">
                      ₹{(viewingTx.amount - viewingTx.tdsDeducted).toLocaleString('en-IN')}
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between pt-1 border-t border-slate-200 dark:border-slate-700">
                  <span className="text-slate-400 font-bold">Total Amount:</span>
                  <span className="font-black text-slate-900 dark:text-white text-sm">₹{viewingTx.amount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-slate-400">Payment Instrument:</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">{viewingTx.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Authorized By:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{viewingTx.approvedBy}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                <span className="text-slate-400 block mb-1">Description / Memo:</span>
                <p className="font-medium text-slate-800 dark:text-slate-200">{viewingTx.description}</p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setViewingTx(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-200 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Transaction Modal */}
      {editingTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setEditingTx(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Pencil className="w-4 h-4 text-amber-500" />
              <span>Edit Voucher: {editingTx.voucherNo}</span>
            </h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                onUpdateTransaction?.(editingTx);
                setEditingTx(null);
              }}
              className="space-y-3 text-xs"
            >
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Voucher Type</label>
                  <select
                    value={editingTx.type}
                    onChange={(e) => setEditingTx({ ...editingTx, type: e.target.value as any })}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
                  >
                    <option value="Expense">Expense</option>
                    <option value="Income">Income</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    required
                    value={editingTx.amount}
                    onChange={(e) => setEditingTx({ ...editingTx, amount: Number(e.target.value) })}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 font-medium mb-1">Ledger Account</label>
                <input
                  type="text"
                  required
                  value={editingTx.ledgerAccount}
                  onChange={(e) => setEditingTx({ ...editingTx, ledgerAccount: e.target.value })}
                  className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-medium mb-1">Vendor / Payee</label>
                <input
                  type="text"
                  value={editingTx.vendorName || ''}
                  onChange={(e) => setEditingTx({ ...editingTx, vendorName: e.target.value })}
                  className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-medium mb-1">Description / Memo</label>
                <textarea
                  rows={2}
                  required
                  value={editingTx.description}
                  onChange={(e) => setEditingTx({ ...editingTx, description: e.target.value })}
                  className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingTx(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold transition-all cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
