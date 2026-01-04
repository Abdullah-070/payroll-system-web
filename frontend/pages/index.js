import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Cookies from 'js-cookie';
import { auth } from '../utils/api';

export default function Home() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState(null);
  const [activeTab, setActiveTab] = useState('login');
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [registerData, setRegisterData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
          maxWidth: '600px', 
          width: '100%',
          textAlign: 'center'
        }}>
          {!selectedRole ? (
            // Role Selection Screen
            <div>
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
                marginBottom: '40px'
              }}>
                🔐 Select your role to continue:
              </p>

              <div style={{ 
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '20px',
                marginBottom: '40px'
              }}>
                {/* Admin Role Card */}
                <div
                  onClick={() => {
                    setSelectedRole('admin');
                    setError('');
                    setSuccess('');
                  }}
                  style={{
                    backgroundColor: '#2a2a3e',
                    padding: '40px 20px',
                    borderRadius: '12px',
                    border: '2px solid #3a3a4e',
                    cursor: 'pointer',
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
                  <div style={{ fontSize: '40px', marginBottom: '15px' }}>👨‍💼</div>
                  <h2 style={{ 
                    fontSize: '24px', 
                    fontWeight: 'bold',
                    color: '#00d4ff',
                    marginBottom: '10px'
                  }}>
                    Admin
                  </h2>
                  <p style={{ 
                    fontSize: '14px', 
                    color: '#888',
                    marginBottom: '10px'
                  }}>
                    Full system access
                  </p>
                  <ul style={{
                    fontSize: '12px',
                    color: '#666',
                    textAlign: 'left',
                    listStyle: 'none',
                    padding: '0',
                    margin: '0'
                  }}>
                    <li>✅ Manage employees</li>
                    <li>✅ Process payroll</li>
                    <li>✅ View reports</li>
                  </ul>
                </div>

                {/* Employee Role Card */}
                <div
                  onClick={() => {
                    setSelectedRole('employee');
                    setError('');
                    setSuccess('');
                  }}
                  style={{
                    backgroundColor: '#2a2a3e',
                    padding: '40px 20px',
                    borderRadius: '12px',
                    border: '2px solid #3a3a4e',
                    cursor: 'pointer',
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
                  <div style={{ fontSize: '40px', marginBottom: '15px' }}>👤</div>
                  <h2 style={{ 
                    fontSize: '24px', 
                    fontWeight: 'bold',
                    color: '#00ff88',
                    marginBottom: '10px'
                  }}>
                    Employee
                  </h2>
                  <p style={{ 
                    fontSize: '14px', 
                    color: '#888',
                    marginBottom: '10px'
                  }}>
                    Limited access
                  </p>
                  <ul style={{
                    fontSize: '12px',
                    color: '#666',
                    textAlign: 'left',
                    listStyle: 'none',
                    padding: '0',
                    margin: '0'
                  }}>
                    <li>✅ View profile</li>
                    <li>✅ Check salary</li>
                    <li>✅ Download reports</li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            // Login/Register Form
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => {
                  setSelectedRole(null);
                  setError('');
                  setSuccess('');
                  setActiveTab('login');
                }}
                style={{
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  backgroundColor: 'transparent',
                  border: '1px solid #666',
                  color: '#888',
                  padding: '10px 15px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                ← Back
              </button>

              <h1 style={{ 
                fontSize: '36px', 
                fontWeight: 'bold',
                color: selectedRole === 'admin' ? '#00d4ff' : '#00ff88',
                marginBottom: '30px',
                marginTop: '50px'
              }}>
                {selectedRole === 'admin' ? '👨‍💼 Admin Portal' : '👤 Employee Portal'}
              </h1>

              {/* Tabs for Employee */}
              {selectedRole === 'employee' && (
                <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', justifyContent: 'center' }}>
                  <button
                    onClick={() => setActiveTab('login')}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: activeTab === 'login' ? '#00ff88' : '#3a3a4e',
                      color: activeTab === 'login' ? '#000' : '#fff',
                      border: 'none',
                      borderRadius: '6px',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    🔑 Login
                  </button>
                  <button
                    onClick={() => setActiveTab('register')}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: activeTab === 'register' ? '#00ff88' : '#3a3a4e',
                      color: activeTab === 'register' ? '#000' : '#fff',
                      border: 'none',
                      borderRadius: '6px',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    📝 Register
                  </button>
                </div>
              )}

              {error && (
                <div style={{ backgroundColor: '#ff4455', color: '#fff', padding: '12px', borderRadius: '6px', marginBottom: '20px' }}>
                  ✗ {error}
                </div>
              )}

              {success && (
                <div style={{ backgroundColor: '#00ff88', color: '#000', padding: '12px', borderRadius: '6px', marginBottom: '20px', fontWeight: '600' }}>
                  {success}
                </div>
              )}

              {/* LOGIN FORM */}
              {(selectedRole === 'admin' || (selectedRole === 'employee' && activeTab === 'login')) && (
                <form onSubmit={handleLoginSubmit} style={{ maxWidth: '400px', margin: '0 auto' }}>
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', color: selectedRole === 'admin' ? '#00d4ff' : '#00ff88', fontWeight: '600' }}>
                      Username
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={loginData.username}
                      onChange={handleLoginChange}
                      placeholder="Enter your username"
                      required
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #3a3a4e',
                        borderRadius: '6px',
                        backgroundColor: '#1e1e2e',
                        color: '#fff',
                        fontSize: '16px',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '30px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', color: selectedRole === 'admin' ? '#00d4ff' : '#00ff88', fontWeight: '600' }}>
                      Password
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={loginData.password}
                        onChange={handleLoginChange}
                        placeholder="Enter your password"
                        required
                        style={{
                          width: '100%',
                          padding: '12px',
                          paddingRight: '45px',
                          border: '2px solid #3a3a4e',
                          borderRadius: '6px',
                          backgroundColor: '#1e1e2e',
                          color: '#fff',
                          fontSize: '16px',
                          boxSizing: 'border-box'
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          position: 'absolute',
                          right: '12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          backgroundColor: 'transparent',
                          border: 'none',
                          color: selectedRole === 'admin' ? '#00d4ff' : '#00ff88',
                          cursor: 'pointer',
                          fontSize: '18px',
                          padding: '0'
                        }}
                      >
                        {showPassword ? '👁️' : '👁️‍🗨️'}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: selectedRole === 'admin' ? '#00d4ff' : '#00ff88',
                      color: '#000',
                      border: 'none',
                      borderRadius: '6px',
                      fontWeight: 'bold',
                      fontSize: '16px',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      opacity: loading ? 0.6 : 1
                    }}
                  >
                    {loading ? 'Logging in...' : '🔑 Login'}
                  </button>

                  {selectedRole === 'employee' && (
                    <p style={{ marginTop: '20px', textAlign: 'center', color: '#aaa' }}>
                      Don't have an account?{' '}
                      <button
                        type="button"
                        onClick={() => setActiveTab('register')}
                        style={{
                          backgroundColor: 'transparent',
                          border: 'none',
                          color: '#00ff88',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          fontSize: '14px'
                        }}
                      >
                        Register here
                      </button>
                    </p>
                  )}
                </form>
              )}

              {/* REGISTER FORM */}
              {selectedRole === 'employee' && activeTab === 'register' && (
                <form onSubmit={handleRegisterSubmit} style={{ maxWidth: '400px', margin: '0 auto' }}>
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#00ff88', fontWeight: '600' }}>
                      Username
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={registerData.username}
                      onChange={handleRegisterChange}
                      placeholder="Choose a username"
                      required
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #3a3a4e',
                        borderRadius: '6px',
                        backgroundColor: '#1e1e2e',
                        color: '#fff',
                        fontSize: '16px',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#00ff88', fontWeight: '600' }}>
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={registerData.email}
                      onChange={handleRegisterChange}
                      placeholder="Enter your email"
                      required
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #3a3a4e',
                        borderRadius: '6px',
                        backgroundColor: '#1e1e2e',
                        color: '#fff',
                        fontSize: '16px',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#00ff88', fontWeight: '600' }}>
                      Password
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={registerData.password}
                        onChange={handleRegisterChange}
                        placeholder="Create a password"
                        required
                        style={{
                          width: '100%',
                          padding: '12px',
                          paddingRight: '45px',
                          border: '2px solid #3a3a4e',
                          borderRadius: '6px',
                          backgroundColor: '#1e1e2e',
                          color: '#fff',
                          fontSize: '16px',
                          boxSizing: 'border-box'
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          position: 'absolute',
                          right: '12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          backgroundColor: 'transparent',
                          border: 'none',
                          color: '#00ff88',
                          cursor: 'pointer',
                          fontSize: '18px',
                          padding: '0'
                        }}
                      >
                        {showPassword ? '👁️' : '👁️‍🗨️'}
                      </button>
                    </div>
                  </div>

                  <div style={{ marginBottom: '30px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#00ff88', fontWeight: '600' }}>
                      Confirm Password
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={registerData.confirmPassword}
                        onChange={handleRegisterChange}
                        placeholder="Confirm your password"
                        required
                        style={{
                          width: '100%',
                          padding: '12px',
                          paddingRight: '45px',
                          border: '2px solid #3a3a4e',
                          borderRadius: '6px',
                          backgroundColor: '#1e1e2e',
                          color: '#fff',
                          fontSize: '16px',
                          boxSizing: 'border-box'
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        style={{
                          position: 'absolute',
                          right: '12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          backgroundColor: 'transparent',
                          border: 'none',
                          color: '#00ff88',
                          cursor: 'pointer',
                          fontSize: '18px',
                          padding: '0'
                        }}
                      >
                        {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: '#00ff88',
                      color: '#000',
                      border: 'none',
                      borderRadius: '6px',
                      fontWeight: 'bold',
                      fontSize: '16px',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      opacity: loading ? 0.6 : 1
                    }}
                  >
                    {loading ? 'Creating account...' : '📝 Register'}
                  </button>

                  <p style={{ marginTop: '20px', textAlign: 'center', color: '#aaa' }}>
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setActiveTab('login')}
                      style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: '#00ff88',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      Login here
                    </button>
                  </p>
                </form>
              )}
            </div>
          )}

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
