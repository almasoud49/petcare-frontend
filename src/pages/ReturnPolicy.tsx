import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  RefreshCw,
  Clock,
  XCircle,
  CheckCircle,
  ShieldAlert,
  Mail,
} from 'lucide-react';

const policies = [
  {
    icon: Clock,
    title: '7-Day Return Window',
    body:
      'You may return most unopened products within 7 days of delivery for a full refund. Items must be unused and in original packaging.',
  },
  {
    icon: CheckCircle,
    title: 'Eligible Items',
    body:
      'Sealed food, unopened litter, toys in original packaging, and accessories. Prescription items and opened food cannot be returned for health and safety reasons.',
  },
  {
    icon: XCircle,
    title: 'Non-Returnable',
    body:
      'Opened food and treats, used litter, prescription medications, personalized items, and gift cards are non-returnable.',
  },
  {
    icon: ShieldAlert,
    title: 'Damaged or Wrong Item',
    body:
      'If you received a damaged or incorrect product, we will arrange a free return pickup and send a replacement or full refund — no questions asked. Report within 48 hours.',
  },
  {
    icon: RefreshCw,
    title: 'Refund Method',
    body:
      'Refunds are processed within 5–7 business days to your original payment method (bKash, Nagad, card, or COD bank transfer).',
  },
  {
    icon: Mail,
    title: 'How to Request',
    body:
      'Go to Orders → Select Order → Request Refund. Our team reviews within 24 hours and coordinates pickup.',
  },
];

export function ReturnPolicy() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-3">Return & Refund Policy</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          We want you and your pet to be completely happy with every purchase. If something
          isn't right, we'll make it right.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
        {policies.map((p) => (
          <Card key={p.title}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <p.icon className="h-5 w-5 text-primary" />
                {p.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">{p.body}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-muted/50">
        <CardContent className="p-6 text-center">
          <h3 className="font-semibold mb-2">Need help with a return?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Our support team is here to help you 7 days a week.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Button nativeButton={false} render={<Link to="/orders">View My Orders</Link>} />
            <Button variant="outline" nativeButton={false} render={<Link to="/contact">Contact Support</Link>} />
          </div>
        </CardContent>
      </Card>

      <div className="mt-10 text-xs text-muted-foreground text-center">
        Last updated: January 2026 · Questions? Email{' '}
        <a href="mailto:returns@petcare.com" className="underline">
          returns@petcare.com
        </a>
      </div>
    </div>
  );
}