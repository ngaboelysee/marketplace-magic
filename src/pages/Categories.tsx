import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Link } from "react-router-dom";

const categories = [
  {
    name: "Fashion",
    description: "Curated clothing, accessories, and footwear from top designers",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&h=400&fit=crop",
    count: 1240,
  },
  {
    name: "Beauty",
    description: "Premium skincare, makeup, and wellness products",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=400&fit=crop",
    count: 856,
  },
  {
    name: "Home & Living",
    description: "Transform your space with artisan home décor",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&h=400&fit=crop",
    count: 2100,
  },
  {
    name: "Electronics",
    description: "Latest gadgets and smart devices",
    image: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=600&h=400&fit=crop",
    count: 634,
  },
  {
    name: "Food & Beverage",
    description: "Gourmet foods and artisan beverages",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop",
    count: 445,
  },
  {
    name: "Jewelry",
    description: "Handcrafted fine jewelry and accessories",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=400&fit=crop",
    count: 789,
  },
];

export default function Categories() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="luxe-container py-12">
        <div className="mb-10">
          <h1 className="font-display text-4xl font-semibold text-foreground mb-2">
            Shop by Category
          </h1>
          <p className="text-muted-foreground">
            Browse our curated collections from verified sellers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={`/shop?category=${category.name}`}
              className="group relative overflow-hidden rounded-2xl aspect-[3/2]"
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="font-display text-2xl font-semibold text-background mb-1">
                  {category.name}
                </h3>
                <p className="text-background/80 text-sm mb-2">{category.description}</p>
                <span className="text-xs text-background/60">{category.count.toLocaleString()} products</span>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
