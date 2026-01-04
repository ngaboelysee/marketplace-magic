import { Link } from "react-router-dom";
import { Star, Heart, ShoppingBag, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCurrency } from "@/contexts/CurrencyContext";

const trendingProducts = [
  {
    id: 1,
    name: "Artisan Leather Tote",
    vendor: "Heritage Goods",
    vendorVerified: true,
    price: 289,
    originalPrice: 350,
    rating: 4.9,
    reviews: 128,
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&h=600&fit=crop",
    href: "/product/1",
  },
  {
    id: 2,
    name: "Minimalist Gold Watch",
    vendor: "TimeKeeper Co.",
    vendorVerified: true,
    price: 459,
    rating: 4.8,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500&h=600&fit=crop",
    href: "/product/2",
  },
  {
    id: 3,
    name: "Hand-Poured Candle Set",
    vendor: "Serene Living",
    vendorVerified: false,
    price: 68,
    rating: 4.7,
    reviews: 234,
    image: "https://images.unsplash.com/photo-1602028915047-37269d1a73f7?w=500&h=600&fit=crop",
    href: "/product/3",
  },
  {
    id: 4,
    name: "Silk Blend Scarf",
    vendor: "Maison Étoile",
    vendorVerified: true,
    price: 185,
    originalPrice: 220,
    rating: 4.9,
    reviews: 67,
    image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=500&h=600&fit=crop",
    href: "/product/4",
  },
  {
    id: 5,
    name: "Ceramic Vase Collection",
    vendor: "Studio Terra",
    vendorVerified: true,
    price: 145,
    rating: 4.6,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=500&h=600&fit=crop",
    href: "/product/5",
  },
  {
    id: 6,
    name: "Organic Skincare Set",
    vendor: "Pure Botanics",
    vendorVerified: true,
    price: 98,
    rating: 4.8,
    reviews: 312,
    image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=500&h=600&fit=crop",
    href: "/product/6",
  },
  {
    id: 7,
    name: "Handwoven Throw Blanket",
    vendor: "Weave & Co",
    vendorVerified: false,
    price: 175,
    rating: 4.7,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&h=600&fit=crop",
    href: "/product/7",
  },
  {
    id: 8,
    name: "Sterling Silver Earrings",
    vendor: "Luna Jewels",
    vendorVerified: true,
    price: 125,
    originalPrice: 150,
    rating: 4.9,
    reviews: 201,
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&h=600&fit=crop",
    href: "/product/8",
  },
];

export function TrendingProducts() {
  const { formatPrice } = useCurrency();
  
  return (
    <section className="luxe-section bg-secondary/30">
      <div className="luxe-container">
        {/* Header */}
        <div className="text-center">
          <span className="luxe-badge bg-luxe-gold/10 text-luxe-gold-dark mx-auto">
            <span className="h-1.5 w-1.5 rounded-full bg-luxe-gold animate-pulse" />
            Trending Now
          </span>
          <h2 className="luxe-heading-lg text-foreground mt-4">Most Loved Products</h2>
          <p className="luxe-text-body mt-2 mx-auto max-w-2xl">
            Discover what our community is loving this week
          </p>
        </div>

        {/* Products Grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {trendingProducts.map((product, index) => (
            <div
              key={product.id}
              className="group relative rounded-xl bg-card shadow-luxe-sm transition-all duration-300 hover:shadow-luxe-lg animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Image container */}
              <div className="relative aspect-[5/6] overflow-hidden rounded-t-xl">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Discount badge */}
                {product.originalPrice && (
                  <span className="absolute left-3 top-3 rounded-full bg-destructive px-2.5 py-1 text-xs font-semibold text-destructive-foreground">
                    {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                  </span>
                )}

                {/* Quick actions */}
                <div className="absolute right-3 top-3 flex flex-col gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-9 w-9 rounded-full shadow-luxe-md"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-9 w-9 rounded-full shadow-luxe-md"
                  >
                    <ShoppingBag className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                {/* Vendor */}
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-muted-foreground">{product.vendor}</span>
                  {product.vendorVerified && (
                    <BadgeCheck className="h-3.5 w-3.5 text-luxe-gold" />
                  )}
                </div>

                {/* Title */}
                <Link to={product.href}>
                  <h3 className="mt-1.5 font-medium text-foreground transition-colors hover:text-luxe-gold line-clamp-1">
                    {product.name}
                  </h3>
                </Link>

                {/* Rating */}
                <div className="mt-2 flex items-center gap-1.5">
                  <div className="flex items-center gap-0.5">
                    <Star className="h-3.5 w-3.5 fill-luxe-gold text-luxe-gold" />
                    <span className="text-sm font-medium text-foreground">{product.rating}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    ({product.reviews} reviews)
                  </span>
                </div>

                {/* Price */}
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-lg font-semibold text-foreground">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View all button */}
        <div className="mt-12 text-center">
          <Button variant="luxe-outline" size="lg" asChild>
            <Link to="/shop">View All Products</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
