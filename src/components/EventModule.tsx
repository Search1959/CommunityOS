import React, { useState } from 'react';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Award, 
  QrCode, 
  CheckCircle, 
  Image as ImageIcon, 
  Download, 
  Plus, 
  Sparkles,
  Eye,
  Pencil,
  Trash2,
  Search,
  X 
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
  const [selectedEvent, setSelectedEvent] = useState<EventItem>(events[0] || events[0]);
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

            {/* Actions & Auto Certificate */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <button
                onClick={() => alert(`Registration confirmed for ${selectedEvent.title}`)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md"
              >
                Enroll as Attendee / Visitor
              </button>

              <button
                onClick={() => alert(`Volunteer Attendance Certificate for ${selectedEvent.title} generated PDF.`)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center gap-1.5"
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

    </div>
  );
};
