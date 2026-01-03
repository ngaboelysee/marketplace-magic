import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  seller: string;
}

const initialCartItems: CartItem[] = [
  {
    id: 1,
    name: "Artisan Leather Handbag",
    price: 299,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=200&h=200&fit=crop",
    seller: "Milano Crafts",
  },
  {
    id: 2,
    name: "Minimalist Watch",
    price: 425,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop",
    seller: "Timepiece Co",
  },
];

export default function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);
  const [promoCode, setPromoCode] = useState("");

  const updateQuantity = (id: number, delta: number) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 100 ? 0 : 15;
  const total = subtotal + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="luxe-container py-20">
          <div className="max-w-md mx-auto text-center">
            <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="h-10 w-10 text-muted-foreground" />
            </div>
            <h1 className="font-display text-2xl font-semibold text-foreground mb-2">
              Your cart is empty
            </h1>
            <p className="text-muted-foreground mb-6">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Link to="/shop">
              <Button variant="luxe">Start Shopping</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="luxe-container py-12">
        <h1 className="font-display text-3xl font-semibold text-foreground mb-8">
          Shopping Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 bg-card border border-border rounded-xl p-4"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground mb-1">{item.seller}</p>
                  <h3 className="font-medium text-foreground mb-2">{item.name}</h3>
                  <p className="text-lg font-semibold text-foreground">${item.price}</p>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <div className="flex items-center gap-2 border border-border rounded-lg">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="p-2 hover:bg-secondary transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="p-2 hover:bg-secondary transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-xl p-6 sticky top-24">
              <h2 className="font-display text-xl font-semibold text-foreground mb-6">
                Order Summary
              </h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-foreground">
                    {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                {shipping === 0 && (
                  <p className="text-xs text-green-600">
                    ✓ You qualify for free shipping!
                  </p>
                )}
              </div>

              <div className="flex gap-2 mb-6">
                <Input
                  placeholder="Promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                />
                <Button variant="outline">Apply</Button>
              </div>

              <div className="border-t border-border pt-4 mb-6">
                <div className="flex justify-between">
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="font-semibold text-foreground">${total.toFixed(2)}</span>
                </div>
              </div>

              <Link to="/checkout">
                <Button variant="luxe" className="w-full" size="lg">
                  Proceed to Checkout
                </Button>
              </Link>

              <p className="text-xs text-muted-foreground text-center mt-4">
                Secure checkout powered by Stripe
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
