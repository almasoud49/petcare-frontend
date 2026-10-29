import { Link } from 'react-router-dom';
import { XCircle, RefreshCw, ShoppingCart } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export function PaymentFail() {
  return (
    <div className="container mx-auto px-4 py-20 max-w-lg">
      <Card className="border-red-200 bg-gradient-to-b from-red-50 to-background dark:from-red-950/20">
        <CardContent className="p-8 text-center">
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-red-100 dark:bg-red-900/40 mb-6">
            <XCircle className="h-10 w-10 text-red-600 dark:text-red-400" />
          </div>

          <h1 className="text-2xl font-bold mb-2">Payment Failed</h1>
          <p className="text-muted-foreground mb-8">
            Something went wrong with your payment. Your order is still pending
            — you can try again from the Orders page.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/orders" className={buttonVariants() + ' gap-2'}>
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Link>
            <Link
              to="/cart"
              className={buttonVariants({ variant: 'outline' }) + ' gap-2'}
            >
              <ShoppingCart className="h-4 w-4" />
              Back to Cart
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}