import { useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { toast } from 'sonner';
import { api } from '../lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { AlertCircle, Stethoscope } from 'lucide-react';

export function SymptomChecker() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    defaultValues: { species: 'dog', symptoms: '', age: '', notes: '' },
    onSubmit: async ({ value }) => {
      setLoading(true);
      setResult(null);
      try {
        const { data } = await api.post('/symptom-checker/check', {
          species: value.species,
          symptoms: value.symptoms,
          age: value.age,
          notes: value.notes,
        });
        setResult(data.data);
      } catch (e: any) {
        toast.error(e.response?.data?.message || 'Failed to analyze symptoms');
      } finally {
        setLoading(false);
      }
    },
  });

  const urgencyColor: Record<string, string> = {
    low: 'text-green-600',
    medium: 'text-yellow-600',
    high: 'text-orange-600',
    emergency: 'text-red-600',
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <Stethoscope className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">AI Symptom Checker</h1>
          <p className="text-muted-foreground">Get a preliminary assessment for your pet. Not a substitute for veterinary care.</p>
        </div>
      </div>

      <Card className="mb-8">
        <CardContent className="p-6">
          <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }} className="space-y-4">
            <form.Field name="species">
              {(f) => (
                <div>
                  <Label>Species</Label>
                  <select
                    className="w-full border rounded px-3 py-2 bg-background"
                    value={f.state.value}
                    onChange={(e) => f.handleChange(e.target.value)}
                  >
                    {['dog', 'cat', 'bird', 'rabbit', 'other'].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              )}
            </form.Field>
            <form.Field name="age">
              {(f) => (
                <div>
                  <Label>Age</Label>
                  <Input value={f.state.value} onChange={(e) => f.handleChange(e.target.value)} placeholder="e.g. 3 years" />
                </div>
              )}
            </form.Field>
            <form.Field name="symptoms">
              {(f) => (
                <div>
                  <Label>Symptoms</Label>
                  <Textarea value={f.state.value} onChange={(e) => f.handleChange(e.target.value)} required placeholder="Describe symptoms..." />
                </div>
              )}
            </form.Field>
            <form.Field name="notes">
              {(f) => (
                <div>
                  <Label>Additional Notes</Label>
                  <Textarea value={f.state.value} onChange={(e) => f.handleChange(e.target.value)} placeholder="Any other details..." />
                </div>
              )}
            </form.Field>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Analyzing...' : 'Analyze Symptoms'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle className={urgencyColor[result.urgency] || ''}>
              Urgency: {result.urgency || 'unknown'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {result.possibleCauses?.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Possible Causes</h3>
                <ul className="space-y-2">
                  {result.possibleCauses.map((c: any, i: number) => (
                    <li key={i} className="border rounded p-3">
                      <div className="flex justify-between">
                        <span className="font-medium">{c.name}</span>
                        <span className="text-sm text-muted-foreground">{c.likelihood}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{c.description}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {result.recommendedActions?.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Recommended Actions</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {result.recommendedActions.map((a: string, i: number) => (
                    <li key={i} className="text-sm">{a}</li>
                  ))}
                </ul>
              </div>
            )}
            {result.vetVisitRecommended && (
              <p className="text-red-600 font-medium flex items-center gap-2">
                <AlertCircle size={16} /> Veterinary visit recommended
              </p>
            )}
            {result.disclaimer && (
              <p className="text-xs text-muted-foreground italic">{result.disclaimer}</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
