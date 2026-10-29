import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useForm } from '@tanstack/react-form';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CreditCard, Smartphone, Banknote, Wallet } from 'lucide-react';

const paymentItems = [
  { label: 'Cash on Delivery', value: 'cod', icon: Banknote },
  { label: 'bKash', value: 'bkash', icon: Smartphone },
  { label: 'Card / SSLCommerz', value: 'sslcommerz', icon: CreditCard },
];

export function Checkout() {
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: cart } = useQuery({
    queryKey: ['cart'],
    queryFn: () => api.get('/cart').then((r) => r.data.data),
  });

  const { data: zones } = useQuery({
    queryKey: ['zones'],
    queryFn: () => api.get('/delivery-zones').then((r) => r.data.data),
  });

  const placeOrder = useMutation({
    mutationFn: (payload: any) => api.post('/orders', payload),
    onSuccess: async (res) => {
      const order = res.data.data;
      toast.success('Order placed!');
      qc.invalidateQueries({ queryKey: ['cart'] });

      // For COD — go straight to orders
      if (paymentMethod === 'cod') {
        navigate('/orders');
        return;
      }

      // For bKash / SSLCommerz — initiate payment then redirect
      if (paymentMethod === 'bkash' || paymentMethod === 'sslcommerz') {
        try {
          const pay = await api.post('/payments/initiate', {
            orderId: order._id,
            provider: paymentMethod,
          });

          const redirectUrl = pay.data.data.redirectUrl;
          if (redirectUrl) {
            toast.success('Redirecting to payment gateway...');
            window.location.href = redirectUrl;
            return;
          }

          toast.error('Payment initiation failed — no redirect URL');
          navigate('/orders');
        } catch (e: any) {
          toast.error(e.response?.data?.message || 'Payment failed');
          navigate('/orders');
        }
      }
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed'),
  });

  const form = useForm({
    defaultValues: {
      name: '',
      phone: '',
      street: '',
      city: 'Dhaka',
      area: '',
      postalCode: '',
      email: '',
      notes: '',
    },
    onSubmit: async ({ value }) => {
      if (!paymentMethod) return toast.error('Choose payment method');
      placeOrder.mutate({
        paymentMethod,
        shippingAddress: {
          name: value.name,
          phone: value.phone,
          street: value.street,
          city: value.city,
          area: value.area,
          postalCode: value.postalCode,
          email: value.email || undefined,
        },
        notes: value.notes,
      });
    },
  });

  const [paymentMethod, setPaymentMethod] = useState('cod');

  if (!cart || cart.items.length === 0) {
    return <div className="container mx-auto py-20 text-center">Cart is empty</div>;
  }

  const shipping = cart.subtotal >= 1000 ? 0 : 60;
  const total = cart.subtotal - cart.discount + shipping;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ── Left: form ─────────────────────────── */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Shipping Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <form.Field name="name">
                  {(f) => (
                    <div>
                      <Label>Full Name</Label>
                      <Input
                        value={f.state.value}
                        onChange={(e) => f.handleChange(e.target.value)}
                        required
                      />
                    </div>
                  )}
                </form.Field>
                <form.Field name="phone">
                  {(f) => (
                    <div>
                      <Label>Phone</Label>
                      <Input
                        value={f.state.value}
                        onChange={(e) => f.handleChange(e.target.value)}
                        required
                      />
                    </div>
                  )}
                </form.Field>
              </div>

              <form.Field name="street">
                {(f) => (
                  <div>
                    <Label>Street Address</Label>
                    <Input
                      value={f.state.value}
                      onChange={(e) => f.handleChange(e.target.value)}
                      required
                    />
                  </div>
                )}
              </form.Field>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <form.Field name="city">
                  {(f) => (
                    <div>
                      <Label>City</Label>
                      <Input
                        value={f.state.value}
                        onChange={(e) => f.handleChange(e.target.value)}
                        required
                      />
                    </div>
                  )}
                </form.Field>
                <form.Field name="area">
                  {(f) => (
                    <div>
                      <Label>Area</Label>
                      <Input
                        value={f.state.value}
                        onChange={(e) => f.handleChange(e.target.value)}
                        required
                      />
                    </div>
                  )}
                </form.Field>
                <form.Field name="postalCode">
                  {(f) => (
                    <div>
                      <Label>Postal Code</Label>
                      <Input
                        value={f.state.value}
                        onChange={(e) => f.handleChange(e.target.value)}
                      />
                    </div>
                  )}
                </form.Field>
              </div>

              <form.Field name="email">
                {(f) => (
                  <div>
                    <Label>Email (optional)</Label>
                    <Input
                      type="email"
                      value={f.state.value}
                      onChange={(e) => f.handleChange(e.target.value)}
                    />
                  </div>
                )}
              </form.Field>

              <form.Field name="notes">
                {(f) => (
                  <div>
                    <Label>Delivery Notes (optional)</Label>
                    <Input
                      value={f.state.value}
                      onChange={(e) => f.handleChange(e.target.value)}
                    />
                  </div>
                )}
              </form.Field>

              <Separator className="my-6" />

              {/* ── Payment method ───────────────── */}
              <div>
                <h3 className="font-semibold mb-3">Payment Method</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {paymentItems.map((p) => {
                    const Icon = p.icon;
                    const selected = paymentMethod === p.value;
                    return (
                      <button
                        key={p.value}
                        type="button"
                        onClick={() => setPaymentMethod(p.value)}
                        className={`relative flex items-start gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                          selected
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/40'
                        }`}
                      >
                        <div
                          className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${
                            selected
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-sm">{p.label}</p>
                          {p.value === 'cod' && (
                            <p className="text-xs text-muted-foreground">
                              Pay on delivery
                            </p>
                          )}
                          {p.value === 'bkash' && (
                            <p className="text-xs text-muted-foreground">
                              Fast & secure
                            </p>
                          )}
                          {p.value === 'sslcommerz' && (
                            <p className="text-xs text-muted-foreground">
                              Visa / Mastercard
                            </p>
                          )}
                        </div>
                        {selected && (
                          <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {paymentMethod === 'bkash' && (
                  <div className="mt-3 p-3 rounded-lg bg-pink-50 dark:bg-pink-950/20 border border-pink-200 dark:border-pink-900/50">
                    <div className="flex items-center gap-2 text-sm">
                      <Wallet className="h-4 w-4 text-pink-600 dark:text-pink-400" />
                      <span className="font-medium">bKash Sandbox Test</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Wallet: 01770618575 · OTP: 123456 · PIN: 12121
                    </p>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full mt-6"
                disabled={placeOrder.isPending}
              >
                {placeOrder.isPending
                  ? 'Processing...'
                  : `Place Order — ৳${total}`}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* ── Right: summary ─────────────────────── */}
        <Card className="h-fit sticky top-24">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {cart.items.map((i: any) => (
              <div key={i._id} className="flex justify-between text-sm gap-2">
                <span className="line-clamp-1 flex-1">
                  {i.product?.name} × {i.quantity}
                </span>
                <span className="shrink-0 font-medium">
                  ৳{i.price * i.quantity}
                </span>
              </div>
            ))}

            <Separator />

            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>৳{cart.subtotal}</span>
            </div>

            {cart.discount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Discount</span>
                <span>-৳{cart.discount}</span>
              </div>
            )}

            <div className="flex justify-between text-sm">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'Free' : `৳${shipping}`}</span>
            </div>

            <Separator />

            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>৳{total}</span>
            </div>

            <div className="pt-2">
              <Badge variant="secondary" className="text-xs">
                Free delivery over ৳1,000
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}