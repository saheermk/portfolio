import { motion } from 'framer-motion';
import { Parallax } from '../components/Parallax';
import { ScrollReveal } from '../components/ScrollReveal';
import { siteConfig } from '../config/site';

export const Contact = () => {
  return (
    <section id="contact" className="py-24 md:py-48 px-6 md:px-16 lg:px-24 bg-accent relative overflow-hidden z-[100]">
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
                href={`mailto:${siteConfig.email}`} 
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
              <a href={siteConfig.links.github} target="_blank" rel="noopener noreferrer" className="text-offwhite hover:text-accent transition-colors">GitHub</a>
              <a href={siteConfig.links.linkedin} target="_blank" rel="noopener noreferrer" className="text-offwhite hover:text-accent transition-colors">LinkedIn</a>
              <a href={`mailto:${siteConfig.email}`} className="text-offwhite hover:text-accent transition-colors">Email</a>
            </motion.div>
          </ScrollReveal>
        </Parallax>
      </div>
    </section>
  );
};
