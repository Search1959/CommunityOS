import React, { useState } from 'react';
import { Briefcase, Building2, Phone, Search, Plus, MapPin } from 'lucide-react';
import { Organization, Member } from '../types';

export const BusinessDirectoryModule: React.FC<{ activeOrg: Organization; members: Member[] }> = ({ activeOrg, members }) => {
  const [search, setSearch] = useState('');

  const businessMembers = members.filter((m) => m.businessName);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-500" />
            <span>Community Business Directory & Job Exchange</span>
          </h1>
          <p className="text-xs text-slate-500">
            Promote Member Businesses, B2B Networking & Youth Employment Placements
          </p>
        </div>

        <button
          onClick={() => alert('New Business Listing Form Opened!')}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Register Member Business</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {businessMembers.map((b) => (
          <div key={b.id} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-extrabold flex items-center justify-center text-sm">
                {b.businessName?.charAt(0)}
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">{b.businessName}</h3>
                <p className="text-[10px] text-slate-500">Owner: {b.name}</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300">{b.occupation} services provided to community members with exclusive member discounts.</p>

            <div className="pt-2 border-t flex justify-between items-center text-xs text-slate-500">
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-rose-500" /> {b.address}</span>
              <a href={`tel:${b.phone}`} className="font-bold text-indigo-600 flex items-center gap-1">
                <Phone className="w-3 h-3" /> Call
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
