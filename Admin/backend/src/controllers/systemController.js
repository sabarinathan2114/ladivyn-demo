import pool from '../config/db.js';

// @desc    Get system audit logs
// @route   GET /api/system/audit-logs
// @access  Private/Admin
export const getAuditLogs = async (req, res) => {
  try {
    const [logs] = await pool.query(`
      SELECT a.*, u.name as admin_name 
      FROM audit_logs a
      LEFT JOIN users u ON a.user_id = u.id
      ORDER BY a.created_at DESC
      LIMIT 100
    `);
    res.json(logs);
  } catch (error) {
    console.error('Get Audit Logs Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add an audit log entry
// @route   POST /api/system/audit-logs
// @access  Private/Admin
export const createAuditLog = async (req, res) => {
  const { action, table_name, record_id, old_data, new_data } = req.body;

  try {
    await pool.query(
      `INSERT INTO audit_logs (user_id, action, table_name, record_id, old_data, new_data)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [req.user.id, action, table_name, record_id, JSON.stringify(old_data), JSON.stringify(new_data)]
    );
    res.status(201).json({ message: 'Audit Log created successfully' });
  } catch (error) {
    console.error('Create Audit Log Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get bulk upload logs
// @route   GET /api/system/bulk-upload-logs
// @access  Private/Admin
export const getBulkUploadLogs = async (req, res) => {
  try {
    const [logs] = await pool.query(`
      SELECT b.*, u.name as uploaded_by_name 
      FROM bulk_upload_logs b
      LEFT JOIN users u ON b.uploaded_by = u.id
      ORDER BY b.created_at DESC
      LIMIT 100
    `);
    res.json(logs);
  } catch (error) {
    console.error('Get Bulk Upload Logs Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/system/dashboard-stats
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
  try {
    // 1. Get total revenue (sum of all paid/completed orders)
    const [revenueRes] = await pool.query('SELECT SUM(total_amount) as total FROM orders');
    const totalRevenue = revenueRes[0].total || 0;

    // 2. Get total orders count
    const [orderRes] = await pool.query('SELECT COUNT(*) as count FROM orders');
    const orderCount = orderRes[0].count || 0;

    // 3. Get total customers count (users with role 'user')
    const [userRes] = await pool.query('SELECT COUNT(*) as count FROM users WHERE role = "user"');
    const customerCount = userRes[0].count || 0;

    // 4. Get total products count
    const [productRes] = await pool.query('SELECT COUNT(*) as count FROM products');
    const productCount = productRes[0].count || 0;

    // 5. Get recent activity (last 5 audit logs)
    const [activityRes] = await pool.query(`
      SELECT a.action, a.table_name, a.created_at, u.name as admin_name 
      FROM audit_logs a
      LEFT JOIN users u ON a.user_id = u.id
      ORDER BY a.created_at DESC
      LIMIT 5
    `);

    res.json({
      revenue: totalRevenue,
      orders: orderCount,
      customers: customerCount,
      products: productCount,
      recentActivity: activityRes
    });
  } catch (error) {
    console.error('Get Dashboard Stats Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add a bulk upload log entry
// @route   POST /api/system/bulk-upload-logs
// @access  Private/Admin
export const createBulkUploadLog = async (req, res) => {
  const { file_name, total_records, success_count, failed_count } = req.body;

  try {
    await pool.query(
      `INSERT INTO bulk_upload_logs (file_name, total_records, success_count, failed_count, uploaded_by)
       VALUES (?, ?, ?, ?, ?)`,
      [file_name, total_records, success_count, failed_count, req.user.id]
    );
    res.status(201).json({ message: 'Bulk Upload Log created successfully' });
  } catch (error) {
    console.error('Create Bulk Upload Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
