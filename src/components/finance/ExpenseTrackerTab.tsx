import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  Filter, 
  Download, 
  Receipt, 
  Building2, 
  Eye, 
  Pencil, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  IndianRupee,
  FileCheck,
  Tag
} from 'lucide-react';
import { FinanceTransaction, Organization } from '../../types';
import { Pagination } from '../Pagination';

interface ExpenseTrackerTabProps {
  transactions: FinanceTransaction[];
  activeOrg: Organization;
  onOpenAddModal: (defaultType?: 'Income' | 'Expense') => void;
  onViewTransaction: (tx: FinanceTransaction) => void;
  onEditTransaction: (tx: FinanceTransaction) => void;
  onDeleteTransaction?: (txId: string) => void;
  onExportCSV: () => void;
}

export const ExpenseTrackerTab: React.FC<ExpenseTrackerTabProps> = ({
  transactions,
  activeOrg,
  onOpenAddModal,
  onViewTransaction,
  onEditTransaction,
  onDeleteTransaction,
  onExportCSV,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedProject, setSelectedProject] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter only Expenses
  const allExpenses = useMemo(() => {
    return transactions.filter((t) => t.type === 'Expense');
  }, [transactions]);

  // Available categories & projects
  const categories = useMemo(() => {
    const set = new Set<string>();
    allExpenses.forEach((e) => {
      if (e.category) set.add(e.category);
    });
    return ['All', ...Array.from(set)];
  }, [allExpenses]);

  const projects = useMemo(() => {
    const set = new Set<string>();
    allExpenses.forEach((e) => {
      if (e.projectName) set.add(e.projectName);
    });
    return ['All', ...Array.from(set)];
  }, [allExpenses]);

  // Apply filters
  const filteredExpenses = useMemo(() => {
    return allExpenses.filter((tx) => {
      const q = search.toLowerCase();
      const matchesSearch = 
        !search ||
        tx.voucherNo.toLowerCase().includes(q) ||
        (tx.vendorName && tx.vendorName.toLowerCase().includes(q)) ||
        (tx.invoiceNo && tx.invoiceNo.toLowerCase().includes(q)) ||
        tx.ledgerAccount.toLowerCase().includes(q) ||
        tx.description.toLowerCase().includes(q) ||
        tx.approvedBy.toLowerCase().includes(q);

      const matchesCat = selectedCategory === 'All' || tx.category === selectedCategory;
      const matchesStatus = selectedStatus === 'All' || (tx.status || 'Paid') === selectedStatus;
      const matchesProj = selectedProject === 'All' || tx.projectName === selectedProject;

      return matchesSearch && matchesCat && matchesStatus && matchesProj;
    });
  }, [allExpenses, search, selectedCategory, selectedStatus, selectedProject]);

  // Totals for filtered records
  const filteredTotal = useMemo(() => {
    return filteredExpenses.reduce((acc, t) => acc + t.amount, 0);
  }, [filteredExpenses]);

  const filteredTDS = useMemo(() => {
    return filteredExpenses.reduce((acc, t) => acc + (t.tdsDeducted || 0), 0);
  }, [filteredExpenses]);

  const PAGE_SIZE = 15;
  const paginatedExpenses = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredExpenses.slice(start, start + PAGE_SIZE);
  }, [filteredExpenses, currentPage]);

  return (
    <div className="space-y-5">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Receipt className="w-5 h-5 text-rose-500" />
            <span>Dedicated Expense Register & Vendor Invoices</span>
          </h2>
          <p className="text-xs text-slate-500">
            Track all outgoing procurements, contractor advances, welfare disbursals, and TDS withholdings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onExportCSV}
            className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-emerald-500" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => onOpenAddModal('Expense')}
            className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>New Expense Voucher</span>
          </button>
        </div>
      </div>

      {/* Metric Quick Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Filtered Expenses ({filteredExpenses.length})</p>
            <p className="text-lg font-black text-rose-600 dark:text-rose-400">₹{filteredTotal.toLocaleString('en-IN')}</p>
          </div>
          <Receipt className="w-5 h-5 text-rose-400 opacity-60" />
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">TDS Deducted at Source</p>
            <p className="text-lg font-black text-amber-600 dark:text-amber-400">₹{filteredTDS.toLocaleString('en-IN')}</p>
          </div>
          <FileCheck className="w-5 h-5 text-amber-400 opacity-60" />
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Net Outflow Paid</p>
            <p className="text-lg font-black text-slate-900 dark:text-white">₹{(filteredTotal - filteredTDS).toLocaleString('en-IN')}</p>
          </div>
          <IndianRupee className="w-5 h-5 text-indigo-400 opacity-60" />
        </div>
      </div>

      {/* Filter Controls */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-2.5">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              placeholder="Search vendor, voucher, invoice, ledger or description..."
              className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-400 outline-none focus:border-rose-500"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
            className="px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 outline-none focus:border-rose-500 font-medium"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
            className="px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 outline-none focus:border-rose-500 font-medium"
          >
            <option value="All">All Statuses</option>
            <option value="Paid">Paid</option>
            <option value="Approved">Approved</option>
            <option value="Pending">Pending</option>
          </select>

          {/* Project Filter */}
          <select
            value={selectedProject}
            onChange={(e) => { setSelectedProject(e.target.value); setCurrentPage(1); }}
            className="px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 outline-none focus:border-rose-500 font-medium"
          >
            {projects.map((p) => (
              <option key={p} value={p}>{p === 'All' ? 'All Projects' : p}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Voucher & Date</th>
                <th className="py-3 px-4">Category & Project</th>
                <th className="py-3 px-4">Payee / Vendor</th>
                <th className="py-3 px-4">Payment Instrument</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">TDS (₹)</th>
                <th className="py-3 px-4 text-right">Amount (₹)</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {paginatedExpenses.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No expense records found matching current filters.
                  </td>
                </tr>
              ) : (
                paginatedExpenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 whitespace-nowrap">
                      <p className="font-mono font-bold text-slate-900 dark:text-white">{exp.voucherNo}</p>
                      <p className="text-[10px] text-slate-400">{exp.date}</p>
                    </td>

                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-800 dark:text-slate-200">{exp.ledgerAccount}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          {exp.category}
                        </span>
                        {exp.projectName && (
                          <span className="text-[10px] text-indigo-500 font-medium truncate max-w-[120px]">
                            • {exp.projectName}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {exp.vendorName || exp.approvedBy}
                      </p>
                      {exp.invoiceNo && (
                        <p className="text-[10px] text-slate-400 font-mono">
                          Inv: {exp.invoiceNo} {exp.vendorGst ? `(GST: ${exp.vendorGst.slice(0, 8)}..)` : ''}
                        </p>
                      )}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap text-slate-600 dark:text-slate-400">
                      {exp.paymentMethod}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        (exp.status || 'Paid') === 'Paid'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : exp.status === 'Approved'
                            ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                      }`}>
                        {exp.status || 'Paid'}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right font-mono font-semibold text-slate-500 whitespace-nowrap">
                      {exp.tdsDeducted ? `₹${exp.tdsDeducted.toLocaleString('en-IN')}` : '-'}
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap font-mono font-bold text-rose-600 dark:text-rose-400">
                      ₹{exp.amount.toLocaleString('en-IN')}
                    </td>

                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => onViewTransaction(exp)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                          title="View Voucher Bill"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onEditTransaction(exp)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-amber-600 transition-colors"
                          title="Edit Voucher"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        {onDeleteTransaction && (
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete voucher ${exp.voucherNo}?`)) {
                                onDeleteTransaction(exp.id);
                              }
                            }}
                            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-rose-600 transition-colors"
                            title="Delete Voucher"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredExpenses.length > PAGE_SIZE && (
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(filteredExpenses.length / PAGE_SIZE)}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

    </div>
  );
};
