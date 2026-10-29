import { Link } from 'react-router-dom';
import { Star, MapPin } from 'lucide-react';
import { Card, CardContent, CardFooter } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';


interface Service {
  _id: string; title: string; category: string; description: string;
  price: number; rating: number; location: string; image: string;
}

export function ServiceCard({ service }: { service: Service }) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition flex flex-col h-full">
      <div className="aspect-4/3 overflow-hidden">
        <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
      </div>
      <CardContent className="p-4 flex-1">
        <Badge variant="secondary" className="mb-2 capitalize">{service.category}</Badge>
        <h3 className="font-semibold text-lg line-clamp-1">{service.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{service.description}</p>
        <div className="flex items-center gap-3 mt-3 text-sm">
          <span className="flex items-center gap-1"><Star size={14} className="fill-yellow-400 text-yellow-400" /> {service.rating || 'New'}</span>
          <span className="flex items-center gap-1 text-muted-foreground"><MapPin size={14} /> {service.location}</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <span className="text-xl font-bold">৳{service.price}</span>
        <Button nativeButton={false} size="sm" render={<Link to={`/services/${service._id}`}>View Details</Link>} />
      </CardFooter>
    </Card>
  );
}