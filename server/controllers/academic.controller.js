import { z } from 'zod';
import { query } from '../config/db.js';

const remarksFor = (average) => average < 75 ? 'Failed' : average < 82 ? 'Needs Improvement' : 'Passed';

export async function listAttendance(req, res) {
  let studentFilter = req.query.student_id || null;
  if (req.user.role === 'student') {
    const mine = await query('SELECT id FROM students WHERE user_id=:userId', { userId: req.user.id });
    studentFilter = mine[0]?.id || -1;
  }
  res.json(await query(`
    SELECT a.*, u.name AS student_name, s.student_no, sub.name AS subject_name, c.name AS class_name
    FROM attendance a
    JOIN students s ON s.id=a.student_id JOIN users u ON u.id=s.user_id
    JOIN subjects sub ON sub.id=a.subject_id LEFT JOIN classes c ON c.id=s.class_id
    WHERE (:student IS NULL OR a.student_id=:student)
    AND (:subject IS NULL OR a.subject_id=:subject)
    AND (:classId IS NULL OR s.class_id=:classId)
    AND (:dateValue IS NULL OR a.date=:dateValue)
    ORDER BY a.date DESC, u.name
  `, {
    student: studentFilter,
    subject: req.query.subject_id || null,
    classId: req.query.class_id || null,
    dateValue: req.query.date || null
  }));
}

export async function saveAttendance(req, res) {
  const data = z.object({
    student_id: z.number(),
    subject_id: z.number(),
    class_id: z.number().optional().nullable(),
    date: z.string(),
    status: z.enum(['Present', 'Absent', 'Late', 'Excused']),
    remarks: z.string().optional().nullable()
  }).parse(req.body);
  await query(`
    INSERT INTO attendance (student_id, subject_id, class_id, date, status, remarks)
    VALUES (:student_id, :subject_id, :class_id, :date, :status, :remarks)
    ON DUPLICATE KEY UPDATE status=:status, remarks=:remarks
  `, data);
  res.status(201).json({ message: 'Attendance saved.' });
}

export async function deleteAttendance(req, res) {
  await query('DELETE FROM attendance WHERE id=:id', { id: Number(req.params.id) });
  res.json({ message: 'Attendance deleted.' });
}

export async function listGrades(req, res) {
  let studentFilter = req.query.student_id || null;
  if (req.user.role === 'student') {
    const mine = await query('SELECT id FROM students WHERE user_id=:userId', { userId: req.user.id });
    studentFilter = mine[0]?.id || -1;
  }
  res.json(await query(`
    SELECT g.*, u.name AS student_name, s.student_no, sub.name AS subject_name, c.name AS class_name
    FROM grades g
    JOIN students s ON s.id=g.student_id JOIN users u ON u.id=s.user_id
    JOIN subjects sub ON sub.id=g.subject_id LEFT JOIN classes c ON c.id=s.class_id
    WHERE (:student IS NULL OR g.student_id=:student)
    AND (:subject IS NULL OR g.subject_id=:subject)
    AND (:classId IS NULL OR s.class_id=:classId)
    AND (:term IS NULL OR g.term=:term)
    ORDER BY g.created_at DESC
  `, {
    student: studentFilter,
    subject: req.query.subject_id || null,
    classId: req.query.class_id || null,
    term: req.query.term || null
  }));
}

export async function saveGrade(req, res) {
  const data = z.object({
    student_id: z.number(),
    subject_id: z.number(),
    class_id: z.number().optional().nullable(),
    term: z.string(),
    quiz: z.number().min(0).max(100),
    activity: z.number().min(0).max(100),
    exam: z.number().min(0).max(100),
    final_grade: z.number().min(0).max(100)
  }).parse(req.body);
  const average = Number(((data.quiz + data.activity + data.exam + data.final_grade) / 4).toFixed(2));
  const remarks = remarksFor(average);
  if (req.params.id) {
    await query(`
      UPDATE grades SET student_id=:student_id, subject_id=:subject_id, class_id=:class_id, term=:term,
      quiz=:quiz, activity=:activity, exam=:exam, final_grade=:final_grade, average=:average, remarks=:remarks WHERE id=:id
    `, { ...data, average, remarks, id: Number(req.params.id) });
    return res.json({ message: 'Grade updated.', average, remarks });
  }
  const result = await query(`
    INSERT INTO grades (student_id, subject_id, class_id, term, quiz, activity, exam, final_grade, average, remarks)
    VALUES (:student_id, :subject_id, :class_id, :term, :quiz, :activity, :exam, :final_grade, :average, :remarks)
  `, { ...data, average, remarks });
  res.status(201).json({ id: result.insertId, average, remarks });
}

