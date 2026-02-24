// app/page.tsx

import Hero from '@/components/landing/Hero';
import HowItWorks from '@/components/landing/HowItWorks';
import CTA from '@/components/landing/CTA';
import Footer from '@/components/landing/Footer';

export default function LandingPage() {
  return (
    <main className="relative">
      <Hero />
      <HowItWorks />
      <CTA />
      <Footer />
    </main>
  );
}
