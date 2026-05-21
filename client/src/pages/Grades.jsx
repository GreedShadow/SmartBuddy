import { useEffect, useState } from 'react';
import { Save, Trash2 } from 'lucide-react';
import { api } from '../services/api.js';
import { EmptyState, Loading, PageHeader, statusBadge } from '../components/UI.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const initial = { student_id: '', subject_id: '', class_id: '', term: 'First Quarter', quiz: 0, activity: 0, exam: 0, final_grade: 0 };
export default function Grades() {
  const { user } = useAuth();
  const [rows, setRows] = useState(null);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [filters, setFilters] = useState({ class_id: '', subject_id: '', term: '' });
  const [form, setForm] = useState(initial);
  const canEdit = user.role !== 'student';
  async function load() {
    const qs = new URLSearchParams(Object.fromEntries(Object.entries(filters).filter(([, v]) => v))).toString();
    const [g, st, su, cl] = await Promise.all([api(`/grades?${qs}`), api('/students'), api('/subjects'), api('/classes')]);
    setRows(g); setStudents(st); setSubjects(su); setClasses(cl);
  }
  useEffect(() => { load(); }, [filters.class_id, filters.subject_id, filters.term]);
  async function submit(e) {
    e.preventDefault();
    await api('/grades', { method: 'POST', body: JSON.stringify({ ...form, student_id: Number(form.student_id), subject_id: Number(form.subject_id), class_id: form.class_id ? Number(form.class_id) : null, quiz: Number(form.quiz), activity: Number(form.activity), exam: Number(form.exam), final_grade: Number(form.final_grade) }) });
    setForm(initial); load();
  }
  async function remove(id) {
    if (!window.confirm('Delete this grade?')) return;
    await api(`/grades/${id}`, { method: 'DELETE' }); load();
  }
  if (!rows) return <Loading />;
  return <div>
    <PageHeader title="Grades" subtitle="Record quizzes, activities, exams, final grades, and computed remarks." />
    <div className="mb-5 grid gap-3 rounded-lg border bg-white p-4 md:grid-cols-3">
      <Select value={filters.class_id} onChange={(e) => setFilters({ ...filters, class_id: e.target.value })} options={classes} label="All classes" />
      <Select value={filters.subject_id} onChange={(e) => setFilters({ ...filters, subject_id: e.target.value })} options={subjects} label="All subjects" />
      <select className="input" value={filters.term} onChange={(e) => setFilters({ ...filters, term: e.target.value })}><option value="">All terms</option>{['First Quarter','Second Quarter','Third Quarter','Fourth Quarter'].map((t) => <option key={t}>{t}</option>)}</select>
    </div>
    {canEdit && <form onSubmit={submit} className="mb-5 grid gap-3 rounded-lg border bg-white p-4 lg:grid-cols-5">
      <Select value={form.student_id} onChange={(e) => setForm({ ...form, student_id: e.target.value })} options={students} label="Student" required />
      <Select value={form.subject_id} onChange={(e) => setForm({ ...form, subject_id: e.target.value })} options={subjects} label="Subject" required />
      <Select value={form.class_id} onChange={(e) => setForm({ ...form, class_id: e.target.value })} options={classes} label="Class" />
      <select className="input" value={form.term} onChange={(e) => setForm({ ...form, term: e.target.value })}>{['First Quarter','Second Quarter','Third Quarter','Fourth Quarter'].map((t) => <option key={t}>{t}</option>)}</select>
      {['quiz','activity','exam','final_grade'].map((k) => <input key={k} className="input" type="number" min="0" max="100" placeholder={k.replace('_',' ')} value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />)}
      <button className="btn-primary lg:col-span-5"><Save size={16} /> Save Grade</button>
    </form>}
    {!rows.length ? <EmptyState /> : <div className="card overflow-x-auto"><table className="w-full min-w-[900px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr>{['Student','Subject','Term','Quiz','Activity','Exam','Final','Average','Remarks','Actions'].map((h) => <th className="p-3" key={h}>{h}</th>)}</tr></thead><tbody>{rows.map((r) => <tr className="border-t" key={r.id}><td className="p-3 font-semibold">{r.student_name}</td><td className="p-3">{r.subject_name}</td><td className="p-3">{r.term}</td><td className="p-3">{r.quiz}</td><td className="p-3">{r.activity}</td><td className="p-3">{r.exam}</td><td className="p-3">{r.final_grade}</td><td className="p-3 font-bold">{r.average}</td><td className="p-3">{statusBadge(r.remarks)}</td><td className="p-3">{canEdit && <button className="btn-danger" onClick={() => remove(r.id)}><Trash2 size={15} /></button>}</td></tr>)}</tbody></table></div>}
  </div>;
}

function Select({ options, label, ...props }) {
  return <select className="input" {...props}><option value="">{label}</option>{options.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}</select>;
}
