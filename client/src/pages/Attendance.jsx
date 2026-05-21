import { useEffect, useMemo, useState } from 'react';
import { CalendarPlus, Trash2 } from 'lucide-react';
import { api } from '../services/api.js';
import { EmptyState, Loading, PageHeader, statusBadge } from '../components/UI.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Attendance() {
  const { user } = useAuth();
  const [rows, setRows] = useState(null);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [filters, setFilters] = useState({ date: '', class_id: '', subject_id: '' });
  const [form, setForm] = useState({ student_id: '', subject_id: '', class_id: '', date: new Date().toISOString().slice(0, 10), status: 'Present', remarks: '' });
  const canEdit = user.role !== 'student';
  async function load() {
    const qs = new URLSearchParams(Object.fromEntries(Object.entries(filters).filter(([, v]) => v))).toString();
    const [a, st, su, cl] = await Promise.all([api(`/attendance?${qs}`), api('/students'), api('/subjects'), api('/classes')]);
    setRows(a); setStudents(st); setSubjects(su); setClasses(cl);
  }
  useEffect(() => { load(); }, [filters.date, filters.class_id, filters.subject_id]);
  const attendanceRate = useMemo(() => rows?.length ? Math.round(rows.filter((r) => ['Present', 'Late'].includes(r.status)).length / rows.length * 100) : 0, [rows]);
  async function submit(e) {
    e.preventDefault();
    await api('/attendance', { method: 'POST', body: JSON.stringify({ ...form, student_id: Number(form.student_id), subject_id: Number(form.subject_id), class_id: form.class_id ? Number(form.class_id) : null }) });
    load();
  }
  async function remove(id) {
    if (!window.confirm('Delete attendance entry?')) return;
    await api(`/attendance/${id}`, { method: 'DELETE' }); load();
  }
  if (!rows) return <Loading />;
  return <div>
    <PageHeader title="Attendance" subtitle={`Track attendance by date, class, subject, and student. Current filtered attendance rate: ${attendanceRate}%`} />
    <div className="mb-5 grid gap-3 rounded-lg border bg-white p-4 md:grid-cols-3">
      <input className="input" type="date" value={filters.date} onChange={(e) => setFilters({ ...filters, date: e.target.value })} />
      <Select className="input" value={filters.class_id} onChange={(e) => setFilters({ ...filters, class_id: e.target.value })} options={classes} label="All classes" />
      <Select className="input" value={filters.subject_id} onChange={(e) => setFilters({ ...filters, subject_id: e.target.value })} options={subjects} label="All subjects" />
    </div>
    {canEdit && <form onSubmit={submit} className="mb-5 grid gap-3 rounded-lg border bg-white p-4 lg:grid-cols-6">
      <Select value={form.student_id} onChange={(e) => setForm({ ...form, student_id: e.target.value })} options={students} label="Student" required />
      <Select value={form.subject_id} onChange={(e) => setForm({ ...form, subject_id: e.target.value })} options={subjects} label="Subject" required />
      <Select value={form.class_id} onChange={(e) => setForm({ ...form, class_id: e.target.value })} options={classes} label="Class" />
      <input className="input" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
      <select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>{['Present','Absent','Late','Excused'].map((s) => <option key={s}>{s}</option>)}</select>
      <button className="btn-primary"><CalendarPlus size={16} /> Save</button>
    </form>}
    <Table rows={rows} remove={canEdit ? remove : null} />
  </div>;
}

function Select({ options, label, ...props }) {
  return <select className="input" {...props}><option value="">{label}</option>{options.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}</select>;
}
function Table({ rows, remove }) {
  if (!rows.length) return <EmptyState />;
  return <div className="card overflow-x-auto"><table className="w-full min-w-[800px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="p-3">Date</th><th className="p-3">Student</th><th className="p-3">Subject</th><th className="p-3">Class</th><th className="p-3">Status</th><th className="p-3">Actions</th></tr></thead><tbody>{rows.map((r) => <tr className="border-t" key={r.id}><td className="p-3">{r.date?.slice(0,10)}</td><td className="p-3 font-semibold">{r.student_name}</td><td className="p-3">{r.subject_name}</td><td className="p-3">{r.class_name}</td><td className="p-3">{statusBadge(r.status)}</td><td className="p-3">{remove && <button className="btn-danger" onClick={() => remove(r.id)}><Trash2 size={15} /></button>}</td></tr>)}</tbody></table></div>;
}
