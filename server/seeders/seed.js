import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { pool, query } from '../config/db.js';

async function main() {
  const password = await bcrypt.hash('password123', 10);
  await query('DELETE FROM reports');
  await query('DELETE FROM comments');
  await query('DELETE FROM attendance');
  await query('DELETE FROM grades');
  await query('DELETE FROM teacher_assignments');
  await query('DELETE FROM class_students');
  await query('DELETE FROM students');
  await query('DELETE FROM teachers');
  await query('DELETE FROM classes');
  await query('DELETE FROM subjects');
  await query('DELETE FROM users');

  await query(`
    INSERT INTO users (id, name, email, password_hash, role) VALUES
    (1, 'Admin User', 'admin@smartbuddy.test', :password, 'admin'),
    (2, 'Maria Santos', 'teacher@smartbuddy.test', :password, 'teacher'),
    (3, 'Juan Dela Cruz', 'student@smartbuddy.test', :password, 'student'),
    (4, 'Liza Reyes', 'liza@student.test', :password, 'student'),
    (5, 'Carlo Mendoza', 'carlo@student.test', :password, 'student')
  `, { password });

  await query(`
    INSERT INTO teachers (id, user_id, employee_no, department, phone)
    VALUES (1, 2, 'T-2026-001', 'Mathematics', '09170000001')
  `);

  await query(`
    INSERT INTO classes (id, name, grade_level, section, adviser_teacher_id)
    VALUES (1, 'Grade 10 - Integrity', 'Grade 10', 'Integrity', 1),
           (2, 'Grade 9 - Courage', 'Grade 9', 'Courage', 1)
  `);

  await query(`
    INSERT INTO students (id, user_id, student_no, class_id, guardian_name, guardian_phone, address)
    VALUES
    (1, 3, 'S-2026-001', 1, 'Ana Dela Cruz', '09170000002', 'Cebu City'),
    (2, 4, 'S-2026-002', 1, 'Ramon Reyes', '09170000003', 'Mandaue City'),
    (3, 5, 'S-2026-003', 2, 'Grace Mendoza', '09170000004', 'Lapu-Lapu City')
  `);

  await query(`
    INSERT INTO subjects (id, code, name, description)
    VALUES
    (1, 'MATH10', 'Mathematics', 'Algebra, geometry, and problem solving'),
    (2, 'ENG10', 'English', 'Reading comprehension and writing'),
    (3, 'SCI10', 'Science', 'Earth science and laboratory concepts')
  `);

  await query(`
    INSERT INTO class_students (class_id, student_id) VALUES (1,1), (1,2), (2,3)
  `);

  await query(`
    INSERT INTO teacher_assignments (teacher_id, subject_id, class_id)
    VALUES (1,1,1), (1,2,1), (1,3,2)
  `);

  await query(`
    INSERT INTO grades (student_id, subject_id, class_id, term, quiz, activity, exam, final_grade, average, remarks)
    VALUES
    (1,1,1,'First Quarter', 88, 90, 86, 89, 88.25, 'Passed'),
    (1,2,1,'First Quarter', 83, 85, 80, 84, 83.00, 'Passed'),
    (2,1,1,'First Quarter', 74, 78, 72, 76, 75.00, 'Needs Improvement'),
    (2,2,1,'First Quarter', 68, 72, 70, 71, 70.25, 'Failed'),
    (3,3,2,'First Quarter', 91, 88, 90, 92, 90.25, 'Passed')
  `);

  await query(`
    INSERT INTO attendance (student_id, subject_id, class_id, date, status, remarks)
    VALUES
    (1,1,1,'2026-05-01','Present',''),
    (1,2,1,'2026-05-02','Late','Traffic delay'),
    (2,1,1,'2026-05-01','Absent','No notice'),
    (2,2,1,'2026-05-02','Present',''),
    (3,3,2,'2026-05-01','Present','')
  `);

  await query(`INSERT INTO comments (student_id, teacher_id, comment) VALUES
    (1,1,'Consistent performer and participates actively.'),
    (2,1,'Needs support in foundational skills and regular attendance.'),
    (3,1,'Excellent science performance this quarter.')
  `);

  console.log('SmartBuddy seed data inserted.');
  await pool.end();
}

main().catch(async (err) => {
  console.error(err);
  await pool.end();
  process.exit(1);
});
