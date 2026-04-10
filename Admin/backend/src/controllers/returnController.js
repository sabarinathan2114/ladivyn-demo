import pool from '../config/db.js';

// @desc    Get all returns
// @route   GET /api/returns
// @access  Private/Admin
export const getReturns = async (req, res) => {
  try {
    const [returns] = await pool.query(`
      SELECT r.*, o.order_no 
      FROM returns r
      LEFT JOIN orders o ON r.order_id = o.id
      ORDER BY r.created_at DESC
    `);
    res.json(returns);
  } catch (error) {
    console.error('Get Returns Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update return status/refund
// @route   PUT /api/returns/:id
// @access  Private/Admin
export const updateReturn = async (req, res) => {
  const { status, refund_amount } = req.body;

  try {
    const [result] = await pool.query(
      'UPDATE returns SET status = ?, refund_amount = ? WHERE id = ?',
      [status, refund_amount || 0, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Return request not found' });
    }

    res.json({ message: 'Return request updated successfully' });
  } catch (error) {
    console.error('Update Return Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
