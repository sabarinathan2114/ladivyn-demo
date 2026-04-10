import pool from '../config/db.js';
import xlsx from 'xlsx';

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const [products] = await pool.query(`
      SELECT p.*, c.name as category_name, s.name as subcategory_name,
             (SELECT image_url FROM product_images WHERE product_id = p.id ORDER BY is_primary DESC, id ASC LIMIT 1) as primary_image
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN subcategories s ON p.subcategory_id = s.id
      ORDER BY p.created_at DESC
    `);
    res.json(products);
  } catch (error) {
    console.error('Get Products Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single product with details and images
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const [products] = await pool.query(
      `SELECT p.*, c.name as category_name 
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       WHERE p.id = ?`,
      [req.params.id]
    );

    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const [images] = await pool.query(
      'SELECT * FROM product_images WHERE product_id = ?',
      [req.params.id]
    );

    const productData = {
      ...products[0],
      images
    };

    res.json(productData);
  } catch (error) {
    console.error('Get Product Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
  const {
    name, category_id, subcategory_id, cost_price, display_price,
    has_discount, discount_percent, discount_amount, short_description,
    description, quantity, is_out_of_stock, barcode
  } = req.body;

  try {
    const [result] = await pool.query(
      `INSERT INTO products (
        name, category_id, subcategory_id, cost_price, display_price, 
        has_discount, discount_percent, discount_amount, short_description, 
        description, quantity, is_out_of_stock, barcode
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name, category_id || null, subcategory_id || null, cost_price || 0, display_price || 0,
        has_discount || false, discount_percent || 0, discount_amount || 0, short_description || '',
        description || '', quantity || 0, is_out_of_stock || false, barcode || null
      ]
    );

    res.status(201).json({ id: result.insertId, message: 'Product created successfully' });
  } catch (error) {
    console.error('Create Product Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  const {
    name, category_id, subcategory_id, cost_price, display_price,
    has_discount, discount_percent, discount_amount, short_description,
    description, quantity, is_out_of_stock, barcode
  } = req.body;

  try {
    const [result] = await pool.query(
      `UPDATE products SET 
        name = ?, category_id = ?, subcategory_id = ?, cost_price = ?, display_price = ?, 
        has_discount = ?, discount_percent = ?, discount_amount = ?, short_description = ?, 
        description = ?, quantity = ?, is_out_of_stock = ?, barcode = ?
       WHERE id = ?`,
      [
        name, category_id || null, subcategory_id || null, cost_price, display_price,
        has_discount, discount_percent, discount_amount, short_description,
        description, quantity, is_out_of_stock, barcode, req.params.id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error('Update Product Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM products WHERE id = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product removed successfully' });
  } catch (error) {
    console.error('Delete Product Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add a product image link
// @route   POST /api/products/:id/images
// @access  Private/Admin
export const addProductImage = async (req, res) => {
  const { image_url, is_primary } = req.body;

  try {
    await pool.query(
      'INSERT INTO product_images (product_id, image_url, is_primary) VALUES (?, ?, ?)',
      [req.params.id, image_url, is_primary || false]
    );

    res.status(201).json({ message: 'Product image appended successfully' });
  } catch (error) {
    console.error('Add Image Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a product image
// @route   DELETE /api/products/:id/images/:imageId
// @access  Private/Admin
export const deleteProductImage = async (req, res) => {
  try {
    const [result] = await pool.query(
      'DELETE FROM product_images WHERE id = ? AND product_id = ?',
      [req.params.imageId, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Image not found' });
    }

    res.json({ message: 'Image removed successfully' });
  } catch (error) {
    console.error('Delete Image Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Bulk upload products from Excel/CSV
// @route   POST /api/products/bulk-upload
// @access  Private/Admin
export const bulkUploadProducts = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    if (data.length === 0) {
      await connection.rollback();
      return res.status(400).json({ message: 'The uploaded file is empty' });
    }

    // 1. Fetch Categories and Subcategories for mapping
    const [categories] = await connection.query('SELECT id, name FROM categories');
    const [subcategories] = await connection.query('SELECT id, name, category_id FROM subcategories');

    const categoryMap = categories.reduce((acc, cat) => {
      acc[cat.name.toLowerCase()] = cat.id;
      return acc;
    }, {});

    const subcategoryMap = subcategories.reduce((acc, sub) => {
      acc[`${sub.category_id}_${sub.name.toLowerCase()}`] = sub.id;
      return acc;
    }, {});

    let successCount = 0;
    let errorLog = [];

    for (let i = 0; i < data.length; i++) {
        const row = data[i];
        const {
            Name, Category, SubCategory, CostPrice, DisplayPrice,
            HasDiscount, DiscountPercent, DiscountAmount, ShortDescription,
            Description, Quantity, IsOutOfStock, Barcode
        } = row;

        if (!Name || DisplayPrice === undefined) {
            errorLog.push({ row: i + 2, error: 'Missing required fields (Name or DisplayPrice)' });
            continue;
        }

        const category_id = Category ? categoryMap[Category.toString().toLowerCase()] : null;
        let subcategory_id = null;
        if (category_id && SubCategory) {
            subcategory_id = subcategoryMap[`${category_id}_${SubCategory.toString().toLowerCase()}`] || null;
        }

        try {
            await connection.query(
                `INSERT INTO products (
                    name, category_id, subcategory_id, cost_price, display_price, 
                    has_discount, discount_percent, discount_amount, short_description, 
                    description, quantity, is_out_of_stock, barcode
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    Name, category_id, subcategory_id, CostPrice || 0, DisplayPrice,
                    !!HasDiscount, DiscountPercent || 0, DiscountAmount || 0, ShortDescription || '',
                    Description || '', Quantity || 0, !!IsOutOfStock, Barcode || null
                ]
            );
            successCount++;
        } catch (err) {
            errorLog.push({ row: i + 2, error: err.message });
        }
    }

    await connection.commit();
    res.json({
        message: 'Bulk upload completed',
        summary: {
            total: data.length,
            success: successCount,
            failed: errorLog.length
        },
        errors: errorLog
    });

  } catch (error) {
    await connection.rollback();
    console.error('Bulk Upload Error:', error);
    res.status(500).json({ message: 'Server error during bulk upload' });
  } finally {
    connection.release();
  }
};
