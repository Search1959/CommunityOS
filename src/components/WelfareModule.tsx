import React, { useState } from 'react';
import { 
  HeartHandshake, 
  GraduationCap, 
  Stethoscope, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  FileText, 
  Plus, 
  Users, 
  IndianRupee,
  X,
  Search
} from 'lucide-react';
import { WelfareScheme, SchemeApplication, Organization } from '../types';

interface WelfareModuleProps {
  schemes: WelfareScheme[];
  applications: SchemeApplication[];
  activeOrg: Organization;
  onApplyScheme: (newApp: SchemeApplication) => void;
  onApproveApp: (id: string) => void;
  onRejectApp: (id: string) => void;
}

export const WelfareModule: React.FC<WelfareModuleProps> = ({
  schemes,
  applications,
  activeOrg,
  onApplyScheme,
  onApproveApp,
  onRejectApp,
}) => {
  const [activeTab, setActiveTab] = useState<'schemes' | 'applications'>('schemes');
  const [selectedScheme, setSelectedScheme] = useState<WelfareScheme | null>(schemes[0] || null);
  const [showApplyModal, setShowApplyModal] = useState(false);

  // Application form
  const [applicantName, setApplicantName] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [amountRequested, setAmountRequested] = useState('');
  const [reason, setReason] = useState('');

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName || !applicantPhone || !selectedScheme) return;

    const newApp: SchemeApplication = {
      id: `app-${Date.now()}`,
      orgId: activeOrg.id,
      schemeId: selectedScheme.id,
      schemeName: selectedScheme.name,
      applicantName,
      applicantPhone,
      amountRequested: Number(amountRequested) || 25000,
      status: 'Pending Verification',
      appliedDate: new Date().toISOString().split('T')[0],
      reason: reason || 'Submitted via CommunityOS Welfare Portal.',
      documentsSubmitted: ['aadhaar_card.pdf', 'income_certificate.pdf']
    };

    onApplyScheme(newApp);
    setShowApplyModal(false);
    setApplicantName('');
    setApplicantPhone('');
    setAmountRequested('');
    setReason('');
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-emerald-500" />
            <span>Community Welfare Schemes</span>
          </h1>
          <p className="text-xs text-slate-500">
            Education Scholarships, Medical Aid, Marriage Grants & Senior Citizen Relief
          </p>
        </div>

        <div className="p-1 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center text-xs font-semibold">
          <button
            onClick={() => setActiveTab('schemes')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'schemes' ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 font-bold shadow-sm' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Active Schemes ({schemes.length})
          </button>
          <button
            onClick={() => setActiveTab('applications')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'applications' ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 font-bold shadow-sm' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Applications ({applications.length})
          </button>
        </div>
      </div>

      {/* Tab 1: Schemes Catalog & Details */}
      {activeTab === 'schemes' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Schemes List */}
          <div className="space-y-3">
            {schemes.map((s) => (
              <div
                key={s.id}
                onClick={() => setSelectedScheme(s)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  selectedScheme?.id === s.id
                    ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-400 dark:border-emerald-800 shadow-md'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                    {s.category}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-bold">
                    {s.beneficiariesCount} Beneficiaries
                  </span>
                </div>

                <h3 className="text-xs font-bold text-slate-900 dark:text-white mt-1">{s.name}</h3>
                
                <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Annual Budget</span>
                  <span className="font-bold text-slate-900 dark:text-white">₹{s.annualBudget.toLocaleString('en-IN')}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Scheme Details View */}
          {selectedScheme && (
            <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                    {selectedScheme.category}
                  </span>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-1">{selectedScheme.name}</h2>
                  <p className="text-xs text-slate-500 mt-1">{selectedScheme.description}</p>
                </div>

                <button
                  onClick={() => setShowApplyModal(true)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all self-start sm:self-center"
                >
                  Apply for Scheme Grant
                </button>
              </div>

              {/* Budget Progress */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                  <span>Disbursed Corpus: ₹{selectedScheme.disbursedAmount.toLocaleString('en-IN')}</span>
                  <span>Total Budget: ₹{selectedScheme.annualBudget.toLocaleString('en-IN')}</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-full rounded-full transition-all" 
                    style={{ width: `${Math.min(100, (selectedScheme.disbursedAmount / selectedScheme.annualBudget) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Eligibility Criteria */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Eligibility Criteria</h3>
                <div className="space-y-1.5">
                  {selectedScheme.eligibilityCriteria.map((c, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{c}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Required Documents */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Required Documents Checklist</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedScheme.requiredDocuments.map((doc, i) => (
                    <div key={i} className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span>{doc}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>
      )}

      {/* Tab 2: Applications Queue */}
      {activeTab === 'applications' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Welfare Assistance Applications</h2>

          <div className="space-y-3">
            {applications.map((app) => (
              <div key={app.id} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{app.applicantName}</span>
                    <span className="text-xs text-slate-500">({app.applicantPhone})</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      app.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                      app.status === 'Disbursed' ? 'bg-blue-100 text-blue-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {app.status}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-rose-600 dark:text-rose-400">{app.schemeName}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-300">{app.reason}</p>
                  <p className="text-[10px] text-slate-400">Submitted Docs: {app.documentsSubmitted.join(', ')}</p>
                </div>

                <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-2 shrink-0">
                  <div className="text-sm font-black text-slate-900 dark:text-white">
                    ₹{app.amountRequested.toLocaleString('en-IN')}
                  </div>

                  {app.status === 'Pending Verification' && (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onApproveApp(app.id)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[11px] font-bold"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => onRejectApp(app.id)}
                        className="px-2 py-1 rounded-lg bg-slate-200 text-slate-700 text-[11px] font-semibold"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Apply Modal */}
      {showApplyModal && selectedScheme && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setShowApplyModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Apply for {selectedScheme.name}
            </h2>

            <form onSubmit={handleApplySubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-500 font-medium mb-1">Applicant Name *</label>
                <input
                  type="text"
                  required
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-medium mb-1">Phone Number *</label>
                <input
                  type="text"
                  required
                  value={applicantPhone}
                  onChange={(e) => setApplicantPhone(e.target.value)}
                  placeholder="+91 98300 00000"
                  className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-medium mb-1">Requested Grant Amount (₹) *</label>
                <input
                  type="number"
                  required
                  value={amountRequested}
                  onChange={(e) => setAmountRequested(e.target.value)}
                  placeholder="e.g. 25000"
                  className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-medium mb-1">Reason & Background Details</label>
                <textarea
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Explain requirement, academic score, or medical emergency details..."
                  className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all mt-2"
              >
                Submit Application for Committee Verification
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
