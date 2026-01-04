import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import Cookies from 'js-cookie';
import { employees } from '../utils/api';

export default function Employees() {
  const router = useRouter();
  const [employeeList, setEmployeeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
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
        salary: '',
        join_date: '',
        employment_type: '',
        qualification: '',
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
      salary: employee.salary || '',
      join_date: employee.join_date || '',
      employment_type: employee.employment_type || '',
      qualification: employee.qualification || '',
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
      salary: '',
      join_date: '',
      employment_type: '',
      qualification: '',
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
              👥 Employees
            </h1>
            <Link href="/add-employee">
              <a style={{
                padding: '12px 24px',
                backgroundColor: '#00d4ff',
                color: '#000',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 'bold',
                cursor: 'pointer',
                textDecoration: 'none',
                display: 'inline-block'
              }}>
                ➕ Add Employee
              </a>
            </Link>
          </div>

          {error && (
            <div style={{ backgroundColor: '#ff4455', color: '#fff', padding: '12px', borderRadius: '6px', marginBottom: '20px' }}>
              {error}
            </div>
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
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #00d4ff' }}>
                    <th style={{ padding: '12px', textAlign: 'left', color: '#00d4ff', fontWeight: 'bold', whiteSpace: 'nowrap' }}>Name</th>
                    <th style={{ padding: '12px', textAlign: 'left', color: '#00d4ff', fontWeight: 'bold', whiteSpace: 'nowrap' }}>Age</th>
                    <th style={{ padding: '12px', textAlign: 'left', color: '#00d4ff', fontWeight: 'bold', whiteSpace: 'nowrap' }}>Organization</th>
                    <th style={{ padding: '12px', textAlign: 'left', color: '#00d4ff', fontWeight: 'bold', whiteSpace: 'nowrap' }}>Designation</th>
                    <th style={{ padding: '12px', textAlign: 'left', color: '#00d4ff', fontWeight: 'bold', whiteSpace: 'nowrap' }}>Email</th>
                    <th style={{ padding: '12px', textAlign: 'left', color: '#00d4ff', fontWeight: 'bold', whiteSpace: 'nowrap' }}>Contact</th>
                    <th style={{ padding: '12px', textAlign: 'left', color: '#00d4ff', fontWeight: 'bold', whiteSpace: 'nowrap' }}>Department</th>
                    <th style={{ padding: '12px', textAlign: 'left', color: '#00d4ff', fontWeight: 'bold', whiteSpace: 'nowrap' }}>Salary (PKR)</th>
                    <th style={{ padding: '12px', textAlign: 'left', color: '#00d4ff', fontWeight: 'bold', whiteSpace: 'nowrap' }}>Join Date</th>
                    <th style={{ padding: '12px', textAlign: 'left', color: '#00d4ff', fontWeight: 'bold', whiteSpace: 'nowrap' }}>Employment Type</th>
                    <th style={{ padding: '12px', textAlign: 'left', color: '#00d4ff', fontWeight: 'bold', whiteSpace: 'nowrap' }}>Qualification</th>
                    <th style={{ padding: '12px', textAlign: 'left', color: '#00d4ff', fontWeight: 'bold', whiteSpace: 'nowrap' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employeeList.map((emp) => (
                    <tr key={emp.emp_id} style={{ borderBottom: '1px solid #3a3a4e', hover: { backgroundColor: '#1e1e2e' } }}>
                      <td style={{ padding: '12px', color: '#fff' }}>{emp.name}</td>
                      <td style={{ padding: '12px', color: '#fff' }}>{emp.age || '-'}</td>
                      <td style={{ padding: '12px', color: '#fff' }}>{emp.organization || '-'}</td>
                      <td style={{ padding: '12px', color: '#fff' }}>{emp.designation || '-'}</td>
                      <td style={{ padding: '12px', color: '#fff', fontSize: '12px' }}>{emp.email || '-'}</td>
                      <td style={{ padding: '12px', color: '#fff' }}>{emp.contact || '-'}</td>
                      <td style={{ padding: '12px', color: '#fff' }}>{emp.department || '-'}</td>
                      <td style={{ padding: '12px', color: '#fff' }}>{emp.salary ? emp.salary.toLocaleString() : '-'}</td>
                      <td style={{ padding: '12px', color: '#fff' }}>{emp.join_date ? new Date(emp.join_date).toLocaleDateString() : '-'}</td>
                      <td style={{ padding: '12px', color: '#fff' }}>{emp.employment_type || '-'}</td>
                      <td style={{ padding: '12px', color: '#fff' }}>{emp.qualification || '-'}</td>
                      <td style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', gap: '8px', whiteSpace: 'nowrap' }}>
                          <button
                            onClick={() => handleEdit(emp)}
                            style={{
                              padding: '8px 12px',
                              backgroundColor: '#00d4ff',
                              color: '#000',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontWeight: 'bold',
                              fontSize: '12px',
                            }}
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => handleDelete(emp.emp_id)}
                            style={{
                              padding: '8px 12px',
                              backgroundColor: '#ff4455',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontWeight: 'bold',
                              fontSize: '12px',
                            }}
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {editingId && (
            <div style={{
              backgroundColor: '#2a2a3e',
              padding: '30px',
              borderRadius: '12px',
              marginTop: '30px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px',
              borderLeft: '4px solid #00d4ff',
            }}>
              <h3 style={{ gridColumn: '1 / -1', color: '#00d4ff', marginBottom: '10px' }}>
                ✏️ Edit Employee
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
                    boxSizing: 'border-box',
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
                    boxSizing: 'border-box',
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
                    boxSizing: 'border-box',
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
                    boxSizing: 'border-box',
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
                    boxSizing: 'border-box',
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
                    boxSizing: 'border-box',
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
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '2px solid #3a3a4e',
                    borderRadius: '6px',
                    backgroundColor: '#1e1e2e',
                    color: '#fff',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#00d4ff', fontWeight: '600' }}>
                  Salary (PKR)
                </label>
                <input
                  type="number"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '2px solid #3a3a4e',
                    borderRadius: '6px',
                    backgroundColor: '#1e1e2e',
                    color: '#fff',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
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
                    padding: '10px',
                    border: '2px solid #3a3a4e',
                    borderRadius: '6px',
                    backgroundColor: '#1e1e2e',
                    color: '#fff',
                    boxSizing: 'border-box',
                    accentColor: '#00d4ff',
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
                    padding: '10px',
                    border: '2px solid #3a3a4e',
                    borderRadius: '6px',
                    backgroundColor: '#1e1e2e',
                    color: '#fff',
                    boxSizing: 'border-box',
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
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '2px solid #3a3a4e',
                    borderRadius: '6px',
                    backgroundColor: '#1e1e2e',
                    color: '#fff',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
              <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '12px', marginTop: '10px' }}>
                <button
                  onClick={handleSubmit}
                  style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: '#00ff88',
                    color: '#000',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                  }}
                >
                  💾 Update Employee
                </button>
                <button
                  onClick={handleCancel}
                  style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: '#3a3a4e',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                  }}
                >
                  ❌ Cancel
                </button>
              </div>
            </div>
          )}
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
