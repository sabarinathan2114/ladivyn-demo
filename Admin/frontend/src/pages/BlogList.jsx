import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  FileText,
  Calendar,
  User,
  Eye,
} from "lucide-react";

const BlogList = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/blogs");
      setBlogs(res.data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        await axios.delete(`http://localhost:5000/api/blogs/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        });
        fetchBlogs();
      } catch (error) {
        alert("Failed to delete blog");
      }
    }
  };

  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (blog.author && blog.author.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) return <div className="p-8">Loading blogs...</div>;

  return (
    <div className="products-container" style={{ padding: '2rem' }}>
      <div className="header-actions">
        <div>
          <h1
            className="page-title"
            style={{ fontFamily: "serif", letterSpacing: "0.05em", fontSize: '2rem', color: 'var(--text-primary)' }}
          >
            Blog Management
          </h1>
          <p style={{ color: "var(--text-secondary)" }}>
            Share stories, guides, and updates with your audience.
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button
            className="btn"
            style={{
              width: "auto",
              background: "var(--accent-primary)",
              color: "#1a1510",
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer'
            }}
            onClick={() => navigate("/dashboard/blogs/create")}
          >
            <Plus size={20} /> Create Blog
          </button>
        </div>
      </div>

      <div className="search-filter-row" style={{ marginTop: '2rem', marginBottom: '2rem', display: 'flex', gap: '1rem' }}>
        <div className="search-input-wrapper" style={{ flex: 1, position: 'relative' }}>
          <Search size={20} className="search-icon" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search blogs by title or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem 0.75rem 3rem',
              borderRadius: '0.5rem',
              border: '1px solid #e2e8f0',
              outline: 'none'
            }}
          />
        </div>
      </div>

      <div className="data-table-container">
        <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ padding: '1rem' }}>Blog Info</th>
              <th style={{ padding: '1rem' }}>Author</th>
              <th style={{ padding: '1rem' }}>Date</th>
              <th style={{ padding: '1rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBlogs.map((blog) => (
              <tr key={blog.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '1rem' }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <div className="icon-box" style={{ width: '48px', height: '48px', background: '#f8fafc', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyCenter: 'center', overflow: 'hidden' }}>
                      {blog.image_url ? (
                        <img
                          src={blog.image_url.startsWith('http') ? blog.image_url : `http://localhost:5000${blog.image_url}`}
                          alt=""
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      ) : (
                        <FileText size={24} style={{ color: '#94a3b8' }} />
                      )}
                    </div>
                    <div>
                      <p style={{ fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.1rem" }}>
                        {blog.title}
                      </p>
                      <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {blog.short_description}
                      </p>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    <User size={14} />
                    {blog.author || "Admin"}
                  </div>
                </td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    <Calendar size={14} />
                    {new Date(blog.created_at).toLocaleDateString()}
                  </div>
                </td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      className="action-btn"
                      onClick={() => navigate(`/dashboard/blogs/edit/${blog.id}`)}
                      style={{ color: "var(--accent-primary)", background: 'none', border: 'none', cursor: 'pointer' }}
                      title="Edit Blog"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      className="action-btn"
                      onClick={() => handleDelete(blog.id)}
                      style={{ color: "#ef4444", background: 'none', border: 'none', cursor: 'pointer' }}
                      title="Delete Blog"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredBlogs.length === 0 && (
              <tr>
                <td colSpan="4" style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
                  No blogs found. Create your first ever blog post!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BlogList;
