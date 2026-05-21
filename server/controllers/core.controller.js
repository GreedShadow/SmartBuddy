import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { query } from '../config/db.js';

const id = (req) => Number(req.params.id);

export async function listUsers(_req, res) {
  res.json(await query('SELECT id, name, email, role, is_active, created_at FROM users ORDER BY created_at DESC'));
}

export async function listTeachers(_req, res) {
  res.json(await query(`SELECT t.*, u.name, u.email FROM teachers t JOIN users u ON u.id = t.user_id ORDER BY u.name`));
}

export async function upsertTeacher(req, res) {
  const s = z.object({ user_id: z.number().optional(), name: z.string().optional(), email: z.string().email().optional(), password: z.string().optional(), employee_no: z.string(), department: z.string(), phone: z.string().optional().nullable() });
  const data = s.parse(req.body);
  data.phone = data.phone || null;
  if (!data.user_id && data.name && data.email) {
    const passwordHash = await bcrypt.hash(data.password || 'password123', 10);
    const user = await query('INSERT INTO users (name, email, password_hash, role) VALUES (:name, :email, :passwordHash, "teacher")', { ...data, passwordHash });
    data.user_id = user.insertId;
  }
  if (req.params.id) {
    await query('UPDATE teachers SET employee_no=:employee_no, department=:department, phone=:phone WHERE id=:id', { ...data, id: id(req) });
    return res.json({ message: 'Teacher updated.' });
  }
  const result = await query('INSERT INTO teachers (user_id, employee_no, department, phone) VALUES (:user_id, :employee_no, :department, :phone)', data);
  res.status(201).json({ id: result.insertId, ...data });
}

export async function deleteTeacher(req, res) {
  await query('DELETE FROM teachers WHERE id=:id', { id: id(req) });
  res.json({ message: 'Teacher deleted.' });
}

export async function listStudents(req, res) {
  const search = `%${req.query.search || ''}%`;
  const classId = req.query.class_id || null;
  res.json(await query(`
    SELECT s.*, u.name, u.email, c.name AS class_name, c.section
    FROM students s JOIN users u ON u.id = s.user_id
    LEFT JOIN classes c ON c.id = s.class_id
    WHERE (u.name LIKE :search OR s.student_no LIKE :search OR u.email LIKE :search)
    AND (:classId IS NULL OR s.class_id = :classId)
    ORDER BY u.name
  `, { search, classId }));
}

export async function getStudent(req, res) {
  const students = await query(`
    SELECT s.*, u.name, u.email, c.name AS class_name, c.section
    FROM students s JOIN users u ON u.id=s.user_id LEFT JOIN classes c ON c.id=s.class_id WHERE s.id=:id
  `, { id: id(req) });
  if (!students[0]) return res.status(404).json({ message: 'Student not found.' });
  const grades = await query('SELECT g.*, sub.name AS subject_name FROM grades g JOIN subjects sub ON sub.id=g.subject_id WHERE student_id=:id ORDER BY term, created_at DESC', { id: id(req) });
  const attendance = await query('SELECT a.*, sub.name AS subject_name FROM attendance a JOIN subjects sub ON sub.id=a.subject_id WHERE student_id=:id ORDER BY date DESC', { id: id(req) });
  const comments = await query('SELECT c.*, u.name AS teacher_name FROM comments c JOIN teachers t ON t.id=c.teacher_id JOIN users u ON u.id=t.user_id WHERE student_id=:id ORDER BY c.created_at DESC', { id: id(req) });
  res.json({ student: students[0], grades, attendance, comments });
}

export async function upsertStudent(req, res) {
  const s = z.object({ user_id: z.number().optional(), name: z.string().optional(), email: z.string().email().optional(), password: z.string().optional(), student_no: z.string(), class_id: z.number().nullable().optional(), guardian_name: z.string().optional().nullable(), guardian_phone: z.string().optional().nullable(), address: z.string().optional().nullable() });
  const data = s.parse(req.body);
  data.class_id = data.class_id || null;
  data.guardian_name = data.guardian_name || null;
  data.guardian_phone = data.guardian_phone || null;
  data.address = data.address || null;
  if (!data.user_id && data.name && data.email) {
    const passwordHash = await bcrypt.hash(data.password || 'password123', 10);
    const user = await query('INSERT INTO users (name, email, password_hash, role) VALUES (:name, :email, :passwordHash, "student")', { ...data, passwordHash });
    data.user_id = user.insertId;
  }
  if (req.params.id) {
    await query('UPDATE students SET student_no=:student_no, class_id=:class_id, guardian_name=:guardian_name, guardian_phone=:guardian_phone, address=:address WHERE id=:id', { ...data, id: id(req) });
    return res.json({ message: 'Student updated.' });
  }
  const result = await query('INSERT INTO students (user_id, student_no, class_id, guardian_name, guardian_phone, address) VALUES (:user_id, :student_no, :class_id, :guardian_name, :guardian_phone, :address)', data);
  res.status(201).json({ id: result.insertId, ...data });
}

export async function deleteStudent(req, res) {
  await query('DELETE FROM students WHERE id=:id', { id: id(req) });
  res.json({ message: 'Student deleted.' });
}

export async function listSubjects(_req, res) {
  res.json(await query('SELECT * FROM subjects ORDER BY name'));
}

export async function upsertSubject(req, res) {
  const data = z.object({ code: z.string(), name: z.string(), description: z.string().optional().nullable() }).parse(req.body);
  if (req.params.id) {
    await query('UPDATE subjects SET code=:code, name=:name, description=:description WHERE id=:id', { ...data, id: id(req) });
    return res.json({ message: 'Subject updated.' });
  }
  const result = await query('INSERT INTO subjects (code, name, description) VALUES (:code, :name, :description)', data);
  res.status(201).json({ id: result.insertId, ...data });
}

export async function deleteSubject(req, res) {
  await query('DELETE FROM subjects WHERE id=:id', { id: id(req) });
  res.json({ message: 'Subject deleted.' });
}

export async function listClasses(_req, res) {
  res.json(await query(`SELECT c.*, COUNT(s.id) AS student_count FROM classes c LEFT JOIN students s ON s.class_id=c.id GROUP BY c.id ORDER BY c.grade_level, c.section`));
}

export async function upsertClass(req, res) {
  const data = z.object({ name: z.string(), grade_level: z.string(), section: z.string(), adviser_teacher_id: z.number().nullable().optional() }).parse(req.body);
  data.adviser_teacher_id = data.adviser_teacher_id || null;
  if (req.params.id) {
    await query('UPDATE classes SET name=:name, grade_level=:grade_level, section=:section, adviser_teacher_id=:adviser_teacher_id WHERE id=:id', { ...data, id: id(req) });
    return res.json({ message: 'Class updated.' });
  }
  const result = await query('INSERT INTO classes (name, grade_level, section, adviser_teacher_id) VALUES (:name, :grade_level, :section, :adviser_teacher_id)', data);
  res.status(201).json({ id: result.insertId, ...data });
}

export async function deleteClass(req, res) {
  await query('DELETE FROM classes WHERE id=:id', { id: id(req) });
  res.json({ message: 'Class deleted.' });
}

export async function assignTeacher(req, res) {
  const data = z.object({ teacher_id: z.number(), subject_id: z.number(), class_id: z.number() }).parse(req.body);
  await query('INSERT IGNORE INTO teacher_assignments (teacher_id, subject_id, class_id) VALUES (:teacher_id, :subject_id, :class_id)', data);
  res.status(201).json({ message: 'Teacher assigned.' });
}
