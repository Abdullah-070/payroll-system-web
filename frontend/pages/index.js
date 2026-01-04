import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Cookies from 'js-cookie';
import { auth } from '../utils/api';

export default function Home() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      const userData = Cookies.get('user');
      const user = JSON.parse(userData);
      const redirectPath = user.role === 'admin' ? '/admin-dashboard' : '/employee-dashboard';
      router.push(redirectPath);
    }
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (isLogin) {
      setLoading(true);
      try {
        const response = await auth.login(formData.username, formData.password);
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
    } else {
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      setLoading(true);
      try {
        await auth.register(
          formData.username,
          formData.password,
          formData.email,
          selectedRole === 'admin' ? 'admin' : 'employee'
        );
        
        setSuccess('✓ Account created! Switching to login...');
        setTimeout(() => {
          setFormData({ username: '', email: '', password: '', confirmPassword: '' });
          setIsLogin(true);
          setSuccess('');
        }, 1500);
      } catch (err) {
        setError(err.response?.data?.error || 'Registration failed. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setSelectedRole(null);
    setIsLogin(true);
    setFormData({ username: '', email: '', password: '', confirmPassword: '' });
    setError('');
    setSuccess('');
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
          maxWidth: '1000px', 
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

          {!selectedRole ? (
            <>
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
                  onClick={() => setSelectedRole('admin')}
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
                  onClick={() => setSelectedRole('employee')}
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
            </>
          ) : (
            // Login/Register Form inside Card
            <div style={{
              backgroundColor: '#2a2a3e',
              padding: '40px',
              borderRadius: '12px',
              border: `2px solid ${selectedRole === 'admin' ? '#00d4ff' : '#00ff88'}`,
              maxWidth: '500px',
              margin: '0 auto',
              boxShadow: `0 4px 12px ${selectedRole === 'admin' ? 'rgba(0,212,255,0.2)' : 'rgba(0,255,136,0.2)'}`
            }}>
              <button
                onClick={resetForm}
                style={{
                  float: 'right',
                  backgroundColor: 'transparent',
                  border: '1px solid #666',
                  color: '#888',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  marginBottom: '20px'
                }}
              >
                ← Back
              </button>

              <h2 style={{
                fontSize: '28px',
                fontWeight: 'bold',
                color: selectedRole === 'admin' ? '#00d4ff' : '#00ff88',
                marginBottom: '10px',
                clear: 'both'
              }}>
                {isLogin ? '🔐 Login' : '📝 Register'}
              </h2>

              <p style={{
                fontSize: '14px',
                color: '#888',
                marginBottom: '30px'
              }}>
                {selectedRole === 'admin' 
                  ? isLogin ? 'Full system access for payroll management' : 'Create new admin account'
                  : 'Access your personal salary information'}
              </p>

              {error && (
                <div style={{
                  backgroundColor: '#ff4455',
                  color: '#fff',
                  padding: '12px',
                  borderRadius: '6px',
                  marginBottom: '20px',
                  fontSize: '14px'
                }}>
                  ✗ {error}
                </div>
              )}

              {success && (
                <div style={{
                  backgroundColor: '#00ff88',
                  color: '#000',
                  padding: '12px',
                  borderRadius: '6px',
                  marginBottom: '20px',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    color: selectedRole === 'admin' ? '#00d4ff' : '#00ff88',
                    fontWeight: '600'
                  }}>
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Enter username"
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: `2px solid #3a3a4e`,
                      borderRadius: '6px',
                      backgroundColor: '#1e1e2e',
                      color: '#fff',
                      fontSize: '16px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                {!isLogin && (
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '8px',
                      color: selectedRole === 'admin' ? '#00d4ff' : '#00ff88',
                      fontWeight: '600'
                    }}>
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter email"
                      required
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: `2px solid #3a3a4e`,
                        borderRadius: '6px',
                        backgroundColor: '#1e1e2e',
                        color: '#fff',
                        fontSize: '16px',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                )}

                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    color: selectedRole === 'admin' ? '#00d4ff' : '#00ff88',
                    fontWeight: '600'
                  }}>
                    Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter password"
                      required
                      style={{
                        width: '100%',
                        padding: '12px',
                        paddingRight: '45px',
                        border: `2px solid #3a3a4e`,
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

                {!isLogin && (
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '8px',
                      color: selectedRole === 'admin' ? '#00d4ff' : '#00ff88',
                      fontWeight: '600'
                    }}>
                      Confirm Password
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm password"
                        required
                        style={{
                          width: '100%',
                          padding: '12px',
                          paddingRight: '45px',
                          border: `2px solid #3a3a4e`,
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
                          color: selectedRole === 'admin' ? '#00d4ff' : '#00ff88',
                          cursor: 'pointer',
                          fontSize: '18px',
                          padding: '0'
                        }}
                      >
                        {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                      </button>
                    </div>
                  </div>
                )}

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
                    opacity: loading ? 0.6 : 1,
                    marginTop: '10px'
                  }}
                >
                  {loading ? 'Processing...' : isLogin ? '🔐 Login' : '📝 Register'}
                </button>
              </form>

              <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <p style={{ color: '#666', fontSize: '14px', marginBottom: '0' }}>
                  {isLogin ? "Don't have an account?" : "Already have an account?"}
                </p>
                {selectedRole === 'admin' && (
                  <button
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setError('');
                      setSuccess('');
                      setFormData({ username: '', email: '', password: '', confirmPassword: '' });
                    }}
                    style={{
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: selectedRole === 'admin' ? '#00d4ff' : '#00ff88',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600',
                      marginTop: '5px',
                      textDecoration: 'underline'
                    }}
                  >
                    {isLogin ? 'Create one here' : 'Login here'}
                  </button>
                )}
              </div>
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
            © 2025 Employee Payroll System | 🐙 Made by Abdullah
          </div>
        </div>
      </div>
    </>
  );
}
