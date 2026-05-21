import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Edit3, Plus, Search, Trash2 } from 'lucide-react';
import { api } from '../services/api.js';
import { EmptyState, Loading, Modal, PageHeader } from '../components/UI.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const meta = {
  students: { title: 'Students', subtitle: 'Manage student records, class assignment, guardian details, and profiles.', endpoint: '/students' },
  teachers: { title: 'Teachers', subtitle: 'Manage faculty profiles and departments.', endpoint: '/teachers' },
  subjects: { title: 'Subjects', subtitle: 'Maintain subject codes and descriptions.', endpoint: '/subjects' },
  classes: { title: 'Classes', subtitle: 'Create sections and assign advisers.', endpoint: '/classes' }
};

export default function ManagePage({ type }) {
  const { user } = useAuth();
  const m = meta[type];
  const [rows, setRows] = useState(null);
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null);
  const [message, setMessage] = useState('');
  const canEdit = user.role === 'admin';

  async function load() {
    const [data, classData, teacherData] = await Promise.all([api(m.endpoint), api('/classes'), api('/teachers').catch(() => [])]);
    setRows(data); setClasses(classData); setTeachers(teacherData);
  }
  useEffect(() => { load(); }, [type]);
  const filtered = useMemo(() => (rows || []).filter((r) => JSON.stringify(r).toLowerCase().includes(search.toLowerCase())), [rows, search]);

  async function remove(row) {
    if (!window.confirm(`Delete ${row.name || row.code}? This cannot be undone.`)) return;
    await api(`${m.endpoint}/${row.id}`, { method: 'DELETE' });
    setMessage('Record deleted.');
    load();
  }

  if (!rows) return <Loading />;
  return <div>
    <PageHeader title={m.title} subtitle={m.subtitle} action={canEdit && <button className="btn-primary" onClick={() => setEditing({})}><Plus size={16} /> Add {m.title.slice(0, -1)}</button>} />
    {message && <div className="mb-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">{message}</div>}
    <div className="mb-4 flex max-w-md items-center gap-2 rounded-lg border bg-white px-3 py-2"><Search size={18} className="text-slate-400" /><input className="w-full outline-none" placeholder={`Search ${m.title.toLowerCase()}...`} value={search} onChange={(e) => setSearch(e.target.value)} /></div>
    <div className="card overflow-x-auto">
      {filtered.length ? <table className="w-full min-w-[760px] text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr>{columns(type).map((c) => <th className="p-3" key={c.key}>{c.label}</th>)}<th className="p-3">Actions</th></tr></thead>
        <tbody>{filtered.map((row) => <tr className="border-t" key={row.id}>{columns(type).map((c) => <td className="p-3" key={c.key}>{renderCell(type, c.key, row)}</td>)}<td className="flex gap-2 p-3">
          {type === 'students' && <Link className="btn-muted" to={`/students/${row.id}`}>Profile</Link>}
          {canEdit && <button className="btn-muted" onClick={() => setEditing(row)}><Edit3 size={15} /></button>}
          {canEdit && <button className="btn-danger" onClick={() => remove(row)}><Trash2 size={15} /></button>}
        </td></tr>)}</tbody>
      </table> : <EmptyState text="Try a different search or add a new record." />}
    </div>
    {editing && <Modal title={`${editing.id ? 'Edit' : 'Add'} ${m.title.slice(0, -1)}`} onClose={() => setEditing(null)}>
      <RecordForm type={type} record={editing} classes={classes} teachers={teachers} onSaved={() => { setEditing(null); setMessage('Record saved.'); load(); }} />
    </Modal>}
  </div>;
}

function columns(type) {
  return {
    students: [{ key: 'student_no', label: 'Student No.' }, { key: 'name', label: 'Name' }, { key: 'email', label: 'Email' }, { key: 'class_name', label: 'Class' }, { key: 'guardian_name', label: 'Guardian' }],
    teachers: [{ key: 'employee_no', label: 'Employee No.' }, { key: 'name', label: 'Name' }, { key: 'email', label: 'Email' }, { key: 'department', label: 'Department' }, { key: 'phone', label: 'Phone' }],
    subjects: [{ key: 'code', label: 'Code' }, { key: 'name', label: 'Name' }, { key: 'description', label: 'Description' }],
    classes: [{ key: 'name', label: 'Class' }, { key: 'grade_level', label: 'Grade' }, { key: 'section', label: 'Section' }, { key: 'student_count', label: 'Students' }]
  }[type];
}

