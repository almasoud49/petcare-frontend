import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { api } from '../lib/api';
import { ProductCard } from '../components/shared/ProductCard';
import { CardGridSkeleton } from '../components/shared/Skeletons';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '../components/ui/select';

const typeItems = [
  { label: 'All Types', value: null as string | null },
  { label: 'Food', value: 'food' },
  { label: 'Treats', value: 'treats' },
  { label: 'Litter', value: 'litter' },
  { label: 'Toys', value: 'toy' },
  { label: 'Accessories', value: 'accessory' },
  { label: 'Grooming', value: 'grooming' },
  { label: 'Health', value: 'health' },
];

const speciesItems = [
  { label: 'All Pets', value: null as string | null },
  { label: 'Dogs', value: 'dog' },
  { label: 'Cats', value: 'cat' },
  { label: 'Birds', value: 'bird' },
  { label: 'Rabbits', value: 'rabbit' },
];

const sortItems = [
  { label: 'Newest', value: 'newest' },
  { label: 'Best Selling', value: 'best_selling' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Highest Rated', value: 'rating' },
];

export function Products() {
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get('/categories').then((r) => r.data.data),
  });
  const [search, setSearch] = useState('');
  const [type, setType] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [species, setSpecies] = useState<string | null>(null);
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['products', { search, type, species, category, sort, page }],
    queryFn: () =>
      api.get('/products', {
        params: { search, type: type || undefined, species: species || undefined, category: category || undefined, sort, page, limit: 12 },
      }).then((r) => r.data),
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Shop Products</h1>
      <p className="text-muted-foreground mb-8">Premium pet food, toys, and accessories</p>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-8">
        <Input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <Select value={type} onValueChange={setType} items={typeItems}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {typeItems.map((i) => (
              <SelectItem key={i.value ?? 'all'} value={i.value}>{i.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={species} onValueChange={setSpecies} items={speciesItems}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {speciesItems.map((i) => (
              <SelectItem key={i.value ?? 'all'} value={i.value}>{i.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={category} onValueChange={(v) => { if (v !== undefined) setCategory(v); }} items={(categories || []).map((c: any) => ({ label: c.name, value: c._id }))}>
          <SelectTrigger><SelectValue placeholder="All Categories" /></SelectTrigger>
          <SelectContent>
            <SelectItem value={null as any}>All Categories</SelectItem>
            {(categories || []).map((c: any) => (
              <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={(v) => { if (v) setSort(v); }} items={sortItems}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {sortItems.map((i) => <SelectItem key={i.value} value={i.value}>{i.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <CardGridSkeleton />
      ) : data?.data?.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">No products found</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data?.data?.map((p: any) => <ProductCard key={p._id} product={p} />)}
          </div>
          <div className="flex justify-center items-center gap-2 mt-10">
            <Button variant="outline" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
            <span className="px-4 text-sm">Page {page} of {data?.meta?.totalPages || 1}</span>
            <Button variant="outline" disabled={page >= (data?.meta?.totalPages || 1)} onClick={() => setPage((p) => p + 1)}>Next</Button>
          </div>
        </>
      )}
    </div>
  );
}