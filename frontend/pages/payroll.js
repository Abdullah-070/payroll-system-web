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
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    emp_id: '',
    working_days: '',
    rate_per_day: '',
    // Leaves
    number_of_leaves: '0',
    deduction_per_leave: '0',
    // Allowances
    house_rent_allowance: '0',
    transport_allowance: '0',
    mobile_allowance: '0',
    medical_allowance: '0',
    fuel_allowance: '0',
    vehicle_repair_allowance: '0',
    other_allowance: '0',
    // Bonuses
    annual_bonus: '0',
    performance_bonus: '0',
    overtime_bonus: '0',
    // Overtime
    overtime_rate: '0',
    overtime_hours: '0',
    // Deductions
    income_tax: '0',
    loan_deduction: '0',
    advance_deduction: '0',
    insurance_deduction: '0',
    other_deductions: '0',
  });


  useEffect(() => {
    const token = Cookies.get('token');
    const userData = Cookies.get('user');
    if (!token) {
      router.push('/');
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
      // Calculate totals
      const allowances = {
        house_rent_allowance: parseFloat(formData.house_rent_allowance || 0),
        transport_allowance: parseFloat(formData.transport_allowance || 0),
        mobile_allowance: parseFloat(formData.mobile_allowance || 0),
        medical_allowance: parseFloat(formData.medical_allowance || 0),
        fuel_allowance: parseFloat(formData.fuel_allowance || 0),
        vehicle_repair_allowance: parseFloat(formData.vehicle_repair_allowance || 0),
        other_allowance: parseFloat(formData.other_allowance || 0),
      };
      
      const bonuses = {
        annual_bonus: parseFloat(formData.annual_bonus || 0),
        performance_bonus: parseFloat(formData.performance_bonus || 0),
        overtime_bonus: parseFloat(formData.overtime_bonus || 0),
      };

      const deductions = {
        income_tax: parseFloat(formData.income_tax || 0),
        loan_deduction: parseFloat(formData.loan_deduction || 0),
        advance_deduction: parseFloat(formData.advance_deduction || 0),
        insurance_deduction: parseFloat(formData.insurance_deduction || 0),
        other_deductions: parseFloat(formData.other_deductions || 0),
      };

      // Leave calculations
      const number_of_leaves = parseInt(formData.number_of_leaves || 0);
      const deduction_per_leave = parseFloat(formData.deduction_per_leave || 0);
      const leave_deduction = number_of_leaves * deduction_per_leave;

      const working_days = parseInt(formData.working_days || 0);
      const rate_per_day = parseFloat(formData.rate_per_day || 0);
      const basic_salary = working_days * rate_per_day;
      
      const total_allowances = Object.values(allowances).reduce((a, b) => a + b, 0);
      const total_bonus = Object.values(bonuses).reduce((a, b) => a + b, 0);
      const overtime_bonus = bonuses.overtime_bonus;
      const total_deductions = Object.values(deductions).reduce((a, b) => a + b, 0) + leave_deduction;
      
      const gross_salary = basic_salary + total_allowances;
      const net_salary = gross_salary + total_bonus - total_deductions;
      const total_salary = net_salary;

      const payrollData = {
        emp_id: parseInt(formData.emp_id),
        working_days,
        rate_per_day,
        basic_salary,
        number_of_leaves,
        deduction_per_leave,
        ...allowances,
        total_allowances,
        ...bonuses,
        total_bonus,
        overtime_bonus,
        overtime_rate: parseFloat(formData.overtime_rate || 0),
        overtime_hours: parseFloat(formData.overtime_hours || 0),
        ...deductions,
        total_deductions,
        gross_salary,
        net_salary,
        total_salary,
        payroll_date: new Date(),
        payroll_month: new Date().getMonth() + 1,
        payroll_year: new Date().getFullYear(),
        status: 'draft'
      };

      if (editingId) {
        // Update existing payroll
        await payroll.update(editingId, payrollData);
        setEditingId(null);
      } else {
        // Create new payroll
        await payroll.create(payrollData);
      }

      // Reset form
      setFormData({
        emp_id: '',
        working_days: '',
        rate_per_day: '',
        number_of_leaves: '0',
        deduction_per_leave: '0',
        house_rent_allowance: '0',
        transport_allowance: '0',
        mobile_allowance: '0',
        medical_allowance: '0',
        fuel_allowance: '0',
        vehicle_repair_allowance: '0',
        other_allowance: '0',
        annual_bonus: '0',
        performance_bonus: '0',
        overtime_bonus: '0',
        overtime_rate: '0',
        overtime_hours: '0',
        income_tax: '0',
        loan_deduction: '0',
        advance_deduction: '0',
        insurance_deduction: '0',
        other_deductions: '0',
      });
      setShowForm(false);
      loadData();
    } catch (err) {
      setError('Failed to save payroll record');
    }
  };


  const handleEdit = (record) => {
    setEditingId(record.payroll_id);
    setFormData({
      emp_id: record.emp_id.toString(),
      working_days: record.working_days.toString(),
      rate_per_day: record.rate_per_day.toString(),
      number_of_leaves: record.number_of_leaves?.toString() || '0',
      deduction_per_leave: record.deduction_per_leave?.toString() || '0',
      house_rent_allowance: record.house_rent_allowance?.toString() || '0',
      transport_allowance: record.transport_allowance?.toString() || '0',
      mobile_allowance: record.mobile_allowance?.toString() || '0',
      medical_allowance: record.medical_allowance?.toString() || '0',
      fuel_allowance: record.fuel_allowance?.toString() || '0',
      vehicle_repair_allowance: record.vehicle_repair_allowance?.toString() || '0',
      other_allowance: record.other_allowance?.toString() || '0',
      annual_bonus: record.annual_bonus?.toString() || '0',
      performance_bonus: record.performance_bonus?.toString() || '0',
      overtime_bonus: record.overtime_bonus?.toString() || '0',
      overtime_rate: record.overtime_rate?.toString() || '0',
      overtime_hours: record.overtime_hours?.toString() || '0',
      income_tax: record.income_tax?.toString() || '0',
      loan_deduction: record.loan_deduction?.toString() || '0',
      advance_deduction: record.advance_deduction?.toString() || '0',
      insurance_deduction: record.insurance_deduction?.toString() || '0',
      other_deductions: record.other_deductions?.toString() || '0',
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({
      emp_id: '',
      working_days: '',
      rate_per_day: '',
      number_of_leaves: '0',
      deduction_per_leave: '0',
      house_rent_allowance: '0',
      transport_allowance: '0',
      mobile_allowance: '0',
      medical_allowance: '0',
      fuel_allowance: '0',
      vehicle_repair_allowance: '0',
      other_allowance: '0',
      annual_bonus: '0',
      performance_bonus: '0',
      overtime_bonus: '0',
      overtime_rate: '0',
      overtime_hours: '0',
      income_tax: '0',
      loan_deduction: '0',
      advance_deduction: '0',
      insurance_deduction: '0',
      other_deductions: '0',
    });
    setShowForm(false);
  };

  const handleDelete = async (payroll_id) => {
    if (!window.confirm('Are you sure you want to delete this payroll record?')) {
      return;
    }

    try {
      await payroll.delete(payroll_id);
      loadData();
    } catch (err) {
      setError('Failed to delete payroll record');
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
                onClick={() => {
                  setShowForm(!showForm);
                  if (showForm) {
                    handleCancel();
                  }
                }}
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
                {showForm ? 'Cancel' : '➕ New Payroll'}
              </button>
            )}
          </div>

          {error && (
            <div style={{ backgroundColor: '#ff4455', color: '#fff', padding: '12px', borderRadius: '6px', marginBottom: '20px' }}>
              {error}
            </div>
          )}

          {user?.role === 'admin' && showForm && (
            <form onSubmit={handleSubmit} style={{
              backgroundColor: '#2a2a3e',
              padding: '30px',
              borderRadius: '12px',
              marginBottom: '30px',
            }}>
              {/* Basic Information */}
              <h3 style={{ color: '#00ff88', marginBottom: '20px', fontSize: '18px', fontWeight: '600' }}>
                {editingId ? '✏️ Edit Payroll' : '📋 Create New Payroll'}
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
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
                    Rate per Day (PKR)
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
              </div>

              {/* Leaves */}
              <h3 style={{ color: '#00ff88', marginBottom: '20px', fontSize: '18px', fontWeight: '600' }}>
                🏖️ Leaves
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#00d4ff', fontWeight: '600' }}>
                    Number of Leaves
                  </label>
                  <input
                    type="number"
                    name="number_of_leaves"
                    value={formData.number_of_leaves}
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
                    Deduction per Leave (PKR)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="deduction_per_leave"
                    value={formData.deduction_per_leave}
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
              </div>

              {/* Allowances */}
              <h3 style={{ color: '#00ff88', marginBottom: '20px', fontSize: '18px', fontWeight: '600' }}>
                💰 Allowances
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#00d4ff', fontWeight: '600' }}>
                    House Rent Allowance
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="house_rent_allowance"
                    value={formData.house_rent_allowance}
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
                    Transport Allowance
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="transport_allowance"
                    value={formData.transport_allowance}
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
                    Mobile Allowance
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="mobile_allowance"
                    value={formData.mobile_allowance}
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
                    Medical Allowance
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="medical_allowance"
                    value={formData.medical_allowance}
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
                    Fuel Allowance
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="fuel_allowance"
                    value={formData.fuel_allowance}
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
                    Vehicle Repair Allowance
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="vehicle_repair_allowance"
                    value={formData.vehicle_repair_allowance}
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
                    Other Allowance
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="other_allowance"
                    value={formData.other_allowance}
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
              </div>

              {/* Bonuses */}
              <h3 style={{ color: '#00ff88', marginBottom: '20px', fontSize: '18px', fontWeight: '600' }}>
                🎁 Bonuses
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#00d4ff', fontWeight: '600' }}>
                    Annual Bonus
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="annual_bonus"
                    value={formData.annual_bonus}
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
                    Performance Bonus
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="performance_bonus"
                    value={formData.performance_bonus}
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
                    Overtime Bonus
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="overtime_bonus"
                    value={formData.overtime_bonus}
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
              </div>

              {/* Overtime Details */}
              <h3 style={{ color: '#00ff88', marginBottom: '20px', fontSize: '18px', fontWeight: '600' }}>
                ⏱️ Overtime Details
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#00d4ff', fontWeight: '600' }}>
                    Overtime Rate (PKR/hour)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="overtime_rate"
                    value={formData.overtime_rate}
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
                    Overtime Hours
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="overtime_hours"
                    value={formData.overtime_hours}
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
              </div>

              {/* Deductions */}
              <h3 style={{ color: '#00ff88', marginBottom: '20px', fontSize: '18px', fontWeight: '600' }}>
                📉 Deductions
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#00d4ff', fontWeight: '600' }}>
                    Income Tax
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="income_tax"
                    value={formData.income_tax}
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
                    Loan Deduction
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="loan_deduction"
                    value={formData.loan_deduction}
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
                    Advance Deduction
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="advance_deduction"
                    value={formData.advance_deduction}
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
                    Insurance Deduction
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="insurance_deduction"
                    value={formData.insurance_deduction}
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
                    Other Deductions
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="other_deductions"
                    value={formData.other_deductions}
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
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#00ff88',
                  color: '#000',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontSize: '16px',
                }}
              >
                {editingId ? '✏️ Update Payroll' : '➕ Create Payroll'}
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
                    {user?.role === 'admin' && (
                      <th style={{ padding: '12px', textAlign: 'left', color: '#00ff88', fontWeight: 'bold' }}>Actions</th>
                    )}
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
                      {user?.role === 'admin' && (
                        <td style={{ padding: '12px' }}>
                          <button
                            onClick={() => handleEdit(record)}
                            style={{
                              padding: '6px 12px',
                              backgroundColor: '#00d4ff',
                              color: '#000',
                              border: 'none',
                              borderRadius: '4px',
                              fontWeight: 'bold',
                              cursor: 'pointer',
                              marginRight: '8px',
                              fontSize: '12px'
                            }}
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => handleDelete(record.payroll_id)}
                            style={{
                              padding: '6px 12px',
                              backgroundColor: '#ff4455',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '4px',
                              fontWeight: 'bold',
                              cursor: 'pointer',
                              fontSize: '12px'
                            }}
                          >
                            🗑️ Delete
                          </button>
                        </td>
                      )}
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
