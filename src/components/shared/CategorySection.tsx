import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { ArrowRight, Package } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';

interface CategoryCard {
  name: string;
  slug: string;
  image: string;
  itemCount: number;
  accent: string;
}

const categories: CategoryCard[] = [
  {
    name: 'Dog Food',
    slug: 'dog-food',
    image:
      'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=600',
    itemCount: 120,
    accent: 'from-orange-500/80 to-orange-600/90',
  },
  {
    name: 'Cat Food',
    slug: 'cat-food',
    image:
      'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600',
    itemCount: 95,
    accent: 'from-pink-500/80 to-pink-600/90',
  },
  {
    name: 'Cat Litter',
    slug: 'cat-litter',
    image:
      'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600',
    itemCount: 48,
    accent: 'from-blue-500/80 to-blue-600/90',
  },
  {
    name: 'Toys',
    slug: 'toys',
    image:
      'https://images.unsplash.com/photo-1560807707-8cc77767d783?w=600',
    itemCount: 85,
    accent: 'from-green-500/80 to-green-600/90',
  },
  {
    name: 'Accessories',
    slug: 'accessories',
    image:
      'https://images.unsplash.com/photo-1552053831-71594a27632d?w=600',
    itemCount: 76,
    accent: 'from-purple-500/80 to-purple-600/90',
  },
  {
    name: 'Health & Grooming',
    slug: 'health-grooming',
    image:
      'https://images.unsplash.com/photo-1606425271394-c3ca9aa1fc06?w=600',
    itemCount: 64,
    accent: 'from-teal-500/80 to-teal-600/90',
  },
];

export function CategorySection() {
  // Optional: hydrate item counts from backend
  const { data: productStats } = useQuery({
    queryKey: ['product-stats-public'],
    queryFn: () =>
      api
        .get('/products', { params: { limit: 1 } })
        .then((r) => r.data?.meta?.total)
        .catch(() => null),
    staleTime: 5 * 60 * 1000,
    retry: 0,
  });

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* ─── Header ─────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4">
              <Package className="h-4 w-4" />
              Shop by Category
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              Everything Your Pet Needs,
              <br />
              <span className="text-primary">Organized for You</span>
            </h2>
            <p className="text-muted-foreground">
              From premium food to essential accessories — browse
              {productStats ? ` ${productStats}+` : ' 500+'} products curated for
              every pet.
            </p>
          </div>

          <Link
            to="/products"
            className={buttonVariants({ variant: 'outline' }) + ' gap-1 w-fit'}
          >
            Browse All Products
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* ─── Category cards grid ───────────── */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((c) => (
            <Link
              key={c.slug}
              to={`/products?category=${c.slug}`}
              className="group relative overflow-hidden rounded-2xl aspect-[3/4] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {/* Image */}
              <img
                src={c.image}
                alt={c.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />

              {/* Gradient overlay */}
              <div
                className={`absolute inset-0 bg-gradient-to-t ${c.accent} opacity-90 group-hover:opacity-100 transition-opacity`}
              />

              {/* Dark base for readability */}
              <div className="absolute inset-0 bg-black/10" />

              {/* Content */}
              <div className="relative z-10 h-full flex flex-col justify-between p-4">
                <div className="flex items-center justify-end">
                  <div className="text-[10px] font-bold bg-white/25 backdrop-blur text-white px-2 py-0.5 rounded-full">
                    {c.itemCount}+ items
                  </div>
                </div>

                <div>
                  <h3 className="text-white font-bold text-base md:text-lg leading-tight mb-1">
                    {c.name}
                  </h3>
                  <div className="flex items-center gap-1 text-white/90 text-xs font-medium">
                    <span>Shop now</span>
                    <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>

              {/* Border glow on hover */}
              <div className="absolute inset-0 rounded-2xl ring-2 ring-white/0 group-hover:ring-white/30 transition-all pointer-events-none" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}