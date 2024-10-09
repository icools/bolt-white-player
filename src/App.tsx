import React, { useState, useEffect, useRef } from 'react';
import SubtitleDisplay from './components/SubtitleDisplay';
import BackgroundSubtitles from './components/BackgroundSubtitles';
import AudioPlayer from './components/AudioPlayer';
import FileUpload from './components/FileUpload';
import { Subtitle } from './types';
import { Maximize2, Minimize2 } from 'lucide-react';

function App() {
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  const [currentSubtitleIndex, setCurrentSubtitleIndex] = useState(0);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const appRef = useRef<HTMLDivElement>(null);

  const handleSubtitleUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const parsedSubtitles = parseSRT(content);
      setSubtitles(parsedSubtitles);
    };
    reader.readAsText(file);
  };

  const handleAudioUpload = (file: File) => {
    setAudioFile(file);
  };

  const parseSRT = (content: string): Subtitle[] => {
    const subtitles = content.split('\n\n').map((block) => {
      const [, timeString, ...textLines] = block.split('\n');
      const [startTime, endTime] = timeString.split(' --> ').map(timeToSeconds);
      return {
        startTime,
        endTime,
        text: textLines.join(' '),
      };
    });
    return subtitles;
  };

  const timeToSeconds = (timeString: string): number => {
    const [time, milliseconds] = timeString.split(',');
    const [hours, minutes, seconds] = time.split(':').map(parseFloat);
    return hours * 3600 + minutes * 60 + seconds + parseFloat(milliseconds) / 1000;
  };

  useEffect(() => {
    if (audioRef.current && subtitles.length > 0) {
      const updateSubtitle = () => {
        const currentTime = audioRef.current!.currentTime;
        const index = subtitles.findIndex(
          (subtitle) => currentTime >= subtitle.startTime && currentTime < subtitle.endTime
        );
        if (index !== -1 && index !== currentSubtitleIndex) {
          setCurrentSubtitleIndex(index);
        }
      };

      audioRef.current.addEventListener('timeupdate', updateSubtitle);
      return () => audioRef.current?.removeEventListener('timeupdate', updateSubtitle);
    }
  }, [subtitles, currentSubtitleIndex]);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      appRef.current?.requestFullscreen();
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  return (
    <div ref={appRef} className="min-h-screen bg-black text-white overflow-hidden relative">
      <div className={`container mx-auto p-4 ${isFullScreen ? 'hidden' : ''}`}>
        <h1 className="text-3xl font-bold mb-4">Laser Projector Subtitle Display</h1>
        <div className="mb-4">
          <FileUpload onFileUpload={handleSubtitleUpload} accept=".srt" label="Upload SRT File" />
          <FileUpload onFileUpload={handleAudioUpload} accept="audio/*" label="Upload Audio File" />
        </div>
        <AudioPlayer audioFile={audioFile} audioRef={audioRef} />
      </div>
      <button
        onClick={toggleFullScreen}
        className="absolute top-4 right-4 z-50 bg-white bg-opacity-20 p-2 rounded-full hover:bg-opacity-30 transition-colors duration-200"
      >
        {isFullScreen ? (
          <Minimize2 className="w-6 h-6 text-white" />
        ) : (
          <Maximize2 className="w-6 h-6 text-white" />
        )}
      </button>
      <SubtitleDisplay
        currentSubtitle={subtitles[currentSubtitleIndex]?.text || ''}
        isFullScreen={isFullScreen}
      />
      <BackgroundSubtitles subtitles={subtitles} currentIndex={currentSubtitleIndex} />
    </div>
  );
}

export default App;