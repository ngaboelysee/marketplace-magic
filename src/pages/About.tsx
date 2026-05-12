import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Shield, Sparkles, Globe, HeartHandshake } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const values = [
  { icon: Sparkles, title: "Curated Quality", text: "Every item is hand-picked from verified artisans and brands." },
  { icon: Shield, title: "Buyer Protection", text: "Secure payments and a trusted dispute resolution process." },
  { icon: Globe, title: "Local & Global", text: "Proudly based in Kigali, shipping across Rwanda and beyond." },
  { icon: HeartHandshake, title: "Empowering Sellers", text: "Tools, payouts and visibility for independent makers." },
];

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <section className="luxe-container py-16 lg:py-24 text-center max-w-3xl mx-auto">
          <p className="text-sm uppercase tracking-widest text-luxe-gold mb-4">Our Story</p>
          <h1 className="font-display text-4xl lg:text-5xl font-semibold text-foreground mb-6">
            Crafted in Kigali, designed for the world.
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            LUXE Marketplace is a premium destination connecting discerning customers with
            exceptional makers and boutiques. We believe luxury should feel personal —
            built on trust, craftsmanship, and stories worth telling.
          </p>
        </section>

        <section className="bg-secondary/30 border-y border-border py-16 lg:py-20">
          <div className="luxe-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div key={v.title} className="bg-card border border-border rounded-2xl p-6">
                <div className="w-12 h-12 rounded-xl bg-luxe-gold/10 flex items-center justify-center mb-4">
                  <v.icon className="h-6 w-6 text-luxe-gold" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="luxe-container py-16 lg:py-24 text-center max-w-2xl mx-auto">
          <h2 className="font-display text-3xl font-semibold text-foreground mb-4">
            Become part of the LUXE story
          </h2>
          <p className="text-muted-foreground mb-8">
            Whether you're shopping or selling, you're joining a community that celebrates
            quality, originality and integrity.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/shop"><Button variant="luxe" size="lg">Browse Collection</Button></Link>
            <Link to="/sell"><Button variant="outline" size="lg">Become a Seller</Button></Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
