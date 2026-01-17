import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Grid3X3, LayoutGrid } from "lucide-react";
import { useState } from "react";
import { FilterSidebar, MobileFilterSheet, FilterState } from "@/components/shop/FilterSidebar";
import { ProductCard } from "@/components/shop/ProductCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const products = [
  {
    id: 1,
    name: "Artisan Leather Handbag",
    price: 299,
    rating: 4.8,
    reviews: 124,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=500&fit=crop",
    seller: "Milano Crafts",
    verified: true,
    category: "Fashion",
    sizes: ["S", "M", "L"],
    colors: ["#000000", "#722F37", "#C19A6B"],
  },
  {
    id: 2,
    name: "Handwoven Silk Scarf",
    price: 89,
    rating: 4.9,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=400&h=500&fit=crop",
    seller: "Silk Avenue",
    verified: true,
    category: "Fashion",
    sizes: ["M", "L", "XL"],
    colors: ["#1a365d", "#DE5D83", "#FFFFFF"],
  },
  {
    id: 3,
    name: "Organic Skincare Set",
    price: 145,
    rating: 4.7,
    reviews: 203,
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=500&fit=crop",
    seller: "Pure Botanics",
    verified: false,
    category: "Beauty",
    sizes: [],
    colors: ["#FFFFFF", "#808080"],
  },
  {
    id: 4,
    name: "Minimalist Watch",
    price: 425,
    rating: 4.9,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=500&fit=crop",
    seller: "Timepiece Co",
    verified: true,
    category: "Accessories",
    sizes: ["S", "M"],
    colors: ["#000000", "#C19A6B", "#808080"],
  },
  {
    id: 5,
    name: "Ceramic Vase Collection",
    price: 78,
    rating: 4.6,
    reviews: 67,
    image: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=400&h=500&fit=crop",
    seller: "Home Artistry",
    verified: false,
    category: "Home",
    sizes: [],
    colors: ["#FFFFFF", "#556B2F"],
  },
  {
    id: 6,
    name: "Premium Wireless Earbuds",
    price: 199,
    rating: 4.8,
    reviews: 342,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=500&fit=crop",
    seller: "TechElite",
    verified: true,
    category: "Electronics",
    sizes: [],
    colors: ["#000000", "#FFFFFF"],
  },
  {
    id: 7,
    name: "Cashmere Blend Sweater",
    price: 320,
    rating: 4.9,
    reviews: 178,
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=500&fit=crop",
    seller: "Nordic Luxe",
    verified: true,
    category: "Fashion",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["#C19A6B", "#1a365d", "#808080", "#000000"],
  },
  {
    id: 8,
    name: "Handcrafted Jewelry Box",
    price: 156,
    rating: 4.7,
    reviews: 98,
    image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400&h=500&fit=crop",
    seller: "Woodcraft Studio",
    verified: false,
    category: "Home",
    sizes: [],
    colors: ["#722F37", "#C19A6B"],
  },
];

const categories = ["All", "Fashion", "Beauty", "Home", "Electronics", "Accessories"];
const MAX_PRICE = 500;

export default function Shop() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [gridCols, setGridCols] = useState<3 | 4>(3);
  const [filters, setFilters] = useState<FilterState>({
    sizes: [],
    colors: [],
    priceRange: [0, MAX_PRICE],
  });

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Size filter
    const matchesSize = filters.sizes.length === 0 || 
      filters.sizes.some(size => product.sizes?.includes(size));
    
    // Color filter - match by hex
    const colorMap: Record<string, string> = {
      "Black": "#000000",
      "White": "#FFFFFF",
      "Navy": "#1a365d",
      "Burgundy": "#722F37",
      "Olive": "#556B2F",
      "Camel": "#C19A6B",
      "Blush": "#DE5D83",
      "Grey": "#808080",
    };
    const matchesColor = filters.colors.length === 0 || 
      filters.colors.some(colorName => product.colors?.includes(colorMap[colorName]));
    
    // Price filter
    const matchesPrice = product.price >= filters.priceRange[0] && 
      product.price <= filters.priceRange[1];

    return matchesCategory && matchesSearch && matchesSize && matchesColor && matchesPrice;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      case "newest":
        return b.id - a.id;
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="luxe-container py-8 lg:py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl lg:text-4xl font-semibold text-foreground mb-2">
            Shop Collection
          </h1>
          <p className="text-muted-foreground">
            Curated pieces from verified sellers worldwide
          </p>
        </div>

        {/* Top Bar: Search + Categories + Sort */}
        <div className="space-y-4 mb-8">
          {/* Search and Sort Row */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                className="pl-10 h-11"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <MobileFilterSheet 
                filters={filters} 
                onFiltersChange={setFilters} 
                maxPrice={MAX_PRICE}
              />
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[160px] h-11">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Top Rated</SelectItem>
                </SelectContent>
              </Select>
              <div className="hidden lg:flex border rounded-lg overflow-hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  className={gridCols === 3 ? "bg-muted" : ""}
                  onClick={() => setGridCols(3)}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={gridCols === 4 ? "bg-muted" : ""}
                  onClick={() => setGridCols(4)}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category 
                  ? "bg-foreground text-background hover:bg-foreground/90" 
                  : "hover:border-foreground"
                }
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Main Content: Sidebar + Products */}
        <div className="flex gap-8">
          {/* Desktop Filter Sidebar */}
          <FilterSidebar 
            filters={filters} 
            onFiltersChange={setFilters} 
            maxPrice={MAX_PRICE}
          />

          {/* Products Section */}
          <div className="flex-1">
            {/* Results count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground">
                Showing <span className="font-medium text-foreground">{sortedProducts.length}</span> products
              </p>
            </div>

            {/* Products Grid */}
            {sortedProducts.length > 0 ? (
              <div className={`grid grid-cols-2 sm:grid-cols-2 gap-4 lg:gap-6 ${
                gridCols === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'
              }`}>
                {sortedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    rating={product.rating}
                    reviews={product.reviews}
                    image={product.image}
                    seller={product.seller}
                    verified={product.verified}
                    colors={product.colors}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-lg text-muted-foreground mb-2">No products found</p>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your filters or search terms
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setFilters({ sizes: [], colors: [], priceRange: [0, MAX_PRICE] })}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
