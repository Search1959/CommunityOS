import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Award, 
  QrCode, 
  CheckCircle, 
  CheckCircle2,
  Image as ImageIcon, 
  Download, 
  Plus, 
  Sparkles,
  Eye,
  Pencil,
  Trash2,
  Search,
  X,
  Ticket,
  Printer,
  ShieldCheck,
  UserCheck,
  Share2
} from 'lucide-react';
import { EventItem, Organization } from '../types';
import { Pagination } from './Pagination';

interface EventModuleProps {
  events: EventItem[];
  activeOrg: Organization;
  onOpenQRScanner: () => void;
  onAddEvent?: (newEvent: EventItem) => void;
  onUpdateEvent?: (updatedEvent: EventItem) => void;
  onDeleteEvent?: (eventId: string) => void;
}

export const EventModule: React.FC<EventModuleProps> = ({
  events,
  activeOrg,
  onOpenQRScanner,
  onAddEvent,
  onUpdateEvent,
  onDeleteEvent,
}) => {
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(events[0] || null);

  useEffect(() => {
    if (events && events.length > 0) {
      setSelectedEvent(events[0]);
    } else {
      setSelectedEvent(null);
    }
  }, [activeOrg.id, events]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewingEvent, setViewingEvent] = useState<EventItem | null>(null);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);

  // New Event Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Festival Puja');
  const [venue, setVenue] = useState('Main Community Park Ground');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [expectedAttendees, setExpectedAttendees] = useState(10000);
  const [budget, setBudget] = useState(2500000);
  const [description, setDescription] = useState('');

  // Enroll / Visitor Registration State
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [enrollForm, setEnrollForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    attendeeType: 'Visitor / Community Member',
    passCount: 1,
    specialNeeds: ''
  });
  const [generatedPass, setGeneratedPass] = useState<{
    passId: string;
    fullName: string;
    phone: string;
    eventTitle: string;
    venue: string;
    date: string;
    passCount: number;
    qrCodeUrl: string;
  } | null>(null);

  // Participation Certificate Generator State
  const [showCertModal, setShowCertModal] = useState(false);
  const [certForm, setCertForm] = useState({
    participantName: '',
    role: 'Volunteer Service',
    certificateType: 'Appreciation & Excellence',
    issueDate: new Date().toISOString().split('T')[0],
    certificateId: ''
  });

  const handleEnrollSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent || !enrollForm.fullName.trim()) return;

    const passId = `PASS-${activeOrg.slug.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const passCount = Number(enrollForm.passCount) || 1;
    
    const passData = {
      passId,
      fullName: enrollForm.fullName,
      phone: enrollForm.phone || '+91 98300 11223',
      eventTitle: selectedEvent.title,
      venue: selectedEvent.venue,
      date: selectedEvent.startDate,
      passCount,
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(passId)}`
    };

    setGeneratedPass(passData);

    // Update registeredCount on selected event
    const updatedEvt: EventItem = {
      ...selectedEvent,
      registeredCount: (selectedEvent.registeredCount || 0) + passCount
    };

    if (onUpdateEvent) {
      onUpdateEvent(updatedEvt);
    }
    setSelectedEvent(updatedEvt);
  };

  const handleDownloadPass = () => {
    if (!generatedPass) return;

    const passContent = `====================================================
${activeOrg.name.toUpperCase()} - OFFICIAL DIGITAL GATE PASS
====================================================
Pass Reference ID : ${generatedPass.passId}
Event Name        : ${generatedPass.eventTitle}
Venue Location    : ${generatedPass.venue}
Event Date        : ${generatedPass.date}
----------------------------------------------------
Primary Visitor   : ${generatedPass.fullName}
Contact Phone     : ${generatedPass.phone}
Admit Count       : ${generatedPass.passCount} Person(s)
Status            : VERIFIED GATE E-PASS
----------------------------------------------------
SECURITY RULES:
1. Show this e-pass QR at the entry gate.
2. QR Scanner at gate will record entry time.
3. Keep phone brightness at high for fast scanning.

====================================================
Issued by ${activeOrg.name} Event Desk
====================================================`;

    const blob = new Blob([passContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GatePass_${generatedPass.passId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadCertificate = () => {
    if (!selectedEvent || !certForm.participantName.trim()) return;

    const certContent = `
====================================================================================================
                                 CERTIFICATE OF PARTICIPATION & HONOR
====================================================================================================

                                    PROUDLY PRESENTED BY
                              ${activeOrg.name.toUpperCase()}

                                            TO

                                  ${certForm.participantName.toUpperCase()}

     In grateful recognition of exemplary dedication and outstanding service rendered as
     "${certForm.role.toUpperCase()}" during the organization and execution of:

                                 "${selectedEvent.title.toUpperCase()}"
     Held at: ${selectedEvent.venue} on ${certForm.issueDate}

     Certificate Category : ${certForm.certificateType}
     Verification ID      : ${certForm.certificateId}
     Digital Verification : ${activeOrg.websiteDomain || 'communityos.org'}/verify/${certForm.certificateId}

----------------------------------------------------------------------------------------------------
  Authorized Signatory                                        General Secretary / President
  ${activeOrg.name} Committee                                  Organizing Executive Board
====================================================================================================
`;

    const blob = new Blob([certContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Certificate_${certForm.participantName.replace(/[^a-zA-Z0-9_-]/g, '_')}_${certForm.certificateId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredEvents = events.filter((e) =>
    e.title.toLowerCase().includes(search.toLowerCase()) ||
    e.category.toLowerCase().includes(search.toLowerCase()) ||
    e.venue.toLowerCase().includes(search.toLowerCase())
  );

  const PAGE_SIZE = 20;
  const paginatedEvents = filteredEvents.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const newEvt: EventItem = {
      id: `evt-${Date.now()}`,
      orgId: activeOrg.id,
      title,
      category,
      startDate,
      endDate: startDate,
      venue,
      expectedAttendees: Number(expectedAttendees),
      registeredCount: 0,
      volunteersAssigned: 10,
      budget: Number(budget),
      status: 'Upcoming',
      description: description || 'Community celebration event organized for members and visitors.',
      bannerUrl: 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&q=80&w=800'
    };

    onAddEvent?.(newEvt);
    setSelectedEvent(newEvt);
    setShowAddModal(false);
    setTitle('');
    setDescription('');
  };

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-rose-500" />
            <span>Community Events & Festival Master</span>
          </h1>
          <p className="text-xs text-slate-500">
            Volunteer Duty Assignments, QR Attendance, Auto Certificates & Festival Schedules
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create Event</span>
          </button>

          <button
            onClick={onOpenQRScanner}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shrink-0"
          >
            <QrCode className="w-4 h-4 text-amber-400" />
            <span>Scan Gate QR</span>
          </button>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Event Cards List */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              placeholder="Search event title or venue..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 placeholder-slate-400 outline-none focus:border-rose-500"
            />
          </div>

          <div className="space-y-3">
            {paginatedEvents.map((evt) => (
              <div
                key={evt.id}
                onClick={() => setSelectedEvent(evt)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  selectedEvent?.id === evt.id
                    ? 'bg-rose-50/80 dark:bg-rose-950/40 border-rose-400 dark:border-rose-800 shadow-md'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                    {evt.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-bold text-emerald-600 mr-1">
                      {evt.status}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); setViewingEvent(evt); }}
                      className="p-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-indigo-600"
                      title="View Details"
                    >
                      <Eye className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setEditingEvent(evt); }}
                      className="p-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-amber-600"
                      title="Edit Event"
                    >
                      <Pencil className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Delete event ${evt.title}?`)) {
                          onDeleteEvent?.(evt.id);
                        }
                      }}
                      className="p-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-rose-600"
                      title="Delete Event"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <h3 className="text-xs font-bold text-slate-900 dark:text-white mt-1">{evt.title}</h3>
                
                <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-2">
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {evt.startDate}</span>
                  <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {evt.registeredCount} Enrolled</span>
                </div>
              </div>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalItems={filteredEvents.length}
            pageSize={PAGE_SIZE}
            onPageChange={(p) => setCurrentPage(p)}
          />
        </div>

        {/* Selected Event Details Panel */}
        {selectedEvent && (
          <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            
            <div className="h-44 rounded-xl overflow-hidden relative bg-slate-900">
              <img src={selectedEvent.bannerUrl} alt={selectedEvent.title} className="w-full h-full object-cover opacity-80" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent p-4 flex flex-col justify-end text-white">
                <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-amber-500 text-slate-950 w-max mb-1">
                  {selectedEvent.category}
                </span>
                <h2 className="text-lg font-bold">{selectedEvent.title}</h2>
                <p className="text-xs text-slate-300 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  <span>{selectedEvent.venue}</span>
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {selectedEvent.description}
            </p>

            {/* Event Metrics */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <p className="text-[10px] text-slate-400 uppercase font-bold">Expected Footfall</p>
                <p className="text-sm font-black text-slate-900 dark:text-white mt-0.5">{selectedEvent.expectedAttendees.toLocaleString('en-IN')}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <p className="text-[10px] text-slate-400 uppercase font-bold">Volunteers Allocated</p>
                <p className="text-sm font-black text-emerald-600 mt-0.5">{selectedEvent.volunteersAssigned} Volunteers</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <p className="text-[10px] text-slate-400 uppercase font-bold">Sanctioned Budget</p>
                <p className="text-sm font-black text-amber-600 mt-0.5">₹{(selectedEvent.budget/100000).toFixed(1)} Lakhs</p>
              </div>
            </div>

// Actions & Auto Certificate
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => {
                  setEnrollForm({
                    fullName: '',
                    phone: '',
                    email: '',
                    attendeeType: 'Visitor / Community Member',
                    passCount: 1,
                    specialNeeds: ''
                  });
                  setGeneratedPass(null);
                  setShowEnrollModal(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-extrabold text-xs shadow-md hover:shadow-rose-500/25 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Ticket className="w-4 h-4 text-rose-200" />
                <span>Enroll as Attendee / Visitor</span>
              </button>

              <button
                onClick={() => {
                  setCertForm({
                    participantName: '',
                    role: 'Volunteer Service',
                    certificateType: 'Appreciation & Excellence',
                    issueDate: new Date().toISOString().split('T')[0],
                    certificateId: `CERT-${activeOrg.slug.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`
                  });
                  setShowCertModal(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <Award className="w-4 h-4 text-amber-400" />
                <span>Generate Participation Certificate</span>
              </button>
            </div>

          </div>
        )}

      </div>

      {/* Add Event Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-rose-500" />
              <span>Create New Festival Event</span>
            </h2>

            <form onSubmit={handleCreateSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-500 font-medium mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Mahashtami Anjali & Cultural Night"
                  className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium"
                  >
                    <option value="Festival Puja">Festival Puja</option>
                    <option value="Cultural Performance">Cultural Performance</option>
                    <option value="Blood Donation">Blood Donation</option>
                    <option value="Community Feast">Community Feast</option>
                    <option value="Sports Tournament">Sports Tournament</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Event Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 font-medium mb-1">Venue Grounds</label>
                <input
                  type="text"
                  required
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  placeholder="e.g. Main Park Grounds"
                  className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Expected Footfall</label>
                  <input
                    type="number"
                    value={expectedAttendees}
                    onChange={(e) => setExpectedAttendees(Number(e.target.value))}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Budget (₹)</label>
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 font-medium mb-1">Event Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Schedule & details..."
                  className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition-all"
                >
                  Create Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Event Modal */}
      {viewingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setViewingEvent(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-rose-500" />
              <span>Event Details</span>
            </h2>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs space-y-2 border border-slate-200 dark:border-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-400">Title:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{viewingEvent.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Category:</span>
                <span className="font-semibold text-rose-600 dark:text-rose-400">{viewingEvent.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Venue:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{viewingEvent.venue}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Date:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{viewingEvent.startDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Expected Attendees:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{viewingEvent.expectedAttendees.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Budget:</span>
                <span className="font-bold text-amber-600">₹{viewingEvent.budget.toLocaleString('en-IN')}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                <span className="text-slate-400 block mb-1">Description:</span>
                <p className="text-slate-700 dark:text-slate-300">{viewingEvent.description}</p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setViewingEvent(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Event Modal */}
      {editingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setEditingEvent(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Pencil className="w-4 h-4 text-amber-500" />
              <span>Edit Event: {editingEvent.title}</span>
            </h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                onUpdateEvent?.(editingEvent);
                setEditingEvent(null);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block text-slate-500 font-medium mb-1">Event Title</label>
                <input
                  type="text"
                  required
                  value={editingEvent.title}
                  onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                  className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Category</label>
                  <input
                    type="text"
                    value={editingEvent.category}
                    onChange={(e) => setEditingEvent({ ...editingEvent, category: e.target.value })}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Venue</label>
                  <input
                    type="text"
                    value={editingEvent.venue}
                    onChange={(e) => setEditingEvent({ ...editingEvent, venue: e.target.value })}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Expected Footfall</label>
                  <input
                    type="number"
                    value={editingEvent.expectedAttendees}
                    onChange={(e) => setEditingEvent({ ...editingEvent, expectedAttendees: Number(e.target.value) })}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Budget (₹)</label>
                  <input
                    type="number"
                    value={editingEvent.budget}
                    onChange={(e) => setEditingEvent({ ...editingEvent, budget: Number(e.target.value) })}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 font-medium mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingEvent.description}
                  onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                  className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingEvent(null)}
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

      {/* ENROLLMENT / GATE PASS MODAL */}
      {showEnrollModal && selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => { setShowEnrollModal(false); setGeneratedPass(null); }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {!generatedPass ? (
              <>
                <div className="flex items-center gap-2">
                  <div className="p-2.5 rounded-2xl bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400">
                    <Ticket className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold text-slate-900 dark:text-white">Visitor & Attendee Registration</h2>
                    <p className="text-xs text-slate-500">{selectedEvent.title}</p>
                  </div>
                </div>

                <form onSubmit={handleEnrollSubmit} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-500 font-medium mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ananya Sen"
                      value={enrollForm.fullName}
                      onChange={(e) => setEnrollForm({ ...enrollForm, fullName: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-500 font-medium mb-1">Mobile / WhatsApp *</label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98300 11223"
                        value={enrollForm.phone}
                        onChange={(e) => setEnrollForm({ ...enrollForm, phone: e.target.value })}
                        className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-500 font-medium mb-1">Pass Count *</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        required
                        value={enrollForm.passCount}
                        onChange={(e) => setEnrollForm({ ...enrollForm, passCount: Number(e.target.value) })}
                        className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-500 font-medium mb-1">Visitor Category</label>
                    <select
                      value={enrollForm.attendeeType}
                      onChange={(e) => setEnrollForm({ ...enrollForm, attendeeType: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white"
                    >
                      <option value="Visitor / Community Member">Visitor / Community Member</option>
                      <option value="Registered Society Member">Registered Society Member</option>
                      <option value="Festival Volunteer">Festival Volunteer</option>
                      <option value="VIP / Invited Guest">VIP / Invited Guest</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-500 font-medium mb-1">Special Assistance / Notes</label>
                    <input
                      type="text"
                      placeholder="e.g. Wheelchair assistance or VIP seating request"
                      value={enrollForm.specialNeeds}
                      onChange={(e) => setEnrollForm({ ...enrollForm, specialNeeds: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowEnrollModal(false)}
                      className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-300 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold shadow-md cursor-pointer transition-all"
                    >
                      Generate Digital Pass
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="space-y-4">
                <div className="text-center space-y-1">
                  <div className="inline-flex p-2 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mb-1">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h2 className="text-base font-extrabold text-slate-900 dark:text-white">Registration Confirmed!</h2>
                  <p className="text-xs text-slate-500">Digital Gate E-Pass generated successfully</p>
                </div>

                {/* Styled E-Pass Ticket */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white border border-slate-700 shadow-xl space-y-3 relative overflow-hidden">
                  <div className="flex justify-between items-start border-b border-slate-700 pb-2">
                    <div>
                      <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">{activeOrg.name}</span>
                      <h3 className="text-sm font-extrabold text-white">{generatedPass.eventTitle}</h3>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-400 text-slate-950">
                      {generatedPass.passCount} PASS(ES)
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 items-center">
                    <div className="col-span-2 space-y-1.5 text-[11px]">
                      <div>
                        <span className="text-slate-400 block text-[9px] uppercase font-bold">Visitor Name</span>
                        <strong className="text-white text-xs">{generatedPass.fullName}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px] uppercase font-bold">Gate Venue & Date</span>
                        <span className="text-slate-200">{generatedPass.venue} ({generatedPass.date})</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px] uppercase font-bold">Pass Reference ID</span>
                        <span className="font-mono text-amber-400 font-bold">{generatedPass.passId}</span>
                      </div>
                    </div>

                    <div className="p-1.5 bg-white rounded-xl text-center flex flex-col items-center justify-center">
                      <img src={generatedPass.qrCodeUrl} alt="Gate Pass QR" className="w-20 h-20 object-contain" />
                      <span className="text-[8px] font-mono text-slate-900 font-bold mt-0.5">SCAN AT GATE</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleDownloadPass}
                    className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Gate Pass</span>
                  </button>
                  <button
                    onClick={() => { setShowEnrollModal(false); setGeneratedPass(null); }}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* GENERATE PARTICIPATION CERTIFICATE MODAL */}
      {showCertModal && selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowCertModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <div className="p-2.5 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white">Generate Participation Certificate</h2>
                <p className="text-xs text-slate-500">{selectedEvent.title}</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-500 font-medium mb-1">Participant / Volunteer Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sourav Mukherjee"
                  value={certForm.participantName}
                  onChange={(e) => setCertForm({ ...certForm, participantName: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Role / Designation *</label>
                  <select
                    value={certForm.role}
                    onChange={(e) => setCertForm({ ...certForm, role: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white"
                  >
                    <option value="Volunteer Service">Volunteer Service</option>
                    <option value="Cultural Performer">Cultural Performer</option>
                    <option value="Medical Camp Assistant">Medical Camp Assistant</option>
                    <option value="Security & Gate Controller">Security & Gate Controller</option>
                    <option value="Executive Organizer">Executive Organizer</option>
                    <option value="Event Participant">Event Participant</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-500 font-medium mb-1">Issue Date *</label>
                  <input
                    type="date"
                    required
                    value={certForm.issueDate}
                    onChange={(e) => setCertForm({ ...certForm, issueDate: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Certificate Live Preview Canvas */}
              {certForm.participantName.trim() && (
                <div className="p-6 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border-2 border-amber-300 dark:border-amber-700/60 space-y-3 text-center relative overflow-hidden">
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-400 text-slate-950">
                    {certForm.certificateId}
                  </div>

                  <span className="text-[10px] uppercase tracking-widest font-extrabold text-amber-700 dark:text-amber-400">
                    CERTIFICATE OF PARTICIPATION & HONOR
                  </span>

                  <h3 className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                    PROUDLY PRESENTED BY <strong className="text-slate-900 dark:text-white">{activeOrg.name.toUpperCase()}</strong>
                  </h3>

                  <div className="py-2">
                    <span className="text-slate-400 text-[10px] block mb-0.5">THIS IS GRANTED TO</span>
                    <h2 className="text-xl font-extrabold text-slate-900 dark:text-amber-300 tracking-wide font-serif">
                      {certForm.participantName}
                    </h2>
                  </div>

                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed max-w-md mx-auto">
                    In recognition of valuable contribution and service as <strong className="text-rose-600 dark:text-rose-400">{certForm.role}</strong> during <strong className="text-slate-900 dark:text-white">{selectedEvent.title}</strong> at {selectedEvent.venue}.
                  </p>

                  <div className="pt-3 border-t border-amber-200 dark:border-amber-800/60 flex items-center justify-between text-[10px] text-slate-500">
                    <span>Authorized Official Stamp</span>
                    <span className="font-mono text-amber-600 font-bold">VERIFIED COMMUNITY OS</span>
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCertModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  disabled={!certForm.participantName.trim()}
                  onClick={handleDownloadCertificate}
                  className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold shadow-md cursor-pointer transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4 text-amber-400" />
                  <span>Download Certificate</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
