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

function nextId(rows) {
  return rows.length ? Math.max(...rows.map((row) => Number(row.id) || 0)) + 1 : 1;
}

function remarksFor(average) {
  return average < 75 ? 'Failed' : average < 82 ? 'Needs Improvement' : 'Passed';
}

function classNameFor(classId) {
  return classes.find((item) => item.id === Number(classId))?.name || '';
}

function subjectNameFor(subjectId) {
  return subjects.find((item) => item.id === Number(subjectId))?.name || '';
}

function studentNameFor(studentId) {
  return students.find((item) => item.id === Number(studentId))?.name || '';
}

function groupedReportGrades(studentId) {
  const bySubject = new Map();
  for (const grade of grades.filter((item) => item.student_id === studentId)) {
    const key = `${grade.subject_id}-${grade.term || 'Term'}`;
    bySubject.set(key, grade);
  }
  return [...bySubject.values()].sort((a, b) => a.subject_name.localeCompare(b.subject_name));
}

function attendanceSummary(studentId) {
  return Object.entries(
    attendance
      .filter((row) => row.student_id === studentId)
      .reduce((summary, row) => ({ ...summary, [row.status]: (summary[row.status] || 0) + 1 }), {})
  ).map(([status, count]) => ({ status, count }));
}

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
  if (resource === 'auth' && parts[1] === 'register' && req.method === 'POST') {
    const body = await parseBody(req);
    if (users.some((user) => user.email === body.email)) return json(res, 409, { message: 'Email is already registered.' });
    const row = { id: nextId(users), name: body.name, email: body.email, password: body.password || 'password123', role: body.role || 'student' };
    users.push(row);
    return json(res, 201, { id: row.id, name: row.name, email: row.email, role: row.role });
  }

  if (resource === 'analytics') return json(res, 200, analytics());
  if (resource === 'users') return json(res, 200, users.map(({ password, ...user }) => user));
  if (resource === 'students' && id && req.method === 'GET') return json(res, 200, { student: students.find((student) => student.id === id), grades: grades.filter((grade) => grade.student_id === id), attendance: attendance.filter((row) => row.student_id === id), comments: comments.filter((comment) => comment.student_id === id) });
  if (resource === 'students' && req.method === 'POST') {
    const body = await parseBody(req);
    const userId = body.user_id || nextId(users);
    if (!body.user_id) users.push({ id: userId, name: body.name, email: body.email, password: body.password || 'password123', role: 'student' });
    const row = { id: nextId(students), user_id: userId, student_no: body.student_no, name: body.name || `Student ${userId}`, email: body.email || '', class_id: Number(body.class_id) || null, class_name: classNameFor(body.class_id), guardian_name: body.guardian_name || '', guardian_phone: body.guardian_phone || '', address: body.address || '' };
    students.push(row);
    const classRow = classes.find((item) => item.id === row.class_id);
    if (classRow) classRow.student_count = Number(classRow.student_count || 0) + 1;
    return json(res, 201, row);
  }
  if (resource === 'students' && req.method === 'PUT' && id) {
    const body = await parseBody(req);
    const index = students.findIndex((row) => row.id === id);
    if (index === -1) return json(res, 404, { message: 'Student not found.' });
    students[index] = { ...students[index], ...body, class_id: Number(body.class_id) || null, class_name: classNameFor(body.class_id) };
    return json(res, 200, students[index]);
  }
  if (resource === 'students' && req.method === 'DELETE' && id) {
    const index = students.findIndex((row) => row.id === id);
    if (index > -1) students.splice(index, 1);
    return json(res, 200, { message: 'Student deleted.' });
  }
  if (resource === 'students') return json(res, 200, students);
  if (resource === 'teachers' && req.method === 'POST') {
    const body = await parseBody(req);
    const userId = body.user_id || nextId(users);
    if (!body.user_id) users.push({ id: userId, name: body.name, email: body.email, password: body.password || 'password123', role: 'teacher' });
    const row = { id: nextId(teachers), user_id: userId, employee_no: body.employee_no, name: body.name || `Teacher ${userId}`, email: body.email || '', department: body.department || '', phone: body.phone || '' };
    teachers.push(row);
    return json(res, 201, row);
  }
  if (resource === 'teachers' && req.method === 'PUT' && id) {
    const body = await parseBody(req);
    const index = teachers.findIndex((row) => row.id === id);
    if (index === -1) return json(res, 404, { message: 'Teacher not found.' });
    teachers[index] = { ...teachers[index], ...body };
    return json(res, 200, teachers[index]);
  }
  if (resource === 'teachers' && req.method === 'DELETE' && id) {
    const index = teachers.findIndex((row) => row.id === id);
    if (index > -1) teachers.splice(index, 1);
    return json(res, 200, { message: 'Teacher deleted.' });
  }
  if (resource === 'teachers') return json(res, 200, teachers);
  if (resource === 'subjects' && req.method === 'POST') {
    const body = await parseBody(req);
    const row = { id: nextId(subjects), code: body.code, name: body.name, description: body.description || '' };
    subjects.push(row);
    return json(res, 201, row);
  }
  if (resource === 'subjects' && req.method === 'PUT' && id) {
    const body = await parseBody(req);
    const index = subjects.findIndex((row) => row.id === id);
    if (index === -1) return json(res, 404, { message: 'Subject not found.' });
    subjects[index] = { ...subjects[index], ...body };
    grades.filter((grade) => grade.subject_id === id).forEach((grade) => { grade.subject_name = subjects[index].name; });
    attendance.filter((row) => row.subject_id === id).forEach((row) => { row.subject_name = subjects[index].name; });
    return json(res, 200, subjects[index]);
  }
  if (resource === 'subjects' && req.method === 'DELETE' && id) {
    const index = subjects.findIndex((row) => row.id === id);
    if (index > -1) subjects.splice(index, 1);
    return json(res, 200, { message: 'Subject deleted.' });
  }
  if (resource === 'subjects') return json(res, 200, subjects);
  if (resource === 'classes' && req.method === 'POST') {
    const body = await parseBody(req);
    const row = { id: nextId(classes), name: body.name, grade_level: body.grade_level, section: body.section, adviser_teacher_id: Number(body.adviser_teacher_id) || null, student_count: 0 };
    classes.push(row);
    return json(res, 201, row);
  }
  if (resource === 'classes' && req.method === 'PUT' && id) {
    const body = await parseBody(req);
    const index = classes.findIndex((row) => row.id === id);
    if (index === -1) return json(res, 404, { message: 'Class not found.' });
    classes[index] = { ...classes[index], ...body, adviser_teacher_id: Number(body.adviser_teacher_id) || null };
    students.filter((student) => student.class_id === id).forEach((student) => { student.class_name = classes[index].name; });
    grades.filter((grade) => grade.class_id === id).forEach((grade) => { grade.class_name = classes[index].name; });
    attendance.filter((row) => row.class_id === id).forEach((row) => { row.class_name = classes[index].name; });
    return json(res, 200, classes[index]);
  }
  if (resource === 'classes' && req.method === 'DELETE' && id) {
    const index = classes.findIndex((row) => row.id === id);
    if (index > -1) classes.splice(index, 1);
    return json(res, 200, { message: 'Class deleted.' });
  }
  if (resource === 'classes') return json(res, 200, classes);
  if (resource === 'grades' && req.method === 'POST') {
    const body = await parseBody(req);
    const average = Number(((Number(body.quiz) + Number(body.activity) + Number(body.exam) + Number(body.final_grade)) / 4).toFixed(2));
    const row = { id: nextId(grades), ...body, student_id: Number(body.student_id), subject_id: Number(body.subject_id), class_id: Number(body.class_id) || null, student_name: studentNameFor(body.student_id), subject_name: subjectNameFor(body.subject_id), class_name: classNameFor(body.class_id), average, remarks: remarksFor(average) };
    grades.push(row);
    return json(res, 201, row);
  }
  if (resource === 'grades' && req.method === 'PUT' && id) {
    const body = await parseBody(req);
    const index = grades.findIndex((row) => row.id === id);
    if (index === -1) return json(res, 404, { message: 'Grade not found.' });
    const average = Number(((Number(body.quiz) + Number(body.activity) + Number(body.exam) + Number(body.final_grade)) / 4).toFixed(2));
    grades[index] = { ...grades[index], ...body, student_id: Number(body.student_id), subject_id: Number(body.subject_id), class_id: Number(body.class_id) || null, student_name: studentNameFor(body.student_id), subject_name: subjectNameFor(body.subject_id), class_name: classNameFor(body.class_id), average, remarks: remarksFor(average) };
    return json(res, 200, grades[index]);
  }
  if (resource === 'grades' && req.method === 'DELETE' && id) {
    const index = grades.findIndex((row) => row.id === id);
    if (index > -1) grades.splice(index, 1);
    return json(res, 200, { message: 'Grade deleted.' });
  }
  if (resource === 'grades') return json(res, 200, grades);
  if (resource === 'attendance' && req.method === 'POST') {
    const body = await parseBody(req);
    const row = { id: nextId(attendance), ...body, student_id: Number(body.student_id), subject_id: Number(body.subject_id), class_id: Number(body.class_id) || null, student_name: studentNameFor(body.student_id), subject_name: subjectNameFor(body.subject_id), class_name: classNameFor(body.class_id) };
    attendance.push(row);
    return json(res, 201, row);
  }
  if (resource === 'attendance' && req.method === 'DELETE' && id) {
    const index = attendance.findIndex((row) => row.id === id);
    if (index > -1) attendance.splice(index, 1);
    return json(res, 200, { message: 'Attendance deleted.' });
  }
  if (resource === 'attendance') return json(res, 200, attendance);
  if (resource === 'comments' && req.method === 'POST') {
    const body = await parseBody(req);
    const teacher = teachers.find((item) => item.id === Number(body.teacher_id));
    const row = { id: nextId(comments), student_id: Number(body.student_id), student_name: studentNameFor(body.student_id), teacher_id: Number(body.teacher_id), teacher_name: teacher?.name || 'Teacher', comment: body.comment, created_at: new Date().toISOString() };
    comments.unshift(row);
    return json(res, 201, row);
  }
  if (resource === 'comments') return json(res, 200, comments);
  if (resource === 'reports') {
    const student = students.find((item) => item.id === id) || students[0];
    const studentGrades = groupedReportGrades(student.id);
    const average = Number((studentGrades.reduce((sum, grade) => sum + grade.average, 0) / Math.max(studentGrades.length, 1)).toFixed(2));
    return json(res, 200, {
      id: Date.now(),
      student,
      grades: studentGrades,
      attendance: attendanceSummary(student.id),
      comments: comments.filter((comment) => comment.student_id === student.id),
      average,
      remarks: remarksFor(average)
    });
  }

  if (['POST', 'PUT', 'DELETE'].includes(req.method)) return json(res, 200, { message: 'Demo request accepted. Connect MySQL for persistence.' });
  return json(res, 404, { message: 'Not found.' });
}
