import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from '@tanstack/react-form';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { api } from '../lib/api';
import { setUser } from '../app/store';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

export function Profile() {
  const qc = useQueryClient();
  const dispatch = useDispatch();

  const { data: me } = useQuery({
    queryKey: ['me'],
    queryFn: () => api.get('/users/me').then((r) => r.data.data),
  });

  const { data: loyalty } = useQuery({
    queryKey: ['loyalty-me'],
    queryFn: () => api.get('/loyalty/me').then((r) => r.data.data),
  });

  const [redeemPoints, setRedeemPoints] = useState('');
  const redeem = useMutation({
    mutationFn: (points: number) => api.post('/loyalty/redeem', { points }),
    onSuccess: () => {
      toast.success('Points redeemed');
      qc.invalidateQueries({ queryKey: ['loyalty-me'] });
      setRedeemPoints('');
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed'),
  });

  const updateProfile = useMutation({
    mutationFn: (data: any) => api.patch('/users/me', data),
    onSuccess: (res) => {
      toast.success('Profile updated');
      dispatch(setUser({ ...res.data.data, id: res.data.data._id }));
      qc.invalidateQueries({ queryKey: ['me'] });
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed'),
  });

  const changePassword = useMutation({
    mutationFn: (data: any) => api.patch('/users/me/password', data),
    onSuccess: () => toast.success('Password changed'),
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed'),
  });

  const profileForm = useForm({
    defaultValues: { name: '', phone: '', address: '' },
    onSubmit: ({ value }) => updateProfile.mutate(value),
  });

  useEffect(() => {
    if (me) {
      profileForm.setFieldValue('name', me.name || '');
      profileForm.setFieldValue('phone', me.phone || '');
      profileForm.setFieldValue('address', me.address || '');
    }
  }, [me]);

  const pwForm = useForm({
    defaultValues: { currentPassword: '', newPassword: '', confirm: '' },
    onSubmit: ({ value }) => {
      if (value.newPassword !== value.confirm) return toast.error('Passwords do not match');
      changePassword.mutate({
        currentPassword: value.currentPassword,
        newPassword: value.newPassword,
      });
    },
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>

      <Card className="mb-6">
        <CardHeader><CardTitle>Personal Information</CardTitle></CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => { e.preventDefault(); profileForm.handleSubmit(); }}
            className="space-y-4"
          >
            <profileForm.Field name="name">
              {(f) => (
                <div>
                  <Label>Name</Label>
                  <Input value={f.state.value} onChange={(e) => f.handleChange(e.target.value)} />
                </div>
              )}
            </profileForm.Field>
            <div>
              <Label>Email</Label>
              <Input value={me?.email || ''} disabled />
            </div>
            <profileForm.Field name="phone">
              {(f) => (
                <div>
                  <Label>Phone</Label>
                  <Input value={f.state.value} onChange={(e) => f.handleChange(e.target.value)} />
                </div>
              )}
            </profileForm.Field>
            <profileForm.Field name="address">
              {(f) => (
                <div>
                  <Label>Address</Label>
                  <Input value={f.state.value} onChange={(e) => f.handleChange(e.target.value)} />
                </div>
              )}
            </profileForm.Field>
            <Button type="submit" disabled={updateProfile.isPending}>
              {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader><CardTitle>Loyalty Points</CardTitle></CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground">Current Points</p>
              <p className="text-2xl font-bold">{loyalty?.points ?? 0}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Lifetime Spent</p>
              <p className="text-lg font-semibold">৳{loyalty?.totalSpent ?? 0}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Points to redeem"
              value={redeemPoints}
              onChange={(e) => setRedeemPoints(e.target.value)}
            />
            <Button
              onClick={() => redeem.mutate(Number(redeemPoints))}
              disabled={!redeemPoints || redeem.isPending}
            >
              {redeem.isPending ? 'Redeeming...' : 'Redeem'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Change Password</CardTitle></CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => { e.preventDefault(); pwForm.handleSubmit(); }}
            className="space-y-4"
          >
            <pwForm.Field name="currentPassword">
              {(f) => (
                <div>
                  <Label>Current Password</Label>
                  <Input type="password" value={f.state.value} onChange={(e) => f.handleChange(e.target.value)} />
                </div>
              )}
            </pwForm.Field>
            <pwForm.Field name="newPassword">
              {(f) => (
                <div>
                  <Label>New Password</Label>
                  <Input type="password" value={f.state.value} onChange={(e) => f.handleChange(e.target.value)} />
                </div>
              )}
            </pwForm.Field>
            <pwForm.Field name="confirm">
              {(f) => (
                <div>
                  <Label>Confirm New Password</Label>
                  <Input type="password" value={f.state.value} onChange={(e) => f.handleChange(e.target.value)} />
                </div>
              )}
            </pwForm.Field>
            <Button type="submit" disabled={changePassword.isPending}>
              {changePassword.isPending ? 'Changing...' : 'Change Password'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}