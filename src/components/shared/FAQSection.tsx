import { useState, useMemo } from 'react';
import {
  ChevronDown,
  MessageCircle,
  Phone,
  Mail,
  HelpCircle,
  Calendar,
  Truck,
  ShoppingBag,
  CreditCard,
  User,
  Sparkles,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// ─── FAQ Data ──────────────────────────────────────
interface FAQ {
  id: string;
  category: FAQCategory;
  question: string;
  answer: string;
  featured?: boolean;
}

type FAQCategory =
  | 'Booking'
  | 'Delivery'
  | 'Products'
  | 'Payments'
  | 'Account';

const categories: { key: FAQCategory | 'All'; icon: any; label: string }[] = [
  { key: 'All', icon: Sparkles, label: 'All' },
  { key: 'Booking', icon: Calendar, label: 'Booking' },
  { key: 'Delivery', icon: Truck, label: 'Delivery' },
  { key: 'Products', icon: ShoppingBag, label: 'Products' },
  { key: 'Payments', icon: CreditCard, label: 'Payments' },
  { key: 'Account', icon: User, label: 'Account' },
];

const faqs: FAQ[] = [
  {
    id: 'f1',
    category: 'Booking',
    question: 'How do I book a service?',
    answer:
      'Log in to your account, browse our Services page, select the service you need, choose your pet, pick a date and time slot, then confirm. You will receive a confirmation email with all the details instantly. You can view or cancel your booking anytime from Dashboard → Bookings.',
    featured: true,
  },
  {
    id: 'f2',
    category: 'Delivery',
    question: 'Do you deliver outside Dhaka?',
    answer:
      'Yes! We deliver nationwide within 2–4 business days. Inside Dhaka, same-day delivery is available for orders placed before 2 PM. Free delivery on orders over ৳1,000 inside Dhaka, ৳1,500 in suburbs, and ৳2,500 nationwide.',
    featured: true,
  },
  {
    id: 'f3',
    category: 'Products',
    question: 'Are your products authentic?',
    answer:
      '100% yes. We source every product directly from authorized importers and brands — no grey market, no re-packaging. Each product is verified before it reaches our warehouse, and we only stock brands that meet international pet food standards.',
    featured: true,
  },
  {
    id: 'b1',
    category: 'Booking',
    question: 'Can I cancel or reschedule a booking?',
    answer:
      'Yes — bookings can be cancelled or rescheduled up to 24 hours before the scheduled time with no penalty. Later cancellations may incur a 20% fee. You can cancel from Dashboard → Bookings → Cancel.',
  },
  {
    id: 'b2',
    category: 'Booking',
    question: 'Can I request a specific groomer or trainer?',
    answer:
      'Yes! During booking, select your preferred provider from the dropdown. Availability shows in real-time based on their calendar. If your preferred provider is unavailable, we will suggest the next best option.',
  },
  {
    id: 'b3',
    category: 'Booking',
    question: 'Can I book for multiple pets?',
    answer:
      'Yes — add all your pets to your profile and book each one separately. A 10% multi-pet discount applies automatically for bookings on the same day.',
  },
  {
    id: 'b4',
    category: 'Booking',
    question: 'What happens if my pet has special needs?',
    answer:
      "Note any medical conditions, allergies, or behavioral needs in your pet's profile. Our providers review these before every appointment to ensure proper care. For severe conditions, contact us before booking so we can recommend the right specialist.",
  },
  {
    id: 'd1',
    category: 'Delivery',
    question: 'How much does delivery cost?',
    answer:
      'Inside Dhaka: ৳60 (free over ৳1,000). Dhaka suburbs: ৳100 (free over ৳1,500). Chittagong: ৳120 (free over ৳2,000). Nationwide: ৳150 (free over ৳2,500).',
  },
  {
    id: 'd2',
    category: 'Delivery',
    question: 'How do I track my order?',
    answer:
      'Once your order ships, you will receive an SMS and email with a tracking number. You can also track it from Dashboard → Orders → View Order → Tracking. Each status change (confirmed → shipped → delivered) triggers a notification.',
  },
  {
    id: 'd3',
    category: 'Delivery',
    question: 'Can I schedule a delivery for a future date?',
    answer:
      'Yes — during checkout, choose your preferred delivery date. For subscriptions (food or litter), the system auto-schedules recurring deliveries at your chosen frequency (weekly, biweekly, or monthly).',
  },
  {
    id: 'p1',
    category: 'Products',
    question: 'What if my pet refuses the food?',
    answer:
      'We offer a 7-day return policy on unopened food. For opened food, we cannot accept returns for health and safety reasons — but contact support and we will help you find an alternative that works for your pet.',
  },
  {
    id: 'p2',
    category: 'Products',
    question: 'Do you offer subscriptions for food and litter?',
    answer:
      'Yes! Subscribe to any food or litter product and save 5–15% based on frequency. Choose weekly, biweekly, or monthly delivery. Pause, resume, or cancel anytime from Dashboard → Subscriptions.',
  },
  {
    id: 'p3',
    category: 'Products',
    question: 'How do I know which food is right for my pet?',
    answer:
      'Take our AI-powered 30-second product quiz — it asks about breed, age, weight, and dietary needs, then recommends the best products for your pet. Or chat with our AI assistant for instant guidance.',
  },
  {
    id: 'pay1',
    category: 'Payments',
    question: 'What payment methods do you accept?',
    answer:
      'We accept bKash, Nagad, Visa/Mastercard debit & credit cards, SSLCommerz, and Cash on Delivery. All online payments use 256-bit encryption and PCI-DSS compliant processors.',
  },
  {
    id: 'pay2',
    category: 'Payments',
    question: 'Is my payment information secure?',
    answer:
      'Absolutely. We never store raw card numbers on our servers. All payments process through PCI-DSS compliant gateways (SSLCommerz, bKash, Nagad). Your card data is tokenized and encrypted end-to-end.',
  },
  {
    id: 'pay3',
    category: 'Payments',
    question: 'Do you offer refunds?',
    answer:
      'Full refunds for cancellations made 24+ hours in advance. Partial (80%) refunds for later cancellations. No-shows are non-refundable. For damaged or wrong items, we arrange free returns and full refunds — no questions asked.',
  },
  {
    id: 'a1',
    category: 'Account',
    question: 'How do I add a pet to my account?',
    answer:
      'Go to Dashboard → My Pets → Add Pet. Fill in name, species, breed, age, weight, and upload a photo. You can add unlimited pets, each with its own care notes and preferences.',
  },
  {
    id: 'a2',
    category: 'Account',
    question: 'Can I delete my account?',
    answer:
      'Yes — go to Account Settings → Delete Account. Note that this permanently removes your data and any active bookings will be cancelled with a full refund.',
  },
  {
    id: 'a3',
    category: 'Account',
    question: 'How do I contact support?',
    answer:
      'Email support@petcare.com, use the live chat (bottom-right), or call +880 1712 345678. We respond within 24 hours on business days, and 24/7 for emergencies.',
  },
];

// ─── Component ─────────────────────────────────────
export function FAQSection() {
  const [activeCategory, setActiveCategory] = useState<FAQCategory | 'All'>('All');
  const [openId, setOpenId] = useState<string | null>('f1');

  const filteredFaqs = useMemo(() => {
    return faqs.filter(
      (f) => activeCategory === 'All' || f.category === activeCategory
    );
  }, [activeCategory]);

  const featuredFaqs = filteredFaqs.filter((f) => f.featured);
  const regularFaqs = filteredFaqs.filter((f) => !f.featured);

  const toggleOpen = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="py-16 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <HelpCircle className="h-4 w-4" />
            FAQ
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Questions? We've Got Answers
          </h2>
          <p className="text-muted-foreground">
            Everything you need to know about booking, delivery, payments, and
            caring for your pet.
          </p>
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((c) => (
            <button
              key={c.key}
              onClick={() => setActiveCategory(c.key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === c.key
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-background border hover:bg-muted/50 hover:border-primary/30'
              }`}
            >
              <c.icon className="h-4 w-4" />
              {c.label}
            </button>
          ))}
        </div>

        {/* Featured FAQs */}
        {featuredFaqs.length > 0 && (
          <div className="max-w-3xl mx-auto mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-primary" />
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Most Common
              </p>
            </div>
            <div className="grid gap-3">
              {featuredFaqs.map((f) => (
                <FAQCard
                  key={f.id}
                  faq={f}
                  isOpen={openId === f.id}
                  onToggle={() => toggleOpen(f.id)}
                  highlighted
                />
              ))}
            </div>
          </div>
        )}

        {/* Regular FAQs */}
        {regularFaqs.length > 0 && (
          <div className="max-w-3xl mx-auto">
            {featuredFaqs.length > 0 && (
              <div className="flex items-center gap-2 mb-3 mt-2">
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  More Questions
                </p>
              </div>
            )}
            <div className="grid gap-3">
              {regularFaqs.map((f) => (
                <FAQCard
                  key={f.id}
                  faq={f}
                  isOpen={openId === f.id}
                  onToggle={() => toggleOpen(f.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Support CTA */}
        <div className="max-w-3xl mx-auto mt-12">
          <Card className="bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 border-primary/20 overflow-hidden">
            <CardContent className="p-8 text-center">
              <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-primary/15 mb-4">
                <MessageCircle className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Still have questions?</h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
                Our support team is here to help. Reach out and we'll respond
                within a few hours.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/contact" className={buttonVariants()}>
                  <Mail className="h-4 w-4 mr-2" />
                  Contact Support
                </Link>
                <a
                  href="tel:+8801712345678"
                  className={buttonVariants({ variant: 'outline' })}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call Now
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

// ─── Single FAQ Card ───────────────────────────────
function FAQCard({
  faq,
  isOpen,
  onToggle,
  highlighted,
}: {
  faq: FAQ;
  isOpen: boolean;
  onToggle: () => void;
  highlighted?: boolean;
}) {
  return (
    <Card
      className={`overflow-hidden transition-all duration-200 ${
        isOpen
          ? 'border-primary/40 shadow-md'
          : highlighted
          ? 'border-primary/20 bg-primary/[0.02] hover:border-primary/40'
          : 'hover:border-primary/30'
      }`}
    >
      <button
        onClick={onToggle}
        className="w-full text-left p-5 flex items-start justify-between gap-4 hover:bg-muted/30 transition-colors"
        aria-expanded={isOpen}
      >
        <div className="flex items-start gap-3 flex-1">
          {highlighted && !isOpen && (
            <Badge
              variant="secondary"
              className="bg-primary/10 text-primary shrink-0 mt-0.5"
            >
              Popular
            </Badge>
          )}
          <span className="font-semibold text-[15px] leading-snug">
            {faq.question}
          </span>
        </div>
        <ChevronDown
          className={`h-5 w-5 text-muted-foreground shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-primary' : ''
          }`}
        />
      </button>

      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen
            ? 'grid-rows-[1fr] opacity-100'
            : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-5 pb-5 pt-0">
            <div className="border-l-2 border-primary/30 pl-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {faq.answer}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}