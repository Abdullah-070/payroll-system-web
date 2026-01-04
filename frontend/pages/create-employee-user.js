import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { auth } from '../utils/api';

export default function CreateEmployeeUser() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    password: '',
    confirmPassword: '',
    email: '',
    phone: '',
    role: 'employee',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!formData.username || !formData.name || !formData.password || !formData.email || !formData.phone) {
      setError('All fields are required');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      const response = await auth.register(
        formData.username,
        formData.password,
        formData.email,
        formData.role
      );

      if (response.data.user) {
        setSuccess('✓ Employee user account created! Redirecting to employee details...');
        
        // Pass the data to add-employee page
        setTimeout(() => {
          router.push({
            pathname: '/add-employee',
            query: {
              name: formData.name,
              email: formData.email,
              contact: formData.phone,
            },
          });
        }, 1000);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create employee user account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Create Employee User - Employee Payroll System</title>
      </Head>
      <div style={{
        backgroundColor: '#1e1e2e',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}>
        <div style={{
          width: '100%',
          maxWidth: '500px',
          backgroundColor: '#2a2a3e',
          padding: '40px',
          borderRadius: '12px',
          border: '1px solid #3a3a4e',
        }}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#00d4ff',
            marginBottom: '10px',
            textAlign: 'center',
          }}>
            👤 Create Employee User
          </h1>
          <p style={{
            fontSize: '14px',
            color: '#888',
            marginBottom: '30px',
            textAlign: 'center',
          }}>
            Create login credentials for the employee
          </p>

          {error && (
            <div style={{
              backgroundColor: '#ff4455',
              color: '#fff',
              padding: '12px',
              borderRadius: '6px',
              marginBottom: '20px',
              fontSize: '14px',
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
              fontWeight: '600',
            }}>
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#00d4ff',
                fontWeight: '600',
              }}>
                Username *
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="e.g., emp001"
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #3a3a4e',
                  borderRadius: '6px',
                  backgroundColor: '#1e1e2e',
                  color: '#fff',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#00d4ff',
                fontWeight: '600',
              }}>
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Muhammad Abdullah"
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #3a3a4e',
                  borderRadius: '6px',
                  backgroundColor: '#1e1e2e',
                  color: '#fff',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#00d4ff',
                fontWeight: '600',
              }}>
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g., emp@example.com"
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #3a3a4e',
                  borderRadius: '6px',
                  backgroundColor: '#1e1e2e',
                  color: '#fff',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#00d4ff',
                fontWeight: '600',
              }}>
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g., 03111234567"
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #3a3a4e',
                  borderRadius: '6px',
                  backgroundColor: '#1e1e2e',
                  color: '#fff',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#00d4ff',
                fontWeight: '600',
              }}>
                Password *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password (min 6 characters)"
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    paddingRight: '40px',
                    border: '2px solid #3a3a4e',
                    borderRadius: '6px',
                    backgroundColor: '#1e1e2e',
                    color: '#fff',
                    fontSize: '14px',
                    boxSizing: 'border-box',
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
                    background: 'none',
                    border: 'none',
                    color: '#00d4ff',
                    cursor: 'pointer',
                    fontSize: '16px',
                  }}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#00d4ff',
                fontWeight: '600',
              }}>
                Confirm Password *
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter password"
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #3a3a4e',
                  borderRadius: '6px',
                  backgroundColor: '#1e1e2e',
                  color: '#fff',
                  fontSize: '14px',
                  boxSizing: 'border-box',
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
                marginBottom: '20px',
              }}
            >
              {loading ? 'Creating Account...' : '✓ Create User Account'}
            </button>
          </form>

          <div style={{
            paddingTop: '20px',
            borderTop: '1px solid #3a3a4e',
            textAlign: 'center',
            marginTop: '20px',
          }}>
            <Link href="/admin-dashboard">
              <a style={{
                color: '#00d4ff',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '14px',
              }}>
                ← Back to Dashboard
              </a>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
