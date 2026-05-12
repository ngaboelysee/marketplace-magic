import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { z } from "zod";

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
  } | null;
}

const schema = z.object({
  customer_name: z.string().trim().min(1).max(120),
  customer_phone: z.string().trim().min(7).max(30),
  customer_email: z.string().trim().email().max(255),
  street: z.string().trim().min(1).max(200),
  city: z.string().trim().min(1).max(80),
  district: z.string().trim().max(80).optional(),
  delivery_notes: z.string().trim().max(500).optional(),
});

export default function Checkout() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [items, setItems] = useState<CartRow[]>([]);
  const [placing, setPlacing] = useState(false);
  const [form, setForm] = useState({
    customer_name: "",
    customer_phone: "",
    customer_email: user?.email ?? "",
    street: "",
    city: "Kigali",
    district: "",
    delivery_notes: "",
  });

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) setForm((f) => ({ ...f, customer_email: user.email ?? f.customer_email }));
  }, [user]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("cart_items")
        .select("id, quantity, product_id, product:products(id,name,price,images,store_id)")
        .eq("user_id", user.id);
      setItems((data as any) ?? []);
    })();
  }, [user]);

  const subtotal = items.reduce((s, i) => s + (i.product?.price ?? 0) * i.quantity, 0);
  const shipping = subtotal > 100 ? 0 : 5;
  const total = subtotal + shipping;

  const placeOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (items.length === 0) {
      toast({ title: "Your cart is empty", variant: "destructive" });
      return;
    }
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast({ title: "Check your details", description: parsed.error.issues[0].message, variant: "destructive" });
      return;
    }
    setPlacing(true);

    const shipping_address = {
      street: parsed.data.street,
      city: parsed.data.city,
      district: parsed.data.district ?? "",
      country: "Rwanda",
    };

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        total,
        status: "pending",
        shipping_address,
        customer_name: parsed.data.customer_name,
        customer_phone: parsed.data.customer_phone,
        customer_email: parsed.data.customer_email,
        delivery_notes: parsed.data.delivery_notes ?? null,
      })
      .select("id")
      .single();

    if (orderError || !order) {
      setPlacing(false);
      toast({ title: "Could not place order", description: orderError?.message, variant: "destructive" });
      return;
    }

    const orderItems = items
      .filter((i) => i.product)
      .map((i) => ({
        order_id: order.id,
        product_id: i.product!.id,
        store_id: i.product!.store_id,
        quantity: i.quantity,
        price: i.product!.price,
      }));

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
    if (itemsError) {
      setPlacing(false);
      toast({ title: "Order saved with errors", description: itemsError.message, variant: "destructive" });
      return;
    }

    await supabase.from("cart_items").delete().eq("user_id", user.id);
    setPlacing(false);
    toast({ title: "Order placed!", description: "Sellers will receive your delivery details." });
    navigate("/orders");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="luxe-container py-12">
        <h1 className="font-display text-3xl font-semibold text-foreground mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <form onSubmit={placeOrder} className="lg:col-span-2 space-y-6">
            <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
              <h2 className="font-semibold text-foreground">Contact</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customer_name">Full name *</Label>
                  <Input id="customer_name" value={form.customer_name} required
                    onChange={(e) => setForm({ ...form, customer_name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customer_phone">Phone *</Label>
                  <Input id="customer_phone" value={form.customer_phone} required placeholder="+250 78X XXX XXX"
                    onChange={(e) => setForm({ ...form, customer_phone: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="customer_email">Email *</Label>
                <Input id="customer_email" type="email" value={form.customer_email} required
                  onChange={(e) => setForm({ ...form, customer_email: e.target.value })} />
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
              <h2 className="font-semibold text-foreground">Delivery address</h2>
              <div className="space-y-2">
                <Label htmlFor="street">Street / Building *</Label>
                <Input id="street" value={form.street} required placeholder="e.g., KN 4 Avenue, House 12"
                  onChange={(e) => setForm({ ...form, street: e.target.value })} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input id="city" value={form.city} required
                    onChange={(e) => setForm({ ...form, city: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="district">District / Sector</Label>
                  <Input id="district" value={form.district} placeholder="e.g., Nyarugenge"
                    onChange={(e) => setForm({ ...form, district: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="delivery_notes">Delivery notes</Label>
                <Textarea id="delivery_notes" rows={3} value={form.delivery_notes}
                  placeholder="Landmarks, gate code, preferred time..."
                  onChange={(e) => setForm({ ...form, delivery_notes: e.target.value })} />
              </div>
            </div>

            <Button type="submit" variant="luxe" size="lg" disabled={placing || items.length === 0} className="w-full">
              {placing ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Placing order...</> : `Place Order · $${total.toFixed(2)}`}
            </Button>
          </form>

          <aside className="lg:col-span-1">
            <div className="bg-card border border-border rounded-2xl p-6 sticky top-24">
              <h2 className="font-semibold text-foreground mb-4">Order summary</h2>
              {items.length === 0 ? (
                <p className="text-sm text-muted-foreground">Your cart is empty.</p>
              ) : (
                <>
                  <ul className="space-y-3 mb-4 max-h-72 overflow-y-auto">
                    {items.map((i) => (
                      <li key={i.id} className="flex gap-3">
                        <img
                          src={i.product?.images?.[0] || "/placeholder.svg"}
                          alt={i.product?.name}
                          className="w-12 h-12 rounded-md object-cover border border-border"
                        />
                        <div className="flex-1 text-sm">
                          <p className="text-foreground line-clamp-1">{i.product?.name}</p>
                          <p className="text-muted-foreground">x{i.quantity}</p>
                        </div>
                        <p className="text-sm text-foreground">${((i.product?.price ?? 0) * i.quantity).toFixed(2)}</p>
                      </li>
                    ))}
                  </ul>
                  <div className="space-y-2 text-sm border-t border-border pt-4">
                    <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span></div>
                    <div className="flex justify-between font-semibold pt-2 border-t border-border"><span>Total</span><span>${total.toFixed(2)}</span></div>
                  </div>
                </>
              )}
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}
