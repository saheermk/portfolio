import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';


export const Projects: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top center",
        end: "bottom center",
        scrub: true,
      }
    });

    tl.fromTo(textRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1 })
      .to(textRef.current, { opacity: 0, y: -50, duration: 1 }, "+=2");
  }, []);

  return (
    <section id="projects" className="section" ref={containerRef}>
      <div className="section-content" ref={textRef}>
        <h2 className="section-title">Selected Works</h2>
        <p className="section-body">Building scalable architecture for next-gen products.</p>
      </div>
    </section>
  );
};
