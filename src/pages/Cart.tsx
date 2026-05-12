import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingBag, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CartRow {
  id: string;
  quantity: number;
  product_id: string;
  product: {
    id: string;
    name: string;
    price: number;
    images: string[] | null;
    store_id: string;
    store?: { name: string } | null;
  } | null;
}

export default function Cart() {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [items, setItems] = useState<CartRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [authLoading, user, navigate]);

  const load = async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("cart_items")
      .select("id, quantity, product_id, product:products(id,name,price,images,store_id, store:stores(name))")
      .eq("user_id", user.id);
    if (error) toast({ title: "Failed to load cart", description: error.message, variant: "destructive" });
    setItems((data as any) ?? []);
    setLoading(false);
  };

  useEffect(() => { if (user) load(); }, [user]);

  const updateQuantity = async (id: string, delta: number) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    const next = Math.max(1, item.quantity + delta);
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, quantity: next } : i));
    const { error } = await supabase.from("cart_items").update({ quantity: next }).eq("id", id);
    if (error) toast({ title: "Update failed", description: error.message, variant: "destructive" });
  };

  const removeItem = async (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    const { error } = await supabase.from("cart_items").delete().eq("id", id);
    if (error) toast({ title: "Remove failed", description: error.message, variant: "destructive" });
  };

  const subtotal = items.reduce((s, i) => s + (i.product?.price ?? 0) * i.quantity, 0);
  const shipping = subtotal > 100 ? 0 : 5;
  const total = subtotal + shipping;

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="luxe-container py-20 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </main>
        <Footer />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="luxe-container py-20">
          <div className="max-w-md mx-auto text-center">
            <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="h-10 w-10 text-muted-foreground" />
            </div>
            <h1 className="font-display text-2xl font-semibold text-foreground mb-2">Your cart is empty</h1>
            <p className="text-muted-foreground mb-6">Add items from the shop to get started.</p>
            <Link to="/shop"><Button variant="luxe">Start Shopping</Button></Link>
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
        <h1 className="font-display text-3xl font-semibold text-foreground mb-8">Shopping Cart</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 bg-card border border-border rounded-xl p-4">
                <img
                  src={item.product?.images?.[0] || "/placeholder.svg"}
                  alt={item.product?.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground mb-1">{item.product?.store?.name}</p>
                  <h3 className="font-medium text-foreground mb-2 truncate">{item.product?.name}</h3>
                  <p className="text-lg font-semibold text-foreground">${item.product?.price?.toFixed(2)}</p>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <button onClick={() => removeItem(item.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <div className="flex items-center gap-2 border border-border rounded-lg">
                    <button onClick={() => updateQuantity(item.id, -1)} className="p-2 hover:bg-secondary"><Minus className="h-4 w-4" /></button>
                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="p-2 hover:bg-secondary"><Plus className="h-4 w-4" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-xl p-6 sticky top-24">
              <h2 className="font-display text-xl font-semibold text-foreground mb-6">Order Summary</h2>
              <div className="space-y-3 mb-6 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span></div>
              </div>
              <div className="border-t border-border pt-4 mb-6 flex justify-between font-semibold">
                <span>Total</span><span>${total.toFixed(2)}</span>
              </div>
              <Link to="/checkout"><Button variant="luxe" className="w-full" size="lg">Proceed to Checkout</Button></Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
