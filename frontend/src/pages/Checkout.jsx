import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import api from "../services/api";

const Checkout = () => {
  const { items, total, clearCart } = useCart();
  const { user, authReady } = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [placingOrder, setPlacingOrder] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [shippingAddress, setShippingAddress] = useState({
    name: user?.name || "",
    phoneNumber: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    country: "India"
  });

  const updateAddress = (field, value) => {
    setShippingAddress((current) => ({ ...current, [field]: value }));
  };

  const validateShippingAddress = () => {
    const requiredFields = [
      ["name", "Full name"],
      ["phoneNumber", "Phone number"],
      ["street", "Street address"],
      ["city", "City"],
      ["state", "State"],
      ["pincode", "Pincode"]
    ];
    const missing = requiredFields.find(([field]) => !shippingAddress[field]?.trim());
    if (missing) {
      setMessage(`${missing[1]} is required for shipping.`);
      return false;
    }

    if (!/^[6-9]\d{9}$/.test(shippingAddress.phoneNumber.trim())) {
      setMessage("Please enter a valid 10 digit Indian phone number.");
      return false;
    }

    if (!/^\d{6}$/.test(shippingAddress.pincode.trim())) {
      setMessage("Please enter a valid 6 digit pincode.");
      return false;
    }

    return true;
  };

  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const payWithRazorpay = async (order) => {
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      setMessage("Razorpay could not be loaded. Please check internet connection.");
      return false;
    }

    let data;
    try {
      const response = await api.post("/payments/razorpay-order", { orderId: order._id });
      data = response.data;
    } catch (error) {
      setMessage(error.response?.data?.message || "Order was saved, but Razorpay could not start. Check Razorpay keys in Render.");
      return false;
    }

    if (!data.key || !data.razorpayOrder?.id) {
      setMessage("Order was saved, but Razorpay key/order is missing. Check Razorpay environment variables in Render.");
      return false;
    }

    const razorpayOrder = data.razorpayOrder;

    const razorpay = new window.Razorpay({
      key: data.key,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency || "INR",
      name: "Blossom Studio",
      description: `${paymentMethod} payment for handmade craft order`,
      order_id: razorpayOrder.id,
      prefill: {
        name: shippingAddress.name || user?.name,
        email: user?.email,
        contact: shippingAddress.phoneNumber
      },
      theme: {
        color: "#e27698"
      },
      handler: async (response) => {
        try {
          await api.post("/payments/verify", response);
          clearCart();
          navigate("/success");
        } catch (error) {
          setMessage(error.response?.data?.message || "Payment completed, but verification failed. Please contact Blossom Studio.");
        }
      },
      modal: {
        ondismiss: () => setMessage("Payment was cancelled. Your order is saved with pending payment.")
      }
    });

    razorpay.open();
    return true;
  };

  const placeOrder = async () => {
    if (placingOrder) return;
    if (!authReady) {
      setMessage("Checking your login session. Please try again in a moment.");
      return;
    }

    if (!user) {
      navigate("/login");
      return;
    }

    if (!items.length) {
      setMessage("Your cart is empty.");
      return;
    }

    if (!validateShippingAddress()) return;

    try {
      setPlacingOrder(true);
      setMessage("");
      const { data: order } = await api.post("/orders", { shippingAddress, products: items, paymentMethod });
      if (paymentMethod === "Cash on Delivery") {
        clearCart();
        navigate("/success");
        return;
      }

      await payWithRazorpay(order);
    } catch (error) {
      setMessage(error.response?.data?.message || "Order could not be placed. Please check backend.");
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <section className="section">
      <h1 className="font-display text-5xl">Checkout</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <form className="glass-card grid gap-4 p-6">
          <h2 className="font-display text-3xl">Shipping Address</h2>
          {message && <div className="rounded-2xl bg-petal px-4 py-3 text-sm font-semibold">{message}</div>}
          <input className="input" placeholder="Full name *" value={shippingAddress.name} onChange={(event) => updateAddress("name", event.target.value)} required />
          <input className="input" placeholder="Phone number *" value={shippingAddress.phoneNumber} onChange={(event) => updateAddress("phoneNumber", event.target.value)} required />
          <input className="input" placeholder="Street address *" value={shippingAddress.street} onChange={(event) => updateAddress("street", event.target.value)} required />
          <div className="grid gap-4 md:grid-cols-3">
            <input className="input" placeholder="City *" value={shippingAddress.city} onChange={(event) => updateAddress("city", event.target.value)} required />
            <input className="input" placeholder="State *" value={shippingAddress.state} onChange={(event) => updateAddress("state", event.target.value)} required />
            <input className="input" placeholder="Pincode *" value={shippingAddress.pincode} onChange={(event) => updateAddress("pincode", event.target.value)} required />
          </div>
          <h2 className="mt-3 font-display text-3xl">Payment</h2>
          <div className="grid gap-3 md:grid-cols-3">
            {["UPI", "Card", "Cash on Delivery"].map((method) => (
              <label key={method} className={`cursor-pointer rounded-[1.4rem] border p-4 transition ${paymentMethod === method ? "border-blush bg-petal" : "border-cocoa/10 bg-white/65"}`}>
                <input className="sr-only" type="radio" name="paymentMethod" checked={paymentMethod === method} onChange={() => setPaymentMethod(method)} />
                <span className="font-semibold">{method}</span>
                <p className="mt-1 text-sm text-cocoa/60">
                  {method === "Cash on Delivery" ? "Pay when your handmade order arrives." : "Razorpay-ready online payment option."}
                </p>
              </label>
            ))}
          </div>
          <div className="rounded-[1.4rem] bg-white/65 p-4 text-sm text-cocoa/70">
            UPI and card are ready for Razorpay integration. Cash on Delivery places the order with pending payment status.
          </div>
        </form>
        <aside className="glass-card h-fit p-6">
          <h2 className="font-display text-3xl">Payable Amount</h2>
          <p className="mt-4 text-4xl font-bold">Rs {total}</p>
          <button className="btn-primary mt-6 w-full justify-center disabled:opacity-60" onClick={placeOrder} disabled={placingOrder}>
            {placingOrder ? "Processing..." : "Place order"}
          </button>
        </aside>
      </div>
    </section>
  );
};

export default Checkout;
