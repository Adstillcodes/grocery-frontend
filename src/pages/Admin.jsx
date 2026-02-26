import { useEffect, useState } from "react";
import axios from "axios";
import "./Admin.css";

const API_BASE = "https://grocery-backend-1zha.onrender.com";

const Admin = () => {
  // =============================
  // STATE
  // =============================
  const [activeTab, setActiveTab] = useState("dashboard");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    image: "",
    description: "",
  });

  // =============================
  // FETCH PRODUCTS
  // =============================
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/products`);
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // =============================
  // FETCH ORDERS
  // =============================
  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/orders`);
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // =============================
  // FORM HANDLING
  // =============================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const startEdit = (product) => {
    setForm(product);
    setEditingId(product._id);
    setActiveTab("products");
  };

  const addProduct = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await axios.put(
          `${API_BASE}/api/products/${editingId}`,
          form
        );
        setEditingId(null);
      } else {
        await axios.post(`${API_BASE}/api/products`, form);
      }

      setForm({
        name: "",
        price: "",
        stock: "",
        image: "",
        description: "",
      });

      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`${API_BASE}/api/products/${id}`);
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  // =============================
  // STATS
  // =============================
  const totalProducts = products.length;
  const totalStock = products.reduce(
    (acc, p) => acc + Number(p.stock),
    0
  );
  const lowStock = products.filter((p) => p.stock < 5).length;

  // =============================
  // UI
  // =============================
  return (
    <div className="dashboard">
      {/* ================= SIDEBAR ================= */}
      <div className="sidebar">
        <h2>🛒 Grocery Admin</h2>
        <ul>
          <li onClick={() => setActiveTab("dashboard")}>Dashboard</li>
          <li onClick={() => setActiveTab("products")}>Products</li>
          <li
            onClick={() => {
              setActiveTab("orders");
              fetchOrders();
            }}
          >
            Orders
          </li>
        </ul>
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <div className="main-content">
        {/* ================= DASHBOARD ================= */}
        {activeTab === "dashboard" && (
          <>
            <h2 className="admin-title">Dashboard Overview</h2>

            <div className="stats-container">
              <div className="stat-card">
                <h4>Total Products</h4>
                <p>{totalProducts}</p>
              </div>
              <div className="stat-card">
                <h4>Total Stock Units</h4>
                <p>{totalStock}</p>
              </div>
              <div className="stat-card">
                <h4>Low Stock Items</h4>
                <p>{lowStock}</p>
              </div>
            </div>
          </>
        )}

        {/* ================= PRODUCTS ================= */}
        {activeTab === "products" && (
          <>
            <h2 className="admin-title">Product Management</h2>

            {/* Add/Edit Form */}
            <div className="form-section">
              <h3>{editingId ? "Edit Product" : "Add New Product"}</h3>

              <form onSubmit={addProduct}>
                <div className="form-grid">
                  <input
                    name="name"
                    placeholder="Product Name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                  <input
                    name="price"
                    type="number"
                    placeholder="Price (₹)"
                    value={form.price}
                    onChange={handleChange}
                    required
                  />
                  <input
                    name="stock"
                    type="number"
                    placeholder="Stock Quantity"
                    value={form.stock}
                    onChange={handleChange}
                    required
                  />
                  <input
                    name="image"
                    placeholder="Image URL"
                    value={form.image}
                    onChange={handleChange}
                  />
                  <input
                    name="description"
                    placeholder="Short Description"
                    value={form.description}
                    onChange={handleChange}
                  />
                </div>

                <button type="submit" className="add-btn">
                  {editingId ? "Update Product" : "Add Product"}
                </button>
              </form>
            </div>

            {/* Product List */}
            <div className="product-list">
              <h3>Current Inventory</h3>

              {products.length === 0 && (
                <p>No products added yet.</p>
              )}

              {products.map((product) => (
                <div key={product._id} className="product-card">
                  <div className="product-info">
                    <strong>{product.name}</strong>
                    <br />
                    ₹{product.price} | Stock:{" "}
                    <span
                      className={
                        product.stock < 5 ? "stock-low" : ""
                      }
                    >
                      {product.stock}
                    </span>
                  </div>

                  <div>
                    <button
                      onClick={() => startEdit(product)}
                      style={{ marginRight: "10px" }}
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteProduct(product._id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ================= ORDERS ================= */}
        {activeTab === "orders" && (
          <>
            <h2 className="admin-title">Customer Orders</h2>

            {orders.length === 0 && <p>No orders yet.</p>}

            <div style={{ marginTop: "20px" }}>
              {orders.map((order) => (
                <div
                  key={order._id}
                  style={{
                    background: "white",
                    padding: "16px",
                    borderRadius: "8px",
                    marginBottom: "16px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  }}
                >
                  <p><strong>Order ID:</strong> {order._id}</p>
                  <p><strong>Name:</strong> {order.customer?.name}</p>
                  <p><strong>Email:</strong> {order.customer?.email}</p>
                  <p><strong>Address:</strong> {order.customer?.address}</p>
                  <p><strong>Total:</strong> ₹{order.totalAmount}</p>

                  <div style={{ marginTop: "10px" }}>
                    <strong>Items:</strong>
                    <ul>
                      {order.items.map((item, idx) => (
                        <li key={idx}>
                          {item.name} × {item.quantity}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <p style={{ fontSize: "12px", color: "#666" }}>
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Admin;