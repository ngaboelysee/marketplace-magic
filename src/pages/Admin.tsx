import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Store, Package, Users, Check, X, Eye } from 'lucide-react';

interface PendingStore {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
  owner_id: string;
}

interface PendingProduct {
  id: string;
  name: string;
  price: number;
  store_id: string;
  created_at: string;
  stores: { name: string } | null;
}

export default function Admin() {
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [pendingStores, setPendingStores] = useState<PendingStore[]>([]);
  const [pendingProducts, setPendingProducts] = useState<PendingProduct[]>([]);

  useEffect(() => {
    if (!loading && (!user || role !== 'admin')) {
      navigate('/');
    }
  }, [user, role, loading, navigate]);

  useEffect(() => {
    if (user && role === 'admin') {
      fetchPendingItems();
    }
  }, [user, role]);

  const fetchPendingItems = async () => {
    // Fetch pending stores
    const { data: stores } = await supabase
      .from('stores')
      .select('*')
      .eq('is_approved', false);
    if (stores) setPendingStores(stores);

    // Fetch pending products
    const { data: products } = await supabase
      .from('products')
      .select('*, stores(name)')
      .eq('is_approved', false);
    if (products) setPendingProducts(products as PendingProduct[]);
  };

  const approveStore = async (storeId: string) => {
    const { error } = await supabase
      .from('stores')
      .update({ is_approved: true })
      .eq('id', storeId);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Store approved!' });
      fetchPendingItems();
    }
  };

  const rejectStore = async (storeId: string) => {
    const { error } = await supabase
      .from('stores')
      .delete()
      .eq('id', storeId);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Store rejected and removed' });
      fetchPendingItems();
    }
  };

  const approveProduct = async (productId: string) => {
    const { error } = await supabase
      .from('products')
      .update({ is_approved: true })
      .eq('id', productId);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Product approved!' });
      fetchPendingItems();
    }
  };

  const rejectProduct = async (productId: string) => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Product removed' });
      fetchPendingItems();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="luxe-container py-12">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-semibold text-foreground mb-2">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">Manage stores, products, and users</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-luxe-gold/10 flex items-center justify-center">
                <Store className="h-5 w-5 text-luxe-gold" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending Stores</p>
                <p className="text-2xl font-semibold text-foreground">{pendingStores.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-luxe-gold/10 flex items-center justify-center">
                <Package className="h-5 w-5 text-luxe-gold" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending Products</p>
                <p className="text-2xl font-semibold text-foreground">{pendingProducts.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-luxe-gold/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-luxe-gold" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Actions</p>
                <p className="text-2xl font-semibold text-foreground">
                  {pendingStores.length + pendingProducts.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="stores" className="space-y-6">
          <TabsList>
            <TabsTrigger value="stores">
              <Store className="h-4 w-4 mr-2" />
              Pending Stores ({pendingStores.length})
            </TabsTrigger>
            <TabsTrigger value="products">
              <Package className="h-4 w-4 mr-2" />
              Pending Products ({pendingProducts.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="stores">
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              {pendingStores.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  No pending stores to review
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {pendingStores.map((store) => (
                    <div key={store.id} className="p-4 flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-foreground">{store.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {store.description || 'No description'}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Submitted {new Date(store.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => approveStore(store.id)}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => rejectStore(store.id)}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="products">
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              {pendingProducts.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  No pending products to review
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {pendingProducts.map((product) => (
                    <div key={product.id} className="p-4 flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-foreground">{product.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          ${product.price} • {product.stores?.name || 'Unknown store'}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Submitted {new Date(product.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => approveProduct(product.id)}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => rejectProduct(product.id)}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}
