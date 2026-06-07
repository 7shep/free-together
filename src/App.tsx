import Footer from './components/layout/Footer';
import Nav from './components/layout/Nav';
import ClosingCTA from './components/sections/ClosingCTA';
import Features from './components/sections/Features';
import Hero from './components/sections/Hero';
import HowItWorks from './components/sections/HowItWorks';
import { useScrollReveal } from './hooks/useScrollReveal';

export default function App() {
  useScrollReveal();

  return (
    <>
      <Nav />
      <main id="top">
        <Hero />
        <HowItWorks />
        <Features />
        <ClosingCTA />
      </main>
      <Footer />
    </>
  );
}
