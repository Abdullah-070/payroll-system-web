import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  const [selectedRole, setSelectedRole] = useState(null);

  return (
    <>
      <Head>
        <title>Employee Payroll System</title>
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
          maxWidth: '600px', 
          width: '100%',
          textAlign: 'center'
        }}>
          {!selectedRole ? (
            // Role Selection Screen
            <div>
              <h1 style={{ 
                fontSize: '48px', 
                fontWeight: 'bold', 
                color: '#00d4ff',
                marginBottom: '20px'
              }}>
                Employee Payroll System
              </h1>
              <p style={{ 
                fontSize: '18px', 
                color: '#aaa',
                marginBottom: '50px'
              }}>
                Complete payroll management solution
              </p>

              <p style={{ 
                fontSize: '16px', 
                color: '#888',
                marginBottom: '40px'
              }}>
                🔐 Select your role to continue:
              </p>

              <div style={{ 
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '20px',
                marginBottom: '40px'
              }}>
                {/* Admin Role Card */}
                <div
                  onClick={() => setSelectedRole('admin')}
                  style={{
                    backgroundColor: '#2a2a3e',
                    padding: '40px 20px',
                    borderRadius: '12px',
                    border: '2px solid #3a3a4e',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 12px rgba(0,212,255,0.1)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#00d4ff';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,212,255,0.3)';
                    e.currentTarget.style.backgroundColor = '#323250';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#3a3a4e';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,212,255,0.1)';
                    e.currentTarget.style.backgroundColor = '#2a2a3e';
                  }}
                >
                  <div style={{ fontSize: '40px', marginBottom: '15px' }}>👨‍💼</div>
                  <h2 style={{ 
                    fontSize: '24px', 
                    fontWeight: 'bold',
                    color: '#00d4ff',
                    marginBottom: '10px'
                  }}>
                    Admin
                  </h2>
                  <p style={{ 
                    fontSize: '14px', 
                    color: '#888',
                    marginBottom: '10px'
                  }}>
                    Full system access
                  </p>
                  <ul style={{
                    fontSize: '12px',
                    color: '#666',
                    textAlign: 'left',
                    listStyle: 'none',
                    padding: '0',
                    margin: '0'
                  }}>
                    <li>✅ Manage employees</li>
                    <li>✅ Process payroll</li>
                    <li>✅ View reports</li>
                  </ul>
                </div>

                {/* Employee Role Card */}
                <div
                  onClick={() => setSelectedRole('employee')}
                  style={{
                    backgroundColor: '#2a2a3e',
                    padding: '40px 20px',
                    borderRadius: '12px',
                    border: '2px solid #3a3a4e',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 12px rgba(0,255,136,0.1)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#00ff88';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,255,136,0.3)';
                    e.currentTarget.style.backgroundColor = '#323250';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#3a3a4e';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,255,136,0.1)';
                    e.currentTarget.style.backgroundColor = '#2a2a3e';
                  }}
                >
                  <div style={{ fontSize: '40px', marginBottom: '15px' }}>👤</div>
                  <h2 style={{ 
                    fontSize: '24px', 
                    fontWeight: 'bold',
                    color: '#00ff88',
                    marginBottom: '10px'
                  }}>
                    Employee
                  </h2>
                  <p style={{ 
                    fontSize: '14px', 
                    color: '#888',
                    marginBottom: '10px'
                  }}>
                    Limited access
                  </p>
                  <ul style={{
                    fontSize: '12px',
                    color: '#666',
                    textAlign: 'left',
                    listStyle: 'none',
                    padding: '0',
                    margin: '0'
                  }}>
                    <li>✅ View profile</li>
                    <li>✅ Check salary</li>
                    <li>✅ Download reports</li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            // Login/Register Options for Selected Role
            <div>
              <button
                onClick={() => setSelectedRole(null)}
                style={{
                  position: 'absolute',
                  top: '20px',
                  left: '20px',
                  backgroundColor: 'transparent',
                  border: '1px solid #666',
                  color: '#888',
                  padding: '10px 15px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                ← Back
              </button>

              <h1 style={{ 
                fontSize: '36px', 
                fontWeight: 'bold',
                color: selectedRole === 'admin' ? '#00d4ff' : '#00ff88',
                marginBottom: '10px',
                marginTop: '40px'
              }}>
                {selectedRole === 'admin' ? '👨‍💼 Admin Access' : '👤 Employee Access'}
              </h1>
              
              <p style={{ 
                fontSize: '14px', 
                color: '#888',
                marginBottom: '40px'
              }}>
                {selectedRole === 'admin' 
                  ? 'Full system access for payroll management' 
                  : 'Access your personal salary information'}
              </p>

              {selectedRole === 'admin' && (
                <div style={{ 
                  backgroundColor: '#2a2a3e', 
                  padding: '30px', 
                  borderRadius: '12px',
                  border: '1px solid #3a3a4e',
                  marginBottom: '30px'
                }}>
                  <p style={{ color: '#00d4ff', marginBottom: '15px', fontSize: '14px' }}>
                    🔑 Admin Credentials:
                  </p>
                  <code style={{
                    backgroundColor: '#1e1e2e',
                    padding: '15px',
                    borderRadius: '6px',
                    display: 'block',
                    color: '#00ff88',
                    fontSize: '13px',
                    marginBottom: '15px',
                    fontFamily: 'monospace'
                  }}>
                    Username: admin<br/>
                    Password: SecurePayroll@2025
                  </code>
                  <p style={{ color: '#666', fontSize: '12px' }}>
                    💡 Copy these credentials to log in
                  </p>
                </div>
              )}

              {selectedRole === 'employee' && (
                <div style={{ 
                  backgroundColor: '#2a2a3e', 
                  padding: '30px', 
                  borderRadius: '12px',
                  border: '1px solid #3a3a4e',
                  marginBottom: '30px'
                }}>
                  <p style={{ color: '#00ff88', marginBottom: '15px', fontSize: '14px' }}>
                    🔑 Sample Employee Credentials:
                  </p>
                  <code style={{
                    backgroundColor: '#1e1e2e',
                    padding: '15px',
                    borderRadius: '6px',
                    display: 'block',
                    color: '#00ff88',
                    fontSize: '13px',
                    marginBottom: '15px',
                    fontFamily: 'monospace'
                  }}>
                    Username: emp1<br/>
                    Password: Employee@2025
                  </code>
                  <p style={{ color: '#666', fontSize: '12px' }}>
                    💡 Or register a new account below
                  </p>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <Link href="/auth/login" passHref>
                  <button
                    style={{
                      padding: '15px 20px',
                      backgroundColor: '#00d4ff',
                      color: '#000',
                      border: 'none',
                      borderRadius: '6px',
                      fontWeight: 'bold',
                      fontSize: '16px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#00b4d4';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#00d4ff';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    🔐 Login
                  </button>
                </Link>

                {selectedRole === 'employee' && (
                  <Link href="/auth/register" passHref>
                    <button
                      style={{
                        padding: '15px 20px',
                        backgroundColor: '#00ff88',
                        color: '#000',
                        border: 'none',
                        borderRadius: '6px',
                        fontWeight: 'bold',
                        fontSize: '16px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#00dd6f';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#00ff88';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      📝 Register
                    </button>
                  </Link>
                )}
              </div>
            </div>
          )}

          {/* Footer */}
          <div style={{ 
            marginTop: '60px', 
            paddingTop: '20px', 
            borderTop: '1px solid #3a3a4e',
            color: '#666',
            fontSize: '13px'
          }}>
            © 2025 Employee Payroll System | Made by Abdullah
          </div>
        </div>
      </div>
    </>
  );
}
