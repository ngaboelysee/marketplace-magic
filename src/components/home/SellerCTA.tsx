import { Link } from "react-router-dom";
import { ArrowRight, TrendingUp, Users, DollarSign, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";

const benefits = [
  {
    icon: Users,
    title: "10,000+ Active Buyers",
    description: "Access our growing community of engaged shoppers",
  },
  {
    icon: DollarSign,
    title: "Competitive Fees",
    description: "Keep more of your profits with our fair pricing",
  },
  {
    icon: TrendingUp,
    title: "Growth Support",
    description: "Tools and insights to help scale your business",
  },
  {
    icon: BarChart3,
    title: "Real-Time Analytics",
    description: "Track sales, views, and customer behavior",
  },
];

export function SellerCTA() {
  return (
    <section className="luxe-section bg-foreground text-background">
      <div className="luxe-container">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Content */}
          <div>
            <span className="luxe-badge bg-background/10 text-background/80 mb-6">
              For Sellers
            </span>
            <h2 className="luxe-heading-lg text-background">
              Turn Your Passion Into{" "}
              <span className="text-luxe-gold">Profit</span>
            </h2>
            <p className="mt-4 text-lg text-background/70 leading-relaxed">
              Join thousands of successful vendors who have built thriving businesses on LUXE Market. Get access to our premium customer base and powerful selling tools.
            </p>

            {/* Benefits grid */}
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {benefits.map((benefit) => (
                <div key={benefit.title} className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-luxe-gold/20">
                    <benefit.icon className="h-5 w-5 text-luxe-gold" />
                  </div>
                  <div>
                    <h3 className="font-medium text-background">{benefit.title}</h3>
                    <p className="mt-0.5 text-sm text-background/60">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <Button variant="luxe" size="xl" asChild>
                <Link to="/sell">
                  Start Selling Today
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="xl" 
                asChild
                className="border-background/20 text-background hover:bg-background/10 hover:text-background"
              >
                <Link to="/sell">Learn More</Link>
              </Button>
            </div>
          </div>

          {/* Stats card */}
          <div className="relative">
            <div className="rounded-2xl bg-background/5 p-8 backdrop-blur-sm border border-background/10">
              <h3 className="font-display text-xl font-medium text-background">
                Seller Success Stories
              </h3>
              <div className="mt-6 space-y-6">
                <div className="flex items-center justify-between border-b border-background/10 pb-4">
                  <div>
                    <p className="text-3xl font-semibold text-luxe-gold">$2.4M+</p>
                    <p className="mt-1 text-sm text-background/60">Paid to sellers this month</p>
                  </div>
                </div>
                <div className="flex items-center justify-between border-b border-background/10 pb-4">
                  <div>
                    <p className="text-3xl font-semibold text-luxe-gold">15,000+</p>
                    <p className="mt-1 text-sm text-background/60">Active verified sellers</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-semibold text-luxe-gold">4.8/5</p>
                    <p className="mt-1 text-sm text-background/60">Average seller rating</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-luxe-gold/20 blur-2xl" />
            <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-luxe-gold/10 blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
