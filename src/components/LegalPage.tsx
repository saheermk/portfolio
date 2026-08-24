import React from 'react';
import { motion } from 'framer-motion';

interface LegalPageProps {
  type: 'privacy' | 'terms';
}

export const LegalPage: React.FC<LegalPageProps> = ({ type }) => {
  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    window.history.pushState({}, '', '/');
    window.dispatchEvent(new Event('popstate'));

    const saved = sessionStorage.getItem('scrollPosition');
    if (saved) {
      setTimeout(() => {
        window.scrollTo({
          top: parseInt(saved, 10),
          behavior: 'instant'
        });
      }, 50);
    }
  };

  const isPrivacy = type === 'privacy';

  return (
    <div className="min-h-screen bg-blackbg text-offwhite pb-24 relative overflow-x-hidden selection:bg-accent selection:text-white">
      {/* Background circular glowing accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl pointer-events-none z-0" />

      <div className="max-w-3xl mx-auto px-6 pt-32 relative z-10 flex flex-col gap-12">
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
          <span className="font-mono text-accent text-xs uppercase tracking-widest">Legal // Compliance</span>
          <h1 className="font-black text-4xl md:text-6xl font-impact text-offwhite uppercase tracking-tight">
            {isPrivacy ? 'Privacy Policy' : 'Terms of Service'}
          </h1>
          <p className="font-mono text-[10px] text-gray-500 uppercase tracking-widest mt-1">
            Last Updated: August 2026
          </p>
        </div>

        {/* Legal Text Content */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-sans text-gray-300 text-base leading-relaxed flex flex-col gap-8"
        >
          {isPrivacy ? (
            <>
              <section className="flex flex-col gap-3">
                <h2 className="font-mono text-white text-lg uppercase tracking-wider border-b border-white/10 pb-2">
                  1. Information We Collect
                </h2>
                <p>
                  We collect information that you send directly to us via email. This typically includes your name, email address, and any project details you supply.
                </p>
                <p>
                  Additionally, this website may use cookies or browser storage to save your navigation state (such as skipping the intro screen after your first visit). We do not run intrusive ad trackers.
                </p>
              </section>

              <section className="flex flex-col gap-3">
                <h2 className="font-mono text-white text-lg uppercase tracking-wider border-b border-white/10 pb-2">
                  2. How We Use Information
                </h2>
                <p>
                  We use the information provided solely to respond to your freelance project inquiries or direct communications. We do not sell, rent, or distribute your personal details to third parties for marketing purposes.
                </p>
              </section>

              <section className="flex flex-col gap-3">
                <h2 className="font-mono text-white text-lg uppercase tracking-wider border-b border-white/10 pb-2">
                  3. Data Protection & Deletion
                </h2>
                <p>
                  We take reasonable security measures to keep your shared data safe. If you would like us to delete any email records or personal information you previously sent us, please email your request to <a href="mailto:saheeermk@gmail.com" className="text-accent hover:underline">saheeermk@gmail.com</a>.
                </p>
              </section>
            </>
          ) : (
            <>
              <section className="flex flex-col gap-3">
                <h2 className="font-mono text-white text-lg uppercase tracking-wider border-b border-white/10 pb-2">
                  1. Terms of Use
                </h2>
                <p>
                  By accessing this website, you agree to comply with standard internet etiquette and respect the ownership of showcased works.
                </p>
              </section>

              <section className="flex flex-col gap-3">
                <h2 className="font-mono text-white text-lg uppercase tracking-wider border-b border-white/10 pb-2">
                  2. Intellectual Property
                </h2>
                <p>
                  The custom designs, graphics, branding, and text contents on this portfolio site are the intellectual property of Saheer MK. You may not copy, republish, or clone the proprietary visual elements of this website without explicit consent.
                </p>
                <p>
                  Open-source projects linked from this site (such as on GitHub) are subject to their respective open-source licensing agreements.
                </p>
              </section>

              <section className="flex flex-col gap-3">
                <h2 className="font-mono text-white text-lg uppercase tracking-wider border-b border-white/10 pb-2">
                  3. Disclaimer & Jurisdiction
                </h2>
                <p>
                  This site and the project showcases are provided on an "as is" and "as available" basis without any express or implied warranties. Any legal disputes arising out of the use of this website shall be governed by the laws of Kerala, India.
                </p>
              </section>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};
