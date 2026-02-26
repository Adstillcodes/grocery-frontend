import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

const CartDrawer = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, updateQuantity, totalAmount } = useCart();

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 z-40"
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-96 bg-white shadow-xl z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Your Cart</h2>
            <button onClick={onClose} className="text-gray-500">
              ✕
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto space-y-4">
            {cart.length === 0 && (
              <p className="text-gray-500">Your cart is empty.</p>
            )}

            {cart.map((item) => (
              <div
                key={item._id}
                className="border rounded-lg p-3 flex gap-3"
              >
                <img
                  src={item.image || "https://via.placeholder.com/80"}
                  className="w-16 h-16 object-cover rounded"
                />

                <div className="flex-1">
                  <h4 className="font-medium">{item.name}</h4>
                  <p className="text-sm text-gray-500">
                    ₹{item.price}
                  </p>

                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(item._id, e.target.value)
                    }
                    className="w-16 border rounded mt-1 p-1 text-sm"
                  />
                </div>

                <button
                  onClick={() => removeFromCart(item._id)}
                  className="text-red-500 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="border-t pt-4">
            <div className="flex justify-between font-semibold mb-4">
              <span>Total</span>
              <span>₹{totalAmount}</span>
            </div>

            <Link
              to="/cart"
              onClick={onClose}
              className="block w-full bg-primary text-white text-center py-3 rounded-xl font-medium hover:bg-green-700 transition"
            >
              View Full Cart
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartDrawer;