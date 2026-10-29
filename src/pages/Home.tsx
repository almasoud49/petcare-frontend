import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '@/lib/api';
import { ServiceCard } from '@/components/shared/ServiceCard';
import { ProductCard } from '@/components/shared/ProductCard';
import { CardGridSkeleton } from '@/components/shared/Skeletons';
import { TrustBar } from '@/components/shared/TrustBar';
import { TrustBadges } from '@/components/shared/TrustBadges';
import { TopFeatures } from '@/components/shared/TopFeatures';
import { StatsSection } from '@/components/shared/StatsSection';
import { CategorySection } from '@/components/shared/CategorySection';
import { HowItWorks } from '@/components/shared/HowItWorks';
import { FAQSection } from '@/components/shared/FAQSection';
import { ClickToCall } from '@/components/shared/ClickToCall';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  PawPrint,
  Star,
  Calendar,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  Zap,
} from 'lucide-react';

const testimonials = [
  {
    name: 'Patrishia Karmaker',
    role: 'Cat mom from Dhanmondi',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    rating: 5,
    text: 'I have been purchasing from PetCare for quite some time and now I have the membership card as well! Totally satisfied with their quality products and fast delivery.',
  },
  {
    name: 'Sunny Haque',
    role: 'Dog parent from Gulshan',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    rating: 5,
    text: 'I recently purchased from PetCare, and I am thoroughly impressed! Highly recommend for all pet owners. My Golden Retriever loves the treats.',
  },
  {
    name: 'Zasia Tashnuva',
    role: 'Cat mom from Uttara',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
    rating: 5,
    text: 'I have been buying products for my cats for a while now from this page and I have to say that this page is definitely the best one to purchase anything for your pets.',
  },
];

