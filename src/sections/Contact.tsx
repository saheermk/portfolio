import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';


export const Contact: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    gsap.fromTo(textRef.current, { opacity: 0, y: 50 }, {
      opacity: 1, 
      y: 0,
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top center",
        end: "center center",
        scrub: true,
      }
    });
  }, []);

  return (
    <section id="contact" className="section" ref={containerRef}>
      <div className="section-content" ref={textRef}>
        <h2 className="section-title">Let's Connect</h2>
        <div className="contact-links">
          <a href="mailto:mail.saheermk@gmail.com" className="contact-link">Email</a>
          <span className="dot">•</span>
          <a href="https://in.linkedin.com/in/saheermk" target="_blank" rel="noreferrer" className="contact-link">LinkedIn</a>
          <span className="dot">•</span>
          <a href="https://github.com/saheermk/" target="_blank" rel="noreferrer" className="contact-link">GitHub</a>
        </div>
      </div>
    </section>
  );
};
