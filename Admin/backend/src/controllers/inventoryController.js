import pool from '../config/db.js';

// @desc    Get all inventory logs
// @route   GET /api/inventory
// @access  Private/Admin
export const getInventoryLogs = async (req, res) => {
  try {
    const [logs] = await pool.query(`
      SELECT il.*, p.name as product_name
      FROM inventory_logs il
      LEFT JOIN products p ON il.product_id = p.id
      ORDER BY il.created_at DESC
    `);
    res.json(logs);
  } catch (error) {
    console.error('Get Inventory Logs Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add manual inventory log and update product quantity
// @route   POST /api/inventory
// @access  Private/Admin
export const addInventoryLog = async (req, res) => {
  const { product_id, change_qty, action, reference_id } = req.body;

  try {
    // Start transaction to assure data consistency
    await pool.query('START TRANSACTION');

    // 1. Insert Log
    await pool.query(
      'INSERT INTO inventory_logs (product_id, change_qty, action, reference_id) VALUES (?, ?, ?, ?)',
      [product_id, change_qty, action, reference_id || null]
    );

    // 2. Update Product Quantity
    // If change_qty is negative, it will decrement. If positive, it will increment.
    await pool.query(
      'UPDATE products SET quantity = quantity + ? WHERE id = ?',
      [change_qty, product_id]
    );

    // 3. Keep 'is_out_of_stock' properly synced based on new quantity
    await pool.query(
      'UPDATE products SET is_out_of_stock = (quantity <= 0) WHERE id = ?',
      [product_id]
    );

    await pool.query('COMMIT');
    res.status(201).json({ message: 'Inventory updated successfully' });
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Add Inventory Log Error:', error);
    res.status(500).json({ message: 'Server error during inventory update' });
  }
};
