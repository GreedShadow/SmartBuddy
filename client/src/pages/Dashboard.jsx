import { useEffect, useState } from 'react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { AlertTriangle, BookOpen, CalendarCheck, GraduationCap, Layers, UserRound, UsersRound } from 'lucide-react';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { EmptyState, Loading, PageHeader, StatCard } from '../components/UI.jsx';

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  useEffect(() => {
    if (user.role === 'student') {
      Promise.all([api('/grades'), api('/attendance'), api('/comments')]).then(([grades, attendance, comments]) => setData({ grades, attendance, comments }));
    } else {
      api('/analytics').then(setData);
    }
  }, [user.role]);
  if (!data) return <Loading />;
  if (user.role === 'student') return <StudentDashboard data={data} user={user} />;
  const t = data.totals || {};
  return <div>
    <PageHeader title={`${user.role[0].toUpperCase() + user.role.slice(1)} Dashboard`} subtitle="Live academic performance, attendance, and school monitoring overview." />
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard icon={GraduationCap} label="Students" value={t.students} />
      <StatCard icon={UserRound} label="Teachers" value={t.teachers} tone="green" />
      <StatCard icon={BookOpen} label="Subjects" value={t.subjects} tone="amber" />
      <StatCard icon={Layers} label="Classes" value={t.classes} tone="rose" />
      <StatCard icon={CalendarCheck} label="Attendance Rate" value={`${t.attendance_rate || 0}%`} tone="green" />
      <StatCard icon={BookOpen} label="Average Grade" value={t.average_grade || 0} />
      <StatCard icon={AlertTriangle} label="At-risk Students" value={t.at_risk || 0} tone="rose" />
    </div>
    <div className="mt-5 grid gap-5 xl:grid-cols-2">
      <ChartCard title="Grade Trend"><AreaChart data={data.gradeTrend}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="term" /><YAxis /><Tooltip /><Area type="monotone" dataKey="average" stroke="#2563eb" fill="#dbeafe" /></AreaChart></ChartCard>
      <ChartCard title="Subject Performance"><BarChart data={data.subjectPerformance}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="average" fill="#16a34a" radius={[6, 6, 0, 0]} /></BarChart></ChartCard>
    </div>
    <div className="mt-5 card overflow-hidden">
      <div className="border-b p-4"><h2 className="font-bold">Students Needing Attention</h2></div>
      {data.needsAttention.length ? <table className="w-full text-left text-sm"><tbody>{data.needsAttention.map((s) => <tr className="border-b last:border-0" key={s.id}><td className="p-3 font-semibold">{s.name}</td><td className="p-3 text-slate-500">{s.class_name}</td><td className="p-3 text-rose-600">{s.average}</td></tr>)}</tbody></table> : <EmptyState title="No at-risk students" text="Great job. No student currently falls below the monitoring threshold." />}
    </div>
  </div>;
}

function StudentDashboard({ data, user }) {
  const avg = data.grades.length ? (data.grades.reduce((sum, g) => sum + Number(g.average), 0) / data.grades.length).toFixed(2) : 0;
  const attendanceRate = data.attendance.length ? Math.round(data.attendance.filter((a) => ['Present', 'Late'].includes(a.status)).length / data.attendance.length * 100) : 0;
  return <div>
    <PageHeader title="Student Dashboard" subtitle={`Welcome, ${user.name}. Here is your personal academic summary.`} />
    <div className="grid gap-4 sm:grid-cols-3">
      <StatCard icon={BookOpen} label="Average Grade" value={avg} />
      <StatCard icon={CalendarCheck} label="Attendance Rate" value={`${attendanceRate}%`} tone="green" />
      <StatCard icon={AlertTriangle} label="Needs Improvement" value={data.grades.filter((g) => g.remarks !== 'Passed').length} tone="amber" />
    </div>
    <div className="mt-5 grid gap-5 xl:grid-cols-2">
      <div className="card overflow-hidden"><div className="border-b p-4 font-bold">My Grades</div><table className="w-full text-left text-sm"><tbody>{data.grades.map((g) => <tr className="border-b last:border-0" key={g.id}><td className="p-3">{g.subject_name}</td><td className="p-3">{g.term}</td><td className="p-3 font-bold">{g.average}</td></tr>)}</tbody></table></div>
      <div className="card overflow-hidden"><div className="border-b p-4 font-bold">My Attendance</div><table className="w-full text-left text-sm"><tbody>{data.attendance.map((a) => <tr className="border-b last:border-0" key={a.id}><td className="p-3">{a.date?.slice(0,10)}</td><td className="p-3">{a.subject_name}</td><td className="p-3">{a.status}</td></tr>)}</tbody></table></div>
    </div>
  </div>;
}

function ChartCard({ title, children }) {
  return <div className="card p-4"><h2 className="mb-3 font-bold">{title}</h2><div className="h-72"><ResponsiveContainer width="100%" height="100%">{children}</ResponsiveContainer></div></div>;
}
