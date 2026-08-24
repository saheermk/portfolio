import { useRef, useState, useEffect } from 'react';
import { ProjectCard } from '../components/ProjectCard';
import { Parallax } from '../components/Parallax';
import { ScrollReveal } from '../components/ScrollReveal';

import resultaImg from '../assets/projects/resulta.png';
import bookoImg from '../assets/projects/booko.png';
import shareFileImg from '../assets/projects/share-file.png';
import noSleepImg from '../assets/projects/no-sleep.png';

export const STATIC_PROJECTS = [
  {
    id: 'resulta',
    title: 'Resulta',
    category: 'Web App',
    description: 'A school exam results platform that runs entirely in the browser, no server needed. Students type in their details and get results instantly, powered by Google Sheets as the data source. Hosted on Cloudflare Pages.',
    image: resultaImg,
    stack: ['React 18', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Cloudflare Pages'],
    link: 'https://resulta.pages.dev',
    aspectRatio: 'wide' as const,
  },
  {
    id: 'share-file',
    title: 'Share File',
    category: 'Android / Networking',
    description: 'An Android app that lets you share files over Wi-Fi without needing the internet. Has a clean interface and can dig deep into your file system. Built from scratch in Kotlin.',
    image: shareFileImg,
    stack: ['Kotlin', 'Jetpack Compose', 'Java Sockets'],
    link: 'https://github.com/saheermk/share-file',
    aspectRatio: 'tall' as const,
  },
  {
    id: 'booko',
    title: 'Booko',
    category: 'Web Platform',
    description: 'A book management system for libraries and schools. Keeps track of the catalog, who borrowed what, and user accounts. Built to be simple enough for everyday use.',
    image: bookoImg,
    stack: ['React', 'Django', 'REST API', 'Tailwind CSS', 'PostgreSQL'],
    link: 'https://booko.pages.dev/',
    aspectRatio: 'square' as const,
  },
  {
    id: 'no-sleep',
    title: 'No Sleep',
    category: 'Android App',
    description: 'A small Android app that keeps your screen from going to sleep. That\'s it. Open source, no ads, does one thing well. Built with Kotlin and Jetpack Compose.',
    image: noSleepImg,
    stack: ['Kotlin', 'Jetpack Compose', 'Android', 'Open Source'],
    link: 'https://github.com/saheermk/no-sleep',
    aspectRatio: 'square' as const,
  },
  {
    id: 'agy-cli',
    title: 'Agy CLI',
    category: 'Dev Tools',
    description: 'A command-line tool designed to streamline developer workflows and environment configuration. Open source and built entirely with Node.js and TypeScript.',
    image: noSleepImg,
    stack: ['Node.js', 'TypeScript', 'CLI', 'Commander'],
    link: 'https://github.com/saheermk',
    aspectRatio: 'wide' as const,
  }
];

export const Projects = () => {
  const gridRef = useRef<HTMLDivElement>(null);
  const [projectsList, setProjectsList] = useState<any[]>(STATIC_PROJECTS);
  const [totalCount, setTotalCount] = useState<number>(0);

  useEffect(() => {
    fetch('/api/projects', {
      headers: {
        'X-Limit': '5',
        'X-Offset': '0'
      }
    })
      .then((res) => {
        if (res.ok) {
          const totalHeader = res.headers.get('X-Total-Count');
          if (totalHeader) {
            setTotalCount(parseInt(totalHeader, 10));
          }
          return res.json();
        }
        throw new Error('API fetch failed');
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          // If database has fewer than 5 projects, pad with items from STATIC_PROJECTS to ensure a balanced grid
          if (data.length < 5) {
            const padded = [...data, ...STATIC_PROJECTS.slice(data.length, 5)];
            setProjectsList(padded);
          } else {
            setProjectsList(data.slice(0, 5));
          }
        }
      })
      .catch(() => {
        // Fallback silently to static list
        console.log('Dynamic projects unavailable; using static fallback.');
      });
  }, []);

  return (
    <section id="projects" className="py-24 px-6 md:px-16 lg:px-24 bg-blackbg">
      <div className="max-w-7xl mx-auto">
        <Parallax offset={80} clampInitial>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
            <ScrollReveal direction="left" distance={60}>
              <div className="flex flex-col gap-2">
                <p className="font-mono text-accent text-xs uppercase tracking-widest">Portfolio // Works</p>
                <h2 className="font-black text-6xl md:text-[80px] leading-[70px] font-impact text-offwhite uppercase">
                  SELECTED WORKS
                </h2>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right" distance={60} delay={0.15}>
              <p className="font-sans font-normal text-lg leading-6 text-gray-400 max-w-xs mt-6 md:mt-0">
                Some things I've built from web apps to Android projects.
              </p>
            </ScrollReveal>
          </div>
        </Parallax>
        
        <Parallax offset={120} clampInitial>
          <div 
            ref={gridRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[400px] grid-flow-row-dense relative min-h-[600px]"
          >
            {projectsList.slice(0, 5).map((project, index) => {
              // Hardcode layout spans by index:
              // Index 0: col-span-2 (Wide)
              // Index 1: row-span-2 (Tall)
              // Index 2: col-span-1 (Square)
              // Index 3: col-span-1 (Square)
              // Index 4: col-span-2 (Wide)
              const spanClass = 
                index === 0 ? 'md:col-span-2' : 
                index === 1 ? 'md:row-span-2' : 
                index === 4 ? 'md:col-span-2' : '';
              
              // Alternate direction: even index from left, odd from right
              const direction = index % 2 === 0 ? 'left' : 'right';
                
              return (
                <ScrollReveal
                  key={project.id}
                  direction={direction}
                  distance={50}
                  delay={index * 0.1}
                  duration={0.8}
                  className={`w-full h-full ${spanClass}`}
                >
                  <Parallax offset={index % 2 === 0 ? 30 : 60} className="h-full">
                    <ProjectCard {...project} />
                  </Parallax>
                </ScrollReveal>
              );
            })}

            {/* Custom "See More Projects" card in the 6th slot */}
            <ScrollReveal
              key="see-more"
              direction="right"
              distance={50}
              delay={5 * 0.1}
              duration={0.8}
              className="w-full h-full"
            >
              <Parallax offset={60} className="h-full">
                <a
                  href="/projects"
                  onClick={(e) => {
                    e.preventDefault();
                    window.history.pushState({}, '', '/projects');
                    window.dispatchEvent(new Event('popstate'));
                  }}
                  className="group block relative overflow-hidden rounded-2xl mesh-glow-card card-neon-border h-full p-8 flex flex-col justify-center items-center gap-4 text-center cursor-pointer hover:shadow-[0_0_50px_rgba(255,77,0,0.25)] transition-all duration-700"
                >
                  {/* Glowing grid overlay */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none opacity-40 group-hover:opacity-80 transition-opacity duration-700" />
                  
                  {/* Glowing background shapes */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-accent/10 rounded-full blur-3xl group-hover:bg-accent/20 group-hover:scale-125 transition-all duration-700 pointer-events-none" />

                  {/* Spinning Graphic Ring Container */}
                  <div className="relative w-36 h-36 flex items-center justify-center group-hover:scale-105 transition-transform duration-700">
                    {/* Rotating text ring */}
                    <div className="absolute inset-0 animate-[spin_15s_linear_infinite]">
                      <svg viewBox="0 0 100 100" className="w-full h-full fill-current text-gray-500 group-hover:text-accent transition-colors duration-700">
                        <path id="explorePath" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" fill="none" />
                        <text className="font-mono text-[8px] uppercase tracking-[0.22em] font-semibold">
                          <textPath href="#explorePath" startOffset="0%">
                            • explore all projects • view more 
                          </textPath>
                        </text>
                      </svg>
                    </div>

                    {/* Center glass button with arrow */}
                    <div className="relative z-10 w-16 h-16 rounded-full bg-white/5 backdrop-blur-md flex items-center justify-center border border-white/10 group-hover:border-accent/40 group-hover:bg-accent/10 transition-all duration-700">
                      <svg
                        className="w-6 h-6 text-gray-300 group-hover:text-accent transform group-hover:translate-x-1 transition-all duration-700"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </div>
                  </div>

                  {/* Text label details */}
                  <div className="flex flex-col gap-2 relative z-10">
                    <h3 className="font-serif text-3xl font-black text-white group-hover:text-accent tracking-tight transition-colors duration-500">
                      Explore More
                    </h3>
                    <span className="font-mono text-[9px] text-gray-500 uppercase tracking-widest group-hover:text-gray-300 transition-colors duration-500">
                      {totalCount > 5 ? `Browse All ${totalCount} Projects` : 'Browse Full Gallery'}
                    </span>
                  </div>
                </a>
              </Parallax>
            </ScrollReveal>
          </div>
        </Parallax>
      </div>
    </section>
  );
};
