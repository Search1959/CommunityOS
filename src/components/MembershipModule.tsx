import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  QrCode, 
  Phone, 
  Mail, 
  MapPin, 
  CheckCircle2, 
  Briefcase, 
  Droplet, 
  ShieldAlert, 
  X,
  CreditCard,
  Download
} from 'lucide-react';
import { Member, Organization } from '../types';

interface MembershipModuleProps {
  members: Member[];
  activeOrg: Organization;
  onAddMember: (newMem: Member) => void;
}

export const MembershipModule: React.FC<MembershipModuleProps> = ({
  members,
  activeOrg,
  onAddMember,
}) => {
  const [search, setSearch] = useState('');
  const [bloodFilter, setBloodFilter] = useState('All');
  const [selectedCardMember, setSelectedCardMember] = useState<Member | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New member form state
  const [newForm, setNewForm] = useState({
    name: '',
    roleInOrg: 'Executive Member',
    bloodGroup: 'O+' as const,
    occupation: '',
    businessName: '',
    phone: '',
    email: '',
    address: '',
    familyMembersCount: 4,
    emergencyName: '',
    emergencyPhone: ''
  });

  const filteredMembers = members.filter((m) => {
    const matchesSearch = 
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.membershipNo.toLowerCase().includes(search.toLowerCase()) ||
      m.occupation.toLowerCase().includes(search.toLowerCase()) ||
      (m.businessName && m.businessName.toLowerCase().includes(search.toLowerCase()));
    
    const matchesBlood = bloodFilter === 'All' || m.bloodGroup === bloodFilter;

    return matchesSearch && matchesBlood;
  });

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newForm.name || !newForm.phone) return;

    const newMem: Member = {
      id: `mem-${Date.now()}`,
      membershipNo: `EE-2026-${Math.floor(100 + Math.random() * 900)}`,
      orgId: activeOrg.id,
      name: newForm.name,
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      roleInOrg: newForm.roleInOrg,
      bloodGroup: newForm.bloodGroup,
      occupation: newForm.occupation || 'Professional',
      businessName: newForm.businessName,
      phone: newForm.phone,
      email: newForm.email || `${newForm.name.toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
      address: newForm.address || activeOrg.address,
      familyMembersCount: Number(newForm.familyMembersCount),
      status: 'Active',
      joinDate: new Date().toISOString().split('T')[0],
      renewalDueDate: '2027-03-31',
      annualFeePaid: true,
      emergencyContact: {
        name: newForm.emergencyName || 'Emergency Contact',
        phone: newForm.emergencyPhone || newForm.phone,
        relation: 'Family'
      },
      qrCodeData: `EE-MEMBER-${Date.now()}`
    };

    onAddMember(newMem);
    setShowAddModal(false);
    setNewForm({
      name: '',
      roleInOrg: 'Executive Member',
      bloodGroup: 'O+',
      occupation: '',
      businessName: '',
      phone: '',
      email: '',
      address: '',
      familyMembersCount: 4,
      emergencyName: '',
      emergencyPhone: ''
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Module Title & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-rose-500" />
            <span>Membership Directory ({filteredMembers.length})</span>
          </h1>
          <p className="text-xs text-slate-500">
            Digital Cards, Renewal Fees, Family Records & Emergency Blood Groups
          </p>
        </div>

        <button
          id="btn-add-member"
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white font-bold text-xs shadow-md flex items-center gap-1.5 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Member Enrolment</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            id="input-member-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, Membership ID, Occupation, or Business..."
            className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-400 outline-none focus:border-rose-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs font-semibold text-slate-500 shrink-0">Blood Group:</span>
          <select
            id="select-blood-filter"
            value={bloodFilter}
            onChange={(e) => setBloodFilter(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 outline-none"
          >
            <option value="All">All Blood Groups</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
        </div>
      </div>

      {/* Members Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMembers.map((m) => (
          <div key={m.id} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img src={m.photoUrl} alt={m.name} className="w-12 h-12 rounded-2xl object-cover shrink-0 border border-slate-200 dark:border-slate-700" />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">{m.name}</h3>
                    <p className="text-[10px] text-rose-600 dark:text-rose-400 font-bold uppercase tracking-wider">{m.roleInOrg}</p>
                    <p className="text-[10px] text-slate-400 font-mono">ID: {m.membershipNo}</p>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                  {m.bloodGroup}
                </span>
              </div>

              <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                  <span>{m.occupation} {m.businessName ? `• ${m.businessName}` : ''}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{m.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>Family Count: {m.familyMembersCount} Members</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Fees Paid (2026-27)</span>
              </div>

              <button
                onClick={() => setSelectedCardMember(m)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950 text-slate-700 dark:text-slate-200 text-[11px] font-bold flex items-center gap-1 transition-colors"
              >
                <CreditCard className="w-3.5 h-3.5 text-rose-500" />
                <span>Digital ID Card</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Digital Membership Card Modal */}
      {selectedCardMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-sm w-full p-6 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedCardMember(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Front of Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-rose-950 text-white shadow-xl space-y-4 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <p className="text-[9px] uppercase tracking-widest text-amber-400 font-bold">Official Membership Pass</p>
                  <p className="text-xs font-bold truncate max-w-[200px]">{activeOrg.name}</p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-rose-500 text-white">
                  {selectedCardMember.bloodGroup}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <img src={selectedCardMember.photoUrl} alt="Photo" className="w-16 h-16 rounded-xl object-cover border-2 border-white/20" />
                <div>
                  <h3 className="text-base font-extrabold">{selectedCardMember.name}</h3>
                  <p className="text-xs text-rose-300 font-semibold">{selectedCardMember.roleInOrg}</p>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">ID: {selectedCardMember.membershipNo}</p>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-white/10 text-[10px] text-slate-300">
                <div>
                  <p className="text-[9px] text-slate-400 uppercase">Valid Thru</p>
                  <p className="font-bold text-emerald-400">31-MAR-2027</p>
                </div>
                
                {/* QR Code Graphic */}
                <div className="p-1 bg-white rounded">
                  <div className="w-12 h-12 bg-slate-900 text-white text-[8px] flex items-center justify-center font-mono p-1 text-center">
                    [QR-CODE]
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center space-y-2">
              <p className="text-xs text-slate-500">Scan QR Code at Committee Office for Voting & Event Passes</p>
              <button
                onClick={() => alert('Digital ID Card downloaded to your device!')}
                className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md"
              >
                <Download className="w-4 h-4" />
                <span>Download High-Res PDF Card</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-base font-bold text-slate-900 dark:text-white">New Member Registration</h2>

            <form onSubmit={handleRegisterSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-500 font-medium mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={newForm.name}
                  onChange={(e) => setNewForm({ ...newForm, name: e.target.value })}
                  placeholder="e.g. Ramesh Chandra Sen"
                  className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Role / Designation</label>
                  <input
                    type="text"
                    value={newForm.roleInOrg}
                    onChange={(e) => setNewForm({ ...newForm, roleInOrg: e.target.value })}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Blood Group</label>
                  <select
                    value={newForm.bloodGroup}
                    onChange={(e) => setNewForm({ ...newForm, bloodGroup: e.target.value as any })}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Occupation</label>
                  <input
                    type="text"
                    value={newForm.occupation}
                    onChange={(e) => setNewForm({ ...newForm, occupation: e.target.value })}
                    placeholder="e.g. Architect / Business"
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Business Name (Optional)</label>
                  <input
                    type="text"
                    value={newForm.businessName}
                    onChange={(e) => setNewForm({ ...newForm, businessName: e.target.value })}
                    placeholder="e.g. Sen Designs"
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Mobile Phone *</label>
                  <input
                    type="text"
                    required
                    value={newForm.phone}
                    onChange={(e) => setNewForm({ ...newForm, phone: e.target.value })}
                    placeholder="+91 98300 00000"
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Family Count</label>
                  <input
                    type="number"
                    value={newForm.familyMembersCount}
                    onChange={(e) => setNewForm({ ...newForm, familyMembersCount: Number(e.target.value) })}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition-all mt-2"
              >
                Approve & Issue Member Card
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
