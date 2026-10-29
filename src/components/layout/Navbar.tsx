import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import type { RootState } from '../../app/store';
import { Button, buttonVariants } from '../../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { ModeToggle } from './ModeToggle';
import { useLogout } from '../../hooks/useLogout';
import { PawPrint, Menu, X, ChevronRight } from 'lucide-react';

type NavItem = { label: string; to?: string; children?: NavItem[] };

function NestedSubmenu({ item }: { item: NavItem }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <div className="flex items-center justify-between gap-2 px-3 py-2 text-sm hover:bg-muted cursor-default">
        <span>{item.label}</span>
        <ChevronRight className="h-4 w-4" />
      </div>
      {open && item.children && (
        <div className="absolute top-0 left-full ml-1 min-w-[180px] rounded-md border bg-background shadow-lg z-50 py-1">
          {item.children.map((child) =>
            child.children ? (
              <NestedSubmenu key={child.label} item={child} />
            ) : (
              <Link
                key={child.label}
                to={child.to || '/'}
                className="block px-3 py-2 text-sm hover:bg-muted"
              >
                {child.label}
              </Link>
            )
          )}
        </div>
      )}
    </div>
  );
}

function NavDropdown({ item }: { item: NavItem }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className="text-sm font-medium hover:text-primary transition flex items-center gap-1"
      >
        {item.label}
        <ChevronRight className="h-3 w-3 rotate-90" />
      </button>
      {open && item.children && (
        <div className="absolute top-full left-0 mt-1 min-w-[200px] rounded-md border bg-background shadow-lg z-50 py-1">
          {item.children.map((child) =>
            child.children ? (
              <NestedSubmenu key={child.label} item={child} />
            ) : (
              <Link
                key={child.label}
                to={child.to || '/'}
                className="block px-3 py-2 text-sm hover:bg-muted"
              >
                {child.label}
              </Link>
            )
          )}
        </div>
      )}
    </div>
  );
}

export function Navbar() {
  const { user } = useSelector((s: RootState) => s.auth);
  const navigate = useNavigate();
  const handleLogout = useLogout();
  const [mobileOpen, setMobileOpen] = useState(false);

  const publicItems: NavItem[] = [
    { label: 'Home', to: '/' },
    {
      label: 'Services',
      children: [
        { label: 'All Services', to: '/services' },
        { label: 'Emergency Vets', to: '/emergency-vets' },
        { label: 'Service Areas', to: '/areas' },
        { label: 'Symptom Checker', to: '/symptom-checker' },
      ],
    },
    {
      label: 'Shop',
      children: [
        { label: 'Products', to: '/products' },
        { label: 'Bundles', to: '/bundles' },
        { label: 'Food Quiz', to: '/quiz' },
        {
          label: 'More Shop',
          children: [
            { label: 'Cart', to: '/cart' },
            { label: 'Wishlist', to: '/wishlist' },
            { label: 'Subscriptions', to: '/subscriptions' },
          ],
        },
      ],
    },
    {
      label: 'Community',
      children: [
        { label: 'Blog', to: '/blog' },
        { label: 'Adoptions', to: '/adoptions' },
        { label: 'Lost & Found', to: '/lost-found' },
        { label: 'Spotlight', to: '/spotlight' },
      ],
    },
    {
      label: 'More',
      children: [
        { label: 'About', to: '/about' },
        { label: 'Contact', to: '/contact' },
        { label: 'FAQ', to: '/faq' },
        { label: 'Return Policy', to: '/return-policy' },
      ],
    },
  ];

  const privateItems: NavItem[] = user
    ? [
        {
          label: 'Account',
          children: [
            { label: 'Dashboard', to: '/dashboard' },
            { label: 'My Pets', to: '/pets' },
            { label: 'Bookings', to: '/bookings' },
            { label: 'Orders', to: '/orders' },
            {
              label: 'More',
              children: [
                { label: 'Reminders', to: '/reminders' },
                { label: 'Refunds', to: '/refunds' },
                ...(user?.role === 'admin' || user?.role === 'manager'
                  ? [{ label: 'Analytics', to: '/admin/analytics' }]
                  : []),
                { label: 'Wishlist', to: '/wishlist' },
                { label: 'Notifications', to: '/notifications' },
                { label: 'Profile', to: '/profile' },
              ],
            },
          ],
        },
      ]
    : [];

  const items = [...publicItems, ...privateItems];

  // Flatten for mobile
  const flatLinks = user
    ? [
        ...publicItems.flatMap((i) => (i.children ? i.children.flatMap((c) => (c.children ? c.children : [c])) : [i])),
        ...privateItems.flatMap((i) => (i.children ? i.children.flatMap((c) => (c.children ? c.children : [c])) : [i])),
      ]
    : publicItems.flatMap((i) => (i.children ? i.children.flatMap((c) => (c.children ? c.children : [c])) : [i]));

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <PawPrint className="h-6 w-6 text-primary" />
          PetCare
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {items.map((item) =>
            item.children ? (
              <NavDropdown key={item.label} item={item} />
            ) : (
              <Link
                key={item.to}
                to={item.to || '/'}
                className="text-sm font-medium hover:text-primary transition"
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        <div className="flex items-center gap-3">
          <ModeToggle />

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <button
                    type="button"
                    className={
                      buttonVariants({ variant: 'ghost', size: 'icon' }) +
                      ' relative h-9 w-9 rounded-full'
                    }
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{user.name?.[0]}</AvatarFallback>
                    </Avatar>
                  </button>
                }
              />
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span>{user.name}</span>
                    <span className="text-xs text-muted-foreground">{user.email}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                nativeButton={false}
                render={<Link to="/login">Login</Link>}
              />
              <Button nativeButton={false} render={<Link to="/register">Sign Up</Link>} />
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t p-4 space-y-2">
          {flatLinks.map((l, idx) => (
            <Link
              key={idx}
              to={l.to || '/'}
              className="block py-2 text-sm"
              onClick={() => setMobileOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          {user && (
            <button
              onClick={handleLogout}
              className="block w-full text-left py-2 text-sm text-red-500"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </header>
  );
}