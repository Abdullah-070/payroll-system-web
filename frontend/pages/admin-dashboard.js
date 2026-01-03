import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Cookies from 'js-cookie';
import Layout from '../components/Layout';

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalPayroll: 0,
    pendingApprovals: 0,
  });

  useEffect(() => {
    const userData = Cookies.get('user');
    if (!userData) {
      router.push('/auth/login');
      return;
    }
    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'admin') {
      router.push('/employee-dashboard');
      return;
    }
    setUser(parsedUser);
  }, [router]);

  if (!user) {
    return <div style={{ color: '#fff', textAlign: 'center', paddingTop: '50px' }}>Loading...</div>;
  }

  const handleGoBack = () => {
    Cookies.remove('token');
    Cookies.remove('user');
    router.push('/');
  };

  return (
    <Layout>
      <Head>
        <title>Admin Dashboard - Payroll System</title>
      </Head>
      <div style={{ minHeight: '100vh', backgroundColor: '#1e1e2e', color: '#fff', padding: '40px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <div>
              <h1 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '10px', color: '#00d4ff' }}>
                Admin Dashboard
              </h1>
              <p style={{ fontSize: '16px', color: '#aaa', marginBottom: '0' }}>
                Welcome back, {user.username}! Manage employees and payroll.
              </p>
            </div>
            <button
              onClick={handleGoBack}
              style={{
                padding: '10px 20px',
                backgroundColor: '#666',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              ← Back to Home
            </button>
          </div>

          {/* Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
            <div style={{ backgroundColor: '#2a2a3e', padding: '20px', borderRadius: '8px', border: '1px solid #3a3a4e' }}>
              <div style={{ fontSize: '14px', color: '#00d4ff', fontWeight: '600', marginBottom: '10px' }}>Total Employees</div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#00ff88' }}>--</div>
              <div style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>Active employees in system</div>
            </div>
            <div style={{ backgroundColor: '#2a2a3e', padding: '20px', borderRadius: '8px', border: '1px solid #3a3a4e' }}>
              <div style={{ fontSize: '14px', color: '#00d4ff', fontWeight: '600', marginBottom: '10px' }}>Pending Payroll</div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#ff6b6b' }}>--</div>
              <div style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>Awaiting processing</div>
            </div>
            <div style={{ backgroundColor: '#2a2a3e', padding: '20px', borderRadius: '8px', border: '1px solid #3a3a4e' }}>
              <div style={{ fontSize: '14px', color: '#00d4ff', fontWeight: '600', marginBottom: '10px' }}>This Month</div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#ffd700' }}>--</div>
              <div style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>Total payroll amount</div>
            </div>
          </div>

          {/* Admin Actions */}
          <div style={{ backgroundColor: '#2a2a3e', padding: '30px', borderRadius: '8px', border: '1px solid #3a3a4e' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', color: '#00d4ff' }}>
              Admin Controls
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
              <button
                onClick={() => router.push('/employees')}
                style={{
                  padding: '15px 20px',
                  backgroundColor: '#00d4ff',
                  color: '#000',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                Manage Employees
              </button>
              <button
                onClick={() => router.push('/payroll')}
                style={{
                  padding: '15px 20px',
                  backgroundColor: '#00ff88',
                  color: '#000',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                Process Payroll
              </button>
              <button
                onClick={() => router.push('/reports')}
                style={{
                  padding: '15px 20px',
                  backgroundColor: '#ffd700',
                  color: '#000',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                View Reports
              </button>
              <button
                onClick={() => {
                  Cookies.remove('token');
                  Cookies.remove('user');
                  router.push('/auth/login');
                }}
                style={{
                  padding: '15px 20px',
                  backgroundColor: '#ff4455',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
