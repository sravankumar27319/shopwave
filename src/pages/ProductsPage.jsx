import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { products, categories } from "../data/products";
import ProductCard from "../components/products/ProductCard";
import { ProductCardSkeleton } from "../components/ui/Skeletons";

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
  { value: "newest", label: "Newest" },
];

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("featured");
  const [priceRange, setPriceRange] = useState([0, 15000]);
  const [filterOpen, setFilterOpen] = useState(false);

  const categoryParam = searchParams.get("category") || "all";
  const searchParam = searchParams.get("search") || "";

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, [categoryParam, searchParam]);

  const filtered = useMemo(() => {
    let list = [...products];

    if (categoryParam && categoryParam !== "all") {
      list = list.filter((p) => p.category === categoryParam);
    }

    if (searchParam) {
      const q = searchParam.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    list = list.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

    switch (sort) {
      case "price-asc": list.sort((a, b) => a.price - b.price); break;
      case "price-desc": list.sort((a, b) => b.price - a.price); break;
      case "rating": list.sort((a, b) => b.rating - a.rating); break;
      default: break;
    }

    return list;
  }, [categoryParam, searchParam, sort, priceRange]);

  const setCategory = (cat) => {
    const params = new URLSearchParams(searchParams);
    if (cat === "all") {
      params.delete("category");
    } else {
      params.set("category", cat);
    }
    params.delete("search");
    setSearchParams(params);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="font-display text-4xl text-stone-900 capitalize">
          {searchParam
            ? `Results for "${searchParam}"`
            : categoryParam === "all"
            ? "All Products"
            : categoryParam}
        </h1>
        <p className="text-sm text-stone-400 mt-1">{filtered.length} items</p>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            className={`flex-none px-4 py-2 text-sm font-body tracking-wide border transition-colors whitespace-nowrap ${
              categoryParam === cat.id || (cat.id === "all" && categoryParam === "all")
                ? "bg-stone-900 text-white border-stone-900"
                : "bg-white text-stone-600 border-stone-200 hover:border-stone-400"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="flex gap-8">
        {/* Sidebar filters — desktop */}
        <aside className="hidden lg:block w-56 flex-none">
          <FilterPanel priceRange={priceRange} onPriceChange={setPriceRange} />
        </aside>

        {/* Products grid */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-5">
            <button
              className="lg:hidden flex items-center gap-2 text-sm text-stone-600 border border-stone-200 px-3 py-2"
              onClick={() => setFilterOpen(true)}
            >
              <SlidersHorizontal size={14} />
              Filters
            </button>

            <div className="flex items-center gap-2 ml-auto">
              <span className="text-sm text-stone-400 hidden sm:block">Sort by</span>
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="text-sm border border-stone-200 px-3 py-2 pr-8 appearance-none bg-white focus:outline-none focus:border-stone-400 cursor-pointer"
                >
                  {sortOptions.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-display text-2xl text-stone-400 mb-2">No products found</p>
              <p className="text-sm text-stone-400">Try adjusting your filters or search term.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      {filterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-stone-900/40"
            onClick={() => setFilterOpen(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-72 bg-white p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-xl">Filters</h3>
              <button onClick={() => setFilterOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <FilterPanel priceRange={priceRange} onPriceChange={setPriceRange} />
          </div>
        </div>
      )}
    </div>
  );
}

function FilterPanel({ priceRange, onPriceChange }) {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-xs font-semibold text-stone-500 uppercase tracking-widest mb-3">
          Price Range
        </h4>
        <div className="space-y-3">
          <input
            type="range"
            min={0}
            max={15000}
            step={500}
            value={priceRange[1]}
            onChange={(e) => onPriceChange([priceRange[0], +e.target.value])}
            className="w-full accent-amber-600"
          />
          <div className="flex justify-between text-xs text-stone-500">
            <span>₹{priceRange[0].toLocaleString()}</span>
            <span>₹{priceRange[1].toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-xs font-semibold text-stone-500 uppercase tracking-widest mb-3">
          Rating
        </h4>
        {[4, 3, 2].map((r) => (
          <label key={r} className="flex items-center gap-2 py-1 cursor-pointer text-sm text-stone-600">
            <input type="checkbox" className="accent-amber-600" />
            {"★".repeat(r)}{"☆".repeat(5 - r)} & above
          </label>
        ))}
      </div>
    </div>
  );
}
