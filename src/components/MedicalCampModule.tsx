import React, { useState } from 'react';
import { 
  Stethoscope, 
  Heart, 
  Calendar, 
  Users, 
  MapPin, 
  Building2, 
  UserCheck, 
  Plus, 
  Search, 
  Eye, 
  Pencil, 
  Trash2, 
  X, 
  Phone, 
  CheckCircle2, 
  Clock,
  Sparkles,
  UserPlus
} from 'lucide-react';
import { Organization, MedicalCamp } from '../types';
import { INITIAL_MEDICAL_CAMPS } from '../data/mockData';

interface MedicalCampModuleProps {
  activeOrg: Organization;
}

export const MedicalCampModule: React.FC<MedicalCampModuleProps> = ({ activeOrg }) => {
  const [camps, setCamps] = useState<MedicalCamp[]>(INITIAL_MEDICAL_CAMPS);
  const [search, setSearch] = useState('');
  const [statusTab, setStatusTab] = useState<'ALL' | 'Upcoming' | 'Ongoing' | 'Completed'>('ALL');

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewingCamp, setViewingCamp] = useState<MedicalCamp | null>(null);
  const [editingCamp, setEditingCamp] = useState<MedicalCamp | null>(null);

  // New Camp Form State
  const [newCamp, setNewCamp] = useState<Omit<MedicalCamp, 'id'>>({
    orgId: activeOrg.id,
    title: '',
    category: 'General OPD & Diabetes',
    hospitalPartner: '',
    doctors: '',
    venue: activeOrg.address || 'Community Hall Premises',
    date: '2026-08-20',
    time: '09:00 AM - 04:00 PM',
    description: '',
    status: 'Upcoming',
    enrolledPatientsCount: 0,
    beneficiariesCount: 0,
    contactPerson: '',
    phone: activeOrg.phone || '+91 98300 00000'
  });

  const handleCreateCamp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCamp.title.trim()) return;

    const created: MedicalCamp = {
      ...newCamp,
      id: `camp-${Date.now()}`
    };

    setCamps([created, ...camps]);
    setShowCreateModal(false);
    setNewCamp({
      orgId: activeOrg.id,
      title: '',
      category: 'General OPD & Diabetes',
      hospitalPartner: '',
      doctors: '',
      venue: activeOrg.address || 'Community Hall Premises',
      date: '2026-08-20',
      time: '09:00 AM - 04:00 PM',
      description: '',
      status: 'Upcoming',
      enrolledPatientsCount: 0,
      beneficiariesCount: 0,
      contactPerson: '',
      phone: activeOrg.phone || '+91 98300 00000'
    });
  };

  const handleUpdateCamp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCamp) return;

    setCamps(camps.map(c => c.id === editingCamp.id ? editingCamp : c));
    if (viewingCamp?.id === editingCamp.id) {
      setViewingCamp(editingCamp);
    }
    setEditingCamp(null);
  };

  const handleDeleteCamp = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete medical camp "${title}"? This action cannot be undone.`)) {
      setCamps(camps.filter(c => c.id !== id));
      if (viewingCamp?.id === id) setViewingCamp(null);
    }
  };

  const handleEnrollPatient = (campId: string) => {
    setCamps(camps.map(c => {
      if (c.id === campId) {
        const updatedCount = c.enrolledPatientsCount + 1;
        const updated = { ...c, enrolledPatientsCount: updatedCount };
        if (viewingCamp?.id === campId) setViewingCamp(updated);
        return updated;
      }
      return c;
    }));
  };

  const filteredCamps = camps.filter(c => {
    const matchesSearch = 
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.hospitalPartner.toLowerCase().includes(search.toLowerCase()) ||
      c.doctors.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase()) ||
      c.venue.toLowerCase().includes(search.toLowerCase());
    
    const matchesTab = statusTab === 'ALL' || c.status === statusTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Stethoscope className="w-6 h-6 text-teal-500" />
            <span>Medical Camps & Free Health Checkups</span>
          </h1>
          <p className="text-xs text-slate-500">
            Eye Camps, Diabetes Screening, Cardiology OPD, Free Medicines & Doctor Prescriptions for {activeOrg.name}
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold text-xs shadow-lg shadow-teal-600/20 flex items-center gap-2 shrink-0 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Organize Free Medical Camp</span>
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase text-slate-400">Total Health Camps</p>
            <p className="text-lg font-black text-slate-900 dark:text-white">{camps.length}</p>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase text-slate-400">Upcoming Drives</p>
            <p className="text-lg font-black text-blue-600 dark:text-blue-400">
              {camps.filter(c => c.status === 'Upcoming').length}
            </p>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase text-slate-400">Enrolled Patients</p>
            <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">
              {camps.reduce((acc, c) => acc + (c.enrolledPatientsCount || 0), 0)}
            </p>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
            <Heart className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase text-slate-400">Total Beneficiaries</p>
            <p className="text-lg font-black text-purple-600 dark:text-purple-400">
              {camps.reduce((acc, c) => acc + (c.beneficiariesCount || c.enrolledPatientsCount || 0), 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search camp, doctor, hospital..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border-none text-xs focus:ring-2 focus:ring-teal-500 font-medium text-slate-900 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {(['ALL', 'Upcoming', 'Ongoing', 'Completed'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusTab(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                statusTab === tab
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {tab === 'ALL' ? 'All Camps' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Medical Camps Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredCamps.map((camp) => (
          <div 
            key={camp.id}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  camp.status === 'Upcoming' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' :
                  camp.status === 'Ongoing' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                  camp.status === 'Completed' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                  'bg-slate-100 text-slate-800'
                }`}>
                  {camp.status} Drive
                </span>

                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-50 text-teal-800 dark:bg-teal-950/70 dark:text-teal-300 border border-teal-100 dark:border-teal-900">
                  {camp.category}
                </span>
              </div>

              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white leading-snug">{camp.title}</h2>
                <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                  <Building2 className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                  <span className="truncate">{camp.hospitalPartner}</span>
                </p>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                {camp.description}
              </p>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                  <span className="flex items-center gap-1.5 text-[11px]">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {camp.date} ({camp.time})
                  </span>
                  <span className="font-extrabold text-teal-600 dark:text-teal-400">
                    {camp.enrolledPatientsCount} Enrolled
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 truncate">
                  <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <span className="truncate">{camp.venue}</span>
                </div>
              </div>
            </div>

            {/* Card Action Buttons (View, Edit, Delete, Enroll) */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 gap-2">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setViewingCamp(camp)}
                  className="px-2.5 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 hover:bg-teal-100 dark:hover:bg-teal-900 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                  title="View Details"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View</span>
                </button>

                <button
                  onClick={() => setEditingCamp({ ...camp })}
                  className="px-2.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                  title="Edit Camp"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>

                <button
                  onClick={() => handleDeleteCamp(camp.id, camp.title)}
                  className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors cursor-pointer"
                  title="Delete Camp"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {camp.status !== 'Completed' && (
                <button
                  onClick={() => handleEnrollPatient(camp.id)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5 text-teal-400" />
                  <span>Enroll Patient</span>
                </button>
              )}
            </div>
          </div>
        ))}

        {filteredCamps.length === 0 && (
          <div className="col-span-full text-center py-12 p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-3">
            <Stethoscope className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No medical camps match your criteria</p>
            <p className="text-xs text-slate-400">Click "Organize Free Medical Camp" above to create a new health drive.</p>
          </div>
        )}
      </div>

      {/* CREATE MEDICAL CAMP MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white">Organize Free Medical Camp</h2>
                <p className="text-xs text-slate-500">Schedule new health screening or doctor checkup drive</p>
              </div>
            </div>

            <form onSubmit={handleCreateCamp} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-500 font-medium mb-1">Camp Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Free Eye Cataract & Glaucoma Surgery Camp"
                  value={newCamp.title}
                  onChange={(e) => setNewCamp({ ...newCamp, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Category / Specialty *</label>
                  <select
                    value={newCamp.category}
                    onChange={(e) => setNewCamp({ ...newCamp, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white"
                  >
                    <option value="Cardiac & Eye Screening">Cardiac & Eye Screening</option>
                    <option value="General OPD & Diabetes">General OPD & Diabetes</option>
                    <option value="Pediatric Health Drive">Pediatric Health Drive</option>
                    <option value="Dental & ENT Camp">Dental & ENT Camp</option>
                    <option value="Orthopedic & Bone Health">Orthopedic & Bone Health</option>
                    <option value="Blood Donation & Pathology">Blood Donation & Pathology</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-500 font-medium mb-1">Status</label>
                  <select
                    value={newCamp.status}
                    onChange={(e) => setNewCamp({ ...newCamp, status: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white"
                  >
                    <option value="Upcoming">Upcoming</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Hospital / Clinical Partner *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apollo Hospitals / Lions Club"
                    value={newCamp.hospitalPartner}
                    onChange={(e) => setNewCamp({ ...newCamp, hospitalPartner: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 font-medium mb-1">Attending Doctors</label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. S. K. Roy, Dr. A. Sen"
                    value={newCamp.doctors}
                    onChange={(e) => setNewCamp({ ...newCamp, doctors: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={newCamp.date}
                    onChange={(e) => setNewCamp({ ...newCamp, date: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 font-medium mb-1">Timings</label>
                  <input
                    type="text"
                    placeholder="09:00 AM - 04:00 PM"
                    value={newCamp.time}
                    onChange={(e) => setNewCamp({ ...newCamp, time: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 font-medium mb-1">Venue Address *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Community Hall Premises"
                  value={newCamp.venue}
                  onChange={(e) => setNewCamp({ ...newCamp, venue: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-medium mb-1">Description & Key Highlights</label>
                <textarea
                  rows={2}
                  placeholder="Free medicines, spectacle distribution, ECG & Sugar tests..."
                  value={newCamp.description}
                  onChange={(e) => setNewCamp({ ...newCamp, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Organizer Contact Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Debabrata Mukherjee"
                    value={newCamp.contactPerson}
                    onChange={(e) => setNewCamp({ ...newCamp, contactPerson: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 font-medium mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={newCamp.phone}
                    onChange={(e) => setNewCamp({ ...newCamp, phone: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold transition-all shadow-md cursor-pointer"
                >
                  Publish Medical Camp
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW CAMP DETAILS MODAL */}
      {viewingCamp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-2xl relative">
            <button
              onClick={() => setViewingCamp(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="p-3 rounded-2xl bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400">
                <Stethoscope className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  viewingCamp.status === 'Upcoming' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' :
                  viewingCamp.status === 'Ongoing' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                  'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                }`}>
                  {viewingCamp.status} Medical Drive
                </span>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-1">{viewingCamp.title}</h2>
                <p className="text-xs text-teal-600 dark:text-teal-400 font-semibold">{viewingCamp.category}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <p className="text-[10px] uppercase font-bold text-slate-400">Hospital / Partner</p>
                <p className="font-bold text-slate-900 dark:text-white mt-0.5">{viewingCamp.hospitalPartner}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <p className="text-[10px] uppercase font-bold text-slate-400">Enrolled Patients</p>
                <p className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{viewingCamp.enrolledPatientsCount} Citizens</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <p className="text-[10px] uppercase font-bold text-slate-400">Date & Time</p>
                <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{viewingCamp.date} ({viewingCamp.time})</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <p className="text-[10px] uppercase font-bold text-slate-400">Organizer Phone</p>
                <p className="font-mono font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{viewingCamp.phone}</p>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <h4 className="font-bold text-slate-400 uppercase text-[10px]">Attending Specialists & Doctors</h4>
                <p className="text-slate-800 dark:text-slate-200 font-semibold mt-0.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800">
                  {viewingCamp.doctors || 'Specialist Doctors from Partner Medical College'}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-400 uppercase text-[10px]">Venue Location</h4>
                <p className="text-slate-800 dark:text-slate-200 font-semibold mt-0.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800">
                  {viewingCamp.venue}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-400 uppercase text-[10px]">Description & Free Services</h4>
                <p className="text-slate-600 dark:text-slate-300 mt-0.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 leading-relaxed">
                  {viewingCamp.description}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => {
                  const target = viewingCamp;
                  setViewingCamp(null);
                  setEditingCamp({ ...target });
                }}
                className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>Edit Camp</span>
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleEnrollPatient(viewingCamp.id)}
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Enroll Patient (+1)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewingCamp(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-200 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT CAMP MODAL */}
      {editingCamp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setEditingCamp(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <Pencil className="w-5 h-5 text-amber-500" />
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">Edit Medical Camp: {editingCamp.title}</h2>
            </div>

            <form onSubmit={handleUpdateCamp} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-500 font-medium mb-1">Camp Title *</label>
                <input
                  type="text"
                  required
                  value={editingCamp.title}
                  onChange={(e) => setEditingCamp({ ...editingCamp, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Category *</label>
                  <select
                    value={editingCamp.category}
                    onChange={(e) => setEditingCamp({ ...editingCamp, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white"
                  >
                    <option value="Cardiac & Eye Screening">Cardiac & Eye Screening</option>
                    <option value="General OPD & Diabetes">General OPD & Diabetes</option>
                    <option value="Pediatric Health Drive">Pediatric Health Drive</option>
                    <option value="Dental & ENT Camp">Dental & ENT Camp</option>
                    <option value="Orthopedic & Bone Health">Orthopedic & Bone Health</option>
                    <option value="Blood Donation & Pathology">Blood Donation & Pathology</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-500 font-medium mb-1">Status</label>
                  <select
                    value={editingCamp.status}
                    onChange={(e) => setEditingCamp({ ...editingCamp, status: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white"
                  >
                    <option value="Upcoming">Upcoming</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Hospital Partner</label>
                  <input
                    type="text"
                    value={editingCamp.hospitalPartner}
                    onChange={(e) => setEditingCamp({ ...editingCamp, hospitalPartner: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 font-medium mb-1">Doctors</label>
                  <input
                    type="text"
                    value={editingCamp.doctors}
                    onChange={(e) => setEditingCamp({ ...editingCamp, doctors: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Date</label>
                  <input
                    type="date"
                    value={editingCamp.date}
                    onChange={(e) => setEditingCamp({ ...editingCamp, date: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 font-medium mb-1">Timings</label>
                  <input
                    type="text"
                    value={editingCamp.time}
                    onChange={(e) => setEditingCamp({ ...editingCamp, time: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Enrolled Patients</label>
                  <input
                    type="number"
                    value={editingCamp.enrolledPatientsCount}
                    onChange={(e) => setEditingCamp({ ...editingCamp, enrolledPatientsCount: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 font-medium mb-1">Venue Address</label>
                  <input
                    type="text"
                    value={editingCamp.venue}
                    onChange={(e) => setEditingCamp({ ...editingCamp, venue: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 font-medium mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingCamp.description}
                  onChange={(e) => setEditingCamp({ ...editingCamp, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingCamp(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold transition-all shadow-md cursor-pointer"
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
