import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "../context/ShopContext";

export default function CartPage() {
  const { cart, dispatch } = useCart();

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal >= 999 ? 0 : 99;
  const total = subtotal + shipping;
  const savings = cart.reduce((s, i) => s + (i.originalPrice - i.price) * i.qty, 0);

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-6">
          <ShoppingBag size={36} className="text-stone-300" />
        </div>
        <h2 className="font-display text-3xl text-stone-900 mb-2">Your bag is empty</h2>
        <p className="text-stone-400 text-sm mb-8">Looks like you haven't added anything yet.</p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 bg-stone-900 text-white px-8 py-3.5 text-sm font-semibold hover:bg-amber-700 transition-colors"
        >
          Start Shopping
          <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="font-display text-4xl text-stone-900 mb-8">Shopping Bag</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <CartItem key={`${item.id}-${item.size}-${item.color}`} item={item} dispatch={dispatch} />
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-stone-50 p-6 sticky top-24">
            <h3 className="font-display text-xl text-stone-900 mb-5">Order Summary</h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-stone-500">Subtotal ({cart.reduce((s, i) => s + i.qty, 0)} items)</span>
                <span className="text-stone-900">₹{subtotal.toLocaleString()}</span>
              </div>
              {savings > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>You save</span>
                  <span>-₹{savings.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-stone-500">Shipping</span>
                <span className={shipping === 0 ? "text-green-600" : "text-stone-900"}>
                  {shipping === 0 ? "Free" : `₹${shipping}`}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-stone-400">
                  Add ₹{(999 - subtotal).toLocaleString()} more for free shipping
                </p>
              )}
              <div className="border-t border-stone-200 pt-3 flex justify-between font-semibold text-base">
                <span className="text-stone-900">Total</span>
                <span className="text-stone-900">₹{total.toLocaleString()}</span>
              </div>
            </div>

            <button className="w-full bg-stone-900 text-white py-3.5 mt-6 text-sm font-semibold hover:bg-amber-700 transition-colors flex items-center justify-center gap-2">
              Proceed to Checkout
              <ArrowRight size={16} />
            </button>

            <button
              onClick={() => dispatch({ type: "CLEAR" })}
              className="w-full text-xs text-stone-400 hover:text-rose-500 transition-colors mt-4"
            >
              Clear bag
            </button>

            <div className="mt-5 border-t border-stone-200 pt-5">
              <p className="text-xs text-stone-400 text-center mb-3">We accept</p>
              <div className="flex items-center justify-center gap-2 flex-wrap">
                {["Visa", "Mastercard", "UPI", "NetBanking", "EMI"].map((m) => (
                  <span
                    key={m}
                    className="text-xs border border-stone-200 rounded px-2 py-1 text-stone-500"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CartItem({ item, dispatch }) {
  const discount = Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100);

  return (
    <div className="flex gap-4 bg-white border border-stone-100 p-4">
      <Link to={`/products/${item.id}`} className="flex-none">
        <img
          src={item.image}
          alt={item.name}
          className="w-24 h-32 sm:w-28 sm:h-36 object-cover bg-stone-50"
        />
      </Link>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between gap-2">
          <div>
            <p className="text-xs text-stone-400 uppercase tracking-widest mb-1">{item.category}</p>
            <Link
              to={`/products/${item.id}`}
              className="font-display text-base text-stone-900 hover:text-amber-700 transition-colors leading-tight block"
            >
              {item.name}
            </Link>
          </div>
          <button
            onClick={() => dispatch({ type: "REMOVE", id: item.id, size: item.size, color: item.color })}
            className="text-stone-300 hover:text-rose-500 transition-colors flex-none"
            aria-label="Remove"
          >
            <Trash2 size={16} />
          </button>
        </div>

        <div className="flex gap-4 text-xs text-stone-400 mt-2">
          <span>Size: <span className="text-stone-700">{item.size}</span></span>
          <span className="flex items-center gap-1">
            Color:
            <span
              className="w-3 h-3 rounded-full border border-stone-200 inline-block"
              style={{ backgroundColor: item.color }}
            />
          </span>
        </div>

        <div className="flex items-center justify-between mt-4">
          {/* Qty */}
          <div className="flex items-center border border-stone-200">
            <button
              onClick={() =>
                item.qty === 1
                  ? dispatch({ type: "REMOVE", id: item.id, size: item.size, color: item.color })
                  : dispatch({ type: "UPDATE_QTY", id: item.id, size: item.size, color: item.color, qty: item.qty - 1 })
              }
              className="px-2.5 py-1.5 text-stone-600 hover:text-stone-900"
            >
              <Minus size={12} />
            </button>
            <span className="px-3 text-sm border-x border-stone-200">{item.qty}</span>
            <button
              onClick={() =>
                dispatch({ type: "UPDATE_QTY", id: item.id, size: item.size, color: item.color, qty: item.qty + 1 })
              }
              className="px-2.5 py-1.5 text-stone-600 hover:text-stone-900"
            >
              <Plus size={12} />
            </button>
          </div>

          {/* Price */}
          <div className="text-right">
            <p className="text-sm font-semibold text-stone-900">
              ₹{(item.price * item.qty).toLocaleString()}
            </p>
            {discount > 0 && (
              <p className="text-xs text-stone-400 line-through">
                ₹{(item.originalPrice * item.qty).toLocaleString()}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
