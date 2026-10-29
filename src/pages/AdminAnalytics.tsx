import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Navigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export function AdminAnalytics() {
  const { user } = useSelector((s: RootState) => s.auth);
  const isAdmin = user?.role === 'admin' || user?.role === 'manager';
  if (!isAdmin) return <Navigate to="/dashboard" replace />;

  const { data, isLoading } = useQuery({
    queryKey: ['analytics-summary'],
    queryFn: () => api.get('/analytics/summary').then((r) => r.data.data),
  });

  if (isLoading) return <div className="container mx-auto py-20 text-center">Loading...</div>;

  const events = data?.events || [];
  const daily = (data?.daily || []).map((d: any) => ({ date: d._id, count: d.count }));

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader><CardTitle>Events</CardTitle></CardHeader>
          <CardContent>
            {events.length === 0 ? (
              <p className="text-muted-foreground">No events</p>
            ) : (
              <ul className="space-y-2">
                {events.map((e: any) => (
                  <li key={e._id} className="flex justify-between text-sm">
                    <span>{e._id}</span>
                    <span className="font-semibold">{e.count}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Daily Activity</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={daily}>
                <XAxis dataKey="date" hide />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#ff7a00" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}