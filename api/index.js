require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Supabase Client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// ================================================================
// AUTHENTICATION ROUTES
// ================================================================

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    // Default credentials (for demo/testing)
    const DEFAULT_ADMIN_USERNAME = 'admin';
    const DEFAULT_ADMIN_PASSWORD = 'admin123';
    const DEFAULT_EMPLOYEE_USERNAME = 'emp1';
    const DEFAULT_EMPLOYEE_PASSWORD = 'Employee@2025';

    // Check against admin default credentials first
    if (username === DEFAULT_ADMIN_USERNAME && password === DEFAULT_ADMIN_PASSWORD) {
      const token = jwt.sign(
        { user_id: 1, role: 'admin', emp_id: null, username: DEFAULT_ADMIN_USERNAME },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      return res.json({
        token,
        user: {
          user_id: 1,
          username: DEFAULT_ADMIN_USERNAME,
          role: 'admin',
          emp_id: null
        }
      });
    }

    // Check against employee default credentials
    if (username === DEFAULT_EMPLOYEE_USERNAME && password === DEFAULT_EMPLOYEE_PASSWORD) {
      const token = jwt.sign(
        { user_id: 2, role: 'employee', emp_id: 1, username: DEFAULT_EMPLOYEE_USERNAME },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      return res.json({
        token,
        user: {
          user_id: 2,
          username: DEFAULT_EMPLOYEE_USERNAME,
          role: 'employee',
          emp_id: 1
        }
      });
    }

    // Try Supabase if available
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { user_id: user.user_id, role: user.role, emp_id: user.emp_id, username: user.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Update last login
    await supabase
      .from('users')
      .update({ last_login: new Date() })
      .eq('user_id', user.user_id);

    res.json({
      token,
      user: {
        user_id: user.user_id,
        username: user.username,
        role: user.role,
        emp_id: user.emp_id
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Register (Public - anyone can sign up)
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;

    // Validate input
    if (!username || !password || !email) {
      return res.status(400).json({ error: 'Username, password, and email are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // First, create an employee record
    const { data: empData, error: empError } = await supabase
      .from('employees')
      .insert({
        name: username,
        email: email,
        designation: 'Employee',
        department: 'General',
        salary: 0
      })
      .select();

    if (empError) {
      console.error('Employee creation error:', empError);
      return res.status(400).json({ error: 'Failed to create employee record' });
    }

    const emp_id = empData[0].emp_id;

    // Now create the user with the emp_id
    const { data, error } = await supabase
      .from('users')
      .insert({
        username,
        password_hash: hashedPassword,
        email,
        role: 'employee',
        emp_id: emp_id
      })
      .select();

    if (error) {
      // If user creation fails, delete the employee record we just created
      await supabase.from('employees').delete().eq('emp_id', emp_id);
      
      // Handle common Supabase errors
      if (error.message.includes('duplicate')) {
        return res.status(400).json({ error: 'Username or email already exists' });
      }
      return res.status(400).json({ error: error.message || 'Registration failed' });
    }

    res.status(201).json({
      message: 'Account created successfully. Please log in.',
      user: {
        user_id: data[0].user_id,
        username: data[0].username,
        email: data[0].email,
        role: data[0].role,
        emp_id: data[0].emp_id
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: error.message || 'Registration failed' });
  }
});

// ================================================================
// EMPLOYEE ROUTES
// ================================================================

// Get all employees
app.get('/api/employees', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .order('emp_id');

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single employee
app.get('/api/employees/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .eq('emp_id', req.params.id)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add employee
app.post('/api/employees', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { name, age, organization, designation, email, contact, department, salary, join_date, employment_type, qualification } = req.body;

    const { data, error } = await supabase
      .from('employees')
      .insert({
        name,
        age: age ? parseInt(age) : null,
        organization,
        designation,
        email,
        contact,
        department,
        salary: salary ? parseFloat(salary) : null,
        join_date: join_date || null,
        employment_type,
        qualification
      })
      .select();

    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update employee
app.put('/api/employees/:id', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { name, age, organization, designation, email, contact, department, salary, join_date, employment_type, qualification } = req.body;
    
    const updateData = {
      name: name || null,
      age: age ? parseInt(age) : null,
      organization: organization || null,
      designation: designation || null,
      email: email || null,
      contact: contact || null,
      department: department || null,
      salary: salary ? parseFloat(salary) : null,
      join_date: join_date || null,
      employment_type: employment_type || null,
      qualification: qualification || null,
    };

    const { data, error } = await supabase
      .from('employees')
      .update(updateData)
      .eq('emp_id', req.params.id)
      .select();

    if (error) throw error;
    res.json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete employee
app.delete('/api/employees/:id', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { error } = await supabase
      .from('employees')
      .delete()
      .eq('emp_id', req.params.id);

    if (error) throw error;
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ================================================================
// PAYROLL ROUTES
// ================================================================

// Get payroll records
app.get('/api/payroll', async (req, res) => {
  try {
    const { emp_id, year, month } = req.query;
    let query = supabase.from('payroll').select('*');

    if (emp_id) query = query.eq('emp_id', emp_id);
    if (year) query = query.eq('payroll_year', year);
    if (month) query = query.eq('payroll_month', month);

    const { data, error } = await query.order('payroll_date', { ascending: false });
    if (error) throw error;

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add payroll record
app.post('/api/payroll', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const {
      emp_id,
      working_days,
      rate_per_day,
      total_allowances,
      overtime_bonus,
      total_bonus,
      total_deductions
    } = req.body;

    // Calculate salaries
    const basic_salary = working_days * rate_per_day;
    const gross_salary = basic_salary + total_allowances;
    const net_salary = gross_salary + overtime_bonus + total_bonus - total_deductions;
    const total_salary = net_salary;

    const { data, error } = await supabase
      .from('payroll')
      .insert({
        emp_id,
        working_days,
        rate_per_day,
        basic_salary,
        total_allowances,
        overtime_bonus,
        total_bonus,
        total_deductions,
        gross_salary,
        net_salary,
        total_salary,
        payroll_date: new Date(),
        payroll_month: new Date().getMonth() + 1,
        payroll_year: new Date().getFullYear(),
        status: 'draft'
      })
      .select();

    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update payroll record
app.put('/api/payroll/:id', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { id } = req.params;
    const updateData = req.body;

    const { data, error } = await supabase
      .from('payroll')
      .update(updateData)
      .eq('payroll_id', id)
      .select();

    if (error) throw error;
    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Payroll record not found' });
    }

    res.json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete payroll record
app.delete('/api/payroll/:id', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { id } = req.params;

    const { error } = await supabase
      .from('payroll')
      .delete()
      .eq('payroll_id', id);

    if (error) throw error;

    res.json({ message: 'Payroll record deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get payroll summary
app.get('/api/payroll/summary', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('v_monthly_payroll_summary')
      .select('*')
      .order('payroll_year', { ascending: false })
      .order('payroll_month', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ================================================================
// HEALTH CHECK
// ================================================================

app.get('/api/health', (req, res) => {
  res.json({ status: 'API is running' });
});

// ================================================================
// ERROR HANDLING
// ================================================================
// ROOT AND HEALTH CHECK
// ================================================================

app.get('/', (req, res) => {
  res.json({ message: 'Payroll System API', status: 'ok' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// ================================================================
// ERROR HANDLER
// ================================================================

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// ================================================================
// START SERVER (for local development)
// ================================================================

const PORT = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
