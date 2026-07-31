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
  Sparkles 
} from 'lucide-react';
import { EventItem, Organization } from '../types';

interface EventModuleProps {
  events: EventItem[];
  activeOrg: Organization;
  onOpenQRScanner: () => void;
}

export const EventModule: React.FC<EventModuleProps> = ({
  events,
  activeOrg,
  onOpenQRScanner,
}) => {
  const [selectedEvent, setSelectedEvent] = useState<EventItem>(events[0] || events[0]);

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-rose-500" />
            <span>Community Events & Durga Puja Festival</span>
          </h1>
          <p className="text-xs text-slate-500">
            Volunteer Duty Assignments, QR Attendance, Auto Certificates & Media Gallery
          </p>
        </div>

        <button
          onClick={onOpenQRScanner}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 text-white font-bold text-xs shadow-md flex items-center gap-1.5 shrink-0"
        >
          <QrCode className="w-4 h-4" />
          <span>Scan Gate Pass / Attendance QR</span>
        </button>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Event Cards List */}
        <div className="space-y-3">
          {events.map((evt) => (
            <div
              key={evt.id}
              onClick={() => setSelectedEvent(evt)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                selectedEvent.id === evt.id
                  ? 'bg-rose-50/80 dark:bg-rose-950/40 border-rose-400 dark:border-rose-800 shadow-md'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                  {evt.category}
                </span>
                <span className="text-[10px] font-bold text-emerald-600">
                  {evt.status}
                </span>
              </div>

              <h3 className="text-xs font-bold text-slate-900 dark:text-white mt-1">{evt.title}</h3>
              
              <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-2">
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {evt.startDate}</span>
                <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {evt.registeredCount} Enrolled</span>
              </div>
            </div>
          ))}
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

    </div>
  );
};
