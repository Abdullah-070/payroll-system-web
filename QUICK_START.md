# 🚀 Quick Reference - Web App Deployment

## What You Have

```
web-app-vercel/
├── api/index.js                    ← Node.js/Express backend API
├── SUPABASE_SCHEMA.sql            ← PostgreSQL database schema
├── vercel.json                     ← Vercel configuration
├── package.json                    ← Dependencies
├── DEPLOYMENT_GUIDE.md            ← Complete step-by-step guide
└── README.md                       ← API documentation
```

## What You Need to Do

### 1. Set Up Supabase (5 minutes)
```
✓ Create Supabase account at https://supabase.com
✓ Create new project
✓ Run SUPABASE_SCHEMA.sql in SQL editor
✓ Get SUPABASE_URL and SUPABASE_KEY
```

### 2. Deploy Backend to Vercel (10 minutes)
```
✓ Push web-app-vercel/ to GitHub
✓ Connect GitHub repo to Vercel
✓ Add environment variables:
  - SUPABASE_URL
  - SUPABASE_KEY
  - JWT_SECRET (create a random 32+ char string)
✓ Deploy
✓ Get your API URL: https://payroll-api.vercel.app
```

### 3. Test API (2 minutes)
```bash
# Health check
curl https://payroll-api.vercel.app/api/health

# Login
curl -X POST https://payroll-api.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### 4. Create Frontend (Next)
```
✓ Use your favorite framework (React, Next.js, Vue, etc.)
✓ Connect to API_URL = https://payroll-api.vercel.app/api
✓ Build login & dashboard pages
✓ Deploy to Vercel
```

## Environment Variables

### Supabase
Find these in Supabase → Settings → API

```
SUPABASE_URL = https://your-project.supabase.co
SUPABASE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Vercel (Add in Project Settings)
```
SUPABASE_URL = <from above>
SUPABASE_KEY = <from above>
JWT_SECRET = <generate random 32+ chars>
```

## Default Admin Credentials

```
Username: admin
Password: admin123
```

⚠️ **CHANGE THIS IMMEDIATELY AFTER FIRST LOGIN**

## API Endpoints

### Authentication
```
POST /api/auth/login
POST /api/auth/register
```

### Employees
```
GET    /api/employees
GET    /api/employees/:id
POST   /api/employees
PUT    /api/employees/:id
DELETE /api/employees/:id
```

### Payroll
```
GET    /api/payroll
POST   /api/payroll
GET    /api/payroll/summary
```

## Database Tables

| Table | Columns |
|-------|---------|
| users | user_id, username, password_hash, email, role, created_at |
| employees | emp_id, name, age, organization, designation, email, contact, salary |
| payroll | payroll_id, emp_id, working_days, rate_per_day, total_salary, payroll_date |
| attendance | attendance_id, emp_id, attendance_date, status, hours_worked |
| leaves | leave_id, emp_id, leave_type, start_date, end_date, status |

## Deployment Workflow

```
┌─────────────┐
│  Local Dev  │
└──────┬──────┘
       ↓
┌─────────────┐
│  GitHub     │ (Push code)
└──────┬──────┘
       ↓
┌─────────────┐
│  Vercel     │ (Auto-deploys)
└──────┬──────┘
       ↓
┌─────────────┐
│  Supabase   │ (Database)
└─────────────┘
```

## File Structure

```
C Backend (Not needed for web)
├── Employee Payroll System.c
├── main_frontend.c
├── frontend.h
├── frontend.c

Web Application
└── web-app-vercel/
    ├── api/index.js               (Node.js Express API)
    ├── SUPABASE_SCHEMA.sql       (Database)
    ├── vercel.json               (Config)
    ├── package.json              (Dependencies)
    └── DEPLOYMENT_GUIDE.md       (Instructions)
```

## Quick Commands

### Install dependencies
```bash
cd web-app-vercel
npm install
```

### Run locally
```bash
npm run dev
# API runs on http://localhost:3000
```

### Deploy to Vercel
```bash
# Must have Vercel CLI
vercel
```

## Testing Endpoints

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Add Employee
```bash
curl -X POST http://localhost:3000/api/employees \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name":"John Doe",
    "age":28,
    "organization":"IT",
    "designation":"Engineer",
    "email":"john@example.com",
    "contact":"9876543210"
  }'
```

### Get All Employees
```bash
curl http://localhost:3000/api/employees \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Cannot connect to Supabase | Check SUPABASE_URL and SUPABASE_KEY |
| 401 Unauthorized | JWT token missing or invalid |
| 403 Forbidden | User doesn't have admin role |
| 500 Internal Error | Check Vercel logs and Supabase status |
| Database table not found | Re-run SUPABASE_SCHEMA.sql |

## Next Steps

1. ✅ Setup Supabase
2. ✅ Deploy API to Vercel
3. ✅ Create frontend (React/Next.js)
4. ✅ Connect frontend to API
5. ✅ Deploy frontend to Vercel
6. ✅ Test all features
7. ✅ Monitor Vercel logs

## Important URLs

- **Supabase**: https://supabase.com
- **Vercel**: https://vercel.com
- **Your API**: https://payroll-api.vercel.app/api
- **Your Frontend**: https://payroll-frontend.vercel.app

## Security Tips

- ✅ Change admin password immediately
- ✅ Use strong JWT_SECRET (32+ characters)
- ✅ Never commit .env file
- ✅ Keep API keys in Vercel secrets only
- ✅ Enable Supabase RLS for user data

---

**Status**: Ready for Deployment ✓  
**Last Updated**: January 1, 2026
