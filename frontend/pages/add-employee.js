import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { employees } from '../utils/api';

export default function AddEmployee() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    organization: '',
    designation: '',
    email: '',
    contact: '',
    department: '',
    salary: '',
    join_date: '',
    employment_type: '',
    qualification: '',
  });

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      router.push('/');
      return;
    }

    // Pre-fill data from router query params (from create-employee-user page)
    if (router.query.name || router.query.email || router.query.contact) {
      setFormData((prev) => ({
        ...prev,
        name: router.query.name || prev.name,
        email: router.query.email || prev.email,
        contact: router.query.contact || prev.contact,
      }));
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

    // Validate required fields
    if (!formData.name || !formData.age || !formData.email) {
      setError('Name, age, and email are required');
      return;
    }

    try {
      setLoading(true);
      await employees.create(formData);
      setSuccess('✓ Employee added successfully! Redirecting...');
      
      setTimeout(() => {
        router.push('/employees');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add employee');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Add Employee - Payroll System</title>
        <style>{`
          input[type="date"] {
            accent-color: #00d4ff;
            cursor: pointer;
          }
          
          input[type="date"]::-webkit-calendar-picker-indicator {
            cursor: pointer;
            filter: invert(0.8);
          }
        `}</style>
      </Head>
      <div style={{ backgroundColor: '#1e1e2e', minHeight: '100vh', padding: '40px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#00d4ff' }}>
              ➕ Add New Employee
            </h1>
            <Link href="/employees">
              <a style={{
                padding: '12px 24px',
                backgroundColor: '#3a3a4e',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 'bold',
                cursor: 'pointer',
                textDecoration: 'none',
                display: 'inline-block'
              }}>
                ← Back to Employees
              </a>
            </Link>
          </div>

          {error && (
            <div style={{ backgroundColor: '#ff4455', color: '#fff', padding: '15px', borderRadius: '6px', marginBottom: '20px' }}>
              ✗ {error}
            </div>
          )}

          {success && (
            <div style={{ backgroundColor: '#00ff88', color: '#000', padding: '15px', borderRadius: '6px', marginBottom: '20px', fontWeight: '600' }}>
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ backgroundColor: '#2a2a3e', padding: '30px', borderRadius: '12px', border: '1px solid #3a3a4e' }}>
            {/* Basic Information */}
            <h2 style={{ color: '#00d4ff', marginBottom: '25px', fontSize: '20px', fontWeight: '600' }}>
              👤 Basic Information
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#00d4ff', fontWeight: '600' }}>
                  Name *
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
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#00d4ff', fontWeight: '600' }}>
                  Age *
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="e.g., 25"
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

              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#00d4ff', fontWeight: '600' }}>
                  Organization
                </label>
                <input
                  type="text"
                  name="organization"
                  value={formData.organization}
                  onChange={handleChange}
                  placeholder="e.g., COMSATS"
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

              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#00d4ff', fontWeight: '600' }}>
                  Designation
                </label>
                <input
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  placeholder="e.g., TA, Manager"
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

              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#00d4ff', fontWeight: '600' }}>
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g., name@email.com"
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

              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#00d4ff', fontWeight: '600' }}>
                  Contact
                </label>
                <input
                  type="tel"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  placeholder="e.g., 03111234567"
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

              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#00d4ff', fontWeight: '600' }}>
                  Department
                </label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  placeholder="e.g., IT, HR, Sales"
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

              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#00d4ff', fontWeight: '600' }}>
                  Salary (PKR)
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  placeholder="e.g., 15000"
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
            </div>

            {/* Additional Information */}
            <h2 style={{ color: '#00d4ff', marginBottom: '25px', fontSize: '20px', fontWeight: '600' }}>
              📋 Additional Information
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#00d4ff', fontWeight: '600' }}>
                  Join Date
                </label>
                <input
                  type="date"
                  name="join_date"
                  value={formData.join_date}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #3a3a4e',
                    borderRadius: '6px',
                    backgroundColor: '#1e1e2e',
                    color: '#fff',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    cursor: 'pointer'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#00d4ff', fontWeight: '600' }}>
                  Employment Type
                </label>
                <select
                  name="employment_type"
                  value={formData.employment_type}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #3a3a4e',
                    borderRadius: '6px',
                    backgroundColor: '#1e1e2e',
                    color: '#fff',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    cursor: 'pointer'
                  }}
                >
                  <option value="">Select Type</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Temporary">Temporary</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#00d4ff', fontWeight: '600' }}>
                  Qualification
                </label>
                <input
                  type="text"
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleChange}
                  placeholder="e.g., Bachelor's Degree, BSSE"
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
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
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
              {loading ? 'Adding Employee...' : '➕ Add Employee'}
            </button>
          </form>

          <div style={{ marginTop: '30px' }}>
            <Link href="/admin-dashboard">
              <a style={{
                padding: '12px 24px',
                backgroundColor: '#3a3a4e',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 'bold',
                cursor: 'pointer',
                textDecoration: 'none',
                display: 'inline-block'
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
