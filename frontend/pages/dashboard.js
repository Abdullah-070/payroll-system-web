import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Cookies from 'js-cookie';
import Link from 'next/link';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = Cookies.get('token');
    const userData = Cookies.get('user');

    if (!token) {
      router.push('/auth/login');
      return;
    }

    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      // Redirect employees to their own dashboard
      if (parsedUser.role === 'employee') {
        router.push('/employee-dashboard');
        return;
      }
    }
  }, [router]);

  const handleLogout = () => {
    Cookies.remove('token');
    Cookies.remove('user');
    router.push('/');
  };

  if (!user) {
    return <div style={{ color: '#fff', textAlign: 'center', paddingTop: '40px' }}>Loading...</div>;
  }

  return (
    <>
      <Head>
        <title>Dashboard - Payroll System</title>
      </Head>
      <div style={{ backgroundColor: '#1e1e2e', minHeight: '100vh' }}>
        {/* Header */}
        <header style={{ backgroundColor: '#2a2a3e', padding: '20px', borderBottom: '2px solid #00d4ff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#00d4ff' }}>
              Payroll System
            </h1>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <span style={{ color: '#aaa' }}>Welcome, {user.username}</span>
              <button
                onClick={handleLogout}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#ff4455',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '30px', color: '#00d4ff' }}>
            Dashboard
          </h2>

          {/* Navigation Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            <Link href="/employees">
              <div style={{
                backgroundColor: '#2a2a3e',
                padding: '30px',
                borderRadius: '12px',
                cursor: 'pointer',
                border: '2px solid #3a3a4e',
                transition: 'all 0.3s',
                textAlign: 'center',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#00d4ff';
                e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 212, 255, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#3a3a4e';
                e.currentTarget.style.boxShadow = 'none';
              }}
              >
                <div style={{ fontSize: '40px', marginBottom: '10px' }}>👥</div>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#00d4ff' }}>
                  Employees
                </h3>
                <p style={{ color: '#aaa', marginTop: '10px' }}>
                  Manage employee records
                </p>
              </div>
            </Link>

            <Link href="/payroll">
              <div style={{
                backgroundColor: '#2a2a3e',
                padding: '30px',
                borderRadius: '12px',
                cursor: 'pointer',
                border: '2px solid #3a3a4e',
                transition: 'all 0.3s',
                textAlign: 'center',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#00ff88';
                e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 255, 136, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#3a3a4e';
                e.currentTarget.style.boxShadow = 'none';
              }}
              >
                <div style={{ fontSize: '40px', marginBottom: '10px' }}>💰</div>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#00ff88' }}>
                  Payroll
                </h3>
                <p style={{ color: '#aaa', marginTop: '10px' }}>
                  Process salary payments
                </p>
              </div>
            </Link>

            <Link href="/reports">
              <div style={{
                backgroundColor: '#2a2a3e',
                padding: '30px',
                borderRadius: '12px',
                cursor: 'pointer',
                border: '2px solid #3a3a4e',
                transition: 'all 0.3s',
                textAlign: 'center',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#ffaa00';
                e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 170, 0, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#3a3a4e';
                e.currentTarget.style.boxShadow = 'none';
              }}
              >
                <div style={{ fontSize: '40px', marginBottom: '10px' }}>📊</div>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#ffaa00' }}>
                  Reports
                </h3>
                <p style={{ color: '#aaa', marginTop: '10px' }}>
                  View payroll reports
                </p>
              </div>
            </Link>
          </div>

          {/* Info Section */}
          <div style={{ marginTop: '40px', backgroundColor: '#2a2a3e', padding: '20px', borderRadius: '12px', borderLeft: '4px solid #00d4ff' }}>
            <h3 style={{ color: '#00d4ff', fontWeight: 'bold', marginBottom: '10px' }}>
              👤 User Information
            </h3>
            <p style={{ color: '#aaa' }}>
              Username: <span style={{ color: '#fff', fontWeight: 'bold' }}>{user.username}</span>
            </p>
            <p style={{ color: '#aaa' }}>
              Role: <span style={{ color: '#00ff88', fontWeight: 'bold' }}>{user.role}</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
