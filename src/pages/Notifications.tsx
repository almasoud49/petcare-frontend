import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Bell } from 'lucide-react';
import { toast } from 'sonner';

export function Notifications() {
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => api.get('/notifications').then((r) => r.data.data),
  });

  const markAll = useMutation({
    mutationFn: () => api.patch('/notifications/read-all'),
    onSuccess: () => {
      toast.success('All marked as read');
      qc.invalidateQueries({ queryKey: ['notifications'] });
      qc.invalidateQueries({ queryKey: ['notifications-unread'] });
    },
  });

  const markOne = useMutation({
    mutationFn: (id: string) => api.patch(`/notifications/${id}/read`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notifications'] });
      qc.invalidateQueries({ queryKey: ['notifications-unread'] });
    },
  });

  if (isLoading) return <div className="container mx-auto py-20 text-center">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Notifications</h1>
        <Button variant="outline" size="sm" onClick={() => markAll.mutate()}>
          Mark All Read
        </Button>
      </div>

      {data?.length === 0 ? (
        <Card><CardContent className="text-center py-16">
          <Bell className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No notifications yet</p>
        </CardContent></Card>
      ) : (
        <div className="space-y-2">
          {data?.map((n: any) => (
            <Card
              key={n._id}
              className={`cursor-pointer hover:shadow-md transition ${!n.isRead ? 'border-primary bg-primary/5' : ''}`}
              onClick={() => !n.isRead && markOne.mutate(n._id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-full ${!n.isRead ? 'bg-primary/20' : 'bg-muted'}`}>
                    <Bell size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{n.title}</p>
                    <p className="text-sm text-muted-foreground">{n.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(n.createdAt).toLocaleString()}
                    </p>
                  </div>
                  {!n.isRead && <div className="w-2 h-2 rounded-full bg-primary mt-2" />}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}