import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import {
  PawPrint,
  Star,
  Calendar,
  ShoppingBag,
  TrendingUp,
  Heart,
  Users,
  ShieldCheck,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

// ─── Animated counter hook ─────────────────────────
function useCountUp(target: number, duration = 1500) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const animate = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Math.floor(target * eased));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return { value, ref };
}

// ─── Single stat card ──────────────────────────────
interface StatItem {
  icon: any;
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  sublabel: string;
  color: string;
  bg: string;
}

function StatCard({ stat }: { stat: StatItem }) {
  const { value, ref } = useCountUp(stat.value);

  return (
    <div
      ref={ref}
      className="relative group rounded-2xl border bg-card p-6 hover:shadow-lg hover:border-primary/30 transition-all overflow-hidden"
    >
      {/* Gradient blob */}
      <div className={`absolute -top-8 -right-8 h-24 w-24 rounded-full ${stat.bg} opacity-60 blur-2xl pointer-events-none`} />

      <div className="relative z-10">
        <div className={`h-12 w-12 rounded-xl ${stat.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
          <stat.icon className={`h-6 w-6 ${stat.color}`} />
        </div>

        <p className="text-3xl md:text-4xl font-bold leading-tight tracking-tight">
          {stat.prefix}
          {value.toLocaleString()}
          {stat.suffix}
        </p>
        <p className="text-sm font-semibold mt-1">{stat.label}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{stat.sublabel}</p>
      </div>
    </div>
  );
}

// ─── Component ─────────────────────────────────────
export function StatsSection() {
  // Optionally hydrate the numbers from the backend.
  // Falls back to hardcoded values if the API is unavailable.
  const { data: overview } = useQuery({
    queryKey: ['public-stats'],
    queryFn: () => api.get('/dashboard/public-stats').then((r) => r.data.data),
    staleTime: 5 * 60 * 1000,
    retry: 0,
  });

  const stats: StatItem[] = [
    {
      icon: PawPrint,
      value: overview?.totalPets ?? 50000,
      suffix: '+',
      label: 'Pets Cared For',
      sublabel: 'Across Bangladesh',
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      icon: Star,
      value: 49,  // rendered as "4.9"
      suffix: '/5',
      label: 'Average Rating',
      sublabel: `${(overview?.totalReviews ?? 12000).toLocaleString()}+ reviews`,
      color: 'text-yellow-600 dark:text-yellow-400',
      bg: 'bg-yellow-100 dark:bg-yellow-900/30',
    },
    {
      icon: Calendar,
      value: overview?.totalBookings ?? 120000,
      suffix: '+',
      label: 'Bookings Served',
      sublabel: 'Happy appointments',
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-100 dark:bg-blue-900/30',
    },
    {
      icon: ShoppingBag,
      value: overview?.totalProducts ?? 500,
      suffix: '+',
      label: 'Premium Products',
      sublabel: '100% authentic',
      color: 'text-pink-600 dark:text-pink-400',
      bg: 'bg-pink-100 dark:bg-pink-900/30',
    },
  ];

  return (
    <section className="relative py-20 overflow-hidden bg-gradient-to-b from-background via-muted/30 to-background">
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="absolute top-10 left-10">
          <PawPrint className="h-32 w-32" />
        </div>
        <div className="absolute bottom-10 right-20 rotate-12">
          <PawPrint className="h-40 w-40" />
        </div>
        <div className="absolute top-1/2 left-1/3 -rotate-12">
          <PawPrint className="h-24 w-24" />
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-14 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <TrendingUp className="h-4 w-4" />
            By the Numbers
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Trusted by Thousands,
            <br />
            <span className="text-primary">Loved by Every Pet</span>
          </h2>
          <p className="text-muted-foreground">
            Real impact, measurable care. Here's what we've built together with
            the pet parent community.
          </p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto">
          {stats.map((s) => (
            <StatCard key={s.label} stat={s} />
          ))}
        </div>

        {/* Trust strip below stats */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <span>Verified by 100+ certified vets</span>
          </div>
          <div className="hidden sm:block h-3 w-px bg-border" />
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-primary" />
            <span>4.9/5 on Google & Facebook</span>
          </div>
          <div className="hidden sm:block h-3 w-px bg-border" />
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <span>Growing by 2,000+ pet parents monthly</span>
          </div>
        </div>
      </div>
    </section>
  );
}