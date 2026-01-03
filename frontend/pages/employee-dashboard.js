import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Cookies from 'js-cookie';
import Layout from '../components/Layout';

export default function EmployeeDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({
    name: 'Loading...',
    designation: '--',
    salary: '--',
    department: '--',
  });

  useEffect(() => {
    const userData = Cookies.get('user');
    if (!userData) {
      router.push('/auth/login');
      return;
    }
    const parsedUser = JSON.parse(userData);
    if (parsedUser.role === 'admin') {
      router.push('/admin-dashboard');
      return;
    }
    setUser(parsedUser);
  }, [router]);

  if (!user) {
    return <div style={{ color: '#fff', textAlign: 'center', paddingTop: '50px' }}>Loading...</div>;
  }

  return (
    <Layout>
      <Head>
        <title>Employee Dashboard - Payroll System</title>
      </Head>
      <div style={{ minHeight: '100vh', backgroundColor: '#1e1e2e', color: '#fff', padding: '40px 20px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '10px', color: '#00ff88' }}>
            Welcome, {user.username}!
          </h1>
          <p style={{ fontSize: '16px', color: '#aaa', marginBottom: '40px' }}>
            View your profile and salary information
          </p>

          {/* Profile Card */}
          <div style={{ backgroundColor: '#2a2a3e', padding: '30px', borderRadius: '8px', border: '1px solid #3a3a4e', marginBottom: '30px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', color: '#00ff88' }}>
              My Profile
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
              <div>
                <div style={{ fontSize: '12px', color: '#888', textTransform: 'uppercase', marginBottom: '5px' }}>Employee Name</div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#fff' }}>{profile.name}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#888', textTransform: 'uppercase', marginBottom: '5px' }}>Designation</div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#fff' }}>{profile.designation}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#888', textTransform: 'uppercase', marginBottom: '5px' }}>Department</div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#fff' }}>{profile.department}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#888', textTransform: 'uppercase', marginBottom: '5px' }}>Base Salary</div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#00ff88' }}>{profile.salary}</div>
              </div>
            </div>
          </div>

          {/* Employee Actions */}
          <div style={{ backgroundColor: '#2a2a3e', padding: '30px', borderRadius: '8px', border: '1px solid #3a3a4e', marginBottom: '30px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', color: '#00ff88' }}>
              My Information
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
              <button
                onClick={() => router.push('/payroll')}
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
                View My Payroll
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
                Download Salary Slip
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

          {/* Info Message */}
          <div style={{ backgroundColor: '#2a2a3e', padding: '20px', borderRadius: '8px', border: '1px solid #3a3a4e', color: '#aaa' }}>
            <p style={{ margin: '0', fontSize: '14px' }}>
              💡 As an employee, you can view your personal salary information and download payroll reports. 
              Contact HR for any changes or queries.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
