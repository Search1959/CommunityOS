import React, { useState } from 'react';
import { 
  Globe, 
  HeartHandshake, 
  Droplet, 
  IndianRupee, 
  Search, 
  Phone, 
  CheckCircle2, 
  ShieldCheck, 
  Award, 
  Calendar,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Organization, Member, WelfareScheme, Donation } from '../types';

interface CitizenPortalModuleProps {
  activeOrg: Organization;
  members: Member[];
  schemes: WelfareScheme[];
  onNavigateModule: (key: string) => void;
}

export const CitizenPortalModule: React.FC<CitizenPortalModuleProps> = ({
  activeOrg,
  members,
  schemes,
  onNavigateModule,
}) => {
  const [bloodSearchGroup, setBloodSearchGroup] = useState('O+');
  const [bloodCity, setBloodCity] = useState('');

  const emergencyDonors = members.filter(
    (m) => m.bloodGroup === bloodSearchGroup
  );

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Citizen Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-rose-950 via-slate-900 to-amber-950 text-white p-8 sm:p-12 shadow-2xl">
        <div className="absolute right-0 top-0 -mt-16 -mr-16 w-80 h-80 rounded-full bg-rose-500/20 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-4 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-rose-500 text-white shadow-lg">
              Public Citizen Portal
            </span>
            <span className="text-xs text-amber-300 font-bold">● Live Public Services</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Direct Welfare & Emergency Citizen Services
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed">
            Welcome to the public portal for <strong className="text-white">{activeOrg.name}</strong>. Apply for educational scholarships, find emergency blood donors, or contribute to community welfare with instant 80G tax exemption.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => onNavigateModule('welfare')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs shadow-lg transition-all flex items-center gap-2"
            >
              <HeartHandshake className="w-4 h-4" />
              <span>Apply for Welfare Grant</span>
            </button>

            <button
              onClick={() => onNavigateModule('donations')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white font-bold text-xs shadow-lg transition-all flex items-center gap-2"
            >
              <IndianRupee className="w-4 h-4" />
              <span>Make 80G Tax Exempt Donation</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Service 1: Emergency Blood Donors Search */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400">
              <Droplet className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Emergency Blood Finder</h3>
              <p className="text-xs text-slate-500">Verified Member Donors</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Select Required Blood Group</label>
              <select
                value={bloodSearchGroup}
                onChange={(e) => setBloodSearchGroup(e.target.value)}
                className="w-full p-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
              >
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                  <option key={bg} value={bg}>{bg} Group</option>
                ))}
              </select>
            </div>

            <div className="space-y-2 pt-2">
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Found {emergencyDonors.length} Verified Donors:
              </p>
              {emergencyDonors.slice(0, 2).map((d) => (
                <div key={d.id} className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{d.name}</p>
                    <p className="text-[10px] text-slate-500">{d.address}</p>
                  </div>
                  <a
                    href={`tel:${d.phone}`}
                    className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[10px] flex items-center gap-1"
                  >
                    <Phone className="w-3 h-3" />
                    <span>Call</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Service 2: Available Welfare Grants */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Active Welfare Schemes</h3>
              <p className="text-xs text-slate-500">Public Applications Open</p>
            </div>
          </div>

          <div className="space-y-2">
            {schemes.map((s) => (
              <div key={s.id} className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">{s.name}</span>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    Active
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-1">{s.description}</p>
              </div>
            ))}
          </div>

          <button
            onClick={() => onNavigateModule('welfare')}
            className="w-full py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center justify-center gap-1.5"
          >
            <span>Open Welfare Application Portal</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Service 3: Public Pandal Pass & Gate QR */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Pandal Priority VIP Pass</h3>
                <p className="text-xs text-slate-500">Durga Puja & Cultural Events</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Generate a digital QR Entry Pass for senior citizens and family priority entry during peak Puja evenings.
            </p>
          </div>

          <button
            onClick={() => alert('VIP Pandal Pass QR code generated on your screen!')}
            className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow"
          >
            <span>Download Digital Gate Pass</span>
          </button>
        </div>

      </div>

    </div>
  );
};
