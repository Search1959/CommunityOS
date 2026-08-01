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
      <div className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        {/* Top Banner Area */}
        <div className="h-44 sm:h-52 w-full relative bg-slate-900 overflow-hidden">
          <img 
            src={activeOrg.bannerUrl} 
            alt="" 
            className="w-full h-full object-cover opacity-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
          
          {/* Top badges floating over banner */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
            <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-rose-600 text-white shadow-md">
              {activeOrg.type}
            </span>
            <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-slate-950/80 text-slate-200 border border-white/10 backdrop-blur-sm">
              Reg: {activeOrg.regNo}
            </span>
          </div>
        </div>

        {/* Info & Logo Bar sitting over card background */}
        <div className="px-6 pb-6 relative flex flex-col md:flex-row md:items-end justify-between gap-4 -mt-12 sm:-mt-14 z-10">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-4 border-white dark:border-slate-900 bg-white dark:bg-slate-800 overflow-hidden shadow-2xl shrink-0">
              <img src={activeOrg.logoUrl} alt="Organization Logo" className="w-full h-full object-cover" />
            </div>
            <div className="space-y-1.5 pt-2 sm:pt-0">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                {activeOrg.name}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-400 font-medium">
                <span className="flex items-center gap-1.5 font-bold text-rose-600 dark:text-rose-400">
                  <Globe className="w-3.5 h-3.5" />
                  <span>{activeOrg.websiteDomain}</span>
                </span>
                <span>•</span>
                <span>{activeOrg.address}</span>
              </div>
            </div>
          </div>

          <a
            href={`https://${activeOrg.websiteDomain}`}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-black dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shrink-0"
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

            {officeBearers.length === 0 ? (
              <div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-center text-slate-500 text-xs">
                No office bearers recorded yet. Enrol executive members in the Membership Directory.
              </div>
            ) : (
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
            )}
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
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col items-center justify-center text-center space-y-2 shadow-inner">
                <div className="w-32 h-32 bg-white p-2 rounded-xl shadow-md flex flex-col items-center justify-center relative overflow-hidden">
                  {/* Decorative High-Res Vector QR Code representation */}
                  <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900 fill-current">
                    {/* Finder Patterns */}
                    <rect x="5" y="5" width="30" height="30" rx="4" />
                    <rect x="10" y="10" width="20" height="20" fill="white" rx="2" />
                    <rect x="15" y="15" width="10" height="10" rx="1" />

                    <rect x="65" y="5" width="30" height="30" rx="4" />
                    <rect x="70" y="10" width="20" height="20" fill="white" rx="2" />
                    <rect x="75" y="15" width="10" height="10" rx="1" />

                    <rect x="5" y="65" width="30" height="30" rx="4" />
                    <rect x="10" y="70" width="20" height="20" fill="white" rx="2" />
                    <rect x="15" y="75" width="10" height="10" rx="1" />

                    {/* QR Data Matrix Pixels */}
                    <rect x="42" y="8" width="6" height="6" />
                    <rect x="52" y="8" width="6" height="6" />
                    <rect x="42" y="18" width="6" height="6" />
                    <rect x="52" y="28" width="6" height="6" />
                    <rect x="8" y="42" width="6" height="6" />
                    <rect x="18" y="50" width="6" height="6" />
                    <rect x="28" y="42" width="6" height="6" />
                    <rect x="42" y="42" width="16" height="16" className="text-rose-600" />
                    <rect x="65" y="42" width="6" height="6" />
                    <rect x="75" y="50" width="6" height="6" />
                    <rect x="85" y="42" width="6" height="6" />
                    <rect x="42" y="65" width="6" height="6" />
                    <rect x="52" y="75" width="6" height="6" />
                    <rect x="65" y="65" width="6" height="6" />
                    <rect x="75" y="75" width="6" height="6" />
                    <rect x="85" y="65" width="6" height="6" />
                    <rect x="65" y="85" width="16" height="10" />
                    <rect x="42" y="85" width="6" height="10" />
                  </svg>
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> VERIFIED OFFICIAL SEAL
                  </p>
                  <p className="text-[9px] font-mono text-slate-400">
                    {activeOrg.slug ? activeOrg.slug.toUpperCase() : 'DEINRIM'}-SEAL-2026
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
