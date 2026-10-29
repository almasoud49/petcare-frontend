import {
  ShieldCheck,
  Truck,
  Sparkles,
  Heart,
  Stethoscope,
  Headphones,
  ArrowRight,
  PawPrint,
  Star,
  CheckCircle2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface Feature {
  icon: any;
  title: string;
  description: string;
  href?: string;
  color: string;
  iconBg: string;
}

const features: Feature[] = [
  {
    icon: Truck,
    title: 'Same-Day Delivery',
    description: 'Order before 2 PM for delivery across Dhaka today.',
    href: '/products',
    color: 'text-green-600 dark:text-green-400',
    iconBg: 'bg-green-100 dark:bg-green-900/40',
  },
  {
    icon: Sparkles,
    title: 'AI-Powered Recommendations',
    description: 'Personalized product picks based on your pet.',
    href: '/quiz',
    color: 'text-purple-600 dark:text-purple-400',
    iconBg: 'bg-purple-100 dark:bg-purple-900/40',
  },
  {
    icon: Heart,
    title: '100% Authentic Products',
    description: 'Direct from authorized importers — no grey market.',
    color: 'text-pink-600 dark:text-pink-400',
    iconBg: 'bg-pink-100 dark:bg-pink-900/40',
  },
  {
    icon: Stethoscope,
    title: '24/7 Emergency Vets',
    description: 'Find a nearby emergency vet in under a minute.',
    href: '/emergency-vets',
    color: 'text-red-600 dark:text-red-400',
    iconBg: 'bg-red-100 dark:bg-red-900/40',
  },
  {
    icon: Headphones,
    title: 'Real Human Support',
    description: 'Chat, call, or email. We respond within hours.',
    color: 'text-orange-600 dark:text-orange-400',
    iconBg: 'bg-orange-100 dark:bg-orange-900/40',
  },
];

export function TopFeatures() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-14 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <PawPrint className="h-4 w-4" />
            Why Pet Parents Choose Us
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Care You Can <span className="text-primary">Trust</span>
          </h2>
          <p className="text-muted-foreground">
            Six reasons why 50,000+ pet parents across Bangladesh rely on us
            every day.
          </p>
        </div>

        {/* ── Two-column layout ─────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto items-stretch">
          {/* LEFT: Featured highlight card */}
          <Card className="bg-gradient-to-br from-primary to-primary/85 text-primary-foreground border-none relative overflow-hidden">
            <CardContent className="p-8 md:p-10 h-full flex flex-col relative z-10">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-3 py-1 rounded-full text-xs font-medium mb-6 w-fit">
                <Star className="h-3.5 w-3.5 fill-current" />
                Our Promise
              </div>

              <div className="h-16 w-16 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center mb-6">
                <ShieldCheck className="h-8 w-8" />
              </div>

              <h3 className="text-2xl md:text-3xl font-bold mb-3 leading-tight">
                Certified Professionals, Every Visit
              </h3>
              <p className="text-white/85 mb-8 leading-relaxed max-w-md">
                Every vet, groomer, trainer, and boarder on PetCare is licensed,
                insured, and background-checked. We verify credentials so you
                don't have to.
              </p>

              <ul className="space-y-3 mb-8">
                {[
                  'Licensed DVMs & certified trainers',
                  'Background-checked providers',
                  'Insured for every appointment',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm">
                    <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto">
                <Link
                  to="/services"
                  className={
                    buttonVariants({ variant: 'secondary' }) +
                    ' gap-2 w-fit'
                  }
                >
                  Meet Our Providers
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {/* Decorative paw */}
              <PawPrint className="absolute -bottom-10 -right-10 h-56 w-56 opacity-[0.08] pointer-events-none" />
            </CardContent>
          </Card>

          {/* RIGHT: Feature list */}
          <div className="flex flex-col gap-3">
            {features.map((f) => {
              const content = (
                <div className="flex items-start gap-4 p-4 rounded-xl border bg-card hover:shadow-md hover:border-primary/30 transition-all group h-full">
                  <div
                    className={`h-11 w-11 rounded-xl ${f.iconBg} flex items-center justify-center shrink-0 group-hover:scale-105 transition`}
                  >
                    <f.icon className={`h-5 w-5 ${f.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[15px] mb-0.5 flex items-center gap-1.5">
                      {f.title}
                      {f.href && (
                        <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                      )}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {f.description}
                    </p>
                  </div>
                </div>
              );

              return f.href ? (
                <Link key={f.title} to={f.href}>
                  {content}
                </Link>
              ) : (
                <div key={f.title}>{content}</div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}