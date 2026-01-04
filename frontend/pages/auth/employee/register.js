import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import Cookies from 'js-cookie';
import { auth } from '../../../utils/api';

export default function EmployeeRegister() {
  const router = useRouter();
  const [registerData, setRegisterData] = useState({
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

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({ ...prev, [name]: value }));
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
      const response = await auth.register(
        registerData.username,
        registerData.password,
        registerData.email,
        'employee'
      );
      
      setSuccess('✓ Account created successfully! Logging you in...');
      setRegisterData({ username: '', email: '', password: '', confirmPassword: '' });
      
      setTimeout(() => {
        // Auto login after registration
        Cookies.set('token', response.data.token);
        Cookies.set('user', JSON.stringify(response.data.user));
        router.push('/employee-dashboard');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Employee Register - Employee Payroll System</title>
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
            color: '#00ff88',
            marginBottom: '10px',
            textAlign: 'center'
          }}>
            👤 Employee Register
          </h1>

          <p style={{ 
            fontSize: '14px', 
            color: '#888',
            marginBottom: '40px',
            textAlign: 'center'
          }}>
            Create your employee account to access salary information
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

          <form onSubmit={handleRegisterSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                color: '#00ff88', 
                fontWeight: '600',
                fontSize: '14px'
              }}>
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
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                color: '#00ff88', 
                fontWeight: '600',
                fontSize: '14px'
              }}>
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
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                color: '#00ff88', 
                fontWeight: '600',
                fontSize: '14px'
              }}>
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
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                color: '#00ff88', 
                fontWeight: '600',
                fontSize: '14px'
              }}>
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
                    fontSize: '14px',
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
              {loading ? 'Creating account...' : '📝 Create Account'}
            </button>
          </form>

          <p style={{ 
            marginTop: '20px', 
            textAlign: 'center', 
            color: '#888',
            fontSize: '14px'
          }}>
            Already have an account?{' '}
            <Link href="/auth/employee/login">
              <a style={{
                color: '#00ff88',
                textDecoration: 'none',
                fontWeight: '600',
                cursor: 'pointer'
              }}>
                Login here
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
