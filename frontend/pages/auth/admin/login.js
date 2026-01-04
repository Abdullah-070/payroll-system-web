import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import Cookies from 'js-cookie';
import { auth } from '../../../utils/api';

export default function AdminLogin() {
  const router = useRouter();
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await auth.login(loginData.username, loginData.password);
      
      if (response.data.user.role !== 'admin') {
        setError('Admin access required. Please use the employee login.');
        setLoading(false);
        return;
      }

      Cookies.set('token', response.data.token);
      Cookies.set('user', JSON.stringify(response.data.user));
      setSuccess('✓ Login successful! Redirecting to dashboard...');
      
      setTimeout(() => {
        router.push('/admin-dashboard');
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Admin Login - Employee Payroll System</title>
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
          maxWidth: '500px', 
          width: '100%',
          backgroundColor: '#2a2a3e',
          padding: '50px 40px',
          borderRadius: '12px',
          border: '2px solid #3a3a4e',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)'
        }}>
          <Link href="/">
            <a style={{
              display: 'inline-block',
              marginBottom: '30px',
              backgroundColor: 'transparent',
              border: '1px solid #666',
              color: '#888',
              padding: '8px 15px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '13px',
              textDecoration: 'none'
            }}>
              ← Back to Home
            </a>
          </Link>

          <h1 style={{ 
            fontSize: '36px', 
            fontWeight: 'bold',
            color: '#00d4ff',
            marginBottom: '10px',
            textAlign: 'center'
          }}>
            👨‍💼 Admin Login
          </h1>

          <p style={{ 
            fontSize: '14px', 
            color: '#888',
            marginBottom: '40px',
            textAlign: 'center'
          }}>
            Full system access for payroll management
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

          <form onSubmit={handleLoginSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                color: '#00d4ff', 
                fontWeight: '600',
                fontSize: '14px'
              }}>
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
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '30px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                color: '#00d4ff', 
                fontWeight: '600',
                fontSize: '14px'
              }}>
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
                    fontSize: '14px',
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
                    color: '#00d4ff',
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
                backgroundColor: '#00d4ff',
                color: '#000',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 'bold',
                fontSize: '16px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1
              }}
            >
              {loading ? 'Logging in...' : '🔐 Login to Dashboard'}
            </button>
          </form>

          <p style={{ 
            marginTop: '20px', 
            textAlign: 'center', 
            color: '#888',
            fontSize: '14px'
          }}>
            Don't have an admin account?{' '}
            <Link href="/auth/admin/register">
              <a style={{
                color: '#00d4ff',
                textDecoration: 'none',
                fontWeight: '600',
                cursor: 'pointer'
              }}>
                Register here
              </a>
            </Link>
          </p>

          <div style={{ 
            marginTop: '40px', 
            paddingTop: '20px', 
            borderTop: '1px solid #3a3a4e',
            color: '#666',
            fontSize: '12px',
            textAlign: 'center'
          }}>
            © 2025 Employee Payroll System | Made by Abdullah
          </div>
        </div>
      </div>
    </>
  );
}