export async function deleteGrade(req, res) {
  await query('DELETE FROM grades WHERE id=:id', { id: Number(req.params.id) });
  res.json({ message: 'Grade deleted.' });
}

export async function dashboardAnalytics(req, res) {
  const [totals] = await query(`
    SELECT
      (SELECT COUNT(*) FROM students) AS students,
      (SELECT COUNT(*) FROM teachers) AS teachers,
      (SELECT COUNT(*) FROM subjects) AS subjects,
      (SELECT COUNT(*) FROM classes) AS classes,
      COALESCE((SELECT ROUND(AVG(average),2) FROM grades),0) AS average_grade,
      COALESCE((SELECT ROUND(100 * SUM(status IN ('Present','Late')) / NULLIF(COUNT(*),0),2) FROM attendance),0) AS attendance_rate,
      (SELECT COUNT(DISTINCT student_id) FROM grades WHERE remarks IN ('Failed','Needs Improvement')) AS at_risk
  `);
  const gradeTrend = await query('SELECT term, ROUND(AVG(average),2) AS average FROM grades GROUP BY term ORDER BY MIN(created_at)');
  const attendanceTrend = await query(`SELECT date, ROUND(100 * SUM(status IN ('Present','Late')) / COUNT(*),2) AS rate FROM attendance GROUP BY date ORDER BY date LIMIT 14`);
  const subjectPerformance = await query(`SELECT sub.name, ROUND(AVG(g.average),2) AS average FROM grades g JOIN subjects sub ON sub.id=g.subject_id GROUP BY sub.id ORDER BY average DESC`);
  const needsAttention = await query(`
    SELECT DISTINCT s.id, u.name, s.student_no, c.name AS class_name, ROUND(AVG(g.average),2) AS average
    FROM students s JOIN users u ON u.id=s.user_id LEFT JOIN classes c ON c.id=s.class_id JOIN grades g ON g.student_id=s.id
    GROUP BY s.id HAVING average < 82 ORDER BY average ASC LIMIT 10
  `);
  res.json({ totals, gradeTrend, attendanceTrend, subjectPerformance, needsAttention });
}

export async function createComment(req, res) {
  const data = z.object({ student_id: z.number(), teacher_id: z.number(), comment: z.string().min(2) }).parse(req.body);
  const result = await query('INSERT INTO comments (student_id, teacher_id, comment) VALUES (:student_id, :teacher_id, :comment)', data);
  res.status(201).json({ id: result.insertId, ...data });
}

export async function listComments(req, res) {
  let studentFilter = req.query.student_id || null;
  if (req.user.role === 'student') {
    const mine = await query('SELECT id FROM students WHERE user_id=:userId', { userId: req.user.id });
    studentFilter = mine[0]?.id || -1;
  }
  res.json(await query(`
    SELECT c.*, u.name AS teacher_name, su.name AS student_name
    FROM comments c JOIN teachers t ON t.id=c.teacher_id JOIN users u ON u.id=t.user_id
    JOIN students s ON s.id=c.student_id JOIN users su ON su.id=s.user_id
    WHERE (:student IS NULL OR c.student_id=:student)
    ORDER BY c.created_at DESC
  `, { student: studentFilter }));
}

export async function buildReport(req, res) {
  const studentId = Number(req.params.studentId || req.query.student_id);
  const students = await query(`
    SELECT s.*, u.name, u.email, c.name AS class_name, c.section
    FROM students s JOIN users u ON u.id=s.user_id LEFT JOIN classes c ON c.id=s.class_id WHERE s.id=:studentId
  `, { studentId });
  if (!students[0]) return res.status(404).json({ message: 'Student not found.' });
  const grades = await query('SELECT g.*, sub.name AS subject_name FROM grades g JOIN subjects sub ON sub.id=g.subject_id WHERE student_id=:studentId ORDER BY term', { studentId });
  const attendance = await query('SELECT status, COUNT(*) AS count FROM attendance WHERE student_id=:studentId GROUP BY status', { studentId });
  const comments = await query('SELECT c.comment, c.created_at, u.name AS teacher_name FROM comments c JOIN teachers t ON t.id=c.teacher_id JOIN users u ON u.id=t.user_id WHERE c.student_id=:studentId ORDER BY c.created_at DESC', { studentId });
  const average = grades.length ? Number((grades.reduce((sum, g) => sum + Number(g.average), 0) / grades.length).toFixed(2)) : 0;
  const result = await query('INSERT INTO reports (student_id, generated_by, summary) VALUES (:studentId, :userId, :summary)', {
    studentId,
    userId: req.user.id,
    summary: `Overall average: ${average}`
  });
  res.json({ id: result.insertId, student: students[0], grades, attendance, comments, average, remarks: remarksFor(average) });
}
