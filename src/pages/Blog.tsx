import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Calendar } from 'lucide-react';

export function Blog() {
  const { data, isLoading } = useQuery({
    queryKey: ['blogs'],
    queryFn: () => api.get('/blogs?limit=20').then((r) => r.data.data),
  });

  if (isLoading) return <div className="container mx-auto py-20 text-center">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-2">Pet Care Blog</h1>
      <p className="text-muted-foreground mb-8">Expert tips and stories from pet professionals</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.map((post: any) => (
          <Link key={post._id} to={`/blog/${post.slug}`}>
            <Card className="overflow-hidden h-full hover:shadow-lg transition group">
              <div className="aspect-video overflow-hidden">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition" />
              </div>
              <CardContent className="p-4">
                <div className="flex gap-2 mb-2">
                  {post.tags?.slice(0, 2).map((t: string) => (
                    <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
                  ))}
                </div>
                <h3 className="font-bold text-lg line-clamp-2 mb-2">{post.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-3">
                  <Calendar size={12} />
                  {new Date(post.createdAt).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}