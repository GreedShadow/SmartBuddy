import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { BarChart3, BookOpenCheck, CalendarCheck, GraduationCap, LogIn, ShieldCheck, Sparkles, TrendingUp, UsersRound } from 'lucide-react';
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
    <section className="login-visual relative hidden overflow-hidden bg-ink lg:block">
      <div className="login-grid absolute inset-0" />
      <div className="login-orb login-orb-one" />
      <div className="login-orb login-orb-two" />
      <div className="login-orb login-orb-three" />
      <div className="absolute inset-x-10 top-10 flex items-center justify-between text-white/80">
        <div className="flex items-center gap-3">
          <span className="rounded-lg bg-white/12 p-2 backdrop-blur"><GraduationCap size={24} /></span>
          <span className="text-sm font-semibold tracking-wide">SmartBuddy School Suite</span>
        </div>
        <span className="rounded-full border border-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">2026 Academic Monitor</span>
      </div>
      <div className="relative flex h-full flex-col justify-center px-12 text-white xl:px-16">
        <div className="max-w-xl">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur">
            <Sparkles size={16} /> Real-time student performance
          </span>
          <h1 className="max-w-lg text-6xl font-bold leading-[1.02]">SmartBuddy</h1>
          <p className="mt-5 max-w-lg text-lg leading-8 text-white/78">Monitor grades, attendance, reports, and at-risk learners from one polished academic workspace.</p>
        </div>

        <div className="relative mt-12 grid max-w-2xl grid-cols-2 gap-4">
          <FloatingCard className="login-float-one" icon={UsersRound} label="Active Students" value="128" tone="bg-blue-400/20 text-blue-100" />
          <FloatingCard className="login-float-two" icon={TrendingUp} label="Class Average" value="88.4%" tone="bg-emerald-400/20 text-emerald-100" />
          <FloatingCard className="login-float-three" icon={CalendarCheck} label="Attendance Rate" value="94%" tone="bg-amber-300/20 text-amber-100" />
          <FloatingCard className="login-float-four" icon={BookOpenCheck} label="Reports Ready" value="36" tone="bg-violet-300/20 text-violet-100" />
        </div>

        <div className="absolute bottom-10 left-12 right-12 grid grid-cols-3 gap-3 xl:left-16 xl:right-16">
          {[
            [BarChart3, 'Analytics'],
            [ShieldCheck, 'Role Security'],
            [CalendarCheck, 'Attendance']
          ].map(([Icon, label]) => <div className="rounded-lg border border-white/10 bg-white/8 p-3 text-sm font-semibold text-white/75 backdrop-blur" key={label}><Icon className="mb-2" size={18} />{label}</div>)}
        </div>
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

function FloatingCard({ icon: Icon, label, value, tone, className = '' }) {
  return <div className={`rounded-lg border border-white/12 bg-white/10 p-4 shadow-2xl backdrop-blur-md ${className}`}>
    <div className="flex items-center justify-between">
      <span className={`rounded-lg p-2 ${tone}`}><Icon size={18} /></span>
      <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_18px_rgba(110,231,183,0.9)]" />
    </div>
    <p className="mt-5 text-3xl font-bold">{value}</p>
    <p className="mt-1 text-sm text-white/65">{label}</p>
  </div>;
}
