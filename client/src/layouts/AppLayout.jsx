import { Outlet, NavLink } from 'react-router-dom';
import { BarChart3, BookOpen, CalendarCheck, GraduationCap, Home, Layers, LogOut, Settings, UserRound, UsersRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const links = [
  ['Dashboard', '/dashboard', Home, ['admin', 'teacher', 'student']],
  ['Students', '/students', GraduationCap, ['admin', 'teacher']],
  ['Teachers', '/teachers', UserRound, ['admin']],
  ['Subjects', '/subjects', BookOpen, ['admin', 'teacher']],
  ['Classes', '/classes', Layers, ['admin', 'teacher']],
  ['Attendance', '/attendance', CalendarCheck, ['admin', 'teacher', 'student']],
  ['Grades', '/grades', BookOpen, ['admin', 'teacher', 'student']],
  ['Analytics', '/analytics', BarChart3, ['admin', 'teacher']],
  ['Reports', '/reports', UsersRound, ['admin', 'teacher']],
  ['Settings', '/settings', Settings, ['admin', 'teacher', 'student']]
];

export default function AppLayout() {
  const { user, logout } = useAuth();
  return <div className="min-h-screen lg:flex">
    <aside className="no-print border-r border-slate-200 bg-white lg:fixed lg:inset-y-0 lg:w-64">
      <div className="flex h-16 items-center gap-3 border-b px-5">
        <div className="rounded-lg bg-school p-2 text-white"><GraduationCap size={22} /></div>
        <div><p className="font-bold">SmartBuddy</p><p className="text-xs text-slate-500">Academic Monitor</p></div>
      </div>
      <nav className="flex gap-1 overflow-x-auto p-3 lg:block">
        {links.filter(([, , , roles]) => roles.includes(user?.role)).map(([label, to, Icon]) => (
          <NavLink key={to} to={to} className={({ isActive }) => `mb-1 flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition ${isActive ? 'bg-blue-50 text-school' : 'text-slate-600 hover:bg-slate-50'}`}>
            <Icon size={18} /> {label}
          </NavLink>
        ))}
      </nav>
    </aside>
    <main className="flex-1 lg:pl-64">
      <header className="no-print sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-white/90 px-4 backdrop-blur">
        <div><p className="text-sm font-semibold">{user?.name}</p><p className="text-xs capitalize text-slate-500">{user?.role}</p></div>
        <button className="btn-muted" onClick={logout}><LogOut size={16} /> Logout</button>
      </header>
      <div className="p-4 sm:p-6"><Outlet /></div>
    </main>
  </div>;
}
