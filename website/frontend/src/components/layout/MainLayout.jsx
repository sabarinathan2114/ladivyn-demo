import React from "react";
import Navbar from "../common/navbar";

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#170a10]">
      <Navbar />
      <main>
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
