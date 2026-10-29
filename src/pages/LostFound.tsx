import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { toast } from 'sonner';
import { api } from '../lib/api';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '../components/ui/dialog';
import { AlertCircle, MapPin, Phone } from 'lucide-react';

export function LostFound() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [species] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['lost-found', { species }],
    queryFn: () =>
      api.get('/lost-found', { params: { species: species || undefined, status: 'lost' } })
        .then((r) => r.data.data),
  });

  const report = useMutation({
    mutationFn: (data: any) => api.post('/lost-found', data),
    onSuccess: () => {
      toast.success('Report submitted');
      qc.invalidateQueries({ queryKey: ['lost-found'] });
      setOpen(false);
      form.reset();
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed'),
  });

  const form = useForm({
    defaultValues: {
      petName: '', species: 'dog', breed: '', description: '', address: '',
      contactName: '', contactPhone: '', reward: 0,
    },
    onSubmit: ({ value }) => {
      report.mutate({
        petName: value.petName,
        species: value.species,
        breed: value.breed,
        description: value.description,
        lastSeenLocation: { address: value.address },
        lastSeenDate: new Date().toISOString(),
        contact: { name: value.contactName, phone: value.contactPhone },
        reward: value.reward ? Number(value.reward) : undefined,
        images: [],
      });
    },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <AlertCircle className="text-red-500" /> Lost & Found Pets
          </h1>
          <p className="text-muted-foreground">Help reunite pets with their families</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={<Button variant="destructive" />}>Report Lost Pet</DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Report Lost Pet</DialogTitle></DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }} className="space-y-3">
              <form.Field name="petName">
                {(f) => <div><Label>Pet Name</Label><Input value={f.state.value} onChange={(e) => f.handleChange(e.target.value)} required /></div>}
              </form.Field>
              <form.Field name="species">
                {(f) => (
                  <div>
                    <Label>Species</Label>
                    <select className="w-full border rounded px-3 py-2 bg-background" value={f.state.value} onChange={(e) => f.handleChange(e.target.value)}>
                      {['dog', 'cat', 'bird', 'rabbit', 'other'].map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                )}
              </form.Field>
              <form.Field name="breed">
                {(f) => <div><Label>Breed</Label><Input value={f.state.value} onChange={(e) => f.handleChange(e.target.value)} /></div>}
              </form.Field>
              <form.Field name="description">
                {(f) => <div><Label>Description</Label><Textarea value={f.state.value} onChange={(e) => f.handleChange(e.target.value)} required /></div>}
              </form.Field>
              <form.Field name="address">
                {(f) => <div><Label>Last Seen Location</Label><Input value={f.state.value} onChange={(e) => f.handleChange(e.target.value)} required /></div>}
              </form.Field>
              <div className="grid grid-cols-2 gap-3">
                <form.Field name="contactName">
                  {(f) => <div><Label>Your Name</Label><Input value={f.state.value} onChange={(e) => f.handleChange(e.target.value)} required /></div>}
                </form.Field>
                <form.Field name="contactPhone">
                  {(f) => <div><Label>Phone</Label><Input value={f.state.value} onChange={(e) => f.handleChange(e.target.value)} required /></div>}
                </form.Field>
              </div>
              <Button type="submit" className="w-full" disabled={report.isPending}>Submit Report</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? <div className="text-center py-20">Loading...</div> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.map((post: any) => (
            <Card key={post._id} className="border-red-200">
              <CardContent className="p-4">
                <Badge variant="destructive" className="mb-2 capitalize">{post.status}</Badge>
                <h3 className="font-bold text-lg">{post.petName}</h3>
                <p className="text-sm text-muted-foreground capitalize">{post.species} • {post.breed}</p>
                <p className="text-sm mt-2 line-clamp-3">{post.description}</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-3">
                  <MapPin size={12} /> {post.lastSeenLocation?.address}
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Phone size={12} /> {post.contact?.phone}
                </div>
                {post.reward > 0 && <Badge className="mt-2">Reward: ৳{post.reward}</Badge>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}