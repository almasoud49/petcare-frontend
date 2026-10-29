import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Sparkles } from 'lucide-react';

export function Quiz() {
  const [form, setForm] = useState({
    species: 'dog',
    age: '',
    weight: '',
    size: 'medium',
    dietaryNeeds: '',
    budget: '',
  });

  const mutation = useMutation({
    mutationFn: (data: any) => api.post('/quiz/recommend', data).then((r) => r.data.data),
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed'),
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      species: form.species,
      age: Number(form.age),
      weight: Number(form.weight),
      size: form.size,
      dietaryNeeds: form.dietaryNeeds,
      budget: form.budget ? Number(form.budget) : undefined,
    });
  };

  const products = mutation.data?.products || [];

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
          <Sparkles className="h-5 w-5" />
          <span className="font-semibold">AI Pet Food Quiz</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Find the Perfect Food</h1>
        <p className="text-muted-foreground">
          Tell us about your pet and we'll recommend the best products.
        </p>
      </div>

      <Card className="mb-8">
        <CardContent className="p-6">
          <form onSubmit={submit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Species</Label>
                <Select value={form.species} onValueChange={(v) => v && setForm({ ...form, species: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dog">Dog</SelectItem>
                    <SelectItem value="cat">Cat</SelectItem>
                    <SelectItem value="bird">Bird</SelectItem>
                    <SelectItem value="rabbit">Rabbit</SelectItem>
                    <SelectItem value="fish">Fish</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Size</Label>
                <Select value={form.size} onValueChange={(v) => v && setForm({ ...form, size: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Age (years)</Label>
                <Input type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} required />
              </div>
              <div>
                <Label>Weight (kg)</Label>
                <Input type="number" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} required />
              </div>
            </div>
            <div>
              <Label>Dietary needs</Label>
              <Textarea value={form.dietaryNeeds} onChange={(e) => setForm({ ...form, dietaryNeeds: e.target.value })} placeholder="e.g. grain-free, sensitive stomach" />
            </div>
            <div>
              <Label>Budget (৳, optional)</Label>
              <Input type="number" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} />
            </div>
            <Button type="submit" className="w-full" disabled={mutation.isPending}>
              {mutation.isPending ? 'Analyzing...' : 'Get Recommendations'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {products.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Recommended Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((p: any) => (
              <Card key={p._id}>
                <CardContent className="p-4">
                  <img src={p.images?.[0]} alt={p.name} className="w-full h-36 object-cover rounded mb-2" />
                  <p className="font-medium line-clamp-1">{p.name}</p>
                  <p className="text-sm text-muted-foreground">{p.brand}</p>
                  <p className="text-primary font-bold mt-1">৳{p.basePrice}</p>
                  <Button size="sm" className="mt-2 w-full" nativeButton={false} render={<Link to={`/products/${p.slug ?? p._id}`}>View</Link>} />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
      {mutation.data?.reason === 'no_match' && (
        <p className="text-center text-muted-foreground">No products match your pet.</p>
      )}
    </div>
  );
}