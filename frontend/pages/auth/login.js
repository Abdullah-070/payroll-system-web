import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Cookies from 'js-cookie';
import { auth } from '../../utils/api';

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Show success message if just registered
  useEffect(() => {
    if (router.query.registered === 'true') {
      setSuccess('✓ Registration successful! You can now log in.');
    }
  }, [router.query]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await auth.login(formData.username, formData.password);
      Cookies.set('token', response.data.token);
      Cookies.set('user', JSON.stringify(response.data.user));
      setSuccess('✓ Login successful! Redirecting...');
      
      // Redirect based on role
      const redirectPath = response.data.user.role === 'admin' ? '/admin-dashboard' : '/employee-dashboard';
      
      setTimeout(() => {
        router.push(redirectPath);
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Login - Payroll System</title>
      </Head>
      <div style={{ backgroundColor: '#1e1e2e', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ backgroundColor: '#2a2a3e', padding: '40px', borderRadius: '12px', maxWidth: '400px', width: '100%', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '30px', color: '#00d4ff', textAlign: 'center' }}>
            Login
          </h1>

          {error && (
            <div style={{ backgroundColor: '#ff4455', color: '#fff', padding: '12px', borderRadius: '6px', marginBottom: '20px', fontSize: '14px' }}>
              ✗ {error}
            </div>
          )}

          {success && (
            <div style={{ backgroundColor: '#00ff88', color: '#000', padding: '12px', borderRadius: '6px', marginBottom: '20px', fontSize: '14px', fontWeight: '600' }}>
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#00d4ff', fontWeight: '600' }}>
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
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
                }}
              />
            </div>

            <div style={{ marginBottom: '30px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#00d4ff', fontWeight: '600' }}>
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #3a3a4e',
                  borderRadius: '6px',
                  backgroundColor: '#1e1e2e',
                  color: '#fff',
                  fontSize: '16px',
                }}
              />
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
                opacity: loading ? 0.6 : 1,
              }}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p style={{ marginTop: '20px', textAlign: 'center', color: '#aaa' }}>
            Don't have an account?{' '}
            <a href="/auth/register" style={{ color: '#00d4ff', fontWeight: 'bold' }}>
              Register here
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
