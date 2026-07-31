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
  Server,
  UserCheck,
  KeyRound,
  Search,
  Pencil,
  Trash2,
  Lock,
  UserPlus,
  RefreshCw,
  Users,
  Eye
} from 'lucide-react';
import { Organization, UserCredential, UserRole } from '../types';
import { Pagination } from './Pagination';

interface SuperAdminModuleProps {
  organizations: Organization[];
  activeOrg: Organization;
  onSelectOrg: (org: Organization) => void;
  onCreateOrg: (newOrg: Organization) => void;
  onUpdateOrg?: (updatedOrg: Organization) => void;
  onDeleteOrg?: (orgId: string) => void;
  userCredentials: UserCredential[];
  onAddCredential?: (newCred: UserCredential) => void;
  onUpdateCredential?: (updatedCred: UserCredential) => void;
  onDeleteCredential?: (credId: string) => void;
}

export const SuperAdminModule: React.FC<SuperAdminModuleProps> = ({
  organizations,
  activeOrg,
  onSelectOrg,
  onCreateOrg,
  onUpdateOrg,
  onDeleteOrg,
  userCredentials,
  onAddCredential,
  onUpdateCredential,
  onDeleteCredential,
}) => {
  const [activeTab, setActiveTab] = useState<'tenants' | 'credentials'>('tenants');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCreateCredModal, setShowCreateCredModal] = useState(false);
  const [editingCred, setEditingCred] = useState<UserCredential | null>(null);

  // Tenant View & Edit Modals State
  const [viewingOrg, setViewingOrg] = useState<Organization | null>(null);
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null);

  // Search and Pagination for Credentials
  const [credSearch, setCredSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState(1);

  // Tenant Form State
  const [name, setName] = useState('');
  const [type, setType] = useState<Organization['type']>('Puja Committee');
  const [regNo, setRegNo] = useState('');
  const [domain, setDomain] = useState('');
  const [address, setAddress] = useState('');

  // New Credential Form State
  const [credName, setCredName] = useState('');
  const [credEmail, setCredEmail] = useState('');
  const [credUsername, setCredUsername] = useState('');
  const [credPassword, setCredPassword] = useState('');
  const [credRole, setCredRole] = useState<UserRole>('Committee Admin');
  const [credOrgId, setCredOrgId] = useState(organizations[0]?.id || 'org-1');
  const [credPhone, setCredPhone] = useState('');

  const filteredCredentials = userCredentials.filter((c) => {
    const matchesSearch = 
      c.name.toLowerCase().includes(credSearch.toLowerCase()) ||
      c.username.toLowerCase().includes(credSearch.toLowerCase()) ||
      c.email.toLowerCase().includes(credSearch.toLowerCase()) ||
      c.orgName.toLowerCase().includes(credSearch.toLowerCase());

    const matchesRole = roleFilter === 'ALL' || c.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const PAGE_SIZE = 15;
  const paginatedCredentials = filteredCredentials.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

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

  const handleCreateCredSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!credName || !credUsername || !credPassword) return;

    const selectedOrgObj = organizations.find(o => o.id === credOrgId);
    let level: 1 | 2 | 3 | 4 | 5 = 4;
    if (credRole === 'Super Admin') level = 1;
    else if (['Committee Admin', 'President', 'Secretary', 'School Admin'].includes(credRole)) level = 2;
    else if (['Treasurer', 'Executive Member', 'Teacher', 'Volunteer'].includes(credRole)) level = 3;
    else if (['Member', 'Parent', 'Student'].includes(credRole)) level = 4;
    else level = 5;

    const newCred: UserCredential = {
      id: `cred-${Date.now()}`,
      name: credName,
      email: credEmail || `${credUsername}@communityos.in`,
      username: credUsername.trim(),
      passwordHash: credPassword,
      role: credRole,
      orgId: credRole === 'Super Admin' ? 'all' : credOrgId,
      orgName: credRole === 'Super Admin' ? 'All System Tenants' : (selectedOrgObj?.name || 'Community Association'),
      status: 'Active',
      hierarchyLevel: level,
      createdAt: new Date().toISOString().split('T')[0],
      phone: credPhone || '+91 98000 00000',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
    };

    onAddCredential?.(newCred);
    setShowCreateCredModal(false);
    setCredName('');
    setCredEmail('');
    setCredUsername('');
    setCredPassword('');
    setCredPhone('');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-rose-500" />
            <span>Super Admin & System Credentials Control</span>
          </h1>
          <p className="text-xs text-slate-500">
            Multi-Tenant Provisioning, Master Login Credentials Authority & Hierarchy Permissions
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'tenants' ? (
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 text-white font-bold text-xs shadow-md flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Provision New Tenant</span>
            </button>
          ) : (
            <button
              onClick={() => setShowCreateCredModal(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs shadow-md flex items-center gap-1.5 shrink-0"
            >
              <UserPlus className="w-4 h-4" />
              <span>Create User Login Credential</span>
            </button>
          )}
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-4 text-xs font-bold">
        <button
          onClick={() => setActiveTab('tenants')}
          className={`pb-3 px-2 border-b-2 flex items-center gap-2 transition-all ${
            activeTab === 'tenants'
              ? 'border-rose-600 text-rose-600 dark:text-rose-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Tenant Organizations ({organizations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('credentials')}
          className={`pb-3 px-2 border-b-2 flex items-center gap-2 transition-all ${
            activeTab === 'credentials'
              ? 'border-rose-600 text-rose-600 dark:text-rose-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <KeyRound className="w-4 h-4 text-amber-500" />
          <span>System Login Credentials Manager ({userCredentials.length})</span>
        </button>
      </div>

      {/* TAB 1: TENANTS */}
      {activeTab === 'tenants' && (
        <div className="space-y-6">
          {/* Platform Level Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <p className="text-[10px] uppercase font-bold text-slate-400">Total Active Tenants</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{organizations.length} Orgs</p>
              <p className="text-[10px] text-emerald-600 font-bold mt-1">100% Database Isolated</p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <p className="text-[10px] uppercase font-bold text-slate-400">Registered System Logins</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{userCredentials.length} Accounts</p>
              <p className="text-[10px] text-slate-500 mt-1">Multi-Role Hierarchy</p>
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
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                          {org.type}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-mono">Reg: {org.regNo} • Domain: {org.websiteDomain}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      onClick={() => setViewingOrg(org)}
                      className="px-2.5 py-1.5 rounded-lg bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 text-[11px] font-bold flex items-center gap-1 hover:bg-blue-200 dark:hover:bg-blue-900 transition-colors"
                      title="View Full Tenant Profile"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </button>

                    <button
                      onClick={() => setEditingOrg({ ...org })}
                      className="px-2.5 py-1.5 rounded-lg bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 text-[11px] font-bold flex items-center gap-1 hover:bg-amber-200 dark:hover:bg-amber-900 transition-colors"
                      title="Edit Tenant Configuration"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => alert(`Initiated automated database backup snapshot for ${org.name}`)}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-bold flex items-center gap-1 hover:bg-slate-300 transition-colors"
                    >
                      <HardDriveDownload className="w-3.5 h-3.5" />
                      <span>Backup DB</span>
                    </button>

                    <button
                      onClick={() => onSelectOrg(org)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        activeOrg.id === org.id
                          ? 'bg-emerald-600 text-white'
                          : 'bg-rose-600 hover:bg-rose-700 text-white'
                      }`}
                    >
                      {activeOrg.id === org.id ? 'Active Tenant' : 'Switch Context'}
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete organization tenant "${org.name}"? This action cannot be undone.`)) {
                          onDeleteOrg?.(org.id);
                        }
                      }}
                      className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors"
                      title="Delete Organization Tenant"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SYSTEM LOGIN CREDENTIALS MANAGER */}
      {activeTab === 'credentials' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-bold flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-amber-400" />
                <span>System Administrator Master Credentials Directory</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                System Admin has supreme access to create login credentials, reset passwords, set hierarchy roles, and assign organization tenants.
              </p>
            </div>

            <button
              onClick={() => setShowCreateCredModal(true)}
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 shrink-0 transition-all"
            >
              <UserPlus className="w-4 h-4" />
              <span>Create New Login Credential</span>
            </button>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={credSearch}
                onChange={(e) => { setCredSearch(e.target.value); setCurrentPage(1); }}
                placeholder="Search by name, username, email, or organization..."
                className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:border-rose-500"
              />
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 font-medium">Filter Role:</span>
              <select
                value={roleFilter}
                onChange={(e) => { setRoleFilter(e.target.value); setCurrentPage(1); }}
                className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-medium outline-none"
              >
                <option value="ALL">All Roles</option>
                <option value="Super Admin">Level 1: Super Admin</option>
                <option value="Committee Admin">Level 2: Committee Admin</option>
                <option value="President">Level 2: President</option>
                <option value="Secretary">Level 2: Secretary</option>
                <option value="Treasurer">Level 3: Treasurer</option>
                <option value="Executive Member">Level 3: Executive Member</option>
                <option value="Member">Level 4: Registered Member</option>
                <option value="Public Citizen">Level 5: Public Citizen</option>
              </select>
            </div>
          </div>

          {/* Credentials Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider border-b border-slate-200 dark:border-slate-800 text-[10px]">
                  <tr>
                    <th className="p-3">User Account</th>
                    <th className="p-3">Username / Password</th>
                    <th className="p-3">Hierarchy Role</th>
                    <th className="p-3">Assigned Tenant Org</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                  {paginatedCredentials.map((cred) => (
                    <tr key={cred.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="p-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={cred.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                            alt={cred.name}
                            className="w-8 h-8 rounded-lg object-cover"
                          />
                          <div>
                            <span className="font-bold block text-slate-900 dark:text-white leading-snug">
                              {cred.name}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono block">
                              {cred.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="p-3 font-mono">
                        <span className="font-bold text-slate-900 dark:text-white block">{cred.username}</span>
                        <span className="text-[10px] text-amber-600 bg-amber-50 dark:bg-amber-950/80 px-1.5 py-0.5 rounded font-bold">
                          pass: {cred.passwordHash}
                        </span>
                      </td>

                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase inline-block ${
                          cred.hierarchyLevel === 1 ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300' :
                          cred.hierarchyLevel === 2 ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' :
                          cred.hierarchyLevel === 3 ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                          cred.hierarchyLevel === 4 ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' :
                          'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        }`}>
                          L{cred.hierarchyLevel}: {cred.role}
                        </span>
                      </td>

                      <td className="p-3">
                        <span className="text-xs font-semibold block text-slate-700 dark:text-slate-300">
                          {cred.orgName}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          Org ID: {cred.orgId}
                        </span>
                      </td>

                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                          cred.status === 'Active' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                          'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        }`}>
                          {cred.status}
                        </span>
                      </td>

                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setEditingCred(cred)}
                            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950 transition-colors"
                            title="Edit Credential & Password"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => {
                              const newStatus = cred.status === 'Active' ? 'Suspended' : 'Active';
                              onUpdateCredential?.({ ...cred, status: newStatus });
                            }}
                            className={`p-1.5 rounded-lg text-xs font-bold transition-colors ${
                              cred.status === 'Active'
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 hover:bg-amber-200'
                                : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                            }`}
                            title={cred.status === 'Active' ? 'Suspend Access' : 'Activate Access'}
                          >
                            <Lock className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete login credential for ${cred.name}?`)) {
                                onDeleteCredential?.(cred.id);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors"
                            title="Delete Login Credential"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-3 border-t border-slate-200 dark:border-slate-800">
              <Pagination
                currentPage={currentPage}
                totalItems={filteredCredentials.length}
                pageSize={PAGE_SIZE}
                onPageChange={(p) => setCurrentPage(p)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Provision Tenant Modal */}
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
                  className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium"
                  >
                    <option value="Puja Committee">Puja Committee</option>
                    <option value="Samaj / Community Association">Samaj / Community Association</option>
                    <option value="Religious Trust">Religious Trust</option>
                    <option value="School / Educational Trust">School / Educational Trust</option>
                    <option value="Sports & Cultural Club">Sports & Cultural Club</option>
                    <option value="Welfare NGO">Welfare NGO</option>
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
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium"
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
                  className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium"
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

      {/* System Admin: Create Login Credential Modal */}
      {showCreateCredModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setShowCreateCredModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-indigo-500" />
              <span>Create New System Login Credential</span>
            </h2>

            <form onSubmit={handleCreateCredSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-500 font-medium mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={credName}
                  onChange={(e) => setCredName(e.target.value)}
                  placeholder="e.g. Amitabha Ghosh"
                  className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Username *</label>
                  <input
                    type="text"
                    required
                    value={credUsername}
                    onChange={(e) => setCredUsername(e.target.value)}
                    placeholder="e.g. amitabha_ghosh"
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Password *</label>
                  <input
                    type="text"
                    required
                    value={credPassword}
                    onChange={(e) => setCredPassword(e.target.value)}
                    placeholder="e.g. pass123"
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 font-medium mb-1">Email Address</label>
                <input
                  type="email"
                  value={credEmail}
                  onChange={(e) => setCredEmail(e.target.value)}
                  placeholder="e.g. amitabha@durgapuja.org"
                  className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Hierarchy Role *</label>
                  <select
                    value={credRole}
                    onChange={(e) => setCredRole(e.target.value as UserRole)}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium"
                  >
                    <option value="Super Admin">Level 1: Super Admin</option>
                    <option value="Committee Admin">Level 2: Committee Admin</option>
                    <option value="President">Level 2: President</option>
                    <option value="Secretary">Level 2: Secretary</option>
                    <option value="Treasurer">Level 3: Treasurer</option>
                    <option value="Executive Member">Level 3: Executive Member</option>
                    <option value="Member">Level 4: Registered Member</option>
                    <option value="Public Citizen">Level 5: Public Citizen</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-500 font-medium mb-1">Assigned Tenant</label>
                  <select
                    value={credOrgId}
                    onChange={(e) => setCredOrgId(e.target.value)}
                    disabled={credRole === 'Super Admin'}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium disabled:opacity-50"
                  >
                    {organizations.map((org) => (
                      <option key={org.id} value={org.id}>
                        {org.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateCredModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all"
                >
                  Create Credential
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Credential Modal */}
      {editingCred && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setEditingCred(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Pencil className="w-4 h-4 text-amber-500" />
              <span>Edit Credential: {editingCred.username}</span>
            </h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                onUpdateCredential?.(editingCred);
                setEditingCred(null);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block text-slate-500 font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editingCred.name}
                  onChange={(e) => setEditingCred({ ...editingCred, name: e.target.value })}
                  className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Username</label>
                  <input
                    type="text"
                    required
                    value={editingCred.username}
                    onChange={(e) => setEditingCred({ ...editingCred, username: e.target.value })}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Password</label>
                  <input
                    type="text"
                    required
                    value={editingCred.passwordHash}
                    onChange={(e) => setEditingCred({ ...editingCred, passwordHash: e.target.value })}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 font-medium mb-1">Role</label>
                <select
                  value={editingCred.role}
                  onChange={(e) => setEditingCred({ ...editingCred, role: e.target.value as UserRole })}
                  className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium"
                >
                  <option value="Super Admin">Level 1: Super Admin</option>
                  <option value="Committee Admin">Level 2: Committee Admin</option>
                  <option value="President">Level 2: President</option>
                  <option value="Secretary">Level 2: Secretary</option>
                  <option value="Treasurer">Level 3: Treasurer</option>
                  <option value="Executive Member">Level 3: Executive Member</option>
                  <option value="Member">Level 4: Registered Member</option>
                  <option value="Public Citizen">Level 5: Public Citizen</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-500 font-medium mb-1">Status</label>
                <select
                  value={editingCred.status}
                  onChange={(e) => setEditingCred({ ...editingCred, status: e.target.value as any })}
                  className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium"
                >
                  <option value="Active">Active</option>
                  <option value="Suspended">Suspended</option>
                  <option value="Pending Reset">Pending Reset</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingCred(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold transition-all"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Tenant Details Modal */}
      {viewingOrg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-2xl relative">
            <button
              onClick={() => setViewingOrg(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header Banner */}
            <div className="flex items-start gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <img src={viewingOrg.logoUrl} alt={viewingOrg.name} className="w-16 h-16 rounded-2xl object-cover shadow-md border border-slate-200 dark:border-slate-700" />
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">{viewingOrg.name}</h2>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                    {viewingOrg.type}
                  </span>
                  {activeOrg.id === viewingOrg.id && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      Active Context
                    </span>
                  )}
                </div>
                <p className="text-xs text-rose-600 dark:text-rose-400 font-semibold mt-0.5">{viewingOrg.tagline}</p>
                <p className="text-xs text-slate-500 font-mono mt-1">Reg No: {viewingOrg.regNo} • Domain: {viewingOrg.websiteDomain}</p>
              </div>
            </div>

            {/* Key Metrics Overview */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                <p className="text-[10px] uppercase font-bold text-slate-400">Total YTD Corpus</p>
                <p className="text-base font-black text-emerald-600 dark:text-emerald-400 mt-0.5">₹{(viewingOrg.totalDonationsYTD || 0).toLocaleString('en-IN')}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                <p className="text-[10px] uppercase font-bold text-slate-400">Members Count</p>
                <p className="text-base font-black text-slate-900 dark:text-white mt-0.5">{viewingOrg.membersCount || 0}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                <p className="text-[10px] uppercase font-bold text-slate-400">Active Schemes</p>
                <p className="text-base font-black text-slate-900 dark:text-white mt-0.5">{viewingOrg.activeSchemesCount || 0}</p>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-800/50 space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Contact Email</p>
                <p className="font-semibold text-slate-800 dark:text-slate-200">{viewingOrg.email}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-800/50 space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Contact Phone</p>
                <p className="font-semibold text-slate-800 dark:text-slate-200">{viewingOrg.phone}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-800/50 space-y-1 sm:col-span-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Registered Office Address</p>
                <p className="font-semibold text-slate-800 dark:text-slate-200">{viewingOrg.address}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-800/50 space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase">PAN Number</p>
                <p className="font-mono font-semibold text-slate-800 dark:text-slate-200">{viewingOrg.pan || 'N/A'}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-800/50 space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase">GST Registration</p>
                <p className="font-mono font-semibold text-slate-800 dark:text-slate-200">{viewingOrg.gst || 'N/A'}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-800/50 space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase">80G Certificate URN</p>
                <p className="font-mono font-semibold text-slate-800 dark:text-slate-200">{viewingOrg.eightyG || 'N/A'}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-800/50 space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase">12A Certificate URN</p>
                <p className="font-mono font-semibold text-slate-800 dark:text-slate-200">{viewingOrg.twelveA || 'N/A'}</p>
              </div>
            </div>

            {/* Mission & History */}
            <div className="space-y-2 text-xs">
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-[11px] uppercase tracking-wider text-slate-400">Mission Statement</h4>
                <p className="text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl">{viewingOrg.mission || 'Dedicated to community welfare and advancement.'}</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-[11px] uppercase tracking-wider text-slate-400">Bylaws & Governance Summary</h4>
                <p className="text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl">{viewingOrg.constitutionSummary || viewingOrg.history || 'Governed by democratically elected Board under registered Bylaws.'}</p>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => {
                  const target = viewingOrg;
                  setViewingOrg(null);
                  setEditingOrg({ ...target });
                }}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold flex items-center gap-1.5"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>Edit This Tenant</span>
              </button>

              <div className="flex gap-2">
                {activeOrg.id !== viewingOrg.id && (
                  <button
                    type="button"
                    onClick={() => {
                      onSelectOrg(viewingOrg);
                      setViewingOrg(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold"
                  >
                    Switch Context
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setViewingOrg(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Tenant Modal */}
      {editingOrg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setEditingOrg(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Pencil className="w-4 h-4 text-amber-500" />
              <span>Edit Tenant Organization: {editingOrg.name}</span>
            </h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                onUpdateOrg?.(editingOrg);
                setEditingOrg(null);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block text-slate-500 font-medium mb-1">Organization Name *</label>
                <input
                  type="text"
                  required
                  value={editingOrg.name}
                  onChange={(e) => setEditingOrg({ ...editingOrg, name: e.target.value })}
                  className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Tenant Type *</label>
                  <select
                    value={editingOrg.type}
                    onChange={(e) => setEditingOrg({ ...editingOrg, type: e.target.value as any })}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium"
                  >
                    <option value="Puja Committee">Puja Committee</option>
                    <option value="Samaj / Community Association">Samaj / Community Association</option>
                    <option value="Religious Trust">Religious Trust</option>
                    <option value="School / Educational Trust">School / Educational Trust</option>
                    <option value="Sports & Cultural Club">Sports & Cultural Club</option>
                    <option value="Welfare NGO">Welfare NGO</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-500 font-medium mb-1">Registration No *</label>
                  <input
                    type="text"
                    required
                    value={editingOrg.regNo}
                    onChange={(e) => setEditingOrg({ ...editingOrg, regNo: e.target.value })}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Tagline</label>
                  <input
                    type="text"
                    value={editingOrg.tagline}
                    onChange={(e) => setEditingOrg({ ...editingOrg, tagline: e.target.value })}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 font-medium mb-1">Website Domain</label>
                  <input
                    type="text"
                    value={editingOrg.websiteDomain}
                    onChange={(e) => setEditingOrg({ ...editingOrg, websiteDomain: e.target.value })}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Email Address</label>
                  <input
                    type="email"
                    value={editingOrg.email}
                    onChange={(e) => setEditingOrg({ ...editingOrg, email: e.target.value })}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 font-medium mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={editingOrg.phone}
                    onChange={(e) => setEditingOrg({ ...editingOrg, phone: e.target.value })}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 font-medium mb-1">Address</label>
                <input
                  type="text"
                  value={editingOrg.address}
                  onChange={(e) => setEditingOrg({ ...editingOrg, address: e.target.value })}
                  className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-500 font-medium mb-1">PAN Number</label>
                  <input
                    type="text"
                    value={editingOrg.pan}
                    onChange={(e) => setEditingOrg({ ...editingOrg, pan: e.target.value })}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 font-medium mb-1">GST Number</label>
                  <input
                    type="text"
                    value={editingOrg.gst}
                    onChange={(e) => setEditingOrg({ ...editingOrg, gst: e.target.value })}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-500 font-medium mb-1">80G Certificate URN</label>
                  <input
                    type="text"
                    value={editingOrg.eightyG}
                    onChange={(e) => setEditingOrg({ ...editingOrg, eightyG: e.target.value })}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 font-medium mb-1">12A Certificate URN</label>
                  <input
                    type="text"
                    value={editingOrg.twelveA}
                    onChange={(e) => setEditingOrg({ ...editingOrg, twelveA: e.target.value })}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 font-medium mb-1">Mission Statement</label>
                <textarea
                  rows={2}
                  value={editingOrg.mission}
                  onChange={(e) => setEditingOrg({ ...editingOrg, mission: e.target.value })}
                  className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingOrg(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold transition-all"
                >
                  Save Tenant Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
