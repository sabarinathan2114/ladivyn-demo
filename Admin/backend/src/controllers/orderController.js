import pool from "../config/db.js";
import { sendOrderMailInternal } from "./mailController.js";

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
export const getOrders = async (req, res) => {
  try {
    const [orders] = await pool.query(`
      SELECT 
        o.*, 
        u.name as user_name, u.email as user_email,
        oa.customer_name, oa.email as customer_email, oa.mobile as customer_mobile, 
        oa.address as customer_address
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      LEFT JOIN order_addresses oa ON o.id = oa.order_id
      ORDER BY o.created_at DESC
    `);
    res.json(orders);
  } catch (error) {
    console.error("Get Orders Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Place a new order (multi-table transaction)
// @route   POST /api/orders
// @access  Private
export const placeOrder = async (req, res) => {
  const {
    total_amount,
    items, // Array of {product_id, quantity, price}
    address_details, // {customer_name, address, mobile, email, state, district, city, pincode}
  } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: "No items in order" });
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // 1. Generate Order Number
    const order_no = `LDV-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;

    // 2. Insert into orders table
    // Cast amounts to numbers to avoid SQL type mismatch
    const finalAmount = parseFloat(total_amount) || 0;
    const userId = req.user ? req.user.id : null;

    if (!userId) {
      throw new Error("User ID is missing. Authentication failed.");
    }

    const [orderResult] = await connection.query(
      `INSERT INTO orders (order_no, user_id, total_amount, discount_amount, final_amount, status, payment_status) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [order_no, userId, finalAmount, 0, finalAmount, "Pending", "Unpaid"],
    );

    const order_id = orderResult.insertId;

    // 3. Insert into order_addresses table
    await connection.query(
      `INSERT INTO order_addresses (order_id, customer_name, address, mobile, email, state, district, city, pincode) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        order_id,
        address_details.customer_name,
        address_details.address,
        address_details.mobile,
        address_details.email,
        address_details.state,
        address_details.district,
        address_details.city,
        address_details.pincode,
      ],
    );

    // 4. Insert into order_items table
    const itemValues = items.map((item) => [
      order_id,
      item.product_id,
      parseInt(item.quantity) || 1,
      parseFloat(String(item.price).replace(/[^\d.]/g, "")) || 0,
    ]);

    // Ensure all product_ids are valid
    if (itemValues.some((row) => !row[1])) {
      throw new Error("One or more items are missing a valid Product ID.");
    }

    await connection.query(
      `INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ?`,
      [itemValues],
    );

    // Fetch product names for the email summary BEFORE commit (or after, but while connection is active)
    const [itemDetails] = await connection.query(
      `SELECT oi.quantity, oi.price, p.name as product_name 
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = ?`,
      [order_id]
    );

    await connection.commit();

    // Trigger Email Notification (Internal Call)
    try {
      await sendOrderMailInternal({
        customer_name: address_details.customer_name,
        email: address_details.email, // Customer email
        mobile: address_details.mobile,
        address: `${address_details.address}, ${address_details.city}, ${address_details.district}, ${address_details.state} - ${address_details.pincode}`,
        items: itemDetails.map(item => ({
          product_name: item.product_name,
          quantity: item.quantity,
          price: "₹" + parseFloat(item.price).toLocaleString("en-IN")
        })),
        total_amount: "₹" + parseFloat(total_amount).toLocaleString("en-IN")
      });
      console.log(`Order emails successfully triggered for ${order_no}`);
    } catch (mailErr) {
      console.error('Email dispatch failed:', mailErr.message);
    }

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order_id,
      order_no,
    });
  } catch (error) {
    await connection.rollback();
    console.error("Place Order Error:", error);
    // Returning specific error message to help the browser alert what matches
    res.status(500).json({
      message: "Failed to place order. Database transaction failed.",
      error: error.message,
    });
  } finally {
    connection.release();
  }
};

// @desc    Get order by ID with details and payments
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
  try {
    const [orders] = await pool.query(
      `SELECT o.*, u.name as user_name, u.email as user_email 
       FROM orders o
       LEFT JOIN users u ON o.user_id = u.id
       WHERE o.id = ?`,
      [req.params.id],
    );

    if (orders.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    const [orderItems] = await pool.query(
      `SELECT oi.*, p.name as product_name 
       FROM order_items oi
       LEFT JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = ?`,
      [req.params.id],
    );

    const [orderAddresses] = await pool.query(
      `SELECT * FROM order_addresses WHERE order_id = ?`,
      [req.params.id],
    );

    const [payments] = await pool.query(
      `SELECT * FROM payments WHERE order_id = ?`,
      [req.params.id],
    );

    const orderData = {
      ...orders[0],
      items: orderItems,
      address: orderAddresses.length > 0 ? orderAddresses[0] : null,
      payments,
    };

    res.json(orderData);
  } catch (error) {
    console.error("Get Order Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
  const { status, payment_status } = req.body;

  try {
    const updates = [];
    const values = [];

    if (status) {
      updates.push("status = ?");
      values.push(status);
    }

    if (payment_status) {
      updates.push("payment_status = ?");
      values.push(payment_status);
    }

    if (updates.length === 0) {
      return res
        .status(400)
        .json({ message: "No status fields provided for update" });
    }

    values.push(req.params.id);

    const [result] = await pool.query(
      `UPDATE orders SET ${updates.join(", ")} WHERE id = ?`,
      values,
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Order status updated successfully" });
  } catch (error) {
    console.error("Update Order Status Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Add payment intent/record for order
// @route   POST /api/orders/:id/payments
// @access  Private
export const addPaymentRecord = async (req, res) => {
  const { payment_method, transaction_id, amount, status } = req.body;

  try {
    await pool.query(
      "INSERT INTO payments (order_id, payment_method, transaction_id, amount, status) VALUES (?, ?, ?, ?, ?)",
      [req.params.id, payment_method, transaction_id, amount, status],
    );

    res.status(201).json({ message: "Payment record appended successfully" });
  } catch (error) {
    console.error("Add Payment Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
