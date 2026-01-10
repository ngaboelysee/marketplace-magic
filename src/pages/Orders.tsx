import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useCurrency } from '@/contexts/CurrencyContext';
import { Package, Truck, CheckCircle, Clock, XCircle } from 'lucide-react';

interface Order {
  id: string;
  status: string;
  total: number;
  created_at: string;
  order_items: Array<{
    id: string;
    quantity: number;
    price: number;
    products: {
      name: string;
      images: string[];
    };
  }>;
}

const statusConfig: Record<string, { label: string; color: string; icon: typeof Package }> = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-700', icon: Package },
  processing: { label: 'Processing', color: 'bg-purple-100 text-purple-700', icon: Package },
  shipped: { label: 'Shipped', color: 'bg-indigo-100 text-indigo-700', icon: Truck },
  delivered: { label: 'Delivered', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700', icon: XCircle },
};

export default function Orders() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    const { data } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          quantity,
          price,
          products (name, images)
        )
      `)
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false });

    if (data) {
      setOrders(data as Order[]);
    }
    setLoadingOrders(false);
  };

  if (loading || loadingOrders) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="luxe-container py-12">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-semibold text-foreground mb-2">
            My Orders
          </h1>
          <p className="text-muted-foreground">Track and manage your orders</p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-card border border-border rounded-2xl p-12 text-center">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="font-display text-xl font-semibold text-foreground mb-2">
              No orders yet
            </h2>
            <p className="text-muted-foreground mb-6">
              Start shopping to see your orders here
            </p>
            <Link to="/shop">
              <Button variant="luxe">Browse Products</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const status = statusConfig[order.status] || statusConfig.pending;
              const StatusIcon = status.icon;
              
              return (
                <div key={order.id} className="bg-card border border-border rounded-xl p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <p className="font-medium text-foreground">
                          Order #{order.id.slice(0, 8).toUpperCase()}
                        </p>
                        <Badge className={status.color}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {status.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Placed on {new Date(order.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Total</p>
                      <p className="text-xl font-semibold text-foreground">
                        {formatPrice(order.total)}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-border pt-4">
                    <div className="space-y-3">
                      {order.order_items.map((item) => (
                        <div key={item.id} className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-lg bg-secondary overflow-hidden flex-shrink-0">
                            {item.products.images?.[0] ? (
                              <img
                                src={item.products.images[0]}
                                alt={item.products.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="h-6 w-6 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground truncate">
                              {item.products.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Qty: {item.quantity} × {formatPrice(item.price)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
