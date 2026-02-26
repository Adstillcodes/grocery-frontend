import { useEffect, useState } from "react";
import axios from "axios";
import "./Admin.css";
function Admin() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    image: "",
    description: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await axios.get("https://grocery-backend-1zha.onrender.com/api/products");
    setProducts(res.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addProduct = async (e) => {
    e.preventDefault();
    await axios.post("https://grocery-backend-1zha.onrender.com/api/products", form);
    setForm({ name: "", price: "", stock: "", image: "", description: "" });
    fetchProducts();
  };

  const deleteProduct = async (id) => {
    await axios.delete(`https://grocery-backend-1zha.onrender.com/api/products/${id}`);
    fetchProducts();
  };
const totalProducts = products.length;
const totalStock = products.reduce((acc, p) => acc + Number(p.stock), 0);
const lowStock = products.filter((p) => p.stock < 5).length;

return (
  <div className="dashboard">
    {/* Sidebar */}
    <div className="sidebar">
      <h2>🛒 Grocery Admin</h2>
      <ul>
        <li>Dashboard</li>
        <li>Products</li>
        <li>Orders</li>
      </ul>
    </div>

    {/* Main */}
    <div className="main-content">
      <h2 className="admin-title">Dashboard Overview</h2>

      {/* Stats */}
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

      {/* Add Product Section */}
      <div className="form-section">
        <h3>Add New Product</h3>

        <form onSubmit={addProduct}>
          <div className="form-grid">
            <input name="name" placeholder="Product Name" value={form.name} onChange={handleChange} required />
            <input name="price" type="number" placeholder="Price (₹)" value={form.price} onChange={handleChange} required />
            <input name="stock" type="number" placeholder="Stock Quantity" value={form.stock} onChange={handleChange} required />
            <input name="image" placeholder="Image URL" value={form.image} onChange={handleChange} />
            <input name="description" placeholder="Short Description" value={form.description} onChange={handleChange} />
          </div>
          <button type="submit" className="add-btn">Add Product</button>
        </form>
      </div>

      {/* Product List */}
      <div className="product-list">
        <h3>Current Inventory</h3>

        {products.map((product) => (
          <div key={product._id} className="product-card">
            <div className="product-info">
              <strong>{product.name}</strong><br />
              ₹{product.price} | Stock:{" "}
              <span className={product.stock < 5 ? "stock-low" : ""}>
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
    </div>
  </div>
);
}

export default Admin;