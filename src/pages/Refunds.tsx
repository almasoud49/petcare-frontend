import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { RotateCcw } from 'lucide-react';

export function Refunds() {
  const qc = useQueryClient();
  const { data: refunds, isLoading } = useQuery({
    queryKey: ['refunds-mine'],
    queryFn: () => api.get('/refunds/mine').then((r) => r.data.data),
  });
  const { data: orders } = useQuery({
    queryKey: ['my-orders'],
    queryFn: () => api.get('/orders/mine').then((r) => r.data.data),
  });

  const [form, setForm] = useState({ orderId: '', reason: 'damaged', description: '' });

  const create = useMutation({
    mutationFn: (d: any) => api.post('/refunds', d),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['refunds-mine'] });
      toast.success('Refund request submitted');
      setForm({ orderId: '', reason: 'damaged', description: '' });
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed'),
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    create.mutate({ orderId: form.orderId, reason: form.reason, description: form.description, items: [] });
  };

  const deliveredOrders = (orders || []).filter((o: any) => o.status === 'delivered');

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="flex items-center gap-2 mb-6">
        <RotateCcw className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold">Refunds</h1>
      </div>

      <Card className="mb-8">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">Request a Refund</h2>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <Label>Order</Label>
              <Select value={form.orderId} onValueChange={(v) => v && setForm({ ...form, orderId: v })}>
                <SelectTrigger><SelectValue placeholder="Select delivered order" /></SelectTrigger>
                <SelectContent>
                  {deliveredOrders.map((o: any) => (
                    <SelectItem key={o._id} value={o._id}>{o.orderNumber}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Reason</Label>
              <Select value={form.reason} onValueChange={(v) => v && setForm({ ...form, reason: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="damaged">Damaged</SelectItem>
                  <SelectItem value="wrong_item">Wrong Item</SelectItem>
                  <SelectItem value="not_received">Not Received</SelectItem>
                  <SelectItem value="quality">Quality</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
            </div>
            <Button type="submit" disabled={create.isPending}>{create.isPending ? 'Submitting...' : 'Submit Request'}</Button>
          </form>
        </CardContent>
      </Card>

      <h2 className="text-xl font-semibold mb-3">My Refund Requests</h2>
      {isLoading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : (refunds?.length ?? 0) === 0 ? (
        <p className="text-muted-foreground">No refund requests</p>
      ) : (
        <div className="space-y-3">
          {refunds?.map((r: any) => (
            <Card key={r._id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Order: {r.order?.orderNumber}</p>
                    <p className="text-sm text-muted-foreground">{r.reason} · ৳{r.refundAmount}</p>
                  </div>
                  <span className="text-xs capitalize">{r.status}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}