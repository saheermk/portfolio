import { useEffect, useState } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { About } from './sections/About';
import { Projects, STATIC_PROJECTS } from './sections/Projects';
import { Contact } from './sections/Contact';
import { CursorSpotlight } from './components/CursorSpotlight';
import { Hero } from './sections/Hero';
import { AdminPanel } from './components/AdminPanel';
import { ProjectDetail } from './components/ProjectDetail';
import { AllProjects } from './components/AllProjects';
import { LegalPage } from './components/LegalPage';
import { siteConfig as staticConfig } from './config/site';

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [siteConfig, setSiteConfig] = useState(staticConfig);

  // Client-side routing popstate listener
  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };
    
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const isAdmin = currentPath === '/admin';
  const isAllProjects = currentPath === '/projects';
  const isPrivacy = currentPath === '/privacy';
  const isTerms = currentPath === '/terms';
  const isProjectDetail = currentPath.startsWith('/projects/');
  const projectDetailId = isProjectDetail ? currentPath.replace('/projects/', '') : null;

  // Fetch site configuration dynamically on mount
  useEffect(() => {
    fetch('/api/config')
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('API config request failed');
      })
      .then((data) => {
        if (data && data.name) {
          setSiteConfig(data);
        }
      })
      .catch(() => {
        // Fallback silently to staticConfig
        console.log('Dynamic config unavailable; using static fallback.');
      });
  }, []);

  useEffect(() => {
    // Only initialize smooth scroll for landing page, not sub-views
    if (isAdmin || isProjectDetail || isAllProjects || isPrivacy || isTerms) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, [isAdmin]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const target = document.getElementById(targetId);
    if (!target) return;
    
    const targetY = target.getBoundingClientRect().top + window.scrollY;
    const startY = window.scrollY;
    const distance = targetY - startY;
    let startTime: number | null = null;
    const duration = 1500; // 1.5s cinematic scroll to match everything else

    const animation = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      const ease = progress < 0.5 
        ? 4 * progress * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
        
      window.scrollTo(0, startY + distance * ease);
      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    };
    requestAnimationFrame(animation);
  };

  if (isAdmin) {
    return (
      <div className="bg-blackbg min-h-screen text-offwhite font-sans selection:bg-accent selection:text-white">
        <AdminPanel />
      </div>
    );
  }

  if (isProjectDetail && projectDetailId) {
    return (
      <div className="bg-blackbg min-h-screen text-offwhite font-sans selection:bg-accent selection:text-white">
        <CursorSpotlight />
        <ProjectDetail projectId={projectDetailId} staticProjects={STATIC_PROJECTS} />
      </div>
    );
  }

  if (isAllProjects) {
    return (
      <div className="bg-blackbg min-h-screen text-offwhite font-sans selection:bg-accent selection:text-white">
        <CursorSpotlight />
        <AllProjects />
      </div>
    );
  }

  if (isPrivacy) {
    return (
      <div className="bg-blackbg min-h-screen text-offwhite font-sans selection:bg-accent selection:text-white">
        <CursorSpotlight />
        <LegalPage type="privacy" />
      </div>
    );
  }

  if (isTerms) {
    return (
      <div className="bg-blackbg min-h-screen text-offwhite font-sans selection:bg-accent selection:text-white">
        <CursorSpotlight />
        <LegalPage type="terms" />
      </div>
    );
  }

  return (
    <div className="bg-blackbg min-h-screen text-offwhite font-sans selection:bg-accent selection:text-white overflow-x-hidden">
      <CursorSpotlight />
      {/* Minimalist Navigation */}
      <nav className="fixed top-0 left-0 w-full p-6 md:px-16 lg:px-24 flex justify-between items-center z-80 mix-blend-difference">
        <a href="#hero" onClick={(e) => handleNavClick(e, 'hero')} className="font-display text-2xl tracking-tight uppercase text-offwhite cursor-pointer">
          {siteConfig.shortName}
        </a>
        <div className="hidden md:flex gap-8 font-mono text-xs uppercase tracking-widest">
          <a href="#about" onClick={(e) => handleNavClick(e, 'about')} className="underline-offset-4 decoration-accent hover:underline transition-all cursor-pointer">About</a>
          <a href="#projects" onClick={(e) => handleNavClick(e, 'projects')} className="underline-offset-4 decoration-accent hover:underline transition-all cursor-pointer">Work</a>
          <a href="#contact" onClick={(e) => handleNavClick(e, 'contact')} className="underline-offset-4 decoration-accent hover:underline transition-all cursor-pointer">Contact</a>
        </div>
        <a href={`mailto:${siteConfig.email}`} className="md:hidden font-mono text-xs uppercase tracking-widest border border-white/20 px-4 py-2 rounded-full">
          Email
        </a>
      </nav>

      <main>
        <Hero config={siteConfig} />
        <About config={siteConfig} />
        <Projects />
        <Contact config={siteConfig} />
      </main>
    </div>
  );
}

export default App;
