import React, { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  KeyRound, 
  Search, 
  ArrowRight, 
  CheckCircle2, 
  Users, 
  HeartHandshake, 
  IndianRupee, 
  Sparkles,
  Lock,
  UserCheck,
  Building,
  GraduationCap,
  Landmark,
  X,
  AlertCircle
} from 'lucide-react';
import { Organization, UserCredential } from '../types';

interface LandingHomePageProps {
  organizations: Organization[];
  userCredentials: UserCredential[];
  onLogin: (cred: UserCredential, targetOrg: Organization) => void;
}

export const LandingHomePage: React.FC<LandingHomePageProps> = ({
  organizations,
  userCredentials,
  onLogin,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedOrgForLogin, setSelectedOrgForLogin] = useState<Organization | null>(null);

  // Form State inside login modal
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Filter organizations based on search & category
  const filteredOrgs = organizations.filter((org) => {
    const matchesSearch = 
      org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.tagline.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = selectedType === 'ALL' || org.type.toLowerCase().includes(selectedType.toLowerCase());

    return matchesSearch && matchesType;
  });

  const handleOpenLogin = (org: Organization) => {
    setSelectedOrgForLogin(org);
    setErrorMsg('');
    setUsername('');
    setPassword('');
  };

  const handleQuickCredSelect = (cred: UserCredential) => {
    setUsername(cred.username);
    setPassword(cred.passwordHash);
    setErrorMsg('');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrgForLogin) return;

    // Find credential matching username & password
    const foundCred = userCredentials.find(
      (c) => c.username.toLowerCase() === username.trim().toLowerCase() && c.passwordHash === password.trim()
    );

    if (!foundCred) {
      setErrorMsg('Invalid Username or Password. Please check test credentials below.');
      return;
    }

    // Check if user belongs to this org or is Super Admin
    if (foundCred.role !== 'Super Admin' && foundCred.orgId !== selectedOrgForLogin.id) {
      setErrorMsg(`User '${foundCred.username}' belongs to '${foundCred.orgName}', not '${selectedOrgForLogin.name}'.`);
      return;
    }

    // Success login
    onLogin(foundCred, selectedOrgForLogin);
  };

  // Master System Admin Login Direct Action
  const handleSystemAdminLogin = () => {
    const sysAdminCred = userCredentials.find((c) => c.role === 'Super Admin') || userCredentials[0];
    onLogin(sysAdminCred, organizations[0]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col selection:bg-rose-500 selection:text-white">
      {/* Top Banner & Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 via-amber-500 to-indigo-600 p-0.5 shadow-lg shadow-rose-950/50">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Building2 className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <h1 className="text-base font-black tracking-tight text-white flex items-center gap-2">
                <span>CommunityOS</span>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  Multi-Tenant Cloud
                </span>
              </h1>
              <p className="text-[11px] text-slate-400 font-medium">
                Unified Portal for Puja Committees, Samaj Associations & Charitable Trusts
              </p>
            </div>
          </div>

          <button
            onClick={handleSystemAdminLogin}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-950/50 flex items-center gap-2 transition-all hover:scale-102"
          >
            <ShieldCheck className="w-4 h-4 text-amber-300" />
            <span className="hidden sm:inline">System Admin Control Center</span>
            <span className="sm:hidden">Super Admin</span>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950">
        {/* Background Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-rose-600/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[300px] bg-purple-600/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-extrabold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Secure Multi-Tenant Enterprise SaaS Network</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white max-w-3xl mx-auto leading-tight">
            Select Your Organization Portal to Access Dashboard & Services
          </h2>

          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Every registered Puja Committee and Samaj Association operates in an isolated, secure data tenant. Choose your organization below to log in with your authorized user credentials.
          </p>

          {/* Search & Category Filter Bar */}
          <div className="max-w-2xl mx-auto pt-4 space-y-4">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-4 top-3.5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search organization by name (e.g. Chalta Bagan, Ekdalia, Jaiswal Samaj)..."
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 text-sm font-medium outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 shadow-xl transition-all"
              />
            </div>

            {/* Category Filter Chips */}
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
              {[
                { label: 'All Organizations', value: 'ALL', icon: Building2 },
                { label: 'Puja Committees', value: 'Puja', icon: Sparkles },
                { label: 'Samaj / Community', value: 'Samaj', icon: Users },
                { label: 'Religious Trusts', value: 'Trust', icon: Landmark },
                { label: 'Schools & Education', value: 'School', icon: GraduationCap },
              ].map((chip) => {
                const Icon = chip.icon;
                const isSelected = selectedType === chip.value;
                return (
                  <button
                    key={chip.value}
                    onClick={() => setSelectedType(chip.value)}
                    className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
                      isSelected
                        ? 'bg-rose-600 text-white shadow-md shadow-rose-950/50 scale-105'
                        : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{chip.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Main Organizations Directory Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-20 flex-1 space-y-8">
        
        {/* Section Heading */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Building className="w-5 h-5 text-rose-500" />
            <span>Registered Community Organizations ({filteredOrgs.length})</span>
          </h3>
          <span className="text-xs text-slate-400">Select an organization below to log in</span>
        </div>

        {/* Organizations Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrgs.map((org) => {
            const orgCreds = userCredentials.filter((c) => c.orgId === org.id);

            return (
              <div
                key={org.id}
                className="group rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-rose-500/50 shadow-xl overflow-hidden flex flex-col justify-between transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-rose-950/20"
              >
                <div>
                  {/* Card Banner Header */}
                  <div className="h-32 relative overflow-hidden bg-slate-800">
                    <img
                      src={org.bannerUrl}
                      alt={org.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                    
                    {/* Organization Type Tag */}
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md border border-slate-700 text-rose-300 text-[10px] font-black uppercase tracking-wider">
                      {org.type}
                    </span>

                    {/* Logo Overlay */}
                    <div className="absolute bottom-3 left-4 flex items-center gap-3">
                      <img
                        src={org.logoUrl}
                        alt="Logo"
                        className="w-12 h-12 rounded-2xl object-cover border-2 border-slate-900 shadow-md bg-slate-950"
                      />
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 space-y-3">
                    <div>
                      <h4 className="text-base font-extrabold text-white leading-snug group-hover:text-rose-400 transition-colors">
                        {org.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 font-medium line-clamp-2 mt-1">
                        {org.tagline}
                      </p>
                    </div>

                    <div className="space-y-1 text-[11px] text-slate-400 font-mono bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                      <div className="flex justify-between">
                        <span>Registration No:</span>
                        <span className="text-slate-200 font-bold">{org.regNo}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Location:</span>
                        <span className="text-slate-300 truncate max-w-[180px]">{org.address.split(',')[1] || org.address}</span>
                      </div>
                    </div>

                    {/* Stats Pill */}
                    <div className="grid grid-cols-3 gap-2 text-center pt-1">
                      <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                        <p className="text-[9px] uppercase text-slate-500 font-bold">Members</p>
                        <p className="text-xs font-black text-white mt-0.5">{org.membersCount}</p>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                        <p className="text-[9px] uppercase text-slate-500 font-bold">Corpus</p>
                        <p className="text-xs font-black text-emerald-400 mt-0.5">₹{(org.totalDonationsYTD / 100000).toFixed(1)}L</p>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                        <p className="text-[9px] uppercase text-slate-500 font-bold">Schemes</p>
                        <p className="text-xs font-black text-amber-400 mt-0.5">{org.activeSchemesCount} Active</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="p-5 pt-0">
                  <button
                    onClick={() => handleOpenLogin(org)}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-extrabold text-xs shadow-lg shadow-rose-950/40 flex items-center justify-center gap-2 transition-all"
                  >
                    <KeyRound className="w-3.5 h-3.5 text-amber-200" />
                    <span>Select & Login to Portal</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <p className="text-[10px] text-slate-500 text-center mt-2 font-mono">
                    {orgCreds.length} Authorized Login Accounts
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Organization Portal Login Modal */}
      {selectedOrgForLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative">
            <button
              onClick={() => setSelectedOrgForLogin(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 pr-8">
              <img
                src={selectedOrgForLogin.logoUrl}
                alt={selectedOrgForLogin.name}
                className="w-12 h-12 rounded-2xl object-cover border border-slate-700 shrink-0"
              />
              <div>
                <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block">
                  Tenant Access Authorization
                </span>
                <h3 className="text-base font-extrabold text-white leading-tight">
                  {selectedOrgForLogin.name}
                </h3>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-200 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLoginSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Username *</label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. chalta_admin or sysadmin"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono placeholder-slate-600 outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Password *</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="e.g. chalta123 or admin123"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono placeholder-slate-600 outline-none focus:border-rose-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-extrabold text-xs shadow-lg shadow-rose-950/50 flex items-center justify-center gap-2 transition-all mt-2"
              >
                <Lock className="w-4 h-4 text-amber-200" />
                <span>Authenticate & Open Portal</span>
              </button>
            </form>

            {/* Quick Select Authorized Credentials for testing */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <p className="text-[11px] font-bold text-amber-400 flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Authorized Credentials for {selectedOrgForLogin.name}:</span>
              </p>

              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {/* Always show Super Admin Option */}
                <button
                  type="button"
                  onClick={() => handleQuickCredSelect(userCredentials.find((c) => c.role === 'Super Admin') || userCredentials[0])}
                  className="w-full p-2 rounded-xl bg-purple-950/50 border border-purple-800/80 hover:bg-purple-900/60 text-left flex items-center justify-between gap-2 transition-all"
                >
                  <div>
                    <span className="text-xs font-bold text-purple-200 block">System Master Administrator</span>
                    <span className="text-[10px] text-purple-400 font-mono">Username: sysadmin | Pass: admin123</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-purple-800 text-purple-100 uppercase">
                    Level 1
                  </span>
                </button>

                {/* Show Org-Specific Credentials */}
                {userCredentials
                  .filter((c) => c.orgId === selectedOrgForLogin.id || c.orgId === 'all')
                  .filter((c) => c.role !== 'Super Admin')
                  .map((cred) => (
                    <button
                      key={cred.id}
                      type="button"
                      onClick={() => handleQuickCredSelect(cred)}
                      className="w-full p-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-left flex items-center justify-between gap-2 transition-all"
                    >
                      <div>
                        <span className="text-xs font-bold text-slate-200 block">{cred.name} ({cred.role})</span>
                        <span className="text-[10px] text-amber-400 font-mono">Username: {cred.username} | Pass: {cred.passwordHash}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-slate-800 text-slate-300 uppercase">
                        Level {cred.hierarchyLevel}
                      </span>
                    </button>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
