import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', is_active: true });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/categories');
      setCategories(res.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure? This may affect linked products.')) {
      try {
        await axios.delete(`http://localhost:5001/api/categories/${id}`);
        fetchCategories();
      } catch (error) {
        alert('Failed to delete category');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:5001/api/categories/${editingId}`, formData);
      } else {
        await axios.post('http://localhost:5001/api/categories', formData);
      }
      setShowModal(false);
      setFormData({ name: '', is_active: true });
      setEditingId(null);
      fetchCategories();
    } catch (error) {
      alert('Failed to save category');
    }
  };

  const openEditModal = (category) => {
    setFormData({ name: category.name, is_active: category.is_active });
    setEditingId(category.id);
    setShowModal(true);
  };

  return (
    <div>
      <div className="header-actions">
        <div>
          <h1 className="page-title">Categories</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage store groupings.</p>
        </div>
        <button className="btn" style={{ width: 'auto' }} onClick={() => {
          setEditingId(null);
          setFormData({ name: '', is_active: true });
          setShowModal(true);
        }}>
          <Plus size={20} /> Add Category
        </button>
      </div>

      <div className="data-table-container" style={{ maxWidth: '800px' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id}>
                <td>{cat.id}</td>
                <td>{cat.name}</td>
                <td>{cat.is_active ? 'Active' : 'Inactive'}</td>
                <td>
                  <button className="action-btn" onClick={() => openEditModal(cat)}>
                    <Edit2 size={18} />
                  </button>
                  <button className="action-btn delete" onClick={() => handleDelete(cat.id)}>
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={() => setShowModal(false)}><X size={24} /></button>
            <h2 style={{ marginBottom: '1.5rem' }}>{editingId ? 'Edit Category' : 'Add Category'}</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Category Name</label>
                <input 
                  type="text" className="form-input" required 
                  value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input 
                  type="checkbox" 
                  checked={formData.is_active} 
                  onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                />
                <label className="form-label" style={{ margin: 0 }}>Active</label>
              </div>

              <button type="submit" className="btn" style={{ marginTop: '1rem' }}>
                {editingId ? 'Update' : 'Create'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
