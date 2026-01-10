import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState<"customer" | "vendor">("customer");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(formData.email, formData.password);
        if (error) throw error;
        toast({ title: "Welcome back!" });
        navigate("/");
      } else {
        if (formData.password !== formData.confirmPassword) {
          throw new Error("Passwords don't match");
        }
        const role = userType;
        const { error } = await signUp(formData.email, formData.password, formData.name, role as "customer" | "vendor");
        if (error) throw error;
        toast({ title: "Account created!", description: "You can now sign in." });
        setIsLogin(true);
      }
    } catch (err) {
      toast({ title: "Error", description: err instanceof Error ? err.message : "Something went wrong", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="luxe-container py-20">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <Link to="/" className="inline-block">
              <span className="font-display text-3xl font-semibold tracking-tight text-foreground">
                LUXE<span className="text-luxe-gold">.</span>
              </span>
            </Link>
          </div>

          <div className="bg-card border border-border rounded-2xl p-8">
            <div className="flex mb-8">
              <button className={`flex-1 pb-3 text-sm font-medium border-b-2 transition-colors ${isLogin ? "border-luxe-gold text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`} onClick={() => setIsLogin(true)}>Sign In</button>
              <button className={`flex-1 pb-3 text-sm font-medium border-b-2 transition-colors ${!isLogin ? "border-luxe-gold text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`} onClick={() => setIsLogin(false)}>Create Account</button>
            </div>

            {!isLogin && (
              <div className="mb-6">
                <Label className="text-sm text-muted-foreground mb-3 block">I want to:</Label>
                <div className="grid grid-cols-2 gap-3">
                  <button className={`p-4 rounded-lg border-2 text-left transition-colors ${userType === "customer" ? "border-luxe-gold bg-luxe-gold/5" : "border-border hover:border-luxe-gold/50"}`} onClick={() => setUserType("customer")}>
                    <span className="font-medium text-foreground block mb-1">Shop</span>
                    <span className="text-xs text-muted-foreground">Browse and buy products</span>
                  </button>
                  <button className={`p-4 rounded-lg border-2 text-left transition-colors ${userType === "vendor" ? "border-luxe-gold bg-luxe-gold/5" : "border-border hover:border-luxe-gold/50"}`} onClick={() => setUserType("vendor")}>
                    <span className="font-medium text-foreground block mb-1">Sell</span>
                    <span className="text-xs text-muted-foreground">List and sell products</span>
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="John Doe" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="hello@example.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="••••••••" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
              </div>
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input id="confirmPassword" type="password" placeholder="••••••••" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} required />
                </div>
              )}
              <Button variant="luxe" className="w-full" type="submit" disabled={loading}>
                {loading ? "Loading..." : isLogin ? "Sign In" : "Create Account"}
              </Button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
