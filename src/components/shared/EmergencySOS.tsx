import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, Phone, MapPin } from 'lucide-react';

export function EmergencySOS() {
  const [open, setOpen] = useState(false);

  const { data: vets, isLoading } = useQuery({
    queryKey: ['emergency-vets'],
    queryFn: () => api.get('/emergency-vets').then((r) => r.data.data),
    enabled: open,
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button
          variant="destructive"
          size="lg"
          className="fixed bottom-6 right-24 z-40 shadow-lg gap-2 animate-pulse hover:animate-none"
        >
          <AlertTriangle className="h-5 w-5" />
          Emergency
        </Button>} />
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-6 w-6" />
            24/7 Emergency Vet Contacts
          </DialogTitle>
          <DialogDescription>
            If your pet is in a life-threatening situation, call the nearest emergency vet immediately.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <p className="text-center py-8 text-muted-foreground">Loading emergency contacts...</p>
        ) : vets?.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground">No emergency vets found. Call 911.</p>
        ) : (
          <div className="space-y-3">
            {vets?.map((vet: any) => (
              <Card key={vet._id} className="border-red-200">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-base">{vet.name}</h3>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                        <MapPin size={14} /> {vet.area}, {vet.city}
                      </div>
                      {vet.address && (
                        <p className="text-xs text-muted-foreground mt-1">{vet.address}</p>
                      )}
                      {vet.is24_7 && (
                        <span className="inline-block mt-2 text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded">
                          24/7 Available
                        </span>
                      )}
                    </div>
                    <a href={`tel:${vet.phone.replace(/[^+\d]/g, '')}`}>
                      <Button variant="destructive" size="sm" className="gap-1">
                        <Phone size={14} /> Call
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}