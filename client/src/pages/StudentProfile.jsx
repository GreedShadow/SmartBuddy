import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PageHeader, statusBadge, Loading } from '../components/UI.jsx';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function StudentProfile() {
  const { id } = useParams();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [comment, setComment] = useState('');
  const load = () => api(`/students/${id}`).then(setData);
  useEffect(() => { load(); api('/teachers').then(setTeachers).catch(() => []); }, [id]);
  if (!data) return <Loading />;
  const { student, grades, attendance, comments } = data;
  return <div>
    <PageHeader title={student.name} subtitle={`${student.student_no} • ${student.class_name || 'No class'} • ${student.email}`} />
    <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
      <div className="card p-5">
        <h2 className="mb-3 font-bold">Student Details</h2>
        <Info label="Guardian" value={student.guardian_name} />
        <Info label="Guardian Phone" value={student.guardian_phone} />
        <Info label="Address" value={student.address} />
      </div>
      <div className="card overflow-hidden">
        <div className="border-b p-4 font-bold">Academic History</div>
        <table className="w-full text-left text-sm"><tbody>{grades.map((g) => <tr className="border-b last:border-0" key={g.id}><td className="p-3">{g.subject_name}</td><td className="p-3">{g.term}</td><td className="p-3 font-semibold">{g.average}</td><td className="p-3">{statusBadge(g.remarks)}</td></tr>)}</tbody></table>
      </div>
    </div>
    <div className="mt-5 grid gap-5 xl:grid-cols-2">
      <div className="card overflow-hidden"><div className="border-b p-4 font-bold">Attendance</div><table className="w-full text-left text-sm"><tbody>{attendance.map((a) => <tr className="border-b last:border-0" key={a.id}><td className="p-3">{a.date?.slice(0,10)}</td><td className="p-3">{a.subject_name}</td><td className="p-3">{statusBadge(a.status)}</td></tr>)}</tbody></table></div>
      <div className="card p-5"><h2 className="mb-3 font-bold">Teacher Comments</h2>
        {user.role !== 'student' && <form className="mb-4 flex gap-2" onSubmit={async (e) => {
          e.preventDefault();
          const teacher = teachers.find((t) => t.user_id === user.id) || teachers[0];
          if (!teacher || !comment.trim()) return;
          await api('/comments', { method: 'POST', body: JSON.stringify({ student_id: Number(id), teacher_id: teacher.id, comment }) });
          setComment(''); load();
        }}><input className="input" placeholder="Add teacher comment..." value={comment} onChange={(e) => setComment(e.target.value)} /><button className="btn-primary">Add</button></form>}
        {comments.map((c) => <div className="mb-3 rounded-lg bg-slate-50 p-3" key={c.id}><p className="text-sm">{c.comment}</p><p className="mt-1 text-xs text-slate-500">{c.teacher_name}</p></div>)}</div>
    </div>
  </div>;
}

function Info({ label, value }) {
  return <div className="border-b py-3 last:border-0"><p className="text-xs font-semibold uppercase text-slate-500">{label}</p><p>{value || '—'}</p></div>;
}
