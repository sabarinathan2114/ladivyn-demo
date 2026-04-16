import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/common/navbar";
import { FiArrowLeft, FiCalendar, FiUser, FiClock } from "react-icons/fi";

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/blogs/${id}`);
        setBlog(res.data);
      } catch (err) {
        console.error("Error fetching blog details", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
    window.scrollTo(0, 0);
  }, [id]);

  const renderContent = (content) => {
    if (!content) return null;
    let blocks = [];
    try {
      blocks = typeof content === "string" ? JSON.parse(content) : content;
    } catch (e) {
      console.error("Error parsing blog content", e);
      return <p className="text-red-400">Content error.</p>;
    }

    return blocks.map((block, i) => {
      switch (block.type) {
        case "h1":
          return (
            <h1 key={i} className="font-['Cinzel',serif] text-[#e6ddca] text-3xl sm:text-4xl md:text-5xl mb-8 leading-tight tracking-wide">
              {block.text}
            </h1>
          );
        case "h2":
          return (
            <h2 key={i} className="font-['Cinzel',serif] text-[#d4af37] text-2xl sm:text-3xl mb-6 leading-snug tracking-wider">
              {block.text}
            </h2>
          );
        case "h3":
          return (
            <h3 key={i} className="font-['Cinzel',serif] text-[#beaca4] text-xl sm:text-2xl mb-4 leading-snug">
              {block.text}
            </h3>
          );
        case "h4":
          return (
            <h4 key={i} className="font-['Cinzel',serif] text-[#beaca4] text-lg sm:text-xl mb-4 font-bold">
              {block.text}
            </h4>
          );
        case "h5":
          return (
            <h5 key={i} className="font-['Cinzel',serif] text-[#beaca4] text-base sm:text-lg mb-3 font-bold uppercase tracking-widest">
              {block.text}
            </h5>
          );
        case "h6":
          return (
            <h6 key={i} className="font-['Cinzel',serif] text-[#beaca4] text-sm mb-3 font-bold uppercase tracking-[0.2em] opacity-80">
              {block.text}
            </h6>
          );
        case "p":
          return (
            <p key={i} className="font-['Playfair_Display',serif] text-[#beaca4]/90 text-lg sm:text-xl leading-relaxed mb-8 indent-8 sm:indent-12">
              {block.text}
            </p>
          );
        case "list":
          return (
            <ul key={i} className="list-none mb-10 space-y-4">
              {block.items.map((item, j) => (
                <li key={j} className="flex gap-4 font-['Playfair_Display',serif] text-[#beaca4]/90 text-lg">
                  <span className="text-[#d4af37] font-serif">✦</span>
                  {item}
                </li>
              ))}
            </ul>
          );
        default:
          return null;
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#170a10] flex items-center justify-center">
        <div className="animate-pulse font-['Cinzel'] text-[#d4af37] tracking-[0.3em] uppercase">
          Unfolding story...
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-[#170a10] flex flex-col items-center justify-center px-4">
        <h2 className="font-['Cinzel',serif] text-[#e6ddca] text-3xl mb-6">Story Not Found</h2>
        <Link to="/blog" className="text-[#d4af37] uppercase tracking-widest flex items-center gap-2">
          <FiArrowLeft /> Return to Library
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#170a10] w-full pb-24 relative">
      <Navbar />

      {/* Hero Banner Area */}
      <div className="relative w-full h-[60vh] sm:h-[80vh] overflow-hidden">
        <img
          src={blog.image_url ? (blog.image_url.startsWith('http') ? blog.image_url : `http://localhost:5000${blog.image_url}`) : "/images/productsection-bg.webp"}
          alt={blog.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#170a10] via-[#170a10]/40 to-[#170a10]/10"></div>
        
        {/* Floating Header */}
        <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
          <div className="max-w-4xl animate-fadeIn">
            <Link 
              to="/blog" 
              className="inline-flex items-center gap-2 text-[#d4af37] text-xs font-bold tracking-[0.3em] uppercase mb-10 hover:translate-x-[-8px] transition-transform duration-300"
            >
              <FiArrowLeft /> Back to Musings
            </Link>
            <h1 className="font-['Cinzel',serif] text-4xl sm:text-6xl md:text-7xl text-[#e6ddca] tracking-widest uppercase mb-8 leading-tight">
              {blog.title}
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-8 text-[#d4af37] text-[10px] sm:text-xs uppercase tracking-[0.4em] font-bold">
              <span className="flex items-center gap-2"><FiCalendar /> {new Date(blog.created_at).toLocaleDateString()}</span>
              <span className="flex items-center gap-2"><FiUser /> {blog.author || "Admin"}</span>
              <span className="flex items-center gap-2"><FiClock /> 5 MIN READ</span>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-0 -mt-20 relative z-20">
        <div className="bg-[#1a0c13]/90 backdrop-blur-xl border border-[#4a343c]/30 p-8 sm:p-16 md:p-24 shadow-[0_40px_100px_rgba(0,0,0,0.6)]">
          {/* Summary Hook */}
          <div className="mb-16 pb-12 border-b border-[#4a343c]/20">
            <p className="font-['Playfair_Display',serif] italic text-[#d4af37] text-xl sm:text-2xl leading-relaxed text-center quote-highlight">
              {blog.short_description}
            </p>
          </div>

          <article className="blog-rich-content">
            {renderContent(blog.content)}
          </article>

          {/* Footer Branding */}
          <div className="mt-24 pt-12 border-t border-[#4a343c]/20 text-center">
            <img src="/images/logo.png" alt="LaDivyn" className="h-10 mx-auto opacity-30 grayscale mb-6" />
            <p className="font-['Cinzel',serif] text-[#beaca4] text-[10px] tracking-[0.5em] uppercase">
              ✦ Nature's Masterpiece • Refined by Design ✦
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .blog-rich-content p {
          margin-bottom: 2rem;
        }
        .animate-fadeIn {
          animation: fadeIn 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .quote-highlight {
          position: relative;
        }
        .quote-highlight::before {
          content: '"';
          position: absolute;
          top: -40px;
          left: 50%;
          transform: translateX(-50%);
          font-family: serif;
          font-size: 80px;
          opacity: 0.1;
          color: #d4af37;
        }
      `}</style>
    </div>
  );
};

export default BlogDetail;
