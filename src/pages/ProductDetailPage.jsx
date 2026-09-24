import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Heart, ShoppingBag, Star, Truck, RefreshCw, ChevronRight, Plus, Minus, Share2 } from "lucide-react";
import { products } from "../data/products";
import { useCart, useWishlist } from "../context/ShopContext";
import ProductCard from "../components/products/ProductCard";
import { ProductDetailSkeleton } from "../components/ui/Skeletons";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [tab, setTab] = useState("description");

  const { dispatch: cartDispatch } = useCart();
  const { wishlist, dispatch: wishDispatch } = useWishlist();

  const product = products.find((p) => p.id === Number(id));
  const related = products.filter((p) => p.category === product?.category && p.id !== product?.id).slice(0, 4);
  const isWished = wishlist.some((i) => i.id === product?.id);

  useEffect(() => {
    setLoading(true);
    setActiveImg(0);
    setSelectedSize(null);
    setSelectedColor(null);
    setQty(1);
    setAdded(false);
    const t = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(t);
  }, [id]);

  if (loading) return <ProductDetailSkeleton />;
  if (!product) return (
    <div className="text-center py-24">
      <p className="font-display text-3xl text-stone-400">Product not found</p>
      <Link to="/products" className="text-sm text-amber-600 underline mt-4 block">Back to shop</Link>
    </div>
  );

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  const handleAddToCart = () => {
    cartDispatch({
      type: "ADD",
      item: {
        ...product,
        size: selectedSize || product.sizes[0],
        color: selectedColor || product.colors[0],
        qty,
      },
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-stone-400 mb-6">
        <Link to="/" className="hover:text-stone-600">Home</Link>
        <ChevronRight size={12} />
        <Link to="/products" className="hover:text-stone-600">Products</Link>
        <ChevronRight size={12} />
        <Link to={`/products?category=${product.category}`} className="hover:text-stone-600 capitalize">{product.category}</Link>
        <ChevronRight size={12} />
        <span className="text-stone-600">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
        {/* Images */}
        <div className="space-y-3">
          <div className="aspect-4/5 overflow-hidden bg-stone-50">
            <img
              src={product.images[activeImg]}
              alt={product.name}
              className="w-full h-full object-cover transition-opacity duration-300"
            />
          </div>
          <div className="flex gap-2">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={`w-20 h-20 overflow-hidden border-2 transition-colors ${
                  i === activeImg ? "border-stone-900" : "border-transparent"
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Details */}
        <div>
          {product.badge && (
            <span className="inline-block bg-amber-100 text-amber-800 text-xs font-semibold px-2 py-1 mb-3">
              {product.badge}
            </span>
          )}

          <h1 className="font-display text-4xl text-stone-900 mb-2">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={i < Math.round(product.rating) ? "text-amber-500 fill-amber-500" : "text-stone-200 fill-stone-200"}
                />
              ))}
            </div>
            <span className="text-sm text-stone-500">{product.rating} · {product.reviews} reviews</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="font-display text-3xl text-stone-900">₹{product.price.toLocaleString()}</span>
            <span className="text-base text-stone-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
            <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-0.5">{discount}% off</span>
          </div>

          {/* Colors */}
          <div className="mb-5">
            <p className="text-sm text-stone-500 mb-2">
              Color: <span className="text-stone-900 font-medium">{selectedColor || "Select"}</span>
            </p>
            <div className="flex gap-2">
              {product.colors.map((c, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedColor(c)}
                  style={{ backgroundColor: c }}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    selectedColor === c ? "border-stone-900 scale-110" : "border-stone-200"
                  }`}
                  aria-label={c}
                />
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div className="mb-6">
            <p className="text-sm text-stone-500 mb-2">
              Size: <span className="text-stone-900 font-medium">{selectedSize || "Select"}</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`px-4 py-2 text-sm border transition-colors ${
                    selectedSize === s
                      ? "border-stone-900 bg-stone-900 text-white"
                      : "border-stone-200 text-stone-700 hover:border-stone-400"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center border border-stone-200">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="px-3 py-2 text-stone-600 hover:text-stone-900 transition-colors"
              >
                <Minus size={14} />
              </button>
              <span className="px-4 text-sm font-medium text-stone-900 border-x border-stone-200">
                {qty}
              </span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="px-3 py-2 text-stone-600 hover:text-stone-900 transition-colors"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={handleAddToCart}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-semibold tracking-wide transition-all ${
                added
                  ? "bg-green-600 text-white"
                  : "bg-stone-900 text-white hover:bg-amber-700"
              }`}
            >
              <ShoppingBag size={16} />
              {added ? "Added to Bag!" : "Add to Bag"}
            </button>
            <button
              onClick={() => wishDispatch({ type: "TOGGLE", item: product })}
              className={`p-3.5 border transition-colors ${
                isWished
                  ? "border-rose-500 bg-rose-50 text-rose-500"
                  : "border-stone-200 text-stone-700 hover:border-rose-400 hover:text-rose-400"
              }`}
              aria-label="Wishlist"
            >
              <Heart size={18} fill={isWished ? "currentColor" : "none"} />
            </button>
            <button className="p-3.5 border border-stone-200 text-stone-700 hover:border-stone-400 transition-colors">
              <Share2 size={18} />
            </button>
          </div>

          {/* Delivery info */}
          <div className="space-y-2 border-t border-stone-100 pt-5">
            {[
              { Icon: Truck, text: "Free delivery on orders above ₹999" },
              { Icon: RefreshCw, text: "Easy 30-day returns & exchanges" },
            ].map(({ Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-xs text-stone-500">
                <Icon size={13} />
                {text}
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="mt-8 border-t border-stone-100">
            <div className="flex gap-6 mb-4 pt-4">
              {["description", "features"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`text-sm capitalize pb-1 border-b-2 transition-colors ${
                    tab === t ? "border-stone-900 text-stone-900" : "border-transparent text-stone-400"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            {tab === "description" && (
              <p className="text-sm text-stone-600 leading-relaxed">{product.description}</p>
            )}
            {tab === "features" && (
              <ul className="space-y-2">
                {product.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-stone-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600 flex-none" />
                    {f}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-3xl text-stone-900 mb-6">You May Also Like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
