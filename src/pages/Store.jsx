import { useEffect, useState } from "react";
import axios from "axios";
import { useCart } from "../context/CartContext";
import CustomerNavbar from "../components/CustomerNavbar";

const Store = () => {
  const [products, setProducts] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await axios.get("https://grocery-backend-1zha.onrender.com/api/products");
    setProducts(res.data);
  };

  const handleAdd = (product) => {
    if (product.stock <= 0) {
      alert("Out of stock!");
      return;
    }
    addToCart(product);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <CustomerNavbar />

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-green-50 to-green-100 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl font-semibold text-gray-800 mb-2">
            Fresh Organic Groceries 🥬
          </h1>
          <p className="text-gray-600">
            Handpicked freshness delivered to your doorstep.
          </p>
        </div>
      </div>

      {/* Products */}
      <div className="max-w-7xl mx-auto p-6 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition p-4 flex flex-col group"
          >
            <div className="overflow-hidden rounded-xl mb-4">
              <img
                src={product.image || "https://via.placeholder.com/200"}
                alt={product.name}
                className="h-44 w-full object-cover group-hover:scale-105 transition duration-300"
              />
            </div>

            <h3 className="font-semibold text-lg text-gray-800">
              {product.name}
            </h3>

            <p className="text-gray-500 text-sm mb-3 line-clamp-2">
              {product.description}
            </p>

            <div className="mt-auto">
              <p className="text-2xl font-bold text-primary mb-2">
                ₹{product.price}
              </p>

              <button
                onClick={() => handleAdd(product)}
                disabled={product.stock <= 0}
                className={`w-full py-2 rounded-xl font-medium transition ${
                  product.stock <= 0
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-primary text-white hover:bg-green-700"
                }`}
              >
                {product.stock <= 0 ? "Out of Stock" : "Add to Cart"}
              </button>

              {product.stock < 5 && product.stock > 0 && (
                <p className="text-red-500 text-xs mt-2">
                  Only {product.stock} left
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Store;