import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "framer-motion";

export const Parallax = ({ 
  children, 
  offset = 50, 
  clampInitial = false,
  className = ""
}: { 
  children: React.ReactNode; 
  offset?: number; 
  clampInitial?: boolean;
  className?: string;
}) => {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [clampInitial ? 0 : offset, -offset]);
  const smoothY = useSpring(y, { damping: 20, stiffness: 80, mass: 0.5 });

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div ref={ref} style={{ y: smoothY }} className={className}>
      {children}
    </motion.div>
  );
};
