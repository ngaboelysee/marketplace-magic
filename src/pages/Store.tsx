import { useParams, Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Calendar, ShieldCheck, Heart, ShoppingBag } from 'lucide-react';
import { useCurrency } from '@/contexts/CurrencyContext';

// Mock store data - will be replaced with Supabase data
const mockStores: Record<string, {
  id: string;
  name: string;
  slug: string;
  description: string;
  logo_url: string;
  banner_url: string;
  rating: number;
  reviews_count: number;
  products_count: number;
  joined_date: string;
  location: string;
  is_verified: boolean;
  products: Array<{
    id: string;
    name: string;
    price: number;
    image: string;
    rating: number;
  }>;
}> = {
  'milano-crafts': {
    id: '1',
    name: 'Milano Crafts',
    slug: 'milano-crafts',
    description: 'Premium handcrafted leather goods from Italian artisans. Each piece is carefully made with generations of expertise.',
    logo_url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop',
    banner_url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=400&fit=crop',
    rating: 4.9,
    reviews_count: 342,
    products_count: 45,
    joined_date: '2023',
    location: 'Milan, Italy',
    is_verified: true,
    products: [
      { id: '1', name: 'Artisan Leather Handbag', price: 299, image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop', rating: 4.8 },
      { id: '2', name: 'Classic Leather Wallet', price: 89, image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&h=400&fit=crop', rating: 4.9 },
      { id: '3', name: 'Leather Belt', price: 75, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop', rating: 4.7 },
    ],
  },
  'silk-avenue': {
    id: '2',
    name: 'Silk Avenue',
    slug: 'silk-avenue',
    description: 'Luxurious silk products handwoven by master artisans. Bringing the finest silk traditions to modern fashion.',
    logo_url: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=200&h=200&fit=crop',
    banner_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=400&fit=crop',
    rating: 4.8,
    reviews_count: 189,
    products_count: 32,
    joined_date: '2022',
    location: 'Hangzhou, China',
    is_verified: true,
    products: [
      { id: '4', name: 'Handwoven Silk Scarf', price: 89, image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=400&h=400&fit=crop', rating: 4.9 },
      { id: '5', name: 'Silk Pillowcase Set', price: 120, image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=400&h=400&fit=crop', rating: 4.8 },
    ],
  },
};

export default function Store() {
  const { slug } = useParams<{ slug: string }>();
  const { formatPrice } = useCurrency();

  const store = slug ? mockStores[slug] : null;

  if (!store) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="luxe-container py-20 text-center">
          <h1 className="font-display text-3xl font-semibold text-foreground mb-4">Store Not Found</h1>
          <p className="text-muted-foreground mb-8">This store doesn't exist or hasn't been approved yet.</p>
          <Link to="/shop">
            <Button variant="luxe">Browse Products</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* Banner */}
        <div className="relative h-64 md:h-80">
          <img
            src={store.banner_url}
            alt={`${store.name} banner`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        </div>

        {/* Store Header */}
        <div className="luxe-container -mt-20 relative z-10">
          <div className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-luxe-lg">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <img
                src={store.logo_url}
                alt={store.name}
                className="w-24 h-24 rounded-xl object-cover border-4 border-background shadow-lg"
              />
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h1 className="font-display text-2xl md:text-3xl font-semibold text-foreground">
                    {store.name}
                  </h1>
                  {store.is_verified && (
                    <Badge className="bg-luxe-gold text-primary-foreground">
                      <ShieldCheck className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground mb-4 max-w-2xl">{store.description}</p>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-luxe-gold text-luxe-gold" />
                    <span className="font-medium text-foreground">{store.rating}</span>
                    <span>({store.reviews_count} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {store.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Seller since {store.joined_date}
                  </div>
                </div>
              </div>
              <Button variant="outline">Follow Store</Button>
            </div>
          </div>
        </div>

        {/* Products */}
        <section className="luxe-container py-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display text-2xl font-semibold text-foreground">
              Products ({store.products_count})
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {store.products.map((product) => (
              <Link 
                key={product.id} 
                to={`/product/${product.id}`}
                className="group bg-card rounded-xl border border-border overflow-hidden hover:shadow-luxe-lg transition-all duration-300"
              >
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <button 
                    className="absolute top-3 right-3 p-2 rounded-full bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
                    onClick={(e) => e.preventDefault()}
                  >
                    <Heart className="h-4 w-4 text-foreground" />
                  </button>
                </div>
                <div className="p-4">
                  <p className="text-xs text-muted-foreground mb-1">{store.name}</p>
                  <h3 className="font-medium text-foreground mb-2 line-clamp-1">{product.name}</h3>
                  <div className="flex items-center gap-1 mb-3">
                    <Star className="h-3.5 w-3.5 fill-luxe-gold text-luxe-gold" />
                    <span className="text-sm font-medium">{product.rating}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-foreground">{formatPrice(product.price)}</span>
                    <Button size="sm" variant="luxe" onClick={(e) => e.preventDefault()}>
                      <ShoppingBag className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
