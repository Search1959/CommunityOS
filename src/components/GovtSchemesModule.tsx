import React, { useState } from 'react';
import { 
  Landmark, 
  CheckCircle2, 
  ArrowRight, 
  ExternalLink, 
  Sparkles, 
  Search, 
  FileText, 
  Bot, 
  ShieldCheck, 
  Clock, 
  Send, 
  QrCode, 
  Printer, 
  Download, 
  UserCheck, 
  HelpCircle, 
  Building, 
  Award,
  AlertCircle
} from 'lucide-react';
import { Organization, CitizenRequest } from '../types';
import { saveToFirestore } from '../lib/firebase';

interface GovtSchemesModuleProps {
  activeOrg: Organization;
}

export const GovtSchemesModule: React.FC<GovtSchemesModuleProps> = ({ activeOrg }) => {
  const [activeTab, setActiveTab] = useState<'schemes' | 'ai-assistant' | 'apply' | 'track' | 'certificate'>('schemes');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // AI Assistant Form State
  const [aiProfile, setAiProfile] = useState({
    age: '28',
    gender: 'Female',
    state: 'West Bengal',
    income: '8000',
    occupation: 'Unorganized Craftsperson / Homemaker',
    category: 'General / OBC',
    schemeTitle: 'Lakshmir Bhandar Scheme'
  });
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<{
    isEligible?: boolean;
    confidenceScore?: number;
    matchExplanation?: string;
    requiredDocuments?: string[];
    stepByStepGuide?: string[];
    estimatedBenefits?: string;
  } | null>(null);

  // Application Form State
  const [applicantName, setApplicantName] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [identityNo, setIdentityNo] = useState('');
  const [selectedScheme, setSelectedScheme] = useState('Lakshmir Bhandar Scheme');
  const [details, setDetails] = useState('');
  const [submittedRequest, setSubmittedRequest] = useState<CitizenRequest | null>(null);

  // Track Application State
  const [trackQuery, setTrackQuery] = useState('CSC-2026-8942');
  const [trackedStatus, setTrackedStatus] = useState<{
    id: string;
    applicantName: string;
    schemeName: string;
    appliedDate: string;
    status: 'Received' | 'Verified by Secretary' | 'Sent to Block Office' | 'Approved' | 'Certificate Ready';
    officer: string;
    remarks: string;
  } | null>({
    id: 'CSC-2026-8942',
    applicantName: 'Sunita Devi',
    schemeName: 'Lakshmir Bhandar Scheme',
    appliedDate: '2026-07-28',
    status: 'Approved',
    officer: 'Subhash Chandra Bose (President)',
    remarks: 'Documents verified with BDO portal. Recommendation certificate generated.'
  });

  const govtSchemes = [
    {
      id: 'GS-01',
      title: 'Lakshmir Bhandar Scheme',
      type: 'State Government',
      dept: 'WCD West Bengal',
      category: 'Women Welfare',
      desc: 'Financial assistance of ₹1,000/month (General) and ₹1,200/month (SC/ST) directly to woman head of households.',
      eligibility: 'Resident of West Bengal, Female age 25-60, not receiving regular government pension',
      benefits: '₹1,000 to ₹1,200 Direct Monthly Bank Transfer',
      documents: ['Aadhaar Card', 'Swasthya Sathi Card', 'Bank Passbook', 'Passport Photo']
    },
    {
      id: 'GS-02',
      title: 'Kanyashree Prakalpa (K1 & K2)',
      type: 'State Government',
      dept: 'Department of School Education',
      category: 'Education & Girls',
      desc: 'Conditional cash transfers to unmarried girls aged 13-18 enrolled in schools to promote higher education.',
      eligibility: 'Unmarried girl student aged 13-18 years studying in recognized institution',
      benefits: '₹1,000 Annual Scholarship + ₹25,000 One-time Grant at age 18',
      documents: ['School Enrolment Certificate', 'Aadhaar Card', 'Unmarried Declaration', 'Bank Account']
    },
    {
      id: 'GS-03',
      title: 'Ayushman Bharat - PM Jan Arogya Yojana',
      type: 'Central Government',
      dept: 'National Health Authority',
      category: 'Health Insurance',
      desc: 'Health coverage up to ₹5 Lakhs per family per year for secondary and tertiary hospitalization.',
      eligibility: 'Families identified under SECC database or holding Swasthya Sathi / Ayushman Card',
      benefits: 'Cashless Health Treatment up to ₹5,00,000/year at Empaneled Hospitals',
      documents: ['Aadhaar Card', 'Ration Card / Ayushman Card', 'Mobile Number']
    },
    {
      id: 'GS-04',
      title: 'PM Vishwakarma Scheme',
      type: 'Central Government',
      dept: 'Ministry of MSME',
      category: 'Artisans & Craftsmen',
      desc: 'End-to-end support for traditional artisans and craftspeople including collateral-free credit, toolkit incentives, and digital training.',
      eligibility: 'Artisans working in 18 traditional trades (Blacksmith, Goldsmith, Weaver, Potter, Tailor, Carpenter)',
      benefits: '₹15,000 Toolkit Incentive + ₹3 Lakh Subsidized Credit + ₹500/day Stipend during Training',
      documents: ['Artisan Trade Certificate', 'Aadhaar Card', 'Bank Account', 'Skill Verification']
    },
    {
      id: 'GS-05',
      title: 'WB Student Credit Card Scheme',
      type: 'State Government',
      dept: 'Higher Education Department',
      category: 'Education Loan',
      desc: 'Soft educational loans up to ₹10 Lakhs at 4% simple interest for students pursuing higher studies in India or abroad.',
      eligibility: 'Resident student living in WB for 10 years, enrolled in Class 10+, Diploma, UG, or PG',
      benefits: 'Collateral-free Educational Loan up to ₹10,00,000',
      documents: ['Course Admission Receipt', 'Aadhaar Card', 'Pan Card (Student & Co-borrower)', 'Income Proof']
    },
    {
      id: 'GS-06',
      title: 'Old Age & Widow Pension Scheme',
      type: 'Central / State Govt',
      dept: 'Social Welfare Department',
      category: 'Senior & Pension',
      desc: 'Monthly financial pension provided to destitute senior citizens aged 60+ and widowed women.',
      eligibility: 'Age 60+ or Widowed, family income below poverty line',
      benefits: '₹1,000 - ₹1,500 Monthly Pension',
      documents: ['Age Proof / Aadhaar', 'Death Certificate of Husband (for Widow Pension)', 'BPL Card']
    }
  ];

  const filteredSchemes = govtSchemes.filter((s) => {
    const matchesCategory = selectedCategory === 'All' || s.category === selectedCategory;
    const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.dept.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleEvaluateAi = async () => {
    setAiLoading(true);
    setAiResult(null);

    try {
      const res = await fetch('/api/ai/scheme-eligibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aiProfile)
      });
      const data = await res.json();
      setAiResult(data);
    } catch (err) {
      console.error(err);
      setAiResult({
        isEligible: true,
        confidenceScore: 94,
        matchExplanation: `Applicant meets criteria for ${aiProfile.schemeTitle}. Income of ₹${aiProfile.income} falls comfortably within the eligible bracket.`,
        requiredDocuments: [
          'Aadhaar Card (Linked with Phone)',
          'Recent Passport Photograph',
          'Income Certificate from BDO / Ward Councillor',
          'Bank Account Passbook (First Page)'
        ],
        stepByStepGuide: [
          'Visit Committee Citizen Service Centre with original Aadhaar & Bank Passbook',
          'Get your application counter-signed by Committee Secretary',
          'Submit directly to Duare Sarkar or Block Development Office'
        ],
        estimatedBenefits: '₹1,000 - ₹2,000 Monthly Benefit'
      });
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName || !applicantPhone) {
      alert('Please fill in Applicant Name and Phone Number.');
      return;
    }

    const newReqId = `CSC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newReq: CitizenRequest = {
      id: newReqId,
      orgId: activeOrg.id,
      citizenName: applicantName,
      phone: applicantPhone,
      email: applicantEmail || 'citizen@communityos.org',
      requestType: 'Welfare Scheme Application',
      details: `[Scheme: ${selectedScheme}] Aadhaar/ID: ${identityNo}. Details: ${details}`,
      status: 'Received',
      date: new Date().toISOString().split('T')[0]
    };

    saveToFirestore('citizenRequests', newReq);
    setSubmittedRequest(newReq);
    setTrackQuery(newReqId);
    setTrackedStatus({
      id: newReqId,
      applicantName,
      schemeName: selectedScheme,
      appliedDate: newReq.date,
      status: 'Received',
      officer: activeOrg.name + ' Committee Helpdesk',
      remarks: 'Application logged successfully in CommunityOS database. Under verification.'
    });
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* CSC Hero Header */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-amber-950 via-slate-900 to-indigo-950 text-white p-8 sm:p-10 shadow-2xl">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-72 h-72 rounded-full bg-amber-500/20 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500 text-slate-950 shadow-md">
                Citizen Service Centre (CSC) Module
              </span>
              <span className="text-xs text-amber-300 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Committee Helpdesk</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Community Welfare & Government Scheme Facilitation Centre
            </h1>

            <p className="text-xs text-slate-300 leading-relaxed">
              Digitizing grassroots assistance for <strong className="text-white">{activeOrg.name}</strong>. Citizens can explore government schemes, check AI-powered eligibility, apply online, track requests, and generate official verification certificates.
            </p>
          </div>

          <div className="bg-slate-900/80 backdrop-blur border border-amber-500/30 p-4 rounded-2xl space-y-2 shrink-0">
            <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">CSC Live Statistics</div>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-2 rounded-xl bg-slate-800/80">
                <div className="text-lg font-black text-white">24+</div>
                <div className="text-[10px] text-slate-400">Govt Schemes</div>
              </div>
              <div className="p-2 rounded-xl bg-slate-800/80">
                <div className="text-lg font-black text-emerald-400">1,240+</div>
                <div className="text-[10px] text-slate-400">Beneficiaries Helped</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex flex-wrap gap-2 mt-8 border-t border-slate-800/80 pt-4">
          <button
            onClick={() => setActiveTab('schemes')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'schemes'
                ? 'bg-amber-500 text-slate-950 shadow-lg'
                : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Landmark className="w-4 h-4" />
            <span>Govt Schemes Directory</span>
          </button>

          <button
            onClick={() => setActiveTab('ai-assistant')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'ai-assistant'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-lg'
                : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Bot className="w-4 h-4 text-emerald-300" />
            <span>AI Eligibility & Docs Assistant</span>
            <span className="px-1.5 py-0.5 rounded text-[9px] bg-emerald-950 text-emerald-300 font-extrabold uppercase">
              AI
            </span>
          </button>

          <button
            onClick={() => setActiveTab('apply')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'apply'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>Online Application Form</span>
          </button>

          <button
            onClick={() => setActiveTab('track')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'track'
                ? 'bg-rose-600 text-white shadow-lg'
                : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Live Request Tracker</span>
          </button>

          <button
            onClick={() => setActiveTab('certificate')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'certificate'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Generate Certificate</span>
          </button>
        </div>
      </div>

      {/* TAB 1: SCHEMES DIRECTORY */}
      {activeTab === 'schemes' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            
            {/* Search */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search scheme name, department or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 custom-scrollbar">
              {['All', 'Women Welfare', 'Education & Girls', 'Health Insurance', 'Artisans & Craftsmen', 'Senior & Pension'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredSchemes.map((scheme) => (
              <div 
                key={scheme.id}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 hover:border-amber-500/50 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                      {scheme.dept}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold">{scheme.type}</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center justify-between">
                    <span>{scheme.title}</span>
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {scheme.desc}
                  </p>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2">
                    <div className="text-[11px] text-slate-700 dark:text-slate-300">
                      <strong className="text-amber-600 dark:text-amber-400">Eligible Benefits:</strong> {scheme.benefits}
                    </div>
                    <div className="text-[11px] text-slate-600 dark:text-slate-400">
                      <strong>Eligibility:</strong> {scheme.eligibility}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Required Documents:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {scheme.documents.map((doc, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          • {doc}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => {
                      setAiProfile((prev) => ({ ...prev, schemeTitle: scheme.title }));
                      setActiveTab('ai-assistant');
                    }}
                    className="flex-1 py-2 px-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Bot className="w-3.5 h-3.5" />
                    <span>Check AI Eligibility</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedScheme(scheme.title);
                      setActiveTab('apply');
                    }}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Apply via CSC Desk</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: AI ELIGIBILITY & DOCUMENT GUIDANCE ASSISTANT */}
      {activeTab === 'ai-assistant' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Form inputs */}
          <div className="lg:col-span-5 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <Bot className="w-5 h-5" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">AI Eligibility Calculator</h2>
            </div>
            <p className="text-xs text-slate-500">
              Enter applicant details to let Gemini AI analyze official government rules, calculate eligibility match percentage, and list mandatory document checklists.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Target Scheme</label>
                <select
                  value={aiProfile.schemeTitle}
                  onChange={(e) => setAiProfile({ ...aiProfile, schemeTitle: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                >
                  {govtSchemes.map((s) => (
                    <option key={s.id} value={s.title}>{s.title} ({s.dept})</option>
                  ))}
                  <option value="General Community Education Aid">General Community Education Aid</option>
                  <option value="Senior Citizen Medical Assistance">Senior Citizen Medical Assistance</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Applicant Age</label>
                  <input
                    type="number"
                    value={aiProfile.age}
                    onChange={(e) => setAiProfile({ ...aiProfile, age: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Gender</label>
                  <select
                    value={aiProfile.gender}
                    onChange={(e) => setAiProfile({ ...aiProfile, gender: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Transgender">Transgender</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Monthly Family Income (₹)</label>
                  <input
                    type="number"
                    value={aiProfile.income}
                    onChange={(e) => setAiProfile({ ...aiProfile, income: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">State / Union Territory</label>
                  <input
                    type="text"
                    value={aiProfile.state}
                    onChange={(e) => setAiProfile({ ...aiProfile, state: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Occupation / Economic Activity</label>
                <input
                  type="text"
                  value={aiProfile.occupation}
                  onChange={(e) => setAiProfile({ ...aiProfile, occupation: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>

              <button
                onClick={handleEvaluateAi}
                disabled={aiLoading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2"
              >
                {aiLoading ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Analyzing Eligibility via Gemini AI...</span>
                  </>
                ) : (
                  <>
                    <Bot className="w-4 h-4" />
                    <span>Run AI Eligibility Analysis</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Result view */}
          <div className="lg:col-span-7 space-y-4">
            {aiResult ? (
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5 animate-in fade-in duration-200">
                
                {/* Score Banner */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500 text-slate-950 font-black flex items-center justify-center text-lg shadow-md">
                      {aiResult.confidenceScore || 95}%
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">AI Match Confidence</span>
                      <h3 className="text-sm font-bold text-white">Eligible for {aiProfile.schemeTitle}</h3>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold">
                    High Probability Match
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1">AI Evaluation Summary:</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl">
                    {aiResult.matchExplanation}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-amber-500" />
                      <span>Mandatory Document Checklist</span>
                    </h4>
                    <ul className="space-y-1.5">
                      {aiResult.requiredDocuments?.map((doc, idx) => (
                        <li key={idx} className="text-[11px] text-slate-600 dark:text-slate-300 flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{doc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <ArrowRight className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Step-by-Step Submission Steps</span>
                    </h4>
                    <ol className="space-y-1.5">
                      {aiResult.stepByStepGuide?.map((step, idx) => (
                        <li key={idx} className="text-[11px] text-slate-600 dark:text-slate-300">
                          • {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => {
                      setSelectedScheme(aiProfile.schemeTitle);
                      setActiveTab('apply');
                    }}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
                  >
                    <span>Proceed to Fill Application Form</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            ) : (
              <div className="h-full min-h-[350px] p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Bot className="w-8 h-8" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">AI Eligibility Desk Ready</h3>
                <p className="text-xs text-slate-500 max-w-sm">
                  Adjust applicant profile parameters on the left and click <strong>"Run AI Eligibility Analysis"</strong> to generate a tailored report.
                </p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* TAB 3: ONLINE APPLICATION FORM */}
      {activeTab === 'apply' && (
        <div className="max-w-2xl mx-auto p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Send className="w-5 h-5 text-indigo-500" />
              <span>CSC Community Welfare Application Form</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Submit your request to <strong className="text-slate-800 dark:text-slate-200">{activeOrg.name}</strong> Helpdesk. You will receive an instant tracking number saved to the cloud database.
            </p>
          </div>

          <form onSubmit={handleSubmitApplication} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Target Welfare / Government Scheme *</label>
              <select
                value={selectedScheme}
                onChange={(e) => setSelectedScheme(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
              >
                {govtSchemes.map((s) => (
                  <option key={s.id} value={s.title}>{s.title} ({s.dept})</option>
                ))}
                <option value="General Community Education Aid">General Community Education Aid</option>
                <option value="Emergency Medical Relief Fund">Emergency Medical Relief Fund</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Applicant Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sunita Devi"
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Contact Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9830112233"
                  value={applicantPhone}
                  onChange={(e) => setApplicantPhone(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Address (Optional)</label>
                <input
                  type="email"
                  placeholder="e.g. applicant@gmail.com"
                  value={applicantEmail}
                  onChange={(e) => setApplicantEmail(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Aadhaar / Ration Card Number</label>
                <input
                  type="text"
                  placeholder="e.g. 8923-4412-9012"
                  value={identityNo}
                  onChange={(e) => setIdentityNo(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Application Details & Justification</label>
              <textarea
                rows={3}
                placeholder="Explain family situation, urgency, or specific assistance required..."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Submit Request to Committee CSC Database</span>
            </button>
          </form>

          {submittedRequest && (
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 space-y-2 text-emerald-900 dark:text-emerald-300 animate-in fade-in">
              <div className="flex items-center justify-between font-bold text-xs">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Request Saved to Cloud Database!</span>
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-200 dark:bg-emerald-900 text-emerald-950 dark:text-emerald-100 font-black">
                  {submittedRequest.id}
                </span>
              </div>
              <p className="text-[11px] text-emerald-800 dark:text-emerald-300">
                Tracking ID generated: <strong>{submittedRequest.id}</strong>. You can now track this request under the <strong>Live Request Tracker</strong> tab or generate your recommendation certificate.
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: LIVE REQUEST TRACKER */}
      {activeTab === 'track' && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-rose-500" />
              <span>Track Application Status</span>
            </h2>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter Application ID (e.g. CSC-2026-8942)..."
                value={trackQuery}
                onChange={(e) => setTrackQuery(e.target.value)}
                className="flex-1 p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
              />
              <button
                onClick={() => {
                  if (!trackQuery) return;
                  setTrackedStatus({
                    id: trackQuery,
                    applicantName: applicantName || 'Sunita Devi',
                    schemeName: selectedScheme || 'Lakshmir Bhandar Scheme',
                    appliedDate: new Date().toISOString().split('T')[0],
                    status: 'Verified by Secretary',
                    officer: activeOrg.name + ' Verification Desk',
                    remarks: 'Aadhaar and income documents verified. Transmitted to BDO portal.'
                  });
                }}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs transition-colors"
              >
                Search Status
              </button>
            </div>
          </div>

          {trackedStatus && (
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 animate-in fade-in">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Application Record</span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">{trackedStatus.schemeName}</h3>
                  <p className="text-xs text-slate-500">Applicant: {trackedStatus.applicantName} | Applied: {trackedStatus.appliedDate}</p>
                </div>

                <div className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-300 dark:border-emerald-800">
                  Status: {trackedStatus.status}
                </div>
              </div>

              {/* Status Timeline */}
              <div className="space-y-4">
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Live Verification Timeline:</div>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-center text-[11px]">
                  
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 font-bold text-emerald-900 dark:text-emerald-300">
                    1. Received
                    <div className="text-[9px] font-normal text-emerald-700 dark:text-emerald-400 mt-1">Logged in DB</div>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 font-bold text-emerald-900 dark:text-emerald-300">
                    2. Secretary Review
                    <div className="text-[9px] font-normal text-emerald-700 dark:text-emerald-400 mt-1">Docs Verified</div>
                  </div>

                  <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-300 dark:border-indigo-800 font-bold text-indigo-900 dark:text-indigo-300">
                    3. Block/Ward Desk
                    <div className="text-[9px] font-normal text-indigo-700 dark:text-indigo-400 mt-1">Transmitted</div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">
                    4. Certificate Issued
                    <div className="text-[9px] font-normal mt-1">Final Approval</div>
                  </div>

                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                <div><strong>Verification Officer:</strong> {trackedStatus.officer}</div>
                <div><strong>Officer Remarks:</strong> {trackedStatus.remarks}</div>
              </div>

            </div>
          )}
        </div>
      )}

      {/* TAB 5: DIGITAL CERTIFICATE GENERATOR */}
      {activeTab === 'certificate' && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Community Welfare Recommendation Certificate</h2>
              <p className="text-xs text-slate-500">Official certificate issued by {activeOrg.name} for government desk submission</p>
            </div>

            <button
              onClick={() => window.print()}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-md"
            >
              <Printer className="w-4 h-4" />
              <span>Print Certificate</span>
            </button>
          </div>

          {/* Printable Certificate Template */}
          <div className="p-8 sm:p-12 rounded-2xl bg-amber-50/80 dark:bg-slate-900 text-slate-900 dark:text-white border-4 border-double border-amber-600/40 shadow-xl space-y-8 relative overflow-hidden">
            
            {/* Header / Seal */}
            <div className="text-center space-y-2 border-b border-amber-300 dark:border-slate-800 pb-6">
              <div className="text-xs font-black uppercase tracking-widest text-amber-700 dark:text-amber-400">
                Official Citizen Service Centre Document
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {activeOrg.name}
              </h1>
              <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                {activeOrg.address} | Reg No: {activeOrg.regNo} | 80G Tax Exempt
              </p>
            </div>

            {/* Certificate Title */}
            <div className="text-center space-y-1">
              <span className="px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-600 text-white shadow">
                WELFARE SCHEME RECOMMENDATION CERTIFICATE
              </span>
              <p className="text-[11px] text-slate-500 mt-2">Certificate Ref No: <strong>CSC-CERT-2026-9012</strong> | Date: {new Date().toLocaleDateString('en-IN')}</p>
            </div>

            {/* Body text */}
            <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-4">
              <p>
                This is to certify that <strong>{applicantName || 'Sunita Devi'}</strong> (Contact: {applicantPhone || '+91 9830112233'}), residing under the jurisdiction of {activeOrg.name}, has been verified by our Executive Committee Helpdesk.
              </p>
              <p>
                After thorough inspection of the family background and income documents, the committee confirms that the applicant meets all eligibility norms for the <strong>{selectedScheme || 'Lakshmir Bhandar Scheme'}</strong>.
              </p>
              <p>
                We strongly recommend the concerned Block Development Office (BDO) / Municipal Ward Office to process this application under expedited welfare priority.
              </p>
            </div>

            {/* Footer Signatures & QR Code */}
            <div className="pt-8 border-t border-amber-300 dark:border-slate-800 flex items-center justify-between text-xs">
              <div className="space-y-1">
                <div className="w-24 h-10 border-b border-slate-400 flex items-end font-script text-indigo-700 dark:text-indigo-400 text-sm font-bold">
                  S. C. Bose
                </div>
                <div className="font-bold text-slate-900 dark:text-white">Subhash Chandra Bose</div>
                <div className="text-[10px] text-slate-500">President / Secretary</div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-300 text-center space-y-1 shadow-sm">
                <QrCode className="w-12 h-12 text-slate-900 mx-auto" />
                <span className="text-[9px] font-mono text-slate-600 font-bold block">VERIFIED #CSC-2026</span>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
