import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { DollarSign, CreditCard, CheckCircle, Loader2, AlertCircle } from 'lucide-react';

interface Bank {
  id: number;
  name: string;
  code: string;
}

interface PayoutsTabProps {
  storeId: string;
  subaccountId: string | null;
  bankName: string | null;
  accountNumber: string | null;
  businessName: string | null;
}

export function PayoutsTab({ storeId, subaccountId, bankName, accountNumber, businessName }: PayoutsTabProps) {
  const { toast } = useToast();
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [loadingBanks, setLoadingBanks] = useState(true);
  const [loadingBalance, setLoadingBalance] = useState(false);
  const [verified, setVerified] = useState(false);
  const [verifiedName, setVerifiedName] = useState('');
  const [apiConfigured, setApiConfigured] = useState(true);
  
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [pendingSettlements, setPendingSettlements] = useState(0);

  const [form, setForm] = useState({
    businessName: businessName || '',
    bankCode: '',
    accountNumber: accountNumber || '',
  });

  useEffect(() => {
    fetchBanks();
    if (subaccountId) {
      fetchBalance();
    }
  }, [subaccountId]);

  const fetchBanks = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('flutterwave-banks', {
        method: 'GET',
      });

      if (error) throw error;
      
      if (data.error === 'Flutterwave API key not configured') {
        setApiConfigured(false);
        setLoadingBanks(false);
        return;
      }

      if (data.banks) {
        setBanks(data.banks);
      }
    } catch (error) {
      console.error('Error fetching banks:', error);
    } finally {
      setLoadingBanks(false);
    }
  };

  const fetchBalance = async () => {
    setLoadingBalance(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const { data, error } = await supabase.functions.invoke('flutterwave-get-balance', {
        body: { storeId },
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (error) throw error;
      
      if (data.success) {
        setTotalEarnings(data.totalEarnings || 0);
        setPendingSettlements(data.pendingSettlements || 0);
      }
    } catch (error) {
      console.error('Error fetching balance:', error);
    } finally {
      setLoadingBalance(false);
    }
  };

  const verifyAccount = async () => {
    if (!form.accountNumber || !form.bankCode) {
      toast({ title: 'Error', description: 'Please enter account number and select a bank', variant: 'destructive' });
      return;
    }

    setVerifying(true);
    setVerified(false);

    try {
      const { data, error } = await supabase.functions.invoke('flutterwave-verify-account', {
        body: {
          accountNumber: form.accountNumber,
          bankCode: form.bankCode,
        },
      });

      if (error) throw error;

      if (data.success) {
        setVerified(true);
        setVerifiedName(data.account_name);
        toast({ title: 'Account Verified', description: `Account name: ${data.account_name}` });
      } else {
        toast({ title: 'Verification Failed', description: data.error || 'Could not verify account', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to verify account', variant: 'destructive' });
    } finally {
      setVerifying(false);
    }
  };

  const setupPayout = async () => {
    if (!form.businessName || !form.bankCode || !form.accountNumber) {
      toast({ title: 'Error', description: 'Please fill all fields', variant: 'destructive' });
      return;
    }

    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();

      const { data, error } = await supabase.functions.invoke('flutterwave-create-subaccount', {
        body: {
          storeId,
          businessName: form.businessName,
          bankCode: form.bankCode,
          accountNumber: form.accountNumber,
          splitValue: 90, // Vendor gets 90%, platform gets 10%
        },
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (error) throw error;

      if (data.success) {
        toast({ title: 'Payout Account Setup!', description: 'Your bank account has been connected for payouts.' });
        // Reload page to reflect changes
        window.location.reload();
      } else {
        toast({ title: 'Setup Failed', description: data.error || 'Could not setup payout account', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to setup payout account', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  if (!apiConfigured) {
    return (
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="text-center py-8">
          <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="font-semibold text-foreground mb-2">Payment System Not Configured</h3>
          <p className="text-muted-foreground">
            The payment gateway is being set up. Please check back later.
          </p>
        </div>
      </div>
    );
  }

  if (subaccountId) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-sm text-muted-foreground">Total Earnings</p>
            </div>
            {loadingBalance ? (
              <div className="animate-pulse h-8 w-24 bg-secondary rounded" />
            ) : (
              <p className="font-display text-3xl font-bold text-foreground">
                ₦{totalEarnings.toLocaleString()}
              </p>
            )}
          </div>
          
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <CreditCard className="h-5 w-5 text-yellow-600" />
              </div>
              <p className="text-sm text-muted-foreground">Pending Settlements</p>
            </div>
            {loadingBalance ? (
              <div className="animate-pulse h-8 w-24 bg-secondary rounded" />
            ) : (
              <p className="font-display text-3xl font-bold text-foreground">
                ₦{pendingSettlements.toLocaleString()}
              </p>
            )}
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-semibold text-foreground mb-4">Connected Bank Account</h3>
          <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div>
              <p className="font-medium text-foreground">{businessName}</p>
              <p className="text-sm text-muted-foreground">
                {bankName} • ****{accountNumber?.slice(-4)}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <h3 className="font-semibold text-foreground mb-2">Setup Payout Account</h3>
      <p className="text-sm text-muted-foreground mb-6">
        Connect your bank account to receive payments from your sales. You'll receive 90% of each sale automatically.
      </p>

      <div className="space-y-4 max-w-md">
        <div className="space-y-2">
          <Label htmlFor="businessName">Business Name *</Label>
          <Input
            id="businessName"
            value={form.businessName}
            onChange={(e) => setForm({ ...form, businessName: e.target.value })}
            placeholder="Your business or store name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bank">Select Bank *</Label>
          {loadingBanks ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading banks...
            </div>
          ) : (
            <Select
              value={form.bankCode}
              onValueChange={(value) => {
                setForm({ ...form, bankCode: value });
                setVerified(false);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your bank" />
              </SelectTrigger>
              <SelectContent>
                {banks.map((bank) => (
                  <SelectItem key={bank.code} value={bank.code}>
                    {bank.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="accountNumber">Account Number *</Label>
          <div className="flex gap-2">
            <Input
              id="accountNumber"
              value={form.accountNumber}
              onChange={(e) => {
                setForm({ ...form, accountNumber: e.target.value });
                setVerified(false);
              }}
              placeholder="0123456789"
              maxLength={10}
            />
            <Button
              type="button"
              variant="outline"
              onClick={verifyAccount}
              disabled={verifying || !form.accountNumber || !form.bankCode}
            >
              {verifying ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Verify'}
            </Button>
          </div>
          {verified && (
            <p className="text-sm text-green-600 flex items-center gap-1">
              <CheckCircle className="h-4 w-4" />
              {verifiedName}
            </p>
          )}
        </div>

        <Button
          variant="luxe"
          onClick={setupPayout}
          disabled={loading || !verified}
          className="w-full mt-6"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Setting up...
            </>
          ) : (
            'Setup Payout Account'
          )}
        </Button>
      </div>
    </div>
  );
}
