import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const categories = [
  {
    name: "Fashion",
    description: "Curated apparel & accessories",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&h=400&fit=crop",
    href: "/categories/fashion",
    itemCount: 2450,
  },
  {
    name: "Home & Living",
    description: "Artisan decor & furniture",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&h=400&fit=crop",
    href: "/categories/home",
    itemCount: 1890,
  },
  {
    name: "Jewelry",
    description: "Handcrafted pieces",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=400&fit=crop",
    href: "/categories/jewelry",
    itemCount: 1240,
  },
  {
    name: "Art & Collectibles",
    description: "Unique creations",
    image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=600&h=400&fit=crop",
    href: "/categories/art",
    itemCount: 980,
  },
  {
    name: "Beauty",
    description: "Premium skincare & cosmetics",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&h=400&fit=crop",
    href: "/categories/beauty",
    itemCount: 1560,
  },
  {
    name: "Electronics",
    description: "Innovative gadgets",
    image: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=600&h=400&fit=crop",
    href: "/categories/electronics",
    itemCount: 720,
  },
];

export function CategoriesSection() {
  return (
    <section className="luxe-section bg-background">
      <div className="luxe-container">
        {/* Header */}
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2 className="luxe-heading-lg text-foreground">Shop by Category</h2>
            <p className="luxe-text-body mt-2">
              Explore our curated collection across all categories
            </p>
          </div>
          <Link
            to="/categories"
            className="group flex items-center gap-2 text-sm font-medium text-luxe-gold transition-colors hover:text-luxe-gold-dark"
          >
            View all categories
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => (
            <Link
              key={category.name}
              to={category.href}
              className="group relative overflow-hidden rounded-2xl bg-card shadow-luxe-sm transition-all duration-300 hover:shadow-luxe-lg"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Image */}
              <div className="aspect-[3/2] overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
              </div>

              {/* Content overlay */}
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <span className="text-xs font-medium uppercase tracking-wider text-primary-foreground/70">
                  {category.itemCount.toLocaleString()} items
                </span>
                <h3 className="mt-1 font-display text-xl font-medium text-primary-foreground">
                  {category.name}
                </h3>
                <p className="mt-1 text-sm text-primary-foreground/80">
                  {category.description}
                </p>
                
                {/* Hover indicator */}
                <div className="mt-4 flex items-center gap-2 text-sm font-medium text-primary-foreground opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  Explore
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
