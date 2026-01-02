import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Cookies from 'js-cookie';
import { payroll } from '../utils/api';

export default function Reports() {
  const router = useRouter();
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }
    loadSummary();
  }, [router]);

  const loadSummary = async () => {
    try {
      setLoading(true);
      const response = await payroll.getSummary();
      setSummary(response.data);
    } catch (err) {
      setError('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ color: '#fff', textAlign: 'center', paddingTop: '40px' }}>Loading...</div>;
  }

  return (
    <>
      <Head>
        <title>Reports - Payroll System</title>
      </Head>
      <div style={{ backgroundColor: '#1e1e2e', minHeight: '100vh', padding: '40px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '30px', color: '#ffaa00' }}>
            Payroll Reports
          </h1>

          {error && (
            <div style={{ backgroundColor: '#ff4455', color: '#fff', padding: '12px', borderRadius: '6px', marginBottom: '20px' }}>
              {error}
            </div>
          )}

          {summary.length === 0 ? (
            <div style={{
              backgroundColor: '#2a2a3e',
              padding: '40px',
              borderRadius: '12px',
              textAlign: 'center',
              color: '#aaa',
            }}>
              No report data available.
            </div>
          ) : (
            <div style={{ overflowX: 'auto', backgroundColor: '#2a2a3e', borderRadius: '12px', padding: '20px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #ffaa00' }}>
                    <th style={{ padding: '12px', textAlign: 'left', color: '#ffaa00', fontWeight: 'bold' }}>Month</th>
                    <th style={{ padding: '12px', textAlign: 'left', color: '#ffaa00', fontWeight: 'bold' }}>Year</th>
                    <th style={{ padding: '12px', textAlign: 'left', color: '#ffaa00', fontWeight: 'bold' }}>Total Salary</th>
                    <th style={{ padding: '12px', textAlign: 'left', color: '#ffaa00', fontWeight: 'bold' }}>Records</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.map((record, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #3a3a4e' }}>
                      <td style={{ padding: '12px', color: '#fff' }}>
                        {new Date(2000, (record.payroll_month || 1) - 1).toLocaleString('default', { month: 'long' })}
                      </td>
                      <td style={{ padding: '12px', color: '#fff' }}>{record.payroll_year}</td>
                      <td style={{ padding: '12px', color: '#fff' }}>
                        ₹{((record.total_salary_paid || 0) + (record.total_allowances_paid || 0)).toFixed(2)}
                      </td>
                      <td style={{ padding: '12px', color: '#fff' }}>{record.employee_count || 0}</td>
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
