import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Star, Heart, ShoppingBag, BadgeCheck, ChevronLeft, Truck, Shield, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useCurrency } from "@/contexts/CurrencyContext";

// Product data with multiple images
const allProducts = [
  {
    id: "1",
    name: "Artisan Leather Tote",
    vendor: "Heritage Goods",
    vendorVerified: true,
    price: 289,
    originalPrice: 350,
    rating: 4.9,
    reviews: 128,
    description: "Handcrafted from premium full-grain leather, this tote combines timeless elegance with everyday functionality. Features include interior pockets, magnetic closure, and adjustable straps.",
    images: [
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=700&fit=crop",
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&h=700&fit=crop",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=700&fit=crop",
      "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=600&h=700&fit=crop",
    ],
    category: "Bags",
  },
  {
    id: "2",
    name: "Minimalist Gold Watch",
    vendor: "TimeKeeper Co.",
    vendorVerified: true,
    price: 459,
    rating: 4.8,
    reviews: 89,
    description: "Swiss-made movement housed in a sleek gold-plated case. Water-resistant to 50 meters with genuine leather strap. The perfect balance of sophistication and simplicity.",
    images: [
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&h=700&fit=crop",
      "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=600&h=700&fit=crop",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=700&fit=crop",
      "https://images.unsplash.com/photo-1434056886845-dbd39c1cc727?w=600&h=700&fit=crop",
    ],
    category: "Watches",
  },
  {
    id: "3",
    name: "Hand-Poured Candle Set",
    vendor: "Serene Living",
    vendorVerified: false,
    price: 68,
    rating: 4.7,
    reviews: 234,
    description: "Set of three artisan candles made with natural soy wax and premium essential oils. Each candle offers 45+ hours of clean, even burn time with notes of lavender, vanilla, and sandalwood.",
    images: [
      "https://images.unsplash.com/photo-1602028915047-37269d1a73f7?w=600&h=700&fit=crop",
      "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600&h=700&fit=crop",
      "https://images.unsplash.com/photo-1608181831718-2501c44da4e2?w=600&h=700&fit=crop",
      "https://images.unsplash.com/photo-1599751449128-eb7249c3d6b1?w=600&h=700&fit=crop",
    ],
    category: "Home",
  },
  {
    id: "4",
    name: "Silk Blend Scarf",
    vendor: "Maison Étoile",
    vendorVerified: true,
    price: 185,
    originalPrice: 220,
    rating: 4.9,
    reviews: 67,
    description: "Luxurious silk-cashmere blend scarf featuring an exclusive hand-painted floral design. Versatile styling options make it perfect for any occasion.",
    images: [
      "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600&h=700&fit=crop",
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=700&fit=crop",
      "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=600&h=700&fit=crop",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&h=700&fit=crop",
    ],
    category: "Accessories",
  },
  {
    id: "5",
    name: "Ceramic Vase Collection",
    vendor: "Studio Terra",
    vendorVerified: true,
    price: 145,
    rating: 4.6,
    reviews: 156,
    description: "Set of three hand-thrown ceramic vases in complementary earth tones. Each piece is unique, showcasing the natural variations of artisan craftsmanship.",
    images: [
      "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=600&h=700&fit=crop",
      "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=600&h=700&fit=crop",
      "https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=600&h=700&fit=crop",
      "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&h=700&fit=crop",
    ],
    category: "Home",
  },
  {
    id: "6",
    name: "Organic Skincare Set",
    vendor: "Pure Botanics",
    vendorVerified: true,
    price: 98,
    rating: 4.8,
    reviews: 312,
    description: "Complete skincare routine featuring cleanser, serum, and moisturizer. Made with certified organic ingredients and free from parabens, sulfates, and synthetic fragrances.",
    images: [
      "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&h=700&fit=crop",
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&h=700&fit=crop",
      "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&h=700&fit=crop",
      "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=600&h=700&fit=crop",
    ],
    category: "Beauty",
  },
  {
    id: "7",
    name: "Handwoven Throw Blanket",
    vendor: "Weave & Co",
    vendorVerified: false,
    price: 175,
    rating: 4.7,
    reviews: 89,
    description: "Cozy merino wool throw blanket handwoven by skilled artisans. Features a classic herringbone pattern in neutral tones that complement any décor.",
    images: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=700&fit=crop",
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600&h=700&fit=crop",
      "https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=600&h=700&fit=crop",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&h=700&fit=crop",
    ],
    category: "Home",
  },
  {
    id: "8",
    name: "Sterling Silver Earrings",
    vendor: "Luna Jewels",
    vendorVerified: true,
    price: 125,
    originalPrice: 150,
    rating: 4.9,
    reviews: 201,
    description: "Elegant drop earrings crafted from 925 sterling silver with moonstone accents. Hypoallergenic and perfect for sensitive ears. Comes in a luxury gift box.",
    images: [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=700&fit=crop",
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=700&fit=crop",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&h=700&fit=crop",
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&h=700&fit=crop",
    ],
    category: "Jewelry",
  },
];

