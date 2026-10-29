import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { api } from '../lib/api';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Heart, Trash2, ShoppingCart } from 'lucide-react';
import { buttonVariants } from '../components/ui/button';

export function Wishlist() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['wishlist'],
    queryFn: () => api.get('/wishlist').then((r) => r.data.data),
  });

  const remove = useMutation({
    mutationFn: (productId: string) => api.delete(`/wishlist/${productId}`),
    onSuccess: () => {
      toast.success('Removed from wishlist');
      qc.invalidateQueries({ queryKey: ['wishlist'] });
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed'),
  });

  if (isLoading) return <div className="container mx-auto py-20 text-center">Loading wishlist...</div>;

  const items = data || [];

  if (items.length === 0) {
    return (
      <div className="container mx-auto py-20 text-center">
        <Heart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-4">Your wishlist is empty</h1>
        <Link to="/products" className={buttonVariants()}>Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((item: any) => {
          const p = item.product;
          if (!p) return null;
          return (
            <Card key={item._id || p._id} className="overflow-hidden">
              <Link to={`/products/${p.slug}`}>
                <img src={p.images?.[0]} alt={p.name} className="w-full aspect-square object-cover" />
              </Link>
              <CardContent className="p-4">
                <h3 className="font-semibold line-clamp-1">{p.name}</h3>
                <p className="text-lg font-bold mt-1">৳{p.basePrice}</p>
                <div className="flex gap-2 mt-3">
                  <Link to={`/products/${p.slug}`} className={buttonVariants({ size: 'sm' }) + ' flex-1'}>
                    <ShoppingCart size={14} className="mr-1" /> View
                  </Link>
                  <Button variant="outline" size="sm" onClick={() => remove.mutate(p._id)}>
                    <Trash2 size={14} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
