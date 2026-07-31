import React, { useState } from 'react';
import { MessageSquareShare, Send, CheckCircle2, ShieldAlert, Users, Phone } from 'lucide-react';
import { Organization } from '../types';

export const NotificationsModule: React.FC<{ activeOrg: Organization }> = ({ activeOrg }) => {
  const [broadcastMsg, setBroadcastMsg] = useState('');
  const [targetGroup, setTargetGroup] = useState('All Active Members');

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMsg) return;
    alert(`WhatsApp Broadcast dispatched to 340 members of ${activeOrg.name} via WhatsApp Business API!`);
    setBroadcastMsg('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <MessageSquareShare className="w-5 h-5 text-emerald-500" />
            <span>WhatsApp & Multi-Channel Alert Centre</span>
          </h1>
          <p className="text-xs text-slate-500">
            Instant AGM Notices, Donation Receipts, Gate Passes & Emergency Alerts via WhatsApp API
          </p>
        </div>

        <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200">
          WhatsApp Business API Connected
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Compose Mass Broadcast</h2>

          <form onSubmit={handleSendBroadcast} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-500 font-medium mb-1">Target Audience</label>
              <select
                value={targetGroup}
                onChange={(e) => setTargetGroup(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              >
                <option value="All Active Members">All Active Members (340 Recipient Mobiles)</option>
                <option value="Executive Committee Bearers">Executive Committee Bearers (12 Mobiles)</option>
                <option value="Donors with 80G Receipts">Donors with 80G Receipts</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-500 font-medium mb-1">WhatsApp Message Body *</label>
              <textarea
                rows={4}
                required
                value={broadcastMsg}
                onChange={(e) => setBroadcastMsg(e.target.value)}
                placeholder={`Dear Member, ${activeOrg.name} hereby invites you to the Annual General Meeting on 25th August 2026 at 6 PM...`}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-sans text-xs"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Send WhatsApp Broadcast Now</span>
            </button>
          </form>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Automated System Triggers</h3>
          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-between">
              <span>80G Receipt PDF via WhatsApp</span>
              <span className="text-emerald-500 font-bold">Enabled</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-between">
              <span>Meeting Minutes SMS Notification</span>
              <span className="text-emerald-500 font-bold">Enabled</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-between">
              <span>Emergency Blood Request Broadcast</span>
              <span className="text-emerald-500 font-bold">Enabled</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
