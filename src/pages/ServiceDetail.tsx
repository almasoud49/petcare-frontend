import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';
import { api } from '../lib/api';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { ServiceCard } from '../components/shared/ServiceCard';
import { Star, MapPin, Clock, Calendar } from 'lucide-react';
import { buttonVariants } from '../components/ui/button';

export function ServiceDetail() {
  const { id } = useParams<{ id: string }>();
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['service', id],
    queryFn: () => api.get(`/services/${id}`).then((r) => r.data.data),
    enabled: !!id,
  });

  const { data: reviews } = useQuery({
    queryKey: ['service-reviews', id],
    queryFn: () => api.get(`/reviews/service/${id}`).then((r) => r.data.data),
    enabled: !!id,
  });

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const addReview = useMutation({
    mutationFn: () => api.post('/reviews', { service: id, rating, comment }),
    onSuccess: () => {
      toast.success('Review added');
      qc.invalidateQueries({ queryKey: ['service-reviews', id] });
      setComment('');
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed'),
  });

  if (isLoading) return <div className="container mx-auto py-20 text-center">Loading...</div>;
  if (!data?.service) return <div className="container mx-auto py-20 text-center">Service not found</div>;

  const { service, related } = data;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="md:col-span-2 aspect-video overflow-hidden rounded-xl">
          <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {service.gallery?.slice(0, 4).map((g: string, i: number) => (
            <div key={i} className="aspect-square overflow-hidden rounded-lg">
              <img src={g} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main */}
        <div className="lg:col-span-2">
          <Badge className="capitalize mb-2">{service.category}</Badge>
          <h1 className="text-3xl font-bold mb-3">{service.title}</h1>
          <div className="flex items-center gap-4 text-sm mb-6">
            <span className="flex items-center gap-1">
              <Star size={16} className="fill-yellow-400 text-yellow-400" />
              {service.rating || 'New'} ({service.reviewCount || 0} reviews)
            </span>
            <span className="flex items-center gap-1 text-muted-foreground">
              <MapPin size={16} /> {service.location}
            </span>
            <span className="flex items-center gap-1 text-muted-foreground">
              <Clock size={16} /> {service.durationMinutes} min
            </span>
          </div>

          <h2 className="text-xl font-semibold mb-3">About This Service</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">{service.description}</p>

          <Separator className="my-6" />

          {/* Reviews */}
          <h2 className="text-xl font-semibold mb-4">
            Reviews ({reviews?.length || 0})
          </h2>
          {reviews?.length === 0 ? (
            <p className="text-muted-foreground">No reviews yet. Be the first!</p>
          ) : (
            <div className="space-y-4">
              {reviews?.slice(0, 5).map((r: any) => (
                <Card key={r._id}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        {r.user?.name?.[0]}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{r.user?.name}</p>
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              size={12}
                              className={i < r.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{r.comment}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Add Review */}
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Write a Review</h3>
            <div className="space-y-2">
              <div>
                <Label>Rating</Label>
                <select className="border rounded px-2 py-1 bg-background" value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                  {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div>
                <Label>Comment</Label>
                <Textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Share your experience..." />
              </div>
              <Button onClick={() => addReview.mutate()} disabled={!comment || addReview.isPending}>
                {addReview.isPending ? 'Submitting...' : 'Submit Review'}
              </Button>
            </div>
          </div>
        </div>

        {/* Sidebar — Booking Card */}
        <div>
          <Card className="sticky top-24">
            <CardContent className="p-6">
              <div className="text-3xl font-bold mb-1">৳{service.price}</div>
              <p className="text-sm text-muted-foreground mb-4">per session</p>
              <Separator className="my-4" />
              <div className="space-y-2 text-sm mb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration</span>
                  <span>{service.durationMinutes} min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Location</span>
                  <span>{service.location}</span>
                </div>
              </div>
              <Link
                to={`/bookings/new?service=${service._id}`}
                className={buttonVariants({ size: 'lg' }) + ' w-full'}
              >
                <Calendar className="mr-2 h-4 w-4" /> Book Now
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Related */}
      {related?.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">You Might Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((s: any) => <ServiceCard key={s._id} service={s} />)}
          </div>
        </div>
      )}
    </div>
  );
}