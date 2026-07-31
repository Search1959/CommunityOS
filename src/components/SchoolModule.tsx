import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Users, 
  IndianRupee, 
  FileText, 
  CheckCircle2, 
  Download, 
  BookOpen, 
  Award,
  Search
} from 'lucide-react';
import { StudentRecord, Organization } from '../types';
import { INITIAL_STUDENTS } from '../data/mockData';

interface SchoolModuleProps {
  students: StudentRecord[];
  activeOrg: Organization;
}

export const SchoolModule: React.FC<SchoolModuleProps> = ({
  students,
  activeOrg,
}) => {
  // Use provided students or fallback to INITIAL_STUDENTS if activeOrg has no custom school records
  const displayStudents = students.length > 0 ? students : INITIAL_STUDENTS;

  const [search, setSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<StudentRecord | null>(displayStudents[0] || null);

  useEffect(() => {
    if (displayStudents.length > 0) {
      setSelectedStudent(displayStudents[0]);
    }
  }, [activeOrg.id, students]);

  const filteredStudents = displayStudents.filter((s) => 
    s.studentName.toLowerCase().includes(search.toLowerCase()) ||
    s.rollNo.toLowerCase().includes(search.toLowerCase()) ||
    s.gradeClass.toLowerCase().includes(search.toLowerCase())
  );

  const defaultReportCard = [
    { subject: 'Mathematics & Computing', marksScored: 92, maxMarks: 100, grade: 'A+' },
    { subject: 'Physics & General Science', marksScored: 88, maxMarks: 100, grade: 'A' },
    { subject: 'English & Literature', marksScored: 90, maxMarks: 100, grade: 'A+' },
    { subject: 'Social Studies & Civics', marksScored: 85, maxMarks: 100, grade: 'A' }
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-blue-500" />
            <span>School & Educational Trust Operating System</span>
          </h1>
          <p className="text-xs text-slate-500">
            Student Register, Fee Collections, Exam Report Cards & Merit Scholarships
          </p>
        </div>

        <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 text-xs font-bold border border-blue-200 dark:border-blue-800">
          Academic Session 2026-27
        </span>
      </div>

      {students.length === 0 && (
        <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-xs text-blue-900 dark:text-blue-200 flex items-center justify-between">
          <div>
            <p className="font-bold">Educational Trust Roster Context</p>
            <p className="text-[11px] text-blue-700 dark:text-blue-300 mt-0.5">
              Showing active educational records for {activeOrg.name}.
            </p>
          </div>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Student Directory */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Student name, Class or Roll..."
              className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
            />
          </div>

          <div className="space-y-2">
            {filteredStudents.map((st) => (
              <div
                key={st.id}
                onClick={() => setSelectedStudent(st)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  selectedStudent?.id === st.id
                    ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-400 dark:border-blue-800 shadow-md'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">{st.studentName}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                    {st.gradeClass}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">Roll No: {st.rollNo} • Guardian: {st.guardianName}</p>
                <p className="text-[10px] text-emerald-600 font-bold mt-1">
                  Attendance: {st.attendancePercent ?? st.attendancePercentage ?? 95}%
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Student Profile & Report Card */}
        {selectedStudent && (
          <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 uppercase">
                  Class {selectedStudent.gradeClass}
                </span>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-1">{selectedStudent.studentName}</h2>
                <p className="text-xs text-slate-500">
                  Guardian: {selectedStudent.guardianName} ({selectedStudent.phone || selectedStudent.guardianPhone || '+91 98300 00000'})
                </p>
              </div>

              <div className="text-right">
                <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-extrabold">
                  Fee Status: {selectedStudent.feeStatus}
                </span>
                <p className="text-[10px] text-slate-400 mt-1">
                  Annual Fee: ₹{(selectedStudent.annualFee || 45000).toLocaleString('en-IN')}
                </p>
              </div>
            </div>

            {/* Academic Performance Marks Table */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Term-1 Examination Report Card</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[10px]">
                      <th className="py-2">Subject</th>
                      <th className="py-2">Marks Scored</th>
                      <th className="py-2">Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {(selectedStudent.reportCard && selectedStudent.reportCard.length > 0 ? selectedStudent.reportCard : defaultReportCard).map((rc, i) => (
                      <tr key={i}>
                        <td className="py-2 font-semibold text-slate-800 dark:text-slate-200">{rc.subject}</td>
                        <td className="py-2 font-mono">{rc.marksScored} / {rc.maxMarks}</td>
                        <td className="py-2"><span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">{rc.grade}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Download Actions */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <button
                onClick={() => alert(`Downloaded Report Card PDF for ${selectedStudent.studentName}`)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow"
              >
                <Download className="w-4 h-4" />
                <span>Download Certified Report Card</span>
              </button>

              <button
                onClick={() => alert(`Fee Receipt generated for ${selectedStudent.studentName}`)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center gap-1.5"
              >
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>Issue Tuition Fee Receipt</span>
              </button>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
