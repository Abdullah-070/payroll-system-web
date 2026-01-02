import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { auth } from '../../utils/api';

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

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
        'employee'
      );
      router.push('/auth/login?registered=true');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Register - Payroll System</title>
      </Head>
      <div style={{ backgroundColor: '#1e1e2e', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ backgroundColor: '#2a2a3e', padding: '40px', borderRadius: '12px', maxWidth: '400px', width: '100%', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '30px', color: '#00ff88', textAlign: 'center' }}>
            Register
          </h1>

          {error && (
            <div style={{ backgroundColor: '#ff4455', color: '#fff', padding: '12px', borderRadius: '6px', marginBottom: '20px', fontSize: '14px' }}>
              {error}
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
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#00d4ff', fontWeight: '600' }}>
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
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
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#00d4ff', fontWeight: '600' }}>
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
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
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
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
                backgroundColor: '#00ff88',
                color: '#000',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 'bold',
                fontSize: '16px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1,
              }}
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>

          <p style={{ marginTop: '20px', textAlign: 'center', color: '#aaa' }}>
            Already have an account?{' '}
            <a href="/auth/login" style={{ color: '#00d4ff', fontWeight: 'bold' }}>
              Login here
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
