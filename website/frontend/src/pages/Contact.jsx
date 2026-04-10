import React from "react";
import Navbar from "../components/common/navbar";

const Contact = () => {
  return (
    <div className="min-h-screen bg-[#170a10] text-[#F8F8F8] font-['Playfair_Display',serif]">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-6 text-center bg-[url('/images/aboutsection-bg.png')] bg-cover bg-fixed">
        <div className="absolute inset-0 bg-black/50 pointer-events-none"></div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl text-[#e1d4b7] mb-6 font-normal tracking-wider">
            Connect With Us
          </h1>
          <div className="w-24 h-[1px] bg-[#d4af37]/50 mx-auto"></div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-[1200px] mx-auto py-20 px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        
        {/* Contact Info */}
        <div className="space-y-12">
          <div>
            <h2 className="text-2xl text-[#e1d4b7] mb-6 tracking-widest uppercase text-[14px]">The Studio</h2>
            <p className="text-[#beaca4] text-lg leading-relaxed italic mb-4">
              Our private showroom is available for bespoke consultations and viewing our latest curated collections.
            </p>
            <p className="text-[#beaca4] font-sans text-sm tracking-wide">
              123 Elegance Boulevard, Crystal District<br />
              London, UK EC1A 1BB
            </p>
          </div>

          <div>
            <h2 className="text-2xl text-[#e1d4b7] mb-6 tracking-widest uppercase text-[14px]">Direct Inquiries</h2>
            <div className="space-y-3 font-sans text-[#beaca4]">
              <p className="flex items-center gap-4">
                <span className="text-[#d4af37] text-[10px] uppercase tracking-tighter w-16">Email</span>
                <span className="hover:text-[#e1d4b7] cursor-pointer transition-colors">concierge@ladivyn.com</span>
              </p>
              <p className="flex items-center gap-4">
                <span className="text-[#d4af37] text-[10px] uppercase tracking-tighter w-16">Phone</span>
                <span className="hover:text-[#e1d4b7] cursor-pointer transition-colors">+44 20 7946 0123</span>
              </p>
              <p className="flex items-center gap-4">
                <span className="text-[#d4af37] text-[10px] uppercase tracking-tighter w-16">WhatsApp</span>
                <span className="hover:text-[#e1d4b7] cursor-pointer transition-colors">+44 7700 900077</span>
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl text-[#e1d4b7] mb-6 tracking-widest uppercase text-[14px]">Hours</h2>
            <p className="text-[#beaca4] font-sans text-sm leading-relaxed">
              Monday — Friday: 10:00 — 18:00<br />
              Saturday: By Appointment Only<br />
              Sunday: Collections Preview Closed
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-[#1a0a0e]/50 border border-[#d4af37]/10 p-8 sm:p-12 shadow-2xl backdrop-blur-sm">
          <h2 className="text-2xl text-[#e1d4b7] text-center mb-10 font-normal italic">Send a Message</h2>
          
          <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] text-[#d4af37]/70">Full Name</label>
              <input 
                type="text" 
                className="w-full bg-transparent border-b border-[#4a343c] py-2 focus:border-[#d4af37] outline-none transition-colors font-sans text-[#F8F8F8]" 
                placeholder="Your Name"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] text-[#d4af37]/70">Email Address</label>
              <input 
                type="email" 
                className="w-full bg-transparent border-b border-[#4a343c] py-2 focus:border-[#d4af37] outline-none transition-colors font-sans text-[#F8F8F8]" 
                placeholder="email@example.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] text-[#d4af37]/70">How can we assist you?</label>
              <select className="w-full bg-transparent border-b border-[#4a343c] py-2 focus:border-[#d4af37] outline-none transition-colors font-sans text-[#F8F8F8]">
                <option className="bg-[#170a10]">Bespoke Consultation</option>
                <option className="bg-[#170a10]">Order Inquiry</option>
                <option className="bg-[#170a10]">Gemstone Sourcing</option>
                <option className="bg-[#170a10]">General Questions</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] text-[#d4af37]/70">Message</label>
              <textarea 
                rows="4"
                className="w-full bg-transparent border border-[#4a343c] p-4 focus:border-[#d4af37] outline-none transition-colors font-sans text-[#F8F8F8] resize-none" 
                placeholder="Share your thoughts with us..."
              />
            </div>

            <button className="w-full py-4 bg-[#2a1215] border border-[#5a3a3e] text-[#e1d4b7] uppercase tracking-[0.3em] text-xs hover:bg-[#3d2024] hover:border-[#d4af37]/50 transition-all duration-500 shadow-xl">
              Send Inquire
            </button>
          </form>
        </div>
      </section>

      {/* Decorative Line */}
      <div className="w-full flex items-center justify-center opacity-30 py-10">
        <div className="h-[1px] bg-[linear-gradient(to_left,rgba(212,175,55,0.5),transparent)] grow max-w-[400px]"></div>
        <span className="px-6 text-[#d4af37] text-xs tracking-[0.5em]">✦ ✦</span>
        <div className="h-[1px] bg-[linear-gradient(to_right,rgba(212,175,55,0.5),transparent)] grow max-w-[400px]"></div>
      </div>
    </div>
  );
};

export default Contact;
