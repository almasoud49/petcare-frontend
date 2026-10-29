const mentions = [
  {
    name: 'The Daily Star',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/The_Daily_Star_Logo.svg/320px-The_Daily_Star_Logo.svg.png',
  },
  {
    name: 'Dhaka Tribune',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Dhaka_Tribune_Logo.svg/320px-Dhaka_Tribune_Logo.svg.png',
  },
  {
    name: 'Prothom Alo',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Prothom_Alo_Logo.svg/320px-Prothom_Alo_Logo.svg.png',
  },
  {
    name: 'TechCrunch',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/TechCrunch_logo.svg/320px-TechCrunch_logo.svg.png',
  },
];

export function FeaturedIn() {
  return (
    <section className="py-12 border-y">
      <div className="container mx-auto px-4 text-center">
        <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-6">
          As Featured In
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-60">
          {mentions.map((m) => (
            <img
              key={m.name}
              src={m.logo}
              alt={m.name}
              className="h-6 md:h-8 object-contain grayscale hover:grayscale-0 transition"
            />
          ))}
        </div>
      </div>
    </section>
  );
}