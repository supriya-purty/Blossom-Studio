import { Instagram, Mail, MessageCircle, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { contactDetails } from "../data/catalog";

const Footer = () => (
  <footer className="mt-20 border-t border-cocoa/10 bg-[#fbf5ef] text-cocoa">
    <div className="container grid gap-10 py-16 md:grid-cols-4">
      <div>
        <h2 className="font-display text-3xl text-blush">Blossom Studio</h2>
        <p className="mt-5 max-w-xs leading-7 text-cocoa/70">
          Delivering custom-made creative solutions with a personal touch toward customers. Crafted
          with love, just for you.
        </p>
        <a className="mt-6 inline-flex items-center gap-2 text-blush" href={contactDetails.instagramUrl} target="_blank" rel="noreferrer">
          <Instagram size={18} /> @{contactDetails.instagramHandle}
        </a>
      </div>
      <div>
        <h3 className="font-semibold">Shop</h3>
        <div className="mt-5 grid gap-3 text-cocoa/70">
          <Link to="/products">All Products</Link>
          <Link to="/categories">Categories</Link>
          <Link to="/wishlist">My Wishlist</Link>
        </div>
      </div>
      <div>
        <h3 className="font-semibold">Customer Care</h3>
        <div className="mt-5 grid gap-3 text-cocoa/70">
          <Link to="/contact">Contact Us</Link>
          <Link to="/faq">FAQ</Link>
          <Link to="/profile">Track My Order</Link>
          <a href={contactDetails.whatsappUrl} target="_blank" rel="noreferrer">WhatsApp Us</a>
        </div>
      </div>
      <div>
        <h3 className="font-semibold">About</h3>
        <div className="mt-5 grid gap-3 text-cocoa/70">
          <Link to="/about">Our Story</Link>
          <Link to="/about">Our Process</Link>
          <a href={`mailto:${contactDetails.email}`}>{contactDetails.email}</a>
        </div>
      </div>
    </div>
    <div className="container flex flex-wrap items-center justify-between gap-4 border-t border-cocoa/10 py-7 text-cocoa/65">
      <p>© 2026 Blossom Studio. All rights reserved. Made with love in India.</p>
      <div className="flex flex-wrap gap-5">
        <a className="inline-flex items-center gap-2" href={contactDetails.instagramUrl} target="_blank" rel="noreferrer"><Instagram size={18} /> Instagram</a>
        <a className="inline-flex items-center gap-2" href={contactDetails.whatsappUrl} target="_blank" rel="noreferrer"><MessageCircle size={18} /> WhatsApp</a>
        <a className="inline-flex items-center gap-2" href={`tel:+91${contactDetails.phone}`}><Phone size={18} /> +91 {contactDetails.phone}</a>
        <a className="inline-flex items-center gap-2" href={`mailto:${contactDetails.email}`}><Mail size={18} /> Email</a>
      </div>
    </div>
  </footer>
);

export default Footer;
