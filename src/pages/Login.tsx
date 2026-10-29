import { useForm } from '@tanstack/react-form';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { toast } from 'sonner';
import { useState } from 'react';

import { setUser } from '../app/store';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { api } from '../lib/api';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';

export function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    defaultValues: { email: '', password: '' },
    onSubmit: async ({ value }) => {
      setLoading(true);
      try {
        const { data } = await api.post('/auth/login', value);
        localStorage.setItem('accessToken', data.data.accessToken);
        dispatch(setUser(data.data.user));
        toast.success('Welcome back!');
        navigate('/dashboard');
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Login failed');
      } finally {
        setLoading(false);
      }
    },
  });

  const handleDemoLogin = async () => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/demo');
      localStorage.setItem('accessToken', data.data.accessToken);
      dispatch(setUser(data.data.user));
      toast.success('Logged in as demo user');
      navigate('/dashboard');
    } catch {
      toast.error('Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>Sign in to manage your pet care</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit(); }}
            className="space-y-4"
          >
            <form.Field name="email" validators={{ onChange: ({ value }) => !value.includes('@') ? 'Invalid email' : undefined }}>
              {(field) => (
                <div>
                  <Label htmlFor={field.name}>Email</Label>
                  <Input id={field.name} type="email" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} onBlur={field.handleBlur} />
                  {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                    <p className="text-sm text-red-500 mt-1">{field.state.meta.errors.join(', ')}</p>
                  )}
                </div>
              )}
            </form.Field>
            <form.Field name="password" validators={{ onChange: ({ value }) => value.length < 6 ? 'Min 6 characters' : undefined }}>
              {(field) => (
                <div>
                  <Label htmlFor={field.name}>Password</Label>
                  <Input id={field.name} type="password" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} onBlur={field.handleBlur} />
                  {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                    <p className="text-sm text-red-500 mt-1">{field.state.meta.errors.join(', ')}</p>
                  )}
                </div>
              )}
            </form.Field>
            <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting]} children={([canSubmit, isSubmitting]) => (
              <Button type="submit" className="w-full" disabled={!canSubmit || loading || isSubmitting}>
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            )} />
          </form>
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">Or</span></div>
          </div>
          <Button variant="outline" className="w-full" onClick={handleDemoLogin} disabled={loading}>
            Try Demo Account
          </Button>
        </CardContent>
        <CardFooter className="justify-center text-sm">
          Don't have an account? <Link to="/register" className="ml-1 text-primary hover:underline">Sign up</Link>
        </CardFooter>
      </Card>
    </div>
  );
}