import React, { useState } from 'react';
import { 
  Building2, 
  Sparkles, 
  Users, 
  Landmark, 
  GraduationCap, 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Search, 
  Filter, 
  ArrowRight, 
  Lock, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  ChevronRight,
  UserCheck,
  X,
  UserPlus
} from 'lucide-react';
import { Organization, UserCredential, UserRole } from '../types';

interface LandingHomePageProps {
  organizations: Organization[];
  userCredentials: UserCredential[];
  onLogin: (cred: UserCredential, targetOrg: Organization) => void;
  onAddCredential?: (newCred: UserCredential) => void;
}

export const LandingHomePage: React.FC<LandingHomePageProps> = ({
  organizations,
  userCredentials,
  onLogin,
  onAddCredential,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedOrgForLogin, setSelectedOrgForLogin] = useState<Organization | null>(null);

  // Form State inside login modal
  const [modalMode, setModalMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [regSuccessMsg, setRegSuccessMsg] = useState('');

  // Register Form State
  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('Committee Admin');

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
    setModalMode('login');
    setErrorMsg('');
    setRegSuccessMsg('');
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

    const trimmedUser = username.trim().toLowerCase();
    // Find credential matching username & password
    const foundCred = userCredentials.find(
      (c) =>
        (c.username.toLowerCase() === trimmedUser ||
         c.email.toLowerCase() === trimmedUser) &&
        c.passwordHash === password.trim()
    );

    if (!foundCred) {
      setErrorMsg('Invalid Username/Email or Password. Check credentials list below or create a new account.');
      return;
    }

    // Automatically resolve target organization (handles user created logins across organizations smoothly)
    const targetOrg =
      organizations.find((o) => o.id === foundCred.orgId) ||
      selectedOrgForLogin;

    // Success login
    onLogin(foundCred, targetOrg);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!selectedOrgForLogin) return;

    if (!regName.trim() || !regUsername.trim() || !regPassword.trim()) {
      setErrorMsg('Please provide Name, Username, and Password.');
      return;
    }

    const trimmedUser = regUsername.trim().toLowerCase();
    const existing = userCredentials.find((c) => c.username.toLowerCase() === trimmedUser);
    if (existing) {
      setErrorMsg(`Username '${regUsername}' already exists. Please choose a different username or log in.`);
      return;
    }

    let level: 1 | 2 | 3 | 4 | 5 = 4;
    if (regRole === 'Super Admin') level = 1;
    else if (['Committee Admin', 'President', 'Secretary', 'School Admin'].includes(regRole)) level = 2;
    else if (['Treasurer', 'Executive Member', 'Teacher', 'Volunteer'].includes(regRole)) level = 3;
    else if (['Member', 'Parent', 'Student'].includes(regRole)) level = 4;
    else level = 5;

    const newCred: UserCredential = {
      id: `cred-${Date.now()}`,
      name: regName.trim(),
      email: regEmail.trim() || `${trimmedUser}@communityos.in`,
      username: trimmedUser,
      passwordHash: regPassword.trim(),
      role: regRole,
      orgId: selectedOrgForLogin.id,
      orgName: selectedOrgForLogin.name,
      status: 'Active',
      hierarchyLevel: level,
      createdAt: new Date().toISOString().split('T')[0],
      phone: '+91 98000 00000',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
    };

    if (onAddCredential) {
      onAddCredential(newCred);
    }

    setRegSuccessMsg(`Account registered and saved to cloud database! Authenticating...`);
    setTimeout(() => {
      onLogin(newCred, selectedOrgForLogin);
    }, 600);
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
                <ShieldCheck className="w-5 h-5 text-rose-500" />
              </div>
            </div>
            <div>
              <h1 className="text-base font-black tracking-tight text-white flex items-center gap-2">
                <span>CommunityOS</span>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Cloud Database Live
                </span>
              </h1>
              <p className="text-[11px] text-slate-400 font-medium">
                Unified Portal for Puja Committees, Samaj Associations & Charitable Trusts
              </p>
            </div>
          </div>

          <button
            onClick={handleSystemAdminLogin}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-950/50 flex items-center gap-2 transition-all hover:scale-102 cursor-pointer"
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
          <div className="inline-flex items-center gap-2 text-xs font-medium text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Multi-Tenant Community Operating System • Connected to Cloud Database</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white max-w-3xl mx-auto leading-tight">
            Select Your Organization Portal to Access Dashboard & Services
          </h2>

          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Every registered Puja Committee, Samaj Association, and Charitable Trust operates in an isolated, secure data tenant. Choose your organization below to log in or create an authorized user credential.
          </p>

          {/* Search & Category Filter Bar */}
          <div className="max-w-2xl mx-auto pt-4 space-y-4">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-4 top-3.5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search organization by name (e.g. Arya Samaj, Ekdalia, Chalta Bagan, Jaiswal Samaj)..."
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
                    className={`px-3.5 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-rose-600 border-rose-500 text-white shadow-lg shadow-rose-950 font-bold'
                        : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
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

      {/* Organizations Directory Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-24 flex-1">
        <div className="flex items-center justify-between pb-6 border-b border-slate-800/80 mb-8">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>Registered Community Organizations</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-slate-800 text-slate-300">
                {filteredOrgs.length}
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Select your community to log in with role credentials and access verified records
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrgs.map((org) => {
            return (
              <div
                key={org.id}
                className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col group relative"
              >
                {/* Banner Header */}
                <div className="relative h-36 w-full overflow-hidden bg-slate-950">
                  <img
                    src={org.bannerUrl}
                    alt={org.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                  
                  {/* Category Badge */}
                  <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-slate-950/80 backdrop-blur-md text-white border border-white/10">
                    {org.type}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6 pt-0 flex-1 flex flex-col justify-between -mt-8 relative z-10">
                  <div>
                    {/* Logo & Headline */}
                    <div className="flex items-end gap-3.5 mb-3">
                      <img
                        src={org.logoUrl}
                        alt={org.name}
                        className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-900 shadow-xl bg-slate-950 shrink-0"
                      />
                      <div className="pb-1">
                        <span className="text-[10px] font-mono text-slate-400 block">
                          Reg No: {org.regNo}
                        </span>
                        <h4 className="text-base font-extrabold text-white leading-snug group-hover:text-rose-400 transition-colors">
                          {org.name}
                        </h4>
                      </div>
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                      {org.tagline || org.mission}
                    </p>

                    {/* Quick Meta */}
                    <div className="space-y-1.5 text-xs text-slate-300 border-t border-slate-800/80 pt-3">
                      <div className="flex items-center gap-2 text-slate-400">
                        <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span className="truncate">{org.address}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] pt-1 text-slate-400">
                        <span>Members: <strong className="text-white">{org.membersCount}</strong></span>
                        <span>YTD Donations: <strong className="text-emerald-400">₹{(org.totalDonationsYTD || 0).toLocaleString('en-IN')}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-5 mt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
                    <button
                      onClick={() => handleOpenLogin(org)}
                      className="w-full py-2.5 px-4 rounded-xl text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all hover:scale-102 cursor-pointer"
                      style={{ backgroundColor: org.themeColor || '#e11d48' }}
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Log In to {org.name.split(' ')[0]}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Organization Portal Login Modal */}
      {selectedOrgForLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
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

            {/* Sub-tabs */}
            <div className="flex border-b border-slate-800 text-xs font-bold gap-3 pt-1">
              <button
                type="button"
                onClick={() => { setModalMode('login'); setErrorMsg(''); }}
                className={`pb-2 transition-colors border-b-2 ${
                  modalMode === 'login'
                    ? 'border-rose-500 text-rose-400'
                    : 'border-transparent text-slate-500 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setModalMode('register'); setErrorMsg(''); }}
                className={`pb-2 transition-colors border-b-2 flex items-center gap-1 ${
                  modalMode === 'register'
                    ? 'border-rose-500 text-rose-400'
                    : 'border-transparent text-slate-500 hover:text-white'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Create / Register Login</span>
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-200 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {regSuccessMsg && (
              <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-200 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{regSuccessMsg}</span>
              </div>
            )}

            {modalMode === 'login' ? (
              <>
                {/* Login Form */}
                <form onSubmit={handleLoginSubmit} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Username or Email *</label>
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="e.g. arunarya, sysadmin, president_ekdalia"
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
                      placeholder="Enter account password..."
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono placeholder-slate-600 outline-none focus:border-rose-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl text-white font-extrabold text-xs shadow-lg flex items-center justify-center gap-2 transition-all mt-2 hover:opacity-95 cursor-pointer"
                    style={{ backgroundColor: selectedOrgForLogin.themeColor || '#dc2626' }}
                  >
                    <Lock className="w-4 h-4 text-white" />
                    <span>Authenticate & Open Portal</span>
                  </button>
                </form>

                {/* Quick Select Authorized Credentials for testing */}
                <div className="pt-2 border-t border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-amber-400 flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                      <span>Available Accounts for {selectedOrgForLogin.name}:</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setModalMode('register')}
                      className="text-indigo-400 hover:underline font-bold"
                    >
                      + Register New Login
                    </button>
                  </div>

                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {/* Always show Super Admin Option */}
                    <button
                      type="button"
                      onClick={() => handleQuickCredSelect(userCredentials.find((c) => c.role === 'Super Admin') || userCredentials[0])}
                      className="w-full p-2 rounded-xl bg-purple-950/50 border border-purple-800/80 hover:bg-purple-900/60 text-left flex items-center justify-between gap-2 transition-all cursor-pointer"
                    >
                      <div>
                        <span className="text-xs font-bold text-purple-200 block">System Master Administrator</span>
                        <span className="text-[10px] text-purple-400 font-mono">Username: sysadmin | Pass: admin123</span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-purple-800 text-purple-100 uppercase">
                        Level 1
                      </span>
                    </button>

                    {/* Show Org-Specific Credentials (including user-created accounts from cloud database) */}
                    {userCredentials
                      .filter((c) => c.orgId === selectedOrgForLogin.id || c.orgId === 'all')
                      .filter((c) => c.role !== 'Super Admin')
                      .map((cred) => (
                        <button
                          key={cred.id}
                          type="button"
                          onClick={() => handleQuickCredSelect(cred)}
                          className="w-full p-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-left flex items-center justify-between gap-2 transition-all cursor-pointer"
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
              </>
            ) : (
              /* Register Form */
              <form onSubmit={handleRegisterSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Arun Jaiswal"
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs outline-none focus:border-rose-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Username *</label>
                    <input
                      type="text"
                      required
                      value={regUsername}
                      onChange={(e) => setRegUsername(e.target.value)}
                      placeholder="e.g. arun2026"
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs outline-none focus:border-rose-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Password *</label>
                    <input
                      type="text"
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="e.g. arun123"
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs outline-none focus:border-rose-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Email</label>
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="e.g. arun@gmail.com"
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs outline-none focus:border-rose-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Hierarchy Role</label>
                    <select
                      value={regRole}
                      onChange={(e) => setRegRole(e.target.value as UserRole)}
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs outline-none focus:border-rose-500"
                    >
                      <option value="Committee Admin">Committee Admin</option>
                      <option value="President">President</option>
                      <option value="Secretary">Secretary</option>
                      <option value="Treasurer">Treasurer</option>
                      <option value="Member">Registered Member</option>
                      <option value="Public Citizen">Public Citizen</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-lg flex items-center justify-center gap-2 transition-all mt-2 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Register & Save to Cloud Database</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
