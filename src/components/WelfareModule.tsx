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
  Search,
  Eye,
  Pencil,
  Trash2,
  Check,
  ShieldCheck
} from 'lucide-react';
import { WelfareScheme, SchemeApplication, Organization } from '../types';

interface WelfareModuleProps {
  schemes: WelfareScheme[];
  applications: SchemeApplication[];
  activeOrg: Organization;
  onApplyScheme: (newApp: SchemeApplication) => void;
  onUpdateApplication?: (updatedApp: SchemeApplication) => void;
  onDeleteApplication?: (id: string) => void;
  onApproveApp: (id: string) => void;
  onRejectApp: (id: string) => void;
  onAddScheme?: (newScheme: WelfareScheme) => void;
  onUpdateScheme?: (updatedScheme: WelfareScheme) => void;
  onDeleteScheme?: (id: string) => void;
}

export const WelfareModule: React.FC<WelfareModuleProps> = ({
  schemes,
  applications,
  activeOrg,
  onApplyScheme,
  onUpdateApplication,
  onDeleteApplication,
  onApproveApp,
  onRejectApp,
  onAddScheme,
  onUpdateScheme,
  onDeleteScheme,
}) => {
  const [activeTab, setActiveTab] = useState<'schemes' | 'applications'>('schemes');
  const [selectedScheme, setSelectedScheme] = useState<WelfareScheme | null>(schemes[0] || null);

  // Modals state
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showAddSchemeModal, setShowAddSchemeModal] = useState(false);
  const [showAddAppModal, setShowAddAppModal] = useState(false);
  
  const [viewingScheme, setViewingScheme] = useState<WelfareScheme | null>(null);
  const [editingScheme, setEditingScheme] = useState<WelfareScheme | null>(null);

  const [viewingApp, setViewingApp] = useState<SchemeApplication | null>(null);
  const [editingApp, setEditingApp] = useState<SchemeApplication | null>(null);

  // Application creation form state (for Apply & Add Application)
  const [applicantName, setApplicantName] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [selectedSchemeId, setSelectedSchemeId] = useState<string>('');
  const [amountRequested, setAmountRequested] = useState('');
  const [reason, setReason] = useState('');

  // Scheme Form State (for Add Scheme)
  const [newSchemeForm, setNewSchemeForm] = useState({
    name: '',
    category: 'Education Scholarship' as WelfareScheme['category'],
    description: '',
    eligibilityCriteria: '',
    requiredDocuments: '',
    annualBudget: '1000000',
    disbursedAmount: '0',
    beneficiariesCount: '0',
    status: 'Active' as WelfareScheme['status']
  });

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const scheme = selectedScheme || schemes.find(s => s.id === selectedSchemeId) || schemes[0];
    if (!applicantName || !applicantPhone || !scheme) return;

    const newApp: SchemeApplication = {
      id: `app-${Date.now()}`,
      orgId: activeOrg.id,
      schemeId: scheme.id,
      schemeName: scheme.name,
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
    setShowAddAppModal(false);
    setApplicantName('');
    setApplicantPhone('');
    setAmountRequested('');
    setReason('');
  };

  const handleAddSchemeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSchemeForm.name || !newSchemeForm.category) return;

    const created: WelfareScheme = {
      id: `scheme-${Date.now()}`,
      orgId: activeOrg.id,
      name: newSchemeForm.name,
      category: newSchemeForm.category,
      description: newSchemeForm.description || 'Community welfare grant initiative.',
      eligibilityCriteria: newSchemeForm.eligibilityCriteria
        ? newSchemeForm.eligibilityCriteria.split('\n').filter(Boolean)
        : ['Community Resident / Member', 'Verification by Sub-Committee'],
      requiredDocuments: newSchemeForm.requiredDocuments
        ? newSchemeForm.requiredDocuments.split('\n').filter(Boolean)
        : ['Aadhaar Card', 'Income Proof / Bank Statement'],
      annualBudget: Number(newSchemeForm.annualBudget) || 500000,
      disbursedAmount: Number(newSchemeForm.disbursedAmount) || 0,
      beneficiariesCount: Number(newSchemeForm.beneficiariesCount) || 0,
      status: newSchemeForm.status
    };

    if (onAddScheme) onAddScheme(created);
    setSelectedScheme(created);
    setShowAddSchemeModal(false);
    setNewSchemeForm({
      name: '',
      category: 'Education Scholarship',
      description: '',
      eligibilityCriteria: '',
      requiredDocuments: '',
      annualBudget: '1000000',
      disbursedAmount: '0',
      beneficiariesCount: '0',
      status: 'Active'
    });
  };

  const handleEditSchemeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingScheme) return;
    if (onUpdateScheme) onUpdateScheme(editingScheme);
    if (selectedScheme?.id === editingScheme.id) setSelectedScheme(editingScheme);
    setEditingScheme(null);
  };

  const handleDeleteSchemeAction = (schemeId: string) => {
    if (window.confirm('Are you sure you want to delete this welfare scheme?')) {
      if (onDeleteScheme) onDeleteScheme(schemeId);
      if (selectedScheme?.id === schemeId) {
        const remaining = schemes.filter(s => s.id !== schemeId);
        setSelectedScheme(remaining[0] || null);
      }
    }
  };

  const handleEditAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingApp) return;
    if (onUpdateApplication) onUpdateApplication(editingApp);
    setEditingApp(null);
  };

  const handleDeleteAppAction = (appId: string) => {
    if (window.confirm('Are you sure you want to delete this welfare application?')) {
      if (onDeleteApplication) onDeleteApplication(appId);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-emerald-500" />
            <span>Community Welfare Schemes</span>
          </h1>
          <p className="text-xs text-slate-500">
            Education Scholarships, Medical Aid, Marriage Grants & Senior Citizen Relief
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Sub-menu Tabs */}
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

          {/* Action Button based on Active Sub-Menu */}
          {activeTab === 'schemes' ? (
            <button
              onClick={() => setShowAddSchemeModal(true)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Scheme</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setSelectedSchemeId(schemes[0]?.id || '');
                setShowAddAppModal(true);
              }}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Application</span>
            </button>
          )}
        </div>
      </div>

      {/* Sub-Menu 1: Schemes Catalog & Details */}
      {activeTab === 'schemes' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Schemes List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 px-1">
              <span>Welfare Schemes List</span>
              <button
                onClick={() => setShowAddSchemeModal(true)}
                className="text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-bold text-[11px]"
              >
                <Plus className="w-3 h-3" /> Add Scheme
              </button>
            </div>

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
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setViewingScheme(s);
                      }}
                      className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                      title="View Scheme Details"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingScheme(s);
                      }}
                      className="p-1 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 transition-colors"
                      title="Edit Scheme"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSchemeAction(s.id);
                      }}
                      className="p-1 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 transition-colors"
                      title="Delete Scheme"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="text-xs font-bold text-slate-900 dark:text-white mt-1">{s.name}</h3>
                
                <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">{s.beneficiariesCount} Beneficiaries</span>
                  <span className="font-bold text-slate-900 dark:text-white">₹{s.annualBudget.toLocaleString('en-IN')}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Scheme Details View Panel */}
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

                <div className="flex items-center gap-2 self-start sm:self-center">
                  <button
                    onClick={() => {
                      setEditingScheme(selectedScheme);
                    }}
                    className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => handleDeleteSchemeAction(selectedScheme.id)}
                    className="px-3 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 text-rose-600 dark:text-rose-400 font-bold text-xs transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>

                  <button
                    onClick={() => setShowApplyModal(true)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
                  >
                    Apply for Grant
                  </button>
                </div>
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
                    style={{ width: `${Math.min(100, (selectedScheme.disbursedAmount / (selectedScheme.annualBudget || 1)) * 100)}%` }}
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

      {/* Sub-Menu 2: Applications Queue */}
      {activeTab === 'applications' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Welfare Assistance Applications</h2>
              <p className="text-xs text-slate-500">Review, approve, edit or process grant disbursements</p>
            </div>
            <button
              onClick={() => {
                setSelectedSchemeId(schemes[0]?.id || '');
                setShowAddAppModal(true);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Application</span>
            </button>
          </div>

          <div className="space-y-3">
            {applications.map((app) => (
              <div key={app.id} className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-300 transition-all">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{app.applicantName}</span>
                    <span className="text-xs text-slate-500">({app.applicantPhone})</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      app.status === 'Approved' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                      app.status === 'Disbursed' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' :
                      app.status === 'Rejected' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' :
                      'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
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

                  <div className="flex items-center gap-1.5">
                    {/* View Action */}
                    <button
                      onClick={() => setViewingApp(app)}
                      className="px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-100 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                      title="View Application Details"
                    >
                      <Eye className="w-3 h-3" />
                      <span>View</span>
                    </button>

                    {/* Edit Action */}
                    <button
                      onClick={() => setEditingApp(app)}
                      className="px-2.5 py-1 rounded-lg bg-blue-100 dark:bg-blue-950/80 hover:bg-blue-200 text-blue-800 dark:text-blue-300 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                      title="Edit Application"
                    >
                      <Pencil className="w-3 h-3" />
                      <span>Edit</span>
                    </button>

                    {/* Delete Action */}
                    <button
                      onClick={() => handleDeleteAppAction(app.id)}
                      className="px-2.5 py-1 rounded-lg bg-rose-100 dark:bg-rose-950/80 hover:bg-rose-200 text-rose-800 dark:text-rose-300 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                      title="Delete Application"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Delete</span>
                    </button>

                    {/* Approve / Reject Actions for Pending Verification */}
                    {(app.status === 'Pending Verification' || app.status === 'Under Review') && (
                      <>
                        <button
                          onClick={() => onApproveApp(app.id)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold cursor-pointer"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => onRejectApp(app.id)}
                          className="px-2.5 py-1 rounded-lg bg-slate-400 hover:bg-slate-500 text-white text-[11px] font-semibold cursor-pointer"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL 1: Add New Scheme */}
      {showAddSchemeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowAddSchemeModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-emerald-500" />
              <span>Add New Welfare Scheme</span>
            </h2>

            <form onSubmit={handleAddSchemeSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-500 font-medium mb-1">Scheme Name *</label>
                <input
                  type="text"
                  required
                  value={newSchemeForm.name}
                  onChange={(e) => setNewSchemeForm({ ...newSchemeForm, name: e.target.value })}
                  placeholder="e.g. Higher Education Merit Scholarship"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Category *</label>
                  <select
                    value={newSchemeForm.category}
                    onChange={(e) => setNewSchemeForm({ ...newSchemeForm, category: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                  >
                    <option value="Education Scholarship">Education Scholarship</option>
                    <option value="Medical Assistance">Medical Assistance</option>
                    <option value="Marriage Assistance">Marriage Assistance</option>
                    <option value="Funeral Assistance">Funeral Assistance</option>
                    <option value="Senior Citizen">Senior Citizen</option>
                    <option value="Emergency Relief">Emergency Relief</option>
                    <option value="Women Welfare">Women Welfare</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-500 font-medium mb-1">Annual Budget (₹) *</label>
                  <input
                    type="number"
                    required
                    value={newSchemeForm.annualBudget}
                    onChange={(e) => setNewSchemeForm({ ...newSchemeForm, annualBudget: e.target.value })}
                    placeholder="1000000"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 font-medium mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newSchemeForm.description}
                  onChange={(e) => setNewSchemeForm({ ...newSchemeForm, description: e.target.value })}
                  placeholder="Summary of grant, purpose, and financial scope..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-medium mb-1">Eligibility Criteria (1 per line)</label>
                <textarea
                  rows={3}
                  value={newSchemeForm.eligibilityCriteria}
                  onChange={(e) => setNewSchemeForm({ ...newSchemeForm, eligibilityCriteria: e.target.value })}
                  placeholder="Min 80% marks&#10;Family income below 3.5L&#10;Resident member"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-medium mb-1">Required Documents (1 per line)</label>
                <textarea
                  rows={2}
                  value={newSchemeForm.requiredDocuments}
                  onChange={(e) => setNewSchemeForm({ ...newSchemeForm, requiredDocuments: e.target.value })}
                  placeholder="Aadhaar Card&#10;Income Certificate&#10;Fee Receipt"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all mt-2 cursor-pointer shadow-md"
              >
                Create Welfare Scheme
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Edit Scheme */}
      {editingScheme && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setEditingScheme(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Pencil className="w-5 h-5 text-blue-500" />
              <span>Edit Welfare Scheme</span>
            </h2>

            <form onSubmit={handleEditSchemeSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-500 font-medium mb-1">Scheme Name *</label>
                <input
                  type="text"
                  required
                  value={editingScheme.name}
                  onChange={(e) => setEditingScheme({ ...editingScheme, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Category *</label>
                  <select
                    value={editingScheme.category}
                    onChange={(e) => setEditingScheme({ ...editingScheme, category: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                  >
                    <option value="Education Scholarship">Education Scholarship</option>
                    <option value="Medical Assistance">Medical Assistance</option>
                    <option value="Marriage Assistance">Marriage Assistance</option>
                    <option value="Funeral Assistance">Funeral Assistance</option>
                    <option value="Senior Citizen">Senior Citizen</option>
                    <option value="Emergency Relief">Emergency Relief</option>
                    <option value="Women Welfare">Women Welfare</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-500 font-medium mb-1">Status</label>
                  <select
                    value={editingScheme.status}
                    onChange={(e) => setEditingScheme({ ...editingScheme, status: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                  >
                    <option value="Active">Active</option>
                    <option value="Paused">Paused</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Annual Budget (₹)</label>
                  <input
                    type="number"
                    value={editingScheme.annualBudget}
                    onChange={(e) => setEditingScheme({ ...editingScheme, annualBudget: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 font-medium mb-1">Disbursed Amount (₹)</label>
                  <input
                    type="number"
                    value={editingScheme.disbursedAmount}
                    onChange={(e) => setEditingScheme({ ...editingScheme, disbursedAmount: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 font-medium mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingScheme.description}
                  onChange={(e) => setEditingScheme({ ...editingScheme, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-medium mb-1">Eligibility Criteria (1 per line)</label>
                <textarea
                  rows={3}
                  value={editingScheme.eligibilityCriteria.join('\n')}
                  onChange={(e) => setEditingScheme({ ...editingScheme, eligibilityCriteria: e.target.value.split('\n') })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-medium mb-1">Required Documents (1 per line)</label>
                <textarea
                  rows={2}
                  value={editingScheme.requiredDocuments.join('\n')}
                  onChange={(e) => setEditingScheme({ ...editingScheme, requiredDocuments: e.target.value.split('\n') })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingScheme(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: View Scheme Overview */}
      {viewingScheme && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setViewingScheme(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                {viewingScheme.category}
              </span>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-1">{viewingScheme.name}</h2>
              <p className="text-xs text-slate-500 mt-1">{viewingScheme.description}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                <span>Disbursed: ₹{viewingScheme.disbursedAmount.toLocaleString('en-IN')}</span>
                <span>Annual Budget: ₹{viewingScheme.annualBudget.toLocaleString('en-IN')}</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full rounded-full" 
                  style={{ width: `${Math.min(100, (viewingScheme.disbursedAmount / (viewingScheme.annualBudget || 1)) * 100)}%` }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Eligibility Criteria</h3>
              <div className="space-y-1">
                {viewingScheme.eligibilityCriteria.map((c, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{c}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Required Documents Checklist</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {viewingScheme.requiredDocuments.map((doc, i) => (
                  <div key={i} className="p-2 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 text-xs text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span>{doc}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setSelectedScheme(viewingScheme);
                  setViewingScheme(null);
                  setShowApplyModal(true);
                }}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md"
              >
                Apply for Grant Under This Scheme
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: Add New Application */}
      {(showApplyModal || showAddAppModal) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => {
                setShowApplyModal(false);
                setShowAddAppModal(false);
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {showAddAppModal ? 'Add New Welfare Application' : `Apply for ${selectedScheme?.name}`}
            </h2>

            <form onSubmit={handleApplySubmit} className="space-y-3 text-xs">
              {showAddAppModal && (
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Select Welfare Scheme *</label>
                  <select
                    value={selectedSchemeId}
                    onChange={(e) => setSelectedSchemeId(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                  >
                    {schemes.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.category})</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-slate-500 font-medium mb-1">Applicant Name *</label>
                <input
                  type="text"
                  required
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
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
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
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
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-medium mb-1">Reason & Background Details</label>
                <textarea
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Explain requirement, academic score, or medical emergency details..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all mt-2 cursor-pointer shadow-md"
              >
                Submit Application for Committee Verification
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: View Application Details */}
      {viewingApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setViewingApp(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">{viewingApp.applicantName}</h2>
                <p className="text-xs text-slate-500">{viewingApp.applicantPhone}</p>
              </div>
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                viewingApp.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                viewingApp.status === 'Disbursed' ? 'bg-blue-100 text-blue-800' :
                viewingApp.status === 'Rejected' ? 'bg-rose-100 text-rose-800' :
                'bg-amber-100 text-amber-800'
              }`}>
                {viewingApp.status}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <p className="font-semibold text-rose-600 dark:text-rose-400">{viewingApp.schemeName}</p>
              
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
                <span className="text-slate-500 font-medium">Requested Amount:</span>
                <span className="font-extrabold text-slate-900 dark:text-white">₹{viewingApp.amountRequested.toLocaleString('en-IN')}</span>
              </div>

              {viewingApp.amountApproved !== undefined && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 flex items-center justify-between">
                  <span className="text-emerald-800 dark:text-emerald-300 font-medium">Approved Amount:</span>
                  <span className="font-black text-emerald-700 dark:text-emerald-400">₹{viewingApp.amountApproved.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="space-y-1 pt-1">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Reason & Grounds</span>
                <p className="text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                  {viewingApp.reason}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Submitted Attachments</span>
                <p className="text-slate-600 dark:text-slate-400 font-mono text-[11px]">
                  {viewingApp.documentsSubmitted.join(', ')}
                </p>
              </div>

              {viewingApp.verificationOfficer && (
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold pt-1">
                  Verified Officer: {viewingApp.verificationOfficer}
                </p>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setEditingApp(viewingApp);
                  setViewingApp(null);
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
              >
                Edit Application
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 6: Edit Application */}
      {editingApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setEditingApp(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Pencil className="w-4 h-4 text-blue-500" />
              <span>Edit Application Details</span>
            </h2>

            <form onSubmit={handleEditAppSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-500 font-medium mb-1">Applicant Name *</label>
                <input
                  type="text"
                  required
                  value={editingApp.applicantName}
                  onChange={(e) => setEditingApp({ ...editingApp, applicantName: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-medium mb-1">Phone Number *</label>
                <input
                  type="text"
                  required
                  value={editingApp.applicantPhone}
                  onChange={(e) => setEditingApp({ ...editingApp, applicantPhone: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Amount Requested (₹) *</label>
                  <input
                    type="number"
                    required
                    value={editingApp.amountRequested}
                    onChange={(e) => setEditingApp({ ...editingApp, amountRequested: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 font-medium mb-1">Amount Approved (₹)</label>
                  <input
                    type="number"
                    value={editingApp.amountApproved || ''}
                    onChange={(e) => setEditingApp({ ...editingApp, amountApproved: Number(e.target.value) })}
                    placeholder="0"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 font-medium mb-1">Application Status</label>
                <select
                  value={editingApp.status}
                  onChange={(e) => setEditingApp({ ...editingApp, status: e.target.value as any })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                >
                  <option value="Pending Verification">Pending Verification</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Approved">Approved</option>
                  <option value="Disbursed">Disbursed</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-500 font-medium mb-1">Reason & Grounds</label>
                <textarea
                  rows={3}
                  value={editingApp.reason}
                  onChange={(e) => setEditingApp({ ...editingApp, reason: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-medium mb-1">Verification Officer Notes</label>
                <input
                  type="text"
                  value={editingApp.verificationOfficer || ''}
                  onChange={(e) => setEditingApp({ ...editingApp, verificationOfficer: e.target.value })}
                  placeholder="e.g. Verified by Medical Committee Chair"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingApp(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
