import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ProjectCard } from './ProjectCard';
import { STATIC_PROJECTS } from '../sections/Projects';

interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  stack: string[];
  link: string;
}

export const AllProjects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProjects, setTotalProjects] = useState(0);
  const limit = 9;

  useEffect(() => {
    setLoading(true);
    const offset = (currentPage - 1) * limit;

    fetch('/api/projects', {
      headers: {
        'X-Limit': String(limit),
        'X-Offset': String(offset),
      },
    })
      .then((res) => {
        const totalHeader = res.headers.get('X-Total-Count');
        if (totalHeader) {
          setTotalProjects(parseInt(totalHeader, 10));
        } else {
          setTotalProjects(STATIC_PROJECTS.length);
        }

        if (res.ok) return res.json();
        throw new Error('API fetch failed');
      })
      .then((data: Project[]) => {
        if (Array.isArray(data)) {
          setProjects(data);
        }
      })
      .catch((err) => {
        console.log('Using static fallback for paginated projects:', err);
        // Fallback pagination on STATIC_PROJECTS
        const fallbackSlice = STATIC_PROJECTS.slice(offset, offset + limit);
        setProjects(fallbackSlice);
        setTotalProjects(STATIC_PROJECTS.length);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [currentPage]);

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    window.history.pushState({}, '', '/');
    window.dispatchEvent(new Event('popstate'));
    
    // Scroll smoothly to projects section on home page
    setTimeout(() => {
      const worksSection = document.getElementById('projects');
      if (worksSection) {
        worksSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const totalPages = Math.ceil(totalProjects / limit) || 1;

  return (
    <div className="min-h-screen bg-blackbg text-offwhite pb-24 relative overflow-x-hidden selection:bg-accent selection:text-white">
      {/* Background circular glowing accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-6 pt-32 relative z-10 flex flex-col gap-12">
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
            Back to Home
          </a>
        </motion.div>

        {/* Title Header */}
        <div className="flex flex-col gap-2">
          <span className="font-mono text-accent text-xs uppercase tracking-widest">Portfolio // Works</span>
          <h1 className="font-black text-5xl md:text-7xl font-impact text-offwhite uppercase tracking-tight">
            ALL CREATIVE WORKS
          </h1>
        </div>

        {/* Project Grid */}
        <div className="min-h-[500px]">
          {loading ? (
            <div className="h-[400px] flex items-center justify-center font-mono text-xs text-gray-500 uppercase tracking-widest">
              Loading projects...
            </div>
          ) : projects.length === 0 ? (
            <div className="h-[400px] flex items-center justify-center font-mono text-xs text-gray-500 uppercase tracking-widest">
              No projects found.
            </div>
          ) : (
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.05
                  }
                }
              }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[400px]"
            >
              {projects.map((project) => (
                <motion.div
                  key={project.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
                  }}
                  className="w-full h-full"
                >
                  <ProjectCard {...project} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Numeric Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-12 font-mono text-xs">
            {/* Prev Button */}
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-white/10 rounded-full hover:border-accent hover:text-accent disabled:opacity-40 disabled:hover:border-white/10 disabled:hover:text-offwhite transition-colors cursor-pointer"
            >
              Prev
            </button>

            {/* Page Numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-9 h-9 rounded-full border transition-all flex items-center justify-center cursor-pointer ${
                  currentPage === page
                    ? 'border-accent bg-accent text-white font-bold'
                    : 'border-white/10 hover:border-accent hover:text-accent'
                }`}
              >
                {page}
              </button>
            ))}

            {/* Next Button */}
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-white/10 rounded-full hover:border-accent hover:text-accent disabled:opacity-40 disabled:hover:border-white/10 disabled:hover:text-offwhite transition-colors cursor-pointer"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
