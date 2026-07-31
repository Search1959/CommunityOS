import React, { useState } from 'react';
import { 
  Award, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  FileText, 
  CheckCircle, 
  Plus, 
  ChevronRight, 
  Download,
  CheckCircle2,
  AlertCircle,
  FileCheck
} from 'lucide-react';
import { Meeting, CommitteeOfficeBearer, Organization } from '../types';

interface CommitteeModuleProps {
  meetings: Meeting[];
  officeBearers: CommitteeOfficeBearer[];
  activeOrg: Organization;
  onAddMeeting: (newMeeting: Meeting) => void;
}

export const CommitteeModule: React.FC<CommitteeModuleProps> = ({
  meetings,
  officeBearers,
  activeOrg,
  onAddMeeting,
}) => {
  const [activeTab, setActiveTab] = useState<'meetings' | 'bearers' | 'resolutions'>('meetings');
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(meetings[0] || null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<'AGM' | 'Executive Committee' | 'Emergency'>('Executive Committee');
  const [newDate, setNewDate] = useState('');
  const [newVenue, setNewVenue] = useState('');
  const [newAgenda, setNewAgenda] = useState('');

  const handleCreateMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDate) return;

    const newM: Meeting = {
      id: `meet-${Date.now()}`,
      orgId: activeOrg.id,
      title: newTitle,
      meetingType: newType,
      date: newDate,
      time: '18:00 IST',
      venue: newVenue || activeOrg.address,
      attendeesCount: 25,
      status: 'Scheduled',
      agenda: newAgenda ? newAgenda.split('\n') : ['Review of Quarterly Financial Accounts', 'Welfare Scheme Applications Review'],
      minutesSummary: 'Scheduled meeting. Minutes will be updated post meeting conclusion.',
      resolutionsPassed: []
    };

    onAddMeeting(newM);
    setShowScheduleModal(false);
    setNewTitle('');
    setNewDate('');
    setNewAgenda('');
  };

  return (
    <div className="space-y-6">
      
      {/* Module Title & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <span>Committee & Resolution Governance</span>
          </h1>
          <p className="text-xs text-slate-500">
            Meeting Agendas, Minutes Register, Passed Resolutions & Elected Bearers
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="p-1 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center text-xs font-semibold">
            <button
              onClick={() => setActiveTab('meetings')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'meetings' ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 font-bold shadow-sm' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Meetings & Minutes
            </button>
            <button
              onClick={() => setActiveTab('bearers')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'bearers' ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 font-bold shadow-sm' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Office Bearers
            </button>
            <button
              onClick={() => setActiveTab('resolutions')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'resolutions' ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 font-bold shadow-sm' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Resolution Register
            </button>
          </div>

          <button
            onClick={() => setShowScheduleModal(true)}
            className="px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Schedule Meeting</span>
          </button>
        </div>
      </div>

      {/* Tab Content 1: Meetings & Minutes */}
      {activeTab === 'meetings' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Meetings List */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Meeting Archives</h3>
            
            <div className="space-y-2">
              {meetings.map((m) => (
                <div
                  key={m.id}
                  onClick={() => setSelectedMeeting(m)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    selectedMeeting?.id === m.id
                      ? 'bg-rose-50/80 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 shadow-md'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                      {m.meetingType}
                    </span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      m.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {m.status}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{m.title}</h4>
                  
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {m.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {m.attendeesCount} Present
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Meeting Minutes & Resolution View */}
          {selectedMeeting ? (
            <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-100 text-amber-800">
                      {selectedMeeting.meetingType}
                    </span>
                    <span className="text-xs font-mono text-slate-400">ID: {selectedMeeting.id}</span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">{selectedMeeting.title}</h2>
                  <p className="text-xs text-slate-500 flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-rose-500" /> {selectedMeeting.date} ({selectedMeeting.time})</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-emerald-500" /> {selectedMeeting.venue}</span>
                  </p>
                </div>

                <button
                  onClick={() => alert(`Downloaded signed Minutes PDF for ${selectedMeeting.title}`)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center gap-1.5 shrink-0 self-start sm:self-center"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Signed Minutes PDF</span>
                </button>
              </div>

              {/* Agenda List */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Meeting Agenda Items</h3>
                <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                  {selectedMeeting.agenda.map((ag, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{ag}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Summary of Minutes */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">Official Summary of Minutes</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {selectedMeeting.minutesSummary}
                </p>
              </div>

              {/* Resolutions Passed */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Formal Resolutions Passed</h3>
                
                {selectedMeeting.resolutionsPassed.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">No formal resolutions recorded for this session.</p>
                ) : (
                  <div className="space-y-2">
                    {selectedMeeting.resolutionsPassed.map((res) => (
                      <div key={res.id} className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{res.title}</span>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                          {res.voteStatus}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          ) : null}

        </div>
      )}

      {/* Tab Content 2: Office Bearers Grid */}
      {activeTab === 'bearers' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {officeBearers.map((ob) => (
            <div key={ob.id} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-3">
              <img src={ob.photoUrl} alt={ob.name} className="w-20 h-20 rounded-2xl object-cover mx-auto border-2 border-rose-500" />
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                  {ob.designation}
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1">{ob.name}</h3>
                <p className="text-[11px] text-slate-500">{ob.phone}</p>
                <p className="text-[10px] text-slate-400 mt-1 font-semibold">Elected Term: {ob.termPeriod}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab Content 3: Resolution Register */}
      {activeTab === 'resolutions' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-emerald-500" />
            <span>Master Resolution Register (2026)</span>
          </h2>

          <div className="space-y-3">
            {meetings.flatMap((m) => m.resolutionsPassed.map((r) => ({ ...r, meetingTitle: m.title, date: m.date }))).map((res) => (
              <div key={res.id} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">{res.title}</p>
                  <p className="text-[11px] text-slate-500">Passed at: {res.meetingTitle} ({res.date})</p>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  Status: {res.voteStatus}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Schedule Meeting Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Schedule Executive Committee Session</h2>

            <form onSubmit={handleCreateMeeting} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-500 font-medium mb-1">Session Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Special Emergency Budget Meeting"
                  className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  >
                    <option value="AGM">AGM</option>
                    <option value="Executive Committee">Executive Committee</option>
                    <option value="Emergency">Emergency</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 font-medium mb-1">Venue</label>
                <input
                  type="text"
                  value={newVenue}
                  onChange={(e) => setNewVenue(e.target.value)}
                  placeholder="e.g. Evergreen Hall Room 2"
                  className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-medium mb-1">Agenda Items (One per line)</label>
                <textarea
                  rows={3}
                  value={newAgenda}
                  onChange={(e) => setNewAgenda(e.target.value)}
                  placeholder="1. Pandal Contractor Approval&#10;2. Blood Camp Volunteers"
                  className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-rose-600 text-white font-bold"
                >
                  Schedule Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
