import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { GraduationCap, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const demo = [
  ['Admin', 'admin@smartbuddy.test'],
  ['Teacher', 'teacher@smartbuddy.test'],
  ['Student', 'student@smartbuddy.test']
];

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: 'admin@smartbuddy.test', password: 'password123' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return <div className="grid min-h-screen bg-slate-50 lg:grid-cols-[1.1fr_0.9fr]">
    <section className="hidden bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center lg:block">
      <div className="flex h-full items-end bg-slate-950/35 p-10 text-white">
        <div><h1 className="text-5xl font-bold">SmartBuddy</h1><p className="mt-3 max-w-lg text-lg text-white/85">A production-style academic monitoring system for teachers, students, and school administrators.</p></div>
      </div>
    </section>
    <section className="flex items-center justify-center p-6">
      <form onSubmit={submit} className="w-full max-w-md rounded-lg bg-white p-8 shadow-soft">
        <div className="mb-7 flex items-center gap-3"><span className="rounded-lg bg-school p-3 text-white"><GraduationCap /></span><div><h2 className="text-2xl font-bold">Welcome back</h2><p className="text-sm text-slate-500">Sign in to your school workspace.</p></div></div>
        {error && <div className="mb-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error}</div>}
        <label className="mb-3 block text-sm font-semibold">Email<input className="input mt-1" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></label>
        <label className="mb-4 block text-sm font-semibold">Password<input className="input mt-1" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required /></label>
        <button className="btn-primary w-full" disabled={loading}><LogIn size={18} /> {loading ? 'Signing in...' : 'Login'}</button>
        <div className="mt-5 grid gap-2">
          {demo.map(([label, email]) => <button type="button" key={email} className="btn-muted justify-between" onClick={() => setForm({ email, password: 'password123' })}><span>{label}</span><span className="text-xs text-slate-500">{email}</span></button>)}
        </div>
      </form>
    </section>
  </div>;
}
