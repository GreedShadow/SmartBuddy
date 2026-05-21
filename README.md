# SmartBuddy

SmartBuddy is a full-stack academic monitoring system for a school capstone project. It includes JWT authentication, role-based dashboards, student/teacher/subject/class management, attendance, grade computation, analytics, comments, and printable/PDF student reports.

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, Recharts, lucide-react, react-to-print, jsPDF
- Backend: Node.js, Express.js, JWT, bcrypt
- Database: MySQL

## Folder Structure

```text
SmartBuddy/
  client/      React + Vite frontend
  server/      Express API, routes, controllers, middleware, schema, seeders
```

## Setup

1. Create a MySQL database and tables:

```powershell
mysql -u root -p < server/db/schema.sql
```

2. Create environment files:

```powershell
Copy-Item server/.env.example server/.env
Copy-Item client/.env.example client/.env
```

3. Edit `server/.env` if your MySQL username, password, host, or port differs.

4. Install dependencies:

```powershell
npm.cmd install
npm.cmd run install:all
```

5. Seed default data:

```powershell
npm.cmd --prefix server run seed
```

6. Run in VS Code:

```powershell
npm.cmd run dev
```

Open `http://localhost:5173`.

## Default Logins

- Admin: `admin@smartbuddy.test` / `password123`
- Teacher: `teacher@smartbuddy.test` / `password123`
- Student: `student@smartbuddy.test` / `password123`

## How It Works

The React app stores the JWT token in local storage after login and sends it with every API request. Express validates the token, applies role-based middleware, and reads/writes real records in MySQL. Dashboards and charts are computed from grades and attendance tables. Teachers/admins can create attendance, grades, and comments; students can view their own grade and attendance records. Reports are generated from live student data and can be printed or exported to PDF.
