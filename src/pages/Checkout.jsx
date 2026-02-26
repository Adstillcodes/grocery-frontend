import { useCart } from "../context/CartContext";
import { useState } from "react";
import axios from "axios";
import CustomerNavbar from "../components/CustomerNavbar";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";


const stripePromise = loadStripe("pk_test_51T50X8Eypu4gvn1jkcCmhIGxSElcWlOTUnzyW6WSbxRLw8amkHd1eQcpykCpG9GwbEg5jJ3e7OtsSldE4mQl1Jh400ixuVc0hQ");

// 🔹 Inner Form
const CheckoutForm = () => {
  const { cart, totalAmount, clearCart } = useCart();
  
  const stripe = useStripe();
  const elements = useElements();

  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1️⃣ Get client secret
      const res = await axios.post(
        "https://grocery-backend-1zha.onrender.com/api/payment/create-payment-intent",
        { items: cart }
      );

      const clientSecret = res.data.clientSecret;

      // 2️⃣ Confirm payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: customer.name,
            email: customer.email,
          },
        },
      });

      if (result.error) {
        alert(result.error.message);
        setLoading(false);
        return;
      }

      // 3️⃣ Confirm order in DB
     await axios.post(
  "https://grocery-backend-1zha.onrender.com/api/payment/confirm-order",
  {
    items: cart,
    totalAmount,
    paymentIntentId: result.paymentIntent.id,
    customer,
  }
);

      alert("Payment successful!");
      
      // 🔥 FORCE clear
console.log("Clearing cart...");
clearCart();

// 🔥 EXTRA safety (handles edge cases)
localStorage.removeItem("cart");

// ✅ Small delay ensures React updates first
setTimeout(() => {
  window.location.href = "/";
}, 400);
    } catch (err) {
      console.error(err);
      alert("Checkout failed");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input name="name" placeholder="Full Name" onChange={handleChange} required className="w-full border p-2 rounded" />
      <input name="email" placeholder="Email" onChange={handleChange} required className="w-full border p-2 rounded" />
      <textarea name="address" placeholder="Delivery Address" onChange={handleChange} required className="w-full border p-2 rounded" />

      <div className="border p-4 rounded">
        <CardElement />
      </div>

      <button disabled={loading} className="w-full bg-primary text-white py-3 rounded">
        {loading ? "Processing..." : `Pay ₹${totalAmount}`}
      </button>
    </form>
  );
};

// 🔹 Page Wrapper
const Checkout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <CustomerNavbar />

      <div className="max-w-2xl mx-auto p-6 bg-white mt-10 rounded-xl shadow">
        <h1 className="text-2xl font-semibold mb-6">Checkout</h1>

        <Elements stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      </div>
    </div>
  );
};

export default Checkout;