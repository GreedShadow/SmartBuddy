import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from '../routes/auth.routes.js';
import userRoutes from '../routes/user.routes.js';
import studentRoutes from '../routes/student.routes.js';
import teacherRoutes from '../routes/teacher.routes.js';
import subjectRoutes from '../routes/subject.routes.js';
import classRoutes from '../routes/class.routes.js';
import attendanceRoutes from '../routes/attendance.routes.js';
import gradeRoutes from '../routes/grade.routes.js';
import analyticsRoutes from '../routes/analytics.routes.js';
import reportRoutes from '../routes/report.routes.js';
import commentRoutes from '../routes/comment.routes.js';
import { errorHandler } from '../middleware/errorHandler.js';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ status: 'ok', app: 'SmartBuddy API' }));
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/grades', gradeRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/comments', commentRoutes);
app.use(errorHandler);

app.listen(port, () => console.log(`SmartBuddy API running on http://localhost:${port}`));
