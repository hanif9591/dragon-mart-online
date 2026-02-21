\
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Search,
  Star,
  X,
  Minus,
  Plus,
  Truck,
  ShieldCheck,
  RotateCcw,
  Filter,
  ChevronDown,
  User,
  LogOut,
  Package,
  Settings,
  Upload,
} from "lucide-react";

/** ---------------------------------------------
 * Minimal UI primitives (Tailwind-only)
 * ----------------------------------------------*/
function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "icon";
}) {
  const base =
    "inline-flex items-center justify-center gap-2 font-semibold transition rounded-2xl select-none";
  const sizes =
    size === "icon"
      ? "h-10 w-10"
      : size === "sm"
      ? "h-9 px-3 text-sm"
      : "h-10 px-4 text-sm";
  const variants =
    variant === "secondary"
      ? "bg-white/15 text-white hover:bg-white/20"
      : variant === "ghost"
      ? "bg-transparent hover:bg-black/5"
      : "bg-red-600 text-white hover:bg-orange-600";
  return (
    <button className={cn(base, sizes, variants, className)} {...props}>
      {children}
    </button>
  );
}

function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-10 w-full rounded-2xl border border-black/10 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-orange-400",
        className
      )}
      {...props}
    />
  );
}

function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("rounded-3xl border border-black/10 bg-white shadow-sm", className)}>{children}</div>;
}
function CardHeader({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("p-5 pb-3", className)}>{children}</div>;
}
function CardTitle({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("text-base font-black", className)}>{children}</div>;
}
function CardContent({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("p-5 pt-0", className)}>{children}</div>;
}
function Badge({
  children,
  variant = "default",
  className,
}: {
  children: React.ReactNode;
  variant?: "default" | "secondary" | "destructive";
  className?: string;
}) {
  const v =
    variant === "secondary"
      ? "bg-black/5 text-black"
      : variant === "destructive"
      ? "bg-red-600 text-white"
      : "bg-orange-600 text-white";
  return <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold", v, className)}>{children}</span>;
}

/** Simple modal */
function Modal({
  open,
  onClose,
  title,
  children,
  widthClass = "max-w-md",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  widthClass?: string;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute inset-0 grid place-items-center p-4">
        <div className={cn("w-full rounded-3xl bg-white shadow-xl", widthClass)}>
          <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
            <div className="text-lg font-black">{title}</div>
            <button className="h-10 w-10 grid place-items-center rounded-2xl hover:bg-black/5" onClick={onClose}>
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="p-5">{children}</div>
        </div>
      </div>
    </div>
  );
}

