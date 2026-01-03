import { Link } from "react-router-dom";
import { ArrowRight, Shield, Truck, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-secondary/50 to-background">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 right-0 h-[800px] w-[800px] rounded-full bg-luxe-gold/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-[600px] w-[600px] rounded-full bg-luxe-gold/5 blur-3xl" />
      </div>

      <div className="luxe-container relative">
        <div className="grid min-h-[calc(100vh-5rem)] items-center gap-12 py-16 lg:grid-cols-2 lg:gap-16 lg:py-24">
          {/* Content */}
          <div className="flex flex-col justify-center">
            <div className="animate-slide-up">
              <span className="luxe-badge bg-luxe-gold/10 text-luxe-gold-dark mb-6">
                <span className="h-1.5 w-1.5 rounded-full bg-luxe-gold" />
                Trusted by 10,000+ customers
              </span>
            </div>
            
            <h1 className="luxe-heading-xl text-foreground animate-slide-up" style={{ animationDelay: "100ms" }}>
              Discover{" "}
              <span className="text-luxe-gold">Curated</span>
              <br />
              Products from
              <br />
              <span className="font-display italic">Verified Sellers</span>
            </h1>

            <p className="luxe-text-body mt-6 max-w-lg animate-slide-up" style={{ animationDelay: "200ms" }}>
              Shop luxury goods, artisan crafts, and premium brands from our handpicked community of trusted vendors. Quality guaranteed.
            </p>

            <div className="mt-8 flex flex-wrap gap-4 animate-slide-up" style={{ animationDelay: "300ms" }}>
              <Button variant="luxe" size="xl" asChild>
                <Link to="/shop">
                  Explore Collection
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="luxe-outline" size="xl" asChild>
                <Link to="/sell">Start Selling</Link>
              </Button>
            </div>

            {/* Trust badges */}
            <div className="mt-12 grid grid-cols-3 gap-6 border-t border-border pt-8 animate-slide-up" style={{ animationDelay: "400ms" }}>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                  <Shield className="h-5 w-5 text-luxe-gold" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Verified</p>
                  <p className="text-xs text-muted-foreground">Sellers</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                  <Truck className="h-5 w-5 text-luxe-gold" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Fast</p>
                  <p className="text-xs text-muted-foreground">Shipping</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                  <CreditCard className="h-5 w-5 text-luxe-gold" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Secure</p>
                  <p className="text-xs text-muted-foreground">Checkout</p>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Image Grid */}
          <div className="relative hidden lg:block">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-secondary shadow-luxe-lg animate-scale-in" style={{ animationDelay: "200ms" }}>
                  <img
                    src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=800&fit=crop"
                    alt="Premium fashion boutique"
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div className="aspect-square overflow-hidden rounded-2xl bg-secondary shadow-luxe-lg animate-scale-in" style={{ animationDelay: "400ms" }}>
                  <img
                    src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=400&fit=crop"
                    alt="Artisan jewelry"
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
              </div>
              <div className="mt-8 space-y-4">
                <div className="aspect-square overflow-hidden rounded-2xl bg-secondary shadow-luxe-lg animate-scale-in" style={{ animationDelay: "300ms" }}>
                  <img
                    src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop"
                    alt="Premium watch"
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-secondary shadow-luxe-lg animate-scale-in" style={{ animationDelay: "500ms" }}>
                  <img
                    src="https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600&h=800&fit=crop"
                    alt="Home decor"
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
              </div>
            </div>
            
            {/* Floating badge */}
            <div className="absolute -left-4 bottom-24 rounded-xl bg-card p-4 shadow-luxe-xl animate-slide-up" style={{ animationDelay: "600ms" }}>
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  <div className="h-8 w-8 rounded-full bg-luxe-gold" />
                  <div className="h-8 w-8 rounded-full bg-foreground" />
                  <div className="h-8 w-8 rounded-full bg-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">500+ Vendors</p>
                  <p className="text-xs text-muted-foreground">Joined this month</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
