import {
  PawPrint,
  Calendar,
  CheckCircle2,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  FileText,
  Heart,
  Clock,
  Truck,
  Star,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { buttonVariants } from '@/components/ui/button';

interface Step {
  number: number;
  icon: any;
  title: string;
  description: string;
  details: string[];
  cta?: { label: string; to: string };
}

const steps: Step[] = [
  {
    number: 1,
    icon: PawPrint,
    title: 'Create Your Pet\'s Profile',
    description:
      'Sign up and add your pet — breed, age, weight, and any special needs. The more we know, the better we can care for them.',
    details: [
      'Free to join, no card required',
      'Add unlimited pets',
      'Upload photos & medical notes',
    ],
    cta: { label: 'Create Account', to: '/register' },
  },
  {
    number: 2,
    icon: Calendar,
    title: 'Book a Service or Shop',
    description:
      'Choose from 200+ services (grooming, vet, boarding, training) or browse 500+ products. Filter by pet type, age, and size to find the perfect match.',
    details: [
      'Real-time provider availability',
      'AI-powered recommendations',
      'Instant booking confirmation',
    ],
    cta: { label: 'Browse Services', to: '/services' },
  },
  {
    number: 3,
    icon: CheckCircle2,
    title: 'Relax & We Handle the Rest',
    description:
      'Track bookings, get delivery notifications, and receive follow-up care tips. Certified professionals take care of everything — you just enjoy the results.',
    details: [
      'Live order & booking tracking',
      'Photo updates during services',
      '24/7 support if anything comes up',
    ],
    cta: { label: 'See Dashboard', to: '/dashboard' },
  },
];

const stats = [
  { icon: Heart, value: '50,000+', label: 'Pets cared for' },
  { icon: Star, value: '4.9/5', label: 'Avg rating' },
  { icon: Truck, value: 'Same-Day', label: 'Dhaka delivery' },
  { icon: Clock, value: '24/7', label: 'Emergency vets' },
];

export function HowItWorks() {
  return (
    <section className="py-20 bg-gradient-to-b from-background via-muted/20 to-background overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4" />
            Simple Process
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            How It Works
          </h2>
          <p className="text-muted-foreground">
            Three simple steps to premium pet care — from signup to service, in
            under 60 seconds.
          </p>
        </div>

        {/* ── Steps ─────────────────────────────────── */}
        <div className="max-w-5xl mx-auto relative">
          {/* Vertical connector line (desktop) */}
          <div
            className="hidden md:block absolute top-20 bottom-20 left-[68px] w-0.5 bg-gradient-to-b from-primary/40 via-primary/30 to-primary/10"
            aria-hidden
          />

          <div className="space-y-8 md:space-y-12">
            {steps.map((step, idx) => (
              <StepCard
                key={step.number}
                step={step}
                isLast={idx === steps.length - 1}
              />
            ))}
          </div>
        </div>

        {/* ── Bottom stats strip ─────────────────── */}
        <div className="max-w-4xl mx-auto mt-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="text-center p-4 rounded-2xl bg-background border hover:border-primary/30 transition-colors"
              >
                <s.icon className="h-6 w-6 text-primary mx-auto mb-2" />
                <p className="text-lg font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── One Step Card ─────────────────────────────────
function StepCard({
  step,
  isLast,
}: {
  step: Step;
  isLast: boolean;
}) {
  return (
    <div className="relative grid grid-cols-1 md:grid-cols-[136px_1fr] gap-4 md:gap-6">
      {/* Left: number + icon */}
      <div className="flex md:flex-col items-center md:items-start gap-4 md:gap-3">
        <div className="relative">
          <div className="h-16 w-16 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/30 relative z-10">
            <step.icon className="h-7 w-7" />
          </div>
          <div className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-background border-2 border-primary text-primary flex items-center justify-center text-xs font-bold z-20">
            {step.number}
          </div>
        </div>

        {/* Mobile label */}
        <div className="md:hidden flex-1">
          <p className="text-xs font-semibold text-primary uppercase tracking-wide">
            Step {step.number} {isLast && '· Final'}
          </p>
        </div>

        {/* Desktop label under icon */}
        <div className="hidden md:block">
          <p className="text-xs font-semibold text-primary uppercase tracking-wide mt-2">
            Step {step.number}
          </p>
        </div>
      </div>

      {/* Right: card content */}
      <div className="rounded-2xl border bg-background p-6 md:p-7 hover:shadow-md hover:border-primary/30 transition-all">
        <h3 className="text-xl md:text-2xl font-bold mb-2">{step.title}</h3>
        <p className="text-muted-foreground mb-5 leading-relaxed">
          {step.description}
        </p>

        <ul className="space-y-2 mb-5">
          {step.details.map((d) => (
            <li key={d} className="flex items-start gap-2.5 text-sm">
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <span className="text-muted-foreground">{d}</span>
            </li>
          ))}
        </ul>

        {step.cta && (
          <Link
            to={step.cta.to}
            className={buttonVariants({ variant: 'outline', size: 'sm' }) + ' gap-1'}
          >
            {step.cta.label}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>
    </div>
  );
}