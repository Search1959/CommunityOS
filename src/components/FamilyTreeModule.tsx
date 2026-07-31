import React, { useState } from 'react';
import { 
  Network, 
  Users, 
  UserPlus, 
  Search, 
  Eye, 
  Pencil, 
  Trash2, 
  X, 
  Plus, 
  Heart, 
  Phone, 
  Mail, 
  MapPin, 
  Shield, 
  GitFork, 
  Sparkles,
  TreePine
} from 'lucide-react';
import { Organization, FamilyBranch } from '../types';
import { INITIAL_FAMILY_BRANCHES } from '../data/mockData';

interface FamilyTreeProps {
  activeOrg: Organization;
  members?: any[];
}

export const FamilyTreeModule: React.FC<FamilyTreeProps> = ({ activeOrg }) => {
  const [familyBranches, setFamilyBranches] = useState<FamilyBranch[]>(INITIAL_FAMILY_BRANCHES);
  const [search, setSearch] = useState('');
  const [selectedGotra, setSelectedGotra] = useState<string>('ALL');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewingBranch, setViewingBranch] = useState<FamilyBranch | null>(null);
  const [editingBranch, setEditingBranch] = useState<FamilyBranch | null>(null);

  // New Branch State
  const [newBranch, setNewBranch] = useState<Omit<FamilyBranch, 'id'>>({
    orgId: activeOrg.id,
    familyName: '',
    headOfFamily: '',
    gotra: 'Kashyap',
    ancestorFather: '',
    ancestorMother: '',
    spouse: '',
    occupation: '',
    childrenCount: 2,
    lineageMembersCount: 4,
    childrenNames: '',
    address: activeOrg.address || 'Kolkata, WB',
    phone: '+91 98300 00000',
    email: '',
    matrimonialProspectsCount: 0,
    notes: ''
  });

  const handleAddBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBranch.familyName.trim() || !newBranch.headOfFamily.trim()) return;

    const created: FamilyBranch = {
      ...newBranch,
      id: `fam-${Date.now()}`
    };

    setFamilyBranches([created, ...familyBranches]);
    setShowAddModal(false);
    setNewBranch({
      orgId: activeOrg.id,
      familyName: '',
      headOfFamily: '',
      gotra: 'Kashyap',
      ancestorFather: '',
      ancestorMother: '',
      spouse: '',
      occupation: '',
      childrenCount: 2,
      lineageMembersCount: 4,
      childrenNames: '',
      address: activeOrg.address || 'Kolkata, WB',
      phone: '+91 98300 00000',
      email: '',
      matrimonialProspectsCount: 0,
      notes: ''
    });
  };

  const handleUpdateBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBranch) return;

    setFamilyBranches(familyBranches.map(fb => fb.id === editingBranch.id ? editingBranch : fb));
    if (viewingBranch?.id === editingBranch.id) {
      setViewingBranch(editingBranch);
    }
    setEditingBranch(null);
  };

  const handleDeleteBranch = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete family branch "${name}"? This action cannot be undone.`)) {
      setFamilyBranches(familyBranches.filter(fb => fb.id !== id));
      if (viewingBranch?.id === id) setViewingBranch(null);
    }
  };

  // Unique Gotras
  const allGotras = Array.from(new Set(familyBranches.map(f => f.gotra)));

  const filteredBranches = familyBranches.filter(b => {
    const matchesSearch = 
      b.familyName.toLowerCase().includes(search.toLowerCase()) ||
      b.headOfFamily.toLowerCase().includes(search.toLowerCase()) ||
      b.gotra.toLowerCase().includes(search.toLowerCase()) ||
      b.ancestorFather.toLowerCase().includes(search.toLowerCase()) ||
      b.address.toLowerCase().includes(search.toLowerCase());

    const matchesGotra = selectedGotra === 'ALL' || b.gotra === selectedGotra;
    return matchesSearch && matchesGotra;
  });

  const totalMembers = familyBranches.reduce((acc, b) => acc + (b.lineageMembersCount || 0), 0);
  const totalMatrimonials = familyBranches.reduce((acc, b) => acc + (b.matrimonialProspectsCount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Network className="w-6 h-6 text-amber-500" />
            <span>Community Lineage & Family Tree Register</span>
          </h1>
          <p className="text-xs text-slate-500">
            Ancestral Lineage Mapping, Gotra Records, Family Units & Matrimonial Directory for {activeOrg.name}
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/20 flex items-center gap-2 shrink-0 transition-all cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Family Branch</span>
        </button>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
            <GitFork className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase text-slate-400">Family Clusters</p>
            <p className="text-lg font-black text-slate-900 dark:text-white">{familyBranches.length}</p>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase text-slate-400">Total Lineage Members</p>
            <p className="text-lg font-black text-blue-600 dark:text-blue-400">{totalMembers}</p>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase text-slate-400">Gotra Clusters</p>
            <p className="text-lg font-black text-rose-600 dark:text-rose-400">{allGotras.length}</p>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
            <Heart className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase text-slate-400">Matrimonial Candidates</p>
            <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">{totalMatrimonials}</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search family, gotra, head of family..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border-none text-xs focus:ring-2 focus:ring-amber-500 font-medium text-slate-900 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          <button
            onClick={() => setSelectedGotra('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              selectedGotra === 'ALL'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            All Gotras
          </button>
          {allGotras.map(gotra => (
            <button
              key={gotra}
              onClick={() => setSelectedGotra(gotra)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedGotra === gotra
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Gotra: {gotra}
            </button>
          ))}
        </div>
      </div>

      {/* Family Branches Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredBranches.map((branch) => (
          <div
            key={branch.id}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">{branch.familyName}</h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Head of Family: <span className="text-slate-800 dark:text-slate-200 font-bold">{branch.headOfFamily}</span>
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800 shrink-0">
                  {branch.lineageMembersCount} Lineage Members
                </span>
              </div>

              {/* Gotra & Occupation Badge */}
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 font-bold border border-rose-100 dark:border-rose-900">
                  Gotra: {branch.gotra}
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 font-medium">
                  {branch.occupation}
                </span>
                {branch.matrimonialProspectsCount ? (
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 font-bold flex items-center gap-1">
                    <Heart className="w-3 h-3 text-emerald-500" />
                    {branch.matrimonialProspectsCount} Matrimonial Prospect(s)
                  </span>
                ) : null}
              </div>

              {/* Tree Hierarchy Graphic Box */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs space-y-1.5 border border-slate-100 dark:border-slate-800">
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <TreePine className="w-3 h-3 text-amber-500" />
                  Lineage Hierarchy Tree:
                </p>
                <div className="pl-2 border-l-2 border-amber-500 space-y-1 text-slate-700 dark:text-slate-300 font-mono text-[11px]">
                  <p>├── Father (Ancestor): {branch.ancestorFather}</p>
                  <p>├── Self (Head): {branch.headOfFamily} ({branch.occupation})</p>
                  {branch.spouse && <p>├── Spouse: {branch.spouse}</p>}
                  <p>└── Children ({branch.childrenCount}): {branch.childrenNames || 'Registered Dependents'}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons (View, Edit, Delete) */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 gap-2">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setViewingBranch(branch)}
                  className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                  title="View Full Family Tree Profile"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View</span>
                </button>

                <button
                  onClick={() => setEditingBranch({ ...branch })}
                  className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                  title="Edit Family Branch Configuration"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>

                <button
                  onClick={() => handleDeleteBranch(branch.id, branch.familyName)}
                  className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors cursor-pointer"
                  title="Delete Family Branch"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                <span className="truncate max-w-[140px]">{branch.address}</span>
              </span>
            </div>
          </div>
        ))}

        {filteredBranches.length === 0 && (
          <div className="col-span-full text-center py-12 p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-3">
            <Network className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No family branches found</p>
            <p className="text-xs text-slate-400">Click "Add Family Branch" to register a new ancestral family unit.</p>
          </div>
        )}
      </div>

      {/* ADD FAMILY BRANCH MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white">Add New Family Branch Unit</h2>
                <p className="text-xs text-slate-500">Register ancestral lineage, gotra and family unit hierarchy</p>
              </div>
            </div>

            <form onSubmit={handleAddBranch} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-500 font-medium mb-1">Family Unit Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Subhash Chandra Bose Family Unit"
                  value={newBranch.familyName}
                  onChange={(e) => setNewBranch({ ...newBranch, familyName: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Head of Family Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Subhash Chandra Bose"
                    value={newBranch.headOfFamily}
                    onChange={(e) => setNewBranch({ ...newBranch, headOfFamily: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 font-medium mb-1">Gotra *</label>
                  <select
                    value={newBranch.gotra}
                    onChange={(e) => setNewBranch({ ...newBranch, gotra: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white"
                  >
                    <option value="Kashyap">Kashyap</option>
                    <option value="Bharadwaj">Bharadwaj</option>
                    <option value="Vashistha">Vashistha</option>
                    <option value="Sandilya">Sandilya</option>
                    <option value="Gautam">Gautam</option>
                    <option value="Agastya">Agastya</option>
                    <option value="Atri">Atri</option>
                    <option value="Vatsa">Vatsa</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Father (Ancestor) Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Late Haridas Chandra"
                    value={newBranch.ancestorFather}
                    onChange={(e) => setNewBranch({ ...newBranch, ancestorFather: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 font-medium mb-1">Mother Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Late Prabhavati Devi"
                    value={newBranch.ancestorMother}
                    onChange={(e) => setNewBranch({ ...newBranch, ancestorMother: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Spouse Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Emilie Bose"
                    value={newBranch.spouse}
                    onChange={(e) => setNewBranch({ ...newBranch, spouse: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 font-medium mb-1">Occupation / Profession</label>
                  <input
                    type="text"
                    placeholder="e.g. Senior Business Executive"
                    value={newBranch.occupation}
                    onChange={(e) => setNewBranch({ ...newBranch, occupation: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Total Lineage Members Count</label>
                  <input
                    type="number"
                    value={newBranch.lineageMembersCount}
                    onChange={(e) => setNewBranch({ ...newBranch, lineageMembersCount: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 font-medium mb-1">Children Count</label>
                  <input
                    type="number"
                    value={newBranch.childrenCount}
                    onChange={(e) => setNewBranch({ ...newBranch, childrenCount: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 font-medium mb-1">Children Names (Comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Anita Bose, Suraj Bose"
                  value={newBranch.childrenNames}
                  onChange={(e) => setNewBranch({ ...newBranch, childrenNames: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={newBranch.phone}
                    onChange={(e) => setNewBranch({ ...newBranch, phone: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 font-medium mb-1">Matrimonial Candidates Count</label>
                  <input
                    type="number"
                    value={newBranch.matrimonialProspectsCount}
                    onChange={(e) => setNewBranch({ ...newBranch, matrimonialProspectsCount: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 font-medium mb-1">Residential Address</label>
                <input
                  type="text"
                  placeholder="e.g. 15/2 Gariahat Road, Kolkata"
                  value={newBranch.address}
                  onChange={(e) => setNewBranch({ ...newBranch, address: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-medium mb-1">Lineage Notes / Family Background</label>
                <textarea
                  rows={2}
                  placeholder="Settled in region since 1950s. Annual festival host family..."
                  value={newBranch.notes}
                  onChange={(e) => setNewBranch({ ...newBranch, notes: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold shadow-md transition-all cursor-pointer"
                >
                  Save Family Branch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW FAMILY BRANCH DETAILS MODAL */}
      {viewingBranch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-2xl relative">
            <button
              onClick={() => setViewingBranch(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="p-3 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
                <Network className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">{viewingBranch.familyName}</h2>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                    Gotra: {viewingBranch.gotra}
                  </span>
                </div>
                <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold mt-0.5">
                  Head of Family: {viewingBranch.headOfFamily} ({viewingBranch.occupation})
                </p>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <p className="text-[10px] uppercase font-bold text-slate-400">Lineage Members</p>
                <p className="text-base font-black text-amber-600 dark:text-amber-400 mt-0.5">{viewingBranch.lineageMembersCount}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <p className="text-[10px] uppercase font-bold text-slate-400">Children Count</p>
                <p className="text-base font-black text-slate-900 dark:text-white mt-0.5">{viewingBranch.childrenCount}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <p className="text-[10px] uppercase font-bold text-slate-400">Matrimonial Prospects</p>
                <p className="text-base font-black text-emerald-600 dark:text-emerald-400 mt-0.5">{viewingBranch.matrimonialProspectsCount || 0}</p>
              </div>
            </div>

            {/* Tree Node Structure Box */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-100 dark:border-slate-700 space-y-2">
              <h4 className="font-extrabold text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
                <TreePine className="w-4 h-4 text-amber-500" />
                <span>Ancestral Node Breakdown:</span>
              </h4>
              <div className="pl-3 border-l-2 border-amber-500 text-xs font-mono space-y-1.5 text-slate-700 dark:text-slate-200">
                <p>├── Father (Ancestor): <span className="font-bold">{viewingBranch.ancestorFather}</span></p>
                {viewingBranch.ancestorMother && <p>├── Mother: <span className="font-bold">{viewingBranch.ancestorMother}</span></p>}
                <p>├── Head of Family: <span className="font-bold">{viewingBranch.headOfFamily}</span> ({viewingBranch.occupation})</p>
                {viewingBranch.spouse && <p>├── Spouse: <span className="font-bold">{viewingBranch.spouse}</span></p>}
                <p>└── Children ({viewingBranch.childrenCount}): <span className="font-bold">{viewingBranch.childrenNames || 'Registered Dependents'}</span></p>
              </div>
            </div>

            {/* Contact & Address Details */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <p className="text-[10px] uppercase font-bold text-slate-400">Phone Contact</p>
                <p className="font-mono font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{viewingBranch.phone}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <p className="text-[10px] uppercase font-bold text-slate-400">Email Address</p>
                <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{viewingBranch.email || 'N/A'}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 col-span-2">
                <p className="text-[10px] uppercase font-bold text-slate-400">Residential Address</p>
                <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{viewingBranch.address}</p>
              </div>
            </div>

            {viewingBranch.notes && (
              <div className="text-xs space-y-1">
                <h4 className="font-bold text-slate-400 uppercase text-[10px]">Family History & Notes</h4>
                <p className="text-slate-600 dark:text-slate-300 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 leading-relaxed">
                  {viewingBranch.notes}
                </p>
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => {
                  const target = viewingBranch;
                  setViewingBranch(null);
                  setEditingBranch({ ...target });
                }}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold flex items-center gap-1.5 cursor-pointer"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>Edit This Branch</span>
              </button>

              <button
                type="button"
                onClick={() => setViewingBranch(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-200 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT FAMILY BRANCH MODAL */}
      {editingBranch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setEditingBranch(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <Pencil className="w-5 h-5 text-amber-500" />
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">Edit Family Branch: {editingBranch.familyName}</h2>
            </div>

            <form onSubmit={handleUpdateBranch} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-500 font-medium mb-1">Family Unit Name *</label>
                <input
                  type="text"
                  required
                  value={editingBranch.familyName}
                  onChange={(e) => setEditingBranch({ ...editingBranch, familyName: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Head of Family *</label>
                  <input
                    type="text"
                    required
                    value={editingBranch.headOfFamily}
                    onChange={(e) => setEditingBranch({ ...editingBranch, headOfFamily: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 font-medium mb-1">Gotra *</label>
                  <select
                    value={editingBranch.gotra}
                    onChange={(e) => setEditingBranch({ ...editingBranch, gotra: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white"
                  >
                    <option value="Kashyap">Kashyap</option>
                    <option value="Bharadwaj">Bharadwaj</option>
                    <option value="Vashistha">Vashistha</option>
                    <option value="Sandilya">Sandilya</option>
                    <option value="Gautam">Gautam</option>
                    <option value="Agastya">Agastya</option>
                    <option value="Atri">Atri</option>
                    <option value="Vatsa">Vatsa</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Father (Ancestor)</label>
                  <input
                    type="text"
                    value={editingBranch.ancestorFather}
                    onChange={(e) => setEditingBranch({ ...editingBranch, ancestorFather: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 font-medium mb-1">Mother (Ancestor)</label>
                  <input
                    type="text"
                    value={editingBranch.ancestorMother || ''}
                    onChange={(e) => setEditingBranch({ ...editingBranch, ancestorMother: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Spouse Name</label>
                  <input
                    type="text"
                    value={editingBranch.spouse || ''}
                    onChange={(e) => setEditingBranch({ ...editingBranch, spouse: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 font-medium mb-1">Occupation</label>
                  <input
                    type="text"
                    value={editingBranch.occupation}
                    onChange={(e) => setEditingBranch({ ...editingBranch, occupation: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Lineage Members Count</label>
                  <input
                    type="number"
                    value={editingBranch.lineageMembersCount}
                    onChange={(e) => setEditingBranch({ ...editingBranch, lineageMembersCount: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 font-medium mb-1">Children Count</label>
                  <input
                    type="number"
                    value={editingBranch.childrenCount}
                    onChange={(e) => setEditingBranch({ ...editingBranch, childrenCount: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 font-medium mb-1">Children Names</label>
                <input
                  type="text"
                  value={editingBranch.childrenNames || ''}
                  onChange={(e) => setEditingBranch({ ...editingBranch, childrenNames: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={editingBranch.phone}
                    onChange={(e) => setEditingBranch({ ...editingBranch, phone: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 font-medium mb-1">Matrimonial Prospects</label>
                  <input
                    type="number"
                    value={editingBranch.matrimonialProspectsCount || 0}
                    onChange={(e) => setEditingBranch({ ...editingBranch, matrimonialProspectsCount: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 font-medium mb-1">Residential Address</label>
                <input
                  type="text"
                  value={editingBranch.address}
                  onChange={(e) => setEditingBranch({ ...editingBranch, address: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-medium mb-1">Notes / Background</label>
                <textarea
                  rows={2}
                  value={editingBranch.notes || ''}
                  onChange={(e) => setEditingBranch({ ...editingBranch, notes: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingBranch(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold shadow-md cursor-pointer"
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
