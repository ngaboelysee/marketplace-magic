import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal, Star, Heart, ShoppingBag } from "lucide-react";
import { useState } from "react";

const products = [
  {
    id: 1,
    name: "Artisan Leather Handbag",
    price: 299,
    rating: 4.8,
    reviews: 124,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop",
    seller: "Milano Crafts",
    verified: true,
    category: "Fashion",
  },
  {
    id: 2,
    name: "Handwoven Silk Scarf",
    price: 89,
    rating: 4.9,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=400&h=400&fit=crop",
    seller: "Silk Avenue",
    verified: true,
    category: "Fashion",
  },
  {
    id: 3,
    name: "Organic Skincare Set",
    price: 145,
    rating: 4.7,
    reviews: 203,
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop",
    seller: "Pure Botanics",
    verified: false,
    category: "Beauty",
  },
  {
    id: 4,
    name: "Minimalist Watch",
    price: 425,
    rating: 4.9,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    seller: "Timepiece Co",
    verified: true,
    category: "Accessories",
  },
  {
    id: 5,
    name: "Ceramic Vase Collection",
    price: 78,
    rating: 4.6,
    reviews: 67,
    image: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=400&h=400&fit=crop",
    seller: "Home Artistry",
    verified: false,
    category: "Home",
  },
  {
    id: 6,
    name: "Premium Wireless Earbuds",
    price: 199,
    rating: 4.8,
    reviews: 342,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop",
    seller: "TechElite",
    verified: true,
    category: "Electronics",
  },
  {
    id: 7,
    name: "Artisan Coffee Beans",
    price: 34,
    rating: 4.9,
    reviews: 521,
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop",
    seller: "Bean Masters",
    verified: true,
    category: "Food",
  },
  {
    id: 8,
    name: "Handcrafted Jewelry Box",
    price: 156,
    rating: 4.7,
    reviews: 98,
    image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400&h=400&fit=crop",
    seller: "Woodcraft Studio",
    verified: false,
    category: "Home",
  },
];

const categories = ["All", "Fashion", "Beauty", "Home", "Electronics", "Food", "Accessories"];

export default function Shop() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="luxe-container py-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="font-display text-4xl font-semibold text-foreground mb-2">
            Shop All Products
          </h1>
          <p className="text-muted-foreground">
            Discover curated products from verified sellers worldwide
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "luxe" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
          <Button variant="outline" size="icon">
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
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
                {product.verified && (
                  <span className="absolute top-3 left-3 px-2 py-1 text-xs font-medium bg-luxe-gold text-primary-foreground rounded-full">
                    Verified
                  </span>
                )}
              </div>
              <div className="p-4">
                <p className="text-xs text-muted-foreground mb-1">{product.seller}</p>
                <h3 className="font-medium text-foreground mb-2 line-clamp-1">{product.name}</h3>
                <div className="flex items-center gap-1 mb-3">
                  <Star className="h-3.5 w-3.5 fill-luxe-gold text-luxe-gold" />
                  <span className="text-sm font-medium">{product.rating}</span>
                  <span className="text-xs text-muted-foreground">({product.reviews})</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-foreground">${product.price}</span>
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
