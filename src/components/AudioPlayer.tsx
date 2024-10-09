import React from 'react';

interface AudioPlayerProps {
  audioFile: File | null;
  audioRef: React.RefObject<HTMLAudioElement>;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioFile, audioRef }) => {
  return (
    <div className="mb-4">
      {audioFile && (
        <audio ref={audioRef} controls className="w-full">
          <source src={URL.createObjectURL(audioFile)} type={audioFile.type} />
          Your browser does not support the audio element.
        </audio>
      )}
    </div>
  );
};

export default AudioPlayer;