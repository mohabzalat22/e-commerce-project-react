import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import { CartProvider } from "./context/CartContext";
import Home from "./pages/Home";
import PLP from "./pages/PLP";
import PDP from "./pages/PDP";
import Cart from "./pages/Cart";

function App() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
}

export default App;
