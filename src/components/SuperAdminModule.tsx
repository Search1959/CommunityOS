import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Building2, 
  Plus, 
  Globe, 
  Database, 
  HardDriveDownload, 
  Activity, 
  TrendingUp, 
  IndianRupee, 
  CheckCircle2, 
  X,
  Server
} from 'lucide-react';
import { Organization } from '../types';

interface SuperAdminModuleProps {
  organizations: Organization[];
  activeOrg: Organization;
  onSelectOrg: (org: Organization) => void;
  onCreateOrg: (newOrg: Organization) => void;
}

export const SuperAdminModule: React.FC<SuperAdminModuleProps> = ({
  organizations,
  activeOrg,
  onSelectOrg,
  onCreateOrg,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [type, setType] = useState<Organization['type']>('Durga Puja Committee');
  const [regNo, setRegNo] = useState('');
  const [domain, setDomain] = useState('');
  const [address, setAddress] = useState('');

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !regNo) return;

    const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const newOrg: Organization = {
      id: `org-${Date.now()}`,
      name,
      slug,
      type,
      tagline: `Official Enterprise OS for ${name}`,
      logoUrl: 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&q=80&w=200',
      bannerUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=1200',
      regNo,
      pan: 'AAATB1234F',
      gst: '19AAATB1234F1Z5',
      eightyG: '80G-DELHI-2026-X',
      twelveA: '12A-DELHI-2026-Y',
      address: address || 'New Delhi, India',
      phone: '+91 98000 00000',
      email: `contact@${slug}.org`,
      websiteDomain: domain || `${slug}.deinrim.in`,
      mission: 'Dedicated to community welfare, heritage preservation, and empowerment.',
      history: 'Established as an enterprise organization managed via DEINRIM CommunityOS.',
      constitutionSummary: 'Governed by democratically elected Executive Officers under Bylaws 2026.',
      totalDonationsYTD: 500000,
      membersCount: 150,
      activeSchemesCount: 2,
      themeColor: '#e11d48'
    };

    onCreateOrg(newOrg);
    setShowCreateModal(false);
    setName('');
    setRegNo('');
    setDomain('');
    setAddress('');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-rose-500" />
            <span>Super Admin SaaS Control Panel</span>
          </h1>
          <p className="text-xs text-slate-500">
            Multi-Tenant Provisioning, Isolated Cloud Databases & Custom Domain Management
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 text-white font-bold text-xs shadow-md flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Provision New Organization Tenant</span>
        </button>
      </div>

      {/* Platform Level Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-[10px] uppercase font-bold text-slate-400">Total Active Tenants</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{organizations.length} Orgs</p>
          <p className="text-[10px] text-emerald-600 font-bold mt-1">100% Database Isolated</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-[10px] uppercase font-bold text-slate-400">Total Donors Across Platform</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">2,840 Members</p>
          <p className="text-[10px] text-slate-500 mt-1">Pan-India Verification</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-[10px] uppercase font-bold text-slate-400">Platform Annual Corpus</p>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">₹3.82 Crores</p>
          <p className="text-[10px] text-emerald-600 font-bold mt-1">+24% YoY Growth</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-[10px] uppercase font-bold text-slate-400">System Health & Uptime</p>
          <p className="text-2xl font-black text-emerald-500 mt-1">99.98%</p>
          <p className="text-[10px] text-slate-500 mt-1">Cloud Run Containerized</p>
        </div>

      </div>

      {/* Tenant Directory Table */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">Provisioned Organization Tenants</h2>

        <div className="space-y-3">
          {organizations.map((org) => (
            <div key={org.id} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img src={org.logoUrl} alt="Logo" className="w-10 h-10 rounded-xl object-cover shrink-0" />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white">{org.name}</h3>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-800">
                      {org.type}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-mono">Reg: {org.regNo} • Domain: {org.websiteDomain}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert(`Initiated automated database backup snapshot for ${org.name}`)}
                  className="px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-bold flex items-center gap-1"
                >
                  <HardDriveDownload className="w-3.5 h-3.5" />
                  <span>Backup DB</span>
                </button>

                <button
                  onClick={() => onSelectOrg(org)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    activeOrg.id === org.id
                      ? 'bg-emerald-600 text-white'
                      : 'bg-rose-600 hover:bg-rose-700 text-white'
                  }`}
                >
                  {activeOrg.id === org.id ? 'Active Tenant' : 'Switch Context'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Provision Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-base font-bold text-slate-900 dark:text-white">Provision New SaaS Tenant</h2>

            <form onSubmit={handleCreateSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-500 font-medium mb-1">Organization Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Kali Puja Welfare Committee"
                  className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  >
                    <option value="Durga Puja Committee">Durga Puja Committee</option>
                    <option value="Samaj / Community">Samaj / Community</option>
                    <option value="Religious Trust">Religious Trust</option>
                    <option value="School / Educational Trust">School / Educational Trust</option>
                    <option value="Club / NGO">Club / NGO</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-500 font-medium mb-1">Reg Number *</label>
                  <input
                    type="text"
                    required
                    value={regNo}
                    onChange={(e) => setRegNo(e.target.value)}
                    placeholder="S/123456/2026"
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 font-medium mb-1">Custom Domain Name</label>
                <input
                  type="text"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder="e.g. kalipuja.deinrim.in"
                  className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition-all mt-2"
              >
                Provision Isolated Database & Tenant
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
