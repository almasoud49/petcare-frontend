import { Mail, MapPin, PawPrint, Phone } from 'lucide-react';

import { Link } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'sonner';
import { api } from '../../lib/api';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { FacebookIcon, InstagramIcon, TwitterIcon } from '../icons/BrandIcons';


export function Footer() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await api.post('/newsletter', { email });
      toast.success('Subscribed to newsletter');
      setEmail('');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Subscription failed');
    } finally {
      setLoading(false);
    }
  };
  return (
    <footer className="border-t bg-muted/30 mt-20">
      <div className="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <Link to="/" className="flex items-center gap-2 font-bold text-xl mb-4">
            <PawPrint className="h-6 w-6 text-primary" /> PetCare
          </Link>
          <p className="text-sm text-muted-foreground">
            Trusted pet care services and products across Bangladesh. Because they deserve the best.
          </p>
          <form onSubmit={subscribe} className="mt-4 flex gap-2">
            <Input placeholder="Your email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
            <Button type="submit" size="sm" disabled={loading}>{loading ? '...' : 'Subscribe'}</Button>
          </form>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Services</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/services?category=grooming" className="hover:text-primary">Grooming</Link></li>
            <li><Link to="/services?category=vet" className="hover:text-primary">Veterinary</Link></li>
            <li><Link to="/services?category=boarding" className="hover:text-primary">Boarding</Link></li>
            <li><Link to="/services?category=training" className="hover:text-primary">Training</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Company</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about" className="hover:text-primary">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
            <li><Link to="/blog" className="hover:text-primary">Blog</Link></li>
            <li><Link to="/faq" className="hover:text-primary">FAQ</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Contact</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2"><Phone size={16} /> +880 1712 345678</li>
            <li className="flex items-center gap-2"><Mail size={16} /> hello@petcare.com</li>
            <li className="flex items-center gap-2"><MapPin size={16} /> Dhaka, Bangladesh</li>
          </ul>
          <div className="flex gap-3 mt-4">
          <a href="#" className="hover:text-primary" aria-label="Facebook"><FacebookIcon size={18} /></a>
          <a href="#" className="hover:text-primary" aria-label="Instagram"><InstagramIcon size={18} /></a>
          <a href="#" className="hover:text-primary" aria-label="Twitter"><TwitterIcon size={18} /></a>
        </div>
        </div>
      </div>
      <div className="border-t py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} PetCare. All rights reserved.
      </div>
    </footer>
  );
}