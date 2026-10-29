import { Shield, Truck, BadgeCheck, CreditCard } from 'lucide-react';

interface Badge {
  icon: any;
  label: string;
  sub?: string;
}

const defaultBadges: Badge[] = [
  { icon: Shield, label: 'Certified Vets', sub: 'Licensed DVMs' },
  { icon: Truck, label: 'Same-Day Delivery', sub: 'Inside Dhaka' },
  { icon: BadgeCheck, label: '100% Authentic', sub: 'Verified brands' },
  { icon: CreditCard, label: 'Secure Payments', sub: 'bKash · Nagad · COD' },
];

export function TrustBadges({ badges = defaultBadges }: { badges?: Badge[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {badges.map((b) => (
        <div
          key={b.label}
          className="flex items-center gap-3 p-3 rounded-lg border bg-card"
        >
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <b.icon className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-sm truncate">{b.label}</p>
            {b.sub && (
              <p className="text-xs text-muted-foreground truncate">{b.sub}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}