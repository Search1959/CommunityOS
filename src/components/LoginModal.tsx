import React, { useState } from 'react';
import { 
  Lock, 
  UserCheck, 
  ShieldCheck, 
  Building2, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  X, 
  KeyRound, 
  Sparkles, 
  ShieldAlert,
  ArrowRight,
  User,
  Users,
  Globe,
  Coins
} from 'lucide-react';
import { UserCredential, Organization, UserRole } from '../types';

interface LoginModalProps {
  userCredentials: UserCredential[];
  currentCredential: UserCredential | null;
  organizations: Organization[];
  onSelectCredential: (cred: UserCredential) => void;
  onClose?: () => void;
  isOpen: boolean;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  userCredentials,
  currentCredential,
  organizations,
  onSelectCredential,
  onClose,
  isOpen
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'presets' | 'hierarchy'>('login');
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMsg('');

    const targetCred = userCredentials.find(
      (c) =>
        (c.username.toLowerCase() === usernameInput.trim().toLowerCase() ||
         c.email.toLowerCase() === usernameInput.trim().toLowerCase()) &&
        c.passwordHash === passwordInput
    );

    if (!targetCred) {
      setErrorMessage('Invalid username/email or password. Try sysadmin / admin123 or select a Quick Preset.');
      return;
    }

    if (targetCred.status === 'Suspended') {
      setErrorMessage('This user account has been suspended by System Admin.');
      return;
    }

    onSelectCredential(targetCred);
    setSuccessMsg(`Welcome back, ${targetCred.name}! Logged in as [Level ${targetCred.hierarchyLevel}: ${targetCred.role}]`);
    setTimeout(() => {
      if (onClose) onClose();
    }, 800);
  };

  const handleQuickPresetSelect = (cred: UserCredential) => {
    onSelectCredential(cred);
    setSuccessMsg(`Switched to ${cred.name} (${cred.role})`);
    setTimeout(() => {
      if (onClose) onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
        
        {/* Background Subtle Gradient */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center text-white font-black shadow-lg shadow-rose-500/30">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                CommunityOS Portal Login
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300">
                Hierarchy Secured
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Role-Based Multi-Tenant Authentication & System Admin Credentials Control
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 text-xs font-bold gap-2">
          <button
            onClick={() => setActiveTab('login')}
            className={`pb-3 px-3 transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'login'
                ? 'border-rose-600 text-rose-600 dark:text-rose-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Login Credentials</span>
          </button>

          <button
            onClick={() => setActiveTab('presets')}
            className={`pb-3 px-3 transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'presets'
                ? 'border-rose-600 text-rose-600 dark:text-rose-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Quick 1-Click Role Switcher ({userCredentials.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('hierarchy')}
            className={`pb-3 px-3 transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'hierarchy'
                ? 'border-rose-600 text-rose-600 dark:text-rose-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-indigo-500" />
            <span>Role Hierarchy Tree</span>
          </button>
        </div>

        {/* TAB 1: Explicit Login Form */}
        {activeTab === 'login' && (
          <form onSubmit={handleManualLogin} className="space-y-4">
            {errorMessage && (
              <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
                <span>{successMsg}</span>
              </div>
            )}

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Username or Email Address
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  required
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="e.g. sysadmin or president_ekdalia"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-rose-500 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Account Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter credential password..."
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-rose-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] pt-1">
              <span className="text-slate-500">
                System Admin default password: <code className="font-mono font-bold text-rose-600 bg-rose-50 dark:bg-rose-950 px-1 py-0.5 rounded">admin123</code>
              </span>
              <button
                type="button"
                onClick={() => alert('For password resets, contact your System Administrator (admin@communityos.in) or login as sysadmin.')}
                className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white font-extrabold text-xs shadow-lg shadow-rose-600/30 transition-all flex items-center justify-center gap-2"
            >
              <span>Authenticate & Enter System</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* TAB 2: Quick 1-Click Role Presets */}
        {activeTab === 'presets' && (
          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
            <p className="text-xs text-slate-500">
              Click any credential below to instantly authenticate into that hierarchy role level:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {userCredentials.map((cred) => {
                const isCurrent = currentCredential?.id === cred.id;
                return (
                  <div
                    key={cred.id}
                    onClick={() => handleQuickPresetSelect(cred)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                      isCurrent
                        ? 'bg-rose-50/90 dark:bg-rose-950/50 border-rose-500 shadow-md ring-2 ring-rose-500/30'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-rose-400'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider ${
                          cred.hierarchyLevel === 1 ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300' :
                          cred.hierarchyLevel === 2 ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' :
                          cred.hierarchyLevel === 3 ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                          cred.hierarchyLevel === 4 ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' :
                          'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        }`}>
                          Level {cred.hierarchyLevel}: {cred.role}
                        </span>

                        {isCurrent && (
                          <span className="text-[10px] font-bold text-rose-600 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Active
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2.5">
                        <img
                          src={cred.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                          alt={cred.name}
                          className="w-9 h-9 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                        />
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                            {cred.name}
                          </h4>
                          <p className="text-[10px] font-mono text-slate-400 mt-0.5">
                            {cred.username} • pass: {cred.passwordHash}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex justify-between items-center text-[10px] text-slate-500">
                      <span className="truncate max-w-[170px]">{cred.orgName}</span>
                      <span className="font-bold text-rose-600 dark:text-rose-400 flex items-center gap-0.5">
                        Login <ArrowRight className="w-2.5 h-2.5" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: Role Hierarchy Explanation */}
        {activeTab === 'hierarchy' && (
          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1 text-xs">
            <div className="p-3 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900 text-indigo-900 dark:text-indigo-200 font-medium">
              <p className="font-bold text-xs mb-1">🛡️ System Security & Role Hierarchy Specification</p>
              <p className="text-[11px] leading-relaxed">
                CommunityOS enforces strict tenant isolation and role permission levels. System Admins maintain master control to provision logins, while Organization Officers manage localized community records.
              </p>
            </div>

            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900 flex items-start gap-3">
                <div className="px-2 py-1 rounded bg-purple-600 text-white font-extrabold text-[10px]">Level 1</div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs">System Admin / Super Admin (Master Control)</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Provisions new organization tenants, manages ALL user login credentials across organizations, resets passwords, views global audit logs, and configures custom domains.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 flex items-start gap-3">
                <div className="px-2 py-1 rounded bg-rose-600 text-white font-extrabold text-[10px]">Level 2</div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs">Organization Admin (President / Secretary)</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Controls organization profile, executive committee office bearers, AGM meetings, welfare scheme approvals, and member directory.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 flex items-start gap-3">
                <div className="px-2 py-1 rounded bg-amber-600 text-white font-extrabold text-[10px]">Level 3</div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs">Operational Executive (Treasurer / Exec Member)</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Manages 80G donation receipts, cash book payment vouchers, event volunteer rosters, and AI OCR document vault extractions.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 flex items-start gap-3">
                <div className="px-2 py-1 rounded bg-blue-600 text-white font-extrabold text-[10px]">Level 4</div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs">Registered Member / Parent / Teacher</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Accesses digital membership card with QR code, pays annual fees, applies for welfare schemes, views family tree & blood bank directory.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 flex items-start gap-3">
                <div className="px-2 py-1 rounded bg-emerald-600 text-white font-extrabold text-[10px]">Level 5</div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs">Public Citizen / Guest Visitor</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Submits public welfare requests, makes online 80G donations, views festival schedules, and searches government schemes directory.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
