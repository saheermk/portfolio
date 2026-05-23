import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

type Direction = 'up' | 'left' | 'right';

interface ScrollRevealProps {
  children: ReactNode;
  direction?: Direction;
  /** Delay in seconds */
  delay?: number;
  /** Duration in seconds */
  duration?: number;
  /** How far the element travels (px) */
  distance?: number;
  /** How much of the element must be visible to trigger (0-1) */
  threshold?: number;
  className?: string;
}

const getInitial = (direction: Direction, distance: number) => {
  switch (direction) {
    case 'up':
      return { opacity: 0, y: distance };
    case 'left':
      return { opacity: 0, x: -distance };
    case 'right':
      return { opacity: 0, x: distance };
  }
};

const getAnimate = (direction: Direction) => {
  switch (direction) {
    case 'up':
      return { opacity: 1, y: 0 };
    case 'left':
    case 'right':
      return { opacity: 1, x: 0 };
  }
};

export const ScrollReveal = ({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.7,
  distance = 50,
  threshold = 0.15,
  className = '',
}: ScrollRevealProps) => {
  return (
    <motion.div
      initial={getInitial(direction, distance)}
      whileInView={getAnimate(direction)}
      viewport={{ once: false, amount: threshold }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1], // smooth expo-out
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
