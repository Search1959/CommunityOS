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
  Download,
  Eye,
  Pencil,
  Trash2
} from 'lucide-react';
import { Member, Organization } from '../types';
import { Pagination } from './Pagination';

interface MembershipModuleProps {
  members: Member[];
  activeOrg: Organization;
  organizations?: Organization[];
  onAddMember: (newMem: Member) => void;
  onUpdateMember?: (updatedMem: Member) => void;
  onDeleteMember?: (memberId: string) => void;
}

export const MembershipModule: React.FC<MembershipModuleProps> = ({
  members,
  activeOrg,
  organizations = [activeOrg],
  onAddMember,
  onUpdateMember,
  onDeleteMember,
}) => {
  const [search, setSearch] = useState('');
  const [bloodFilter, setBloodFilter] = useState('All');
  const [committeeFilter, setCommitteeFilter] = useState('All');
  const [selectedCardMember, setSelectedCardMember] = useState<Member | null>(null);
  const [viewingMember, setViewingMember] = useState<Member | null>(null);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const AVAILABLE_COMMITTEES = [
    'Executive Committee',
    'Welfare & Medical Relief Cell',
    'Durga Puja Steering Committee',
    'Women Welfare Wing',
    'Youth & Sports Cell',
    'Finance & Audit Board',
    'School Governing Body & Academics'
  ];

  // New member form state
  const [newForm, setNewForm] = useState({
    targetOrgId: activeOrg.id,
    name: '',
    roleInOrg: 'Executive Member',
    committeeName: 'Executive Committee',
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
    const matchesCommittee = committeeFilter === 'All' || (m.committeeName || 'Executive Committee') === committeeFilter;

    return matchesSearch && matchesBlood && matchesCommittee;
  });

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newForm.name || !newForm.phone) return;

    const chosenOrg = organizations.find(o => o.id === newForm.targetOrgId) || activeOrg;
    const orgPrefix = chosenOrg.slug ? chosenOrg.slug.substring(0, 2).toUpperCase() : 'EE';

    const newMem: Member = {
      id: `mem-${Date.now()}`,
      membershipNo: `${orgPrefix}-2026-${Math.floor(100 + Math.random() * 900)}`,
      orgId: chosenOrg.id,
      name: newForm.name,
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      roleInOrg: newForm.roleInOrg,
      committeeName: newForm.committeeName,
      bloodGroup: newForm.bloodGroup,
      occupation: newForm.occupation || 'Professional',
      businessName: newForm.businessName,
      phone: newForm.phone,
      email: newForm.email || `${newForm.name.toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
      address: newForm.address || chosenOrg.address,
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
      qrCodeData: `${orgPrefix}-MEMBER-${Date.now()}`
    };

    onAddMember(newMem);
    setShowAddModal(false);
    setNewForm({
      targetOrgId: activeOrg.id,
      name: '',
      roleInOrg: 'Executive Member',
      committeeName: 'Executive Committee',
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

  const PAGE_SIZE = 20;
  const paginatedMembers = filteredMembers.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

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
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            placeholder="Search by name, Membership ID, Occupation, or Business..."
            className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-400 outline-none focus:border-rose-500"
          />
        </div>

        {/* Committee & Blood Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-indigo-500" />
              <span>Committee:</span>
            </span>
            <select
              id="select-committee-filter"
              value={committeeFilter}
              onChange={(e) => { setCommitteeFilter(e.target.value); setCurrentPage(1); }}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-indigo-50/80 dark:bg-slate-800 border border-indigo-200 dark:border-slate-700 text-indigo-950 dark:text-slate-200 outline-none focus:border-rose-500"
            >
              <option value="All">All Committees ({members.length})</option>
              {AVAILABLE_COMMITTEES.map((comm) => {
                const count = members.filter(m => (m.committeeName || 'Executive Committee') === comm).length;
                return (
                  <option key={comm} value={comm}>
                    {comm} ({count})
                  </option>
                );
              })}
            </select>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-xs font-semibold text-slate-500 shrink-0">Blood Group:</span>
            <select
              id="select-blood-filter"
              value={bloodFilter}
              onChange={(e) => { setBloodFilter(e.target.value); setCurrentPage(1); }}
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
      </div>

      {/* Members Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {paginatedMembers.map((m) => (
          <div key={m.id} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img src={m.photoUrl} alt={m.name} className="w-12 h-12 rounded-2xl object-cover shrink-0 border border-slate-200 dark:border-slate-700" />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">{m.name}</h3>
                    <p className="text-[10px] text-rose-600 dark:text-rose-400 font-bold uppercase tracking-wider">{m.roleInOrg}</p>
                    <div className="mt-0.5 inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                      <Users className="w-3 h-3 text-indigo-500 shrink-0" />
                      <span className="truncate max-w-[140px]">{m.committeeName || 'Executive Committee'}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">ID: {m.membershipNo}</p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                    {m.bloodGroup}
                  </span>

                  {/* Action Buttons: View, Edit, Delete */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setViewingMember(m)}
                      className="p-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition-colors"
                      title="View Profile Details"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => setEditingMember(m)}
                      className="p-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-amber-950 text-slate-600 dark:text-slate-300 hover:text-amber-600 transition-colors"
                      title="Edit Member"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete member ${m.name}?`)) {
                          onDeleteMember?.(m.id);
                        }
                      }}
                      className="p-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950 text-slate-600 dark:text-slate-300 hover:text-rose-600 transition-colors"
                      title="Delete Member"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
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

      {/* Pagination Controls */}
      <Pagination
        currentPage={currentPage}
        totalItems={filteredMembers.length}
        pageSize={PAGE_SIZE}
        onPageChange={(page) => setCurrentPage(page)}
      />

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
                  <p className="text-[10px] text-indigo-300 font-bold flex items-center gap-1 mt-0.5">
                    <Users className="w-3 h-3 text-indigo-400" />
                    <span>{selectedCardMember.committeeName || 'Executive Committee'}</span>
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">ID: {selectedCardMember.membershipNo}</p>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-white/10 text-[10px] text-slate-300">
                <div>
                  <p className="text-[9px] text-slate-400 uppercase">Valid Thru</p>
                  <p className="font-bold text-emerald-400">31-MAR-2027</p>
                </div>
                
                {/* QR Code Graphic */}
                <div className="p-1 bg-white rounded flex items-center justify-center">
                  <div className="w-12 h-12 bg-slate-900 text-white text-[8px] flex flex-col items-center justify-center font-mono p-1 text-center rounded">
                    <QrCode className="w-7 h-7 text-amber-400" />
                    <span className="text-[7px]">PASS</span>
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
                <label className="block text-slate-500 font-medium mb-1">Organization / Tenant *</label>
                <select
                  value={newForm.targetOrgId}
                  onChange={(e) => setNewForm({ ...newForm, targetOrgId: e.target.value })}
                  className="w-full p-2 rounded-xl bg-indigo-50/80 dark:bg-slate-800 border border-indigo-200 dark:border-slate-700 font-bold text-indigo-900 dark:text-indigo-200"
                >
                  {organizations.map((org) => (
                    <option key={org.id} value={org.id}>
                      {org.name} ({org.type})
                    </option>
                  ))}
                </select>
              </div>

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

              <div>
                <label className="block text-slate-500 font-medium mb-1">Assigned Committee *</label>
                <select
                  value={newForm.committeeName}
                  onChange={(e) => setNewForm({ ...newForm, committeeName: e.target.value })}
                  className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-slate-100"
                >
                  {AVAILABLE_COMMITTEES.map((comm) => (
                    <option key={comm} value={comm}>{comm}</option>
                  ))}
                </select>
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

      {/* View Member Profile Modal */}
      {viewingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative">
            <button
              onClick={() => setViewingMember(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4">
              <img src={viewingMember.photoUrl} alt={viewingMember.name} className="w-16 h-16 rounded-2xl object-cover border-2 border-rose-500 shadow" />
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white">{viewingMember.name}</h2>
                <p className="text-xs text-rose-600 dark:text-rose-400 font-bold uppercase">{viewingMember.roleInOrg}</p>
                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">{viewingMember.committeeName || 'Executive Committee'}</p>
                <p className="text-xs text-slate-400 font-mono">ID: {viewingMember.membershipNo}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <span className="text-slate-400 block text-[10px] font-semibold">Blood Group</span>
                <span className="font-extrabold text-rose-600 dark:text-rose-400 text-sm">{viewingMember.bloodGroup}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <span className="text-slate-400 block text-[10px] font-semibold">Annual Status</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-1 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Fees Paid (Active)
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <span className="text-slate-400 block text-[10px] font-semibold">Occupation & Business</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{viewingMember.occupation}</span>
                {viewingMember.businessName && <span className="block text-[11px] text-slate-500">{viewingMember.businessName}</span>}
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <span className="text-slate-400 block text-[10px] font-semibold">Family Size</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{viewingMember.familyMembersCount} Family Members</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 col-span-2">
                <span className="text-slate-400 block text-[10px] font-semibold">Contact Info</span>
                <span className="font-medium text-slate-800 dark:text-slate-200 block">{viewingMember.phone} | {viewingMember.email}</span>
                <span className="text-slate-500 text-[11px] block mt-0.5">{viewingMember.address}</span>
              </div>
              <div className="p-3 rounded-xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 col-span-2">
                <span className="text-rose-600 dark:text-rose-400 block text-[10px] font-bold">Emergency Contact</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{viewingMember.emergencyContact.name} ({viewingMember.emergencyContact.relation})</span>
                <span className="text-rose-600 dark:text-rose-400 text-xs block font-mono">{viewingMember.emergencyContact.phone}</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setViewingMember(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Member Modal */}
      {editingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setEditingMember(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Pencil className="w-4 h-4 text-amber-500" />
              <span>Edit Member: {editingMember.name}</span>
            </h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                onUpdateMember?.(editingMember);
                setEditingMember(null);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block text-slate-500 font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editingMember.name}
                  onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                  className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-medium mb-1">Assigned Committee</label>
                <select
                  value={editingMember.committeeName || 'Executive Committee'}
                  onChange={(e) => setEditingMember({ ...editingMember, committeeName: e.target.value })}
                  className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-slate-100"
                >
                  {AVAILABLE_COMMITTEES.map((comm) => (
                    <option key={comm} value={comm}>{comm}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Role / Designation</label>
                  <input
                    type="text"
                    value={editingMember.roleInOrg}
                    onChange={(e) => setEditingMember({ ...editingMember, roleInOrg: e.target.value })}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Blood Group</label>
                  <select
                    value={editingMember.bloodGroup}
                    onChange={(e) => setEditingMember({ ...editingMember, bloodGroup: e.target.value as any })}
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
                    value={editingMember.occupation}
                    onChange={(e) => setEditingMember({ ...editingMember, occupation: e.target.value })}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Business Name</label>
                  <input
                    type="text"
                    value={editingMember.businessName || ''}
                    onChange={(e) => setEditingMember({ ...editingMember, businessName: e.target.value })}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Mobile Phone</label>
                  <input
                    type="text"
                    required
                    value={editingMember.phone}
                    onChange={(e) => setEditingMember({ ...editingMember, phone: e.target.value })}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Family Count</label>
                  <input
                    type="number"
                    value={editingMember.familyMembersCount}
                    onChange={(e) => setEditingMember({ ...editingMember, familyMembersCount: Number(e.target.value) })}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingMember(null)}
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
