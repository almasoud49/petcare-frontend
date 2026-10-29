import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { toast } from 'sonner';
import { api } from '../lib/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '../components/ui/dialog';
import { Plus, Trash2, Edit } from 'lucide-react';

export function MyPets() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  const { data: pets, isLoading } = useQuery({
    queryKey: ['my-pets'],
    queryFn: () => api.get('/pets').then((r) => r.data.data),
  });

  const { data: tags } = useQuery({
    queryKey: ['my-pet-tags'],
    queryFn: () => api.get('/pet-tags').then((r) => r.data.data),
  });

  const createTag = useMutation({
    mutationFn: (petId: string) => api.post(`/pet-tags/pet/${petId}`),
    onSuccess: () => {
      toast.success('Tag created');
      qc.invalidateQueries({ queryKey: ['my-pet-tags'] });
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed'),
  });

  const deactivateTag = useMutation({
    mutationFn: (id: string) => api.patch(`/pet-tags/${id}/deactivate`),
    onSuccess: () => {
      toast.success('Tag deactivated');
      qc.invalidateQueries({ queryKey: ['my-pet-tags'] });
    },
  });

  const createPet = useMutation({
    mutationFn: (data: any) => api.post('/pets', data),
    onSuccess: () => {
      toast.success('Pet added');
      qc.invalidateQueries({ queryKey: ['my-pets'] });
      setOpen(false);
      form.reset();
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed'),
  });

  const updatePet = useMutation({
    mutationFn: ({ id, data }: any) => api.patch(`/pets/${id}`, data),
    onSuccess: () => {
      toast.success('Pet updated');
      qc.invalidateQueries({ queryKey: ['my-pets'] });
      setOpen(false);
      setEditing(null);
    },
  });

  const deletePet = useMutation({
    mutationFn: (id: string) => api.delete(`/pets/${id}`),
    onSuccess: () => {
      toast.success('Pet removed');
      qc.invalidateQueries({ queryKey: ['my-pets'] });
    },
  });

  const form = useForm({
    defaultValues: {
      name: '', species: 'dog', breed: '', age: 1, weight: 5, gender: 'male', image: '', notes: '',
    },
    onSubmit: ({ value }) => {
      const payload = { ...value, age: Number(value.age), weight: Number(value.weight) };
      if (editing) updatePet.mutate({ id: editing._id, data: payload });
      else createPet.mutate(payload);
    },
  });

  const handleEdit = (pet: any) => {
    setEditing(pet);
    form.setFieldValue('name', pet.name);
    form.setFieldValue('species', pet.species);
    form.setFieldValue('breed', pet.breed || '');
    form.setFieldValue('age', pet.age);
    form.setFieldValue('weight', pet.weight);
    form.setFieldValue('gender', pet.gender);
    form.setFieldValue('image', pet.image || '');
    form.setFieldValue('notes', pet.notes || '');
    setOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Pets</h1>
          <p className="text-muted-foreground">Manage your furry friends</p>
        </div>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setEditing(null); form.reset(); } }}>
          <DialogTrigger render={<Button><Plus className="mr-2 h-4 w-4" /></Button>}>Add Pet</DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editing ? 'Edit Pet' : 'Add New Pet'}</DialogTitle></DialogHeader>
            <form
              onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }}
              className="space-y-3"
            >
              <form.Field name="name">
                {(f) => (
                  <div><Label>Name</Label><Input value={f.state.value} onChange={(e) => f.handleChange(e.target.value)} required /></div>
                )}
              </form.Field>
              <form.Field name="species">
                {(f) => (
                  <div>
                    <Label>Species</Label>
                    <select
                      className="w-full border rounded px-3 py-2 bg-background"
                      value={f.state.value}
                      onChange={(e) => f.handleChange(e.target.value)}
                    >
                      {['dog', 'cat', 'bird', 'rabbit', 'other'].map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                )}
              </form.Field>
              <form.Field name="breed">
                {(f) => (
                  <div><Label>Breed</Label><Input value={f.state.value} onChange={(e) => f.handleChange(e.target.value)} /></div>
                )}
              </form.Field>
              <div className="grid grid-cols-2 gap-3">
                <form.Field name="age">
                  {(f) => (
                    <div><Label>Age (yrs)</Label><Input type="number" value={f.state.value} onChange={(e) => f.handleChange(Number(e.target.value))} /></div>
                  )}
                </form.Field>
                <form.Field name="weight">
                  {(f) => (
                    <div><Label>Weight (kg)</Label><Input type="number" value={f.state.value} onChange={(e) => f.handleChange(Number(e.target.value))} /></div>
                  )}
                </form.Field>
              </div>
              <Button type="submit" className="w-full" disabled={createPet.isPending || updatePet.isPending}>
                {editing ? 'Update' : 'Add Pet'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="text-center py-20">Loading...</div>
      ) : pets?.length === 0 ? (
        <Card><CardContent className="text-center py-16">
          <p className="text-muted-foreground mb-4">No pets yet</p>
          <Button onClick={() => setOpen(true)}>Add Your First Pet</Button>
        </CardContent></Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pets?.map((pet: any) => (
            <Card key={pet._id}>
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <img
                    src={pet.image || 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=200'}
                    alt={pet.name}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{pet.name}</h3>
                    <Badge variant="secondary" className="capitalize mb-1">{pet.species}</Badge>
                    <p className="text-sm text-muted-foreground">{pet.breed}</p>
                    <p className="text-xs text-muted-foreground">{pet.age} yrs • {pet.weight} kg</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEdit(pet)}>
                    <Edit size={14} className="mr-1" /> Edit
                  </Button>
                  <Button
                    variant="outline" size="sm"
                    onClick={() => confirm('Remove this pet?') && deletePet.mutate(pet._id)}
                  >
                    <Trash2 size={14} />
                  </Button>
                  <Button
                    variant="outline" size="sm"
                    onClick={() => createTag.mutate(pet._id)}
                    disabled={createTag.isPending}
                  >
                    Tag
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pet Tags */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Pet Tags</h2>
        {tags?.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tags.map((t: any) => (
              <Card key={t._id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <img src={t.pet?.image} alt="" className="w-12 h-12 rounded object-cover" />
                    <div className="flex-1">
                      <p className="font-semibold">{t.pet?.name}</p>
                      <p className="text-xs text-muted-foreground">Code: {t.tagCode}</p>
                      <p className="text-xs text-muted-foreground">Scans: {t.scans || 0}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <a
                      href={`/pet-tags/scan/${t.tagCode}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-primary hover:underline"
                    >
                      Test scan
                    </a>
                    {t.isActive && (
                      <Button variant="outline" size="sm" onClick={() => deactivateTag.mutate(t._id)}>
                        Deactivate
                      </Button>
                    )}
                    {!t.isActive && <Badge variant="secondary">Inactive</Badge>}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No tags yet. Create one from a pet card.</p>
        )}
      </div>
    </div>
  );
}