import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { toast } from 'sonner';
import { api } from '../lib/api';
import { Card, CardContent, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '../components/ui/dialog';
import { Heart, MapPin, Plus } from 'lucide-react';

export function Adoptions() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['adoptions'],
    queryFn: () => api.get('/adoptions').then((r) => r.data.data),
  });

  const createAdoption = useMutation({
    mutationFn: (d: any) => api.post('/adoptions', d),
    onSuccess: () => {
      toast.success('Posted!');
      qc.invalidateQueries({ queryKey: ['adoptions'] });
      setOpen(false);
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed'),
  });

  const applyAdoption = useMutation({
    mutationFn: (id: string) => api.post(`/adoptions/${id}/apply`),
    onSuccess: () => {
      toast.success('Application submitted!');
      qc.invalidateQueries({ queryKey: ['adoptions'] });
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed'),
  });

  const form = useForm({
    defaultValues: {
      petName: '', species: 'dog', breed: '', description: '', location: '',
      vaccinated: false, neutered: false, contactName: '', contactPhone: '',
    },
    onSubmit: ({ value }) => {
      createAdoption.mutate({
        petName: value.petName,
        species: value.species,
        breed: value.breed,
        description: value.description,
        location: value.location,
        vaccinated: value.vaccinated,
        neutered: value.neutered,
        contact: { name: value.contactName, phone: value.contactPhone },
        images: [],
      });
    },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Heart className="text-primary" /> Adopt a Pet
          </h1>
          <p className="text-muted-foreground">Give a loving home to a pet in need</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={<Button><Plus className="mr-2 h-4 w-4" /></Button>}>Post Adoption</DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Post Pet for Adoption</DialogTitle></DialogHeader>
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
              <form.Field name="description">
                {(f) => <div><Label>Description</Label><Textarea value={f.state.value} onChange={(e) => f.handleChange(e.target.value)} required /></div>}
              </form.Field>
              <form.Field name="location">
                {(f) => <div><Label>Location</Label><Input value={f.state.value} onChange={(e) => f.handleChange(e.target.value)} required /></div>}
              </form.Field>
              <div className="grid grid-cols-2 gap-3">
                <form.Field name="contactName">
                  {(f) => <div><Label>Name</Label><Input value={f.state.value} onChange={(e) => f.handleChange(e.target.value)} required /></div>}
                </form.Field>
                <form.Field name="contactPhone">
                  {(f) => <div><Label>Phone</Label><Input value={f.state.value} onChange={(e) => f.handleChange(e.target.value)} required /></div>}
                </form.Field>
              </div>
              <div className="flex gap-4">
                <form.Field name="vaccinated">
                  {(f) => (
                    <label className="flex items-center gap-2">
                      <input type="checkbox" checked={f.state.value} onChange={(e) => f.handleChange(e.target.checked)} /> Vaccinated
                    </label>
                  )}
                </form.Field>
                <form.Field name="neutered">
                  {(f) => (
                    <label className="flex items-center gap-2">
                      <input type="checkbox" checked={f.state.value} onChange={(e) => f.handleChange(e.target.checked)} /> Neutered
                    </label>
                  )}
                </form.Field>
              </div>
              <Button type="submit" className="w-full" disabled={createAdoption.isPending}>Post</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? <div className="text-center py-20">Loading...</div> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.map((post: any) => (
            <Card key={post._id} className="flex flex-col">
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={post.images?.[0] || 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800'}
                  alt={post.petName}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-4 flex-1">
                <h3 className="font-bold text-lg">{post.petName}</h3>
                <p className="text-sm text-muted-foreground capitalize">{post.species} {post.breed && `• ${post.breed}`}</p>
                <p className="text-sm mt-2 line-clamp-2">{post.description}</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                  <MapPin size={12} /> {post.location}
                </div>
                <div className="flex gap-2 mt-2">
                  {post.vaccinated && <Badge variant="secondary" className="text-xs">Vaccinated</Badge>}
                  {post.neutered && <Badge variant="secondary" className="text-xs">Neutered</Badge>}
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button className="w-full" onClick={() => applyAdoption.mutate(post._id)} disabled={applyAdoption.isPending}>
                  <Heart className="mr-2 h-4 w-4" /> Apply to Adopt
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}