export default function ProductDetail() {
  const { id } = useParams();
  const { formatPrice } = useCurrency();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const product = allProducts.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-foreground">Product not found</h1>
            <Button asChild className="mt-4">
              <Link to="/shop">Back to Shop</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        <div className="luxe-container py-8">
          {/* Breadcrumb */}
          <Link 
            to="/shop" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Shop
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="aspect-[4/5] overflow-hidden rounded-xl bg-secondary">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              
              {/* Thumbnails */}
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                      selectedImage === index 
                        ? "border-luxe-gold ring-2 ring-luxe-gold/30" 
                        : "border-transparent hover:border-muted-foreground/30"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Category badge */}
              <span className="luxe-badge bg-luxe-gold/10 text-luxe-gold-dark">
                {product.category}
              </span>

              {/* Title */}
              <h1 className="luxe-heading-lg text-foreground">{product.name}</h1>

              {/* Vendor */}
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">by {product.vendor}</span>
                {product.vendorVerified && (
                  <BadgeCheck className="h-5 w-5 text-luxe-gold" />
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating)
                          ? "fill-luxe-gold text-luxe-gold"
                          : "text-muted-foreground/30"
                      }`}
                    />
                  ))}
                </div>
                <span className="font-medium text-foreground">{product.rating}</span>
                <span className="text-muted-foreground">({product.reviews} reviews)</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-semibold text-foreground">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-xl text-muted-foreground line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                    <span className="rounded-full bg-destructive px-3 py-1 text-sm font-semibold text-destructive-foreground">
                      {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                    </span>
                  </>
                )}
              </div>

              {/* Description */}
              <p className="luxe-text-body leading-relaxed">{product.description}</p>

              {/* Quantity */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-foreground">Quantity:</span>
                <div className="flex items-center rounded-lg border border-border">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 text-foreground hover:bg-secondary transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 font-medium text-foreground">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 text-foreground hover:bg-secondary transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <Button variant="luxe" size="lg" className="flex-1">
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  Add to Bag
                </Button>
                <Button variant="luxe-outline" size="lg">
                  <Heart className="h-5 w-5" />
                </Button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
                <div className="text-center">
                  <Truck className="h-6 w-6 mx-auto text-luxe-gold mb-2" />
                  <span className="text-xs text-muted-foreground">Free Shipping</span>
                </div>
                <div className="text-center">
                  <Shield className="h-6 w-6 mx-auto text-luxe-gold mb-2" />
                  <span className="text-xs text-muted-foreground">Secure Payment</span>
                </div>
                <div className="text-center">
                  <RotateCcw className="h-6 w-6 mx-auto text-luxe-gold mb-2" />
                  <span className="text-xs text-muted-foreground">30-Day Returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
