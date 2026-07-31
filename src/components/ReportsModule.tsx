import React from 'react';
import { BarChart3, Download, FileSpreadsheet, FileText, CheckCircle2 } from 'lucide-react';
import { Organization } from '../types';

export const ReportsModule: React.FC<{ activeOrg: Organization }> = ({ activeOrg }) => {
  const reportsList = [
    { name: 'Annual Statutory Audit Report FY 2025-26', type: 'PDF', size: '2.4 MB' },
    { name: 'Complete Member Register with Blood Group & Address', type: 'Excel', size: '1.1 MB' },
    { name: '80G Tax Donation Certificate Master Ledger', type: 'PDF', size: '3.8 MB' },
    { name: 'Executive Meeting Resolutions & Voting Register', type: 'PDF', size: '1.9 MB' },
    { name: 'Welfare Scheme Disbursal Audit Trail', type: 'Excel', size: '850 KB' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-rose-500" />
            <span>Audit & Compliance Export Reports</span>
          </h1>
          <p className="text-xs text-slate-500">
            Export Certified Financial Audits, Member Directories & 80G Schedules
          </p>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">Ready to Download Audit Reports</h2>

        <div className="space-y-3">
          {reportsList.map((r, i) => (
            <div key={i} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {r.type === 'Excel' ? (
                  <FileSpreadsheet className="w-5 h-5 text-emerald-500" />
                ) : (
                  <FileText className="w-5 h-5 text-rose-500" />
                )}
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">{r.name}</h3>
                  <p className="text-[10px] text-slate-500">{r.type} Format • {r.size}</p>
                </div>
              </div>

              <button
                onClick={() => alert(`Downloaded ${r.name}`)}
                className="px-3 py-1.5 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
