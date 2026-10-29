import { Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ClickToCallProps {
  phone?: string;
  variant?: 'default' | 'outline' | 'ghost' | 'secondary';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
  showIcon?: boolean;
  label?: string;
}

export function ClickToCall({
  phone = '+8801712345678',
  variant = 'default',
  size = 'default',
  className = '',
  showIcon = true,
  label,
}: ClickToCallProps) {
  return (
    <a
      href={`tel:${phone.replace(/[^+\d]/g, '')}`}
      className={className}
      aria-label={`Call ${phone}`}
    >
      <Button variant={variant} size={size} className="gap-2">
        {showIcon && <Phone className="h-4 w-4" />}
        {label || `Call Now: ${phone}`}
      </Button>
    </a>
  );
}