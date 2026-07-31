import React, { useState } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  FileText, 
  Mic, 
  ShieldCheck, 
  User, 
  MessageSquare,
  RefreshCw,
  Globe
} from 'lucide-react';
import { Organization } from '../types';

interface AIChatModuleProps {
  activeOrg: Organization;
  chatMessages: Array<{
    id: string;
    sender: 'user' | 'ai';
    text: string;
    sources?: Array<{ docTitle: string; pageNo?: number; quote?: string }>;
  }>;
  onSendMessage: (msg: string) => void;
}

export const AIChatModule: React.FC<AIChatModuleProps> = ({
  activeOrg,
  chatMessages,
  onSendMessage,
}) => {
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);

  const promptChips = [
    `What is ${activeOrg.name}'s 80G Tax Registration URN?`,
    `Who is our elected President and Treasurer for 2026?`,
    `What are the eligibility rules for the Swami Vivekananda Scholarship?`,
    `Summarize our total donation collections for this year.`,
    `When is our next Executive Committee Meeting?`
  ];

  const handleSend = async (textToSend?: string) => {
    const msg = textToSend || input;
    if (!msg.trim() || isSending) return;

    setInput('');
    setIsSending(true);
    await onSendMessage(msg);
    setIsSending(false);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      
      {/* Header */}
      <div className="p-4 bg-indigo-950 text-white flex items-center justify-between border-b border-indigo-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/30">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white">Gemini Document AI & Grounded Assistant</h2>
              <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                100% Grounded
              </span>
            </div>
            <p className="text-[11px] text-indigo-300">
              Grounded exclusively on {activeOrg.name} verified documents & records
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-indigo-300">
          <Globe className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline">Bengali • Hindi • English</span>
        </div>
      </div>

      {/* Chat Messages Box */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar">
        {chatMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-3">
            <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Ask Anything About {activeOrg.name}</h3>
            <p className="text-xs text-slate-500">
              Every response is verified against the official Trust Deed, 80G Certificates, Meeting Minutes, and Donation Ledgers.
            </p>
          </div>
        ) : (
          chatMessages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 max-w-3xl ${m.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  m.sender === 'user'
                    ? 'bg-rose-600 text-white'
                    : 'bg-gradient-to-r from-amber-500 to-rose-600 text-slate-950 font-bold'
                }`}
              >
                {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`p-4 rounded-2xl text-xs space-y-2 ${
                  m.sender === 'user'
                    ? 'bg-rose-600 text-white rounded-tr-none'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200 dark:border-slate-700'
                }`}
              >
                <p className="whitespace-pre-wrap leading-relaxed">{m.text}</p>

                {/* Sources & Grounding Citations Badge */}
                {m.sources && m.sources.length > 0 && (
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60 space-y-1">
                    <p className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Verified Grounding Citations:</span>
                    </p>
                    {m.sources.map((src, idx) => (
                      <div key={idx} className="p-1.5 rounded bg-white/60 dark:bg-slate-900/60 text-[10px] font-mono text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <FileText className="w-3 h-3 text-rose-500 shrink-0" />
                        <span className="truncate">Source: {src.docTitle} {src.pageNo ? `(Page ${src.pageNo})` : ''}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        )}

        {isSending && (
          <div className="flex items-center gap-2 text-xs text-slate-400 p-2">
            <div className="w-3 h-3 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
            <span>Consulting RAG Database for verified answer...</span>
          </div>
        )}
      </div>

      {/* Suggested Prompt Chips */}
      <div className="p-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 space-y-2">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Suggested Instant Queries:</p>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
          {promptChips.map((chip, i) => (
            <button
              key={i}
              onClick={() => handleSend(chip)}
              className="px-3 py-1 rounded-full bg-white dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950 text-slate-700 dark:text-slate-300 hover:text-rose-600 text-[11px] font-medium border border-slate-200 dark:border-slate-700 whitespace-nowrap transition-colors shrink-0"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2"
      >
        <button
          type="button"
          onClick={() => alert('Voice Search Activated (English / Bengali / Hindi)')}
          className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-rose-500 transition-colors"
          title="Voice Search"
        >
          <Mic className="w-4 h-4" />
        </button>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask anything about ${activeOrg.name} records...`}
          className="flex-1 p-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 outline-none focus:border-rose-500"
        />

        <button
          type="submit"
          disabled={!input.trim() || isSending}
          className="p-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white disabled:opacity-50 transition-all"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
};
