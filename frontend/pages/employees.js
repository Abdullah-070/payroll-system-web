import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Cookies from 'js-cookie';
import { employees } from '../utils/api';

export default function Employees() {
  const router = useRouter();
  const [employeeList, setEmployeeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    organization: '',
    designation: '',
    email: '',
    contact: '',
    department: '',
    base_salary: '',
  });

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }
    loadEmployees();
  }, [router]);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const response = await employees.getAll();
      setEmployeeList(response.data);
    } catch (err) {
      setError('Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Update existing employee
        await employees.update(editingId, formData);
        setEditingId(null);
      } else {
        // Create new employee
        await employees.create(formData);
      }
      setFormData({
        name: '',
        age: '',
        organization: '',
        designation: '',
        email: '',
        contact: '',
        department: '',
        base_salary: '',
      });
      setShowForm(false);
      loadEmployees();
    } catch (err) {
      setError(editingId ? 'Failed to update employee' : 'Failed to add employee');
    }
  };

  const handleEdit = (employee) => {
    setEditingId(employee.emp_id);
    setFormData({
      name: employee.name || '',
      age: employee.age || '',
      organization: employee.organization || '',
      designation: employee.designation || '',
      email: employee.email || '',
      contact: employee.contact || '',
      department: employee.department || '',
      base_salary: employee.base_salary || '',
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({
      name: '',
      age: '',
      organization: '',
      designation: '',
      email: '',
      contact: '',
      department: '',
      base_salary: '',
    });
    setShowForm(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await employees.delete(id);
      loadEmployees();
    } catch (err) {
      setError('Failed to delete employee');
    }
  };

  if (loading) {
    return <div style={{ color: '#fff', textAlign: 'center', paddingTop: '40px' }}>Loading...</div>;
  }

  return (
    <>
      <Head>
        <title>Employees - Payroll System</title>
      </Head>
      <div style={{ backgroundColor: '#1e1e2e', minHeight: '100vh', padding: '40px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#00d4ff' }}>
              Employees
            </h1>
            <button
              onClick={() => {
                if (showForm) {
                  handleCancel();
                } else {
                  setShowForm(true);
                }
              }}
              style={{
                padding: '12px 24px',
                backgroundColor: '#00d4ff',
                color: '#000',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              {showForm ? 'Cancel' : 'Add Employee'}
            </button>
          </div>

          {error && (
            <div style={{ backgroundColor: '#ff4455', color: '#fff', padding: '12px', borderRadius: '6px', marginBottom: '20px' }}>
              {error}
            </div>
          )}

          {showForm && (
            <form onSubmit={handleSubmit} style={{
              backgroundColor: '#2a2a3e',
              padding: '30px',
              borderRadius: '12px',
              marginBottom: '30px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px',
            }}>
              <h3 style={{ gridColumn: '1 / -1', color: '#00d4ff', marginBottom: '10px' }}>
                {editingId ? '✏️ Edit Employee' : '➕ Add New Employee'}
              </h3>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#00d4ff', fontWeight: '600' }}>
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '2px solid #3a3a4e',
                    borderRadius: '6px',
                    backgroundColor: '#1e1e2e',
                    color: '#fff',
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#00d4ff', fontWeight: '600' }}>
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '2px solid #3a3a4e',
                    borderRadius: '6px',
                    backgroundColor: '#1e1e2e',
                    color: '#fff',
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
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '2px solid #3a3a4e',
                    borderRadius: '6px',
                    backgroundColor: '#1e1e2e',
                    color: '#fff',
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
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '2px solid #3a3a4e',
                    borderRadius: '6px',
                    backgroundColor: '#1e1e2e',
                    color: '#fff',
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#00d4ff', fontWeight: '600' }}>
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '2px solid #3a3a4e',
                    borderRadius: '6px',
                    backgroundColor: '#1e1e2e',
                    color: '#fff',
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#00d4ff', fontWeight: '600' }}>
                  Contact
                </label>
                <input
                  type="text"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '2px solid #3a3a4e',
                    borderRadius: '6px',
                    backgroundColor: '#1e1e2e',
                    color: '#fff',
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
                    padding: '10px',
                    border: '2px solid #3a3a4e',
                    borderRadius: '6px',
                    backgroundColor: '#1e1e2e',
                    color: '#fff',
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#00d4ff', fontWeight: '600' }}>
                  Base Salary (PKR)
                </label>
                <input
                  type="number"
                  name="base_salary"
                  value={formData.base_salary}
                  onChange={handleChange}
                  placeholder="e.g., 15000"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '2px solid #3a3a4e',
                    borderRadius: '6px',
                    backgroundColor: '#1e1e2e',
                    color: '#fff',
                  }}
                />
              </div>
              <button
                type="submit"
                style={{
                  gridColumn: '1 / -1',
                  padding: '12px',
                  backgroundColor: '#00ff88',
                  color: '#000',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                }}
              >
                {editingId ? '💾 Update Employee' : '➕ Add Employee'}
              </button>
            </form>
          )}

          {employeeList.length === 0 ? (
            <div style={{
              backgroundColor: '#2a2a3e',
              padding: '40px',
              borderRadius: '12px',
              textAlign: 'center',
              color: '#aaa',
            }}>
              No employees found. Add one to get started!
            </div>
          ) : (
            <div style={{ overflowX: 'auto', backgroundColor: '#2a2a3e', borderRadius: '12px', padding: '20px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #00d4ff' }}>
                    <th style={{ padding: '12px', textAlign: 'left', color: '#00d4ff', fontWeight: 'bold' }}>ID</th>
                    <th style={{ padding: '12px', textAlign: 'left', color: '#00d4ff', fontWeight: 'bold' }}>Name</th>
                    <th style={{ padding: '12px', textAlign: 'left', color: '#00d4ff', fontWeight: 'bold' }}>Age</th>
                    <th style={{ padding: '12px', textAlign: 'left', color: '#00d4ff', fontWeight: 'bold' }}>Designation</th>
                    <th style={{ padding: '12px', textAlign: 'left', color: '#00d4ff', fontWeight: 'bold' }}>Email</th>
                    <th style={{ padding: '12px', textAlign: 'left', color: '#00d4ff', fontWeight: 'bold' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employeeList.map((emp) => (
                    <tr key={emp.emp_id} style={{ borderBottom: '1px solid #3a3a4e' }}>
                      <td style={{ padding: '12px', color: '#fff' }}>{emp.emp_id}</td>
                      <td style={{ padding: '12px', color: '#fff' }}>{emp.name}</td>
                      <td style={{ padding: '12px', color: '#fff' }}>{emp.age || '-'}</td>
                      <td style={{ padding: '12px', color: '#fff' }}>{emp.designation || '-'}</td>
                      <td style={{ padding: '12px', color: '#fff' }}>{emp.email || '-'}</td>
                      <td style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => handleEdit(emp)}
                            style={{
                              padding: '8px 16px',
                              backgroundColor: '#00d4ff',
                              color: '#000',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontWeight: 'bold',
                              fontSize: '12px',
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(emp.emp_id)}
                            style={{
                              padding: '8px 16px',
                              backgroundColor: '#ff4455',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontWeight: 'bold',
                              fontSize: '12px',
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div style={{ marginTop: '30px' }}>
            <button
              onClick={() => router.push('/dashboard')}
              style={{
                padding: '12px 24px',
                backgroundColor: '#3a3a4e',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