function renderCell(type, key, row) {
  if (type === 'classes' && key === 'student_count') return row[key] || 0;
  return row[key] || '—';
}

function RecordForm({ type, record, classes, teachers, onSaved }) {
  const endpoint = meta[type].endpoint;
  const [form, setForm] = useState(defaults(type, record));
  const [error, setError] = useState('');
  const set = (key, value) => setForm((old) => ({ ...old, [key]: value }));

  async function submit(e) {
    e.preventDefault();
    setError('');
    try {
      const payload = normalize(type, form, record);
      await api(record.id ? `${endpoint}/${record.id}` : endpoint, { method: record.id ? 'PUT' : 'POST', body: JSON.stringify(payload) });
      onSaved();
    } catch (err) { setError(err.message); }
  }

  return <form className="grid gap-3" onSubmit={submit}>
    {error && <div className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error}</div>}
    {(type === 'students' || type === 'teachers') && !record.id && <>
      <input className="input" placeholder="Full name" value={form.name} onChange={(e) => set('name', e.target.value)} required />
      <input className="input" type="email" placeholder="Email" value={form.email} onChange={(e) => set('email', e.target.value)} required />
      <input className="input" placeholder="Temporary password" value={form.password} onChange={(e) => set('password', e.target.value)} />
    </>}
    {type === 'students' && <>
      <input className="input" placeholder="Student number" value={form.student_no} onChange={(e) => set('student_no', e.target.value)} required />
      <select className="input" value={form.class_id || ''} onChange={(e) => set('class_id', e.target.value)}><option value="">No class</option>{classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
      <input className="input" placeholder="Guardian name" value={form.guardian_name} onChange={(e) => set('guardian_name', e.target.value)} />
      <input className="input" placeholder="Guardian phone" value={form.guardian_phone} onChange={(e) => set('guardian_phone', e.target.value)} />
      <input className="input" placeholder="Address" value={form.address} onChange={(e) => set('address', e.target.value)} />
    </>}
    {type === 'teachers' && <>
      <input className="input" placeholder="Employee number" value={form.employee_no} onChange={(e) => set('employee_no', e.target.value)} required />
      <input className="input" placeholder="Department" value={form.department} onChange={(e) => set('department', e.target.value)} required />
      <input className="input" placeholder="Phone" value={form.phone} onChange={(e) => set('phone', e.target.value)} />
    </>}
    {type === 'subjects' && <>
      <input className="input" placeholder="Code" value={form.code} onChange={(e) => set('code', e.target.value)} required />
      <input className="input" placeholder="Subject name" value={form.name} onChange={(e) => set('name', e.target.value)} required />
      <textarea className="input" placeholder="Description" value={form.description} onChange={(e) => set('description', e.target.value)} />
    </>}
    {type === 'classes' && <>
      <input className="input" placeholder="Class name" value={form.name} onChange={(e) => set('name', e.target.value)} required />
      <input className="input" placeholder="Grade level" value={form.grade_level} onChange={(e) => set('grade_level', e.target.value)} required />
      <input className="input" placeholder="Section" value={form.section} onChange={(e) => set('section', e.target.value)} required />
      <select className="input" value={form.adviser_teacher_id || ''} onChange={(e) => set('adviser_teacher_id', e.target.value)}><option value="">No adviser</option>{teachers.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select>
    </>}
    <button className="btn-primary">Save</button>
  </form>;
}

function defaults(type, r) {
  const base = { name: '', email: '', password: 'password123' };
  return { ...base, ...r, class_id: r.class_id || '', adviser_teacher_id: r.adviser_teacher_id || '', guardian_name: r.guardian_name || '', guardian_phone: r.guardian_phone || '', address: r.address || '', phone: r.phone || '', description: r.description || '' };
}

function normalize(type, form, record) {
  const numberOrNull = (v) => v ? Number(v) : null;
  if (type === 'students') return { ...form, user_id: record.user_id, class_id: numberOrNull(form.class_id) };
  if (type === 'teachers') return { ...form, user_id: record.user_id };
  if (type === 'classes') return { ...form, adviser_teacher_id: numberOrNull(form.adviser_teacher_id) };
  return form;
}
