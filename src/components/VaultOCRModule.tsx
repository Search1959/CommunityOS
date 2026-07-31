import React, { useState } from 'react';
import { 
  FileText, 
  Upload, 
  Sparkles, 
  CheckCircle2, 
  Search, 
  Eye, 
  Download, 
  ShieldCheck, 
  Clock,
  FileCheck
} from 'lucide-react';
import { VaultDocument, Organization } from '../types';

interface VaultOCRModuleProps {
  documents: VaultDocument[];
  activeOrg: Organization;
  onUploadExtractDoc: (docText: string, filename: string) => Promise<void>;
}

export const VaultOCRModule: React.FC<VaultOCRModuleProps> = ({
  documents,
  activeOrg,
  onUploadExtractDoc,
}) => {
  const [search, setSearch] = useState('');
  const [selectedDoc, setSelectedDoc] = useState<VaultDocument | null>(documents[0] || null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sampleText, setSampleText] = useState('');

  const filteredDocs = documents.filter((d) => 
    d.title.toLowerCase().includes(search.toLowerCase()) ||
    d.category.toLowerCase().includes(search.toLowerCase()) ||
    d.ocrSummary.toLowerCase().includes(search.toLowerCase())
  );

  const handleSimulateOCR = async () => {
    setIsProcessing(true);
    const mockContent = sampleText || `INCOME TAX RETURN ACKNOWLEDGEMENT & 80G AUDIT STATEMENT
Organization: ${activeOrg.name}
Registration No: ${activeOrg.regNo}
PAN: ${activeOrg.pan}
Assessment Year: 2026-27
Gross Total Receipts: ₹1,25,00,000
Tax Payable: NIL (Exempted u/s 11 & 12A)
Certified by CA Sen & Associates. Signature Verified.`;

    await onUploadExtractDoc(mockContent, 'Income_Tax_Acknowledgement_2026.pdf');
    setIsProcessing(false);
    setSampleText('');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-500" />
            <span>AI Document Vault & OCR Parser</span>
          </h1>
          <p className="text-xs text-slate-500">
            Automated Key-Value Extraction, Grounded AI Indexing & Legal Archives
          </p>
        </div>

        <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold border border-amber-200 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Gemini 2.5 Flash Grounded</span>
        </span>
      </div>

      {/* OCR Drag & Drop Extractor Box */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-rose-950 text-white shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-base font-bold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Instant AI OCR & Legal Field Extraction</span>
            </h2>
            <p className="text-xs text-slate-300">
              Paste or upload Deed, Audit Report, 80G Order or Government Receipt to extract structured metadata.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <textarea
            rows={3}
            value={sampleText}
            onChange={(e) => setSampleText(e.target.value)}
            placeholder="Paste document text here, or click below to simulate OCR extraction of 80G Certificate..."
            className="w-full p-3 rounded-xl bg-slate-950/80 border border-slate-700 text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-amber-400 font-mono"
          />

          <button
            onClick={handleSimulateOCR}
            disabled={isProcessing}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 text-slate-950 font-black text-xs shadow-lg transition-all flex items-center gap-2"
          >
            {isProcessing ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Running Gemini AI OCR Parser...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span>Run AI OCR Extraction & Save to Vault</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Vault Repository Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Document List */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Vault documents..."
              className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
            />
          </div>

          <div className="space-y-2">
            {filteredDocs.map((doc) => (
              <div
                key={doc.id}
                onClick={() => setSelectedDoc(doc)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  selectedDoc?.id === doc.id
                    ? 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-400 dark:border-amber-800 shadow-md'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{doc.title}</span>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 shrink-0">
                    Verified
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5">{doc.category} • {doc.uploadDate}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Document Structured JSON & Key Fields View */}
        {selectedDoc && (
          <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 uppercase">
                  {selectedDoc.category}
                </span>
                <h2 className="text-base font-bold text-slate-900 dark:text-white mt-1">{selectedDoc.title}</h2>
                <p className="text-xs text-slate-500 font-mono">File: {selectedDoc.fileUrl}</p>
              </div>

              <button
                onClick={() => alert(`Downloaded original file: ${selectedDoc.fileUrl}`)}
                className="px-3 py-1.5 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Document</span>
              </button>
            </div>

            {/* Extracted Fields Table */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Extracted Legal Metadata (Grounded Ground Truth)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Document Type</p>
                  <p className="font-bold text-slate-900 dark:text-white">{selectedDoc.extractedData.docType}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Organization Identified</p>
                  <p className="font-bold text-slate-900 dark:text-white">{selectedDoc.extractedData.orgName}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Registration / Unique Ref No</p>
                  <p className="font-mono font-bold text-slate-900 dark:text-white">{selectedDoc.extractedData.regNo}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Financial Value / Amount</p>
                  <p className="font-bold text-emerald-600">{selectedDoc.extractedData.totalAmount}</p>
                </div>
              </div>
            </div>

            {/* Raw Text Extract */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Raw OCR Text Transcript</h3>
              <div className="p-3 rounded-xl bg-slate-950 text-slate-300 font-mono text-[11px] leading-relaxed max-h-40 overflow-y-auto">
                {selectedDoc.ocrRawText}
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
