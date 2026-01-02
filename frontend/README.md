# Payroll System - Web Frontend

Complete React/Next.js frontend for the Employee Payroll Management System.

## Features

- ✅ User authentication (login/register)
- ✅ Dashboard with navigation
- ✅ Employee management (CRUD)
- ✅ Payroll processing
- ✅ Report generation
- ✅ Dark theme UI
- ✅ Responsive design

## Tech Stack

- **Framework**: Next.js 14
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **State Management**: React Hooks
- **Deployment**: Vercel

## Installation

```bash
cd frontend
npm install
```

## Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

Create `.env.local`:

```
NEXT_PUBLIC_API_URL=https://payroll-system-web.vercel.app
```

## Build

```bash
npm run build
npm start
```

## Deployment

1. Push to GitHub
2. Connect to Vercel
3. Deploy automatically

## Pages

- `/` - Home page
- `/auth/login` - Login
- `/auth/register` - Register
- `/dashboard` - Main dashboard
- `/employees` - Employee management
- `/payroll` - Payroll management
- `/reports` - Reports

## API Integration

Frontend connects to backend API at:
```
https://payroll-system-web.vercel.app/api
```

## License

© 2025 Employee Payroll System
