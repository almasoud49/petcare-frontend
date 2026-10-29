import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Phone, Mail, PawPrint } from 'lucide-react';

export function PetTagScan() {
  const { code } = useParams();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['pet-tag-scan', code],
    queryFn: () => api.get(`/pet-tags/scan/${code}`).then((r) => r.data.data),
  });

  if (isLoading) return <div className="container mx-auto py-20 text-center">Loading...</div>;
  if (isError || !data) return <div className="container mx-auto py-20 text-center">Tag not found</div>;

  const pet = data.pet;
  const owner = data.owner;

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <Card>
        <CardContent className="p-6 text-center">
          <PawPrint className="mx-auto h-10 w-10 text-primary mb-3" />
          <h1 className="text-2xl font-bold mb-1">{pet?.name}</h1>
          <p className="text-muted-foreground mb-4">{pet?.species} · {pet?.breed}</p>
          {pet?.image && <img src={pet.image} alt={pet.name} className="w-40 h-40 mx-auto rounded-full object-cover mb-4" />}
          <div className="border-t pt-4 space-y-2 text-left">
            <p className="font-semibold">Owner Contact</p>
            <p>{owner?.name}</p>
            {owner?.phone && <p className="flex items-center gap-2"><Phone className="h-4 w-4" /> {owner.phone}</p>}
            {owner?.email && <p className="flex items-center gap-2"><Mail className="h-4 w-4" /> {owner.email}</p>}
          </div>
          <p className="text-xs text-muted-foreground mt-4">This pet may be lost. Please contact the owner.</p>
        </CardContent>
      </Card>
    </div>
  );
}