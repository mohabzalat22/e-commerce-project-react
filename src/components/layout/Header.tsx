import React from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";

export default function Header() {
  return (
    <>
      <div className="bg-gray-900 text-white text-center text-xs py-2 tracking-widest px-4">
        BUY ANY 2 ITEMS AND GET FREE SHIPPING &nbsp;|&nbsp;
        <Link
          to="/signup"
          className="underline cursor-pointer hover:text-gray-300 transition"
        >
          Sign Up For Deals
        </Link>
      </div>

      <header className="border-b border-gray-200 sticky top-0 bg-white z-10">
        <Navbar />
      </header>
    </>
  );
}
