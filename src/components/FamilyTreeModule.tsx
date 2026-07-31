import React from 'react';
import { Network, Users, UserPlus, Search, ChevronRight } from 'lucide-react';
import { Organization, Member } from '../types';

interface FamilyTreeProps {
  activeOrg: Organization;
  members: Member[];
}

export const FamilyTreeModule: React.FC<FamilyTreeProps> = ({ activeOrg, members }) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Network className="w-5 h-5 text-amber-500" />
            <span>Community Lineage & Family Tree Register</span>
          </h1>
          <p className="text-xs text-slate-500">
            Ancestral Lineage Mapping, Gotra Records, Family Units & Matrimonial Directory
          </p>
        </div>

        <button
          onClick={() => alert('Initiated Family Tree Mapping Assistant')}
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md flex items-center gap-1.5"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Family Branch</span>
        </button>
      </div>

      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">Registered Family Clusters ({activeOrg.name})</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {members.map((m) => (
            <div key={m.id} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">{m.name} Family Unit</h3>
                  <p className="text-[10px] text-slate-500">Head of Family: {m.name} • Gotra: Kashyap / Bharadwaj</p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                  {m.familyMembersCount} Lineage Members
                </span>
              </div>

              <div className="p-3 bg-white dark:bg-slate-900 rounded-lg text-xs space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Tree Nodes Hierarchy:</p>
                <div className="pl-2 border-l-2 border-rose-500 space-y-1 text-slate-700 dark:text-slate-300">
                  <p>├── Father: Late Haridas {m.name.split(' ')[1] || 'Sen'}</p>
                  <p>├── Self: {m.name} ({m.occupation})</p>
                  <p>└── Children: 2 Dependents (Registered Students)</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
