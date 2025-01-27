import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';

interface AnimatedWrapperProps {
  children: React.ReactNode;
  key: string; // Key to uniquely identify the child for animation
}

const AnimatedWrapper: React.FC<AnimatedWrapperProps> = ({ children, key }) => {
  return (
    <AnimatePresence>
      <motion.div
        key={key}
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 100 }}
        // transition={{ duration: 0.5 }}
        transition={{
          duration: 0.6, 
          ease: [0.42, 0, 0.58, 1], 
        }}
        style={{ willChange: 'transform, opacity' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default AnimatedWrapper;