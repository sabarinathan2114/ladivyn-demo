import pool from '../config/db.js';

// @desc    Get all blogs
// @route   GET /api/blogs
// @access  Public
export const getBlogs = async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM blogs ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single blog
// @route   GET /api/blogs/:id
// @access  Public
export const getBlogById = async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM blogs WHERE id = ?', [req.params.id]);
    
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ message: 'Blog not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a blog
// @route   POST /api/blogs
// @access  Private/Admin
export const createBlog = async (req, res) => {
  const { title, short_description, content, image_url, author } = req.body;

  try {
    const [result] = await pool.execute(
      'INSERT INTO blogs (title, short_description, content, image_url, author) VALUES (?, ?, ?, ?, ?)',
      [title, short_description, JSON.stringify(content), image_url, author]
    );

    const [newBlog] = await pool.execute('SELECT * FROM blogs WHERE id = ?', [result.insertId]);
    res.status(201).json(newBlog[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a blog
// @route   PUT /api/blogs/:id
// @access  Private/Admin
export const updateBlog = async (req, res) => {
  const { title, short_description, content, image_url, author } = req.body;

  try {
    const [blog] = await pool.execute('SELECT * FROM blogs WHERE id = ?', [req.params.id]);

    if (blog.length > 0) {
      await pool.execute(
        'UPDATE blogs SET title = ?, short_description = ?, content = ?, image_url = ?, author = ? WHERE id = ?',
        [title, short_description, JSON.stringify(content), image_url, author, req.params.id]
      );

      const [updatedBlog] = await pool.execute('SELECT * FROM blogs WHERE id = ?', [req.params.id]);
      res.json(updatedBlog[0]);
    } else {
      res.status(404).json({ message: 'Blog not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a blog
// @route   DELETE /api/blogs/:id
// @access  Private/Admin
export const deleteBlog = async (req, res) => {
  try {
    const [blog] = await pool.execute('SELECT * FROM blogs WHERE id = ?', [req.params.id]);

    if (blog.length > 0) {
      await pool.execute('DELETE FROM blogs WHERE id = ?', [req.params.id]);
      res.json({ message: 'Blog removed' });
    } else {
      res.status(404).json({ message: 'Blog not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
