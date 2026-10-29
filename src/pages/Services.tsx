import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { useState } from 'react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { CardGridSkeleton } from '../components/shared/Skeletons';
import { api } from '../lib/api';
import { ServiceCard } from '../components/shared/ServiceCard';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';

const categories = ['grooming', 'vet', 'boarding', 'training', 'walking'];

const categoryItems = [
  { label: 'All Categories', value: null as string | null },
  ...categories.map((c) => ({ label: c.charAt(0).toUpperCase() + c.slice(1), value: c })),
];

const sortItems = [
  { label: 'Newest', value: 'newest' },
  { label: 'Highest Rated', value: 'rating' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
];

export function Services() {
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState(params.get('search') || '');
  const [category, setCategory] = useState<string | null>(params.get('category') || null);
  const [sort, setSort] = useState(params.get('sort') || 'newest');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['services', { search, category, sort, page }],
    queryFn: () =>
      api
        .get('/services', {
          params: {
            search: search || undefined,
            category: category || undefined,
            sort,
            page,
            limit: 12,
          },
        })
        .then((r: { data: any; }) => r.data),
  });

  const handleFilter = () => {
    const p = new URLSearchParams();
    if (search) p.set('search', search);
    if (category) p.set('category', category);
    if (sort) p.set('sort', sort);
    setParams(p);
    setPage(1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Browse Services</h1>
      <p className="text-muted-foreground mb-8">Find the perfect care for your pet.</p>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-8">
        <Input
          placeholder="Search services..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Select
          value={category}
          onValueChange={(v: string | null) => setCategory(v as string | null)}
          items={categoryItems}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categoryItems.map((item) => (
              <SelectItem key={item.value ?? 'all'} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sort} onValueChange={(v) => setSort(v as string)} items={sortItems}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sortItems.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button onClick={handleFilter}>Apply Filters</Button>
      </div>

      {isLoading ? (
        <CardGridSkeleton />
      ) : data?.data?.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          No services found. Try adjusting your filters.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data?.data?.map((s: any) => (
              <ServiceCard key={s._id} service={s} />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-2 mt-10">
            <Button variant="outline" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
              Previous
            </Button>
            <span className="flex items-center px-4 text-sm">
              Page {page} of {data?.meta?.totalPages || 1}
            </span>
            <Button
              variant="outline"
              disabled={page >= (data?.meta?.totalPages || 1)}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  );
}