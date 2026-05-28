import { Heart, Menu, Search, ShoppingBag, UserRound, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const links = [
  { label: "Shop", path: "/products" },
  { label: "Categories", path: "/categories" },
  { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" }
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const { items, wishlist } = useCart();
  const { user, adminUser, logout } = useAuth();
  const navigate = useNavigate();

  const submitSearch = (event) => {
    event.preventDefault();
    if (!query.trim()) return;
    navigate(`/products?search=${encodeURIComponent(query.trim())}`);
    setSearchOpen(false);
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/70 bg-cream/80 backdrop-blur-xl">
      <nav className="container flex h-20 items-center justify-between">
        <Link to="/" className="font-display text-3xl font-semibold text-cocoa">
          Blossom Studio
        </Link>
        <div className="hidden items-center gap-7 lg:flex">
          {links.map((link) => (
            <NavLink
              key={link.label}
              to={link.path}
              className={({ isActive }) => `nav-link ${isActive ? "text-cocoa" : "text-cocoa/70"}`}
            >
              {link.label}
            </NavLink>
          ))}
        </div>
        <div className="hidden items-center gap-3 sm:flex">
          <button className="icon-btn" aria-label="Search products" onClick={() => setSearchOpen(true)}><Search size={19} /></button>
          <Link to="/wishlist" className="icon-btn relative" aria-label="Wishlist">
            <Heart size={19} />
            {wishlist.length > 0 && <span className="count-badge">{wishlist.length}</span>}
          </Link>
          <Link to="/cart" className="icon-btn relative" aria-label="Cart">
            <ShoppingBag size={19} />
            {items.length > 0 && <span className="count-badge">{items.length}</span>}
          </Link>
          {adminUser?.role === "admin" && (
            <Link to="/admin" className="btn-secondary !px-4 !py-2">Admin</Link>
          )}
          {user ? (
            <Link to="/profile" className="icon-btn" aria-label="Profile"><UserRound size={19} /></Link>
          ) : (
            <Link to="/login" className="icon-btn" aria-label="Account"><UserRound size={19} /></Link>
          )}
          {user && <button className="btn-secondary !px-4 !py-2" onClick={logout}>Logout</button>}
        </div>
        <button className="icon-btn lg:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X /> : <Menu />}
        </button>
      </nav>
      {open && (
        <div className="container grid gap-3 pb-5 lg:hidden">
          {links.map((link) => (
            <Link
              key={link.label}
              to={link.path}
              className="rounded-full bg-white/60 px-4 py-3"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link to="/cart" className="rounded-full bg-cocoa px-4 py-3 text-white" onClick={() => setOpen(false)}>
            Cart ({items.length})
          </Link>
          <Link to="/wishlist" className="rounded-full bg-white/60 px-4 py-3" onClick={() => setOpen(false)}>
            Wishlist ({wishlist.length})
          </Link>
          {adminUser?.role === "admin" && (
            <Link to="/admin" className="rounded-full bg-white/60 px-4 py-3" onClick={() => setOpen(false)}>
              Admin dashboard
            </Link>
          )}
          {user ? (
            <>
              <Link to="/profile" className="rounded-full bg-white/60 px-4 py-3" onClick={() => setOpen(false)}>
                My profile
              </Link>
              <button className="rounded-full bg-white/60 px-4 py-3 text-left" onClick={() => { logout(); setOpen(false); }}>
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="rounded-full bg-white/60 px-4 py-3" onClick={() => setOpen(false)}>
              Login
            </Link>
          )}
        </div>
      )}
      {searchOpen && (
        <div className="fixed inset-0 z-50 grid place-items-start bg-cocoa/30 px-4 pt-28 backdrop-blur-sm">
          <form onSubmit={submitSearch} className="mx-auto flex w-full max-w-2xl gap-3 rounded-[2rem] bg-white p-3 shadow-soft">
            <input className="flex-1 rounded-full px-5 outline-none" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search handmade products..." autoFocus />
            <button className="btn-primary" type="submit"><Search size={18} /> Search</button>
            <button className="icon-btn" type="button" onClick={() => setSearchOpen(false)}><X size={18} /></button>
          </form>
        </div>
      )}
    </header>
  );
};

export default Navbar;
