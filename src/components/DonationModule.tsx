import React, { useState } from 'react';
import { 
  IndianRupee, 
  QrCode, 
  CreditCard, 
  Building2, 
  CheckCircle2, 
  Download, 
  Share2, 
  ShieldCheck, 
  Sparkles,
  Plus,
  Receipt,
  Heart,
  Eye,
  Pencil,
  Trash2,
  Search,
  X
} from 'lucide-react';
import { Donation, Organization } from '../types';
import { Pagination } from './Pagination';

interface DonationModuleProps {
  donations: Donation[];
  activeOrg: Organization;
  onAddDonation: (newDon: Donation) => void;
  onUpdateDonation?: (updatedDon: Donation) => void;
  onDeleteDonation?: (donationId: string) => void;
}

export const DonationModule: React.FC<DonationModuleProps> = ({
  donations,
  activeOrg,
  onAddDonation,
  onUpdateDonation,
  onDeleteDonation,
}) => {
  const [activeTab, setActiveTab] = useState<'pay' | 'ledger' | 'certificate'>('pay');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewingDonation, setViewingDonation] = useState<Donation | null>(null);
  const [editingDonation, setEditingDonation] = useState<Donation | null>(null);
  
  // Payment Form
  const [donorName, setDonorName] = useState('');
  const [donorPan, setDonorPan] = useState('');
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('5000');
  const [purpose, setPurpose] = useState('Durga Puja Pandal & Community Annadhan');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'QR Code' | 'Razorpay' | 'Cash'>('UPI');
  
  const [paymentSuccessDonation, setPaymentSuccessDonation] = useState<Donation | null>(null);

  const filteredDonations = donations.filter((d) => 
    d.donorName.toLowerCase().includes(search.toLowerCase()) ||
    d.receiptNo.toLowerCase().includes(search.toLowerCase()) ||
    (d.donorPan && d.donorPan.toLowerCase().includes(search.toLowerCase())) ||
    d.purpose.toLowerCase().includes(search.toLowerCase())
  );

  const PAGE_SIZE = 20;
  const paginatedDonations = filteredDonations.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleDonateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!donorName || !amount) return;

    const receiptNo = `REC-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const newDon: Donation = {
      id: `don-${Date.now()}`,
      orgId: activeOrg.id,
      receiptNo,
      donorName,
      donorPan: donorPan.toUpperCase() || 'AAAPB1234F',
      phone: phone || '+91 98300 00000',
      amount: Number(amount) || 5000,
      purpose,
      paymentMethod,
      transactionRef: `${paymentMethod}/${Math.floor(100000000000 + Math.random() * 900000000000)}/SUCCESS`,
      is80GEligible: true,
      date: new Date().toISOString().split('T')[0],
      certificateIssued: true
    };

    onAddDonation(newDon);
    setPaymentSuccessDonation(newDon);
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Mode Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <IndianRupee className="w-5 h-5 text-rose-500" />
            <span>Donations & 80G Tax Receipts</span>
          </h1>
          <p className="text-xs text-slate-500">
            UPI QR Code, Card Payments, Instant 80G Certificates & Audit Ledger
          </p>
        </div>

        <div className="p-1 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center text-xs font-semibold">
          <button
            onClick={() => setActiveTab('pay')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'pay' ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 font-bold shadow-sm' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Online Donation Portal
          </button>
          <button
            onClick={() => setActiveTab('ledger')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'ledger' ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 font-bold shadow-sm' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Donation Ledger ({donations.length})
          </button>
        </div>
      </div>

      {/* Tab 1: Online Donation Portal */}
      {activeTab === 'pay' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Donation Form */}
          <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                <span>Contribute to {activeOrg.name}</span>
              </h2>
              <span className="px-2.5 py-1 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>50% 80G Tax Benefit</span>
              </span>
            </div>

            <form onSubmit={handleDonateSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Donor Full Name *</label>
                  <input
                    type="text"
                    required
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    placeholder="e.g. Anupam Sen"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 font-medium mb-1">PAN Card (For 80G Certificate)</label>
                  <input
                    type="text"
                    value={donorPan}
                    onChange={(e) => setDonorPan(e.target.value)}
                    placeholder="ABCDE1234F"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 outline-none uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Mobile Phone (For WhatsApp Receipt)</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98300 00000"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 font-medium mb-1">Donation Purpose / Campaign</label>
                  <select
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 outline-none"
                  >
                    <option value="Durga Puja Pandal & Community Annadhan">Durga Puja Pandal & Community Annadhan</option>
                    <option value="Swami Vivekananda Merit Scholarship Corpus">Swami Vivekananda Merit Scholarship Corpus</option>
                    <option value="Sanjivani Medical Emergency Fund">Sanjivani Medical Emergency Fund</option>
                    <option value="General Corpus Fund">General Corpus Fund</option>
                  </select>
                </div>
              </div>

              {/* Amount Quick Chips */}
              <div>
                <label className="block text-slate-500 font-medium mb-1">Select Donation Amount (₹)</label>
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {['1100', '2100', '5000', '11000'].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setAmount(amt)}
                      className={`p-2 rounded-xl border text-xs font-bold transition-all ${
                        amount === amt
                          ? 'bg-rose-500 text-white border-rose-600 shadow'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      ₹{Number(amt).toLocaleString('en-IN')}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Or enter custom amount in INR"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 outline-none font-mono text-sm font-bold"
                />
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-slate-500 font-medium mb-1">Payment Channel</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'UPI', label: 'UPI / GPay / PhonePe', icon: QrCode },
                    { id: 'Razorpay', label: 'Cards & NetBanking', icon: CreditCard },
                    { id: 'Cash', label: 'Cash / Cheque Voucher', icon: Building2 },
                  ].map((m) => {
                    const Icon = m.icon;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setPaymentMethod(m.id as any)}
                        className={`p-3 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                          paymentMethod === m.id
                            ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-700 dark:text-rose-300 font-bold'
                            : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-[10px]">{m.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white font-bold text-sm shadow-lg shadow-rose-500/20 transition-all"
              >
                Complete Payment of ₹{Number(amount || 0).toLocaleString('en-IN')} & Issue 80G Receipt
              </button>
            </form>
          </div>

          {/* Dynamic UPI QR Code Scanner Widget */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-between text-center space-y-4">
            <div className="space-y-1">
              <span className="px-2.5 py-1 rounded bg-amber-100 text-amber-800 text-[10px] font-bold uppercase tracking-wider">
                Instant UPI Payment
              </span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Scan with BHIM, PhonePe, Paytm or Google Pay</h3>
              <p className="text-xs text-slate-500">UPI ID: {activeOrg.slug}@yesbank</p>
            </div>

            {/* QR Box */}
            <div className="p-4 bg-white rounded-2xl border-2 border-slate-200 shadow-inner">
              <div className="w-44 h-44 bg-slate-900 text-white font-mono flex flex-col items-center justify-center rounded-xl p-2 text-[10px] gap-1">
                <QrCode className="w-12 h-12 text-amber-400" />
                <span>UPI-QR-{activeOrg.slug.toUpperCase()}</span>
                <span className="text-[9px] text-slate-300 font-bold">₹{Number(amount || 0).toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="text-[11px] text-slate-400">
              <p>80G Receipt Number automatically dispatched to WhatsApp upon payment confirmation.</p>
            </div>
          </div>

        </div>
      )}

      {/* Payment Success Receipt Modal */}
      {paymentSuccessDonation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Donation Payment Successful!</h2>
              <p className="text-xs text-slate-500">Official 80G Tax Exemption Receipt Generated</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Receipt No:</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{paymentSuccessDonation.receiptNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Donor Name:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{paymentSuccessDonation.donorName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">PAN:</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{paymentSuccessDonation.donorPan}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Amount Paid:</span>
                <span className="font-black text-emerald-600 text-sm">₹{paymentSuccessDonation.amount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">80G URN:</span>
                <span className="font-mono text-slate-600 dark:text-slate-300">{activeOrg.eightyG}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  alert(`Receipt #${paymentSuccessDonation.receiptNo} PDF downloaded.`);
                  setPaymentSuccessDonation(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF Receipt</span>
              </button>

              <button
                onClick={() => setPaymentSuccessDonation(null)}
                className="py-2.5 px-4 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Donation Master Ledger */}
      {activeTab === 'ledger' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">80G Donation Ledger & Receipts ({filteredDonations.length})</h2>
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                placeholder="Search donor, PAN, or receipt..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-400 outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div className="space-y-3">
            {paginatedDonations.map((don) => (
              <div key={don.id} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{don.donorName}</span>
                    <span className="text-xs font-mono text-slate-400">({don.donorPan || 'No PAN'})</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      80G Certified
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{don.purpose}</p>
                  <p className="text-[10px] text-slate-400">Receipt: {don.receiptNo} • Date: {don.date} • Mode: {don.paymentMethod}</p>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2">
                  <div className="text-base font-black text-emerald-600 dark:text-emerald-400">
                    ₹{don.amount.toLocaleString('en-IN')}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setViewingDonation(don)}
                      className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => setEditingDonation(don)}
                      className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-amber-950 text-slate-600 dark:text-slate-300 hover:text-amber-600 transition-colors"
                      title="Edit Receipt"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete receipt ${don.receiptNo}?`)) {
                          onDeleteDonation?.(don.id);
                        }
                      }}
                      className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950 text-slate-600 dark:text-slate-300 hover:text-rose-600 transition-colors"
                      title="Delete Receipt"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => alert(`Downloaded receipt PDF for ${don.receiptNo}`)}
                      className="px-2 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 font-bold text-[11px] flex items-center gap-1"
                    >
                      <Download className="w-3 h-3" />
                      <span>PDF</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalItems={filteredDonations.length}
            pageSize={PAGE_SIZE}
            onPageChange={(p) => setCurrentPage(p)}
          />
        </div>
      )}

      {/* View Donation Modal */}
      {viewingDonation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setViewingDonation(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Receipt className="w-4 h-4 text-emerald-500" />
              <span>Donation Details</span>
            </h2>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs space-y-2 border border-slate-200 dark:border-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-400">Receipt No:</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{viewingDonation.receiptNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Donor Name:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{viewingDonation.donorName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">PAN:</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{viewingDonation.donorPan}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Phone:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{viewingDonation.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Amount:</span>
                <span className="font-black text-emerald-600 text-sm">₹{viewingDonation.amount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Purpose:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{viewingDonation.purpose}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Payment Mode:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{viewingDonation.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Date:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{viewingDonation.date}</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setViewingDonation(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Donation Modal */}
      {editingDonation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setEditingDonation(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Pencil className="w-4 h-4 text-amber-500" />
              <span>Edit Receipt: {editingDonation.receiptNo}</span>
            </h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                onUpdateDonation?.(editingDonation);
                setEditingDonation(null);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block text-slate-500 font-medium mb-1">Donor Full Name</label>
                <input
                  type="text"
                  required
                  value={editingDonation.donorName}
                  onChange={(e) => setEditingDonation({ ...editingDonation, donorName: e.target.value })}
                  className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Donor PAN</label>
                  <input
                    type="text"
                    value={editingDonation.donorPan}
                    onChange={(e) => setEditingDonation({ ...editingDonation, donorPan: e.target.value.toUpperCase() })}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    required
                    value={editingDonation.amount}
                    onChange={(e) => setEditingDonation({ ...editingDonation, amount: Number(e.target.value) })}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 font-medium mb-1">Purpose / Cause</label>
                <input
                  type="text"
                  value={editingDonation.purpose}
                  onChange={(e) => setEditingDonation({ ...editingDonation, purpose: e.target.value })}
                  className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingDonation(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold"
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

    </div>
  );
};
