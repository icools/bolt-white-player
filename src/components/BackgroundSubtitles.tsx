import React, { useEffect, useState, useCallback } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Subtitle } from '../types';

interface BackgroundSubtitlesProps {
  subtitles: Subtitle[];
  currentIndex: number;
}

const BackgroundSubtitles: React.FC<BackgroundSubtitlesProps> = ({ subtitles, currentIndex }) => {
  const [backgroundSubtitles, setBackgroundSubtitles] = useState<JSX.Element[]>([]);
  const controls = useAnimation();

  const createBackgroundSubtitles = useCallback(() => {
    const elements = subtitles
      .filter((_, index) => index !== currentIndex)
      .flatMap((subtitle, index) => {
        return Array(3).fill(null).map((_, subIndex) => {
          const x = Math.random() * 100;
          const y = Math.random() * 100;
          const opacity = Math.random() * 0.3 + 0.1;
          const fontSize = Math.random() * 1 + 0.8;

          return (
            <motion.div
              key={`${index}-${subIndex}`}
              initial={{ opacity: 0, x: `${x}vw`, y: `${y}vh` }}
              animate={{
                opacity: [opacity, opacity + 0.1, opacity],
                x: [`${x}vw`, `${x + 2}vw`, `${x}vw`],
                y: [`${y}vh`, `${y + 2}vh`, `${y}vh`],
              }}
              transition={{ 
                duration: Math.random() * 20 + 20,
                repeat: Infinity,
                repeatType: 'reverse'
              }}
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                transform: `translate(${x}vw, ${y}vh)`,
                fontSize: `${fontSize}rem`,
                color: `rgba(255, 255, 255, ${opacity})`,
                textShadow: '0 0 5px rgba(255, 255, 255, 0.3)',
                maxWidth: '30vw',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {subtitle.text}
            </motion.div>
          );
        });
      });
    setBackgroundSubtitles(elements);
  }, [subtitles, currentIndex]);

  useEffect(() => {
    createBackgroundSubtitles();

    const handleResize = () => {
      createBackgroundSubtitles();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [createBackgroundSubtitles]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {backgroundSubtitles}
    </div>
  );
};

export default BackgroundSubtitles;