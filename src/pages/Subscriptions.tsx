import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { RefreshCw, Pause, Play, XCircle } from 'lucide-react';

export function Subscriptions() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['subscriptions'],
    queryFn: () => api.get('/subscriptions').then((r) => r.data.data),
  });

  // We'll use individual mutations instead
  const pauseM = useMutation({
    mutationFn: (id: string) => api.patch(`/subscriptions/${id}/pause`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['subscriptions'] }); toast.success('Paused'); },
  });
  const resumeM = useMutation({
    mutationFn: (id: string) => api.patch(`/subscriptions/${id}/resume`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['subscriptions'] }); toast.success('Resumed'); },
  });
  const cancelM = useMutation({
    mutationFn: (id: string) => api.patch(`/subscriptions/${id}/cancel`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['subscriptions'] }); toast.success('Cancelled'); },
  });

  const list = data?.data ?? data ?? [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <RefreshCw className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold">My Subscriptions</h1>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : list.length === 0 ? (
        <Card><CardContent className="text-center py-16">
          <p className="text-muted-foreground">No subscriptions yet</p>
        </CardContent></Card>
      ) : (
        <div className="space-y-4">
          {list.map((s: any) => (
            <Card key={s._id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium">{s.product?.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {s.frequency} · qty {s.quantity} · next delivery {new Date(s.nextDeliveryDate).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge className="capitalize">{s.status}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Price: ৳{s.price} {s.discount > 0 && <span className="text-green-600">(-৳{s.discount})</span>}</span>
                  <div className="flex gap-2">
                    {s.status === 'active' && (
                      <Button size="sm" variant="outline" onClick={() => pauseM.mutate(s._id)}>
                        <Pause className="h-4 w-4 mr-1" /> Pause
                      </Button>
                    )}
                    {s.status === 'paused' && (
                      <Button size="sm" variant="outline" onClick={() => resumeM.mutate(s._id)}>
                        <Play className="h-4 w-4 mr-1" /> Resume
                      </Button>
                    )}
                    {s.status !== 'cancelled' && (
                      <Button size="sm" variant="destructive" onClick={() => cancelM.mutate(s._id)}>
                        <XCircle className="h-4 w-4 mr-1" /> Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}