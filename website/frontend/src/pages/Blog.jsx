import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../components/common/navbar";
import { FiArrowRight, FiCalendar, FiUser } from "react-icons/fi";

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/blogs");
        setBlogs(res.data);
      } catch (err) {
        console.error("Error fetching blogs", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const truncate = (text, limit) => {
    if (!text) return "";
    return text.length > limit ? text.substring(0, limit) + "..." : text;
  };

  return (
    <div
      className="min-h-screen bg-[#170a10] w-full pt-28 sm:pt-36 pb-20 px-4 md:px-8 relative overflow-x-hidden"
    >
      {/* Background Decor */}
      <div
        className="absolute inset-0 z-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'url("/images/productsection-bg.webp")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>
      
      <Navbar />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 sm:mb-24">
          <h1 className="font-['Cinzel',serif] text-3xl sm:text-5xl text-[#e6ddca] tracking-[0.2em] mb-6 uppercase">
            Artistic Musings
          </h1>
          <div className="h-[2px] w-24 bg-[#d4af37] mx-auto mb-8"></div>
          <p className="font-['Playfair_Display',serif] italic text-[#beaca4] text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            Exploring the timeless stories, spiritual significance, and craftsmanship behind nature's finest treasures.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-pulse font-['Cinzel'] text-[#d4af37] tracking-widest uppercase">
              Revealing insights...
            </div>
          </div>
        ) : (
          <>
            {blogs.length === 0 ? (
              <div className="text-center py-20 bg-[#1a0c13]/50 border border-[#d4af37]/20 rounded-sm">
                <p className="font-['Playfair_Display',serif] italic text-[#beaca4] text-lg">
                  Our library is currently being curated. Check back soon for new stories.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12">
                {blogs.map((blog) => (
                  <div
                    key={blog.id}
                    className="group bg-[#1a0c13]/60 backdrop-blur-sm border border-[#4a343c]/40 rounded-sm overflow-hidden flex flex-col hover:border-[#d4af37]/60 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)]"
                  >
                    {/* Image Area */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-[#0d0408]">
                      <img
                        src={blog.image_url ? (blog.image_url.startsWith('http') ? blog.image_url : `http://localhost:5000${blog.image_url}`) : "/images/productsection-bg.webp"}
                        alt={blog.title}
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#170a10] to-transparent opacity-60"></div>
                    </div>

                    {/* Content Area */}
                    <div className="p-6 sm:p-8 flex flex-col flex-1">
                      <div className="flex items-center gap-4 text-[10px] uppercase tracking-[0.2em] text-[#d4af37] mb-4">
                        <span className="flex items-center gap-1.5"><FiCalendar /> {new Date(blog.created_at).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1.5"><FiUser /> {blog.author || "Admin"}</span>
                      </div>

                      <h2 className="font-['Cinzel',serif] text-[#e6ddca] text-xl sm:text-2xl leading-tight mb-4 group-hover:text-[#d4af37] transition-colors duration-300">
                        {truncate(blog.title, 50)}
                      </h2>

                      <p className="font-['Playfair_Display',serif] text-[#beaca4] text-sm sm:text-base leading-relaxed mb-8 italic opacity-80">
                        {truncate(blog.short_description, 70)}
                      </p>

                      <Link
                        to={`/blog/${blog.id}`}
                        className="mt-auto flex items-center gap-3 text-[#d4af37] text-xs font-bold tracking-[0.2em] uppercase group/link"
                      >
                        Read More
                        <span className="w-10 h-[1px] bg-[#d4af37]/40 group-hover/link:w-16 transition-all duration-500"></span>
                        <FiArrowRight className="group-hover/link:translate-x-2 transition-transform duration-500" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Blog;
