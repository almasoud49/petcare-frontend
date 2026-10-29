import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';
import { api } from '../lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Skeleton } from '../components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Calendar, PawPrint, Users, TrendingUp } from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { Link } from 'react-router-dom';

const COLORS = ['#ff7a00', '#785a42', '#ffb366', '#a88b7a', '#ffd9b3'];

export function Dashboard() {
  const { user } = useSelector((s: RootState) => s.auth);
  const isAdmin = user?.role === 'admin' || user?.role === 'manager';

  const { data: overview, isLoading } = useQuery({
    queryKey: ['dashboard-overview'],
    queryFn: () => api.get('/dashboard/overview').then((r) => r.data.data),
    enabled: isAdmin,
  });

  const { data: charts } = useQuery({
    queryKey: ['dashboard-charts'],
    queryFn: () => api.get('/dashboard/charts').then((r) => r.data.data),
    enabled: isAdmin,
  });

  const { data: myBookings } = useQuery({
    queryKey: ['my-bookings'],
    queryFn: () => api.get('/bookings/mine?limit=5').then((r) => r.data.data),
  });

  if (!isAdmin) {
    // Simple user dashboard
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Welcome, {user?.name}</h1>
        <p className="text-muted-foreground mb-8">Here's your activity overview</p>
        <Card>
          <CardHeader><CardTitle>Recent Bookings</CardTitle></CardHeader>
          <CardContent>
            {myBookings?.length === 0 ? (
              <p className="text-muted-foreground py-8 text-center">No bookings yet. <Link to="/services" className="text-primary">Browse services</Link></p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myBookings?.map((b: any) => (
                    <TableRow key={b._id}>
                      <TableCell>{b.service?.title}</TableCell>
                      <TableCell>{new Date(b.date).toLocaleDateString()}</TableCell>
                      <TableCell><span className="capitalize">{b.status}</span></TableCell>
                      <TableCell>৳{b.totalPrice}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  const statCards = [
    { label: 'Users', value: overview?.totalUsers, icon: Users, color: 'text-blue-500' },
    { label: 'Services', value: overview?.totalServices, icon: PawPrint, color: 'text-orange-500' },
    { label: 'Bookings', value: overview?.totalBookings, icon: Calendar, color: 'text-green-500' },
    { label: 'Revenue', value: overview ? `৳${overview.totalRevenue}` : '—', icon: TrendingUp, color: 'text-purple-500' },
  ];

  const pieData = (charts?.statusBreakdown || []).map((s: any) => ({
    name: s._id,
    value: s.count,
  }));

  const barData = (charts?.bookingsByMonth || []).map((b: any) => ({
    month: `${b._id.month}/${b._id.year}`,
    bookings: b.count,
    revenue: b.revenue,
  }));

  const lineData = barData;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
      <p className="text-muted-foreground mb-8">Welcome back, {user?.name}</p>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((s) => (
          <Card key={s.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-muted-foreground">{s.label}</CardTitle>
              <s.icon className={`h-5 w-5 ${s.color}`} />
            </CardHeader>
            <CardContent>
              {isLoading ? <Skeleton className="h-8 w-20" /> : <div className="text-2xl font-bold">{s.value}</div>}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader><CardTitle>Revenue by Month</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#ff7a00" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Bookings by Month</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="bookings" fill="#785a42" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Booking Status</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                  {pieData.map((_: any, i: number) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Top Services</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {charts?.topServices?.map((s: any) => (
                <div key={s._id} className="flex items-center gap-3">
                  <img src={s.image} alt={s.title} className="w-12 h-12 rounded object-cover" />
                  <div className="flex-1">
                    <p className="font-medium text-sm line-clamp-1">{s.title}</p>
                    <p className="text-xs text-muted-foreground">{s.bookings} bookings</p>
                  </div>
                  <span className="text-sm font-bold">৳{s.price}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}