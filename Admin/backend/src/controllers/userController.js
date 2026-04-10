import pool from '../config/db.js';

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = async (req, res) => {
  try {
    const [users] = await pool.query(
      'SELECT id, name, email, mobile, role, is_active, created_at FROM users'
    );
    res.json(users);
  } catch (error) {
    console.error('Get Users Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user by ID with their addresses
// @route   GET /api/users/:id
// @access  Private/Admin
export const getUserById = async (req, res) => {
  try {
    const [users] = await pool.query(
      'SELECT id, name, email, mobile, role, is_active, created_at FROM users WHERE id = ?',
      [req.params.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const [addresses] = await pool.query(
      'SELECT * FROM user_addresses WHERE user_id = ?',
      [req.params.id]
    );

    const user = {
      ...users[0],
      addresses
    };

    res.json(user);
  } catch (error) {
    console.error('Get User Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
export const updateUser = async (req, res) => {
  const { name, email, mobile, role, is_active } = req.body;

  try {
    const [existingUsers] = await pool.query('SELECT * FROM users WHERE email = ? AND id != ?', [email, req.params.id]);
    
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'Email already exists for another user' });
    }

    const [result] = await pool.query(
      'UPDATE users SET name = ?, email = ?, mobile = ?, role = ?, is_active = ? WHERE id = ?',
      [name, email, mobile, role, is_active, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Update User Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User removed successfully' });
  } catch (error) {
    console.error('Delete User Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add address for user
// @route   POST /api/users/:id/addresses
// @access  Private
export const addUserAddress = async (req, res) => {
  const { address, state_id, district_id, city_id, pincode_id } = req.body;

  try {
    const [result] = await pool.query(
      'INSERT INTO user_addresses (user_id, address, state_id, district_id, city_id, pincode_id) VALUES (?, ?, ?, ?, ?, ?)',
      [req.params.id, address, state_id, district_id, city_id, pincode_id]
    );

    res.status(201).json({ id: result.insertId, message: 'Address appended successfully' });
  } catch (error) {
    console.error('Add Address Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
