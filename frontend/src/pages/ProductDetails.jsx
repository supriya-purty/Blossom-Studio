import { useEffect, useState } from "react";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import SectionHeader from "../components/SectionHeader";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import api from "../services/api";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [review, setReview] = useState({ rating: 5, comment: "" });
  const [message, setMessage] = useState("");
  const { addToCart, toggleWishlist } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data.product);
        setRelated(data.relatedProducts || []);
      } catch {
        setProduct(null);
        setRelated([]);
      }
    };
    loadProduct();
  }, [id]);

  const submitReview = async (event) => {
    event.preventDefault();
    if (!user) {
      setMessage("Please login to submit a review.");
      return;
    }
    if (!product) {
      setMessage("Product is not available. Please check backend and MongoDB.");
      return;
    }

    try {
      const { data } = await api.post(`/products/${product._id}/reviews`, review);
      setProduct(data);
      setReview({ rating: 5, comment: "" });
      setMessage("Thank you. Your review was submitted and sent to the admin feedback page.");
    } catch (error) {
      setMessage(error.response?.data?.message || "Review could not be submitted.");
    }
  };

  if (!product) {
    return (
      <section className="section">
        <div className="glass-card p-8">
          <h1 className="font-display text-4xl">Product not available</h1>
          <p className="mt-3 text-cocoa/70">This product must be added from the admin database with your own uploaded image.</p>
          <Link to="/products" className="btn-primary mt-6">Back to products</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="overflow-hidden rounded-[2rem] shadow-soft">
          <img src={product.images?.[0]?.url} alt={product.name} className="h-full min-h-[420px] w-full object-cover" />
        </div>
        <div className="self-center">
          <span className="badge">{product.category}</span>
          <h1 className="mt-5 font-display text-5xl font-semibold">{product.name}</h1>
          <div className="mt-4 flex items-center gap-3">
            <span className="flex items-center gap-1"><Star size={18} fill="currentColor" /> {product.rating}</span>
            <span className="text-cocoa/50">Stock: {product.stock}</span>
            <span className="badge">Handmade</span>
          </div>
          <p className="mt-6 text-lg text-cocoa/75">{product.description}</p>
          <p className="mt-6 text-4xl font-bold">Rs {product.price}.00</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button className="btn-primary" onClick={() => addToCart(product)}><ShoppingBag size={18} /> Add to cart</button>
            <button className="btn-secondary" onClick={() => toggleWishlist(product)}><Heart size={18} /> Wishlist</button>
          </div>
        </div>
      </div>

      <div className="mt-14 grid gap-8 lg:grid-cols-[1fr_420px]">
        <section className="glass-card p-6">
          <h2 className="font-display text-3xl">Customer Reviews & Feedback</h2>
          <div className="mt-5 grid gap-4">
            {product.reviews?.length ? product.reviews.map((item) => (
              <div key={item._id} className="rounded-[1.4rem] bg-white/65 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="font-semibold">{item.name || item.user?.name || "Customer"}</p>
                  <span className="flex items-center gap-1"><Star size={16} fill="currentColor" /> {item.rating}/5</span>
                </div>
                <p className="mt-2 text-cocoa/70">{item.comment}</p>
              </div>
            )) : <p className="text-cocoa/70">No reviews yet. Be the first to share feedback.</p>}
          </div>
        </section>

        <form className="glass-card p-6" onSubmit={submitReview}>
          <h2 className="font-display text-3xl">Write a Review</h2>
          {message && <p className="mt-3 rounded-2xl bg-petal px-4 py-3 text-sm font-semibold">{message}</p>}
          <select className="input mt-5" value={review.rating} onChange={(event) => setReview({ ...review, rating: Number(event.target.value) })}>
            {[5, 4, 3, 2, 1].map((rating) => <option key={rating} value={rating}>{rating} Star</option>)}
          </select>
          <textarea className="input mt-3 min-h-32 resize-none rounded-[1.5rem]" placeholder="Write your feedback..." value={review.comment} onChange={(event) => setReview({ ...review, comment: event.target.value })} required />
          {user ? (
            <button className="btn-primary mt-4 w-full justify-center">Submit Review</button>
          ) : (
            <Link to="/login" className="btn-primary mt-4 w-full justify-center">Login to Review</Link>
          )}
        </form>
      </div>

      <div className="mt-20">
        <SectionHeader eyebrow="Related" title="You May Also Like" />
        <div className="product-grid">{related.slice(0, 4).map((item) => <ProductCard key={item._id} product={item} />)}</div>
      </div>
    </section>
  );
};

export default ProductDetails;
