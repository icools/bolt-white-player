import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SubtitleDisplayProps {
  currentSubtitle: string;
  isFullScreen: boolean;
}

const SubtitleDisplay: React.FC<SubtitleDisplayProps> = ({ currentSubtitle, isFullScreen }) => {
  return (
    <div className={`flex justify-center items-center ${isFullScreen ? 'h-screen' : 'h-64'}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSubtitle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className={`text-center ${isFullScreen ? 'text-6xl' : 'text-4xl'} font-bold`}
        >
          {currentSubtitle}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default SubtitleDisplay;