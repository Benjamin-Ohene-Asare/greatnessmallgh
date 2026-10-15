import React from "react";

import {
  Pause,
  Play,
  Volume2,
  X,
} from "lucide-react";

import {
  useAudioPlayer,
} from "./AudioPlayerContext";

import "./FloatingAudioPlayer.css";


const FloatingAudioPlayer = () => {
  const {
    currentTrack,
    isPlaying,
    toggleTrack,
    closePlayer,
  } = useAudioPlayer();


  if (!currentTrack) {
    return null;
  }


  return (
    <div
      className="floating-audio-mini"
      aria-label="Background audio player"
    >
      <button
        type="button"
        className="floating-audio-main"
        onClick={() =>
          toggleTrack(currentTrack)
        }
        aria-label={
          isPlaying
            ? "Pause audio"
            : "Play audio"
        }
      >
        {currentTrack.image ? (
          <img
            src={currentTrack.image}
            alt=""
          />
        ) : (
          <Volume2
            size={19}
            strokeWidth={1.9}
          />
        )}

        <span className="floating-audio-status">
          {isPlaying ? (
            <Pause
              size={11}
              strokeWidth={2.3}
            />
          ) : (
            <Play
              size={11}
              strokeWidth={2.3}
              fill="currentColor"
            />
          )}
        </span>
      </button>

      <button
        type="button"
        className="floating-audio-close"
        onClick={closePlayer}
        aria-label="Close audio"
      >
        <X
          size={10}
          strokeWidth={2.2}
        />
      </button>
    </div>
  );
};


export default FloatingAudioPlayer;