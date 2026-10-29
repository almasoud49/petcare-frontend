import { Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft, ShoppingCart } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export function PaymentCancel() {
  return (
    <div className="container mx-auto px-4 py-20 max-w-lg">
      <Card className="border-yellow-200 bg-gradient-to-b from-yellow-50 to-background dark:from-yellow-950/20">
        <CardContent className="p-8 text-center">
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-yellow-100 dark:bg-yellow-900/40 mb-6">
            <AlertCircle className="h-10 w-10 text-yellow-600 dark:text-yellow-400" />
          </div>

          <h1 className="text-2xl font-bold mb-2">Payment Cancelled</h1>
          <p className="text-muted-foreground mb-8">
            You cancelled the payment. No amount has been charged. Your order is
            still pending.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/orders" className={buttonVariants() + ' gap-2'}>
              <ArrowLeft className="h-4 w-4" />
              View Orders
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