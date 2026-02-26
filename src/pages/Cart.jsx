import { useCart } from "../context/CartContext";
import CustomerNavbar from "../components/CustomerNavbar";
import { Link } from "react-router-dom";

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, totalAmount } = useCart();

  return (
    <div className="min-h-screen bg-gray-50">
      <CustomerNavbar />

      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-semibold mb-6">Your Cart</h1>

        {cart.length === 0 ? (
          <div className="bg-white p-10 rounded-xl shadow text-center">
            <p className="text-gray-500 mb-4">Your cart is empty.</p>
            <Link
              to="/"
              className="bg-primary text-white px-6 py-3 rounded-lg"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {/* Items */}
            <div className="md:col-span-2 space-y-4">
              {cart.map((item) => (
                <div
                  key={item._id}
                  className="bg-white p-4 rounded-xl shadow-sm flex gap-4"
                >
                  <img
                    src={item.image || "https://via.placeholder.com/100"}
                    className="w-24 h-24 object-cover rounded-lg"
                  />

                  <div className="flex-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-gray-500">₹{item.price}</p>

                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        updateQuantity(item._id, e.target.value)
                      }
                      className="w-20 border rounded mt-2 p-1"
                    />
                  </div>

                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="text-red-500"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="bg-white p-6 rounded-xl shadow-sm h-fit sticky top-24">
              <h3 className="text-xl font-semibold mb-4">
                Order Summary
              </h3>

              <div className="flex justify-between mb-4">
                <span>Total</span>
                <span className="font-bold">₹{totalAmount}</span>
              </div>

              <Link
                to="/checkout"
                className="block w-full bg-primary text-white text-center py-3 rounded-xl font-medium hover:bg-green-700 transition"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;