import React from 'react';
import ProductCard from '../components/products/ProductCard';

const allProducts = [
  { id: 1, name: "Rose Quartz Bracelet", price: "₹2,800", image: "/images/products/rose-quartz-bracelet.png" },
  { id: 2, name: "Amethyst Cluster", price: "₹3,500", image: "/images/products/amethyst-cluster.png" },
  { id: 3, name: "Aquamarine Pendant", price: "₹2,200", image: "/images/products/aquamarine-pendant.png" },
  { id: 4, name: "Citrine Crystal", price: "₹2,600", image: "/images/products/citrine-crystal.png" },
  { id: 5, name: "Lapis Lazuli Sphere", price: "₹4,100", image: "/images/products/amethyst-cluster.png" },
  { id: 6, name: "Clear Quartz Point", price: "₹1,800", image: "/images/products/citrine-crystal.png" },
  { id: 7, name: "Tiger's Eye Rough", price: "₹1,500", image: "/images/products/rose-quartz-bracelet.png" },
  { id: 8, name: "Malachite Tumbled", price: "₹3,200", image: "/images/products/aquamarine-pendant.png" },
];

const Products = () => {
  return (
    <div className="min-h-screen bg-[#170a10] w-full pt-32 pb-20 px-4 md:px-8 bg-cover bg-center bg-no-repeat overflow-hidden text-center text-[#F8F8F8] relative">
      <div className="absolute inset-0 z-0 bg-transparent sm:bg-transparent"></div>

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center">
        {/* Headings */}
        <div className="mb-16 max-w-3xl">
          <h1 className="font-['Playfair_Display',serif] text-4xl md:text-5xl font-medium leading-tight mb-4 text-[#e6ddca]">
            Our Complete Collection
          </h1>
          <p className="font-['Playfair_Display',serif] italic text-base md:text-xl text-[#beaca4] tracking-wide">
            Explore the full spectrum of nature's finest creations.
          </p>
        </div>

        {/* Divider with Text */}
        <div className="w-full flex items-center justify-center mb-16 max-w-7xl">
          <div className="h-[2px] bg-[#8c7468] grow opacity-80"></div>
          <span className="px-8 font-['Cinzel',serif] font-bold text-[#e6ddca] text-base md:text-lg tracking-[0.3em]">
            ALL PRODUCTS
          </span>
          <div className="h-[2px] bg-[#8c7468] grow opacity-80"></div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-12 md:gap-x-8 md:gap-y-16 w-full max-w-7xl px-2 md:px-0">
          {allProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products;
