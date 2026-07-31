import React from 'react';
import { Landmark, CheckCircle2, ArrowRight, ExternalLink } from 'lucide-react';
import { Organization } from '../types';

export const GovtSchemesModule: React.FC<{ activeOrg: Organization }> = ({ activeOrg }) => {
  const govtSchemes = [
    { title: 'Lakshmir Bhandar Scheme', dept: 'WCD West Bengal', desc: 'Financial assistance of ₹1,000-1,200/month for women head of households.', eligibility: 'Aadhaar & Swasthya Sathi Card' },
    { title: 'Kanyashree Prakalpa (K1 & K2)', dept: 'Education Dept', desc: 'Annual scholarship for unmarried girls aged 13-18 years.', eligibility: 'School Enrolment Certificate' },
    { title: 'Ayushman Bharat Pradhan Mantri Jan Arogya Yojana', dept: 'National Health Authority', desc: 'Health coverage up to ₹5 Lakhs per family per year.', eligibility: 'SECC Database / Ration Card' },
    { title: 'PM Vishwakarma Scheme', dept: 'Ministry of MSME', desc: 'Collateral-free credit & skill training for artisans & craftsmen.', eligibility: 'Traditional Artisan Certificate' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Landmark className="w-5 h-5 text-amber-500" />
            <span>Government Welfare Schemes Facilitation Centre</span>
          </h1>
          <p className="text-xs text-slate-500">
            Assisting Members & Citizens in Applying for Central & State Welfare Schemes
          </p>
        </div>

        <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
          Duare Sarkar & CSC Integration Ready
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {govtSchemes.map((gs, i) => (
          <div key={i} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                {gs.dept}
              </span>
              <ExternalLink className="w-4 h-4 text-slate-400" />
            </div>

            <h3 className="text-sm font-bold text-slate-900 dark:text-white">{gs.title}</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300">{gs.desc}</p>

            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-[11px] text-slate-600 dark:text-slate-300 space-y-1">
              <span className="font-bold text-slate-800 dark:text-slate-200">Required Eligibility:</span> {gs.eligibility}
            </div>

            <button
              onClick={() => alert(`Committee Help Desk application initialized for ${gs.title}`)}
              className="w-full py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold flex items-center justify-center gap-1.5"
            >
              <span>Apply via Committee Helpdesk</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
