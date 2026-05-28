import { Link } from "react-router-dom";
import SectionHeader from "../components/SectionHeader";
import Loader from "../components/Loader";
import { useCategories } from "../hooks/useCategories";

const Categories = () => {
  const { categories, loading, source } = useCategories();

  return (
    <section className="section">
      <SectionHeader eyebrow="Collections" title="Choose Your Craft Mood" />
      {source === "offline" && (
        <div className="mb-5 rounded-2xl bg-petal px-5 py-3 text-sm font-semibold">
          Categories need backend and MongoDB. Please start the backend and check MongoDB connection.
        </div>
      )}
      {loading ? <Loader /> : (
        <div className="grid gap-6 md:grid-cols-2">
          {categories.length ? categories.map((category) => (
            <Link key={category._id || category.name} to={`/products?category=${category.apiCategory}`} className="group relative min-h-80 overflow-hidden rounded-[2rem] shadow-soft">
              <img src={category.image} alt={category.name} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-cocoa/75 to-transparent" />
              <div className="absolute bottom-0 p-8 text-white">
                <h2 className="font-display text-4xl">{category.name}</h2>
                <p className="mt-2 text-white/80">{category.subtitle}</p>
              </div>
            </Link>
          )) : <p className="text-cocoa/70">No categories yet. Add a category or add a product with a new category from the admin panel.</p>}
        </div>
      )}
    </section>
  );
};

export default Categories;
