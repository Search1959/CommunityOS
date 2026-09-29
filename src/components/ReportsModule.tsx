import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Download, 
  FileSpreadsheet, 
  FileText, 
  Plus, 
  Upload, 
  Eye, 
  Pencil, 
  Trash2, 
  X, 
  Search, 
  CheckCircle2, 
  ShieldCheck, 
  FilePlus, 
  FolderOpen
} from 'lucide-react';
import { Organization, AuditReport } from '../types';
import { INITIAL_AUDIT_REPORTS } from '../data/mockData';

interface ReportsModuleProps {
  reports?: AuditReport[];
  activeOrg: Organization;
  onAddReport?: (report: AuditReport) => void;
  onUpdateReport?: (report: AuditReport) => void;
  onDeleteReport?: (id: string) => void;
}

export const ReportsModule: React.FC<ReportsModuleProps> = ({
  reports,
  activeOrg,
  onAddReport,
  onUpdateReport,
  onDeleteReport,
}) => {
  const [localReports, setLocalReports] = useState<AuditReport[]>(
    reports && reports.length > 0 ? reports : INITIAL_AUDIT_REPORTS
  );

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Modals state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [viewingReport, setViewingReport] = useState<AuditReport | null>(null);
  const [editingReport, setEditingReport] = useState<AuditReport | null>(null);

  // Form State for Add / Upload Report
  const [newReportForm, setNewReportForm] = useState({
    name: '',
    category: 'Statutory Financial Audit',
    type: 'PDF' as AuditReport['type'],
    size: '1.5 MB',
    uploadDate: new Date().toISOString().split('T')[0],
    description: '',
    fileUrl: '',
    fileContent: ''
  });

  // Keep local state in sync when props change
  useEffect(() => {
    if (reports && reports.length > 0) {
      setLocalReports(reports);
    }
  }, [reports]);

  const handleDownloadReport = (r: AuditReport) => {
    // If it's a data URL, download directly
    if (r.fileUrl && r.fileUrl.startsWith('data:')) {
      const a = document.createElement('a');
      a.href = r.fileUrl;
      a.download = `${r.name.replace(/[^a-zA-Z0-9_-]/g, '_')}.${r.type.toLowerCase()}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return;
    }

    // If it's an external web URL, open in new tab
    if (r.fileUrl && (r.fileUrl.startsWith('http://') || r.fileUrl.startsWith('https://'))) {
      window.open(r.fileUrl, '_blank');
      return;
    }

    // Fallback: Generate real text/CSV/document downloadable file
    const ext = r.type === 'Excel' ? 'csv' : r.type === 'CSV' ? 'csv' : r.type.toLowerCase();
    const fileContent = r.fileContent || `====================================================
${r.name.toUpperCase()} - COMPLIANCE AUDIT REPORT
====================================================
Organization Name: ${activeOrg.name}
Registration No: ${activeOrg.regNo}
PAN Number: ${activeOrg.pan}
80G Order Ref: ${activeOrg.eightyG || 'N/A'}
Report Category: ${r.category}
Report Format: ${r.type}
Report Size: ${r.size}
Audit Date: ${r.uploadDate}

STATUTORY AUDIT STATEMENT & OVERVIEW:
----------------------------------------------------
${r.description || 'Certified statutory audit report and master ledger record verified for official compliance.'}

OFFICIAL COMPLIANCE STAMP & DIGITAL SEAL:
----------------------------------------------------
Issued by Executive Board / CAG Empanelled Auditor
Domain: ${activeOrg.websiteDomain}
Email: ${activeOrg.email} | Phone: ${activeOrg.phone}

====================================================
Generated & Exported from CommunityOS Audit Portal
====================================================
`;

    const mimeType = r.type === 'Excel' || r.type === 'CSV' 
      ? 'text/csv;charset=utf-8' 
      : 'text/plain;charset=utf-8';

    const blob = new Blob([fileContent], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${r.name.replace(/[^a-zA-Z0-9_-]/g, '_')}_${r.uploadDate}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (file: File, isEditMode: boolean = false) => {
    const reader = new FileReader();

    if (file.type.includes('text') || file.name.endsWith('.txt') || file.name.endsWith('.csv') || file.name.endsWith('.json')) {
      const textReader = new FileReader();
      textReader.onload = (e) => {
        const text = e.target?.result as string;
        if (isEditMode) {
          setEditingReport(prev => prev ? ({ ...prev, fileContent: text }) : null);
        } else {
          setNewReportForm(prev => ({ ...prev, fileContent: text }));
        }
      };
      textReader.readAsText(file);
    }

    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const formattedSize = file.size > 1024 * 1024 
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
        : `${(file.size / 1024).toFixed(1)} KB`;
      
      let detectedType: AuditReport['type'] = 'PDF';
      if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.name.endsWith('.csv')) {
        detectedType = 'Excel';
      } else if (file.name.endsWith('.doc') || file.name.endsWith('.docx')) {
        detectedType = 'Word';
      }

      if (isEditMode) {
        setEditingReport(prev => prev ? ({
          ...prev,
          fileUrl: dataUrl,
          size: formattedSize,
          type: detectedType,
          name: prev.name || file.name.replace(/\.[^/.]+$/, "")
        }) : null);
      } else {
        setNewReportForm(prev => ({
          ...prev,
          fileUrl: dataUrl,
          size: formattedSize,
          type: detectedType,
          name: prev.name || file.name.replace(/\.[^/.]+$/, "")
        }));
      }
    };

    reader.readAsDataURL(file);
  };

  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReportForm.name.trim()) return;

    const created: AuditReport = {
      id: `report-${Date.now()}`,
      orgId: activeOrg.id,
      name: newReportForm.name,
      category: newReportForm.category,
      type: newReportForm.type,
      size: newReportForm.size || '1.2 MB',
      uploadDate: newReportForm.uploadDate || new Date().toISOString().split('T')[0],
      description: newReportForm.description || 'Uploaded statutory audit report and compliance ledger.',
      fileUrl: newReportForm.fileUrl,
      fileContent: newReportForm.fileContent || newReportForm.description
    };

    if (onAddReport) {
      onAddReport(created);
    } else {
      setLocalReports([created, ...localReports]);
    }

    setShowUploadModal(false);
    setNewReportForm({
      name: '',
      category: 'Statutory Financial Audit',
      type: 'PDF',
      size: '1.5 MB',
      uploadDate: new Date().toISOString().split('T')[0],
      description: '',
      fileUrl: '',
      fileContent: ''
    });
  };

  const handleSaveEditedReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReport) return;

    if (onUpdateReport) {
      onUpdateReport(editingReport);
    } else {
      setLocalReports(localReports.map(r => r.id === editingReport.id ? editingReport : r));
    }

    if (viewingReport?.id === editingReport.id) {
      setViewingReport(editingReport);
    }
    setEditingReport(null);
  };

  const handleDeleteReportAction = (reportId: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete audit report "${name}"?`)) {
      if (onDeleteReport) {
        onDeleteReport(reportId);
      } else {
        setLocalReports(localReports.filter(r => r.id !== reportId));
      }

      if (viewingReport?.id === reportId) {
        setViewingReport(null);
      }
    }
  };

  // Filtering
  const filteredReports = localReports.filter((r) => {
    const matchesSearch = 
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.category.toLowerCase().includes(search.toLowerCase()) ||
      (r.description && r.description.toLowerCase().includes(search.toLowerCase()));
    
    const matchesCategory = 
      selectedCategory === 'All' || r.category === selectedCategory || r.type === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-rose-500" />
            <span>Audit & Compliance Export Reports</span>
          </h1>
          <p className="text-xs text-slate-500">
            Export Certified Financial Audits, Member Directories, 80G Tax Schedules & Official Minutes for {activeOrg.name}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>Upload New Report</span>
          </button>
        </div>
      </div>

      {/* Filter Bar & Search */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search audit reports by name or keyword..."
              className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {['All', 'Statutory Financial Audit', 'Membership Master Directory', 'Tax & Compliance', 'Governance & Minutes'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Audit Reports List */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <span>Ready to Download Audit Reports ({filteredReports.length})</span>
          </h2>
          <span className="text-[11px] font-semibold text-slate-400">
            Reg No: {activeOrg.regNo} | PAN: {activeOrg.pan}
          </span>
        </div>

        <div className="space-y-3">
          {filteredReports.map((r) => (
            <div 
              key={r.id} 
              className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-300 dark:hover:border-slate-700 transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0 mt-0.5">
                  {r.type === 'Excel' || r.type === 'CSV' ? (
                    <FileSpreadsheet className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <FileText className="w-5 h-5 text-rose-500" />
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">{r.name}</h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
                      {r.category}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-1">{r.description}</p>

                  <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-0.5">
                    <span>Format: <strong className="text-slate-700 dark:text-slate-300">{r.type}</strong></span>
                    <span>•</span>
                    <span>Size: <strong className="text-slate-700 dark:text-slate-300">{r.size}</strong></span>
                    <span>•</span>
                    <span>Date: <strong className="text-slate-700 dark:text-slate-300">{r.uploadDate}</strong></span>
                  </div>
                </div>
              </div>

              {/* Action Buttons: View, Edit, Delete, Download */}
              <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                
                {/* View Button */}
                <button
                  onClick={() => setViewingReport(r)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                  title="View Report Details & Summary"
                >
                  <Eye className="w-3.5 h-3.5 text-blue-500" />
                  <span>View</span>
                </button>

                {/* Edit Button */}
                <button
                  onClick={() => setEditingReport({ ...r })}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                  title="Edit Report Details"
                >
                  <Pencil className="w-3.5 h-3.5 text-amber-500" />
                  <span>Edit</span>
                </button>

                {/* Delete Button */}
                <button
                  onClick={() => handleDeleteReportAction(r.id, r.name)}
                  className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 font-bold text-xs transition-all cursor-pointer"
                  title="Delete Report"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                {/* Download Button */}
                <button
                  onClick={() => handleDownloadReport(r)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                  title="Download File"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>

              </div>
            </div>
          ))}

          {filteredReports.length === 0 && (
            <div className="text-center py-12 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400 text-xs space-y-3">
              <FolderOpen className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="font-semibold">No audit reports match your criteria.</p>
              <button
                onClick={() => setShowUploadModal(true)}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs shadow-md"
              >
                Upload First Audit Report
              </button>
            </div>
          )}
        </div>
      </div>

      {/* UPLOAD / ADD REPORT MODAL */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowUploadModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400">
                <FilePlus className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white">Upload New Audit Report</h2>
                <p className="text-xs text-slate-500">Add certified financial audits or registers for {activeOrg.name}</p>
              </div>
            </div>

            <form onSubmit={handleCreateReport} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-500 font-medium mb-1">Report Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Annual Statutory Audit Report FY 2025-26"
                  value={newReportForm.name}
                  onChange={(e) => setNewReportForm({ ...newReportForm, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Category *</label>
                  <select
                    value={newReportForm.category}
                    onChange={(e) => setNewReportForm({ ...newReportForm, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white"
                  >
                    <option value="Statutory Financial Audit">Statutory Financial Audit</option>
                    <option value="Membership Master Directory">Membership Master Directory</option>
                    <option value="Tax & Compliance">Tax & Compliance (80G/12A)</option>
                    <option value="Governance & Minutes">Governance & Minutes</option>
                    <option value="Welfare Disbursal Audit">Welfare Disbursal Audit</option>
                    <option value="General Compliance">General Compliance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-500 font-medium mb-1">Format / Type *</label>
                  <select
                    value={newReportForm.type}
                    onChange={(e) => setNewReportForm({ ...newReportForm, type: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white"
                  >
                    <option value="PDF">PDF Format</option>
                    <option value="Excel">Excel / CSV Format</option>
                    <option value="Word">Word Document</option>
                    <option value="CSV">Plain CSV</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Report Date *</label>
                  <input
                    type="date"
                    required
                    value={newReportForm.uploadDate}
                    onChange={(e) => setNewReportForm({ ...newReportForm, uploadDate: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 font-medium mb-1">File Size Tag</label>
                  <input
                    type="text"
                    placeholder="e.g. 2.4 MB"
                    value={newReportForm.size}
                    onChange={(e) => setNewReportForm({ ...newReportForm, size: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 font-medium mb-1">Upload Report File from Computer</label>
                <div className="space-y-2">
                  <label className="w-full p-3 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 cursor-pointer">
                    <Upload className="w-4 h-4 text-rose-500" />
                    <span className="font-bold text-slate-700 dark:text-slate-300">Choose File to Upload</span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleFileUpload(e.target.files[0], false);
                        }
                      }}
                    />
                  </label>

                  {newReportForm.fileUrl && newReportForm.fileUrl.startsWith('data:') && (
                    <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 flex items-center justify-between text-[11px]">
                      <span className="font-bold">File attached successfully ({newReportForm.size})!</span>
                      <button
                        type="button"
                        onClick={() => setNewReportForm({ ...newReportForm, fileUrl: '' })}
                        className="text-rose-500 font-bold hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-slate-500 font-medium mb-1">Report Description & Summary Notes</label>
                <textarea
                  rows={3}
                  placeholder="Summary of financial figures, auditor notes, or register contents..."
                  value={newReportForm.description}
                  onChange={(e) => setNewReportForm({ ...newReportForm, description: e.target.value, fileContent: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold shadow-md cursor-pointer transition-all"
                >
                  Save & Publish Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT REPORT MODAL */}
      {editingReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setEditingReport(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <Pencil className="w-5 h-5 text-amber-500" />
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">Edit Audit Report Details</h2>
            </div>

            <form onSubmit={handleSaveEditedReport} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-500 font-medium mb-1">Report Title *</label>
                <input
                  type="text"
                  required
                  value={editingReport.name}
                  onChange={(e) => setEditingReport({ ...editingReport, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Category *</label>
                  <select
                    value={editingReport.category}
                    onChange={(e) => setEditingReport({ ...editingReport, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white"
                  >
                    <option value="Statutory Financial Audit">Statutory Financial Audit</option>
                    <option value="Membership Master Directory">Membership Master Directory</option>
                    <option value="Tax & Compliance">Tax & Compliance (80G/12A)</option>
                    <option value="Governance & Minutes">Governance & Minutes</option>
                    <option value="Welfare Disbursal Audit">Welfare Disbursal Audit</option>
                    <option value="General Compliance">General Compliance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-500 font-medium mb-1">Format / Type *</label>
                  <select
                    value={editingReport.type}
                    onChange={(e) => setEditingReport({ ...editingReport, type: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white"
                  >
                    <option value="PDF">PDF Format</option>
                    <option value="Excel">Excel / CSV Format</option>
                    <option value="Word">Word Document</option>
                    <option value="CSV">Plain CSV</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Report Date *</label>
                  <input
                    type="date"
                    required
                    value={editingReport.uploadDate}
                    onChange={(e) => setEditingReport({ ...editingReport, uploadDate: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 font-medium mb-1">File Size Tag</label>
                  <input
                    type="text"
                    value={editingReport.size}
                    onChange={(e) => setEditingReport({ ...editingReport, size: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 font-medium mb-1">Replace / Re-upload File</label>
                <div className="space-y-2">
                  <label className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 cursor-pointer">
                    <Upload className="w-4 h-4 text-amber-500" />
                    <span className="font-bold text-slate-700 dark:text-slate-300">Choose New File</span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleFileUpload(e.target.files[0], true);
                        }
                      }}
                    />
                  </label>

                  {editingReport.fileUrl && editingReport.fileUrl.startsWith('data:') && (
                    <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 flex items-center justify-between text-[11px]">
                      <span className="font-bold">New file attached ({editingReport.size})!</span>
                      <button
                        type="button"
                        onClick={() => setEditingReport({ ...editingReport, fileUrl: '' })}
                        className="text-rose-500 font-bold hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-slate-500 font-medium mb-1">Description & Notes</label>
                <textarea
                  rows={3}
                  value={editingReport.description || ''}
                  onChange={(e) => setEditingReport({ ...editingReport, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingReport(null)}
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

      {/* VIEW REPORT DETAILS MODAL */}
      {viewingReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setViewingReport(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 shrink-0">
                {viewingReport.type === 'Excel' || viewingReport.type === 'CSV' ? (
                  <FileSpreadsheet className="w-6 h-6 text-emerald-500" />
                ) : (
                  <FileText className="w-6 h-6 text-rose-500" />
                )}
              </div>

              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 uppercase">
                  {viewingReport.category}
                </span>
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white mt-1">{viewingReport.name}</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Format: {viewingReport.type} • Size: {viewingReport.size} • Date: {viewingReport.uploadDate}
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <h3 className="text-slate-400 uppercase font-bold text-[10px] tracking-wider mb-1">
                  Report Scope & Overview
                </h3>
                <p className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium">
                  {viewingReport.description || 'Verified statutory audit report and master ledger.'}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 text-slate-200 font-mono text-[11px] leading-relaxed max-h-48 overflow-y-auto border border-slate-800 space-y-1">
                <p className="text-amber-400 font-bold">// REPORT PREVIEW / AUDIT TRANSCRIPT</p>
                <pre className="whitespace-pre-wrap font-mono text-xs">
                  {viewingReport.fileContent || `${viewingReport.name}
Organization: ${activeOrg.name}
Registration No: ${activeOrg.regNo}
PAN: ${activeOrg.pan}
Audit Status: Verified Unqualified Audit
Date: ${viewingReport.uploadDate}`}
                </pre>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="font-bold text-emerald-900 dark:text-emerald-200">
                    Certified Compliance Seal Verified
                  </span>
                </div>
                <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400">
                  {activeOrg.slug.toUpperCase()}-VERIFIED
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => {
                  setEditingReport({ ...viewingReport });
                }}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs cursor-pointer"
              >
                Edit Report
              </button>

              <button
                onClick={() => handleDownloadReport(viewingReport)}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Report</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
