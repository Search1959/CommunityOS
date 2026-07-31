import React from 'react';
import { Stethoscope, Heart, Calendar, Users, FileText, CheckCircle2 } from 'lucide-react';
import { Organization } from '../types';

export const MedicalCampModule: React.FC<{ activeOrg: Organization }> = ({ activeOrg }) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-teal-500" />
            <span>Medical Camps & Free Health Checkups</span>
          </h1>
          <p className="text-xs text-slate-500">
            Eye Camps, Diabetes Screening, Cardiology OPD & Free Doctor Prescriptions
          </p>
        </div>

        <button
          onClick={() => alert('New Medical Camp session scheduled for next Sunday!')}
          className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md"
        >
          Organize Free Medical Camp
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-teal-100 text-teal-800">
            Upcoming Health Drive
          </span>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Free Cardiac & Eye Cataract Screening Camp</h2>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            In collaboration with Apollo Gleneagles Hospitals. Free spectacles & ECG testing for senior citizens.
          </p>
          <div className="flex justify-between items-center text-xs text-slate-500 pt-2 border-t">
            <span>Date: 15-AUG-2026</span>
            <span className="font-bold text-teal-600">180 Patients Enrolled</span>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
            Past Medical Archive
          </span>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">General Health & Blood Pressure Camp</h2>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Treated 320 community members. Disbursed free essential medicines worth ₹85,000.
          </p>
          <div className="flex justify-between items-center text-xs text-slate-500 pt-2 border-t">
            <span>Completed: 10-MAY-2026</span>
            <span className="font-bold text-emerald-600">320 Beneficiaries</span>
          </div>
        </div>
      </div>
    </div>
  );
};
