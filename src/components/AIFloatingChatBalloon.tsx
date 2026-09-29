import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  X, 
  Send, 
  Maximize2, 
  FileText, 
  Loader2, 
  Bot, 
  RefreshCw,
  MessageCircle,
  ExternalLink
} from 'lucide-react';
import { Organization } from '../types';

interface AIFloatingChatBalloonProps {
  activeOrg: Organization;
  chatMessages: Array<{
    id: string;
    sender: 'user' | 'ai';
    text: string;
    sources?: Array<{ docTitle: string; pageNo?: number; quote?: string }>;
  }>;
  onSendMessage: (msg: string) => Promise<void> | void;
  onOpenFullChat?: () => void;
  onNavigateModule?: (key: string) => void;
}

export const AIFloatingChatBalloon: React.FC<AIFloatingChatBalloonProps> = ({
  activeOrg,
  chatMessages,
  onSendMessage,
  onOpenFullChat,
  onNavigateModule,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    `What is ${activeOrg.name}'s 80G Tax Exemption URN?`,
    `Who is our elected President and Treasurer for 2026?`,
    `What is our scholarship budget for this year?`,
    `When is the next Executive Committee Meeting?`
  ];

  // Auto scroll to bottom of chat when new messages arrive
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isSending) return;

    setInput('');
    setIsSending(true);
    try {
      await onSendMessage(query);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      {/* Floating Chat Balloon Window (Desktop Only) */}
      {isOpen && (
        <div 
          id="ai-floating-chat-window"
          className="hidden md:flex fixed bottom-20 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] h-[520px] max-h-[calc(100vh-6.5rem)] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200"
        >
          {/* Header */}
          <div 
            className="p-3.5 text-white flex items-center justify-between shrink-0 shadow-sm"
            style={{ backgroundColor: activeOrg.themeColor || '#dc2626' }}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-xs shrink-0">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="truncate">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-xs text-white truncate">AI Document Assistant</h3>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-white/20 text-white border border-white/30">
                    Grounded
                  </span>
                </div>
                <p className="text-[10px] text-white/80 truncate">
                  {activeOrg.name} Knowledge Base
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {onOpenFullChat && (
                <button
                  id="btn-expand-full-chat"
                  onClick={() => {
                    setIsOpen(false);
                    onOpenFullChat();
                  }}
                  className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  title="Expand to Full Screen View"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                id="btn-close-floating-chat"
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                title="Minimize Chat Balloon"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 custom-scrollbar bg-slate-50/50 dark:bg-slate-950/40 text-xs">
            {chatMessages.length === 0 ? (
              <div className="py-6 text-center space-y-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-200">How can I assist you today?</p>
                  <p className="text-[11px] text-slate-500 max-w-[260px] mx-auto mt-0.5">
                    Ask questions grounded in trust deeds, AGM minutes, donations & 80G tax records.
                  </p>
                </div>

                <div className="space-y-1.5 pt-2 text-left">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
                    Suggested Questions
                  </p>
                  {quickPrompts.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(prompt)}
                      className="w-full text-left p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-700 dark:text-slate-300 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all shadow-2xs"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'ai' && (
                    <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold shadow-xs">
                      AI
                    </div>
                  )}

                  <div
                    className={`max-w-[82%] rounded-xl p-3 leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-indigo-600 text-white rounded-br-none shadow-sm'
                        : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-bl-none shadow-xs'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>

                    {/* Grounding Source Citations */}
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                          Verified Citations:
                        </span>
                        {msg.sources.map((src, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-1.5 text-[10px] text-indigo-600 dark:text-indigo-400 font-mono bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 rounded border border-indigo-100 dark:border-indigo-900/50"
                          >
                            <FileText className="w-3 h-3 shrink-0" />
                            <span className="truncate">{src.docTitle}</span>
                            {src.pageNo && <span className="shrink-0 text-slate-400">(p.{src.pageNo})</span>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}

            {isSending && (
              <div className="flex gap-2.5 items-center text-slate-500 text-xs pl-1">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                <span className="text-[11px] text-slate-500 animate-pulse">Searching grounded records...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <div className="p-2.5 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                id="floating-ai-chat-input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Ask AI about ${activeOrg.name}...`}
                disabled={isSending}
                className="flex-1 px-3 py-2 bg-slate-100 dark:bg-slate-800/80 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
              />
              <button
                id="btn-floating-ai-send"
                type="submit"
                disabled={!input.trim() || isSending}
                className="p-2 disabled:opacity-40 text-white rounded-xl transition-all shadow-sm shrink-0 cursor-pointer"
                style={{ backgroundColor: activeOrg.themeColor || '#dc2626' }}
                title="Send query"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Small Balloon Button at Right Down Area (Desktop Only) */}
      <div className="hidden md:flex fixed bottom-6 right-6 z-50">
        <button
          id="btn-ai-balloon-launcher"
          onClick={() => setIsOpen(!isOpen)}
          style={
            !isOpen
              ? { backgroundColor: activeOrg.themeColor || '#dc2626' }
              : {}
          }
          className={`relative group w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg cursor-pointer ${
            isOpen
              ? 'bg-slate-800 hover:bg-slate-900 text-white ring-2 ring-slate-400 shadow-slate-900/30'
              : 'text-white hover:scale-105 active:scale-95 ring-2 ring-white/60 dark:ring-slate-700 shadow-md'
          }`}
          title={isOpen ? 'Close AI Assistant' : 'Ask AI Assistant'}
          aria-label="AI Chat Balloon"
        >
          {isOpen ? (
            <X className="w-5 h-5 text-white" />
          ) : (
            <>
              <MessageCircle className="w-5 h-5" />
              {/* Pulsing indicator dot */}
              <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-white dark:border-slate-900"></span>
              </span>
            </>
          )}

          {/* Hover Tooltip Balloon */}
          {!isOpen && (
            <span className="absolute right-13 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150 bg-slate-900 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg shadow-md whitespace-nowrap flex items-center gap-1 border border-slate-700">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              <span>Ask AI</span>
            </span>
          )}
        </button>
      </div>
    </>
  );
};
