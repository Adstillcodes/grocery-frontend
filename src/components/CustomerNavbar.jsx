import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import CartDrawer from "./CartDrawer";

const CustomerNavbar = () => {
  const { cartCount } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-semibold text-primary">
            🥬 FreshMart
          </Link>

          <button
            onClick={() => setOpen(true)}
            className="relative bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition"
          >
            Cart

            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <CartDrawer isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default CustomerNavbar;