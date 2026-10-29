import { useForm } from '@tanstack/react-form';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { toast } from 'sonner';
import { api } from '../lib/api';
import { setUser } from '../app/store';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
} from '../components/ui/card';

export function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
    },
    onSubmit: async ({ value }) => {
      if (value.password !== value.confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }
      setLoading(true);
      try {
        const { data } = await api.post('/auth/register', {
          name: value.name,
          email: value.email,
          password: value.password,
          phone: value.phone || undefined,
        });
        localStorage.setItem('accessToken', data.data.accessToken);
        dispatch(setUser(data.data.user));
        toast.success('Account created!');
        navigate('/dashboard');
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Registration failed');
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Create Account</CardTitle>
          <CardDescription>Join thousands of happy pet parents</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="space-y-4"
          >
            <form.Field
              name="name"
              validators={{ onChange: ({ value }) => (value.length < 2 ? 'Min 2 characters' : undefined) }}
            >
              {(field) => (
                <div>
                  <Label htmlFor={field.name}>Full Name</Label>
                  <Input
                    id={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                  {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                    <p className="text-sm text-red-500 mt-1">{field.state.meta.errors.join(', ')}</p>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field
              name="email"
              validators={{
                onChange: ({ value }) => (!value.includes('@') ? 'Invalid email' : undefined),
              }}
            >
              {(field) => (
                <div>
                  <Label htmlFor={field.name}>Email</Label>
                  <Input
                    id={field.name}
                    type="email"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                  {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                    <p className="text-sm text-red-500 mt-1">{field.state.meta.errors.join(', ')}</p>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field
              name="phone"
              validators={{
                onChange: ({ value }) =>
                  value && value.length < 8 ? 'Invalid phone' : undefined,
              }}
            >
              {(field) => (
                <div>
                  <Label htmlFor={field.name}>Phone (optional)</Label>
                  <Input
                    id={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                </div>
              )}
            </form.Field>

            <form.Field
              name="password"
              validators={{ onChange: ({ value }) => (value.length < 6 ? 'Min 6 characters' : undefined) }}
            >
              {(field) => (
                <div>
                  <Label htmlFor={field.name}>Password</Label>
                  <Input
                    id={field.name}
                    type="password"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                  {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                    <p className="text-sm text-red-500 mt-1">{field.state.meta.errors.join(', ')}</p>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field
              name="confirmPassword"
              validators={{
                onChange: ({ value }) => (value.length < 6 ? 'Min 6 characters' : undefined),
              }}
            >
              {(field) => (
                <div>
                  <Label htmlFor={field.name}>Confirm Password</Label>
                  <Input
                    id={field.name}
                    type="password"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                </div>
              )}
            </form.Field>

            <form.Subscribe
              selector={(s) => [s.canSubmit, s.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <Button type="submit" className="w-full" disabled={!canSubmit || loading || isSubmitting}>
                  {loading ? 'Creating...' : 'Create Account'}
                </Button>
              )}
            />
          </form>
        </CardContent>
        <CardFooter className="justify-center text-sm">
          Already have an account?
          <Link to="/login" className="ml-1 text-primary hover:underline">Sign in</Link>
        </CardFooter>
      </Card>
    </div>
  );
}