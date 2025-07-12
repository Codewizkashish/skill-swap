import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import { gsap } from 'gsap';
import '../styles/globals.css';

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  useEffect(() => {
    // Initialize GSAP
    gsap.registerPlugin();
    
    // Animate page entry
    gsap.from('.gsap-fade-in', {
      duration: 0.8,
      opacity: 0,
      ease: 'power2.out',
    });

    gsap.from('.gsap-slide-up', {
      duration: 0.8,
      y: 30,
      opacity: 0,
      ease: 'power2.out',
      stagger: 0.1,
    });
  }, []);

  return (
    <SessionProvider session={session}>
      <div className="min-h-screen bg-dark-900 text-white">
        <Component {...pageProps} />
      </div>
    </SessionProvider>
  );
}