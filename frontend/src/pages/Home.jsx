import { ArrowRight, Gift, Leaf, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import SectionHeader from "../components/SectionHeader";
import { testimonials } from "../data/catalog";
import { useCategories } from "../hooks/useCategories";
import { useProducts } from "../hooks/useProducts";

const Home = () => {
  const { categories } = useCategories();
  const { products } = useProducts();

  return (
    <>
    <section className="hero-reference">
      <div className="container flex min-h-[calc(100vh-5rem)] items-center py-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="hero-panel"
        >
          <h1 className="font-display text-5xl font-semibold leading-tight md:text-7xl">
            Handcrafted with <span className="italic text-blush">love</span>, just for you.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-cocoa/75">
            Discover our collection of soft, dreamy crochet and pastel handmade crafts. Every piece
            is a unique creation to bring warmth to your home.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/products" className="btn-primary">Shop Collection <ArrowRight size={18} /></Link>
            <Link to="/categories" className="btn-secondary">Explore Categories</Link>
          </div>
        </motion.div>
      </div>
    </section>

    <section className="section">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-4xl font-semibold md:text-5xl">Featured Treasures</h2>
          <p className="mt-3 text-lg text-cocoa/65">Our most cherished handmade creations.</p>
        </div>
        <Link to="/products" className="inline-flex items-center gap-2 font-semibold">View All <ArrowRight size={18} /></Link>
      </div>
      <div className="product-grid">
        {products.length ? products.slice(0, 4).map((product) => <ProductCard key={product._id} product={product} />) : (
          <div className="glass-card p-7 md:col-span-2 xl:col-span-4">
            <h3 className="font-display text-3xl">No featured products yet</h3>
            <p className="mt-2 text-cocoa/70">Add products with your own images from the admin panel to show them here.</p>
          </div>
        )}
      </div>
    </section>

    <section className="section">
      <SectionHeader eyebrow="" title="Shop by Category" text="Find the perfect piece for any occasion." />
      <div className="grid gap-7 md:grid-cols-3">
        {categories.length ? categories.slice(0, 3).map((category) => (
          <Link key={category.name} to={`/products?category=${category.apiCategory}`} className="category-tile">
            <img src={category.image} alt={category.name} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
            <div className="absolute bottom-0 p-7 text-white">
              <h3 className="font-display text-3xl">{category.name}</h3>
              <p className="mt-1">{category.subtitle}</p>
            </div>
          </Link>
        )) : (
          <div className="glass-card p-7 md:col-span-3">
            <h3 className="font-display text-3xl">No categories yet</h3>
            <p className="mt-2 text-cocoa/70">Add categories or products from the admin panel to show them here.</p>
          </div>
        )}
      </div>
    </section>

    <section className="section">
      <div className="grid gap-6 lg:grid-cols-4">
        {[
          [Leaf, "Handmade Quality", "Every piece is crafted in small batches with care."],
          [Gift, "Custom Gifts", "Personalized hampers and memorable keepsakes."],
          [Truck, "Fast Shipping", "Clear shipping charges and order tracking."],
          [ShieldCheck, "Secure Payments", "Razorpay-powered checkout flow."]
        ].map(([Icon, title, text]) => (
          <div key={title} className="glass-card p-6">
            <Icon className="text-blush" size={30} />
            <h3 className="mt-5 font-display text-2xl">{title}</h3>
            <p className="mt-2 text-cocoa/70">{text}</p>
          </div>
        ))}
      </div>
    </section>

    <section className="section bg-petal">
      <SectionHeader eyebrow="Reviews" title="Loved By Craft People" />
      <div className="grid gap-5 md:grid-cols-3">
        {testimonials.map((quote, index) => (
          <div key={quote} className="glass-card p-7">
            <Sparkles className="text-lavender" />
            <p className="mt-5 text-lg text-cocoa/80">"{quote}"</p>
            <p className="mt-5 font-semibold">Customer {index + 1}</p>
          </div>
        ))}
      </div>
    </section>

    <section className="section">
      <div className="glass-card mx-auto max-w-4xl p-8 text-center md:p-12">
        <h2 className="font-display text-4xl">Join the Blossom note list</h2>
        <p className="mt-3 text-cocoa/70">Get new collection drops, custom gift slots, and festive craft offers.</p>
        <form className="mx-auto mt-7 flex max-w-xl flex-col gap-3 sm:flex-row">
          <input className="input" type="email" placeholder="Enter your email" />
          <button className="btn-primary justify-center" type="button">Subscribe</button>
        </form>
      </div>
    </section>
    </>
  );
};

export default Home;
