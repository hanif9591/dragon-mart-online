"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
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
  CheckCircle2,
  Clock3,
  Trash2,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

const MAIN_ADMIN_EMAIL = "hanif9591@gmail.com";
const MAIN_ADMIN_PASSWORD = "Aliza9591#";

function DragonMartLogo({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <div className={`rounded-2xl bg-white/10 grid place-items-center ${className}`}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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

const CATEGORIES = [
  "All",
  "Electronics",
  "Home",
  "Fashion",
  "Beauty",
  "Sports",
  "Books",
  "Auto Spare Parts",
  "Toys and Games",
  "Luggage and Bags", // ✅ added
];

type Product = {
  id: string;
  title: string;
  category: string;
  price: number;
  rating: number; // average rating
  reviews: number; // count of reviews
  prime: boolean;
  stock: number;
  img: string; // main image (url or base64)
  images?: string[];
  videos?: string[];
  desc: string;
};

type Order = {
  id: string;
  createdAt: string;
  status: string; // COD pending etc
  total: number;
  items: { productId: string; title: string; qty: number; price: number }[];
  userEmail: string;
  paymentMethod: "COD";
};

type Review = {
  id: string;
  productId: string;
  userEmail: string;
  userName: string;
  rating: number; // 1..5
  comment: string;
  createdAt: string;
};

type Session =
  | null
  | {
      id: string;
      name: string;
      email: string;
      role: "customer" | "admin" | "pending_admin";
    };

const DEMO_PRODUCTS: Product[] = [
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
    images: ["https://images.unsplash.com/photo-1518441902117-f0a9e9f8d1d4?auto=format&fit=crop&w=1200&q=60"],
    videos: [],
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
    images: ["https://images.unsplash.com/photo-1559245010-6564f5d4f8c5?auto=format&fit=crop&w=1200&q=60"],
    videos: [],
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
    images: ["https://images.unsplash.com/photo-1526401485004-2fda9e9f8d1d4?auto=format&fit=crop&w=1200&q=60".replace("1526401485004-2fda9e9f8d1d4", "1526401485004-2fda9f6d3d38")],
    videos: [],
    desc: "Double-wall insulation keeps drinks cold for up to 24h. Leak-proof cap and durable powder coat.",
  },
];

function formatMoneyAED(n: number) {
  return n.toLocaleString(undefined, { style: "currency", currency: "AED" });
}
function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function Stars({ value }: { value: number }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  const stars = Array.from({ length: 5 }, (_, i) => {
    const idx = i + 1;
    const filled = idx <= full || (idx === full + 1 && half);
    return (
      <Star key={i} className={`h-4 w-4 ${filled ? "" : "opacity-30"}`} fill={filled ? "currentColor" : "none"} />
    );
  });
  return <div className="flex items-center gap-0.5">{stars}</div>;
}

function safeJsonParse<T>(raw: string | null, fallback: T): T {
  try {
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function useSession() {
  const [session, setSession] = useState<Session>(() => safeJsonParse<Session>(localStorage.getItem("dmo_session"), null));
  useEffect(() => {
    try {
      localStorage.setItem("dmo_session", JSON.stringify(session));
    } catch {}
  }, [session]);
  return { session, setSession };
}

function getApprovedAdmins(): string[] {
  return safeJsonParse<string[]>(localStorage.getItem("dmo_admins"), [MAIN_ADMIN_EMAIL]);
}
function setApprovedAdmins(xs: string[]) {
  try {
    localStorage.setItem("dmo_admins", JSON.stringify(xs));
  } catch {}
}
function getPendingAdmins(): string[] {
  return safeJsonParse<string[]>(localStorage.getItem("dmo_pending_admins"), []);
}
function setPendingAdmins(xs: string[]) {
  try {
    localStorage.setItem("dmo_pending_admins", JSON.stringify(xs));
  } catch {}
}

function getReviews(): Review[] {
  return safeJsonParse<Review[]>(localStorage.getItem("dmo_reviews"), []);
}
function setReviews(xs: Review[]) {
  try {
    localStorage.setItem("dmo_reviews", JSON.stringify(xs));
  } catch {}
}

function TopNav(props: {
  query: string;
  setQuery: (v: string) => void;
  category: string;
  setCategory: (v: string) => void;
  cartCount: number;
  onOpenCart: () => void;
  page: "home" | "orders" | "admin";
  setPage: (v: "home" | "orders" | "admin") => void;
  session: Session;
  onOpenAuth: () => void;
  onLogout: () => void;
}) {
  const { query, setQuery, category, setCategory, cartCount, onOpenCart, page, setPage, session, onOpenAuth, onLogout } = props;

  return (
    <div className="sticky top-0 z-40">
      <div className="bg-gradient-to-r from-red-700 via-red-600 to-orange-500 text-white">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-3">
          <button onClick={() => setPage("home")} className="flex items-center gap-2">
            <DragonMartLogo />
            <div className="leading-tight text-left">
              <div className="font-black tracking-tight">Dragon Mart Online</div>
              <div className="text-xs text-white/70">Deliver to UAE</div>
            </div>
          </button>

          <div className="flex-1 flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" className="rounded-2xl bg-white/15 hover:bg-white/20 text-white">
                  <span className="text-sm">{category}</span>
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                {CATEGORIES.map((c) => (
                  <DropdownMenuItem
                    key={c}
                    onClick={() => {
                      setCategory(c);
                      setPage("home");
                    }}
                    className={c === category ? "font-semibold" : ""}
                  >
                    {c}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="relative w-full">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 opacity-70" />
              <Input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage("home");
                }}
                placeholder="Search products, brands and more"
                className="pl-9 rounded-2xl bg-white text-black"
              />
            </div>
          </div>

          <Button onClick={onOpenCart} variant="secondary" className="relative rounded-2xl bg-white/15 hover:bg-white/20 text-white">
            <ShoppingCart className="h-4 w-4" />
            <span className="ml-2 hidden sm:inline">Cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 h-5 min-w-5 px-1 rounded-full bg-white text-zinc-900 text-xs grid place-items-center font-bold">
                {cartCount}
              </span>
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" className="rounded-2xl bg-white/15 hover:bg-white/20 text-white">
                <User className="h-4 w-4" />
                <span className="ml-2 hidden sm:inline">{session ? session.name : "Account"}</span>
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              {!session ? (
                <DropdownMenuItem onClick={onOpenAuth}>
                  <User className="h-4 w-4 mr-2" /> Login / Signup
                </DropdownMenuItem>
              ) : (
                <>
                  <DropdownMenuItem onClick={() => setPage("orders")} className={page === "orders" ? "font-semibold" : ""}>
                    <Package className="h-4 w-4 mr-2" /> Orders
                  </DropdownMenuItem>

                  {session.role === "admin" && (
                    <DropdownMenuItem onClick={() => setPage("admin")} className={page === "admin" ? "font-semibold" : ""}>
                      <Settings className="h-4 w-4 mr-2" /> Admin
                    </DropdownMenuItem>
                  )}

                  {session.role === "pending_admin" && (
                    <div className="px-3 py-2 text-xs text-muted-foreground">
                      <Clock3 className="inline h-4 w-4 mr-1" />
                      Admin request pending (Main Admin approval needed)
                    </div>
                  )}

                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onLogout}>
                    <LogOut className="h-4 w-4 mr-2" /> Logout
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="bg-red-800 text-white/90 border-b border-red-700">
        <div className="mx-auto max-w-6xl px-4 py-2 flex items-center gap-2 overflow-x-auto">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => {
                setCategory(c);
                setPage("home");
              }}
              className={`whitespace-nowrap text-sm px-3 py-1 rounded-2xl transition ${
                c === category ? "bg-white/15 text-white" : "hover:bg-white/10"
              }`}
            >
              {c}
            </button>
          ))}
          <div className="ml-auto hidden md:flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <Truck className="h-4 w-4" /> Fast delivery
            </div>
            <div className="flex items-center gap-1">
              <ShieldCheck className="h-4 w-4" /> Cash on Delivery
            </div>
            <div className="flex items-center gap-1">
              <RotateCcw className="h-4 w-4" /> Easy returns
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Hero({ onShop }: { onShop: () => void }) {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-6">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-700 to-orange-500 text-white">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_20%,white,transparent_35%),radial-gradient(circle_at_70%_60%,white,transparent_35%)]" />
        <div className="relative p-6 md:p-10 grid md:grid-cols-2 gap-6 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-white" /> Deals updated daily
            </div>
            <h1 className="mt-4 text-2xl md:text-4xl font-black tracking-tight">Dragon Mart Online — shop smart, save big.</h1>
            <p className="mt-3 text-white/80">
              Search, filters, cart, login, orders, admin upload, reviews & Cash on Delivery.
            </p>
            <div className="mt-5 flex gap-2">
              <Button onClick={onShop} className="rounded-2xl bg-white text-zinc-900 hover:bg-white/90">
                Shop now
              </Button>
              <Button variant="secondary" className="rounded-2xl bg-white/15 hover:bg-white/20 text-white">
                View categories
              </Button>
            </div>
          </div>
          <div className="rounded-3xl bg-white/10 p-4">
            <div className="grid grid-cols-2 gap-3">
              {["Prime picks", "Top rated", "Luggage & Bags", "New arrivals"].map((t) => (
                <div key={t} className="rounded-2xl bg-white/10 p-4 text-sm font-semibold">
                  {t}
                  <div className="mt-2 text-xs font-normal text-white/70">Save up to 40%</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductCard({
  p,
  onQuickView,
  onAdd,
}: {
  p: Product;
  onQuickView: (p: Product) => void;
  onAdd: (p: Product) => void;
}) {
  return (
    <motion.div layout>
      <Card className="rounded-3xl overflow-hidden shadow-sm">
        <div className="relative">
          <img src={p.img} alt={p.title} className="h-44 w-full object-cover" loading="lazy" />
          <div className="absolute top-3 left-3 flex gap-2">
            {p.prime && <Badge className="rounded-full">Prime</Badge>}
            {p.stock <= 10 && (
              <Badge variant="destructive" className="rounded-full">
                Low stock
              </Badge>
            )}
          </div>
        </div>
        <CardContent className="p-4">
          <div className="text-sm font-semibold line-clamp-2">{p.title}</div>
          <div className="mt-2 flex items-center justify-between">
            <div className="text-lg font-black">{formatMoneyAED(p.price)}</div>
            <div className="text-xs text-muted-foreground">{p.category}</div>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <Stars value={p.rating} />
            <span className="text-xs text-muted-foreground">
              {p.rating.toFixed(1)} ({p.reviews.toLocaleString()})
            </span>
          </div>
          <div className="mt-4 flex gap-2">
            <Button className="rounded-2xl" onClick={() => onAdd(p)}>
              Add to cart
            </Button>
            <Button variant="secondary" className="rounded-2xl" onClick={() => onQuickView(p)}>
              View
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function sortLabel(sort: string) {
  if (sort === "price_asc") return "Low → High";
  if (sort === "price_desc") return "High → Low";
  if (sort === "rating_desc") return "Rating";
  return "Featured";
}

function FiltersBar(props: {
  sort: string;
  setSort: (v: string) => void;
  onlyPrime: boolean;
  setOnlyPrime: React.Dispatch<React.SetStateAction<boolean>>;
  priceMax: number;
  setPriceMax: React.Dispatch<React.SetStateAction<number>>;
}) {
  const { sort, setSort, onlyPrime, setOnlyPrime, priceMax, setPriceMax } = props;

  return (
    <div className="mx-auto max-w-6xl px-4 mt-6">
      <div className="flex flex-col md:flex-row md:items-center gap-3">
        <div className="flex items-center gap-2 text-sm">
          <Filter className="h-4 w-4 opacity-70" />
          <span className="font-semibold">Filters</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant={onlyPrime ? "default" : "secondary"} className="rounded-2xl" onClick={() => setOnlyPrime((v) => !v)}>
            Prime
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" className="rounded-2xl">
                Sort: {sortLabel(sort)} <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {[
                { id: "featured", label: "Featured" },
                { id: "price_asc", label: "Price: Low to High" },
                { id: "price_desc", label: "Price: High to Low" },
                { id: "rating_desc", label: "Rating" },
              ].map((o) => (
                <DropdownMenuItem key={o.id} onClick={() => setSort(o.id)} className={o.id === sort ? "font-semibold" : ""}>
                  {o.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex items-center gap-2 rounded-2xl bg-muted px-3 py-2">
            <span className="text-sm font-semibold">Max:</span>
            <input type="range" min={20} max={1500} value={priceMax} onChange={(e) => setPriceMax(Number(e.target.value))} />
            <span className="text-sm font-black">{formatMoneyAED(priceMax)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function CartSheet(props: {
  open: boolean;
  setOpen: (v: boolean) => void;
  items: { product: Product; qty: number }[];
  onInc: (id: string) => void;
  onDec: (id: string) => void;
  onRemove: (id: string) => void;
  total: number;
  onCheckout: () => void;
}) {
  const { open, setOpen, items, onInc, onDec, onRemove, total, onCheckout } = props;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <span>Your Cart</span>
            <Button variant="ghost" size="icon" className="rounded-2xl" onClick={() => setOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-3">
          {items.length === 0 ? (
            <div className="rounded-2xl border p-4 text-sm text-muted-foreground">Your cart is empty. Add a few items to see them here.</div>
          ) : (
            items.map(({ product, qty }) => (
              <div key={product.id} className="flex gap-3 rounded-2xl border p-3">
                <img src={product.img} alt={product.title} className="h-16 w-16 rounded-2xl object-cover" />
                <div className="flex-1">
                  <div className="text-sm font-semibold line-clamp-2">{product.title}</div>
                  <div className="mt-1 flex items-center justify-between">
                    <div className="text-sm font-black">{formatMoneyAED(product.price)}</div>
                    <Button variant="ghost" className="h-8 rounded-2xl" onClick={() => onRemove(product.id)}>
                      Remove
                    </Button>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <Button variant="secondary" size="icon" className="rounded-2xl" onClick={() => onDec(product.id)}>
                      <Minus className="h-4 w-4" />
                    </Button>
                    <div className="min-w-10 text-center font-semibold">{qty}</div>
                    <Button variant="secondary" size="icon" className="rounded-2xl" onClick={() => onInc(product.id)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-6 rounded-2xl border p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">Subtotal</div>
            <div className="text-lg font-black">{formatMoneyAED(total)}</div>
          </div>
          <div className="mt-3">
            <Button className="w-full rounded-2xl" disabled={items.length === 0} onClick={onCheckout}>
              Place Order (Cash on Delivery)
            </Button>
            <div className="mt-2 text-xs text-muted-foreground">Payment method: Cash on Delivery (COD)</div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function toYouTubeEmbed(url: string) {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.replace("/", "");
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    return null;
  } catch {
    return null;
  }
}

function ProductDialog(props: {
  open: boolean;
  setOpen: (v: boolean) => void;
  product: Product | null;
  onAdd: (p: Product) => void;
  session: Session;
  reviewsByProduct: Record<string, Review[]>;
  onSubmitReview: (productId: string, rating: number, comment: string) => void;
}) {
  const { open, setOpen, product, onAdd, session, reviewsByProduct, onSubmitReview } = props;

  const gallery = product?.images?.length ? product.images : product ? [product.img] : [];
  const videos = product?.videos?.length ? product.videos : [];
  const [activeIdx, setActiveIdx] = useState(0);

  const [myRating, setMyRating] = useState<number>(5);
  const [myComment, setMyComment] = useState("");

  useEffect(() => {
    setActiveIdx(0);
    setMyRating(5);
    setMyComment("");
  }, [product?.id]);

  if (!product) return null;

  const list = reviewsByProduct[product.id] || [];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-4xl rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-black">{product.title}</DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <div className="rounded-3xl overflow-hidden border">
              <img
                src={gallery[Math.min(activeIdx, Math.max(gallery.length - 1, 0))]}
                alt={product.title}
                className="h-72 w-full object-cover"
              />
            </div>

            {gallery.length > 1 && (
              <div className="mt-3 grid grid-cols-5 gap-2">
                {gallery.slice(0, 10).map((u, i) => (
                  <button
                    key={`${u}_${i}`}
                    onClick={() => setActiveIdx(i)}
                    className={`rounded-2xl overflow-hidden border ${i === activeIdx ? "ring-2 ring-orange-400" : ""}`}
                    title={`Image ${i + 1}`}
                  >
                    <img src={u} alt={`thumb ${i + 1}`} className="h-14 w-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {videos.length > 0 && (
              <div className="mt-4 space-y-3">
                <div className="text-sm font-semibold">Product videos</div>
                {videos.map((v, idx) => {
                  const embed = toYouTubeEmbed(v);
                  if (embed) {
                    return (
                      <iframe
                        key={`${v}_${idx}`}
                        className="w-full aspect-video rounded-2xl border"
                        src={embed}
                        allow="autoplay; encrypted-media"
                        allowFullScreen
                        title={`video_${idx}`}
                      />
                    );
                  }
                  return (
                    <video key={`${v}_${idx}`} className="w-full rounded-2xl border" controls>
                      <source src={v} />
                    </video>
                  );
                })}
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <Stars value={product.rating} />
              <span className="text-sm text-muted-foreground">
                {product.rating.toFixed(1)} • {product.reviews.toLocaleString()} reviews
              </span>
            </div>

            <div className="mt-3 text-2xl font-black">{formatMoneyAED(product.price)}</div>

            <div className="mt-3 flex gap-2 flex-wrap">
              {product.prime && <Badge className="rounded-full">Prime</Badge>}
              <Badge variant="secondary" className="rounded-full">
                {product.category}
              </Badge>
              <Badge variant={product.stock > 10 ? "secondary" : "destructive"} className="rounded-full">
                {product.stock > 10 ? "In stock" : "Limited"}
              </Badge>
              <Badge className="rounded-full">COD</Badge>
            </div>

            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{product.desc}</p>

            <div className="mt-5 grid gap-2">
              <Button className="rounded-2xl" onClick={() => onAdd(product)}>
                Add to cart
              </Button>
              <Button variant="secondary" className="rounded-2xl" onClick={() => onAdd(product)}>
                Buy now (COD)
              </Button>
              <div className="mt-2 text-xs text-muted-foreground">Payment: Cash on Delivery</div>
            </div>

            {/* Reviews */}
            <div className="mt-6 border rounded-3xl p-4">
              <div className="flex items-center justify-between">
                <div className="font-black">Ratings & Comments</div>
                <Badge variant="secondary" className="rounded-full">
                  {list.length} comment{list.length === 1 ? "" : "s"}
                </Badge>
              </div>

              {!session ? (
                <div className="mt-3 text-sm text-muted-foreground">Review দিতে হলে আগে Login করুন।</div>
              ) : (
                <div className="mt-3 space-y-2">
                  <div className="text-sm font-semibold">Your rating</div>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        onClick={() => setMyRating(n)}
                        className={`h-10 w-10 rounded-2xl border grid place-items-center ${
                          myRating >= n ? "bg-orange-500 text-white border-orange-500" : "bg-white"
                        }`}
                        title={`${n} star`}
                      >
                        <Star className="h-4 w-4" />
                      </button>
                    ))}
                  </div>

                  <div className="text-sm font-semibold">Comment</div>
                  <textarea
                    className="w-full rounded-2xl border bg-background px-3 py-2 text-sm min-h-20"
                    value={myComment}
                    onChange={(e) => setMyComment(e.target.value)}
                    placeholder="Write your comment..."
                  />

                  <Button
                    className="rounded-2xl"
                    onClick={() => {
                      const c = myComment.trim();
                      if (!c) return;
                      onSubmitReview(product.id, myRating, c);
                      setMyComment("");
                    }}
                  >
                    Submit review
                  </Button>
                </div>
              )}

              <div className="mt-4 space-y-3 max-h-56 overflow-auto pr-1">
                {list.length === 0 ? (
                  <div className="text-sm text-muted-foreground">এখনো কোন কমেন্ট নেই।</div>
                ) : (
                  list
                    .slice()
                    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
                    .map((r) => (
                      <div key={r.id} className="rounded-2xl border p-3">
                        <div className="flex items-center justify-between gap-2">
                          <div className="text-sm font-semibold line-clamp-1">{r.userName}</div>
                          <div className="text-xs text-muted-foreground">{new Date(r.createdAt).toLocaleString()}</div>
                        </div>
                        <div className="mt-1 flex items-center gap-2">
                          <Stars value={r.rating} />
                          <span className="text-xs text-muted-foreground">{r.rating}/5</span>
                        </div>
                        <div className="mt-2 text-sm">{r.comment}</div>
                      </div>
                    ))
                )}
              </div>
            </div>
            {/* end reviews */}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function AuthDialog(props: { open: boolean; setOpen: (v: boolean) => void; setSession: (s: Session) => void }) {
  const { open, setOpen, setSession } = props;

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("Hanif");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [requestAdmin, setRequestAdmin] = useState(false);
  const [msg, setMsg] = useState<string>("");

  useEffect(() => {
    if (!open) {
      setMsg("");
      setMode("login");
      setRequestAdmin(false);
    }
  }, [open]);

  function doLoginOrSignup() {
    const e = email.trim().toLowerCase();
    const p = password;

    if (!e || !p) {
      setMsg("Email এবং password দিন।");
      return;
    }

    // ✅ Main admin exact login
    if (e === MAIN_ADMIN_EMAIL.toLowerCase() && p === MAIN_ADMIN_PASSWORD) {
      const admins = Array.from(new Set([MAIN_ADMIN_EMAIL.toLowerCase(), ...getApprovedAdmins().map((x) => x.toLowerCase())]));
      setApprovedAdmins(admins);
      setSession({ id: "main_admin", name: name || "Main Admin", email: e, role: "admin" });
      setOpen(false);
      return;
    }

    // approved admins login (password demo)
    const approved = getApprovedAdmins().map((x) => x.toLowerCase());
    if (approved.includes(e) && p.length > 0) {
      setSession({ id: `user_${e}`, name: name || "Admin", email: e, role: "admin" });
      setOpen(false);
      return;
    }

    // if requesting admin but not approved: pending
    if (requestAdmin) {
      const pending = getPendingAdmins().map((x) => x.toLowerCase());
      if (!pending.includes(e)) setPendingAdmins([...getPendingAdmins(), e]);
      setSession({ id: `user_${e}`, name: name || "User", email: e, role: "pending_admin" });
      setMsg("আপনার Admin request pending হয়েছে। Main Admin approve করলে Admin হবে।");
      // keep dialog open so user can read message
      return;
    }

    // normal customer
    setSession({ id: `user_${e}`, name: name || "User", email: e, role: "customer" });
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-black">{mode === "login" ? "Login" : "Create account"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div>
            <div className="text-sm font-semibold">Full name</div>
            <Input className="rounded-2xl" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div>
            <div className="text-sm font-semibold">Email</div>
            <Input className="rounded-2xl" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" />
          </div>

          <div>
            <div className="text-sm font-semibold">Password</div>
            <Input type="password" className="rounded-2xl" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={requestAdmin} onChange={(e) => setRequestAdmin(e.target.checked)} />
            Request admin access (Main Admin approval needed)
          </label>

          {msg && <div className="rounded-2xl border p-3 text-sm text-muted-foreground">{msg}</div>}

          <Button className="w-full rounded-2xl" onClick={doLoginOrSignup}>
            {mode === "login" ? "Login" : "Sign up"}
          </Button>

          <div className="text-xs text-muted-foreground">
            Main Admin: <b>{MAIN_ADMIN_EMAIL}</b> (only this email can approve admins)
          </div>

          <div className="flex justify-between text-sm">
            <button className="underline" onClick={() => setMode(mode === "login" ? "signup" : "login")}>
              {mode === "login" ? "Create an account" : "I already have an account"}
            </button>
            <button className="underline" onClick={() => setOpen(false)}>
              Cancel
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function OrdersPage({ orders }: { orders: Order[] }) {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-6 pb-12">
      <div className="text-2xl font-black">Orders</div>
      <div className="mt-5 grid gap-4">
        {orders.length === 0 ? (
          <Card className="rounded-3xl">
            <CardContent className="p-5 text-sm text-muted-foreground">No orders yet. Place a COD order to see history.</CardContent>
          </Card>
        ) : (
          orders.map((o) => (
            <Card key={o.id} className="rounded-3xl">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Order #{o.id}</span>
                  <Badge className="rounded-full">{o.status}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 pt-0">
                <div className="text-sm text-muted-foreground">Placed: {new Date(o.createdAt).toLocaleString()}</div>
                <div className="mt-1 text-xs text-muted-foreground">Payment: Cash on Delivery</div>
                <div className="mt-2 font-black text-lg">{formatMoneyAED(o.total)}</div>
                <div className="mt-3 grid gap-2">
                  {o.items.map((it) => (
                    <div key={it.productId} className="flex items-center justify-between text-sm">
                      <div className="line-clamp-1">{it.title}</div>
                      <div className="text-muted-foreground">x{it.qty}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

// file -> base64
function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result || ""));
    r.onerror = () => reject(new Error("File read failed"));
    r.readAsDataURL(file);
  });
}

function AdminPage(props: {
  products: Product[];
  onCreateProduct: (p: Product) => void;
  onDeleteProduct: (id: string) => void;
  session: Session;
}) {
  const { products, onCreateProduct, onDeleteProduct, session } = props;

  const isMainAdmin = session?.email?.toLowerCase() === MAIN_ADMIN_EMAIL.toLowerCase();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Electronics");
  const [price, setPrice] = useState<number>(99);
  const [stock, setStock] = useState<number>(10);
  const [prime, setPrime] = useState(true);

  const [imgUrl, setImgUrl] = useState(
    "https://images.unsplash.com/photo-1518441902117-f0a9e9f8d1d4?auto=format&fit=crop&w=1200&q=60"
  );

  const [extraImages, setExtraImages] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);
  const [desc, setDesc] = useState("New product description...");

  const fileRef = useRef<HTMLInputElement | null>(null);

  function addImageField() {
    setExtraImages((xs) => [...xs, ""]);
  }
  function updateImageField(i: number, v: string) {
    setExtraImages((xs) => xs.map((x, idx) => (idx === i ? v : x)));
  }
  function removeImageField(i: number) {
    setExtraImages((xs) => xs.filter((_, idx) => idx !== i));
  }

  function addVideoField() {
    setVideos((xs) => [...xs, ""]);
  }
  function updateVideoField(i: number, v: string) {
    setVideos((xs) => xs.map((x, idx) => (idx === i ? v : x)));
  }
  function removeVideoField(i: number) {
    setVideos((xs) => xs.filter((_, idx) => idx !== i));
  }

  async function onPickMainImage(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const dataUrl = await fileToDataUrl(f);
    setImgUrl(dataUrl);
    e.target.value = "";
  }

  function submit() {
    if (!title.trim()) return;

    const cleanedImages = [imgUrl, ...extraImages].map((s) => (s || "").trim()).filter(Boolean);
    const cleanedVideos = videos.map((s) => (s || "").trim()).filter(Boolean);

    onCreateProduct({
      id: `p_${Math.random().toString(16).slice(2)}`,
      title,
      category,
      price: Number(price),
      rating: 0,
      reviews: 0,
      prime,
      stock: Number(stock),
      img: imgUrl,
      images: cleanedImages,
      videos: cleanedVideos,
      desc,
    });

    setTitle("");
    setExtraImages([]);
    setVideos([]);
  }

  // admin approvals
  const [pending, setPending] = useState<string[]>(() => getPendingAdmins());

  function refreshPending() {
    setPending(getPendingAdmins());
  }

  function approveAdmin(email: string) {
    const e = email.toLowerCase();
    const nextApproved = Array.from(new Set([...getApprovedAdmins().map((x) => x.toLowerCase()), e]));
    setApprovedAdmins(nextApproved);
    setPendingAdmins(getPendingAdmins().filter((x) => x.toLowerCase() !== e));
    refreshPending();
  }

  function denyAdmin(email: string) {
    const e = email.toLowerCase();
    setPendingAdmins(getPendingAdmins().filter((x) => x.toLowerCase() !== e));
    refreshPending();
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pt-6 pb-12">
      <div className="flex items-end justify-between gap-3">
        <div>
          <div className="text-sm text-muted-foreground">Admin</div>
          <div className="text-2xl font-black">Product Upload</div>
        </div>
        <Badge variant="secondary" className="rounded-full">
          {isMainAdmin ? "Main Admin" : "Admin"}
        </Badge>
      </div>

      {/* Main Admin Approval Panel */}
      {isMainAdmin && (
        <Card className="rounded-3xl mt-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" /> Admin Approval Requests
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-0">
            {pending.length === 0 ? (
              <div className="text-sm text-muted-foreground">No pending admin requests.</div>
            ) : (
              <div className="space-y-2">
                {pending.map((e) => (
                  <div key={e} className="flex items-center justify-between gap-2 rounded-2xl border p-3">
                    <div className="text-sm font-semibold">{e}</div>
                    <div className="flex gap-2">
                      <Button className="rounded-2xl" onClick={() => approveAdmin(e)}>
                        Approve
                      </Button>
                      <Button variant="secondary" className="rounded-2xl" onClick={() => denyAdmin(e)}>
                        Deny
                      </Button>
                    </div>
                  </div>
                ))}
                <Button variant="ghost" className="rounded-2xl" onClick={refreshPending}>
                  Refresh
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <div className="mt-5 grid lg:grid-cols-2 gap-4">
        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" /> Add new product
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-0 space-y-3">
            <div>
              <div className="text-sm font-semibold">Title</div>
              <Input className="rounded-2xl" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-sm font-semibold">Category</div>
                <select
                  className="mt-1 w-full rounded-2xl border bg-background px-3 py-2 text-sm"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {CATEGORIES.filter((c) => c !== "All").map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <div className="text-sm font-semibold">Price (AED)</div>
                <Input type="number" className="rounded-2xl" value={price as any} onChange={(e) => setPrice(Number(e.target.value))} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-sm font-semibold">Stock</div>
                <Input type="number" className="rounded-2xl" value={stock as any} onChange={(e) => setStock(Number(e.target.value))} />
              </div>
              <label className="flex items-center gap-2 text-sm pt-7">
                <input type="checkbox" checked={prime} onChange={(e) => setPrime(e.target.checked)} />
                Prime
              </label>
            </div>

            {/* ✅ Main image: Upload button + URL */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold">Main Image</div>
                <div className="flex gap-2">
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onPickMainImage} />
                  <Button type="button" variant="secondary" className="rounded-2xl" onClick={() => fileRef.current?.click()}>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Image
                  </Button>
                </div>
              </div>
              <Input className="rounded-2xl" value={imgUrl} onChange={(e) => setImgUrl(e.target.value)} placeholder="Paste image URL or use Upload button" />
              <div className="rounded-2xl border p-2">
                <img src={imgUrl} alt="preview" className="h-40 w-full object-cover rounded-2xl" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold">More Pictures (multiple)</div>
                <Button type="button" variant="secondary" className="rounded-2xl" onClick={addImageField}>
                  + Add Picture URL
                </Button>
              </div>
              {extraImages.length === 0 ? (
                <div className="text-xs text-muted-foreground">No extra pictures yet.</div>
              ) : (
                <div className="space-y-2">
                  {extraImages.map((val, i) => (
                    <div key={`img_${i}`} className="flex gap-2">
                      <Input placeholder="https://...jpg" value={val} onChange={(e) => updateImageField(i, e.target.value)} className="rounded-2xl" />
                      <Button type="button" variant="ghost" className="rounded-2xl" onClick={() => removeImageField(i)}>
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold">Videos (YouTube or .mp4)</div>
                <Button type="button" variant="secondary" className="rounded-2xl" onClick={addVideoField}>
                  + Add Video
                </Button>
              </div>
              {videos.length === 0 ? (
                <div className="text-xs text-muted-foreground">No videos yet.</div>
              ) : (
                <div className="space-y-2">
                  {videos.map((val, i) => (
                    <div key={`vid_${i}`} className="flex gap-2">
                      <Input
                        placeholder="https://youtube.com/watch?v=... or https://...mp4"
                        value={val}
                        onChange={(e) => updateVideoField(i, e.target.value)}
                        className="rounded-2xl"
                      />
                      <Button type="button" variant="ghost" className="rounded-2xl" onClick={() => removeVideoField(i)}>
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <div className="text-sm font-semibold">Description</div>
              <textarea
                className="mt-1 w-full rounded-2xl border bg-background px-3 py-2 text-sm min-h-24"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              />
            </div>

            <Button className="rounded-2xl" onClick={submit}>
              Create product
            </Button>
            <div className="text-xs text-muted-foreground">Demo only. Data saved in browser LocalStorage.</div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle>Catalog preview</CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <div className="text-sm text-muted-foreground">Total products: {products.length}</div>
            <div className="mt-3 grid gap-3">
              {products.slice(0, 10).map((p) => (
                <div key={p.id} className="flex items-center gap-3 rounded-2xl border p-3">
                  <Button
                    variant="ghost"
                    className="rounded-2xl text-red-600"
                    onClick={() => onDeleteProduct(p.id)}
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <img src={p.img} alt={p.title} className="h-12 w-12 rounded-2xl object-cover" />
                  <div className="flex-1">
                    <div className="text-sm font-semibold line-clamp-1">{p.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {p.category} • {formatMoneyAED(p.price)}
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      {(p.images?.length || 0)} photos • {(p.videos?.length || 0)} videos
                    </div>
                  </div>
                  {p.prime && <Badge className="rounded-full">Prime</Badge>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function DragonMartOnline() {
  const { session, setSession } = useSession();

  const [page, setPage] = useState<"home" | "orders" | "admin">("home");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState<"featured" | "price_asc" | "price_desc" | "rating_desc">("featured");
  const [onlyPrime, setOnlyPrime] = useState(false);
  const [priceMax, setPriceMax] = useState(1500);

  const [products, setProducts] = useState<Product[]>(() => safeJsonParse<Product[]>(localStorage.getItem("dmo_products"), DEMO_PRODUCTS));
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<Record<string, number>>(() => safeJsonParse(localStorage.getItem("dmo_cart"), {} as Record<string, number>));
  const [orders, setOrders] = useState<Order[]>(() => safeJsonParse<Order[]>(localStorage.getItem("dmo_orders"), []));

  const [quickOpen, setQuickOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [authOpen, setAuthOpen] = useState(false);

  const [reviews, setReviewsState] = useState<Review[]>(() => getReviews());

  useEffect(() => {
    try { localStorage.setItem("dmo_cart", JSON.stringify(cart)); } catch {}
  }, [cart]);

  useEffect(() => {
    try { localStorage.setItem("dmo_orders", JSON.stringify(orders)); } catch {}
  }, [orders]);

  useEffect(() => {
    try { localStorage.setItem("dmo_products", JSON.stringify(products)); } catch {}
  }, [products]);

  useEffect(() => {
    setReviews(reviews);
  }, [reviews]);

  const cartCount = useMemo(() => Object.values(cart).reduce((a, b) => a + b, 0), [cart]);

  const cartItems = useMemo(() => {
    const map = new Map(products.map((p) => [p.id, p] as const));
    return Object.entries(cart)
      .map(([id, qty]) => ({ product: map.get(id), qty }))
      .filter((x): x is { product: Product; qty: number } => Boolean(x.product));
  }, [cart, products]);

  const subtotal = useMemo(() => cartItems.reduce((sum, { product, qty }) => sum + product.price * qty, 0), [cartItems]);

  const reviewsByProduct = useMemo(() => {
    const m: Record<string, Review[]> = {};
    for (const r of reviews) {
      if (!m[r.productId]) m[r.productId] = [];
      m[r.productId].push(r);
    }
    return m;
  }, [reviews]);

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
        .map((p) => ({ p, s: (p.rating || 0) * 10 + clamp(p.stock, 0, 50) / 10 }))
        .sort((a, b) => b.s - a.s)
        .map((x) => x.p);
    }
    return list;
  }, [query, category, sort, onlyPrime, priceMax, products]);

  function addToCart(p: Product) {
    setCart((c) => ({ ...c, [p.id]: (c[p.id] || 0) + 1 }));
    setCartOpen(true);
  }
  function inc(id: string) {
    setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
  }
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

  function quickView(p: Product) {
    setActiveProduct(p);
    setQuickOpen(true);
  }

  function logout() {
    setSession(null);
    setPage("home");
  }

  function createProduct(p: Product) {
    setProducts((prev) => [p, ...prev]);
  }
  function deleteProduct(id: string) {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  function submitReview(productId: string, rating: number, comment: string) {
    if (!session) return;

    const r: Review = {
      id: `r_${Math.random().toString(16).slice(2)}`,
      productId,
      userEmail: session.email,
      userName: session.name,
      rating: clamp(rating, 1, 5),
      comment,
      createdAt: new Date().toISOString(),
    };

    const nextReviews = [...reviews, r];
    setReviewsState(nextReviews);

    // update product avg rating + count based on stored reviews
    const list = nextReviews.filter((x) => x.productId === productId);
    const avg = list.reduce((s, x) => s + x.rating, 0) / Math.max(list.length, 1);

    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? {
              ...p,
              rating: Number.isFinite(avg) ? Number(avg.toFixed(2)) : p.rating,
              reviews: list.length,
            }
          : p
      )
    );
  }

  async function checkoutCOD() {
    if (!session) {
      setAuthOpen(true);
      return;
    }

    const order: Order = {
      id: Math.floor(100000 + Math.random() * 900000).toString(),
      createdAt: new Date().toISOString(),
      status: "COD - Pending",
      total: subtotal,
      items: cartItems.map(({ product, qty }) => ({
        productId: product.id,
        title: product.title,
        qty,
        price: product.price,
      })),
      userEmail: session.email,
      paymentMethod: "COD",
    };

    setOrders((o) => [order, ...o]);
    setCart({});
    setCartOpen(false);
    setPage("orders");
  }

  // guard: only admin (not pending_admin)
  const canAdmin = session?.role === "admin";

  return (
    <div className="min-h-screen bg-orange-50">
      <TopNav
        query={query}
        setQuery={setQuery}
        category={category}
        setCategory={setCategory}
        cartCount={cartCount}
        onOpenCart={() => setCartOpen(true)}
        page={page}
        setPage={setPage}
        session={session}
        onOpenAuth={() => setAuthOpen(true)}
        onLogout={logout}
      />

      {page === "home" && (
        <>
          <Hero onShop={() => window.scrollTo({ top: 520, behavior: "smooth" })} />

          <FiltersBar
            sort={sort}
            setSort={setSort}
            onlyPrime={onlyPrime}
            setOnlyPrime={setOnlyPrime}
            priceMax={priceMax}
            setPriceMax={setPriceMax}
          />

          <div className="mx-auto max-w-6xl px-4 mt-6 pb-12">
            <div className="flex items-end justify-between gap-3">
              <div>
                <div className="text-sm text-muted-foreground">Showing</div>
                <div className="text-xl font-black">
                  {filtered.length} result{filtered.length === 1 ? "" : "s"}
                </div>
              </div>
              <div className="text-xs text-muted-foreground">Tip: try search “bag”, “luggage”, “prime”…</div>
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
                    <ProductCard p={p} onQuickView={quickView} onAdd={addToCart} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            <div className="mt-10 grid md:grid-cols-3 gap-4">
              {[
                { icon: Truck, title: "Fast delivery", text: "Demo UI — you can connect real delivery later." },
                { icon: ShieldCheck, title: "Cash on Delivery", text: "Currently COD only (as requested)." },
                { icon: RotateCcw, title: "Easy returns", text: "Add return policy pages & order tracking later." },
              ].map((b) => (
                <Card key={b.title} className="rounded-3xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <b.icon className="h-5 w-5" /> {b.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">{b.text}</CardContent>
                </Card>
              ))}
            </div>

            <footer className="mt-12 text-center text-xs text-muted-foreground">
              Dragon Mart Online — demo template (LocalStorage). Plug backend later for production.
            </footer>
          </div>
        </>
      )}

      {page === "orders" && (
        <OrdersPage orders={orders.filter((o) => !session || o.userEmail === session.email)} />
      )}

      {page === "admin" &&
        (canAdmin ? (
          <AdminPage products={products} onCreateProduct={createProduct} onDeleteProduct={deleteProduct} session={session} />
        ) : (
          <div className="mx-auto max-w-6xl px-4 pt-6 pb-12">
            <Card className="rounded-3xl">
              <CardContent className="p-6">
                <div className="text-2xl font-black">Admin access required</div>
                <div className="mt-2 text-sm text-muted-foreground">
                  Please login as an admin to upload products.
                  {session?.role === "pending_admin" ? " (Your request is pending Main Admin approval.)" : ""}
                </div>
                <div className="mt-4 flex gap-2">
                  <Button className="rounded-2xl" onClick={() => setAuthOpen(true)}>
                    Login
                  </Button>
                  <Button variant="secondary" className="rounded-2xl" onClick={() => setPage("home")}>
                    Go home
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}

      <CartSheet
        open={cartOpen}
        setOpen={setCartOpen}
        items={cartItems}
        onInc={inc}
        onDec={dec}
        onRemove={remove}
        total={subtotal}
        onCheckout={checkoutCOD}
      />

      <ProductDialog
        open={quickOpen}
        setOpen={setQuickOpen}
        product={activeProduct}
        onAdd={addToCart}
        session={session}
        reviewsByProduct={reviewsByProduct}
        onSubmitReview={submitReview}
      />

      <AuthDialog open={authOpen} setOpen={setAuthOpen} setSession={setSession} />
    </div>
  );
}
