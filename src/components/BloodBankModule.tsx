import React, { useState } from 'react';
import { Droplet, Phone, Search, ShieldAlert, Heart, CheckCircle2 } from 'lucide-react';
import { Member, Organization } from '../types';

interface BloodBankProps {
  members: Member[];
  activeOrg: Organization;
}

export const BloodBankModule: React.FC<BloodBankProps> = ({ members, activeOrg }) => {
  const [selectedGroup, setSelectedGroup] = useState('O+');

  const donors = members.filter((m) => m.bloodGroup === selectedGroup);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Droplet className="w-5 h-5 text-rose-500" />
            <span>Emergency Blood Bank & Donor Network</span>
          </h1>
          <p className="text-xs text-slate-500">
            24x7 Emergency Blood Donor Dispatch & Hospital Helpline
          </p>
        </div>

        <button
          onClick={() => alert(`SOS Emergency Broadcast sent to all ${selectedGroup} donors in ${activeOrg.name}!`)}
          className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md flex items-center gap-1.5 animate-pulse"
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Send SOS Blood Request Broadcast</span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
          <button
            key={bg}
            onClick={() => setSelectedGroup(bg)}
            className={`p-3 rounded-xl font-black text-sm border transition-all ${
              selectedGroup === bg
                ? 'bg-rose-600 text-white border-rose-700 shadow-lg scale-105'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
            }`}
          >
            {bg}
          </button>
        ))}
      </div>

      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          Verified Donors for Group {selectedGroup} ({donors.length} Available)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {donors.map((d) => (
            <div key={d.id} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">{d.name}</h3>
                <p className="text-[10px] text-slate-500">{d.address}</p>
                <p className="text-[10px] text-emerald-600 font-bold mt-0.5">Last Donated: 3 Months Ago</p>
              </div>

              <a
                href={`tel:${d.phone}`}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center gap-1"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Donor</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
