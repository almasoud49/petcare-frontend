import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Smartphone,
  RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';

const statusIcon: Record<string, any> = {
  pending: Package,
  confirmed: Package,
  processing: Package,
  shipped: Truck,
  delivered: CheckCircle,
  cancelled: XCircle,
};

const statusColor: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-400',
  confirmed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-400',
  processing: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-400',
  shipped: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-400',
  delivered: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-400',
};

export function MyOrders() {
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['my-orders'],
    queryFn: () => api.get('/orders/mine').then((r) => r.data.data),
  });

  const retryPayment = useMutation({
    mutationFn: async (order: any) => {
      const pay = await api.post('/payments/initiate', {
        orderId: order._id,
        provider: 'bkash',
      });
      return pay.data.data.redirectUrl;
    },
    onSuccess: (redirectUrl) => {
      if (redirectUrl) {
        toast.success('Redirecting to bKash...');
        window.location.href = redirectUrl;
      } else {
        toast.error('Could not initiate payment');
      }
    },
    onError: (e: any) =>
      toast.error(e.response?.data?.message || 'Payment retry failed'),
  });

  if (isLoading) {
    return <div className="container mx-auto py-20 text-center">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      {data?.length === 0 ? (
        <Card>
          <CardContent className="text-center py-16">
            <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No orders yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {data?.map((order: any) => {
            const Icon = statusIcon[order.status] || Package;
            const canRetry =
              order.paymentStatus === 'failed' ||
              (order.paymentStatus === 'pending' &&
                order.paymentMethod === 'bkash' &&
                order.status === 'pending');

            return (
              <Card key={order._id}>
                <CardHeader>
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <CardTitle className="text-base">
                        {order.orderNumber}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString()} ·{' '}
                        {order.items?.length} item
                        {order.items?.length > 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`capitalize ${statusColor[order.status] || ''}`}>
                        <Icon size={12} className="mr-1" />
                        {order.status}
                      </Badge>
                      {order.paymentMethod === 'bkash' && (
                        <Badge variant="outline" className="gap-1">
                          <Smartphone size={10} />
                          bKash
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    {order.items.map((item: any, i: number) => (
                      <div key={i} className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 rounded object-cover"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{item.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.variantName} × {item.quantity}
                          </p>
                        </div>
                        <span className="text-sm font-medium">
                          ৳{item.price * item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Separator className="my-3" />

                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Total</p>
                      <p className="font-bold text-lg">৳{order.total}</p>
                    </div>

                    <div className="flex gap-2">
                      {canRetry && (
                        <Button
                          variant="default"
                          size="sm"
                          className="gap-1"
                          onClick={() => retryPayment.mutate(order)}
                          disabled={retryPayment.isPending}
                        >
                          <RefreshCw size={14} />
                          {retryPayment.isPending ? 'Retrying...' : 'Retry Payment'}
                        </Button>
                      )}
                    </div>
                  </div>

                  {order.trackingNumber && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Tracking:{' '}
                      <span className="font-mono">{order.trackingNumber}</span>
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}