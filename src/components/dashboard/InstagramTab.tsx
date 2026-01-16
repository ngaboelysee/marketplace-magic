import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Instagram, RefreshCw, Check, X, ExternalLink, Image, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface DraftProduct {
  id: string;
  instagram_post_id: string;
  name: string;
  description: string | null;
  image_url: string;
  instagram_permalink: string | null;
  status: string;
  created_at: string;
}

interface InstagramTabProps {
  storeId: string;
  instagramUsername: string | null;
  instagramConnectedAt: string | null;
  onConnectionChange: () => void;
}

export function InstagramTab({ 
  storeId, 
  instagramUsername, 
  instagramConnectedAt,
  onConnectionChange 
}: InstagramTabProps) {
  const [drafts, setDrafts] = useState<DraftProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [connecting, setConnecting] = useState(false);

  const isConnected = !!instagramUsername;

  useEffect(() => {
    if (isConnected) {
      fetchDrafts();
    }
  }, [storeId, isConnected]);

  // Handle OAuth callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    
    if (code && state === storeId) {
      handleOAuthCallback(code);
      // Clean URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [storeId]);

  const fetchDrafts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('draft_products')
      .select('*')
      .eq('store_id', storeId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching drafts:', error);
    } else {
      setDrafts(data || []);
    }
    setLoading(false);
  };

  const handleConnect = async () => {
    setConnecting(true);
    try {
      const redirectUri = `${window.location.origin}/dashboard`;
      
      const { data, error } = await supabase.functions.invoke('instagram-auth', {
        body: { 
          action: 'get-auth-url',
          storeId,
          redirectUri
        }
      });

      if (error) throw error;
      
      // Redirect to Instagram OAuth
      window.location.href = data.authUrl;
    } catch (error: any) {
      console.error('Connect error:', error);
      toast.error(error.message || 'Failed to connect Instagram');
      setConnecting(false);
    }
  };

  const handleOAuthCallback = async (code: string) => {
    setConnecting(true);
    try {
      const redirectUri = `${window.location.origin}/dashboard`;
      
      const { data, error } = await supabase.functions.invoke('instagram-auth', {
        body: { 
          action: 'exchange-code',
          code,
          storeId,
          redirectUri
        }
      });

      if (error) throw error;
      
      toast.success(`Connected to Instagram as @${data.username}`);
      onConnectionChange();
    } catch (error: any) {
      console.error('OAuth callback error:', error);
      toast.error(error.message || 'Failed to complete Instagram connection');
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      const { error } = await supabase.functions.invoke('instagram-auth', {
        body: { action: 'disconnect', storeId }
      });

      if (error) throw error;
      
      toast.success('Instagram disconnected');
      onConnectionChange();
    } catch (error: any) {
      toast.error(error.message || 'Failed to disconnect');
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      const { data, error } = await supabase.functions.invoke('instagram-sync', {
        body: { storeId }
      });

      if (error) throw error;
      
      toast.success(`Synced! Found ${data.newDrafts} new products from ${data.totalPosts} posts`);
      fetchDrafts();
    } catch (error: any) {
      toast.error(error.message || 'Failed to sync');
    } finally {
      setSyncing(false);
    }
  };

  const handleApprove = async (draft: DraftProduct) => {
    try {
      // Create actual product
      const slug = draft.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 50);
      
      const { error: productError } = await supabase
        .from('products')
        .insert({
          store_id: storeId,
          name: draft.name,
          description: draft.description,
          images: [draft.image_url],
          slug: `${slug}-${Date.now()}`,
          price: 0, // Seller needs to set price
          inventory_count: 0,
          is_active: false, // Draft until price is set
          is_approved: false,
        });

      if (productError) throw productError;

      // Update draft status
      await supabase
        .from('draft_products')
        .update({ status: 'approved' })
        .eq('id', draft.id);

      toast.success('Product created! Set a price to publish it.');
      fetchDrafts();
    } catch (error: any) {
      toast.error(error.message || 'Failed to approve');
    }
  };

  const handleReject = async (draftId: string) => {
    try {
      await supabase
        .from('draft_products')
        .update({ status: 'rejected' })
        .eq('id', draftId);

      toast.success('Draft rejected');
      fetchDrafts();
    } catch (error: any) {
      toast.error(error.message || 'Failed to reject');
    }
  };

  const pendingDrafts = drafts.filter(d => d.status === 'pending');
  const approvedDrafts = drafts.filter(d => d.status === 'approved');
  const rejectedDrafts = drafts.filter(d => d.status === 'rejected');

  if (!isConnected) {
    return (
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center mb-4">
            <Instagram className="h-8 w-8 text-white" />
          </div>
          <CardTitle>Connect Instagram</CardTitle>
          <CardDescription>
            Link your Instagram account to automatically import posts as product drafts.
            <br />
            Use <Badge variant="secondary">#PostToStore</Badge> in your captions to import.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button 
            onClick={handleConnect}
            disabled={connecting}
            className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 hover:opacity-90"
          >
            {connecting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Instagram className="mr-2 h-4 w-4" />
                Connect Instagram
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center">
                <Instagram className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-semibold">@{instagramUsername}</p>
                <p className="text-sm text-muted-foreground">
                  Connected {instagramConnectedAt ? new Date(instagramConnectedAt).toLocaleDateString() : ''}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleSync} disabled={syncing}>
                {syncing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                <span className="ml-2">Sync Posts</span>
              </Button>
              <Button variant="ghost" onClick={handleDisconnect}>
                Disconnect
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Drafts Tabs */}
      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">
            Pending Approval
            {pendingDrafts.length > 0 && (
              <Badge variant="secondary" className="ml-2">{pendingDrafts.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : pendingDrafts.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                <Image className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No pending drafts</p>
                <p className="text-sm mt-1">
                  Post on Instagram with <Badge variant="outline">#PostToStore</Badge> and sync
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pendingDrafts.map((draft) => (
                <DraftCard 
                  key={draft.id} 
                  draft={draft} 
                  onApprove={() => handleApprove(draft)}
                  onReject={() => handleReject(draft.id)}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="approved" className="mt-4">
          {approvedDrafts.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No approved drafts yet
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {approvedDrafts.map((draft) => (
                <DraftCard key={draft.id} draft={draft} status="approved" />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="rejected" className="mt-4">
          {rejectedDrafts.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No rejected drafts
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {rejectedDrafts.map((draft) => (
                <DraftCard key={draft.id} draft={draft} status="rejected" />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function DraftCard({ 
  draft, 
  status,
  onApprove, 
  onReject 
}: { 
  draft: DraftProduct; 
  status?: string;
  onApprove?: () => void; 
  onReject?: () => void;
}) {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-square relative">
        <img 
          src={draft.image_url} 
          alt={draft.name}
          className="w-full h-full object-cover"
        />
        {draft.instagram_permalink && (
          <a 
            href={draft.instagram_permalink}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute top-2 right-2 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
          >
            <ExternalLink className="h-4 w-4 text-white" />
          </a>
        )}
      </div>
      <CardContent className="p-4">
        <h4 className="font-semibold truncate">{draft.name}</h4>
        {draft.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
            {draft.description}
          </p>
        )}
        <p className="text-xs text-muted-foreground mt-2">
          {new Date(draft.created_at).toLocaleDateString()}
        </p>
        
        {status === 'approved' && (
          <Badge className="mt-3 bg-green-500">Approved</Badge>
        )}
        {status === 'rejected' && (
          <Badge variant="destructive" className="mt-3">Rejected</Badge>
        )}
        
        {!status && onApprove && onReject && (
          <div className="flex gap-2 mt-4">
            <Button size="sm" className="flex-1" onClick={onApprove}>
              <Check className="h-4 w-4 mr-1" />
              Approve
            </Button>
            <Button size="sm" variant="outline" onClick={onReject}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
