import React, { useState } from 'react';
import { QrCode, X, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

interface QRScannerModalProps {
  onClose: () => void;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({ onClose }) => {
  const [scannedResult, setScannedResult] = useState<string | null>(null);

  const handleSimulateScan = () => {
    setScannedResult('VERIFIED: Debashis Roy • Member ID: EE-2026-102 • Role: Treasurer • 80G Pass Approved');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-1">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center justify-center gap-2">
            <QrCode className="w-5 h-5 text-rose-500" />
            <span>Puja Pandal Gate Pass & Member QR Scanner</span>
          </h2>
          <p className="text-xs text-slate-500">Scan Digital Member ID Card or VIP Pandal Pass</p>
        </div>

        {/* Camera Viewfinder Simulator */}
        <div className="relative w-full h-56 bg-slate-950 rounded-2xl border-2 border-dashed border-amber-500/50 flex flex-col items-center justify-center overflow-hidden">
          <div className="w-40 h-40 border-2 border-amber-400 rounded-xl relative flex items-center justify-center animate-pulse">
            <div className="w-full h-0.5 bg-amber-400 absolute top-1/2 -translate-y-1/2 shadow-lg shadow-amber-500" />
          </div>
          <p className="text-[10px] text-amber-400 font-mono mt-3">Align QR Code inside frame</p>
        </div>

        {scannedResult ? (
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 className="w-4 h-4" />
              <span>QR Pass Verified Successfully!</span>
            </div>
            <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed font-mono">{scannedResult}</p>
          </div>
        ) : (
          <button
            onClick={handleSimulateScan}
            className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-all"
          >
            Simulate Camera QR Scan
          </button>
        )}
      </div>
    </div>
  );
};
