import { useState } from "react";
import { Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    setEmail("");
    toast.success("Welcome to the LUXE community!", {
      description: "You'll receive exclusive offers and updates.",
    });
  };

  return (
    <section className="luxe-section bg-gradient-to-b from-secondary/50 to-background">
      <div className="luxe-container">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-luxe-gold/10">
            <Mail className="h-8 w-8 text-luxe-gold" />
          </div>
          
          <h2 className="luxe-heading-md text-foreground mt-6">
            Stay in the Loop
          </h2>
          <p className="luxe-text-body mt-2">
            Get exclusive access to new arrivals, special offers, and curated picks delivered to your inbox.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4 sm:flex-row sm:gap-3">
            <div className="relative flex-1">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="h-12 w-full rounded-lg border border-border bg-background px-4 text-foreground placeholder:text-muted-foreground focus:border-luxe-gold focus:outline-none focus:ring-2 focus:ring-luxe-gold/20 transition-all"
                required
              />
            </div>
            <Button 
              type="submit" 
              variant="luxe" 
              size="xl"
              disabled={isLoading}
              className="shrink-0"
            >
              {isLoading ? (
                "Subscribing..."
              ) : (
                <>
                  Subscribe
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <p className="mt-4 text-xs text-muted-foreground">
            By subscribing, you agree to our Privacy Policy. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
}