export function Home() {
  const { data: services, isLoading: loadingServices } = useQuery({
    queryKey: ['featured-services'],
    queryFn: () =>
      api.get('/services?limit=4&sort=rating').then((r) => r.data.data),
  });

  const { data: products, isLoading: loadingProducts } = useQuery({
    queryKey: ['featured-products'],
    queryFn: () => api.get('/products/featured').then((r) => r.data.data),
  });

  return (
    <div>
      {/* ─── HERO ─────────────────────────────────── */}
      <section className="relative h-[65vh] min-h-[520px] flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=1600"
          alt="Happy pet"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/40" />

        <div className="relative z-10 text-center text-white px-4 max-w-4xl">
          <Badge className="mb-4 bg-white/20 text-white border-white/30 backdrop-blur">
            <Sparkles className="h-3 w-3 mr-1" />
            Trusted by 50,000+ pet parents
          </Badge>

          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
            Because They Deserve the Best
          </h1>
          <p className="text-base md:text-xl mb-8 text-white/90 max-w-2xl mx-auto leading-relaxed">
            Professional pet care services and premium products delivered to your
            doorstep across Bangladesh.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Link
              to="/services"
              className={buttonVariants({ size: 'lg' }) + ' w-full sm:w-auto'}
            >
              <Calendar className="mr-2 h-5 w-5" />
              Book a Service
            </Link>

            <Link
              to="/products"
              className={
                buttonVariants({ size: 'lg', variant: 'outline' }) +
                ' w-full sm:w-auto bg-white/10 text-white border-white/40 hover:bg-white/20 backdrop-blur'
              }
            >
              <ShoppingBag className="mr-2 h-5 w-5" />
              Shop Products
            </Link>

            <ClickToCall
              variant="ghost"
              size="lg"
              className="text-white hover:bg-white/20 w-full sm:w-auto"
              label="Call Now"
            />
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 text-xs flex flex-col items-center gap-1 animate-bounce">
          <span>Scroll to explore</span>
          <ArrowRight className="h-4 w-4 rotate-90" />
        </div>
      </section>

      {/* ─── TRUST BAR ────────────────────────────── */}
      <TrustBar variant="strip" />

      {/* ─── TOP FEATURES ─────────────────────────── */}
      <TopFeatures />

      {/* ─── STATS ────────────────────────────────── */}
      <StatsSection />

      {/* ─── CATEGORY SECTION (NEW) ───────────────── */}
      <CategorySection />

      {/* ─── TRUST BADGES ROW ─────────────────────── */}
      <section className="py-10 bg-muted/30">
        <div className="container mx-auto px-4">
          <TrustBadges />
        </div>
      </section>

      {/* ─── TOP SERVICES ─────────────────────────── */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-8 flex-wrap gap-3">
            <div>
              <h2 className="text-3xl font-bold">Top-Rated Services</h2>
              <p className="text-muted-foreground mt-1">
                Book from our most-loved providers
              </p>
            </div>
            <Link
              to="/services"
              className={buttonVariants({ variant: 'outline' }) + ' gap-1'}
            >
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {loadingServices ? (
            <CardGridSkeleton count={4} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {services?.map((s: any) => (
                <ServiceCard key={s._id} service={s} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── FEATURED PRODUCTS ────────────────────── */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-8 flex-wrap gap-3">
            <div>
              <h2 className="text-3xl font-bold">Featured Products</h2>
              <p className="text-muted-foreground mt-1">
                Premium picks for your furry friend
              </p>
            </div>
            <Link
              to="/products"
              className={buttonVariants({ variant: 'outline' }) + ' gap-1'}
            >
              Shop All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {loadingProducts ? (
            <CardGridSkeleton count={4} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products?.slice(0, 4).map((p: any) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── HOW IT WORKS ─────────────────────────── */}
      <HowItWorks />

      {/* ─── TESTIMONIALS ─────────────────────────── */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">Loved by Pet Parents</h2>
            <p className="text-muted-foreground">
              Real stories from our community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <Card key={t.name}>
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className="fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                    "{t.text}"
                  </p>
                  <div className="flex items-center gap-3">
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold text-sm">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ─── AI / EMERGENCY CTA ───────────────────── */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardContent className="p-8">
                <Sparkles className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-2xl font-bold mb-2">
                  Not sure what to buy?
                </h3>
                <p className="text-muted-foreground mb-6">
                  Take our 30-second AI quiz. Get personalized product
                  recommendations for your pet based on breed, age, and needs.
                </p>
                <Link to="/quiz" className={buttonVariants() + ' gap-2'}>
                  <Sparkles className="h-4 w-4" />
                  Take the Quiz
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-50 to-red-100/50 border-red-200">
              <CardContent className="p-8">
                <Zap className="h-10 w-10 text-red-600 mb-4" />
                <h3 className="text-2xl font-bold mb-2">Pet emergency?</h3>
                <p className="text-muted-foreground mb-6">
                  Find 24/7 emergency vets near you. Every second counts — call
                  immediately.
                </p>
                <Link
                  to="/emergency-vets"
                  className={
                    buttonVariants({ variant: 'destructive' }) + ' gap-2'
                  }
                >
                  <Zap className="h-4 w-4" />
                  Find Emergency Vet
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ─── FAQ SECTION ──────────────────────────── */}
      <FAQSection />

      {/* ─── FINAL CTA ────────────────────────────── */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <PawPrint className="mx-auto h-14 w-14 mb-4" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Pamper Your Pet?
          </h2>
          <p className="mb-8 text-white/90 max-w-xl mx-auto">
            Join thousands of happy pet parents. Book a service or shop our
            premium products today.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/register"
              className={
                buttonVariants({ size: 'lg', variant: 'secondary' }) +
                ' w-full sm:w-auto'
              }
            >
              Get Started Free
            </Link>
            <Link
              to="/services"
              className={
                buttonVariants({ size: 'lg', variant: 'outline' }) +
                ' w-full sm:w-auto text-white border-white/40 hover:bg-white/10'
              }
            >
              Browse Services
            </Link>
            <ClickToCall
              variant="ghost"
              size="lg"
              className="text-white hover:bg-white/20 w-full sm:w-auto"
              label="Call Us Now"
            />
          </div>
        </div>
      </section>
    </div>
  );
}