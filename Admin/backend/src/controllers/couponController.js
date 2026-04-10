import pool from '../config/db.js';

// @desc    Get all coupons
// @route   GET /api/coupons
// @access  Public
export const getCoupons = async (req, res) => {
  try {
    const [coupons] = await pool.query('SELECT * FROM coupons ORDER BY id DESC');
    res.json(coupons);
  } catch (error) {
    console.error('Get Coupons Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Validate a coupon by code
// @route   GET /api/coupons/validate/:code
// @access  Public
export const validateCoupon = async (req, res) => {
  try {
    const [coupons] = await pool.query(
      'SELECT * FROM coupons WHERE code = ? AND is_active = TRUE',
      [req.params.code]
    );

    if (coupons.length === 0) {
      return res.status(404).json({ valid: false, message: 'Invalid or inactive coupon' });
    }

    const coupon = coupons[0];

    // Check expiry
    if (coupon.expiry_date && new Date(coupon.expiry_date) < new Date()) {
      return res.status(400).json({ valid: false, message: 'Coupon has expired' });
    }

    res.json({ valid: true, coupon });
  } catch (error) {
    console.error('Validate Coupon Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a coupon
// @route   POST /api/coupons
// @access  Private/Admin
export const createCoupon = async (req, res) => {
  const { code, discount_percent, discount_amount, min_order_value, expiry_date, is_active } = req.body;

  try {
    const [result] = await pool.query(
      `INSERT INTO coupons (code, discount_percent, discount_amount, min_order_value, expiry_date, is_active) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [code, discount_percent || null, discount_amount || null, min_order_value || 0, expiry_date || null, is_active !== undefined ? is_active : true]
    );

    res.status(201).json({ id: result.insertId, message: 'Coupon created successfully' });
  } catch (error) {
    console.error('Create Coupon Error:', error);
    // 1062 is Duplicate Entry for MySQL
    if (error.errno === 1062) return res.status(400).json({ message: 'Coupon code already exists' });
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a coupon
// @route   PUT /api/coupons/:id
// @access  Private/Admin
export const updateCoupon = async (req, res) => {
  const { code, discount_percent, discount_amount, min_order_value, expiry_date, is_active } = req.body;

  try {
    const [result] = await pool.query(
      `UPDATE coupons SET code = ?, discount_percent = ?, discount_amount = ?, min_order_value = ?, expiry_date = ?, is_active = ? WHERE id = ?`,
      [code, discount_percent || null, discount_amount || null, min_order_value || 0, expiry_date || null, is_active, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Coupon not found' });
    }

    res.json({ message: 'Coupon updated successfully' });
  } catch (error) {
    console.error('Update Coupon Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a coupon
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
export const deleteCoupon = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM coupons WHERE id = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Coupon not found' });
    }

    res.json({ message: 'Coupon removed successfully' });
  } catch (error) {
    console.error('Delete Coupon Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
