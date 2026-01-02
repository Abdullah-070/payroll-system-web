# Web Application Structure

## Directory Layout

```
web-app-vercel/
├── api/
│   └── index.js                    # Express backend API
├── package.json                    # Dependencies
├── vercel.json                     # Vercel configuration
├── .env.example                    # Environment variables template
├── SUPABASE_SCHEMA.sql            # Database schema
├── DEPLOYMENT_GUIDE.md            # Complete deployment guide
└── README.md                       # This file
```

## What's Included

### Backend API (Node.js/Express)
- RESTful API endpoints
- Authentication & authorization
- Employee CRUD operations
- Payroll calculations
- Report generation
- Supabase database integration
- JWT token-based security

### Database (Supabase PostgreSQL)
- Users table with password hashing
- Employees table
- Payroll records
- Attendance tracking
- Leave management
- Department management
- Audit logs
- Pre-built views for reporting
- Stored procedures for calculations

### Vercel Deployment Configuration
- Optimized for serverless deployment
- Automatic scaling
- Environment variable management
- Zero-downtime deployments

## Key Features

✅ **Secure Authentication**
- SHA-256 password hashing with bcrypt
- JWT token-based authorization
- Role-based access control

✅ **Scalable Architecture**
- Serverless backend on Vercel
- Cloud database on Supabase
- Auto-scaling infrastructure

✅ **Production Ready**
- Error handling
- Input validation
- SQL injection prevention
- CORS enabled

✅ **Easy Monitoring**
- Vercel dashboard
- Supabase logs
- Audit trail

## Getting Started

See `DEPLOYMENT_GUIDE.md` for step-by-step instructions.

## API Documentation

### Authentication Endpoints

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "user_id": 1,
    "username": "admin",
    "role": "admin",
    "emp_id": null
  }
}
```

#### Register (Admin only)
```
POST /api/auth/register
Authorization: Bearer <token>
Content-Type: application/json

{
  "username": "john.doe",
  "password": "securepassword",
  "email": "john@company.com",
  "role": "employee"
}
```

### Employee Endpoints

#### Get All Employees
```
GET /api/employees
Authorization: Bearer <token>
```

#### Get Single Employee
```
GET /api/employees/101
Authorization: Bearer <token>
```

#### Add Employee
```
POST /api/employees
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Doe",
  "age": 28,
  "organization": "IT Department",
  "designation": "Software Engineer",
  "email": "john@company.com",
  "contact": "9876543210"
}
```

#### Update Employee
```
PUT /api/employees/101
Authorization: Bearer <token>
Content-Type: application/json

{
  "designation": "Senior Engineer",
  "contact": "9876543211"
}
```

#### Delete Employee
```
DELETE /api/employees/101
Authorization: Bearer <token>
```

### Payroll Endpoints

#### Get Payroll Records
```
GET /api/payroll?emp_id=101&year=2026&month=1
Authorization: Bearer <token>
```

#### Add Payroll Record
```
POST /api/payroll
Authorization: Bearer <token>
Content-Type: application/json

{
  "emp_id": 101,
  "working_days": 26,
  "rate_per_day": 500,
  "total_allowances": 5000,
  "overtime_bonus": 1000,
  "total_bonus": 2000,
  "total_deductions": 3000
}
```

#### Get Payroll Summary
```
GET /api/payroll/summary
Authorization: Bearer <token>
```

## Environment Setup

### Local Development

1. Create `.env` file:
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-public-anon-key
JWT_SECRET=your-32-character-secret-key
NODE_ENV=development
PORT=3000
```

2. Install dependencies:
```bash
npm install
```

3. Run locally:
```bash
npm run dev
```

### Vercel Deployment

1. Copy environment variables from `.env.example`
2. Add them in Vercel Project Settings → Environment Variables
3. Push to GitHub
4. Vercel auto-deploys on push

## Database Schema Summary

| Table | Purpose | Records |
|-------|---------|---------|
| users | Authentication & roles | Admin, Employees with accounts |
| employees | Employee info | All company employees |
| payroll | Salary records | Monthly payroll by employee |
| attendance | Attendance tracking | Daily records |
| leaves | Leave management | Leave applications |
| departments | Org structure | Company departments |
| audit_logs | Activity tracking | System events |

## Security Features

✅ Password Hashing (bcrypt)
✅ JWT Tokens
✅ SQL Parameterization
✅ Input Validation
✅ CORS Protection
✅ Rate Limiting Ready
✅ Audit Logging
✅ Role-Based Access Control

## Performance Optimizations

- Database indexes on frequently searched columns
- View-based reporting (pre-calculated)
- JWT tokens for stateless auth
- Serverless scaling on Vercel
- CDN for API distribution

## Maintenance

### Regular Tasks
- Monitor Vercel logs
- Check Supabase performance
- Backup database regularly
- Review audit logs
- Update dependencies

### Scaling
- Vercel auto-scales API
- Supabase auto-scales database
- No manual intervention needed

## Monitoring

### Vercel Dashboard
- View deployments
- Check logs
- Monitor performance
- Environment variables

### Supabase Dashboard
- Database status
- Query performance
- Storage usage
- API usage

## Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **Express.js Docs**: https://expressjs.com
- **PostgreSQL Docs**: https://www.postgresql.org/docs

---

**Ready to Deploy!** Follow the DEPLOYMENT_GUIDE.md step by step.
