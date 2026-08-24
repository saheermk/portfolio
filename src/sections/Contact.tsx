import { motion } from 'framer-motion';
import { Parallax } from '../components/Parallax';
import { ScrollReveal } from '../components/ScrollReveal';

interface ContactProps {
  config: {
    email: string;
    links: {
      github: string;
      linkedin: string;
    };
  };
}

export const Contact = ({ config }: ContactProps) => {
  return (
    <section id="contact" className="pt-24 md:pt-48 pb-8 px-6 md:px-16 lg:px-24 bg-accent relative overflow-hidden z-[100]">
      {/* Animated marquee text background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-10 flex items-center">
        <motion.h2 
          animate={{ x: [0, -1000] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="font-display text-[20vw] leading-none whitespace-nowrap text-black uppercase select-none"
        >
          LET'S TALK LET'S TALK LET'S TALK LET'S TALK LET'S TALK
        </motion.h2>
      </div>

      <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-10 md:gap-12">
        <Parallax offset={80} clampInitial>
          <div className="flex flex-col gap-4 md:gap-6">
            <ScrollReveal direction="left" distance={80} duration={0.9}>
              <motion.h2 
                className="font-display text-5xl sm:text-6xl md:text-8xl lg:text-9xl uppercase tracking-tighter text-offwhite leading-[1.1]"
              >
                Ready to<br />Build?
              </motion.h2>
            </ScrollReveal>
            
            <ScrollReveal delay={0.2} distance={30}>
              <motion.a 
                href={`mailto:${config.email}`} 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block mt-8 px-10 py-5 bg-black text-white font-mono text-sm uppercase tracking-widest rounded-full hover:bg-white hover:text-black transition-colors duration-300 w-fit"
              >
                Start a project
              </motion.a>
            </ScrollReveal>
          </div>
        </Parallax>

        <Parallax offset={40} clampInitial>
          <ScrollReveal direction="right" distance={60} delay={0.15}>
            <motion.div 
              className="flex flex-col gap-4 font-mono text-sm"
            >
              <div className="text-black/70 mb-2 uppercase tracking-widest">Connect</div>
              <a href={config.links.github} target="_blank" rel="noopener noreferrer" className="text-offwhite hover:text-black transition-colors">GitHub</a>
              <a href={config.links.linkedin} target="_blank" rel="noopener noreferrer" className="text-offwhite hover:text-black transition-colors">LinkedIn</a>
              <a href={`mailto:${config.email}`} className="text-offwhite hover:text-black transition-colors">Email</a>
            </motion.div>
          </ScrollReveal>
        </Parallax>
      </div>

      {/* Sub-footer for legal compliance and copyright */}
      <div className="max-w-7xl mx-auto border-t border-offwhite/10 mt-24 md:mt-40 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono text-offwhite/50 relative z-10">
        <div>
          © {new Date().getFullYear()} saheermk. All rights reserved.
        </div>
        <div className="flex gap-6">
          <a
            href="/privacy"
            onClick={(e) => {
              e.preventDefault();
              sessionStorage.setItem('scrollPosition', String(window.scrollY));
              window.history.pushState({}, '', '/privacy');
              window.dispatchEvent(new Event('popstate'));
            }}
            className="hover:text-offwhite transition-colors cursor-pointer"
          >
            Privacy Policy
          </a>
          <a
            href="/terms"
            onClick={(e) => {
              e.preventDefault();
              sessionStorage.setItem('scrollPosition', String(window.scrollY));
              window.history.pushState({}, '', '/terms');
              window.dispatchEvent(new Event('popstate'));
            }}
            className="hover:text-offwhite transition-colors cursor-pointer"
          >
            Terms of Service
          </a>
        </div>
      </div>
    </section>
  );
};
