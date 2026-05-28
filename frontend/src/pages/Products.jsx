import { Search } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import Loader from "../components/Loader";
import ProductCard from "../components/ProductCard";
import SectionHeader from "../components/SectionHeader";
import { useCategories } from "../hooks/useCategories";
import { useProducts } from "../hooks/useProducts";

const Products = () => {
  const [params, setParams] = useSearchParams();
  const category = params.get("category") || "";
  const search = params.get("search") || "";
  const { products, loading, source } = useProducts({ category, search });
  const { categories } = useCategories();

  const setFilter = (next) => {
    const copy = new URLSearchParams(params);
    if (next.category !== undefined) next.category ? copy.set("category", next.category) : copy.delete("category");
    if (next.search !== undefined) next.search ? copy.set("search", next.search) : copy.delete("search");
    setParams(copy);
  };

  return (
    <section className="section">
      <SectionHeader eyebrow="Shop" title="Handmade Products" text="Search, filter, wishlist, and add your favorites to cart." />
      {source === "offline" && (
        <div className="mb-5 rounded-2xl bg-petal px-5 py-3 text-sm font-semibold">
          Products need backend and MongoDB. Please start the backend and check MongoDB connection.
        </div>
      )}
      <div className="mb-8 grid gap-4 rounded-[2rem] bg-white/50 p-4 shadow-soft md:grid-cols-[1fr_auto]">
        <label className="flex items-center gap-3 rounded-full bg-white px-4">
          <Search size={19} />
          <input className="w-full bg-transparent py-3 outline-none" value={search} onChange={(e) => setFilter({ search: e.target.value })} placeholder="Search crochet, flowers, gifts..." />
        </label>
        <select className="input md:w-64" value={category} onChange={(e) => setFilter({ category: e.target.value })}>
          <option value="">All categories</option>
          {categories.map((item) => <option key={item.name} value={item.apiCategory}>{item.name}</option>)}
        </select>
      </div>
      {loading ? <Loader /> : (
        products.length ? (
          <div className="product-grid">{products.map((product) => <ProductCard key={product._id} product={product} />)}</div>
        ) : (
          <div className="glass-card p-8">
            <h2 className="font-display text-3xl">No products yet</h2>
            <p className="mt-2 text-cocoa/70">Add products with your own images from the admin panel.</p>
          </div>
        )
      )}
    </section>
  );
};

export default Products;
