import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Trash2, Bell } from 'lucide-react';

export function Reminders() {
  const qc = useQueryClient();
  const { data: pets } = useQuery({ queryKey: ['pets'], queryFn: () => api.get('/pets').then((r) => r.data.data) });
  const { data: reminders, isLoading } = useQuery({
    queryKey: ['reminders'],
    queryFn: () => api.get('/reminders').then((r) => r.data.data),
  });

  const [form, setForm] = useState({
    petId: '',
    type: 'vaccination',
    title: '',
    message: '',
    scheduledFor: '',
    channel: 'email',
  });

  const create = useMutation({
    mutationFn: (d: any) => api.post('/reminders', d),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['reminders'] });
      toast.success('Reminder created');
      setForm({ petId: '', type: 'vaccination', title: '', message: '', scheduledFor: '', channel: 'email' });
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed'),
  });

  const remove = useMutation({
    mutationFn: (id: string) => api.delete(`/reminders/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['reminders'] });
      toast.success('Deleted');
    },
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    create.mutate({
      petId: form.petId,
      type: form.type,
      title: form.title,
      message: form.message,
      scheduledFor: form.scheduledFor,
      channel: form.channel,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center gap-2 mb-6">
        <Bell className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold">Reminders</h1>
      </div>

      <Card className="mb-8">
        <CardContent className="p-6">
          <form onSubmit={submit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Pet</Label>
                <Select value={form.petId} onValueChange={(v) => v && setForm({ ...form, petId: v })}>
                  <SelectTrigger><SelectValue placeholder="Select pet" /></SelectTrigger>
                  <SelectContent>
                    {pets?.map((p: any) => (
                      <SelectItem key={p._id} value={p._id}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Type</Label>
                <Select value={form.type} onValueChange={(v) => v && setForm({ ...form, type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vaccination">Vaccination</SelectItem>
                    <SelectItem value="grooming">Grooming</SelectItem>
                    <SelectItem value="deworming">Deworming</SelectItem>
                    <SelectItem value="checkup">Checkup</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Title</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div>
              <Label>Message</Label>
              <Textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Scheduled for</Label>
                <Input type="datetime-local" value={form.scheduledFor} onChange={(e) => setForm({ ...form, scheduledFor: e.target.value })} required />
              </div>
              <div>
                <Label>Channel</Label>
                <Select value={form.channel} onValueChange={(v) => v && setForm({ ...form, channel: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="both">Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button type="submit" disabled={create.isPending}>{create.isPending ? 'Saving...' : 'Create Reminder'}</Button>
          </form>
        </CardContent>
      </Card>

      <h2 className="text-xl font-semibold mb-3">My Reminders</h2>
      {isLoading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : (reminders?.length ?? 0) === 0 ? (
        <p className="text-muted-foreground">No reminders yet</p>
      ) : (
        <div className="space-y-3">
          {reminders?.map((r: any) => (
            <Card key={r._id}>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium">{r.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {r.pet?.name} · {r.type} · {new Date(r.scheduledFor).toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">{r.message}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs capitalize">{r.status}</span>
                  <Button size="icon" variant="ghost" onClick={() => remove.mutate(r._id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}