import React from 'react';
import { 
  Building2, 
  FileText, 
  Award, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  ShieldCheck, 
  Users, 
  CheckCircle, 
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { Organization, CommitteeOfficeBearer } from '../types';

interface OrgProfileModuleProps {
  activeOrg: Organization;
  officeBearers: CommitteeOfficeBearer[];
}

export const OrgProfileModule: React.FC<OrgProfileModuleProps> = ({
  activeOrg,
  officeBearers,
}) => {
  return (
    <div className="space-y-6">
      
      {/* Banner & Header */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <div className="h-48 w-full relative overflow-hidden bg-slate-800">
          <img 
            src={activeOrg.bannerUrl} 
            alt={activeOrg.name} 
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        </div>

        <div className="p-6 relative -mt-16 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div className="flex items-end gap-4">
            <div className="w-24 h-24 rounded-2xl border-4 border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800 overflow-hidden shadow-xl shrink-0">
              <img src={activeOrg.logoUrl} alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div className="text-white">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-500 text-white">
                  {activeOrg.type}
                </span>
                <span className="text-xs text-slate-300 font-mono">Reg: {activeOrg.regNo}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {activeOrg.name}
              </h1>
              <p className="text-xs text-slate-300 flex items-center gap-1 mt-0.5">
                <Globe className="w-3.5 h-3.5 text-amber-400" />
                <span>{activeOrg.websiteDomain}</span>
              </p>
            </div>
          </div>

          <a
            href={`https://${activeOrg.websiteDomain}`}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-black dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md"
          >
            <span>Visit Public Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Statutory & Legal Compliance Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        
        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-emerald-500 shrink-0" />
          <div>
            <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">80G Tax Exemption</p>
            <p className="text-xs font-bold font-mono text-slate-800 dark:text-slate-200 truncate">{activeOrg.eightyG}</p>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <FileText className="w-6 h-6 text-blue-500 shrink-0" />
          <div>
            <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">PAN Number</p>
            <p className="text-xs font-bold font-mono text-slate-800 dark:text-slate-200">{activeOrg.pan}</p>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <Award className="w-6 h-6 text-amber-500 shrink-0" />
          <div>
            <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">GST Registration</p>
            <p className="text-xs font-bold font-mono text-slate-800 dark:text-slate-200 truncate">{activeOrg.gst}</p>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <CheckCircle className="w-6 h-6 text-rose-500 shrink-0" />
          <div>
            <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">12A Income Tax</p>
            <p className="text-xs font-bold font-mono text-slate-800 dark:text-slate-200 truncate">{activeOrg.twelveA}</p>
          </div>
        </div>

      </div>

      {/* Overview, History & Constitution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-rose-500" />
                <span>Mission & Heritage</span>
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-2">
                {activeOrg.mission}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">History & Establishment</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {activeOrg.history}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Constitution & Bylaws Summary</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {activeOrg.constitutionSummary}
              </p>
            </div>
          </div>

          {/* Office Bearers Grid */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-500" />
                <span>Elected Office Bearers ({activeOrg.name})</span>
              </h2>
              <span className="text-xs text-slate-400 font-semibold">Term: 2025 - 2027</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {officeBearers.map((ob) => (
                <div key={ob.id} className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center gap-3">
                  <img src={ob.photoUrl} alt={ob.name} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                  <div className="space-y-0.5 truncate">
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                      {ob.designation}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{ob.name}</h4>
                    <p className="text-[10px] text-slate-500">{ob.phone}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Contact & Location Info Sidebar */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Registered Headquarters</h3>

            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>{activeOrg.address}</span>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{activeOrg.phone}</span>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                <span>{activeOrg.email}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <p className="text-[11px] font-bold text-slate-400 mb-2">QR Code for Membership & Public Verification</p>
              <div className="p-3 bg-white rounded-xl border flex items-center justify-center">
                <div className="w-32 h-32 bg-slate-900 flex items-center justify-center text-white text-[10px] font-mono p-2 text-center rounded">
                  [QR: {activeOrg.slug.toUpperCase()}-SEAL-2026]
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
