import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Heart } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { Card, CardContent, CardFooter } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { api } from '../../lib/api';

interface Product {
  _id: string;
  name: string;
  slug: string;
  brand: string;
  basePrice: number;
  comparePrice?: number;
  images: string[];
  rating: number;
  reviewCount: number;
  variants: { sku: string; stock: number }[];
}

export function ProductCard({ product }: { product: Product }) {
  const qc = useQueryClient();
  const firstVariant = product.variants?.[0];

  const addToCart = useMutation({
    mutationFn: () =>
      api.post('/cart/add', {
        productId: product._id,
        variantSku: firstVariant?.sku,
        quantity: 1,
      }),
    onSuccess: () => {
      toast.success('Added to cart');
      qc.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed to add'),
  });

  const addToWishlist = useMutation({
    mutationFn: () => api.post(`/wishlist/${product._id}`),
    onSuccess: () => toast.success('Added to wishlist'),
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed'),
  });

  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.basePrice) / product.comparePrice) * 100)
    : 0;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition flex flex-col h-full group">
      <div className="relative aspect-square overflow-hidden">
        <Link to={`/products/${product.slug}`}>
          <img
            src={product.images?.[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition"
          />
        </Link>
        {discount > 0 && (
          <Badge className="absolute top-2 left-2" variant="destructive">-{discount}%</Badge>
        )}
        <Button
          size="icon"
          variant="secondary"
          className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition"
          onClick={() => addToWishlist.mutate()}
        >
          <Heart size={14} />
        </Button>
      </div>
      <CardContent className="p-4 flex-1">
        <p className="text-xs text-muted-foreground mb-1">{product.brand}</p>
        <Link to={`/products/${product.slug}`}>
          <h3 className="font-semibold line-clamp-2 hover:text-primary">{product.name}</h3>
        </Link>
        <div className="flex items-center gap-2 mt-2">
          <Star size={14} className="fill-yellow-400 text-yellow-400" />
          <span className="text-xs">{product.rating || 'New'}</span>
          <span className="text-xs text-muted-foreground">({product.reviewCount || 0})</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div>
          <div className="font-bold">৳{product.basePrice}</div>
          {product.comparePrice && (
            <div className="text-xs text-muted-foreground line-through">৳{product.comparePrice}</div>
          )}
        </div>
        <Button size="icon" onClick={() => addToCart.mutate()} disabled={addToCart.isPending}>
          <ShoppingCart size={16} />
        </Button>
      </CardFooter>
    </Card>
  );
}