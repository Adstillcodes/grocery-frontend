import { useEffect, useState } from "react";
import axios from "axios";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const res = await axios.get("https://grocery-backend-1zha.onrender.com/api/orders");
    setOrders(res.data);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Orders</h1>

      {orders.map((order) => (
        <div key={order._id} className="bg-white p-4 rounded shadow mb-4">
          <p><strong>Name:</strong> {order.customer?.name}</p>
          <p><strong>Email:</strong> {order.customer?.email}</p>
          <p><strong>Address:</strong> {order.customer?.address}</p>
          <p><strong>Total:</strong> ₹{order.totalAmount}</p>
        </div>
      ))}
    </div>
  );
};

export default AdminOrders;