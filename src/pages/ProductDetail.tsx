import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';
import { api } from '../lib/api';
import { ProductCard } from '../components/shared/ProductCard';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { Star, ShoppingCart, Truck, Shield, RefreshCw } from 'lucide-react';

export function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const qc = useQueryClient();
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [qty, setQty] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => api.get(`/products/${slug}`).then((r) => r.data.data),
    enabled: !!slug,
  });

  const addToCart = useMutation({
    mutationFn: () =>
      api.post('/cart/add', {
        productId: data.product._id,
        variantSku: selectedVariant || data.product.variants[0].sku,
        quantity: qty,
      }),
    onSuccess: () => {
      toast.success('Added to cart');
      qc.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed'),
  });

  if (isLoading) return <div className="container mx-auto py-20 text-center">Loading...</div>;
  if (!data?.product) return <div className="container mx-auto py-20 text-center">Not found</div>;

  const { product, related } = data;
  const activeVariant =
    product.variants.find((v: any) => v.sku === selectedVariant) || product.variants[0];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Images */}
        <div>
          <div className="aspect-square overflow-hidden rounded-xl mb-4">
            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {product.images.slice(0, 4).map((img: string, i: number) => (
              <div key={i} className="aspect-square overflow-hidden rounded-lg border">
                <img src={img} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <Badge variant="secondary" className="mb-2">{product.brand}</Badge>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <div className="flex items-center gap-2 mb-4">
            <Star size={16} className="fill-yellow-400 text-yellow-400" />
            <span>{product.rating}</span>
            <span className="text-muted-foreground">({product.reviewCount} reviews)</span>
          </div>
          <p className="text-muted-foreground mb-6">{product.shortDescription}</p>

          <div className="text-3xl font-bold mb-6">
            ৳{activeVariant.price}
            {activeVariant.comparePrice && (
              <span className="ml-2 text-base text-muted-foreground line-through">
                ৳{activeVariant.comparePrice}
              </span>
            )}
          </div>

          {/* Variant selector */}
          <div className="mb-6">
            <p className="text-sm font-medium mb-2">Options</p>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((v: any) => (
                <Button
                  key={v.sku}
                  variant={activeVariant.sku === v.sku ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedVariant(v.sku)}
                  disabled={v.stock === 0}
                >
                  {v.name} {v.stock === 0 && '(Out)'}
                </Button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-3 mb-6">
            <p className="text-sm font-medium">Quantity:</p>
            <div className="flex items-center border rounded-lg">
              <Button variant="ghost" size="sm" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</Button>
              <span className="px-4">{qty}</span>
              <Button variant="ghost" size="sm" onClick={() => setQty((q) => Math.min(activeVariant.stock, q + 1))}>+</Button>
            </div>
            <span className="text-sm text-muted-foreground">{activeVariant.stock} in stock</span>
          </div>

          <div className="flex gap-3 mb-6">
            <Button
              size="lg"
              className="flex-1"
              onClick={() => addToCart.mutate()}
              disabled={activeVariant.stock === 0 || addToCart.isPending}
            >
              <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
            </Button>
            <Button size="lg" variant="outline" nativeButton={false} render={<Link to="/cart">View Cart</Link>} />
          </div>

          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2"><Truck size={16} className="text-primary" /> Free over ৳1000</div>
            <div className="flex items-center gap-2"><Shield size={16} className="text-primary" /> Authentic</div>
            <div className="flex items-center gap-2"><RefreshCw size={16} className="text-primary" /> Easy returns</div>
          </div>
        </div>
      </div>

      <Separator className="my-8" />
      <h2 className="text-xl font-bold mb-4">Product Description</h2>
      <p className="text-muted-foreground leading-relaxed mb-12">{product.description}</p>

      {related?.length > 0 && (
        <>
          <h2 className="text-2xl font-bold mb-6">You Might Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((p: any) => <ProductCard key={p._id} product={p} />)}
          </div>
        </>
      )}
    </div>
  );
}