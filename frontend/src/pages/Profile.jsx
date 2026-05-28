import { useEffect, useState } from "react";
import { Heart, LogOut, Package, Truck, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import api from "../services/api";

const Profile = () => {
  const { user, logout } = useAuth();
  const { items, wishlist } = useCart();
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const steps = ["Placed", "Processing", "Packed", "Shipped", "Delivered"];

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const { data } = await api.get("/orders/my");
        setOrders(data);
      } catch {
        setMessage("Could not load order history. Please check backend login.");
      }
    };
    loadOrders();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <section className="section">
      <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
        <aside className="glass-card h-fit p-8">
          <UserRound className="text-blush" size={46} />
          <h1 className="mt-4 font-display text-4xl">{user?.name}</h1>
          <p className="mt-2 text-cocoa/65">{user?.email}</p>
          <span className="badge mt-5">Customer Account</span>
          <div className="mt-8 grid gap-3">
            <button onClick={handleLogout} className="btn-secondary justify-center"><LogOut size={18} /> Logout</button>
          </div>
        </aside>
        <div className="grid gap-6">
          <div className="grid gap-5 md:grid-cols-3">
            <div className="glass-card p-6"><Package className="text-blush" /><p className="mt-3 text-3xl font-bold">{orders.length}</p><p className="text-cocoa/60">Orders</p></div>
            <div className="glass-card p-6"><Heart className="text-blush" /><p className="mt-3 text-3xl font-bold">{wishlist.length}</p><p className="text-cocoa/60">Wishlist</p></div>
            <div className="glass-card p-6"><Package className="text-blush" /><p className="mt-3 text-3xl font-bold">{items.length}</p><p className="text-cocoa/60">Cart items</p></div>
          </div>
          <div className="glass-card p-8">
            <h2 className="font-display text-3xl">Order History</h2>
            {message && <p className="mt-3 text-sm text-cocoa/60">{message}</p>}
            <div className="mt-5 grid gap-3">
              {orders.length ? orders.map((order) => (
                <div key={order._id} className="rounded-[1.4rem] bg-white/60 p-4">
                  <div className="flex flex-wrap justify-between gap-3">
                    <p className="font-semibold">Order #{order._id.slice(-6)}</p>
                    <span className="badge">{order.orderStatus}</span>
                  </div>
                  <p className="mt-2 text-sm text-cocoa/65">Payment: {order.paymentMethod || "Cash on Delivery"} | Status: {order.paymentStatus} | Total: Rs {order.totalAmount}</p>
                  <p className="mt-1 text-sm text-cocoa/65">{order.products?.length || 0} item(s)</p>
                  <div className="mt-4">
                    <div className="mb-2 flex items-center gap-2 font-semibold"><Truck size={18} /> Order Tracking</div>
                    <div className="grid gap-2 sm:grid-cols-5">
                      {steps.map((step) => {
                        const activeIndex = steps.indexOf(order.orderStatus);
                        const stepIndex = steps.indexOf(step);
                        const isDone = activeIndex >= stepIndex && order.orderStatus !== "Cancelled";
                        return (
                          <div key={step} className={`rounded-full px-3 py-2 text-center text-xs font-semibold ${isDone ? "bg-blush text-white" : "bg-white text-cocoa/55"}`}>
                            {step}
                          </div>
                        );
                      })}
                    </div>
                    {order.orderStatus === "Cancelled" && <p className="mt-2 text-sm font-semibold text-red-500">This order was cancelled.</p>}
                    {order.shippingAddress && (
                      <p className="mt-3 text-sm text-cocoa/65">
                        Shipping to: {order.shippingAddress.name}, {order.shippingAddress.phoneNumber}, {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                      </p>
                    )}
                  </div>
                </div>
              )) : <p className="text-cocoa/70">Your placed orders will appear here after checkout and payment.</p>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;
