const logos = [
  {
    name: 'bKash',
    src: 'https://download.logo.wine/logo/BKash/BKash-Logo.wine.png',
  },
  {
    name: 'Nagad',
    src: 'https://download.logo.wine/logo/Nagad/Nagad-Logo.wine.png',
  },
  {
    name: 'Visa',
    src: 'https://download.logo.wine/logo/Visa_Inc./Visa_Inc.-Logo.wine.png',
  },
  {
    name: 'Mastercard',
    src: 'https://download.logo.wine/logo/Mastercard/Mastercard-Logo.wine.png',
  },
  {
    name: 'SSLCommerz',
    src: 'https://securepay.sslcommerz.com/public/image/SSLCommerz-Pay-With-logo-All.png',
  },
];

export function PaymentLogos() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6 opacity-70 hover:opacity-100 transition">
      {logos.map((l) => (
        <img
          key={l.name}
          src={l.src}
          alt={l.name}
          className="h-6 md:h-8 object-contain grayscale hover:grayscale-0 transition"
        />
      ))}
    </div>
  );
}