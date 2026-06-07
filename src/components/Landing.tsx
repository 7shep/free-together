import { useEffect } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { isSupabaseConfigured } from '../lib/supabase';
import LocalSetupNotice from './LocalSetupNotice';
import Footer from './layout/Footer';
import Nav from './layout/Nav';
import ClosingCTA from './sections/ClosingCTA';
import Features from './sections/Features';
import Hero from './sections/Hero';
import HowItWorks from './sections/HowItWorks';

/** The marketing landing page — the default view. */
export default function Landing() {
  useScrollReveal();

  useEffect(() => {
    document.title = "Free Together — find the night you're all free";
  }, []);

  return (
    <>
      <Nav />
      <main id="top">
        {!isSupabaseConfigured && <LocalSetupNotice />}
        <Hero />
        <HowItWorks />
        <Features />
        <ClosingCTA />
      </main>
      <Footer />
    </>
  );
}
