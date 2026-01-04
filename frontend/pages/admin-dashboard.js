import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Cookies from 'js-cookie';
import Layout from '../components/Layout';
import { employees, payroll } from '../utils/api';

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalPayroll: 0,
    monthlyPayroll: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userData = Cookies.get('user');
    if (!userData) {
      router.push('/');
      return;
    }
    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'admin') {
      router.push('/employee-dashboard');
      return;
    }
    setUser(parsedUser);
    fetchStats();
  }, [router]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [empRes, payrollRes] = await Promise.all([
        employees.getAll(),
        payroll.getAll(),
      ]);

      const empCount = empRes.data ? empRes.data.length : 0;
      
      // Get current month payroll
      const now = new Date();
      const currentMonth = now.getMonth() + 1;
      const currentYear = now.getFullYear();
      const monthlyPayroll = payrollRes.data
        ?.filter(p => p.payroll_month === currentMonth && p.payroll_year === currentYear)
        .reduce((sum, p) => sum + (p.total_salary || 0), 0) || 0;

      setStats({
        totalEmployees: empCount,
        totalPayroll: payrollRes.data ? payrollRes.data.length : 0,
        monthlyPayroll: monthlyPayroll,
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div style={{ color: '#fff', textAlign: 'center', paddingTop: '50px' }}>Loading...</div>;
  }

  return (
    <Layout>
      <Head>
        <title>Admin Dashboard - Payroll System</title>
      </Head>
      <div style={{ minHeight: '100vh', backgroundColor: '#1e1e2e', color: '#fff', padding: '40px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#00d4ff' }}>
              Admin Dashboard
            </h1>
            <button
              onClick={() => {
                Cookies.remove('token');
                Cookies.remove('user');
                router.push('/');
              }}
              style={{
                padding: '10px 20px',
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
          <p style={{ fontSize: '16px', color: '#aaa', marginBottom: '30px' }}>
            Welcome back, {user.username}! Manage employees and payroll.
          </p>

          {/* Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
            <div style={{ backgroundColor: '#2a2a3e', padding: '20px', borderRadius: '8px', border: '1px solid #3a3a4e' }}>
              <div style={{ fontSize: '14px', color: '#00d4ff', fontWeight: '600', marginBottom: '10px' }}>Total Employees</div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#00ff88' }}>{stats.totalEmployees}</div>
              <div style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>Active employees in system</div>
            </div>
            <div style={{ backgroundColor: '#2a2a3e', padding: '20px', borderRadius: '8px', border: '1px solid #3a3a4e' }}>
              <div style={{ fontSize: '14px', color: '#00d4ff', fontWeight: '600', marginBottom: '10px' }}>Total Payroll Records</div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#ff6b6b' }}>{stats.totalPayroll}</div>
              <div style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>All time records</div>
            </div>
            <div style={{ backgroundColor: '#2a2a3e', padding: '20px', borderRadius: '8px', border: '1px solid #3a3a4e' }}>
              <div style={{ fontSize: '14px', color: '#00d4ff', fontWeight: '600', marginBottom: '10px' }}>This Month</div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#ffd700' }}>PKR {stats.monthlyPayroll.toFixed(0)}</div>
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
                onClick={() => router.push('/create-employee-user')}
                style={{
                  padding: '15px 20px',
                  backgroundColor: '#ff6b9d',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                ➕ Add Employee
              </button>
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
                👥 Manage Employees
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
                💰 Process Payroll
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
                📊 View Reports
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
