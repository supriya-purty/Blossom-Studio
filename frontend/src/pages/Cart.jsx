import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const Cart = () => {
  const { items, subtotal, shipping, total, removeFromCart, updateQuantity } = useCart();

  if (!items.length) {
    return (
      <section className="section grid min-h-[60vh] place-items-center text-center">
        <div>
          <ShoppingBag className="mx-auto text-blush" size={58} />
          <h1 className="mt-5 font-display text-5xl">Your cart is empty</h1>
          <p className="mt-3 text-cocoa/70">Add a handmade piece to begin your order.</p>
          <Link to="/products" className="btn-primary mx-auto mt-7 w-fit">Shop products</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <h1 className="font-display text-5xl">Shopping Cart</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="grid gap-4">
          {items.map((item) => (
            <div key={item._id} className="glass-card grid gap-4 p-4 sm:grid-cols-[120px_1fr_auto]">
              <img src={item.images[0].url} alt={item.name} className="h-28 w-full rounded-[1.2rem] object-cover" />
              <div>
                <h3 className="font-display text-2xl">{item.name}</h3>
                <p className="text-sm text-cocoa/60">{item.category}</p>
                <p className="mt-2 font-semibold">Rs {item.price}.00</p>
              </div>
              <div className="flex items-center gap-3 self-center">
                <button className="icon-btn" onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}><Minus size={16} /></button>
                <span className="w-7 text-center font-semibold">{item.quantity}</span>
                <button className="icon-btn" onClick={() => updateQuantity(item._id, item.quantity + 1)}><Plus size={16} /></button>
                <button className="icon-btn" onClick={() => removeFromCart(item._id)}><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
        <aside className="glass-card h-fit p-6">
          <h2 className="font-display text-3xl">Order Summary</h2>
          <div className="mt-5 grid gap-3 text-cocoa/75">
            <div className="flex justify-between"><span>Subtotal</span><span>Rs {subtotal}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>{shipping ? `Rs ${shipping}` : "Free"}</span></div>
            <input className="input mt-3" placeholder="Coupon code" />
            <div className="border-t border-cocoa/10 pt-4 text-xl font-bold flex justify-between"><span>Total</span><span>Rs {total}</span></div>
          </div>
          <Link to="/checkout" className="btn-primary mt-6 justify-center">Checkout</Link>
        </aside>
      </div>
    </section>
  );
};

export default Cart;
