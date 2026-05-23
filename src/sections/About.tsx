import { Parallax } from '../components/Parallax';
import { ScrollReveal } from '../components/ScrollReveal';

const SKILLS = [
  'React', 'React Native', 'TypeScript', 'Django', 'Python', 'Tailwind CSS',
  'Framer Motion', 'REST APIs', 'PostgreSQL', 'Cloudflare Pages', 'Git / GitHub',
  'Kotlin', 'Jetpack Compose', 'Vite'
];

export const About = () => {
  return (
    <section id="about" className="py-24 px-6 md:px-16 lg:px-24 bg-blackbg relative z-10 border-t border-white/10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16 md:gap-24">
        
        <div className="flex-1">
          <Parallax offset={40} clampInitial>
            {/* Section label */}
            <ScrollReveal delay={0}>
              <div className="flex flex-col gap-2 mb-8">
                <p className="font-mono text-accent text-xs uppercase tracking-widest">About // Me</p>
                <h2 className="font-black text-5xl md:text-[60px] leading-[1.1] font-impact text-offwhite uppercase tracking-tight">
                  I build things <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-orange-400">that actually work.</span>
                </h2>
              </div>
            </ScrollReveal>
            
            {/* Bio paragraphs — each fades up with stagger */}
            <div className="flex flex-col gap-6 text-gray-400 font-sans text-lg leading-relaxed">
              <ScrollReveal delay={0.1}>
                <p>
                  I'm <strong className="text-white font-medium">Saheer MK</strong>, a BCA student and freelance full stack developer from Kerala, India. I've been writing code and building things for the web for a few years now.
                </p>
              </ScrollReveal>
              <ScrollReveal delay={0.2}>
                <p>
                  I mostly work with <strong className="text-white font-medium">React on the frontend, Django on the backend</strong>, TypeScript throughout, and React Native when something needs to be on mobile. I like writing code that's straightforward to maintain and doesn't break when you look at it wrong.
                </p>
              </ScrollReveal>
              <ScrollReveal delay={0.3}>
                <p>
                  When I'm not coding, I'm usually reading about science, tinkering with side projects, or just thinking about how stuff works.
                </p>
              </ScrollReveal>
            </div>
          </Parallax>
        </div>

        <div className="flex-1 flex flex-col gap-12">
          {/* "What I build" — slides in from right */}
          <Parallax offset={60} clampInitial>
            <ScrollReveal direction="right" distance={60}>
              <div className="flex flex-col gap-6">
                <h3 className="font-mono text-white text-lg uppercase tracking-widest border-b border-white/20 pb-4">
                  What I build
                </h3>
                <p className="text-gray-400 leading-relaxed font-sans text-lg">
                  Web apps, APIs, mobile apps, dashboards, landing pages, internal tools, basically if it runs in a browser or on a phone, I've probably built something like it.
                </p>
              </div>
            </ScrollReveal>
          </Parallax>

          {/* "Tools of the trade" — slides in from right */}
          <Parallax offset={80} clampInitial>
            <ScrollReveal direction="right" distance={60} delay={0.1}>
              <div className="flex flex-col gap-6">
                <h3 className="font-mono text-white text-lg uppercase tracking-widest border-b border-white/20 pb-4">
                  Tools of the trade
                </h3>
                <div className="flex flex-wrap gap-3 mt-2">
                  {SKILLS.map((skill, index) => (
                    <ScrollReveal
                      key={skill}
                      delay={index * 0.04}
                      distance={20}
                      duration={0.4}
                    >
                      <div
                        className="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-gray-300 font-mono text-xs tracking-wider hover:border-accent hover:text-accent transition-colors cursor-default"
                      >
                        {skill}
                      </div>
                    </ScrollReveal>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </Parallax>
        </div>

      </div>
    </section>
  );
};
