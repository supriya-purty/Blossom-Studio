import { Heart, ShoppingBag, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const ProductCard = ({ product }) => {
  const { addToCart, toggleWishlist } = useCart();
  const image = product.images?.[0]?.url;

  return (
    <article className="glass-card group overflow-hidden bg-[#fffaf6]">
      <Link to={`/products/${product._id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden">
          {image ? (
            <img src={image} alt={product.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
          ) : (
            <div className="grid h-full w-full place-items-center bg-petal text-center font-semibold text-cocoa/60">
              Upload product image
            </div>
          )}
          {product.handmade && <span className="badge absolute left-4 top-4">Handmade</span>}
        </div>
      </Link>
      <div className="p-5">
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="text-cocoa/60">{product.category}</span>
          <span className="flex items-center gap-1 text-cocoa"><Star size={15} fill="#f4b400" className="text-[#f4b400]" /> {product.rating} <span className="text-cocoa/45">({product.numReviews || 0})</span></span>
        </div>
        <Link to={`/products/${product._id}`}>
          <h3 className="mt-2 min-h-14 font-display text-2xl leading-tight">{product.name}</h3>
        </Link>
        <p className="mt-2 line-clamp-2 text-sm text-cocoa/70">{product.description}</p>
        <div className="mt-5 flex items-center justify-between">
          <span className="text-xl font-bold text-blush">Rs {product.price}.00</span>
          <div className="flex gap-2">
            <button className="icon-btn" onClick={() => toggleWishlist(product)} aria-label="Wishlist"><Heart size={18} /></button>
            <button className="btn-primary !px-4" onClick={() => addToCart(product)} aria-label="Add to cart">
              <ShoppingBag size={18} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
