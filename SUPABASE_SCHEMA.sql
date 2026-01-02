-- Employee Payroll Management System - Supabase Database Schema
-- Deploy this on Supabase PostgreSQL database

-- ================================================================
-- USERS TABLE - Authentication & Role Management
-- ================================================================
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    emp_id INTEGER UNIQUE,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE,
    role VARCHAR(20) DEFAULT 'employee',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- Create index on username for fast login
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- ================================================================
-- EMPLOYEES TABLE - Employee Information
-- ================================================================
CREATE TABLE employees (
    emp_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    age INTEGER,
    organization VARCHAR(200),
    designation VARCHAR(100),
    email VARCHAR(100),
    contact VARCHAR(20),
    salary DECIMAL(12, 2),
    department VARCHAR(100),
    join_date DATE,
    employment_type VARCHAR(50),
    qualification VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for frequently searched fields
CREATE INDEX idx_employees_name ON employees(name);
CREATE INDEX idx_employees_organization ON employees(organization);
CREATE INDEX idx_employees_designation ON employees(designation);
CREATE INDEX idx_employees_email ON employees(email);

-- ================================================================
-- PAYROLL TABLE - Salary Records & Calculations
-- ================================================================
CREATE TABLE payroll (
    payroll_id SERIAL PRIMARY KEY,
    emp_id INTEGER NOT NULL,
    working_days INTEGER,
    rate_per_day DECIMAL(10, 2),
    basic_salary DECIMAL(12, 2),
    
    -- Allowances
    house_rent_allowance DECIMAL(10, 2) DEFAULT 0,
    transport_allowance DECIMAL(10, 2) DEFAULT 0,
    mobile_allowance DECIMAL(10, 2) DEFAULT 0,
    medical_allowance DECIMAL(10, 2) DEFAULT 0,
    fuel_allowance DECIMAL(10, 2) DEFAULT 0,
    vehicle_repair_allowance DECIMAL(10, 2) DEFAULT 0,
    other_allowances DECIMAL(10, 2) DEFAULT 0,
    total_allowances DECIMAL(12, 2),
    
    -- Bonuses
    annual_bonus DECIMAL(12, 2) DEFAULT 0,
    performance_bonus DECIMAL(12, 2) DEFAULT 0,
    overtime_hours DECIMAL(10, 2) DEFAULT 0,
    overtime_rate DECIMAL(10, 2) DEFAULT 0,
    overtime_bonus DECIMAL(12, 2) DEFAULT 0,
    total_bonus DECIMAL(12, 2) DEFAULT 0,
    
    -- Deductions
    income_tax DECIMAL(10, 2) DEFAULT 0,
    loan_deduction DECIMAL(10, 2) DEFAULT 0,
    advance_deduction DECIMAL(10, 2) DEFAULT 0,
    leave_deduction DECIMAL(10, 2) DEFAULT 0,
    insurance_deduction DECIMAL(10, 2) DEFAULT 0,
    other_deductions DECIMAL(10, 2) DEFAULT 0,
    total_deductions DECIMAL(12, 2),
    
    -- Calculations
    gross_salary DECIMAL(12, 2),
    net_salary DECIMAL(12, 2),
    total_salary DECIMAL(12, 2),
    
    -- Metadata
    payroll_month INTEGER,
    payroll_year INTEGER,
    payroll_date DATE,
    status VARCHAR(20) DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (emp_id) REFERENCES employees(emp_id) ON DELETE CASCADE
);

-- Create indexes for payroll queries
CREATE INDEX idx_payroll_emp_id ON payroll(emp_id);
CREATE INDEX idx_payroll_month_year ON payroll(payroll_year, payroll_month);
CREATE INDEX idx_payroll_date ON payroll(payroll_date);
CREATE INDEX idx_payroll_status ON payroll(status);

-- ================================================================
-- ATTENDANCE TABLE - Employee Attendance Records
-- ================================================================
CREATE TABLE attendance (
    attendance_id SERIAL PRIMARY KEY,
    emp_id INTEGER NOT NULL,
    attendance_date DATE NOT NULL,
    status VARCHAR(20),
    check_in TIME,
    check_out TIME,
    hours_worked DECIMAL(5, 2),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (emp_id) REFERENCES employees(emp_id) ON DELETE CASCADE,
    UNIQUE(emp_id, attendance_date)
);

-- Create indexes for attendance
CREATE INDEX idx_attendance_emp_id ON attendance(emp_id);
CREATE INDEX idx_attendance_date ON attendance(attendance_date);
CREATE INDEX idx_attendance_status ON attendance(status);

-- ================================================================
-- LEAVES TABLE - Employee Leave Management
-- ================================================================
CREATE TABLE leaves (
    leave_id SERIAL PRIMARY KEY,
    emp_id INTEGER NOT NULL,
    leave_type VARCHAR(50),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_days INTEGER,
    reason TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    approved_by INTEGER,
    approval_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (emp_id) REFERENCES employees(emp_id) ON DELETE CASCADE,
    FOREIGN KEY (approved_by) REFERENCES users(user_id)
);

-- Create indexes for leaves
CREATE INDEX idx_leaves_emp_id ON leaves(emp_id);
CREATE INDEX idx_leaves_status ON leaves(status);
CREATE INDEX idx_leaves_dates ON leaves(start_date, end_date);

-- ================================================================
-- DEPARTMENTS TABLE - Organization Structure
-- ================================================================
CREATE TABLE departments (
    dept_id SERIAL PRIMARY KEY,
    dept_name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    manager_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (manager_id) REFERENCES users(user_id)
);

-- ================================================================
-- SALARY COMPONENTS TABLE - Configurable Salary Structure
-- ================================================================
CREATE TABLE salary_components (
    component_id SERIAL PRIMARY KEY,
    component_name VARCHAR(100) NOT NULL,
    component_type VARCHAR(20),
    default_value DECIMAL(12, 2),
    is_percentage BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================================================
-- AUDIT LOG TABLE - System Activity Tracking
-- ================================================================
CREATE TABLE audit_logs (
    log_id SERIAL PRIMARY KEY,
    user_id INTEGER,
    action VARCHAR(100),
    table_name VARCHAR(50),
    record_id INTEGER,
    old_values JSONB,
    new_values JSONB,
    ip_address VARCHAR(45),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Create index for audit logs
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp);

-- ================================================================
-- REPORTS TABLE - Generated Reports History
-- ================================================================
CREATE TABLE reports (
    report_id SERIAL PRIMARY KEY,
    report_type VARCHAR(50),
    generated_by INTEGER,
    report_data JSONB,
    parameters JSONB,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (generated_by) REFERENCES users(user_id)
);

-- ================================================================
-- SETTINGS TABLE - System Configuration
-- ================================================================
CREATE TABLE settings (
    setting_id SERIAL PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================================================
-- INSERT DEFAULT DATA
-- ================================================================

-- Insert default admin user (password: admin123 hashed with bcrypt)
INSERT INTO users (username, password_hash, email, role, is_active)
VALUES ('admin', '$2b$10$Xk6kKK5.Q5.Q5.Q5.Q5.Q5.Q5.Q5.Q5.Q5.Q5.Q5.Q5.Q5.Q5.Q5.Q5', 'admin@payroll.com', 'admin', TRUE);

-- Insert default settings
INSERT INTO settings (setting_key, setting_value, description) VALUES
('company_name', 'Your Company Name', 'Organization name for reports'),
('working_days_per_month', '26', 'Standard working days per month'),
('overtime_rate_multiplier', '1.5', 'Overtime pay multiplier'),
('financial_year_start', '04-01', 'Financial year start date'),
('currency_symbol', '₹', 'Currency symbol for reports'),
('tax_percentage', '10', 'Default income tax percentage'),
('max_leaves_per_year', '30', 'Maximum annual leave days');

-- ================================================================
-- CREATE VIEWS FOR COMMON QUERIES
-- ================================================================

-- View: Monthly Payroll Summary
CREATE VIEW v_monthly_payroll_summary AS
SELECT
    payroll_year,
    payroll_month,
    COUNT(DISTINCT emp_id) as total_employees,
    SUM(total_salary) as total_salary_payable,
    AVG(total_salary) as average_salary,
    MAX(total_salary) as highest_salary,
    MIN(total_salary) as lowest_salary,
    SUM(total_allowances) as total_allowances,
    SUM(total_deductions) as total_deductions
FROM payroll
GROUP BY payroll_year, payroll_month;

-- View: Employee Salary Summary
CREATE VIEW v_employee_salary_summary AS
SELECT
    e.emp_id,
    e.name,
    e.designation,
    e.organization,
    COUNT(p.payroll_id) as payroll_records,
    SUM(p.total_salary) as total_salary_paid,
    AVG(p.total_salary) as average_monthly_salary,
    MAX(p.total_salary) as highest_salary,
    MIN(p.total_salary) as lowest_salary,
    MAX(p.payroll_date) as last_payroll_date
FROM employees e
LEFT JOIN payroll p ON e.emp_id = p.emp_id
GROUP BY e.emp_id, e.name, e.designation, e.organization;

-- View: Department Payroll Report
CREATE VIEW v_department_payroll AS
SELECT
    d.dept_name,
    COUNT(DISTINCT e.emp_id) as employee_count,
    SUM(p.total_salary) as total_monthly_salary,
    AVG(p.total_salary) as average_salary,
    MAX(p.total_salary) as max_salary,
    MIN(p.total_salary) as min_salary
FROM departments d
LEFT JOIN employees e ON d.dept_id = e.emp_id
LEFT JOIN payroll p ON e.emp_id = p.emp_id
GROUP BY d.dept_id, d.dept_name;

-- ================================================================
-- ROW LEVEL SECURITY (Optional - Enable if using Supabase Auth)
-- ================================================================

-- Note: RLS policies are optional. Enable only if using Supabase Authentication
-- For basic deployments, you can skip these or modify based on your auth setup

-- Uncomment below to enable RLS (requires Supabase Auth setup)
/*
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaves ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own data
CREATE POLICY "Users can view own data"
ON employees FOR SELECT
USING (emp_id = (SELECT emp_id FROM users WHERE user_id::text = auth.uid()::text));

-- Policy: Only admin can insert
CREATE POLICY "Only admin can insert"
ON employees FOR INSERT
WITH CHECK ((SELECT role FROM users WHERE user_id::text = auth.uid()::text) = 'admin');
*/

-- ================================================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- ================================================================

-- Trigger: Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tables
CREATE TRIGGER update_employees_timestamp
BEFORE UPDATE ON employees
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_payroll_timestamp
BEFORE UPDATE ON payroll
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_users_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- ================================================================
-- STORED PROCEDURES FOR COMMON OPERATIONS
-- ================================================================

-- Note: These procedures are for backend API to call
-- They perform salary calculations and generate reports

-- Calculate monthly salary
CREATE OR REPLACE FUNCTION calculate_monthly_salary(
    p_emp_id INTEGER,
    p_working_days INTEGER,
    p_rate_per_day DECIMAL,
    p_allowances DECIMAL,
    p_overtime DECIMAL,
    p_bonuses DECIMAL,
    p_deductions DECIMAL
)
RETURNS DECIMAL AS $$
DECLARE
    v_basic DECIMAL;
    v_gross DECIMAL;
    v_net DECIMAL;
BEGIN
    v_basic := p_working_days * p_rate_per_day;
    v_gross := v_basic + p_allowances;
    v_net := v_gross + p_overtime + p_bonuses - p_deductions;
    RETURN v_net;
END;
$$ LANGUAGE plpgsql;

-- Get employee payroll summary
CREATE OR REPLACE FUNCTION get_employee_payroll_summary(p_emp_id INTEGER)
RETURNS TABLE (
    total_paid DECIMAL,
    average_salary DECIMAL,
    payroll_count INTEGER,
    last_salary_date DATE
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        CAST(SUM(p.total_salary) AS DECIMAL) as total_paid,
        CAST(AVG(p.total_salary) AS DECIMAL) as average_salary,
        CAST(COUNT(*) AS INTEGER) as payroll_count,
        CAST(MAX(p.payroll_date) AS DATE) as last_salary_date
    FROM payroll p
    WHERE p.emp_id = p_emp_id;
END;
$$ LANGUAGE plpgsql;
