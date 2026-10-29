import { useMutation } from '@tanstack/react-query';
import { useForm } from '@tanstack/react-form';
import { toast } from 'sonner';
import { api } from '../lib/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent } from '../components/ui/card';
import { Phone, Mail, MapPin } from 'lucide-react';

export function Contact() {
  const send = useMutation({
    mutationFn: (data: any) => api.post('/contacts', data),
    onSuccess: () => {
      toast.success('Message sent! We will respond within 24 hours.');
      form.reset();
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed'),
  });

  const form = useForm({
    defaultValues: { name: '', email: '', subject: '', message: '' },
    onSubmit: ({ value }) => send.mutate(value),
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-2">Contact Us</h1>
        <p className="text-muted-foreground">We would love to hear from you</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <Card><CardContent className="p-6 text-center">
          <Phone className="mx-auto h-8 w-8 text-primary mb-3" />
          <h3 className="font-semibold mb-1">Call Us</h3>
          <p className="text-sm text-muted-foreground">+880 1712 345678</p>
        </CardContent></Card>
        <Card><CardContent className="p-6 text-center">
          <Mail className="mx-auto h-8 w-8 text-primary mb-3" />
          <h3 className="font-semibold mb-1">Email</h3>
          <p className="text-sm text-muted-foreground">hello@petcare.com</p>
        </CardContent></Card>
        <Card><CardContent className="p-6 text-center">
          <MapPin className="mx-auto h-8 w-8 text-primary mb-3" />
          <h3 className="font-semibold mb-1">Visit</h3>
          <p className="text-sm text-muted-foreground">Dhaka, Bangladesh</p>
        </CardContent></Card>
      </div>

      <Card className="max-w-2xl mx-auto mt-12">
        <CardContent className="p-6">
          <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <form.Field name="name">
                {(f) => <div><Label>Name</Label><Input value={f.state.value} onChange={(e) => f.handleChange(e.target.value)} required /></div>}
              </form.Field>
              <form.Field name="email">
                {(f) => <div><Label>Email</Label><Input type="email" value={f.state.value} onChange={(e) => f.handleChange(e.target.value)} required /></div>}
              </form.Field>
            </div>
            <form.Field name="subject">
              {(f) => <div><Label>Subject</Label><Input value={f.state.value} onChange={(e) => f.handleChange(e.target.value)} required /></div>}
            </form.Field>
            <form.Field name="message">
              {(f) => <div><Label>Message</Label><Textarea rows={5} value={f.state.value} onChange={(e) => f.handleChange(e.target.value)} required /></div>}
            </form.Field>
            <Button type="submit" className="w-full" disabled={send.isPending}>
              {send.isPending ? 'Sending...' : 'Send Message'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}