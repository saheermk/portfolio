import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  image?: string;
  image_url?: string;
  stack: string[];
  link: string;
}

interface ProjectDetailProps {
  projectId: string;
  staticProjects: Project[];
}

export const ProjectDetail: React.FC<ProjectDetailProps> = ({ projectId, staticProjects }) => {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. First, search in the static fallbacks
    const staticMatch = staticProjects.find((p) => p.id === projectId);
    if (staticMatch) {
      setProject(staticMatch);
      setLoading(false);
    }

    // 2. Try fetching the latest database projects to see if it's dynamic
    fetch('/api/projects')
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('Failed to fetch projects');
      })
      .then((data: Project[]) => {
        const match = data.find((p) => p.id === projectId);
        if (match) {
          setProject(match);
        }
      })
      .catch((err) => {
        console.log('Using static fallback for project details:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [projectId, staticProjects]);

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    window.history.pushState({}, '', '/');
    window.dispatchEvent(new Event('popstate'));
    
    // Smooth scroll to works section after transition
    setTimeout(() => {
      const worksSection = document.getElementById('projects');
      if (worksSection) {
        worksSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-blackbg flex items-center justify-center font-mono text-xs text-gray-500 uppercase tracking-widest">
        Loading project details...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-blackbg flex flex-col items-center justify-center gap-6 p-6">
        <p className="font-mono text-xs text-accent uppercase tracking-widest">Project Not Found</p>
        <h2 className="font-serif text-3xl text-white">The requested project could not be located.</h2>
        <a
          href="/"
          onClick={handleBack}
          className="font-mono text-xs uppercase tracking-widest border border-white/20 hover:border-accent hover:text-accent px-6 py-3 rounded-full transition-all cursor-pointer"
        >
          Return to Portfolio
        </a>
      </div>
    );
  }

  const imageUrl = project.image || project.image_url;

  return (
    <div className="min-h-screen bg-blackbg text-offwhite pb-24 relative overflow-x-hidden selection:bg-accent selection:text-white">
      {/* Background radial accent glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl pointer-events-none z-0" />

      {/* Main Container */}
      <div className="max-w-4xl mx-auto px-6 pt-32 relative z-10 flex flex-col gap-12">
        {/* Back navigation */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <a
            href="/"
            onClick={handleBack}
            className="group inline-flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <svg
              className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Projects
          </a>
        </motion.div>

        {/* Hero Section */}
        <div className="flex flex-col gap-4">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-mono text-accent text-xs uppercase tracking-widest"
          >
            {project.category}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-serif text-5xl md:text-7xl font-bold leading-tight"
          >
            {project.title}
          </motion.h1>
        </div>

        {/* Main Banner Image */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="w-full aspect-video rounded-3xl overflow-hidden border border-white/10 bg-black/40 relative"
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full relative flex items-center justify-center bg-gradient-to-br from-neutral-950 to-black overflow-hidden">
              {/* Elegant grid lines */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px]" />
              
              {/* Glowing gradient sphere behind */}
              <div className="absolute w-72 h-72 bg-accent/25 rounded-full blur-3xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              
              {/* Stylized Monogram */}
              <span className="font-serif font-black text-9xl text-white/15 uppercase tracking-widest select-none z-10">
                {project.title.slice(0, 2)}
              </span>

              {/* Glowing border/accent line */}
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
            </div>
          )}
        </motion.div>

        {/* Content Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
          {/* Metadata Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="md:col-span-1 flex flex-col gap-8 border-t border-white/5 pt-8"
          >
            <div className="flex flex-col gap-2">
              <span className="font-mono text-[10px] uppercase tracking-wider text-gray-500">Tech Stack</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {project.stack && project.stack.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300 font-mono text-[10px]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {project.link && (
              <div className="flex flex-col gap-2">
                <span className="font-mono text-[10px] uppercase tracking-wider text-gray-500">Live URL</span>
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 text-sm text-accent hover:text-white transition-colors mt-1"
                >
                  Visit Live Website
                  <svg
                    className="w-4 h-4 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            )}
          </motion.div>

          {/* Project Details Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="md:col-span-2 flex flex-col gap-6 border-t border-white/5 pt-8"
          >
            <span className="font-mono text-[10px] uppercase tracking-wider text-gray-500">Overview</span>
            <div className="font-sans text-gray-300 text-lg leading-relaxed whitespace-pre-wrap">
              {project.description}
            </div>

            {project.link && (
              <div className="mt-6">
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex bg-accent hover:bg-orange-600 text-white font-mono text-xs uppercase tracking-widest px-8 py-4 rounded-full transition-colors"
                >
                  Launch Project
                </a>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
