import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Cookies from 'js-cookie';
import { payroll, employees } from '../utils/api';

export default function Payroll() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [payrollList, setPayrollList] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    emp_id: '',
    working_days: '',
    rate_per_day: '',
    total_allowances: '',
    overtime_bonus: '',
    total_bonus: '',
    total_deductions: '',
  });
  const [generateMonth, setGenerateMonth] = useState(new Date().getMonth() + 1);
  const [generateYear, setGenerateYear] = useState(new Date().getFullYear());
  const [generatingPayroll, setGeneratingPayroll] = useState(false);

  useEffect(() => {
    const token = Cookies.get('token');
    const userData = Cookies.get('user');
    if (!token) {
      router.push('/auth/login');
      return;
    }
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    loadData();
  }, [router]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [payrollRes, empRes] = await Promise.all([
        payroll.getAll(),
        employees.getAll(),
      ]);
      setPayrollList(payrollRes.data);
      setEmployeeList(empRes.data);
    } catch (err) {
      setError('Failed to load data');
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
      await payroll.create({
        ...formData,
        emp_id: parseInt(formData.emp_id),
        working_days: parseInt(formData.working_days),
        rate_per_day: parseFloat(formData.rate_per_day),
        total_allowances: parseFloat(formData.total_allowances || 0),
        overtime_bonus: parseFloat(formData.overtime_bonus || 0),
        total_bonus: parseFloat(formData.total_bonus || 0),
        total_deductions: parseFloat(formData.total_deductions || 0),
      });
      setFormData({
        emp_id: '',
        working_days: '',
        rate_per_day: '',
        total_allowances: '',
        overtime_bonus: '',
        total_bonus: '',
        total_deductions: '',
      });
      setShowForm(false);
      loadData();
    } catch (err) {
      setError('Failed to create payroll record');
    }
  };

  const handleGeneratePayroll = async () => {
    if (!window.confirm(`Generate payroll for ${generateMonth}/${generateYear} for all employees?`)) {
      return;
    }
    
    setGeneratingPayroll(true);
    setError('');
    
    try {
      const response = await payroll.generate(generateMonth, generateYear);
      alert(`✓ ${response.data.message}`);
      loadData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate payroll');
    } finally {
      setGeneratingPayroll(false);
    }
  };

  if (loading) {
    return <div style={{ color: '#fff', textAlign: 'center', paddingTop: '40px' }}>Loading...</div>;
  }

  return (
    <>
      <Head>
        <title>Payroll - Payroll System</title>
      </Head>
      <div style={{ backgroundColor: '#1e1e2e', minHeight: '100vh', padding: '40px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#00ff88' }}>
              Payroll Management
            </h1>
            {user?.role === 'admin' && (
              <button
                onClick={() => setShowForm(!showForm)}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#00ff88',
                  color: '#000',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                }}
              >
                {showForm ? 'Cancel' : 'New Payroll'}
              </button>
            )}
          </div>

          {error && (
            <div style={{ backgroundColor: '#ff4455', color: '#fff', padding: '12px', borderRadius: '6px', marginBottom: '20px' }}>
              {error}
            </div>
          )}

          {user?.role === 'admin' && (
            <div style={{ backgroundColor: '#2a2a3e', padding: '20px', borderRadius: '12px', marginBottom: '30px', border: '1px solid #3a3a4e' }}>
              <h3 style={{ color: '#00d4ff', marginBottom: '15px', fontSize: '16px', fontWeight: '600' }}>
                🚀 Auto-Generate Payroll for All Employees
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'auto auto auto auto', gap: '15px', alignItems: 'flex-end' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#aaa', fontSize: '12px' }}>Month</label>
                  <select
                    value={generateMonth}
                    onChange={(e) => setGenerateMonth(parseInt(e.target.value))}
                    style={{
                      padding: '8px',
                      border: '2px solid #3a3a4e',
                      borderRadius: '6px',
                      backgroundColor: '#1e1e2e',
                      color: '#fff',
                    }}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#aaa', fontSize: '12px' }}>Year</label>
                  <input
                    type="number"
                    value={generateYear}
                    onChange={(e) => setGenerateYear(parseInt(e.target.value))}
                    style={{
                      padding: '8px',
                      border: '2px solid #3a3a4e',
                      borderRadius: '6px',
                      backgroundColor: '#1e1e2e',
                      color: '#fff',
                      width: '80px',
                    }}
                  />
                </div>
                <button
                  onClick={handleGeneratePayroll}
                  disabled={generatingPayroll}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#ff6b6b',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: 'bold',
                    cursor: generatingPayroll ? 'not-allowed' : 'pointer',
                    opacity: generatingPayroll ? 0.6 : 1,
                    fontSize: '14px',
                  }}
                >
                  {generatingPayroll ? 'Generating...' : 'Generate'}
                </button>
              </div>
            </div>
          )}

          {user?.role === 'admin' && showForm && (
            <form onSubmit={handleSubmit} style={{
              backgroundColor: '#2a2a3e',
              padding: '30px',
              borderRadius: '12px',
              marginBottom: '30px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px',
            }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#00d4ff', fontWeight: '600' }}>
                  Employee
                </label>
                <select
                  name="emp_id"
                  value={formData.emp_id}
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
                >
                  <option value="">Select Employee</option>
                  {employeeList.map((emp) => (
                    <option key={emp.emp_id} value={emp.emp_id}>
                      {emp.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#00d4ff', fontWeight: '600' }}>
                  Working Days
                </label>
                <input
                  type="number"
                  name="working_days"
                  value={formData.working_days}
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
                  Rate per Day
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="rate_per_day"
                  value={formData.rate_per_day}
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
                  Allowances
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="total_allowances"
                  value={formData.total_allowances}
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
                  Deductions
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="total_deductions"
                  value={formData.total_deductions}
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
                  Bonus
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="total_bonus"
                  value={formData.total_bonus}
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
                Create Payroll
              </button>
            </form>
          )}

          {payrollList.length === 0 ? (
            <div style={{
              backgroundColor: '#2a2a3e',
              padding: '40px',
              borderRadius: '12px',
              textAlign: 'center',
              color: '#aaa',
            }}>
              No payroll records found.
            </div>
          ) : (
            <div style={{ overflowX: 'auto', backgroundColor: '#2a2a3e', borderRadius: '12px', padding: '20px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #00ff88' }}>
                    <th style={{ padding: '12px', textAlign: 'left', color: '#00ff88', fontWeight: 'bold' }}>Employee</th>
                    <th style={{ padding: '12px', textAlign: 'left', color: '#00ff88', fontWeight: 'bold' }}>Basic Salary</th>
                    <th style={{ padding: '12px', textAlign: 'left', color: '#00ff88', fontWeight: 'bold' }}>Gross Salary</th>
                    <th style={{ padding: '12px', textAlign: 'left', color: '#00ff88', fontWeight: 'bold' }}>Net Salary</th>
                    <th style={{ padding: '12px', textAlign: 'left', color: '#00ff88', fontWeight: 'bold' }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {payrollList.map((record) => (
                    <tr key={record.payroll_id} style={{ borderBottom: '1px solid #3a3a4e' }}>
                      <td style={{ padding: '12px', color: '#fff' }}>
                        {employeeList.find((e) => e.emp_id === record.emp_id)?.name || 'Unknown'}
                      </td>
                      <td style={{ padding: '12px', color: '#fff' }}>PKR {record.basic_salary?.toFixed(2)}</td>
                      <td style={{ padding: '12px', color: '#fff' }}>PKR {record.gross_salary?.toFixed(2)}</td>
                      <td style={{ padding: '12px', color: '#fff' }}>PKR {record.net_salary?.toFixed(2)}</td>
                      <td style={{ padding: '12px', color: '#fff' }}>
                        {new Date(record.payroll_date).toLocaleDateString()}
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
