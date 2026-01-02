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

    // Query user from Supabase
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
      { user_id: user.user_id, role: user.role, emp_id: user.emp_id },
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

// Register (Admin only)
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password, email, role } = req.body;
    const token = req.headers.authorization?.split(' ')[1];

    // Verify admin token
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const { data, error } = await supabase
      .from('users')
      .insert({
        username,
        password_hash: hashedPassword,
        email,
        role: role || 'employee'
      })
      .select();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json({
      message: 'User created successfully',
      user: data[0]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
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

    const { name, age, organization, designation, email, contact } = req.body;

    const { data, error } = await supabase
      .from('employees')
      .insert({
        name,
        age,
        organization,
        designation,
        email,
        contact
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

    const { data, error } = await supabase
      .from('employees')
      .update(req.body)
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

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// ================================================================
// START SERVER
// ================================================================

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
