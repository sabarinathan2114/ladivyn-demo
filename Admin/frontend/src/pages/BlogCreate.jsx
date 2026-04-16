import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import {
  Plus,
  X,
  Save,
  ArrowLeft,
  Image as ImageIcon,
  Trash2,
  ChevronDown,
  Eye,
  Type,
  List as ListIcon,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  AlignLeft,
  Upload,
} from "lucide-react";

const BlogCreate = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    short_description: "",
    author: "",
    image_url: "",
    content: [
      { id: Date.now(), type: 'h1', text: '' }
    ],
  });

  useEffect(() => {
    if (isEditing) {
      fetchBlog();
    }
  }, [id]);

  const fetchBlog = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/blogs/${id}`);
      const blog = res.data;
      setFormData({
        title: blog.title,
        short_description: blog.short_description,
        author: blog.author || "",
        image_url: blog.image_url || "",
        content: typeof blog.content === 'string' ? JSON.parse(blog.content) : blog.content,
      });
      if (blog.image_url) {
        setPreviewUrl(blog.image_url.startsWith('http') ? blog.image_url : `http://localhost:5000${blog.image_url}`);
      }
    } catch (error) {
      console.error("Error fetching blog:", error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const addBlock = (type) => {
    const newBlock = { 
      id: Date.now(), 
      type, 
      text: type === 'list' ? '' : '',
      items: type === 'list' ? [''] : []
    };
    setFormData({ ...formData, content: [...formData.content, newBlock] });
  };

  const removeBlock = (blockId) => {
    setFormData({
      ...formData,
      content: formData.content.filter(b => b.id !== blockId)
    });
  };

  const updateBlock = (blockId, field, value) => {
    setFormData({
      ...formData,
      content: formData.content.map(b => 
        b.id === blockId ? { ...b, [field]: value } : b
      )
    });
  };

  const updateListItem = (blockId, index, value) => {
    setFormData({
      ...formData,
      content: formData.content.map(b => {
        if (b.id === blockId) {
          const newItems = [...b.items];
          newItems[index] = value;
          return { ...b, items: newItems };
        }
        return b;
      })
    });
  };

  const addListItem = (blockId) => {
    setFormData({
      ...formData,
      content: formData.content.map(b => 
        b.id === blockId ? { ...b, items: [...b.items, ''] } : b
      )
    });
  };

  const removeListItem = (blockId, index) => {
    setFormData({
      ...formData,
      content: formData.content.map(b => 
        b.id === blockId ? { ...b, items: b.items.filter((_, i) => i !== index) } : b
      )
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let finalImageUrl = formData.image_url;

      if (selectedFile) {
        const fileData = new FormData();
        fileData.append("image", selectedFile);
        const uploadRes = await axios.post("http://localhost:5000/api/upload", fileData, {
          headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
        });
        finalImageUrl = uploadRes.data.image;
      }

      const payload = { ...formData, image_url: finalImageUrl };

      if (isEditing) {
        await axios.put(`http://localhost:5000/api/blogs/${id}`, payload, {
          headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
        });
      } else {
        await axios.post("http://localhost:5000/api/blogs", payload, {
          headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
        });
      }

      navigate("/dashboard/blogs");
    } catch (error) {
      console.error(error);
      alert("Failed to save blog. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const BlockEditor = ({ block }) => {
    const renderInput = () => {
      if (block.type === 'list') {
        return (
          <div className="space-y-2">
            {block.items.map((item, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="text"
                  className="form-input"
                  value={item}
                  onChange={(e) => updateListItem(block.id, i, e.target.value)}
                  placeholder="List item..."
                />
                <button 
                  type="button" 
                  onClick={() => removeListItem(block.id, i)}
                  className="text-red-400 p-1 hover:bg-red-50 rounded"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            <button 
              type="button" 
              onClick={() => addListItem(block.id)}
              className="text-xs text-blue-500 font-semibold flex items-center gap-1"
            >
              <Plus size={12} /> Add Item
            </button>
          </div>
        );
      }
      return (
        <textarea
          className="form-input"
          value={block.text}
          onChange={(e) => updateBlock(block.id, 'text', e.target.value)}
          placeholder={`Enter ${block.type} content...`}
          rows={block.type.startsWith('h') ? 1 : 3}
          style={block.type.startsWith('h') ? { fontWeight: 'bold' } : {}}
        />
      );
    };

    return (
      <div className="premium-card mb-4 group relative" style={{ padding: '1.5rem', border: '1px solid #f1f5f9' }}>
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#94a3b8]">
            <Type size={14} /> {block.type}
          </div>
          <button 
            type="button" 
            onClick={() => removeBlock(block.id)}
            className="text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Trash2 size={16} />
          </button>
        </div>
        {renderInput()}
      </div>
    );
  };

  const PreviewContent = () => {
    return (
      <div className="prose prose-stone max-w-none">
        {formData.content.map((block, i) => {
          switch (block.type) {
            case 'h1': return <h1 key={i} className="font-serif text-3xl mb-4">{block.text}</h1>;
            case 'h2': return <h2 key={i} className="font-serif text-2xl mb-3">{block.text}</h2>;
            case 'h3': return <h3 key={i} className="font-serif text-xl mb-2">{block.text}</h3>;
            case 'h4': return <h4 key={i} className="font-serif text-lg mb-2">{block.text}</h4>;
            case 'h5': return <h5 key={i} className="font-serif text-md mb-1">{block.text}</h5>;
            case 'h6': return <h6 key={i} className="font-serif text-sm mb-1 uppercase tracking-wider">{block.text}</h6>;
            case 'p': return <p key={i} className="text-[#4a343c] leading-relaxed mb-4">{block.text}</p>;
            case 'list': return (
              <ul key={i} className="list-disc pl-5 mb-4 space-y-1">
                {block.items.map((item, j) => <li key={j}>{item}</li>)}
              </ul>
            );
            default: return null;
          }
        })}
      </div>
    );
  };

  return (
    <div className="new-product-container p-6 lg:p-10" style={{ paddingBottom: '120px' }}>
      <div className="flex flex-col lg:flex-row justify-between items-start gap-8 mb-8">
        <div className="flex items-center gap-4">
          <button 
            className="action-btn"
            style={{ 
              background: "#f1f5f9", 
              border: "none", 
              width: "40px", 
              height: "40px", 
              borderRadius: "8px", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              cursor: 'pointer' 
            }}
            onClick={() => navigate("/dashboard/blogs")}
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="page-title" style={{ fontFamily: 'serif', fontSize: '1.75rem' }}>
              {isEditing ? "Edit Blog Entry" : "New Artistic Discovery"}
            </h1>
            <p className="text-[#94a3b8] text-sm">Drafting your story for the storefront.</p>
          </div>
        </div>

        <div className="flex gap-4 w-full lg:w-auto">
          <button 
            type="button" 
            onClick={() => setShowPreview(!showPreview)}
            className="btn" 
            style={{ 
              width: 'auto', 
              background: '#f8fafc', 
              color: '#64748b', 
              border: '1px solid #e2e8f0',
              flex: 1
            }}
          >
            <Eye size={18} /> {showPreview ? "Back to Edit" : "Live Preview"}
          </button>
          <button 
            onClick={handleSubmit}
            disabled={loading}
            className="btn"
            style={{ 
              width: 'auto', 
              background: 'var(--accent-secondary)', 
              color: 'white',
              flex: 1
            }}
          >
            <Save size={18} /> {loading ? "Saving..." : "Publish Post"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        {/* Main Editor / Preview */}
        <div className="xl:col-span-8 space-y-8">
          {showPreview ? (
            <div className="premium-card p-10 bg-white min-h-[600px] shadow-xl">
              <div className="max-w-3xl mx-auto">
                {previewUrl && (
                  <img src={previewUrl} alt="" className="w-full h-64 object-cover rounded-xl mb-10 shadow-lg" />
                )}
                <div className="mb-8 border-b border-[#f1f5f9] pb-8">
                  <h1 className="font-serif text-4xl text-[#1a0c13] mb-4">{formData.title || "Untiled Post"}</h1>
                  <p className="text-[#71300a] text-lg italic opacity-80 mb-4">{formData.short_description}</p>
                  <p className="text-xs uppercase tracking-widest text-[#94a3b8]">By {formData.author || "Admin"} • {new Date().toLocaleDateString()}</p>
                </div>
                <PreviewContent />
              </div>
            </div>
          ) : (
            <>
              {/* Blog Metadata Card */}
              <div className="premium-card p-8">
                <div className="form-group mb-6">
                  <label className="form-label">Blog Title (Max 50 chars for card)</label>
                  <input
                    type="text"
                    className="form-input"
                    maxLength={100}
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Capture the essence of your story..."
                    style={{ fontSize: '1.25rem', fontWeight: '600' }}
                  />
                  <div className="text-right text-[10px] text-gray-400 mt-1">
                    {formData.title.length}/50 recommended for cards
                  </div>
                </div>

                <div className="form-group mb-6">
                  <label className="form-label">Short Description (Max 70 chars for card)</label>
                  <textarea
                    className="form-input"
                    rows="2"
                    value={formData.short_description}
                    onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                    placeholder="A brief hook for your audience..."
                  />
                   <div className="text-right text-[10px] text-gray-400 mt-1">
                    {formData.short_description.length}/70 recommended for cards
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-group">
                    <label className="form-label">Author Name</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      placeholder="e.g. Mobe"
                    />
                  </div>
                </div>
              </div>

              {/* Dynamic Content Card */}
              <div className="premium-card p-8">
                <h3 className="font-serif text-xl mb-6 flex items-center gap-2">
                  <AlignLeft className="text-aurum" /> Story Composition
                </h3>
                
                <div className="space-y-4 mb-8">
                  {formData.content.map(block => (
                    <BlockEditor key={block.id} block={block} />
                  ))}
                </div>

                {/* Add Block Toolbar */}
                <div className="bg-[#f8fafc] p-4 rounded-xl border border-dashed border-[#e2e8f0]">
                  <p className="text-xs font-bold text-[#94a3b8] uppercase tracking-widest mb-4 text-center">Append Content Block</p>
                  <div className="flex flex-wrap justify-center gap-3">
                    {[
                      { type: 'h1', icon: <Heading1 size={18} /> },
                      { type: 'h2', icon: <Heading2 size={18} /> },
                      { type: 'h3', icon: <Heading3 size={18} /> },
                      { type: 'p', icon: <Type size={18} /> },
                      { type: 'list', icon: <ListIcon size={18} /> }
                    ].map(btn => (
                      <button
                        key={btn.type}
                        type="button"
                        onClick={() => addBlock(btn.type)}
                        className="bg-white p-3 rounded-lg border border-[#e2e8f0] hover:border-aurum hover:text-aurum transition-all shadow-sm flex items-center gap-2 text-sm font-semibold"
                      >
                        {btn.icon} {btn.type.toUpperCase()}
                      </button>
                    ))}
                    <div className="relative group">
                      <button className="bg-white p-3 rounded-lg border border-[#e2e8f0] hover:border-aurum hover:text-aurum transition-all shadow-sm flex items-center gap-2 text-sm font-semibold">
                        More <ChevronDown size={14} />
                      </button>
                      <div className="absolute top-full left-0 mt-2 bg-white border border-[#e2e8f0] rounded-lg shadow-xl py-2 w-32 hidden group-hover:block z-50">
                        {['h4', 'h5', 'h6'].map(h => (
                          <button 
                            key={h}
                            type="button" 
                            onClick={() => addBlock(h)}
                            className="w-full text-left px-4 py-2 hover:bg-[#f8fafc] text-sm uppercase tracking-widest font-bold"
                          >
                            {h.toUpperCase()}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Sidebar: Image Upload */}
        <div className="xl:col-span-4">
          <div className="premium-card p-6 sticky top-8">
            <h3 className="font-serif text-lg mb-6">Featured Image</h3>
            <input 
              type="file" 
              id="blog-image-upload" 
              hidden 
              accept="image/*" 
              onChange={handleFileChange}
            />
            <div
              className="image-upload-dashed"
              onClick={() => document.getElementById('blog-image-upload').click()}
              style={{
                width: "100%",
                aspectRatio: "1/1",
                background: "#f8fafc",
                borderRadius: "1rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                border: "2px dashed #d1d5db",
                cursor: "pointer",
                overflow: 'hidden'
              }}
            >
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <>
                  <Upload size={32} className="text-[#94a3b8] mb-4" />
                  <p className="text-sm font-bold text-[#1a0c13]">Upload Scene</p>
                  <p className="text-[10px] text-[#94a3b8]">1080 x 1080 recommended</p>
                </>
              )}
            </div>
            {previewUrl && (
              <button 
                type="button" 
                onClick={() => { setPreviewUrl(''); setSelectedFile(null); setFormData({...formData, image_url: ''}) }}
                className="mt-4 text-xs text-red-400 font-bold flex items-center justify-center w-full gap-1 border border-red-50 py-2 rounded-lg"
              >
                <Trash2 size={12} /> Remove Image
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCreate;
