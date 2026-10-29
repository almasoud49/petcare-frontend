import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { api } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package } from 'lucide-react';

export function Bundles() {
  const { data, isLoading } = useQuery({
    queryKey: ['bundles'],
    queryFn: () => api.get('/bundles').then((r) => r.data.data),
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Bundle Deals</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Save more when you buy together. Curated bundles for every pet.
        </p>
      </div>

      {isLoading ? (
        <p className="text-center py-20 text-muted-foreground">Loading...</p>
      ) : (data?.length ?? 0) === 0 ? (
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="font-semibold mb-2">No bundles available</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.map((b: any) => (
            <Card key={b._id} className="overflow-hidden hover:shadow-lg transition">
              <img
                src={b.image || 'https://placehold.co/400x240?text=Bundle'}
                alt={b.name}
                className="w-full h-48 object-cover"
              />
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-lg">{b.name}</h3>
                  {b.discountPercent > 0 && (
                    <Badge className="bg-red-500">-{b.discountPercent}%</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {b.description}
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xl font-bold text-primary">৳{b.bundlePrice}</span>
                    {b.comparePrice > b.bundlePrice && (
                      <span className="text-sm text-muted-foreground line-through ml-2">
                        ৳{b.comparePrice}
                      </span>
                    )}
                  </div>
                  <Button size="sm" nativeButton={false} render={<Link to={`/bundles/${b.slug}`}>View</Link>} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export function BundleDetail() {
  const { slug } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: ['bundle', slug],
    queryFn: () => api.get(`/bundles/${slug}`).then((r) => r.data.data),
  });

  if (isLoading) return <div className="container mx-auto py-20 text-center">Loading...</div>;
  if (!data) return <div className="container mx-auto py-20 text-center">Not found</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <img src={data.image} alt={data.name} className="w-full h-72 object-cover rounded-lg mb-6" />
      <h1 className="text-3xl font-bold mb-2">{data.name}</h1>
      <p className="text-muted-foreground mb-4">{data.description}</p>
      <div className="flex items-center gap-4 mb-6">
        <span className="text-2xl font-bold text-primary">৳{data.bundlePrice}</span>
        {data.comparePrice > data.bundlePrice && (
          <span className="text-lg text-muted-foreground line-through">৳{data.comparePrice}</span>
        )}
        {data.discountPercent > 0 && <Badge className="bg-red-500">-{data.discountPercent}%</Badge>}
      </div>
      <h2 className="text-xl font-semibold mb-3">Included Products</h2>
      <div className="space-y-3">
        {data.products?.map((p: any, i: number) => (
          <Card key={i}>
            <CardContent className="flex items-center gap-3 p-3">
              <img
                src={p.product?.images?.[0]}
                alt={p.product?.name}
                className="w-12 h-12 rounded object-cover"
              />
              <div className="flex-1">
                <p className="font-medium">{p.product?.name}</p>
                <p className="text-xs text-muted-foreground">SKU: {p.variantSku} × {p.quantity}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}