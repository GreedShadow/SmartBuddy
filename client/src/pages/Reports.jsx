import { useEffect, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import jsPDF from 'jspdf';
import { Download, Printer } from 'lucide-react';
import { api } from '../services/api.js';
import { EmptyState, Loading, PageHeader, statusBadge } from '../components/UI.jsx';

export default function Reports() {
  const [students, setStudents] = useState(null);
  const [studentId, setStudentId] = useState('');
  const [report, setReport] = useState(null);
  const ref = useRef(null);
  const print = useReactToPrint({ contentRef: ref, documentTitle: report ? `${report.student.name}-report` : 'student-report' });
  useEffect(() => { api('/students').then(setStudents); }, []);
  async function generate() {
    if (!studentId) return;
    setReport(await api(`/reports/${studentId}`));
  }
  function downloadPdf() {
    const doc = new jsPDF();
    doc.text(`SmartBuddy Student Report`, 15, 15);
    doc.text(`Student: ${report.student.name}`, 15, 28);
    doc.text(`Class: ${report.student.class_name || 'N/A'}`, 15, 36);
    doc.text(`Average: ${report.average} (${report.remarks})`, 15, 44);
    report.grades.forEach((g, i) => doc.text(`${g.subject_name} - ${g.term}: ${g.average} ${g.remarks}`, 15, 58 + i * 8));
    doc.save(`${report.student.name}-SmartBuddy-report.pdf`);
  }
  if (!students) return <Loading />;
  return <div>
    <PageHeader title="Reports" subtitle="Generate clean printable student performance reports with grades, attendance, remarks, and comments." />
    <div className="no-print mb-5 flex flex-col gap-3 rounded-lg border bg-white p-4 sm:flex-row">
      <select className="input" value={studentId} onChange={(e) => setStudentId(e.target.value)}><option value="">Choose student</option>{students.map((s) => <option key={s.id} value={s.id}>{s.name} - {s.student_no}</option>)}</select>
      <button className="btn-primary" onClick={generate}>Generate</button>
      {report && <button className="btn-muted" onClick={print}><Printer size={16} /> Print</button>}
      {report && <button className="btn-muted" onClick={downloadPdf}><Download size={16} /> PDF</button>}
    </div>
    {!report ? <EmptyState title="No report selected" text="Select a student and generate a report." /> : <div ref={ref} className="card p-8">
      <div className="border-b pb-5"><h1 className="text-2xl font-bold">SmartBuddy Student Performance Report</h1><p className="text-sm text-slate-500">Generated academic summary</p></div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2"><Info label="Student" value={report.student.name} /><Info label="Student No." value={report.student.student_no} /><Info label="Class" value={report.student.class_name} /><Info label="Overall" value={`${report.average} - ${report.remarks}`} /></div>
      <h2 className="mt-6 font-bold">Grades</h2><table className="mt-2 w-full text-left text-sm"><tbody>{report.grades.map((g) => <tr className="border-b" key={g.id}><td className="py-2">{g.subject_name}</td><td>{g.term}</td><td>{g.average}</td><td>{statusBadge(g.remarks)}</td></tr>)}</tbody></table>
      <h2 className="mt-6 font-bold">Attendance Summary</h2><div className="mt-2 flex flex-wrap gap-2">{report.attendance.map((a) => <span className="badge bg-slate-100 text-slate-700" key={a.status}>{a.status}: {a.count}</span>)}</div>
      <h2 className="mt-6 font-bold">Teacher Comments</h2>{report.comments.map((c) => <p className="mt-2 rounded-lg bg-slate-50 p-3 text-sm" key={c.created_at}>{c.comment} <span className="text-slate-500">- {c.teacher_name}</span></p>)}
    </div>}
  </div>;
}
function Info({ label, value }) { return <div><p className="text-xs font-semibold uppercase text-slate-500">{label}</p><p className="font-semibold">{value || '—'}</p></div>; }