/** Simple right drawer */
function Drawer({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("fixed inset-0 z-50", open ? "" : "pointer-events-none")}>
      <div
        className={cn("absolute inset-0 bg-black/40 transition", open ? "opacity-100" : "opacity-0")}
        onClick={onClose}
      />
      <div
        className={cn(
          "absolute right-0 top-0 h-full w-full sm:w-[420px] bg-white shadow-2xl transition-transform",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
          <div className="text-lg font-black">{title}</div>
          <button className="h-10 w-10 grid place-items-center rounded-2xl hover:bg-black/5" onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-5 overflow-auto h-[calc(100%-72px)]">{children}</div>
      </div>
    </div>
  );
}

/** ---------------------------------------------
 * Brand: unique logo (inline SVG)
 * ----------------------------------------------*/
function DragonMartLogo() {
  return (
    <div className="h-9 w-9 rounded-2xl bg-white/15 grid place-items-center">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path
          d="M6 14c2.8-5.6 7.2-8.4 12-9-1.2 2.6-1.8 4.9-1.8 7.2C16.2 17 12.3 20 8.3 20c-2 0-3.6-0.7-4.3-2.1-.5-1 .2-2.6 2-3.9Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path d="M10.2 10.5c.8-1.4 2.1-2.7 3.8-3.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M16.8 12.2c.8.4 1.4 1 1.8 1.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    </div>
  );
}

/** ---------------------------------------------
 * Demo data (replace with DB later)
 * ----------------------------------------------*/
const CATEGORIES = ["All", "Electronics", "Home", "Fashion", "Beauty", "Sports", "Books"];

const DEMO_PRODUCTS = [
  {
    id: "p1",
    title: "Noise-Cancelling Wireless Headphones",
    category: "Electronics",
    price: 899,
    rating: 4.6,
    reviews: 18342,
    prime: true,
    stock: 14,
    img: "https://images.unsplash.com/photo-1518441902117-f0a9e9f8d1d4?auto=format&fit=crop&w=1200&q=60",
    desc: "Immersive sound, all-day comfort, and adaptive noise cancelling for work, travel, and everything in between.",
  },
  {
    id: "p2",
    title: "Smart LED Strip Lights (5m)",
    category: "Home",
    price: 109,
    rating: 4.4,
    reviews: 9251,
    prime: true,
    stock: 67,
    img: "https://images.unsplash.com/photo-1559245010-6564f5d4f8c5?auto=format&fit=crop&w=1200&q=60",
    desc: "Sync colors to your mood. Voice control, scenes, and easy setup for bedrooms, desks, and gaming rooms.",
  },
  {
    id: "p3",
    title: "Stainless Steel Water Bottle (1L)",
    category: "Sports",
    price: 69,
    rating: 4.8,
    reviews: 40210,
    prime: false,
    stock: 120,
    img: "https://images.unsplash.com/photo-1526401485004-2fda9f6d3d38?auto=format&fit=crop&w=1200&q=60",
    desc: "Double-wall insulation keeps drinks cold for up to 24h. Leak-proof cap and durable powder coat.",
  },
  {
    id: "p4",
    title: "Everyday Cotton T-Shirt (Pack of 3)",
    category: "Fashion",
    price: 125,
    rating: 4.2,
    reviews: 6110,
    prime: true,
    stock: 33,
    img: "https://images.unsplash.com/photo-1520975682038-5c1a605d7d51?auto=format&fit=crop&w=1200&q=60",
    desc: "Soft, breathable, and made to last. Minimal fit with reinforced seams—your daily go-to.",
  },
  {
    id: "p5",
    title: "Hydrating Face Moisturizer (50ml)",
    category: "Beauty",
    price: 79,
    rating: 4.5,
    reviews: 14220,
    prime: true,
    stock: 49,
    img: "https://images.unsplash.com/photo-1585232351009-aa87416fca90?auto=format&fit=crop&w=1200&q=60",
    desc: "Lightweight hydration with a smooth finish. Suitable for all skin types. Fragrance-free.",
  },
  {
    id: "p6",
    title: "Modern Desk Lamp with USB-C",
    category: "Home",
    price: 165,
    rating: 4.3,
    reviews: 3180,
    prime: false,
    stock: 8,
    img: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=60",
    desc: "Warm-to-cool tones, touch dimming, and a built-in USB-C charger to keep your workspace tidy.",
  },
  {
    id: "p7",
    title: "Bestselling Novel: Paperback Edition",
    category: "Books",
    price: 39,
    rating: 4.7,
    reviews: 20155,
    prime: true,
    stock: 210,
    img: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=60",
    desc: "A page-turner you can’t put down—compelling characters, smart twists, and a satisfying ending.",
  },
  {
    id: "p8",
    title: "Fitness Resistance Bands Set",
    category: "Sports",
    price: 55,
    rating: 4.1,
    reviews: 8340,
    prime: true,
    stock: 96,
    img: "https://images.unsplash.com/photo-1599058917765-8a9f7c2b9b5b?auto=format&fit=crop&w=1200&q=60",
    desc: "Progressive resistance with comfy handles—ideal for warmups, rehab, and full-body workouts.",
  },
];

function formatMoneyAED(n: number) {
  return n.toLocaleString(undefined, { style: "currency", currency: "AED" });
}

function Stars({ value }: { value: number }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  const stars = Array.from({ length: 5 }, (_, i) => {
    const idx = i + 1;
    const filled = idx <= full || (idx === full + 1 && half);
    return (
      <Star
        key={i}
        className={cn("h-4 w-4", filled ? "" : "opacity-30")}
        fill={filled ? "currentColor" : "none"}
      />
    );
  });
  return <div className="flex items-center gap-0.5">{stars}</div>;
}

/** Session (demo) */
function useSession() {
  const [session, setSession] = useState<any>(() => {
    try {
      const raw = localStorage.getItem("dmo_session");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("dmo_session", JSON.stringify(session));
    } catch {}
  }, [session]);

  return { session, setSession };
}

export default function Page() {
  const { session, setSession } = useSession();

  const [page, setPage] = useState<"home" | "orders" | "admin">("home");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState<"featured" | "price_asc" | "price_desc" | "rating_desc">("featured");
  const [onlyPrime, setOnlyPrime] = useState(false);
  const [priceMax, setPriceMax] = useState(1500);

  const [products, setProducts] = useState<any[]>(() => {
    try {
      const raw = localStorage.getItem("dmo_products");
      return raw ? JSON.parse(raw) : DEMO_PRODUCTS;
    } catch {
      return DEMO_PRODUCTS;
    }
  });

  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<Record<string, number>>(() => {
    try {
      const raw = localStorage.getItem("dmo_cart");
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  const [orders, setOrders] = useState<any[]>(() => {
    try {
      const raw = localStorage.getItem("dmo_orders");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [productOpen, setProductOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState<any>(null);

  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    try { localStorage.setItem("dmo_cart", JSON.stringify(cart)); } catch {}
  }, [cart]);

  useEffect(() => {
    try { localStorage.setItem("dmo_orders", JSON.stringify(orders)); } catch {}
  }, [orders]);

  useEffect(() => {
    try { localStorage.setItem("dmo_products", JSON.stringify(products)); } catch {}
  }, [products]);

  const cartCount = useMemo(() => Object.values(cart).reduce((a, b) => a + b, 0), [cart]);

  const cartItems = useMemo(() => {
    const map = new Map(products.map((p) => [p.id, p]));
    return Object.entries(cart)
      .map(([id, qty]) => ({ product: map.get(id), qty }))
      .filter((x) => x.product);
  }, [cart, products]);

  const subtotal = useMemo(
    () => cartItems.reduce((sum, { product, qty }) => sum + product.price * qty, 0),
    [cartItems]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = products.filter((p) => {
      if (category !== "All" && p.category !== category) return false;
      if (onlyPrime && !p.prime) return false;
      if (p.price > priceMax) return false;
      if (!q) return true;
      return p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
    });

    if (sort === "price_asc") list = list.slice().sort((a, b) => a.price - b.price);
    if (sort === "price_desc") list = list.slice().sort((a, b) => b.price - a.price);
    if (sort === "rating_desc") list = list.slice().sort((a, b) => b.rating - a.rating);

    if (sort === "featured") {
      list = list
        .map((p) => ({ p, s: p.rating * 10 + Math.min(Math.max(p.stock, 0), 50) / 10 }))
        .sort((a, b) => b.s - a.s)
        .map((x) => x.p);
    }
    return list;
  }, [query, category, sort, onlyPrime, priceMax, products]);

  function addToCart(p: any) {
    setCart((c) => ({ ...c, [p.id]: (c[p.id] || 0) + 1 }));
    setCartOpen(true);
  }
  function inc(id: string) { setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 })); }
  function dec(id: string) {
    setCart((c) => {
      const next = { ...c };
      const v = (next[id] || 0) - 1;
      if (v <= 0) delete next[id];
      else next[id] = v;
      return next;
    });
  }
  function remove(id: string) {
    setCart((c) => {
      const next = { ...c };
      delete next[id];
      return next;
    });
  }
  function quickView(p: any) { setActiveProduct(p); setProductOpen(true); }
  function logout() { setSession(null); setPage("home"); }

  function createProduct(p: any) { setProducts((prev) => [p, ...prev]); }

  async function checkoutStripeDemo() {
    if (!session) { setAuthOpen(true); return; }
    const order = {
      id: Math.floor(100000 + Math.random() * 900000).toString(),
      createdAt: new Date().toISOString(),
      status: "Processing",
      total: subtotal,
      items: cartItems.map(({ product, qty }) => ({ productId: product.id, title: product.title, qty, price: product.price })),
      userEmail: session.email,
    };
    setOrders((o) => [order, ...o]);
    setCart({});
    setCartOpen(false);
    setPage("orders");
  }

  const isAdmin = session?.role === "admin";

  return (
    <div className="min-h-screen bg-orange-50">
      {/* Top bar */}
      <div className="sticky top-0 z-40">
        <div className="bg-gradient-to-r from-red-700 via-red-600 to-orange-500 text-white">
          <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-3">
            <button onClick={() => setPage("home")} className="flex items-center gap-2">
              <DragonMartLogo />
              <div className="leading-tight text-left">
                <div className="font-black tracking-tight">Dragon Mart Online</div>
                <div className="text-xs text-white/80">Deliver to UAE</div>
              </div>
            </button>

            <div className="flex-1 flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2">
                <select
                  value={category}
                  onChange={(e) => { setCategory(e.target.value); setPage("home"); }}
                  className="h-10 rounded-2xl bg-white/15 px-3 text-sm font-semibold outline-none"
                >
                  {CATEGORIES.map((c) => <option key={c} value={c} className="text-black">{c}</option>)}
                </select>
              </div>

              <div className="relative w-full">
                <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 opacity-80" />
                <Input
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setPage("home"); }}
                  placeholder="Search products, brands and more"
                  className="pl-9"
                />
              </div>
            </div>

            <Button variant="primary" onClick={() => setCartOpen(true)} className="relative">
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 h-5 min-w-5 px-1 rounded-full bg-white text-black text-xs grid place-items-center font-black">
                  {cartCount}
                </span>
              )}
            </Button>

            <div className="relative">
              <Button variant="primary" onClick={() => setAuthOpen(true)} className="hidden sm:inline-flex">
                <User className="h-4 w-4" />
                {session ? session.name : "Account"}
                <ChevronDown className="h-4 w-4" />
              </Button>

              {/* Small quick actions */}
              <div className="hidden md:flex gap-2 ml-2">
                {session && (
                  <>
                    <Button variant="secondary" onClick={() => setPage("orders")}>
                      <Package className="h-4 w-4" /> Orders
                    </Button>
                    {isAdmin && (
                      <Button variant="secondary" onClick={() => setPage("admin")}>
                        <Settings className="h-4 w-4" /> Admin
                      </Button>
                    )}
                    <Button variant="secondary" onClick={logout}>
                      <LogOut className="h-4 w-4" /> Logout
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-red-800 text-white/90 border-b border-red-700">
          <div className="mx-auto max-w-6xl px-4 py-2 flex items-center gap-3 overflow-x-auto">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => { setCategory(c); setPage("home"); }}
                className={cn(
                  "whitespace-nowrap text-sm px-3 py-1 rounded-2xl transition",
                  c === category ? "bg-white/15 text-white" : "hover:bg-white/10"
                )}
              >
                {c}
              </button>
            ))}
            <div className="ml-auto hidden md:flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1"><Truck className="h-4 w-4" /> Fast delivery</div>
              <div className="flex items-center gap-1"><ShieldCheck className="h-4 w-4" /> Secure payments</div>
              <div className="flex items-center gap-1"><RotateCcw className="h-4 w-4" /> Easy returns</div>
            </div>
          </div>
        </div>
      </div>

      {/* Pages */}
      {page === "home" && (
        <>
          {/* Hero */}
          <div className="mx-auto max-w-6xl px-4 pt-6">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-700 to-orange-500 text-white">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_20%,white,transparent_35%),radial-gradient(circle_at_70%_60%,white,transparent_35%)]" />
              <div className="relative p-6 md:p-10 grid md:grid-cols-2 gap-6 items-center">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs">
                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                    Deals updated daily
                  </div>
                  <h1 className="mt-4 text-2xl md:text-4xl font-black tracking-tight">
                    Dragon Mart Online — shop smart, save big.
                  </h1>
                  <p className="mt-3 text-white/90">
                    Amazon-style UI with search, filters, cart, login, orders, and admin upload.
                  </p>
                  <div className="mt-5 flex gap-2">
                    <Button onClick={() => window.scrollTo({ top: 520, behavior: "smooth" })}>
                      Shop now
                    </Button>
                    <Button variant="secondary">View categories</Button>
                  </div>
                </div>
                <div className="rounded-3xl bg-white/10 p-4">
                  <div className="grid grid-cols-2 gap-3">
                    {["Prime picks", "Top rated", "Home refresh", "New arrivals"].map((t) => (
                      <div key={t} className="rounded-2xl bg-white/10 p-4 text-sm font-semibold">
                        {t}
                        <div className="mt-2 text-xs font-normal text-white/80">Save up to 40%</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="mx-auto max-w-6xl px-4 mt-6">
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <div className="flex items-center gap-2 text-sm">
                <Filter className="h-4 w-4 opacity-70" />
                <span className="font-semibold">Filters</span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button variant={onlyPrime ? "primary" : "ghost"} onClick={() => setOnlyPrime((v) => !v)}>
                  Prime
                </Button>

                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as any)}
                  className="h-10 rounded-2xl border border-black/10 bg-white px-3 text-sm font-semibold outline-none"
                >
                  <option value="featured">Featured</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating_desc">Rating</option>
                </select>

                <div className="flex items-center gap-2 rounded-2xl bg-white border border-black/10 px-3 py-2">
                  <span className="text-sm font-semibold">Max:</span>
                  <input
                    type="range"
                    min={20}
                    max={1500}
                    value={priceMax}
                    onChange={(e) => setPriceMax(Number(e.target.value))}
                  />
                  <span className="text-sm font-black">{formatMoneyAED(priceMax)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Grid */}
          <div className="mx-auto max-w-6xl px-4 mt-6 pb-12">
            <div className="flex items-end justify-between gap-3">
              <div>
                <div className="text-sm text-black/60">Showing</div>
                <div className="text-xl font-black">
                  {filtered.length} result{filtered.length === 1 ? "" : "s"}
                </div>
              </div>
              <div className="text-xs text-black/50">Tip: search “lamp”, “book”, “prime”…</div>
            </div>

            <motion.div layout className="mt-5 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <AnimatePresence>
                {filtered.map((p) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="overflow-hidden">
                      <div className="relative">
                        <img src={p.img} alt={p.title} className="h-44 w-full object-cover" />
                        <div className="absolute top-3 left-3 flex gap-2">
                          {p.prime && <Badge>Prime</Badge>}
                          {p.stock <= 10 && <Badge variant="destructive">Low stock</Badge>}
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="text-sm font-semibold line-clamp-2">{p.title}</div>
                        <div className="mt-2 flex items-center justify-between">
                          <div className="text-lg font-black">{formatMoneyAED(p.price)}</div>
                          <div className="text-xs text-black/50">{p.category}</div>
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <Stars value={p.rating} />
                          <span className="text-xs text-black/50">
                            {p.rating.toFixed(1)} ({p.reviews.toLocaleString()})
                          </span>
                        </div>
                        <div className="mt-4 flex gap-2">
                          <Button className="flex-1" onClick={() => addToCart(p)}>Add to cart</Button>
                          <Button variant="ghost" onClick={() => quickView(p)}>View</Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            <div className="mt-10 grid md:grid-cols-3 gap-4">
              {[
                { icon: Truck, title: "Fast delivery", text: "Prime items arrive quicker. (Demo UI)" },
                { icon: ShieldCheck, title: "Secure checkout", text: "Connect Stripe for real payments." },
                { icon: RotateCcw, title: "Easy returns", text: "Add return policy pages & order tracking." },
              ].map((b) => (
                <Card key={b.title}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <b.icon className="h-5 w-5" /> {b.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-black/60">{b.text}</CardContent>
                </Card>
              ))}
            </div>

            <footer className="mt-12 text-center text-xs text-black/50">
              Dragon Mart Online — starter template. Plug a backend (Supabase/Firebase/Node) to go live.
            </footer>
          </div>
        </>
      )}

      {page === "orders" && (
        <div className="mx-auto max-w-6xl px-4 pt-6 pb-12">
          <div className="text-2xl font-black">Orders</div>
          <div className="mt-5 grid gap-4">
            {orders.length === 0 ? (
              <Card><CardContent className="p-5 text-sm text-black/60">No orders yet. Complete a checkout to see your order history.</CardContent></Card>
            ) : (
              orders
                .filter((o) => !session || o.userEmail === session.email)
                .map((o) => (
                  <Card key={o.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Order #{o.id}</span>
                        <Badge variant="secondary">{o.status}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-black/60">Placed: {new Date(o.createdAt).toLocaleString()}</div>
                      <div className="mt-2 font-black text-lg">{formatMoneyAED(o.total)}</div>
                      <div className="mt-3 grid gap-2">
                        {o.items.map((it: any) => (
                          <div key={it.productId} className="flex items-center justify-between text-sm">
                            <div className="line-clamp-1">{it.title}</div>
                            <div className="text-black/50">x{it.qty}</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))
            )}
          </div>
        </div>
      )}

      {page === "admin" && (
        <div className="mx-auto max-w-6xl px-4 pt-6 pb-12">
          {!isAdmin ? (
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-black">Admin access required</div>
                <div className="mt-2 text-sm text-black/60">Please login as an admin to upload products.</div>
                <div className="mt-4 flex gap-2">
                  <Button onClick={() => setAuthOpen(true)}>Login</Button>
                  <Button variant="ghost" onClick={() => setPage("home")}>Go home</Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <AdminPanel products={products} onCreateProduct={createProduct} />
          )}
        </div>
      )}

      {/* Drawer: Cart */}
      <Drawer open={cartOpen} onClose={() => setCartOpen(false)} title="Your Cart">
        {cartItems.length === 0 ? (
          <div className="rounded-2xl border border-black/10 p-4 text-sm text-black/60">
            Your cart is empty. Add a few items to see them here.
          </div>
        ) : (
          <div className="space-y-3">
            {cartItems.map(({ product, qty }) => (
              <div key={product.id} className="flex gap-3 rounded-2xl border border-black/10 p-3">
                <img src={product.img} alt={product.title} className="h-16 w-16 rounded-2xl object-cover" />
                <div className="flex-1">
                  <div className="text-sm font-semibold line-clamp-2">{product.title}</div>
                  <div className="mt-1 flex items-center justify-between">
                    <div className="text-sm font-black">{formatMoneyAED(product.price)}</div>
                    <button className="text-sm underline text-black/70" onClick={() => remove(product.id)}>Remove</button>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <Button size="icon" variant="ghost" onClick={() => dec(product.id)}><Minus className="h-4 w-4" /></Button>
                    <div className="min-w-10 text-center font-semibold">{qty}</div>
                    <Button size="icon" variant="ghost" onClick={() => inc(product.id)}><Plus className="h-4 w-4" /></Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 rounded-2xl border border-black/10 p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-black/60">Subtotal</div>
            <div className="text-lg font-black">{formatMoneyAED(subtotal)}</div>
          </div>
          <div className="mt-3">
            <Button className="w-full" disabled={cartItems.length === 0} onClick={checkoutStripeDemo}>
              Checkout (Stripe)
            </Button>
            <div className="mt-2 text-xs text-black/50">Demo mode—connect Stripe backend to charge.</div>
          </div>
        </div>
      </Drawer>

      {/* Modal: Product */}
      <Modal
        open={productOpen}
        onClose={() => setProductOpen(false)}
        title={activeProduct?.title || "Product"}
        widthClass="max-w-3xl"
      >
        {!activeProduct ? null : (
          <div className="grid md:grid-cols-2 gap-5">
            <div className="rounded-3xl overflow-hidden border border-black/10">
              <img src={activeProduct.img} alt={activeProduct.title} className="h-72 w-full object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Stars value={activeProduct.rating} />
                <span className="text-sm text-black/60">
                  {activeProduct.rating.toFixed(1)} • {activeProduct.reviews.toLocaleString()} reviews
                </span>
              </div>
              <div className="mt-3 text-2xl font-black">{formatMoneyAED(activeProduct.price)}</div>
              <div className="mt-3 flex gap-2 flex-wrap">
                {activeProduct.prime && <Badge>Prime</Badge>}
                <Badge variant="secondary">{activeProduct.category}</Badge>
                <Badge variant={activeProduct.stock > 10 ? "secondary" : "destructive"}>
                  {activeProduct.stock > 10 ? "In stock" : "Limited"}
                </Badge>
              </div>
              <p className="mt-4 text-sm text-black/60 leading-relaxed">{activeProduct.desc}</p>
              <div className="mt-5 grid gap-2">
                <Button onClick={() => addToCart(activeProduct)}>Add to cart</Button>
                <Button variant="ghost">Buy now</Button>
                <div className="mt-2 text-xs text-black/50">Delivery estimate: 2–4 days (demo)</div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal: Auth */}
      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onLogin={(sess) => setSession(sess)}
      />
    </div>
  );
}

function AuthModal({
  open,
  onClose,
  onLogin,
}: {
  open: boolean;
  onClose: () => void;
  onLogin: (sess: any) => void;
}) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("Hanif");
  const [email, setEmail] = useState("hanif@example.com");
  const [password, setPassword] = useState("password");
  const [asAdmin, setAsAdmin] = useState(false);

  function submit() {
    onLogin({ id: "demo_user", name: name || "User", email, role: asAdmin ? "admin" : "customer" });
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title={mode === "login" ? "Login" : "Create account"}>
      <div className="space-y-3">
        {mode === "signup" && (
          <div>
            <div className="text-sm font-semibold">Full name</div>
            <Input className="mt-1" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
        )}
        <div>
          <div className="text-sm font-semibold">Email</div>
          <Input className="mt-1" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <div className="text-sm font-semibold">Password</div>
          <Input type="password" className="mt-1" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={asAdmin} onChange={(e) => setAsAdmin(e.target.checked)} />
          Login as admin (demo)
        </label>

        <Button className="w-full" onClick={submit}>
          {mode === "login" ? "Login" : "Sign up"}
        </Button>

        <div className="text-xs text-black/50">
          Demo only. Replace with real Auth (Supabase/Firebase).
        </div>

        <div className="flex justify-between text-sm">
          <button className="underline" onClick={() => setMode(mode === "login" ? "signup" : "login")}>
            {mode === "login" ? "Create an account" : "I already have an account"}
          </button>
          <button className="underline" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </Modal>
  );
}

function AdminPanel({
  products,
  onCreateProduct,
}: {
  products: any[];
  onCreateProduct: (p: any) => void;
}) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Electronics");
  const [price, setPrice] = useState<number>(99);
  const [stock, setStock] = useState<number>(10);
  const [prime, setPrime] = useState(true);
  const [imgUrl, setImgUrl] = useState(
    "https://images.unsplash.com/photo-1518441902117-f0a9e9f8d1d4?auto=format&fit=crop&w=1200&q=60"
  );
  const [desc, setDesc] = useState("New product description...");

  function submit() {
    if (!title.trim()) return;
    onCreateProduct({
      id: `p_${Math.random().toString(16).slice(2)}`,
      title,
      category,
      price: Number(price),
      rating: 4.4,
      reviews: 0,
      prime,
      stock: Number(stock),
      img: imgUrl,
      desc,
    });
    setTitle("");
  }

  return (
    <div className="grid lg:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Upload className="h-5 w-5" /> Add new product</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <div className="text-sm font-semibold">Title</div>
            <Input className="mt-1" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-sm font-semibold">Category</div>
              <select
                className="mt-1 h-10 w-full rounded-2xl border border-black/10 bg-white px-3 text-sm"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {CATEGORIES.filter((c) => c !== "All").map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <div className="text-sm font-semibold">Price (AED)</div>
              <Input type="number" className="mt-1" value={price as any} onChange={(e) => setPrice(Number(e.target.value))} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-sm font-semibold">Stock</div>
              <Input type="number" className="mt-1" value={stock as any} onChange={(e) => setStock(Number(e.target.value))} />
            </div>
            <label className="flex items-center gap-2 text-sm pt-7">
              <input type="checkbox" checked={prime} onChange={(e) => setPrime(e.target.checked)} />
              Prime
            </label>
          </div>

          <div>
            <div className="text-sm font-semibold">Image URL</div>
            <Input className="mt-1" value={imgUrl} onChange={(e) => setImgUrl(e.target.value)} />
          </div>

          <div>
            <div className="text-sm font-semibold">Description</div>
            <textarea
              className="mt-1 w-full rounded-2xl border border-black/10 bg-white px-3 py-2 text-sm min-h-24 outline-none focus:ring-2 focus:ring-orange-400"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </div>

          <Button className="w-full" onClick={submit}>Create product</Button>
          <div className="text-xs text-black/50">Real version: upload image to Storage and save product to DB.</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Catalog preview</CardTitle></CardHeader>
        <CardContent>
          <div className="text-sm text-black/60">Total products: {products.length}</div>
          <div className="mt-3 grid gap-3">
            {products.slice(0, 8).map((p) => (
              <div key={p.id} className="flex items-center gap-3 rounded-2xl border border-black/10 p-3">
                <img src={p.img} alt={p.title} className="h-12 w-12 rounded-2xl object-cover" />
                <div className="flex-1">
                  <div className="text-sm font-semibold line-clamp-1">{p.title}</div>
                  <div className="text-xs text-black/50">{p.category} • {formatMoneyAED(p.price)}</div>
                </div>
                {p.prime && <Badge>Prime</Badge>}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
 
