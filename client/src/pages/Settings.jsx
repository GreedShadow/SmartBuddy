import { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { PageHeader } from '../components/UI.jsx';

export default function Settings() {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: 'password123', role: 'teacher' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  async function submit(e) {
    e.preventDefault();
    setMessage(''); setError('');
    try {
      await api('/auth/register', { method: 'POST', body: JSON.stringify(form) });
      setMessage('User account registered.');
      setForm({ name: '', email: '', password: 'password123', role: 'teacher' });
    } catch (err) { setError(err.message); }
  }
  return <div>
    <PageHeader title="Settings" subtitle="Manage account options and admin-only user registration." />
    <div className="grid gap-5 xl:grid-cols-2">
      <div className="card p-5"><h2 className="font-bold">Profile</h2><p className="mt-3 text-sm text-slate-600">{user.name}</p><p className="text-sm text-slate-500">{user.email}</p><span className="badge mt-3 bg-blue-50 text-blue-700 capitalize">{user.role}</span></div>
      {user.role === 'admin' && <form onSubmit={submit} className="card grid gap-3 p-5">
        <h2 className="font-bold">Register User</h2>
        {message && <div className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">{message}</div>}
        {error && <div className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error}</div>}
        <input className="input" placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input className="input" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <input className="input" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        <select className="input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}><option value="teacher">Teacher</option><option value="student">Student</option><option value="admin">Admin</option></select>
        <button className="btn-primary"><UserPlus size={16} /> Register</button>
      </form>}
    </div>
  </div>;
}
