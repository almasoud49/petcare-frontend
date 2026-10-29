import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { api } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin } from 'lucide-react';

export function Areas() {
  const { data, isLoading } = useQuery({
    queryKey: ['areas'],
    queryFn: () => api.get('/areas').then((r) => r.data.data),
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Service Areas</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Find pet services and delivery in your area.
        </p>
      </div>

      {isLoading ? (
        <p className="text-center py-20 text-muted-foreground">Loading...</p>
      ) : (data?.length ?? 0) === 0 ? (
        <p className="text-center py-20 text-muted-foreground">No areas available</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.map((a: any) => (
            <Link to={`/areas/${a.slug}`} key={a._id}>
              <Card className="hover:shadow-lg transition">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">{a.name}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{a.city}</p>
                  <p className="text-sm text-muted-foreground line-clamp-2">{a.description}</p>
                  <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
                    <span>Delivery fee: ৳{a.deliveryFee}</span>
                    <Badge variant="outline">★ {a.avgRating}</Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function AreaDetail() {
  const { slug } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: ['area', slug],
    queryFn: () => api.get(`/areas/${slug}`).then((r) => r.data.data),
  });

  if (isLoading) return <div className="container mx-auto py-20 text-center">Loading...</div>;
  if (!data) return <div className="container mx-auto py-20 text-center">Not found</div>;

  const { area, services, products } = data;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-1">{area.name}</h1>
        <p className="text-muted-foreground">{area.city} · Delivery fee ৳{area.deliveryFee}</p>
        <p className="mt-2">{area.description}</p>
      </div>

      <h2 className="text-xl font-semibold mb-3">Services</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {services?.map((s: any) => (
          <Card key={s._id}>
            <CardContent className="p-4">
              <p className="font-medium">{s.name}</p>
              <p className="text-sm text-muted-foreground">৳{s.price}</p>
            </CardContent>
          </Card>
        ))}
        {services?.length === 0 && <p className="text-muted-foreground">No services</p>}
      </div>

      <h2 className="text-xl font-semibold mb-3">Popular Products</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {products?.map((p: any) => (
          <Card key={p._id}>
            <CardContent className="p-3">
              <img src={p.images?.[0]} alt={p.name} className="w-full h-24 object-cover rounded mb-2" />
              <p className="text-sm font-medium line-clamp-1">{p.name}</p>
              <p className="text-sm text-primary">৳{p.basePrice}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}