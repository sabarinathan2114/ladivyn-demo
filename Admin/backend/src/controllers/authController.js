import pool from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

export const registerUser = async (req, res) => {
  const { name, email, password, mobile, role } = req.body;

  try {
    const [existingUsers] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userRole = role || 'customer';

    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, mobile, role) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, mobile, userRole]
    );

    const userId = result.insertId;

    res.status(201).json({
      id: userId,
      name,
      email,
      role: userRole,
      token: generateToken(userId, userRole),
    });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    
    const user = users[0];

    if (user && (await bcrypt.compare(password, user.password))) {
      if (!user.is_active) {
        return res.status(403).json({ message: 'Account is deactivated.' });
      }

      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user.id, user.role),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getMe = async (req, res) => {
  try {
    const [users] = await pool.query(
      'SELECT id, name, email, mobile, role, is_active FROM users WHERE id = ?', 
      [req.user.id]
    );

    if (users.length > 0) {
      res.json(users[0]);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Get Me Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
