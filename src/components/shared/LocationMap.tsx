import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';


interface LocationMapProps {
  address?: string;
  phone?: string;
  email?: string;
  hours?: string;
  mapEmbedUrl?: string;
}

export function LocationMap({
  address = 'House 12, Road 5, Gulshan-1, Dhaka 1212, Bangladesh',
  phone = '+8801712345678',
  email = 'hello@petcare.com',
  hours = 'Sat–Thu: 9:00 AM – 9:00 PM',
  mapEmbedUrl,
}: LocationMapProps) {
  const defaultMap =
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3650.1046!2d90.4103!3d23.7937!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c7a3c1b1b1b1%3A0x0!2sGulshan%201%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v1234567890';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-1">
        <CardContent className="p-6 space-y-5">
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-sm mb-1">Address</p>
              <p className="text-sm text-muted-foreground">{address}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Phone className="h-5 w-5 text-primary mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-sm mb-1">Phone</p>
              <a href={`tel:${phone}`} className="text-sm text-muted-foreground hover:underline">{phone}</a>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Mail className="h-5 w-5 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-sm mb-1">Email</p>
              <a href={`mailto:${email}`} className="text-sm text-muted-foreground hover:text-primary">
                {email}
              </a>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-sm mb-1">Hours</p>
              <p className="text-sm text-muted-foreground">{hours}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2 overflow-hidden">
        <div className="aspect-video w-full">
          <iframe
            src={mapEmbedUrl || defaultMap}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="PetCare Location"
          />
        </div>
      </Card>
    </div>
  );
}