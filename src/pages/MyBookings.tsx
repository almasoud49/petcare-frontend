import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { api } from '../lib/api';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { buttonVariants } from '../components/ui/button';

export function MyBookings() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['my-bookings'],
    queryFn: () => api.get('/bookings/mine').then((r) => r.data.data),
  });

  const cancelBooking = useMutation({
    mutationFn: (id: string) => api.patch(`/bookings/${id}/cancel`),
    onSuccess: () => {
      toast.success('Booking cancelled');
      qc.invalidateQueries({ queryKey: ['my-bookings'] });
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed'),
  });

  if (isLoading) return <div className="container mx-auto py-20 text-center">Loading...</div>;

  const statusColor: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Bookings</h1>
          <p className="text-muted-foreground">Track your service appointments</p>
        </div>
        <Link to="/services" className={buttonVariants()}>Book New Service</Link>
      </div>

      {data?.length === 0 ? (
        <Card><CardContent className="text-center py-16">
          <p className="text-muted-foreground mb-4">No bookings yet</p>
          <Link to="/services" className={buttonVariants()}>Browse Services</Link>
        </CardContent></Card>
      ) : (
        <div className="space-y-4">
          {data?.map((b: any) => (
            <Card key={b._id}>
              <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-start">
                <img
                  src={b.service?.image}
                  alt={b.service?.title}
                  className="w-full md:w-32 h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-lg">{b.service?.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Pet: {b.pet?.name} • {new Date(b.date).toLocaleDateString()} at {b.timeSlot}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${statusColor[b.status]}`}>
                      {b.status}
                    </span>
                  </div>
                  <p className="text-lg font-bold mt-2">৳{b.totalPrice}</p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                  <Link to={`/services/${b.service?._id}`} className={buttonVariants({ variant: 'outline', size: 'sm' })}>
                    View Service
                  </Link>
                  {['pending', 'confirmed'].includes(b.status) && (
                    <Button
                      variant="destructive" size="sm"
                      onClick={() => confirm('Cancel this booking?') && cancelBooking.mutate(b._id)}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}