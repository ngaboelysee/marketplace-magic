import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Package, Store, TrendingUp, Settings, Plus, Eye } from 'lucide-react';

interface StoreData {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  is_approved: boolean;
  is_active: boolean;
}

interface ProductData {
  id: string;
  name: string;
  price: number;
  inventory_count: number;
  is_approved: boolean;
  is_active: boolean;
}

export default function Dashboard() {
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [store, setStore] = useState<StoreData | null>(null);
  const [products, setProducts] = useState<ProductData[]>([]);
  const [isCreatingStore, setIsCreatingStore] = useState(false);
  const [storeForm, setStoreForm] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user && role === 'vendor') {
      fetchStore();
    }
  }, [user, role]);

  const fetchStore = async () => {
    const { data: storeData } = await supabase
      .from('stores')
      .select('*')
      .eq('owner_id', user?.id)
      .maybeSingle();

    if (storeData) {
      setStore(storeData);
      fetchProducts(storeData.id);
    }
  };

  const fetchProducts = async (storeId: string) => {
    const { data } = await supabase
      .from('products')
      .select('id, name, price, inventory_count, is_approved, is_active')
      .eq('store_id', storeId);

    if (data) setProducts(data);
  };

  const createStore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const slug = storeForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    const { error } = await supabase.from('stores').insert({
      owner_id: user.id,
      name: storeForm.name,
      slug,
      description: storeForm.description,
    });

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Store created!', description: 'Your store is pending approval.' });
      setIsCreatingStore(false);
      fetchStore();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (role !== 'vendor') {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="luxe-container py-20 text-center">
          <h1 className="font-display text-3xl font-semibold text-foreground mb-4">
            Vendor Dashboard
          </h1>
          <p className="text-muted-foreground mb-8">
            You need a vendor account to access this page.
          </p>
          <Link to="/sell">
            <Button variant="luxe">Become a Seller</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="luxe-container py-12">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-semibold text-foreground mb-2">
            Vendor Dashboard
          </h1>
          <p className="text-muted-foreground">Manage your store and products</p>
        </div>

        {!store && !isCreatingStore && (
          <div className="bg-card border border-border rounded-2xl p-8 text-center max-w-lg mx-auto">
            <Store className="h-12 w-12 text-luxe-gold mx-auto mb-4" />
            <h2 className="font-display text-xl font-semibold text-foreground mb-2">
              Create Your Store
            </h2>
            <p className="text-muted-foreground mb-6">
              Set up your store to start selling on LUXE Marketplace
            </p>
            <Button variant="luxe" onClick={() => setIsCreatingStore(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Store
            </Button>
          </div>
        )}

        {isCreatingStore && (
          <div className="bg-card border border-border rounded-2xl p-8 max-w-lg mx-auto">
            <h2 className="font-display text-xl font-semibold text-foreground mb-6">
              Create Your Store
            </h2>
            <form onSubmit={createStore} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="storeName">Store Name *</Label>
                <Input
                  id="storeName"
                  value={storeForm.name}
                  onChange={(e) => setStoreForm({ ...storeForm, name: e.target.value })}
                  placeholder="Your store name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="storeDescription">Description</Label>
                <Textarea
                  id="storeDescription"
                  value={storeForm.description}
                  onChange={(e) => setStoreForm({ ...storeForm, description: e.target.value })}
                  placeholder="Tell customers about your store..."
                  rows={4}
                />
              </div>
              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={() => setIsCreatingStore(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="luxe">Create Store</Button>
              </div>
            </form>
          </div>
        )}

        {store && (
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">
                <TrendingUp className="h-4 w-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="products">
                <Package className="h-4 w-4 mr-2" />
                Products
              </TabsTrigger>
              <TabsTrigger value="settings">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-card border border-border rounded-xl p-6">
                  <p className="text-sm text-muted-foreground mb-1">Store Status</p>
                  <p className={`font-semibold ${store.is_approved ? 'text-green-600' : 'text-yellow-600'}`}>
                    {store.is_approved ? 'Approved' : 'Pending Approval'}
                  </p>
                </div>
                <div className="bg-card border border-border rounded-xl p-6">
                  <p className="text-sm text-muted-foreground mb-1">Total Products</p>
                  <p className="font-semibold text-foreground text-2xl">{products.length}</p>
                </div>
                <div className="bg-card border border-border rounded-xl p-6">
                  <p className="text-sm text-muted-foreground mb-1">Store Visibility</p>
                  <p className={`font-semibold ${store.is_active ? 'text-green-600' : 'text-red-600'}`}>
                    {store.is_active ? 'Active' : 'Inactive'}
                  </p>
                </div>
              </div>
              {store.is_approved && (
                <div className="mt-6">
                  <Link to={`/store/${store.slug}`}>
                    <Button variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      View Store Page
                    </Button>
                  </Link>
                </div>
              )}
            </TabsContent>

            <TabsContent value="products">
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-foreground">Your Products</h3>
                  <Button variant="luxe" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </div>
                {products.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No products yet. Add your first product to get started.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {products.map((product) => (
                      <div key={product.id} className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
                        <div>
                          <p className="font-medium text-foreground">{product.name}</p>
                          <p className="text-sm text-muted-foreground">
                            ${product.price} • {product.inventory_count} in stock
                          </p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          product.is_approved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {product.is_approved ? 'Approved' : 'Pending'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="settings">
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-semibold text-foreground mb-4">Store Settings</h3>
                <div className="space-y-4">
                  <div>
                    <Label className="text-muted-foreground">Store Name</Label>
                    <p className="font-medium text-foreground">{store.name}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Store URL</Label>
                    <p className="font-medium text-foreground">/store/{store.slug}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Description</Label>
                    <p className="text-foreground">{store.description || 'No description'}</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </main>
      <Footer />
    </div>
  );
}
