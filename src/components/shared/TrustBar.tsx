import {
  PawPrint,
  Star,
  Truck,
  ShieldCheck,
  CreditCard,
  Stethoscope,
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface TrustBarProps {
  variant?: 'strip' | 'cards' | 'dark';
}

const trustSignals = [
  {
    icon: PawPrint,
    value: '50,000+',
    label: 'Pets Cared For',
    link: '/services',
  },
  {
    icon: Star,
    value: '4.9/5',
    label: 'from 12,000+ Reviews',
    link: '/services',
  },
  {
    icon: Truck,
    value: 'Free Delivery',
    label: 'on Orders ৳1000+',
    link: '/products',
  },
  {
    icon: ShieldCheck,
    value: '100%',
    label: 'Vet-Approved',
    link: '/about',
  },
  {
    icon: Stethoscope,
    value: '24/7',
    label: 'Emergency Vets',
    link: '/emergency-vets',
  },
  {
    icon: CreditCard,
    value: 'bKash · Nagad · COD',
    label: 'All Payments Accepted',
    link: '/return-policy',
  },
];

export function TrustBar({ variant = 'strip' }: TrustBarProps) {
  // ─── STRIP (default) — slim bar under hero ─────────
  if (variant === 'strip') {
    return (
      <section className="border-y bg-gradient-to-r from-primary/5 via-background to-primary/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 divide-y md:divide-y-0 md:divide-x divide-border">
            {trustSignals.map((s) => (
              <Link
                key={s.label}
                to={s.link}
                className="group flex items-center gap-2.5 py-3.5 px-2 hover:bg-primary/5 transition-colors"
              >
                <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 group-hover:scale-105 transition-all">
                  <s.icon className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-[13px] font-bold leading-tight truncate">
                    {s.value}
                  </p>
                  <p className="text-[10px] text-muted-foreground leading-tight truncate mt-0.5">
                    {s.label}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // ─── CARDS — 3x2 grid with more breathing room ─────
  if (variant === 'cards') {
    return (
      <section className="py-12 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {trustSignals.map((s) => (
              <Link
                key={s.label}
                to={s.link}
                className="group flex flex-col items-center text-center p-4 rounded-2xl border border-transparent hover:border-primary/20 hover:bg-background hover:shadow-sm transition-all"
              >
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-primary/15 transition-all">
                  <s.icon className="h-5 w-5 text-primary" />
                </div>
                <p className="text-sm font-bold leading-tight">{s.value}</p>
                <p className="text-[11px] text-muted-foreground leading-tight mt-1">
                  {s.label}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // ─── DARK — prominent colored strip ────────────────
  return (
    <section className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
          {trustSignals.slice(0, 4).map((s) => (
            <Link
              key={s.label}
              to={s.link}
              className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
            >
              <s.icon className="h-4 w-4" />
              <span className="font-semibold">{s.value}</span>
              <span className="opacity-80 text-xs hidden sm:inline">
                {s.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}