import { useForm } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Send } from 'lucide-react';

export function NewsletterSignup() {
  const subscribe = useMutation({
    mutationFn: (data: { email: string; name?: string }) =>
      api.post('/newsletter', data),
    onSuccess: () => {
      toast.success('Subscribed! Check your inbox for updates.');
      form.reset();
    },
    onError: (e: any) =>
      toast.error(e.response?.data?.message || 'Subscription failed'),
  });

  const form = useForm({
    defaultValues: { email: '' },
    onSubmit: ({ value }) => subscribe.mutate({ email: value.email }),
  });

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="flex items-center gap-2 mb-3 justify-center">
        <Mail className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Get Pet Care Tips & Deals</h3>
      </div>
      <p className="text-sm text-muted-foreground text-center mb-4">
        Join 50,000+ pet parents. Weekly tips, exclusive offers, no spam.
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="flex gap-2"
      >
        <form.Field
          name="email"
          validators={{
            onChange: ({ value }) =>
              !value.includes('@') ? 'Invalid email' : undefined,
          }}
        >
          {(field) => (
            <div className="flex-1">
              <Input
                type="email"
                placeholder="Enter your email"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                required
              />
              {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                <p className="text-xs text-red-500 mt-1">
                  {field.state.meta.errors.join(', ')}
                </p>
              )}
            </div>
          )}
        </form.Field>
        <Button type="submit" disabled={subscribe.isPending} className="gap-2">
          <Send className="h-4 w-4" />
          {subscribe.isPending ? '...' : 'Subscribe'}
        </Button>
      </form>
    </div>
  );
}