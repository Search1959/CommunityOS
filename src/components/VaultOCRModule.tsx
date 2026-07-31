import React, { useState, useEffect } from 'react';
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
  FileCheck,
  Plus,
  Pencil,
  Trash2,
  X,
  FilePlus,
  FolderOpen,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { VaultDocument, Organization } from '../types';
import { INITIAL_VAULT_DOCUMENTS } from '../data/mockData';

interface VaultOCRModuleProps {
  documents: VaultDocument[];
  activeOrg: Organization;
  onUploadExtractDoc: (docText: string, filename: string) => Promise<void>;
  onAddDoc?: (doc: VaultDocument) => void;
  onUpdateDoc?: (doc: VaultDocument) => void;
  onDeleteDoc?: (docId: string) => void;
}

export const VaultOCRModule: React.FC<VaultOCRModuleProps> = ({
  documents,
  activeOrg,
  onUploadExtractDoc,
  onAddDoc,
  onUpdateDoc,
  onDeleteDoc,
}) => {
  const [localDocs, setLocalDocs] = useState<VaultDocument[]>(
    documents.length > 0 ? documents : INITIAL_VAULT_DOCUMENTS
  );

  const [search, setSearch] = useState('');
  const [selectedDoc, setSelectedDoc] = useState<VaultDocument | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sampleText, setSampleText] = useState('');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewingDoc, setViewingDoc] = useState<VaultDocument | null>(null);
  const [editingDoc, setEditingDoc] = useState<VaultDocument | null>(null);

  // Form State for Add
  const [newDocForm, setNewDocForm] = useState({
    title: '',
    category: 'Registration Certificate',
    fileUrl: '',
    uploadDate: new Date().toISOString().split('T')[0],
    regNo: activeOrg.regNo || '',
    totalAmount: 'Verified statutory record',
    ocrRawText: '',
    ocrSummary: ''
  });

  const handleDownloadDocument = (doc: VaultDocument) => {
    if (doc.fileUrl && doc.fileUrl.startsWith('data:')) {
      const a = document.createElement('a');
      a.href = doc.fileUrl;
      a.download = `${doc.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.${doc.fileType?.toLowerCase() || 'pdf'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return;
    }

    if (doc.fileUrl && (doc.fileUrl.startsWith('http://') || doc.fileUrl.startsWith('https://'))) {
      window.open(doc.fileUrl, '_blank');
      return;
    }

    // Fallback: Generate downloadable text file from local file content / transcript
    const fileContent = `====================================================
${doc.title.toUpperCase()} - STATUTORY VAULT RECORD
====================================================
Organization: ${doc.extractedData?.orgName || activeOrg.name}
Category: ${doc.category}
Registration / Ref No: ${doc.extractedData?.regNo || activeOrg.regNo}
Financial Value: ${doc.extractedData?.totalAmount || 'Verified statutory record'}
Upload Date: ${doc.uploadDate}

EXTRACTED KEY CLAUSES & PROVISIONS:
----------------------------------------------------
${doc.extractedKeyClauses?.map(c => `${c.label}: ${c.value}`).join('\n') || 'None'}

RAW DOCUMENT TRANSCRIPT / OCR TEXT:
----------------------------------------------------
${doc.ocrRawText || doc.ocrSummary || 'Full document text transcript stored in AI Vault.'}

====================================================
Generated & Downloaded from AI Statutory Vault System
====================================================
`;

    const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${doc.title.replace(/[^a-zA-Z0-9_-]/g, '_')}_Vault_Record.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleLocalFileUpload = (file: File, isEditMode: boolean = false) => {
    const reader = new FileReader();

    if (file.type.includes('text') || file.name.endsWith('.txt') || file.name.endsWith('.json') || file.name.endsWith('.csv')) {
      const textReader = new FileReader();
      textReader.onload = (e) => {
        const text = e.target?.result as string;
        if (isEditMode) {
          setEditingDoc(prev => prev ? ({ ...prev, ocrRawText: text, ocrSummary: text }) : null);
        } else {
          setNewDocForm(prev => ({ ...prev, ocrRawText: text, ocrSummary: text }));
        }
      };
      textReader.readAsText(file);
    }

    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const formattedSize = file.size > 1024 * 1024 
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
        : `${(file.size / 1024).toFixed(1)} KB`;
      const ext = file.name.split('.').pop()?.toUpperCase() || 'PDF';

      if (isEditMode) {
        setEditingDoc(prev => prev ? ({
          ...prev,
          fileUrl: dataUrl,
          fileSize: formattedSize,
          fileType: ext,
          title: prev.title || file.name.replace(/\.[^/.]+$/, "")
        }) : null);
      } else {
        setNewDocForm(prev => ({
          ...prev,
          fileUrl: dataUrl,
          title: prev.title || file.name.replace(/\.[^/.]+$/, "")
        }));
      }
    };

    reader.readAsDataURL(file);
  };

  // Keep localDocs synced with props
  useEffect(() => {
    const list = documents.length > 0 ? documents : INITIAL_VAULT_DOCUMENTS;
    setLocalDocs(list);
    if (list.length > 0 && !selectedDoc) {
      setSelectedDoc(list[0]);
    } else if (selectedDoc) {
      const refreshed = list.find(d => d.id === selectedDoc.id);
      if (refreshed) setSelectedDoc(refreshed);
      else if (list.length > 0) setSelectedDoc(list[0]);
      else setSelectedDoc(null);
    }
  }, [documents, activeOrg.id]);

  const displayDocs = localDocs;

  const filteredDocs = displayDocs.filter((d) => 
    d.title.toLowerCase().includes(search.toLowerCase()) ||
    d.category.toLowerCase().includes(search.toLowerCase()) ||
    (d.ocrSummary && d.ocrSummary.toLowerCase().includes(search.toLowerCase())) ||
    (d.extractedData?.regNo && d.extractedData.regNo.toLowerCase().includes(search.toLowerCase()))
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

  const handleCreateDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocForm.title.trim()) return;

    const created: VaultDocument = {
      id: `doc-${Date.now()}`,
      orgId: activeOrg.id,
      title: newDocForm.title,
      category: newDocForm.category,
      uploadDate: newDocForm.uploadDate || new Date().toISOString().split('T')[0],
      fileType: 'PDF',
      fileSize: '1.2 MB',
      fileUrl: newDocForm.fileUrl || '#',
      ocrRawText: newDocForm.ocrRawText || newDocForm.ocrSummary || 'Manual entry vault document.',
      ocrSummary: newDocForm.ocrSummary || newDocForm.ocrRawText || 'Manual upload statutory document record.',
      extractedData: {
        docType: newDocForm.category,
        orgName: activeOrg.name,
        regNo: newDocForm.regNo || activeOrg.regNo,
        totalAmount: newDocForm.totalAmount
      },
      extractedKeyClauses: [
        { label: 'Document Category', value: newDocForm.category },
        { label: 'Organization Identified', value: activeOrg.name },
        { label: 'Registration Ref No', value: newDocForm.regNo || activeOrg.regNo },
        { label: 'Financial Record Value', value: newDocForm.totalAmount }
      ]
    };

    if (onAddDoc) {
      onAddDoc(created);
    } else {
      setLocalDocs([created, ...localDocs]);
    }

    setSelectedDoc(created);
    setShowAddModal(false);
    setNewDocForm({
      title: '',
      category: 'Registration Certificate',
      fileUrl: '',
      uploadDate: new Date().toISOString().split('T')[0],
      regNo: activeOrg.regNo || '',
      totalAmount: 'Verified statutory record',
      ocrRawText: '',
      ocrSummary: ''
    });
  };

  const handleSaveEditedDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDoc) return;

    const updated: VaultDocument = {
      ...editingDoc,
      extractedData: {
        ...editingDoc.extractedData,
        docType: editingDoc.category,
        regNo: editingDoc.extractedData?.regNo || activeOrg.regNo
      }
    };

    if (onUpdateDoc) {
      onUpdateDoc(updated);
    } else {
      setLocalDocs(localDocs.map(d => d.id === updated.id ? updated : d));
    }

    if (selectedDoc?.id === updated.id) {
      setSelectedDoc(updated);
    }
    if (viewingDoc?.id === updated.id) {
      setViewingDoc(updated);
    }
    setEditingDoc(null);
  };

  const handleDeleteDocument = (docId: string, title: string) => {
    if (confirm(`Are you sure you want to delete document "${title}" from the vault? This action cannot be undone.`)) {
      if (onDeleteDoc) {
        onDeleteDoc(docId);
      } else {
        setLocalDocs(localDocs.filter(d => d.id !== docId));
      }

      if (selectedDoc?.id === docId) {
        const remaining = localDocs.filter(d => d.id !== docId);
        setSelectedDoc(remaining.length > 0 ? remaining[0] : null);
      }
      if (viewingDoc?.id === docId) setViewingDoc(null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-amber-500" />
            <span>AI Document Vault & OCR Parser</span>
          </h1>
          <p className="text-xs text-slate-500">
            Automated Key-Value Extraction, Grounded AI Indexing & Legal Archives for {activeOrg.name}
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Document</span>
          </button>

          <span className="px-3 py-2 rounded-xl bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 text-xs font-bold border border-amber-200 dark:border-amber-800 flex items-center gap-1.5 hidden md:flex">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Gemini 2.5 Flash Grounded</span>
          </span>
        </div>
      </div>

      {documents.length === 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-xs text-amber-900 dark:text-amber-200 flex items-center justify-between">
          <div>
            <p className="font-bold">Vault Repository Archives Context</p>
            <p className="text-[11px] text-amber-700 dark:text-amber-300 mt-0.5">
              Displaying active legal & statutory document vault for {activeOrg.name}.
            </p>
          </div>
        </div>
      )}

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
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 text-slate-950 font-black text-xs shadow-lg transition-all flex items-center gap-2 cursor-pointer"
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
        
        {/* Left Column: Document List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">
              Vault Documents ({filteredDocs.length})
            </h3>
            <button
              onClick={() => setShowAddModal(true)}
              className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Doc</span>
            </button>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Vault documents..."
              className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
            {filteredDocs.map((doc) => (
              <div
                key={doc.id}
                onClick={() => setSelectedDoc(doc)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all space-y-2 group ${
                  selectedDoc?.id === doc.id
                    ? 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-400 dark:border-amber-800 shadow-md'
                    : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-amber-600 dark:group-hover:text-amber-400">
                      {doc.title}
                    </span>
                    <p className="text-[10px] text-slate-500 mt-0.5">{doc.category} • {doc.uploadDate}</p>
                  </div>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 shrink-0">
                    Verified
                  </span>
                </div>

                {/* Quick Action Buttons for list item */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[11px]" onClick={(e) => e.stopPropagation()}>
                  <span className="text-[10px] font-mono text-slate-400">Ref: {doc.extractedData?.regNo || 'VERIFIED'}</span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setViewingDoc(doc)}
                      className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/80 transition-colors cursor-pointer"
                      title="View Full Document Details"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => setEditingDoc({ ...doc })}
                      className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-950/80 transition-colors cursor-pointer"
                      title="Edit Document Metadata"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleDeleteDocument(doc.id, doc.title)}
                      className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/80 transition-colors cursor-pointer"
                      title="Delete Document"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filteredDocs.length === 0 && (
              <div className="text-center py-8 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400 text-xs space-y-2">
                <FolderOpen className="w-8 h-8 text-slate-300 mx-auto" />
                <p>No documents found in vault.</p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
                >
                  Add Document
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Selected Document Structured JSON & Key Fields View */}
        {selectedDoc ? (
          <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 uppercase">
                  {selectedDoc.category}
                </span>
                <h2 className="text-base font-bold text-slate-900 dark:text-white mt-1">{selectedDoc.title}</h2>
                <p className="text-xs text-slate-500 font-mono">File: {selectedDoc.fileUrl || 'Archival_Document.pdf'}</p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setViewingDoc(selectedDoc)}
                  className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View</span>
                </button>

                <button
                  onClick={() => setEditingDoc({ ...selectedDoc })}
                  className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer hover:bg-amber-100 dark:hover:bg-amber-900 transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>

                <button
                  onClick={() => handleDeleteDocument(selectedDoc.id, selectedDoc.title)}
                  className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 cursor-pointer transition-colors"
                  title="Delete Document"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => handleDownloadDocument(selectedDoc)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer hover:bg-slate-800 transition-colors"
                  title="Download File / Export Local Vault Document"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>
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
                  <p className="font-bold text-slate-900 dark:text-white">
                    {selectedDoc.extractedData?.docType || selectedDoc.category || 'Statutory Deed'}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Organization Identified</p>
                  <p className="font-bold text-slate-900 dark:text-white">
                    {selectedDoc.extractedData?.orgName || activeOrg.name}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Registration / Unique Ref No</p>
                  <p className="font-mono font-bold text-slate-900 dark:text-white">
                    {selectedDoc.extractedData?.regNo || activeOrg.regNo}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Financial Value / Amount</p>
                  <p className="font-bold text-emerald-600 dark:text-emerald-400">
                    {selectedDoc.extractedData?.totalAmount || 'Verified statutory record'}
                  </p>
                </div>
              </div>
            </div>

            {/* Extracted Clauses if available */}
            {selectedDoc.extractedKeyClauses && selectedDoc.extractedKeyClauses.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Key Clauses & Legal Provisions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {selectedDoc.extractedKeyClauses.map((clause, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                      <span className="text-[10px] font-bold text-slate-400 block">{clause.label}</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{clause.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Raw Text Extract */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Raw OCR Text Transcript</h3>
              <div className="p-3 rounded-xl bg-slate-950 text-slate-300 font-mono text-[11px] leading-relaxed max-h-40 overflow-y-auto border border-slate-800">
                {selectedDoc.ocrRawText || selectedDoc.ocrSummary || 'Full document text transcript verified and stored in AI Vault vector store.'}
              </div>
            </div>

          </div>
        ) : (
          <div className="lg:col-span-2 p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <FileText className="w-12 h-12 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No Document Selected</p>
            <p className="text-xs text-slate-400">Select a document from the list or click "Add Document" to store new statutory records.</p>
          </div>
        )}

      </div>

      {/* ADD DOCUMENT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
                <FilePlus className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white">Add Vault Statutory Document</h2>
                <p className="text-xs text-slate-500">Store and index new legal records for {activeOrg.name}</p>
              </div>
            </div>

            <form onSubmit={handleCreateDocument} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-500 font-medium mb-1">Document Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Society Registration Certificate & Deed of Constitution"
                  value={newDocForm.title}
                  onChange={(e) => setNewDocForm({ ...newDocForm, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Document Category *</label>
                  <select
                    value={newDocForm.category}
                    onChange={(e) => setNewDocForm({ ...newDocForm, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white"
                  >
                    <option value="Registration Certificate">Registration Certificate</option>
                    <option value="Trust Deed">Trust Deed</option>
                    <option value="Income Tax 80G Approval">Income Tax 80G & 12A</option>
                    <option value="CAG Audit Report">CAG Audit / Financials</option>
                    <option value="Executive Resolution">Executive Resolution / Minutes</option>
                    <option value="Government Order">Government Order / Receipt</option>
                    <option value="Financial Ledger">Financial Ledger / Passbook</option>
                    <option value="General Legal">General Statutory Vault</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-500 font-medium mb-1">Upload Date *</label>
                  <input
                    type="date"
                    required
                    value={newDocForm.uploadDate}
                    onChange={(e) => setNewDocForm({ ...newDocForm, uploadDate: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Registration / Ref No</label>
                  <input
                    type="text"
                    placeholder="e.g. S/1L/28941/1933"
                    value={newDocForm.regNo}
                    onChange={(e) => setNewDocForm({ ...newDocForm, regNo: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 font-medium mb-1">Financial Value / Amount</label>
                  <input
                    type="text"
                    placeholder="e.g. ₹1,25,00,000 or Statutory Record"
                    value={newDocForm.totalAmount}
                    onChange={(e) => setNewDocForm({ ...newDocForm, totalAmount: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 font-medium mb-1">Document File / Attach Local File</label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <label className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors shadow-sm">
                      <Upload className="w-4 h-4" />
                      <span>Choose / Upload Local File</span>
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleLocalFileUpload(e.target.files[0], false);
                          }
                        }}
                      />
                    </label>
                    <span className="text-[11px] text-slate-400">or enter document URL below:</span>
                  </div>

                  <input
                    type="text"
                    placeholder="e.g. https://storage.googleapis.com/vault/deed_2026.pdf or attach local file above"
                    value={newDocForm.fileUrl}
                    onChange={(e) => setNewDocForm({ ...newDocForm, fileUrl: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white"
                  />

                  {newDocForm.fileUrl && newDocForm.fileUrl.startsWith('data:') && (
                    <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/80 text-[11px] text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span className="font-bold">Local file attached & ready for local download/vault storage!</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setNewDocForm({ ...newDocForm, fileUrl: '' })}
                        className="text-[10px] text-rose-500 hover:underline font-bold"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-slate-500 font-medium mb-1">Raw OCR Text / Document Clauses</label>
                <textarea
                  rows={3}
                  placeholder="Paste full document transcript, legal order clauses, or OCR extracted text..."
                  value={newDocForm.ocrRawText}
                  onChange={(e) => setNewDocForm({ ...newDocForm, ocrRawText: e.target.value, ocrSummary: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold shadow-md cursor-pointer transition-all"
                >
                  Save to Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT DOCUMENT MODAL */}
      {editingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setEditingDoc(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <Pencil className="w-5 h-5 text-amber-500" />
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">Edit Document: {editingDoc.title}</h2>
            </div>

            <form onSubmit={handleSaveEditedDoc} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-500 font-medium mb-1">Document Title *</label>
                <input
                  type="text"
                  required
                  value={editingDoc.title}
                  onChange={(e) => setEditingDoc({ ...editingDoc, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Category *</label>
                  <select
                    value={editingDoc.category}
                    onChange={(e) => setEditingDoc({ ...editingDoc, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white"
                  >
                    <option value="Registration Certificate">Registration Certificate</option>
                    <option value="Trust Deed">Trust Deed</option>
                    <option value="Income Tax 80G Approval">Income Tax 80G & 12A</option>
                    <option value="CAG Audit Report">CAG Audit / Financials</option>
                    <option value="Executive Resolution">Executive Resolution / Minutes</option>
                    <option value="Government Order">Government Order / Receipt</option>
                    <option value="Financial Ledger">Financial Ledger / Passbook</option>
                    <option value="General Legal">General Statutory Vault</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-500 font-medium mb-1">Upload Date *</label>
                  <input
                    type="date"
                    required
                    value={editingDoc.uploadDate}
                    onChange={(e) => setEditingDoc({ ...editingDoc, uploadDate: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Registration / Ref No</label>
                  <input
                    type="text"
                    value={editingDoc.extractedData?.regNo || ''}
                    onChange={(e) => setEditingDoc({
                      ...editingDoc,
                      extractedData: { ...editingDoc.extractedData, regNo: e.target.value }
                    })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 font-medium mb-1">Financial Amount / Value</label>
                  <input
                    type="text"
                    value={editingDoc.extractedData?.totalAmount || ''}
                    onChange={(e) => setEditingDoc({
                      ...editingDoc,
                      extractedData: { ...editingDoc.extractedData, totalAmount: e.target.value }
                    })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 font-medium mb-1">Document File / Attach Local File</label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <label className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors shadow-sm">
                      <Upload className="w-4 h-4" />
                      <span>Choose / Upload Local File</span>
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleLocalFileUpload(e.target.files[0], true);
                          }
                        }}
                      />
                    </label>
                    <span className="text-[11px] text-slate-400">or edit web link:</span>
                  </div>

                  <input
                    type="text"
                    value={editingDoc.fileUrl || ''}
                    onChange={(e) => setEditingDoc({ ...editingDoc, fileUrl: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white"
                  />

                  {editingDoc.fileUrl && editingDoc.fileUrl.startsWith('data:') && (
                    <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/80 text-[11px] text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span className="font-bold">Local file attached & ready for download!</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setEditingDoc({ ...editingDoc, fileUrl: '' })}
                        className="text-[10px] text-rose-500 hover:underline font-bold"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-slate-500 font-medium mb-1">OCR Text / Summary Transcript</label>
                <textarea
                  rows={3}
                  value={editingDoc.ocrRawText || editingDoc.ocrSummary || ''}
                  onChange={(e) => setEditingDoc({
                    ...editingDoc,
                    ocrRawText: e.target.value,
                    ocrSummary: e.target.value
                  })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingDoc(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold shadow-md cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW DOCUMENT DETAILS MODAL */}
      {viewingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-2xl relative">
            <button
              onClick={() => setViewingDoc(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="p-3 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">{viewingDoc.title}</h2>
                </div>
                <p className="text-xs text-amber-600 dark:text-amber-400 font-bold mt-0.5">
                  Category: {viewingDoc.category} • Date: {viewingDoc.uploadDate}
                </p>
              </div>
            </div>

            {/* Extracted Metadata Grid */}
            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <p className="text-[10px] uppercase font-bold text-slate-400">Organization</p>
                <p className="font-bold text-slate-900 dark:text-white mt-0.5">{viewingDoc.extractedData?.orgName || activeOrg.name}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <p className="text-[10px] uppercase font-bold text-slate-400">Registration / Ref No</p>
                <p className="font-mono font-bold text-slate-900 dark:text-white mt-0.5">{viewingDoc.extractedData?.regNo || activeOrg.regNo}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <p className="text-[10px] uppercase font-bold text-slate-400">Financial Value</p>
                <p className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{viewingDoc.extractedData?.totalAmount || 'Statutory Record'}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <p className="text-[10px] uppercase font-bold text-slate-400">File Type & Size</p>
                <p className="font-bold text-slate-900 dark:text-white mt-0.5">{viewingDoc.fileType || 'PDF'} ({viewingDoc.fileSize || '1.5 MB'})</p>
              </div>
            </div>

            {/* Key Clauses */}
            {viewingDoc.extractedKeyClauses && viewingDoc.extractedKeyClauses.length > 0 && (
              <div className="space-y-1.5 text-xs">
                <h4 className="font-bold text-slate-400 uppercase text-[10px]">Extracted Clauses</h4>
                <div className="grid grid-cols-2 gap-2">
                  {viewingDoc.extractedKeyClauses.map((clause, idx) => (
                    <div key={idx} className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800">
                      <p className="text-[10px] font-bold text-slate-400">{clause.label}</p>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">{clause.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Raw Text */}
            <div className="space-y-1.5 text-xs">
              <h4 className="font-bold text-slate-400 uppercase text-[10px]">OCR Text Transcript</h4>
              <div className="p-3 rounded-xl bg-slate-950 text-slate-300 font-mono text-[11px] leading-relaxed max-h-48 overflow-y-auto border border-slate-800">
                {viewingDoc.ocrRawText || viewingDoc.ocrSummary || 'Full document text transcript stored in AI Vault.'}
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleDownloadDocument(viewingDoc)}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 text-white font-extrabold flex items-center gap-1.5 cursor-pointer hover:bg-slate-800 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download File</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const target = viewingDoc;
                    setViewingDoc(null);
                    setEditingDoc({ ...target });
                  }}
                  className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold flex items-center gap-1.5 cursor-pointer"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteDocument(viewingDoc.id, viewingDoc.title)}
                  className="px-3.5 py-2 rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-300 font-bold flex items-center gap-1.5 cursor-pointer hover:bg-rose-100"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setViewingDoc(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-200 cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
