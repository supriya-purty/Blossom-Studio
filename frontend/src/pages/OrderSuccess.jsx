import { CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useCart } from "../context/CartContext";

const OrderSuccess = () => {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, []);

  return (
    <section className="section grid min-h-[60vh] place-items-center text-center">
      <div className="glass-card max-w-xl p-10">
        <CheckCircle2 className="mx-auto text-green-500" size={70} />
        <h1 className="mt-5 font-display text-5xl">Order Placed</h1>
        <p className="mt-3 text-cocoa/70">Thank you for shopping handmade with Blossom Studio.</p>
        <Link to="/products" className="btn-primary mx-auto mt-7 w-fit">Continue shopping</Link>
      </div>
    </section>
  );
};

export default OrderSuccess;
