# 🌐 Web Application - Vercel & Supabase Deployment Guide

## Overview

This is the web application version of the Employee Payroll Management System, designed to be deployed on:
- **Frontend**: Vercel (Next.js or React)
- **Backend API**: Vercel (Node.js/Express)
- **Database**: Supabase (PostgreSQL)

---

## 📋 Prerequisites

Before deploying, ensure you have:
- [ ] GitHub account
- [ ] Vercel account (https://vercel.com)
- [ ] Supabase account (https://supabase.com)
- [ ] Node.js 18.x or higher
- [ ] Git installed on your machine

---

## 🚀 Step 1: Set Up Supabase Database

### 1.1 Create Supabase Project

1. Go to https://supabase.com and sign up/login
2. Click **"New Project"**
3. Fill in:
   - **Project Name**: `payroll-system`
   - **Database Password**: Create a strong password
   - **Region**: Choose nearest to you
4. Click **"Create new project"**
5. Wait for project initialization (5-10 minutes)

### 1.2 Create Database Tables

1. Go to **SQL Editor** in Supabase dashboard
2. Click **"New Query"**
3. Copy all SQL from `SUPABASE_SCHEMA.sql`
4. Paste into the SQL editor
5. Click **"Run"**
6. Verify all tables are created

### 1.3 Get Supabase Credentials

1. Go to **Project Settings** → **API**
2. Copy:
   - **Project URL** → `SUPABASE_URL`
   - **anon/public** key → `SUPABASE_KEY`
   - **service_role** key → Keep for admin tasks (don't share)
3. Save these - you'll need them for Vercel

---

## 🔧 Step 2: Deploy Backend API to Vercel

### 2.1 Upload to GitHub

1. Initialize git repository:
```bash
cd web-app-vercel
git init
git add .
git commit -m "Initial commit - payroll API"
```

2. Create repository on GitHub
3. Push code:
```bash
git remote add origin https://github.com/YOUR_USERNAME/payroll-api.git
git branch -M main
git push -u origin main
```

### 2.2 Connect Vercel

1. Go to https://vercel.com/dashboard
2. Click **"Add New"** → **"Project"**
3. Import GitHub repository
4. Configure project:
   - **Framework Preset**: Other
   - **Root Directory**: `.` (current)
   - **Build Command**: Leave empty
5. Add environment variables:

```
SUPABASE_URL = https://your-project.supabase.co
SUPABASE_KEY = your-public-anon-key
JWT_SECRET = your-super-secret-jwt-key-min-32-chars
```

6. Click **"Deploy"**
7. Wait for deployment (2-3 minutes)
8. You'll get a URL like: `https://payroll-api.vercel.app`

### 2.3 Test API

```bash
curl https://payroll-api.vercel.app/api/health
# Should return: {"status":"API is running"}
```

---

## 🎨 Step 3: Create & Deploy Frontend

### 3.1 Create Frontend Project

```bash
# Using Create React App
npx create-react-app payroll-frontend
cd payroll-frontend

# Install dependencies
npm install axios react-router-dom
```

### 3.2 Create API Service

Create `src/services/api.js`:

```javascript
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://payroll-api.vercel.app/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const authAPI = {
  login: (username, password) => api.post('/auth/login', { username, password }),
  register: (userData) => api.post('/auth/register', userData)
};

// Employee endpoints
export const employeeAPI = {
  getAll: () => api.get('/employees'),
  getOne: (id) => api.get(`/employees/${id}`),
  create: (data) => api.post('/employees', data),
  update: (id, data) => api.put(`/employees/${id}`, data),
  delete: (id) => api.delete(`/employees/${id}`)
};

// Payroll endpoints
export const payrollAPI = {
  getRecords: (params) => api.get('/payroll', { params }),
  create: (data) => api.post('/payroll', data),
  getSummary: () => api.get('/payroll/summary')
};

export default api;
```

### 3.3 Create Login Page

Create `src/pages/Login.js`:

```javascript
import { useState } from 'react';
import { authAPI } from '../services/api';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await authAPI.login(username, password);
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      onLogin(response.data.user);
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto' }}>
      <h1>Payroll System Login</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
        />
        <button type="submit" style={{ width: '100%', padding: '10px' }}>
          Login
        </button>
      </form>
    </div>
  );
}
```

### 3.4 Upload Frontend to GitHub

```bash
git init
git add .
git commit -m "Initial frontend commit"
git remote add origin https://github.com/YOUR_USERNAME/payroll-frontend.git
git push -u origin main
```

### 3.5 Deploy Frontend to Vercel

1. Go to Vercel dashboard
2. Click **"Add New"** → **"Project"**
3. Import React app repository
4. Add environment variable:
```
REACT_APP_API_URL=https://payroll-api.vercel.app/api
```
5. Click **"Deploy"**
6. Get frontend URL: `https://payroll-frontend.vercel.app`

---

## 🔑 Step 4: Login & Use System

### Default Admin Account
- **Username**: `admin`
- **Password**: `admin123`

### First Login Steps
1. Go to `https://payroll-frontend.vercel.app`
2. Login with admin credentials
3. Add employees
4. Calculate payroll
5. Generate reports

---

## 📊 Database Tables Overview

### Users Table
- Stores login credentials
- Role-based access (admin/employee)
- Password hashing with bcrypt

### Employees Table
- Employee personal information
- Contact details
- Current salary data

### Payroll Table
- Salary records by month
- Allowances breakdown
- Deductions breakdown
- Total salary calculations

### Additional Tables
- **Attendance**: Employee attendance records
- **Leaves**: Leave management
- **Departments**: Organization structure
- **Audit Logs**: System activity tracking

---

## 🔐 Security Checklist

- [ ] Change default admin password immediately
- [ ] Use strong JWT_SECRET (min 32 characters)
- [ ] Enable Supabase RLS (Row Level Security)
- [ ] Keep API keys in Vercel secrets (not in code)
- [ ] Use HTTPS for all connections
- [ ] Implement rate limiting (optional)
- [ ] Regular database backups

---

## 📈 API Endpoints

### Authentication
```
POST   /api/auth/login          - Login user
POST   /api/auth/register       - Create new user (admin only)
```

### Employees
```
GET    /api/employees           - Get all employees
GET    /api/employees/:id       - Get specific employee
POST   /api/employees           - Add new employee (admin)
PUT    /api/employees/:id       - Update employee (admin)
DELETE /api/employees/:id       - Delete employee (admin)
```

### Payroll
```
GET    /api/payroll             - Get payroll records
POST   /api/payroll             - Add payroll record (admin)
GET    /api/payroll/summary     - Get payroll summary
```

---

## 🐛 Troubleshooting

### Issue: "Cannot connect to Supabase"
**Solution**: Check SUPABASE_URL and SUPABASE_KEY in Vercel environment variables

### Issue: "JWT token invalid"
**Solution**: Ensure JWT_SECRET is same in all environments

### Issue: "CORS errors"
**Solution**: Check CORS configuration in Express (should be enabled for all origins)

### Issue: "Database table not found"
**Solution**: Re-run SUPABASE_SCHEMA.sql in Supabase SQL editor

---

## 📱 Frontend Components to Build

1. **Login Page** - User authentication
2. **Dashboard** - Home page with stats
3. **Employee List** - View all employees
4. **Add Employee** - Registration form
5. **Payroll Form** - Calculate salary
6. **Pay Slip** - Display salary details
7. **Reports** - Analytics & statistics
8. **Admin Panel** - Manage system

---

## 🚀 Scaling Considerations

- **Database**: Supabase auto-scales PostgreSQL
- **API**: Vercel scales automatically
- **Frontend**: CDN-based, global distribution
- **Caching**: Add Redis for frequently accessed data (optional)

---

## 📝 Environment Variables Reference

### Supabase
```
SUPABASE_URL          - Your Supabase project URL
SUPABASE_KEY          - Public anonymous key
SUPABASE_SERVICE_KEY  - Service role key (backend only)
```

### Vercel
```
JWT_SECRET            - Secret for JWT tokens
NODE_ENV              - Environment (production/development)
PORT                  - Server port
```

---

## 💾 Backup Strategy

1. **Database Backups**: Supabase provides automatic backups
2. **Manual Backup**: Export SQL regularly
3. **GitHub**: All code is version controlled

---

## 📞 Support URLs

- Supabase Docs: https://supabase.com/docs
- Vercel Docs: https://vercel.com/docs
- Express.js: https://expressjs.com
- PostgreSQL: https://www.postgresql.org/docs

---

## 🎯 Next Steps

1. ✅ Set up Supabase database
2. ✅ Deploy backend API to Vercel
3. ✅ Create and deploy frontend
4. ✅ Test all endpoints
5. ✅ Monitor Vercel logs
6. ✅ Scale as needed

---

**Status**: Ready for Deployment  
**Last Updated**: January 1, 2026  
**Support**: Production Ready ✓
