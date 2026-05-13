'use client';
import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSlider from '@/components/sections/HeroSlider';
import TickerTape from '@/components/sections/TickerTape';
import PromoBannerSlider from '@/components/sections/PromoBannerSlider';
import StatsSection from '@/components/sections/StatsSection';
import ProductShowcase from '@/components/sections/ProductShowcase';
import FeaturesSection from '@/components/sections/FeaturesSection';
import PromoSection from '@/components/sections/PromoSection';
import TestimonialSection from '@/components/sections/TestimonialSection';
import NewsSection from '@/components/sections/NewsSection';
import DealerLocator from '@/components/sections/DealerLocator';
import LeadCaptureForm from '@/components/sections/LeadCaptureForm';
import CTABanner from '@/components/sections/CTABanner';
import LoadingScreen from '@/components/ui/LoadingScreen';
import FloatingWhatsApp from '@/components/ui/FloatingWhatsApp';
import QuickActions from '@/components/ui/QuickActions';

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && <LoadingScreen key="loader" />}
      </AnimatePresence>

      {!loading && (
        <>
          <Navbar />
          <main>
            <HeroSlider />
            <PromoBannerSlider />
            <TickerTape />
            <StatsSection />
            <ProductShowcase />
            <FeaturesSection />
            <PromoSection />
            <TestimonialSection />
            <NewsSection />
            <DealerLocator />
            <LeadCaptureForm />
            <CTABanner />
          </main>
          <Footer />
          <FloatingWhatsApp />
          <QuickActions />
        </>
      )}
    </>
  );
}
