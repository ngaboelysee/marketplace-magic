import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Star, Heart, ShoppingBag, TrendingUp, Flame } from "lucide-react";

const trendingProducts = [
  {
    id: 1,
    name: "Limited Edition Sneakers",
    price: 289,
    originalPrice: 350,
    rating: 4.9,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop",
    seller: "Street Luxe",
    verified: true,
    trending: "Hot",
    salesCount: 234,
  },
  {
    id: 2,
    name: "Smart Fitness Watch",
    price: 199,
    rating: 4.8,
    reviews: 456,
    image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400&h=400&fit=crop",
    seller: "TechElite",
    verified: true,
    trending: "Rising",
    salesCount: 567,
  },
  {
    id: 3,
    name: "Organic Face Serum",
    price: 68,
    rating: 4.9,
    reviews: 312,
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop",
    seller: "Pure Botanics",
    verified: true,
    trending: "Hot",
    salesCount: 890,
  },
  {
    id: 4,
    name: "Vintage Polaroid Camera",
    price: 159,
    rating: 4.7,
    reviews: 178,
    image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=400&fit=crop",
    seller: "Retro Finds",
    verified: false,
    trending: "Rising",
    salesCount: 123,
  },
  {
    id: 5,
    name: "Premium Yoga Mat",
    price: 85,
    rating: 4.8,
    reviews: 267,
    image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&h=400&fit=crop",
    seller: "Zen Living",
    verified: true,
    trending: "Hot",
    salesCount: 445,
  },
  {
    id: 6,
    name: "Artisan Candle Set",
    price: 54,
    rating: 4.9,
    reviews: 198,
    image: "https://images.unsplash.com/photo-1602028915047-37269d1a73f7?w=400&h=400&fit=crop",
    seller: "Home Artistry",
    verified: true,
    trending: "Rising",
    salesCount: 334,
  },
];

export default function Trending() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="luxe-container py-12">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="h-8 w-8 text-luxe-gold" />
            <h1 className="font-display text-4xl font-semibold text-foreground">
              Trending Now
            </h1>
          </div>
          <p className="text-muted-foreground">
            The most popular products our customers love this week
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingProducts.map((product) => (
            <div
              key={product.id}
              className="group bg-card rounded-xl border border-border overflow-hidden hover:shadow-luxe transition-all duration-300"
            >
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <button className="absolute top-3 right-3 p-2 rounded-full bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background">
                  <Heart className="h-4 w-4 text-foreground" />
                </button>
                <span className={`absolute top-3 left-3 px-2 py-1 text-xs font-medium rounded-full flex items-center gap-1 ${
                  product.trending === "Hot" 
                    ? "bg-red-500 text-white" 
                    : "bg-luxe-gold text-primary-foreground"
                }`}>
                  {product.trending === "Hot" ? <Flame className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
                  {product.trending}
                </span>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs text-muted-foreground">{product.seller}</p>
                  {product.verified && (
                    <span className="text-xs text-luxe-gold font-medium">✓ Verified</span>
                  )}
                </div>
                <h3 className="font-medium text-foreground mb-2 line-clamp-1">{product.name}</h3>
                <div className="flex items-center gap-1 mb-2">
                  <Star className="h-3.5 w-3.5 fill-luxe-gold text-luxe-gold" />
                  <span className="text-sm font-medium">{product.rating}</span>
                  <span className="text-xs text-muted-foreground">({product.reviews})</span>
                  <span className="text-xs text-muted-foreground ml-auto">{product.salesCount} sold</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold text-foreground">${product.price}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">${product.originalPrice}</span>
                    )}
                  </div>
                  <Button size="sm" variant="luxe">
                    <ShoppingBag className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
