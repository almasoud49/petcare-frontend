import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { api } from '../lib/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { Trash2, Tag } from 'lucide-react';
import { buttonVariants } from '../components/ui/button';

export function Cart() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [coupon, setCoupon] = useState('');

  const { data: cart, isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: () => api.get('/cart').then((r) => r.data.data),
  });

  const updateItem = useMutation({
    mutationFn: ({ id, qty }: { id: string; qty: number }) =>
      api.patch(`/cart/items/${id}`, { quantity: qty }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['cart'] }),
  });

  const removeItem = useMutation({
    mutationFn: (id: string) => api.delete(`/cart/items/${id}`),
    onSuccess: () => {
      toast.success('Removed');
      qc.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  const applyCoupon = useMutation({
    mutationFn: () => api.post('/cart/apply-coupon', { code: coupon.toUpperCase() }),
    onSuccess: () => {
      toast.success('Coupon applied');
      qc.invalidateQueries({ queryKey: ['cart'] });
      setCoupon('');
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Invalid coupon'),
  });

  if (isLoading) return <div className="container mx-auto py-20 text-center">Loading cart...</div>;
  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <Link to="/products" className={buttonVariants()}>Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item: any) => (
            <Card key={item._id}>
              <CardContent className="p-4 flex gap-4">
                <img
                  src={item.product?.images?.[0]}
                  alt={item.product?.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{item.product?.name}</h3>
                  <p className="text-sm text-muted-foreground">Variant: {item.variantSku}</p>
                  <p className="text-lg font-bold mt-2">৳{item.price}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Button variant="ghost" size="icon" onClick={() => removeItem.mutate(item._id)}>
                    <Trash2 size={16} />
                  </Button>
                  <div className="flex items-center border rounded">
                    <Button
                      variant="ghost" size="sm"
                      onClick={() => updateItem.mutate({ id: item._id, qty: item.quantity - 1 })}
                    >−</Button>
                    <span className="px-3">{item.quantity}</span>
                    <Button
                      variant="ghost" size="sm"
                      onClick={() => updateItem.mutate({ id: item._id, qty: item.quantity + 1 })}
                    >+</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Summary */}
        <Card className="h-fit sticky top-24">
          <CardHeader><CardTitle>Order Summary</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span>Subtotal</span><span>৳{cart.subtotal}</span>
            </div>
            {cart.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span><span>-৳{cart.discount}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping</span><span>{cart.subtotal >= 1000 ? 'Free' : '৳60'}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>৳{cart.total + (cart.subtotal >= 1000 ? 0 : 60)}</span>
            </div>

            {/* Coupon */}
            <div className="flex gap-2 pt-2">
              <Input
                placeholder="Coupon code"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
              />
              <Button onClick={() => applyCoupon.mutate()} disabled={!coupon || applyCoupon.isPending}>
                <Tag size={14} />
              </Button>
            </div>

            <Button
              size="lg"
              className="w-full"
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}