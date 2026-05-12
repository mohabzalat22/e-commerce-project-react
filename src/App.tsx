import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Layout from "./components/layout/Layout";
import { CartProvider } from "./context/CartContext";
import Home from "./pages/Home";
import PLP from "./pages/PLP";
import PDP from "./pages/PDP";
import Cart from "./pages/Cart";
import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/pages/AdminDashboard";
import CategoriesAdmin from "./admin/pages/CategoriesAdmin";
import ProductsAdmin from "./admin/pages/ProductsAdmin";
import ProductEditor from "./admin/pages/ProductEditor";
import AttributesAdmin from "./admin/pages/AttributesAdmin";
import UsersAdmin from "./admin/pages/UsersAdmin";

function App() {
  return (
    <BrowserRouter>
      <Toaster
        theme="light"
        richColors
        position="top-right"
        closeButton
        toastOptions={{ duration: 4000 }}
      />
      <Routes>
        <Route path="/admin/*" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="categories" element={<CategoriesAdmin />} />
          <Route path="products" element={<ProductsAdmin />} />
          <Route path="products/new" element={<ProductEditor />} />
          <Route path="products/:id" element={<ProductEditor />} />
          <Route path="attributes" element={<AttributesAdmin />} />
          <Route path="users" element={<UsersAdmin />} />
        </Route>
        <Route
          path="/*"
          element={
            <CartProvider>
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={<PLP />} />
                  <Route path="/product/:id" element={<PDP />} />
                  <Route path="/cart" element={<Cart />} />
                </Routes>
              </Layout>
            </CartProvider>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
