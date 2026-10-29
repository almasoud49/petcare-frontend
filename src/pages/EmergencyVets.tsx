import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { api } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, MapPin, Phone, Search } from 'lucide-react';

export function EmergencyVets() {
  const [area, setArea] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['emergency-vets', area],
    queryFn: () =>
      api.get('/emergency-vets', {
        params: { area: area || undefined, is24_7: 'true' },
      }).then((r) => r.data.data),
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-red-100 text-red-800 px-4 py-2 rounded-full mb-4">
          <AlertTriangle className="h-5 w-5" />
          <span className="font-semibold">24/7 Emergency Care</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          Emergency Vets Near You
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          When every minute matters, these clinics are ready 24/7. Call immediately for
          life-threatening conditions.
        </p>
      </div>

      <div className="max-w-md mx-auto mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Filter by area (e.g., Gulshan, Dhanmondi)"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {isLoading ? (
        <p className="text-center py-20 text-muted-foreground">Loading...</p>
      ) : data?.length === 0 ? (
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center py-12">
            <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <p className="font-semibold mb-2">No emergency vets found</p>
            <p className="text-sm text-muted-foreground">
              Try a different area or call the national emergency line.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.map((vet: any) => (
            <Card key={vet._id} className="border-red-200">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-lg flex-1">{vet.name}</h3>
                  {vet.is24_7 && (
                    <Badge variant="destructive" className="shrink-0">
                      24/7
                    </Badge>
                  )}
                </div>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin size={14} /> {vet.area}, {vet.city}
                  </div>
                  {vet.address && (
                    <p className="text-xs pl-6">{vet.address}</p>
                  )}
                </div>
                <a
                  href={`tel:${vet.phone.replace(/[^+\d]/g, '')}`}
                  className="block mt-4"
                >
                  <Button variant="destructive" className="w-full gap-2">
                    <Phone size={16} /> {vet.phone}
                  </Button>
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}