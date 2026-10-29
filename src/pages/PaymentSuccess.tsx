import { Link } from 'react-router-dom';
import { CheckCircle, Package, ShoppingBag } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export function PaymentSuccess() {
  return (
    <div className="container mx-auto px-4 py-20 max-w-lg">
      <Card className="border-green-200 bg-gradient-to-b from-green-50 to-background dark:from-green-950/20">
        <CardContent className="p-8 text-center">
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-green-100 dark:bg-green-900/40 mb-6">
            <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
          </div>

          <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
          <p className="text-muted-foreground mb-8">
            Your order has been confirmed. You'll receive a notification shortly
            with delivery details.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/orders" className={buttonVariants() + ' gap-2'}>
              <Package className="h-4 w-4" />
              View My Orders
            </Link>
            <Link
              to="/products"
              className={buttonVariants({ variant: 'outline' }) + ' gap-2'}
            >
              <ShoppingBag className="h-4 w-4" />
              Continue Shopping
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}