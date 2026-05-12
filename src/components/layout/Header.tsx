import React from "react";
import Navbar from "./Navbar";

export default function Header() {
  return (
    <>
      <div className="bg-gray-900 text-white text-center text-xs py-2 tracking-widest px-4">
        BUY ANY 2 ITEMS AND GET FREE SHIPPING &nbsp;|&nbsp;
        <span className="underline cursor-pointer hover:text-gray-300 transition">
          Sign Up For Deals
        </span>
      </div>

      <header className="border-b border-gray-200 sticky top-0 bg-white z-50">
        <Navbar />
      </header>
    </>
  );
}
