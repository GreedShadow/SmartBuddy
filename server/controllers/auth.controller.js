import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { query } from '../config/db.js';

const loginSchema = z.object({ email: z.string().email(), password: z.string().min(1) });
const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['admin', 'teacher', 'student'])
});

function sign(user) {
  return jwt.sign({ id: user.id, name: user.name, email: user.email, role: user.role }, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '1d' });
}

export async function login(req, res) {
  const data = loginSchema.parse(req.body);
  const users = await query('SELECT * FROM users WHERE email = :email AND is_active = 1', { email: data.email });
  const user = users[0];
  if (!user || !(await bcrypt.compare(data.password, user.password_hash))) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }
  const safeUser = { id: user.id, name: user.name, email: user.email, role: user.role };
  res.json({ token: sign(safeUser), user: safeUser });
}

export async function register(req, res) {
  const data = registerSchema.parse(req.body);
  const passwordHash = await bcrypt.hash(data.password, 10);
  const result = await query(
    'INSERT INTO users (name, email, password_hash, role) VALUES (:name, :email, :passwordHash, :role)',
    { ...data, passwordHash }
  );
  res.status(201).json({ id: result.insertId, name: data.name, email: data.email, role: data.role });
}

export async function me(req, res) {
  res.json({ user: req.user });
}
