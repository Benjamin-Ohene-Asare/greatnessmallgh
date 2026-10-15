import React, {
  createContext,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

const AudioPlayerContext =
  createContext(null);

export const AudioPlayerProvider = ({
  children,
}) => {
  const audioRef = useRef(null);

  const [currentTrack, setCurrentTrack] =
    useState(null);

  const [isPlaying, setIsPlaying] =
    useState(false);

  const [currentTime, setCurrentTime] =
    useState(0);

  const [duration, setDuration] =
    useState(0);

  const playTrack = async (track) => {
    if (!track?.audio_file) {
      return;
    }

    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    const isSameTrack =
      currentTrack?.id === track.id;

    if (!isSameTrack) {
      setCurrentTrack(track);
      setCurrentTime(0);
      setDuration(0);

      audio.src = track.audio_file;
      audio.load();
    }

    try {
      await audio.play();
      setIsPlaying(true);
    } catch (err) {
      console.error(
        "Audio playback failed:",
        err
      );
    }
  };

  const pauseTrack = () => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    audio.pause();
    setIsPlaying(false);
  };

  const toggleTrack = (track) => {
    const isSameTrack =
      currentTrack?.id === track?.id;

    if (
      isSameTrack &&
      isPlaying
    ) {
      pauseTrack();
      return;
    }

    playTrack(track);
  };

  const seekTo = (value) => {
    const audio = audioRef.current;

    if (
      !audio ||
      !Number.isFinite(value)
    ) {
      return;
    }

    audio.currentTime = value;
    setCurrentTime(value);
  };

  const closePlayer = () => {
    const audio = audioRef.current;

    if (audio) {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
    }

    setCurrentTrack(null);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  };

  const value = useMemo(
    () => ({
      currentTrack,
      isPlaying,
      currentTime,
      duration,
      playTrack,
      pauseTrack,
      toggleTrack,
      seekTo,
      closePlayer,
    }),
    [
      currentTrack,
      isPlaying,
      currentTime,
      duration,
    ]
  );

  return (
    <AudioPlayerContext.Provider
      value={value}
    >
      {children}

      <audio
        ref={audioRef}
        preload="metadata"
        onLoadedMetadata={(event) => {
          const nextDuration =
            event.currentTarget.duration;

          setDuration(
            Number.isFinite(nextDuration)
              ? nextDuration
              : 0
          );
        }}
        onTimeUpdate={(event) => {
          setCurrentTime(
            event.currentTarget.currentTime ||
              0
          );
        }}
        onPlay={() =>
          setIsPlaying(true)
        }
        onPause={() =>
          setIsPlaying(false)
        }
        onEnded={() => {
          setIsPlaying(false);
          setCurrentTime(0);
        }}
      />
    </AudioPlayerContext.Provider>
  );
};

export const useAudioPlayer = () => {
  const context =
    useContext(AudioPlayerContext);

  if (!context) {
    throw new Error(
      "useAudioPlayer must be used inside AudioPlayerProvider."
    );
  }

  return context;
};