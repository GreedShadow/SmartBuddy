const users = [
  { id: 1, name: 'Admin User', email: 'admin@smartbuddy.test', password: 'password123', role: 'admin' },
  { id: 2, name: 'Maria Santos', email: 'teacher@smartbuddy.test', password: 'password123', role: 'teacher' },
  { id: 3, name: 'Juan Dela Cruz', email: 'student@smartbuddy.test', password: 'password123', role: 'student' }
];

const classes = [
  { id: 1, name: 'Grade 10 - Integrity', grade_level: 'Grade 10', section: 'Integrity', student_count: 2 },
  { id: 2, name: 'Grade 9 - Courage', grade_level: 'Grade 9', section: 'Courage', student_count: 1 }
];

const subjects = [
  { id: 1, code: 'MATH10', name: 'Mathematics', description: 'Algebra, geometry, and problem solving' },
  { id: 2, code: 'ENG10', name: 'English', description: 'Reading comprehension and writing' },
  { id: 3, code: 'SCI10', name: 'Science', description: 'Earth science and laboratory concepts' }
];

const teachers = [
  { id: 1, user_id: 2, employee_no: 'T-2026-001', name: 'Maria Santos', email: 'teacher@smartbuddy.test', department: 'Mathematics', phone: '09170000001' }
];

const students = [
  { id: 1, user_id: 3, student_no: 'S-2026-001', name: 'Juan Dela Cruz', email: 'student@smartbuddy.test', class_id: 1, class_name: 'Grade 10 - Integrity', guardian_name: 'Ana Dela Cruz', guardian_phone: '09170000002', address: 'Cebu City' },
  { id: 2, user_id: 4, student_no: 'S-2026-002', name: 'Liza Reyes', email: 'liza@student.test', class_id: 1, class_name: 'Grade 10 - Integrity', guardian_name: 'Ramon Reyes', guardian_phone: '09170000003', address: 'Mandaue City' },
  { id: 3, user_id: 5, student_no: 'S-2026-003', name: 'Carlo Mendoza', email: 'carlo@student.test', class_id: 2, class_name: 'Grade 9 - Courage', guardian_name: 'Grace Mendoza', guardian_phone: '09170000004', address: 'Lapu-Lapu City' }
];

const grades = [
  { id: 1, student_id: 1, student_name: 'Juan Dela Cruz', student_no: 'S-2026-001', subject_id: 1, subject_name: 'Mathematics', class_name: 'Grade 10 - Integrity', term: 'First Quarter', quiz: 88, activity: 90, exam: 86, final_grade: 89, average: 88.25, remarks: 'Passed' },
  { id: 2, student_id: 1, student_name: 'Juan Dela Cruz', student_no: 'S-2026-001', subject_id: 2, subject_name: 'English', class_name: 'Grade 10 - Integrity', term: 'First Quarter', quiz: 83, activity: 85, exam: 80, final_grade: 84, average: 83, remarks: 'Passed' },
  { id: 3, student_id: 2, student_name: 'Liza Reyes', student_no: 'S-2026-002', subject_id: 1, subject_name: 'Mathematics', class_name: 'Grade 10 - Integrity', term: 'First Quarter', quiz: 74, activity: 78, exam: 72, final_grade: 76, average: 75, remarks: 'Needs Improvement' },
  { id: 4, student_id: 2, student_name: 'Liza Reyes', student_no: 'S-2026-002', subject_id: 2, subject_name: 'English', class_name: 'Grade 10 - Integrity', term: 'First Quarter', quiz: 68, activity: 72, exam: 70, final_grade: 71, average: 70.25, remarks: 'Failed' },
  { id: 5, student_id: 3, student_name: 'Carlo Mendoza', student_no: 'S-2026-003', subject_id: 3, subject_name: 'Science', class_name: 'Grade 9 - Courage', term: 'First Quarter', quiz: 91, activity: 88, exam: 90, final_grade: 92, average: 90.25, remarks: 'Passed' }
];

const attendance = [
  { id: 1, student_id: 1, student_name: 'Juan Dela Cruz', subject_id: 1, subject_name: 'Mathematics', class_name: 'Grade 10 - Integrity', date: '2026-05-01', status: 'Present', remarks: '' },
  { id: 2, student_id: 1, student_name: 'Juan Dela Cruz', subject_id: 2, subject_name: 'English', class_name: 'Grade 10 - Integrity', date: '2026-05-02', status: 'Late', remarks: 'Traffic delay' },
  { id: 3, student_id: 2, student_name: 'Liza Reyes', subject_id: 1, subject_name: 'Mathematics', class_name: 'Grade 10 - Integrity', date: '2026-05-01', status: 'Absent', remarks: 'No notice' },
  { id: 4, student_id: 2, student_name: 'Liza Reyes', subject_id: 2, subject_name: 'English', class_name: 'Grade 10 - Integrity', date: '2026-05-02', status: 'Present', remarks: '' },
  { id: 5, student_id: 3, student_name: 'Carlo Mendoza', subject_id: 3, subject_name: 'Science', class_name: 'Grade 9 - Courage', date: '2026-05-01', status: 'Present', remarks: '' }
];

