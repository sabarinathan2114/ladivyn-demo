import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

const MastersSubCategory = () => {
  const [subcategories, setSubcategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', category_id: '', is_active: true });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchSubcategories();
    fetchCategories();
  }, []);

  const fetchSubcategories = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/categories/subcategories');
      setSubcategories(res.data);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/categories');
      setCategories(res.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this subcategory?')) {
      try {
        await axios.delete(`http://localhost:5000/api/categories/subcategories/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
        });
        fetchSubcategories();
      } catch (error) {
        alert('Failed to delete subcategory');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/categories/subcategories/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
        });
      } else {
        await axios.post(`http://localhost:5000/api/categories/${formData.category_id}/subcategories`, formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
        });
      }
      setShowModal(false);
      setFormData({ name: '', category_id: '', is_active: true });
      setEditingId(null);
      fetchSubcategories();
    } catch (error) {
      alert('Failed to save subcategory');
    }
  };

  const openEditModal = (sub) => {
    setFormData({ name: sub.name, category_id: sub.category_id, is_active: sub.is_active });
    setEditingId(sub.id);
    setShowModal(true);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="header-actions">
        <div>
          <h1 className="page-title">Sub Category Master</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage deeper product groupings.</p>
        </div>
        <button className="btn" style={{ width: 'auto' }} onClick={() => {
          setEditingId(null);
          setFormData({ name: '', category_id: '', is_active: true });
          setShowModal(true);
        }}>
          <Plus size={20} /> Add Sub Category
        </button>
      </div>

      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Parent Category</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {subcategories.map((sub) => (
              <tr key={sub.id}>
                <td>{sub.id}</td>
                <td>{sub.name}</td>
                <td style={{ color: 'var(--accent-primary)', fontWeight: 500 }}>{sub.category_name}</td>
                <td>{sub.is_active ? 'Active' : 'Inactive'}</td>
                <td>
                  <button className="action-btn" onClick={() => openEditModal(sub)}>
                    <Edit2 size={18} />
                  </button>
                  <button className="action-btn delete" onClick={() => handleDelete(sub.id)}>
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
            <h2 style={{ marginBottom: '1.5rem' }}>{editingId ? 'Edit Sub Category' : 'Add Sub Category'}</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Parent Category</label>
                <select 
                  className="form-input" required
                  value={formData.category_id} onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                >
                  <option value="">Select Category</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Sub Category Name</label>
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

export default MastersSubCategory;
