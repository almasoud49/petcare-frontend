import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Heart } from 'lucide-react';

export function Spotlight() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ petId: '', petName: '', image: '', caption: '' });
  const { data: pets } = useQuery({ queryKey: ['pets'], queryFn: () => api.get('/pets').then((r) => r.data.data) });
  const { data, isLoading } = useQuery({
    queryKey: ['spotlights'],
    queryFn: () => api.get('/spotlights').then((r) => r.data.data),
  });

  const create = useMutation({
    mutationFn: (d: any) => api.post('/spotlights', d),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['spotlights'] });
      toast.success('Posted!');
      setShowForm(false);
      setForm({ petId: '', petName: '', image: '', caption: '' });
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed'),
  });

  const like = useMutation({
    mutationFn: (id: string) => api.post(`/spotlights/${id}/like`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['spotlights'] }),
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    create.mutate({
      pet: form.petId || undefined,
      petName: form.petName,
      image: form.image,
      caption: form.caption,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Pet Spotlight</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Share Your Pet'}
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardContent className="p-6">
            <form onSubmit={submit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Pet (optional)</Label>
                  <Select value={form.petId} onValueChange={(v) => {
                    if (!v) return;
                    const p = pets?.find((x: any) => x._id === v);
                    setForm({ ...form, petId: v, petName: p?.name || form.petName });
                  }}>
                    <SelectTrigger><SelectValue placeholder="Select pet" /></SelectTrigger>
                    <SelectContent>
                      {pets?.map((p: any) => (
                        <SelectItem key={p._id} value={p._id}>{p.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Pet Name</Label>
                  <Input value={form.petName} onChange={(e) => setForm({ ...form, petName: e.target.value })} required />
                </div>
              </div>
              <div>
                <Label>Image URL</Label>
                <Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} required />
              </div>
              <div>
                <Label>Caption</Label>
                <Textarea value={form.caption} onChange={(e) => setForm({ ...form, caption: e.target.value })} required />
              </div>
              <Button type="submit" disabled={create.isPending}>{create.isPending ? 'Posting...' : 'Post'}</Button>
            </form>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : (data?.length ?? 0) === 0 ? (
        <p className="text-muted-foreground">No spotlights yet. Be the first!</p>
      ) : (
        <div className="space-y-6">
          {data?.map((s: any) => (
            <Card key={s._id} className="overflow-hidden">
              <img src={s.image} alt={s.petName} className="w-full h-72 object-cover" />
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-semibold">{s.petName}</p>
                    <p className="text-xs text-muted-foreground">by {s.user?.name}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => like.mutate(s._id)}
                    className="flex items-center gap-1"
                  >
                    <Heart className="h-4 w-4" />
                    {s.likes?.length ?? 0}
                  </Button>
                </div>
                <p className="text-sm">{s.caption}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}