const comments = [
  { id: 1, student_id: 1, student_name: 'Juan Dela Cruz', teacher_id: 1, teacher_name: 'Maria Santos', comment: 'Consistent performer and participates actively.', created_at: '2026-05-01' },
  { id: 2, student_id: 2, student_name: 'Liza Reyes', teacher_id: 1, teacher_name: 'Maria Santos', comment: 'Needs support in foundational skills and regular attendance.', created_at: '2026-05-02' },
  { id: 3, student_id: 3, student_name: 'Carlo Mendoza', teacher_id: 1, teacher_name: 'Maria Santos', comment: 'Excellent science performance this quarter.', created_at: '2026-05-03' }
];

function json(res, status, data) {
  res.status(status).setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
}

function parseBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', () => {
      try { resolve(body ? JSON.parse(body) : {}); } catch { resolve({}); }
    });
  });
}

function analytics() {
  const average_grade = Number((grades.reduce((sum, grade) => sum + grade.average, 0) / grades.length).toFixed(2));
  const attendance_rate = Number((attendance.filter((row) => ['Present', 'Late'].includes(row.status)).length / attendance.length * 100).toFixed(2));
  return {
    totals: {
      students: students.length,
      teachers: teachers.length,
      subjects: subjects.length,
      classes: classes.length,
      average_grade,
      attendance_rate,
      at_risk: new Set(grades.filter((grade) => grade.remarks !== 'Passed').map((grade) => grade.student_id)).size
    },
    gradeTrend: [{ term: 'First Quarter', average: average_grade }],
    attendanceTrend: [{ date: '2026-05-01', rate: attendance_rate }],
    subjectPerformance: subjects.map((subject) => ({
      name: subject.name,
      average: Number((grades.filter((grade) => grade.subject_id === subject.id).reduce((sum, grade) => sum + grade.average, 0) / Math.max(grades.filter((grade) => grade.subject_id === subject.id).length, 1)).toFixed(2))
    })),
    needsAttention: students
      .map((student) => ({ ...student, average: Number((grades.filter((grade) => grade.student_id === student.id).reduce((sum, grade) => sum + grade.average, 0) / Math.max(grades.filter((grade) => grade.student_id === student.id).length, 1)).toFixed(2)) }))
      .filter((student) => student.average < 82)
  };
}

export default async function handler(req, res) {
  const parts = req.url.split('?')[0].replace(/^\/api\/?/, '').split('/').filter(Boolean);
  const resource = parts[0] || 'health';
  const id = Number(parts[1]);

  if (resource === 'health') return json(res, 200, { status: 'ok', app: 'SmartBuddy demo API' });

  if (resource === 'auth' && parts[1] === 'login' && req.method === 'POST') {
    const body = await parseBody(req);
    const user = users.find((item) => item.email === body.email && item.password === body.password);
    if (!user) return json(res, 401, { message: 'Invalid email or password.' });
    const safeUser = { id: user.id, name: user.name, email: user.email, role: user.role };
    return json(res, 200, { token: `demo-token-${user.id}`, user: safeUser });
  }

  if (resource === 'analytics') return json(res, 200, analytics());
  if (resource === 'students' && id) return json(res, 200, { student: students.find((student) => student.id === id), grades: grades.filter((grade) => grade.student_id === id), attendance: attendance.filter((row) => row.student_id === id), comments: comments.filter((comment) => comment.student_id === id) });
  if (resource === 'students') return json(res, 200, students);
  if (resource === 'teachers') return json(res, 200, teachers);
  if (resource === 'subjects') return json(res, 200, subjects);
  if (resource === 'classes') return json(res, 200, classes);
  if (resource === 'grades') return json(res, 200, grades);
  if (resource === 'attendance') return json(res, 200, attendance);
  if (resource === 'comments') return json(res, 200, comments);
  if (resource === 'reports') {
    const student = students.find((item) => item.id === id) || students[0];
    const studentGrades = grades.filter((grade) => grade.student_id === student.id);
    const average = Number((studentGrades.reduce((sum, grade) => sum + grade.average, 0) / Math.max(studentGrades.length, 1)).toFixed(2));
    return json(res, 200, {
      id: Date.now(),
      student,
      grades: studentGrades,
      attendance: attendance.filter((row) => row.student_id === student.id),
      comments: comments.filter((comment) => comment.student_id === student.id),
      average,
      remarks: average < 75 ? 'Failed' : average < 82 ? 'Needs Improvement' : 'Passed'
    });
  }

  if (['POST', 'PUT', 'DELETE'].includes(req.method)) return json(res, 200, { message: 'Demo request accepted. Connect MySQL for persistence.' });
  return json(res, 404, { message: 'Not found.' });
}
