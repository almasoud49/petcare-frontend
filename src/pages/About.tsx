import { PawPrint, Shield, Heart, Users, Award, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';

export function About() {
  return (
    <div>
      <section className="bg-primary/10 py-20">
        <div className="container mx-auto px-4 text-center">
          <PawPrint className="mx-auto h-16 w-16 text-primary mb-4" />
          <h1 className="text-4xl font-bold mb-4">About PetCare</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We are Bangladesh's most trusted platform for pet care services and products.
            Because every pet deserves the best.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <img src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800" alt="" className="rounded-xl" />
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-4">Our Story</h2>
            <p className="text-muted-foreground mb-4">
              Founded in 2020 by a team of pet lovers and veterinary professionals, PetCare started
              with one simple mission: to make quality pet care accessible to every pet parent in Bangladesh.
            </p>
            <p className="text-muted-foreground mb-4">
              Today, we connect thousands of pet parents with certified vets, groomers, trainers, and boarders —
              while delivering premium pet products right to their doorsteps.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: 'Trust First', desc: 'Every provider is certified, background-checked, and reviewed by real customers.' },
              { icon: Heart, title: 'Pet-Centric', desc: 'Every decision we make starts with "what is best for the pet?"' },
              { icon: Award, title: 'Quality', desc: 'We source only authentic, vet-approved products from trusted brands.' },
            ].map((v) => (
              <Card key={v.title}>
                <CardContent className="p-6 text-center">
                  <v.icon className="mx-auto h-12 w-12 text-primary mb-4" />
                  <h3 className="font-semibold text-lg mb-2">{v.title}</h3>
                  <p className="text-sm text-muted-foreground">{v.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { icon: Users, value: '50,000+', label: 'Happy Pets' },
            { icon: Shield, value: '500+', label: 'Certified Providers' },
            { icon: TrendingUp, value: '4.9/5', label: 'Average Rating' },
            { icon: Heart, value: '120K+', label: 'Services Delivered' },
          ].map((s) => (
            <div key={s.label}>
              <s.icon className="mx-auto h-10 w-10 text-primary mb-2" />
              <div className="text-3xl font-bold">{s.value}</div>
              <div className="text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}