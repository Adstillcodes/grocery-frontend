import { Routes, Route } from "react-router-dom";
import Admin from "./pages/Admin";
import Store from "./pages/Store";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import "./index.css";


function App() {
  return (
    <Routes>
      <Route path="/admin" element={<Admin />} />
      <Route path="/" element={<Store />} />
<Route path="/cart" element={<Cart />} />
<Route path="/admin" element={<Admin />} />
<Route path="/checkout" element={<Checkout />} />

    </Routes>
  );
}

export default App; // ← THIS LINE MUST EXIST