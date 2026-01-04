import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import Cookies from 'js-cookie';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('token');
    const user = Cookies.get('user');
    if (token && user) {
      const userData = JSON.parse(user);
      router.push(userData.role === 'admin' ? '/admin-dashboard' : '/employee-dashboard');
    }
  }, [router]);


  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await auth.login(loginData.username, loginData.password);
      Cookies.set('token', response.data.token);
      Cookies.set('user', JSON.stringify(response.data.user));
      setSuccess('✓ Login successful! Redirecting...');
      
      const redirectPath = response.data.user.role === 'admin' ? '/admin-dashboard' : '/employee-dashboard';
      setTimeout(() => {
        router.push(redirectPath);
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (registerData.password !== registerData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await auth.register(
        registerData.username,
        registerData.password,
        registerData.email,
        'employee'
      );
      
      setSuccess('✓ Account created successfully! Logging you in...');
      setRegisterData({ username: '', email: '', password: '', confirmPassword: '' });
      
      setTimeout(() => {
        router.push('/employee-dashboard');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Employee Payroll System</title>
      </Head>
      <div style={{ 
        backgroundColor: '#1e1e2e', 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{ 
          maxWidth: '900px', 
          width: '100%',
          textAlign: 'center'
        }}>
          <h1 style={{ 
            fontSize: '48px', 
            fontWeight: 'bold', 
            color: '#00d4ff',
            marginBottom: '20px'
          }}>
            Employee Payroll System
          </h1>
          <p style={{ 
            fontSize: '18px', 
            color: '#aaa',
            marginBottom: '50px'
          }}>
            Complete payroll management solution
          </p>

          <p style={{ 
            fontSize: '16px', 
            color: '#888',
            marginBottom: '50px'
          }}>
            🔐 Select your role to continue:
          </p>

          <div style={{ 
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '30px',
            marginBottom: '40px'
          }}>
            {/* Admin Role Card */}
            <div
              style={{
                backgroundColor: '#2a2a3e',
                padding: '40px 30px',
                borderRadius: '12px',
                border: '2px solid #3a3a4e',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(0,212,255,0.1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#00d4ff';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,212,255,0.3)';
                e.currentTarget.style.backgroundColor = '#323250';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#3a3a4e';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,212,255,0.1)';
                e.currentTarget.style.backgroundColor = '#2a2a3e';
              }}
            >
              <div style={{ fontSize: '50px', marginBottom: '20px' }}>👨‍💼</div>
              <h2 style={{ 
                fontSize: '28px', 
                fontWeight: 'bold',
                color: '#00d4ff',
                marginBottom: '15px'
              }}>
                Admin
              </h2>
              <p style={{ 
                fontSize: '14px', 
                color: '#888',
                marginBottom: '20px'
              }}>
                Full system access for payroll management
              </p>
              <ul style={{
                fontSize: '13px',
                color: '#666',
                textAlign: 'left',
                listStyle: 'none',
                padding: '0',
                margin: '0 0 30px 0'
              }}>
                <li>✅ Manage employees</li>
                <li>✅ Process payroll</li>
                <li>✅ View reports & analytics</li>
              </ul>

              <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                <Link href="/auth/admin/login">
                  <a style={{
                    display: 'inline-block',
                    padding: '12px 24px',
                    backgroundColor: '#00d4ff',
                    color: '#000',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    textAlign: 'center',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#00a8cc';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#00d4ff';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}>
                    🔐 Login
                  </a>
                </Link>
                <Link href="/auth/admin/register">
                  <a style={{
                    display: 'inline-block',
                    padding: '12px 24px',
                    backgroundColor: 'transparent',
                    color: '#00d4ff',
                    border: '2px solid #00d4ff',
                    borderRadius: '6px',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    textAlign: 'center',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#00d4ff';
                    e.currentTarget.style.color = '#000';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#00d4ff';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}>
                    📝 Register
                  </a>
                </Link>
              </div>
            </div>

            {/* Employee Role Card */}
            <div
              style={{
                backgroundColor: '#2a2a3e',
                padding: '40px 30px',
                borderRadius: '12px',
                border: '2px solid #3a3a4e',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(0,255,136,0.1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#00ff88';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,255,136,0.3)';
                e.currentTarget.style.backgroundColor = '#323250';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#3a3a4e';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,255,136,0.1)';
                e.currentTarget.style.backgroundColor = '#2a2a3e';
              }}
            >
              <div style={{ fontSize: '50px', marginBottom: '20px' }}>👤</div>
              <h2 style={{ 
                fontSize: '28px', 
                fontWeight: 'bold',
                color: '#00ff88',
                marginBottom: '15px'
              }}>
                Employee
              </h2>
              <p style={{ 
                fontSize: '14px', 
                color: '#888',
                marginBottom: '20px'
              }}>
                Access your salary information
              </p>
              <ul style={{
                fontSize: '13px',
                color: '#666',
                textAlign: 'left',
                listStyle: 'none',
                padding: '0',
                margin: '0 0 30px 0'
              }}>
                <li>✅ View profile</li>
                <li>✅ Check salary & payslips</li>
                <li>✅ Download reports</li>
              </ul>

              <Link href="/auth/employee/login">
                <a style={{
                  display: 'inline-block',
                  padding: '12px 24px',
                  backgroundColor: '#00ff88',
                  color: '#000',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  cursor: 'pointer',
                  textDecoration: 'none',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  width: '100%',
                  boxSizing: 'border-box'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#00cc77';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#00ff88';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}>
                  🔐 Login
                </a>
              </Link>
            </div>
          </div>

          {/* Footer */}
          <div style={{ 
            marginTop: '60px', 
            paddingTop: '20px', 
            borderTop: '1px solid #3a3a4e',
            color: '#666',
            fontSize: '13px'
          }}>
            © 2025 Employee Payroll System | Made by Abdullah
          </div>
        </div>
      </div>
    </>
  );
}
