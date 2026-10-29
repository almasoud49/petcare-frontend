import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'sonner';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { api } from '../lib/api';
import { Badge } from '../components/ui/badge';

export function BlogDetail() {
  const { slug } = useParams<{ slug: string }>();
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['blog', slug],
    queryFn: () => api.get(`/blogs/${slug}`).then((r) => r.data.data),
    enabled: !!slug,
  });

  const blogId = data?._id;

  const { data: likes } = useQuery({
    queryKey: ['blog-likes', blogId],
    queryFn: () => api.get(`/blog-interactions/${blogId}/likes`).then((r) => r.data.data),
    enabled: !!blogId,
  });

  const { data: comments } = useQuery({
    queryKey: ['blog-comments', blogId],
    queryFn: () => api.get(`/blog-interactions/${blogId}/comments`).then((r) => r.data.data),
    enabled: !!blogId,
  });

  const [commentText, setCommentText] = useState('');
  const likeMutation = useMutation({
    mutationFn: () => api.post(`/blog-interactions/${blogId}/like`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['blog-likes', blogId] }),
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed'),
  });

  const commentMutation = useMutation({
    mutationFn: () => api.post(`/blog-interactions/${blogId}/comments`, { content: commentText }),
    onSuccess: () => {
      toast.success('Comment added');
      setCommentText('');
      qc.invalidateQueries({ queryKey: ['blog-comments', blogId] });
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed'),
  });

  if (isLoading) return <div className="container mx-auto py-20 text-center">Loading...</div>;
  if (!data) return <div className="container mx-auto py-20 text-center">Not found</div>;

  return (
    <article className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="flex gap-2 mb-4">
        {data.tags?.map((t: string) => <Badge key={t} variant="secondary">{t}</Badge>)}
      </div>
      <h1 className="text-4xl font-bold mb-4">{data.title}</h1>
      <div className="flex items-center gap-3 text-sm text-muted-foreground mb-8">
        <span>By {data.author?.name}</span>
        <span>•</span>
        <span>{new Date(data.createdAt).toLocaleDateString()}</span>
      </div>
      <img src={data.image} alt={data.title} className="rounded-xl w-full mb-8" />
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <p className="text-lg font-medium mb-4">{data.excerpt}</p>
        <p className="whitespace-pre-wrap">{data.content}</p>
      </div>

      <div className="mt-8 flex items-center gap-4">
        <Button variant="outline" onClick={() => likeMutation.mutate()} disabled={likeMutation.isPending}>
          ❤ {likes?.count ?? 0} Like
        </Button>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Comments ({comments?.length || 0})</h2>
        <div className="space-y-3 mb-4">
          {comments?.map((c: any) => (
            <Card key={c._id}>
              <CardContent className="p-4">
                <p className="text-sm font-medium">{c.user?.name}</p>
                <p className="text-sm text-muted-foreground">{c.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="flex gap-2">
          <Textarea value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Write a comment..." />
          <Button onClick={() => commentMutation.mutate()} disabled={!commentText || commentMutation.isPending}>
            Post
          </Button>
        </div>
      </div>
    </article>
  );
}