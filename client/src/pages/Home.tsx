import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import MusicSection from "@/components/MusicSection";
import GallerySection from "@/components/GallerySection";
import ConnectSection from "@/components/ConnectSection";
import Footer from "@/components/Footer";
import { useEffect } from "react";

const Home = () => {
  // Smooth scrolling for anchor links
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const href = target.closest('a')?.getAttribute('href');
      
      if (href && href.startsWith('#')) {
        e.preventDefault();
        
        const targetId = href;
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          window.scrollTo({
            top: targetElement.getBoundingClientRect().top + window.scrollY - 80, // Accounting for fixed header
            behavior: 'smooth'
          });
          
          // Update URL without scrolling
          window.history.pushState(null, '', href);
        }
      }
    };
    
    document.addEventListener('click', handleAnchorClick);
    
    return () => {
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);

  return (
    <div className="min-h-screen bg-zinc-900 text-white font-inter antialiased flex flex-col">
      <Header />
      <main>
        <HeroSection />
        <AboutSection />
        <MusicSection />
        <GallerySection />
        <ConnectSection />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
