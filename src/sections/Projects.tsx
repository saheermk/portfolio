import { useRef } from 'react';
import { ProjectCard } from '../components/ProjectCard';
import { Parallax } from '../components/Parallax';
import { ScrollReveal } from '../components/ScrollReveal';

import resultaImg from '../assets/projects/resulta.png';
import bookoImg from '../assets/projects/booko.png';
import shareFileImg from '../assets/projects/share-file.png';
import noSleepImg from '../assets/projects/no-sleep.png';

const PROJECTS = [
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
  }
];

export const Projects = () => {
  const gridRef = useRef<HTMLDivElement>(null);

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
            {PROJECTS.map((project, index) => {
              const spanClass = 
                project.aspectRatio === 'wide' ? 'md:col-span-2' : 
                project.aspectRatio === 'tall' ? 'md:row-span-2' : '';
              
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
          </div>
        </Parallax>
      </div>
    </section>
  );
};
