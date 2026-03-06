import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';


export const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    gsap.to(textRef.current, {
      opacity: 0,
      y: -50,
      scale: 0.95,
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      }
    });
  }, []);

  return (
    <section id="hero" className="section" ref={containerRef}>
      <div className="section-content" ref={textRef}>
        <h1 className="hero-title">Hi, I'm Saheer</h1>
        <p className="hero-subtitle">Creative Developer</p>
      </div>
    </section>
  );
};
