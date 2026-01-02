import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>Payroll System</title>
        <meta name="description" content="Employee Payroll Management System" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div style={{ backgroundColor: '#1e1e2e', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <h1 style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '20px', color: '#00d4ff' }}>
            Employee Payroll System
          </h1>
          <p style={{ fontSize: '18px', marginBottom: '40px', color: '#aaa' }}>
            Complete payroll management solution
          </p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
            <a
              href="/auth/login"
              style={{
                padding: '12px 30px',
                backgroundColor: '#00d4ff',
                color: '#000',
                borderRadius: '6px',
                fontWeight: 'bold',
                fontSize: '16px',
              }}
            >
              Login
            </a>
            <a
              href="/auth/register"
              style={{
                padding: '12px 30px',
                backgroundColor: '#00ff88',
                color: '#000',
                borderRadius: '6px',
                fontWeight: 'bold',
                fontSize: '16px',
              }}
            >
              Register
            </a>
          </div>
          <p style={{ marginTop: '40px', fontSize: '14px', color: '#666' }}>
            © 2025 Employee Payroll System | Made by Abdullah
          </p>
        </div>
      </div>
    </>
  );
}
