import { useQuery, useMutation } from '@tanstack/react-query';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useForm } from '@tanstack/react-form';
import { toast } from 'sonner';
import { api } from '../lib/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
export function BookService() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const serviceId = params.get('service') || '';

  const { data: pets } = useQuery({
    queryKey: ['my-pets'],
    queryFn: () => api.get('/pets').then((r) => r.data.data),
  });

  const { data: service } = useQuery({
    queryKey: ['service', serviceId],
    queryFn: () => api.get(`/services/${serviceId}`).then((r) => r.data.data.service),
    enabled: !!serviceId,
  });

  const book = useMutation({
    mutationFn: (data: any) => api.post('/bookings', data),
    onSuccess: () => {
      toast.success('Booking confirmed!');
      navigate('/bookings');
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed'),
  });

  const form = useForm({
    defaultValues: { pet: '', date: '', timeSlot: '09:00', notes: '' },
    onSubmit: ({ value }) => {
      book.mutate({
        service: serviceId,
        pet: value.pet,
        date: new Date(value.date).toISOString(),
        timeSlot: value.timeSlot,
        notes: value.notes,
      });
    },
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-lg">
      <Card>
        <CardHeader><CardTitle>Book {service?.title}</CardTitle></CardHeader>
        <CardContent>
          {pets?.length === 0 ? (
            <p className="text-muted-foreground">
              You need to add a pet first.
              <a href="/pets" className="text-primary ml-1">Add Pet</a>
            </p>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }} className="space-y-4">
              <form.Field name="pet">
                {(f) => (
                  <div>
                    <Label>Select Pet</Label>
                    <select
                      className="w-full border rounded px-3 py-2 bg-background"
                      value={f.state.value}
                      onChange={(e) => f.handleChange(e.target.value)}
                      required
                    >
                      <option value="">Choose pet...</option>
                      {pets?.map((p: any) => (
                        <option key={p._id} value={p._id}>{p.name} ({p.species})</option>
                      ))}
                    </select>
                  </div>
                )}
              </form.Field>
              <form.Field name="date">
                {(f) => (
                  <div>
                    <Label>Date</Label>
                    <Input type="date" value={f.state.value} onChange={(e) => f.handleChange(e.target.value)} required min={new Date().toISOString().split('T')[0]} />
                  </div>
                )}
              </form.Field>
              <form.Field name="timeSlot">
                {(f) => (
                  <div>
                    <Label>Time Slot</Label>
                    <select className="w-full border rounded px-3 py-2 bg-background" value={f.state.value} onChange={(e) => f.handleChange(e.target.value)}>
                      {['09:00', '10:30', '12:00', '14:00', '15:30', '17:00'].map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                )}
              </form.Field>
              <form.Field name="notes">
                {(f) => (
                  <div>
                    <Label>Notes (optional)</Label>
                    <Input value={f.state.value} onChange={(e) => f.handleChange(e.target.value)} />
                  </div>
                )}
              </form.Field>
              <Button type="submit" className="w-full" disabled={book.isPending}>
                {book.isPending ? 'Booking...' : 'Confirm Booking'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}