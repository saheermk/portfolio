import { motion } from 'framer-motion';

interface ProjectProps {
  title: string;
  category: string;
  description: string;
  image: string;
  stack: string[];
  link: string;
  aspectRatio?: 'square' | 'wide' | 'tall';
}

export const ProjectCard: React.FC<ProjectProps> = ({ 
  title, category, description, image, stack, link
}) => {
  return (
    <motion.a 
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      whileHover="hover"
      initial="initial"
      className={`group block relative overflow-hidden rounded-2xl bg-card border border-white/5 h-full p-6 flex flex-col justify-end`}
    >
      {/* Background Graphic (Maielamin Pill/Oval subtle framing on hover) */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          variants={{
            hover: { opacity: 1, scale: 1.2 },
            initial: { opacity: 0, scale: 0.8 }
          }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[120%] bg-accent/20 rounded-[100%] blur-3xl pointer-events-none" 
        />
      </div>
      
      {/* Image Container with Maielamin pill frame style */}
      <motion.div 
        variants={{
          hover: { scale: 0.96 },
          initial: { scale: 1 }
        }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-6 left-6 right-6 bottom-40 rounded-[2rem] overflow-hidden bg-black/50 z-10"
      >
         <motion.img 
            src={image} 
            alt={title}
            variants={{
              hover: { opacity: 1, scale: 1.05 },
              initial: { opacity: 0.6, scale: 1 }
            }}
            className="w-full h-full object-cover transition-all duration-700"
         />
      </motion.div>

      {/* Content - Sticky to bottom */}
      <div className="relative z-20 mt-auto flex flex-col gap-3">
        {/* Toyfight style sticker capsules for tags */}
        <div className="flex flex-wrap gap-2 mb-2">
          {stack.map((tech, i) => (
            <motion.span 
              key={tech} 
              variants={{
                hover: { y: 0, opacity: 1 },
                initial: { y: 10, opacity: 0 }
              }}
              transition={{ delay: i * 0.05 }}
              className="px-3 py-1 rounded-full bg-white text-black font-mono text-[10px] uppercase font-bold tracking-wider"
            >
              {tech}
            </motion.span>
          ))}
        </div>
        
        <div className="flex justify-between items-end">
          <div>
            <span className="text-accent font-mono text-xs uppercase tracking-widest">{category}</span>
            <h3 className="font-serif text-3xl font-semibold mt-1 mb-2">{title}</h3>
          </div>
          <motion.div 
            variants={{
              hover: { backgroundColor: "var(--color-accent)", scale: 1.1 },
              initial: { backgroundColor: "rgba(255,255,255,0.1)", scale: 1 }
            }}
            className="w-10 h-10 rounded-full flex items-center justify-center text-white"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </motion.div>
        </div>
        
        <motion.p 
          variants={{
            hover: { height: "auto", opacity: 1, marginTop: 8 },
            initial: { height: 0, opacity: 0, marginTop: 0 }
          }}
          className="text-gray-400 font-sans text-sm max-w-[90%] overflow-hidden line-clamp-2"
        >
          {description}
        </motion.p>
      </div>
    </motion.a>
  );
};
