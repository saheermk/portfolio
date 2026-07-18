import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const DownloadCVButton = () => {
  const [status, setStatus] = useState<'idle' | 'downloading' | 'done'>('idle');
  const linkRef = useRef<HTMLAnchorElement>(null);

  const handleClick = () => {
    if (status !== 'idle') return;
    setStatus('downloading');

    // Simulate download progress filling up (1.5s)
    setTimeout(() => {
      setStatus('done');
      
      // Trigger actual download
      if (linkRef.current) {
        linkRef.current.click();
      }

      // Reset back to idle state after showing success checkmark
      setTimeout(() => {
        setStatus('idle');
      }, 2500);
    }, 1500); 
  };

  return (
    <div className="flex items-center h-16 mt-2">
      <motion.button
        layout
        onClick={handleClick}
        disabled={status !== 'idle'}
        initial={false}
        animate={{
          width: status === 'idle' ? 210 : 56, // Shrinks to a perfect circle for downloading/done
          backgroundColor: status === 'done' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(255, 255, 255, 0.05)',
          borderColor: status === 'done' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(255, 255, 255, 0.1)',
        }}
        whileHover={{
          backgroundColor: status === 'idle' ? 'rgba(255, 255, 255, 0.1)' : undefined,
          scale: status === 'idle' ? 1.02 : 1
        }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', bounce: 0, duration: 0.5 }}
        className="relative flex items-center justify-center overflow-hidden rounded-full font-mono uppercase tracking-widest text-xs h-14 border backdrop-blur-md cursor-pointer"
        style={{ originX: 0 }} // Anchor the animation to the left
      >
        <AnimatePresence mode="wait">
          {status === 'idle' && (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.1 } }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="flex items-center gap-3 text-white/90"
              style={{ whiteSpace: 'nowrap' }}
            >
              <span>Download CV</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </motion.div>
          )}

          {status === 'downloading' && (
            <motion.div
              key="downloading"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-center text-white"
            >
              {/* Apple-style circular progress fill */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
                <motion.circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray="62.83" // Circumference: 2 * PI * r (10)
                  initial={{ strokeDashoffset: 62.83 }}
                  animate={{ strokeDashoffset: 0 }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                  style={{ rotate: -90, transformOrigin: 'center' }}
                />
                {/* Stop icon in the middle (like Apple's download) */}
                <rect x="9.5" y="9.5" width="5" height="5" fill="white" rx="1" />
              </svg>
            </motion.div>
          )}

          {status === 'done' && (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="flex items-center justify-center text-green-400"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Hidden download link */}
      <a
        ref={linkRef}
        href="/saheermk-cv.pdf"
        download="SaheerMK-CV.pdf"
        className="hidden"
      />
    </div>
  );
};
