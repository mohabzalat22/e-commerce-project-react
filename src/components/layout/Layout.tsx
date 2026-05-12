import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import CartOverlay from "./CartOverlay";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 w-full max-w-shell mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </main>
      <Footer />
      <CartOverlay />
    </div>
  );
}
