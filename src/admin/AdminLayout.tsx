import React from "react";
import { NavLink, Outlet } from "react-router-dom";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  [
    "block rounded-md px-3 py-2 text-sm font-medium transition",
    isActive
      ? "bg-sky-100 text-sky-900 border border-sky-200"
      : "text-gray-700 border border-transparent hover:bg-gray-50 hover:text-gray-900",
  ].join(" ");

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      <div className="flex-1 flex flex-col sm:flex-row w-full max-w-shell mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 gap-6 sm:gap-8">
        <aside className="w-full sm:w-52 shrink-0 sm:border-r border-gray-200 sm:pr-6 flex flex-row sm:flex-col gap-4 sm:gap-6 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0 border-b sm:border-b-0">
          <div className="shrink-0">
            <div className="text-xs uppercase tracking-widest text-gray-500">
              Store
            </div>
            <div className="font-semibold text-lg text-gray-800">Admin</div>
          </div>
          <nav className="flex sm:flex-col gap-0.5 min-w-0 flex-1 sm:flex-none">
            <NavLink to="/admin" end className={linkClass}>
              Dashboard
            </NavLink>
            <NavLink to="/admin/categories" className={linkClass}>
              Categories
            </NavLink>
            <NavLink to="/admin/products" className={linkClass}>
              Products
            </NavLink>
            <NavLink to="/admin/attributes" className={linkClass}>
              Attributes
            </NavLink>
            <NavLink to="/admin/users" className={linkClass}>
              Users
            </NavLink>
            <NavLink to="/admin/orders" className={linkClass}>
              Orders
            </NavLink>
            <NavLink to="/admin/tax-settings" className={linkClass}>
              Tax Settings
            </NavLink>
          </nav>
          <div className="hidden sm:block mt-auto pt-6 border-t border-gray-200">
            <NavLink
              to="/"
              className="text-sm text-gray-600 hover:text-sky-700 underline-offset-2 hover:underline"
            >
              ← Storefront
            </NavLink>
          </div>
        </aside>
        <main className="flex-1 min-w-0 bg-white rounded-xl border border-gray-200 shadow-sm p-6 sm:p-8">
          <Outlet />
        </main>
      </div>
      <div className="sm:hidden border-t border-gray-200 px-4 py-3 text-center">
        <NavLink
          to="/"
          className="text-sm text-gray-600 hover:text-sky-700 underline-offset-2 hover:underline"
        >
          ← Storefront
        </NavLink>
      </div>
    </div>
  );
}
