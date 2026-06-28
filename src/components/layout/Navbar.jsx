import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ShoppingBag, Heart, Search, Menu, X, ChevronDown } from "lucide-react";
import { useCart } from "../../context/ShopContext";
import { useWishlist } from "../../context/ShopContext";

const navLinks = [
  { label: "Women", href: "/products?category=women" },
  { label: "Men", href: "/products?category=men" },
  { label: "Kids", href: "/products?category=kids" },
  { label: "Accessories", href: "/products?category=accessories" },
  { label: "Footwear", href: "/products?category=footwear" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchVal.trim())}`);
      setSearchOpen(false);
      setSearchVal("");
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-white/95 backdrop-blur-sm shadow-sm" : "bg-white"
        }`}
      >
        {/* Announcement bar */}
        <div className="bg-stone-900 text-stone-100 text-center py-2 text-xs font-body tracking-widest uppercase">
          Free shipping on orders above ₹999 · Use code WAVE10 for 10% off
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Mobile menu toggle */}
            <button
              className="lg:hidden p-2 -ml-2 text-stone-700"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            {/* Logo */}
            <Link
              to="/"
              className="font-display text-2xl font-semibold tracking-wide text-stone-900 absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0"
            >
              ShopWave
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((l) => (
                <Link
                  key={l.label}
                  to={l.href}
                  className="text-sm font-body text-stone-600 hover:text-stone-900 tracking-wide transition-colors relative group"
                >
                  {l.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-stone-900 transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-stone-700 hover:text-stone-900 transition-colors"
                aria-label="Search"
              >
                <Search size={20} />
              </button>

              <Link
                to="/wishlist"
                className="p-2 text-stone-700 hover:text-stone-900 transition-colors relative"
                aria-label="Wishlist"
              >
                <Heart size={20} />
                {wishlist.length > 0 && (
                  <span className="absolute top-1 right-1 bg-rose-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-semibold leading-none">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              <Link
                to="/cart"
                className="p-2 text-stone-700 hover:text-stone-900 transition-colors relative"
                aria-label="Cart"
              >
                <ShoppingBag size={20} />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 bg-amber-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-semibold leading-none">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* Search dropdown */}
        {searchOpen && (
          <div className="border-t border-stone-100 bg-white px-4 py-4 shadow-lg">
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative">
              <input
                autoFocus
                type="text"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                placeholder="Search for products, categories…"
                className="w-full border border-stone-200 rounded-sm px-4 py-3 pr-12 text-sm font-body focus:outline-none focus:border-stone-400 bg-stone-50"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-900"
              >
                <Search size={18} />
              </button>
            </form>
          </div>
        )}

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-stone-100 bg-white shadow-xl">
            <nav className="flex flex-col p-4 gap-1">
              {navLinks.map((l) => (
                <Link
                  key={l.label}
                  to={l.href}
                  className="py-3 px-2 text-stone-700 font-body border-b border-stone-50 text-sm tracking-wide"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>
      {/* Spacer for fixed header */}
      <div className="h-[calc(2.5rem+4rem)]" />
    </>
  );
}
