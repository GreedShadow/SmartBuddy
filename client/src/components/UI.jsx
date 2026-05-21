import { Loader2 } from 'lucide-react';

export function StatCard({ icon: Icon, label, value, tone = 'blue' }) {
  const tones = { blue: 'bg-blue-50 text-blue-700', green: 'bg-emerald-50 text-emerald-700', amber: 'bg-amber-50 text-amber-700', rose: 'bg-rose-50 text-rose-700' };
  return <div className="card p-4">
    <div className="flex items-center gap-3">
      <span className={`rounded-lg p-2 ${tones[tone]}`}><Icon size={20} /></span>
      <div><p className="text-xs font-semibold uppercase text-slate-500">{label}</p><p className="text-2xl font-bold">{value ?? 0}</p></div>
    </div>
  </div>;
}

export function PageHeader({ title, subtitle, action }) {
  return <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
    <div><h1 className="text-2xl font-bold tracking-tight">{title}</h1><p className="text-sm text-slate-500">{subtitle}</p></div>
    {action}
  </div>;
}

export function Loading() {
  return <div className="flex h-48 items-center justify-center text-slate-500"><Loader2 className="mr-2 animate-spin" /> Loading data...</div>;
}

export function EmptyState({ title = 'No records yet', text = 'Create a new record to get started.' }) {
  return <div className="card flex min-h-44 flex-col items-center justify-center p-8 text-center">
    <p className="font-semibold">{title}</p><p className="mt-1 max-w-md text-sm text-slate-500">{text}</p>
  </div>;
}

export function Modal({ title, children, onClose }) {
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
    <div className="w-full max-w-xl rounded-lg bg-white shadow-soft">
      <div className="flex items-center justify-between border-b p-4"><h2 className="font-bold">{title}</h2><button className="btn-muted" onClick={onClose}>Close</button></div>
      <div className="p-4">{children}</div>
    </div>
  </div>;
}

export function statusBadge(value) {
  const map = {
    Passed: 'bg-emerald-50 text-emerald-700',
    Failed: 'bg-rose-50 text-rose-700',
    'Needs Improvement': 'bg-amber-50 text-amber-700',
    Present: 'bg-emerald-50 text-emerald-700',
    Absent: 'bg-rose-50 text-rose-700',
    Late: 'bg-amber-50 text-amber-700',
    Excused: 'bg-blue-50 text-blue-700'
  };
  return <span className={`badge ${map[value] || 'bg-slate-100 text-slate-700'}`}>{value}</span>;
}
