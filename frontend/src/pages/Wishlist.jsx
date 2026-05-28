import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";

const Wishlist = () => {
  const { wishlist } = useCart();

  if (!wishlist.length) {
    return (
      <section className="section grid min-h-[60vh] place-items-center text-center">
        <div>
          <Heart className="mx-auto text-blush" size={62} />
          <h1 className="mt-5 font-display text-5xl">Your wishlist is empty</h1>
          <p className="mt-3 text-cocoa/70">Tap the heart on any product to save it here.</p>
          <Link to="/products" className="btn-primary mx-auto mt-7 w-fit">Browse products</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <h1 className="font-display text-5xl">My Wishlist</h1>
      <div className="product-grid mt-8">
        {wishlist.map((product) => <ProductCard key={product._id} product={product} />)}
      </div>
    </section>
  );
};

export default Wishlist;
