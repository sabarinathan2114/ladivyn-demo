import pool from '../config/db.js';

// ==========================================
// CATEGORIES
// ==========================================

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getCategories = async (req, res) => {
  try {
    const [categories] = await pool.query('SELECT * FROM categories ORDER BY name ASC');
    res.json(categories);
  } catch (error) {
    console.error('Get Categories Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a category
// @route   POST /api/categories
// @access  Private/Admin
export const createCategory = async (req, res) => {
  const { name, is_active } = req.body;

  try {
    const [result] = await pool.query(
      'INSERT INTO categories (name, is_active) VALUES (?, ?)',
      [name, is_active !== undefined ? is_active : true]
    );

    res.status(201).json({ id: result.insertId, message: 'Category created' });
  } catch (error) {
    console.error('Create Category Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private/Admin
export const updateCategory = async (req, res) => {
  const { name, is_active } = req.body;

  try {
    const [result] = await pool.query(
      'UPDATE categories SET name = ?, is_active = ? WHERE id = ?',
      [name, is_active, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json({ message: 'Category updated' });
  } catch (error) {
    console.error('Update Category Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
export const deleteCategory = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM categories WHERE id = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json({ message: 'Category removed' });
  } catch (error) {
    console.error('Delete Category Error:', error);
    res.status(500).json({ message: 'Server error (Make sure it has no dependent products/subcategories)' });
  }
};

// ==========================================
// SUBCATEGORIES
// ==========================================

// @desc    Get all subcategories (optionally by category_id)
// @route   GET /api/categories/subcategories
// @route   GET /api/categories/:categoryId/subcategories
// @access  Public
export const getSubcategories = async (req, res) => {
  try {
    let query = 'SELECT s.*, c.name as category_name FROM subcategories s LEFT JOIN categories c ON s.category_id = c.id';
    let params = [];

    if (req.params.categoryId) {
      query += ' WHERE s.category_id = ?';
      params.push(req.params.categoryId);
    }

    query += ' ORDER BY s.name ASC';

    const [subcategories] = await pool.query(query, params);
    res.json(subcategories);
  } catch (error) {
    console.error('Get Subcategories Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a subcategory
// @route   POST /api/categories/:categoryId/subcategories
// @access  Private/Admin
export const createSubcategory = async (req, res) => {
  const { name, is_active } = req.body;
  const categoryId = req.params.categoryId;

  try {
    const [result] = await pool.query(
      'INSERT INTO subcategories (category_id, name, is_active) VALUES (?, ?, ?)',
      [categoryId, name, is_active !== undefined ? is_active : true]
    );

    res.status(201).json({ id: result.insertId, message: 'Subcategory created' });
  } catch (error) {
    console.error('Create Subcategory Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
// @desc    Update a subcategory
// @route   PUT /api/categories/subcategories/:id
// @access  Private/Admin
export const updateSubcategory = async (req, res) => {
  const { name, is_active, category_id } = req.body;

  try {
    const [result] = await pool.query(
      'UPDATE subcategories SET name = ?, is_active = ?, category_id = ? WHERE id = ?',
      [name, is_active, category_id, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }

    res.json({ message: 'Subcategory updated' });
  } catch (error) {
    console.error('Update Subcategory Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a subcategory
// @route   DELETE /api/categories/subcategories/:id
// @access  Private/Admin
export const deleteSubcategory = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM subcategories WHERE id = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }

    res.json({ message: 'Subcategory removed' });
  } catch (error) {
    console.error('Delete Subcategory Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
