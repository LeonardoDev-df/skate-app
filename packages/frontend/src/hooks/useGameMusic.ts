import { useEffect, useRef, useState } from 'react';

interface GameMusicOptions {
  volume?: number;
  autoPlay?: boolean;
}

export const useGameMusic = (options: GameMusicOptions = {}) => {
  const { volume = 0.3, autoPlay = false } = options;
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  // 🎵 Playlist de músicas de skate
  const tracks = [
    {
      name: "Skate Vibes",
      url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", // Placeholder
      artist: "Game Music"
    },
    {
      name: "Street Session",
      url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", // Placeholder
      artist: "Skate Beats"
    },
    {
      name: "Kickflip Dreams",
      url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", // Placeholder
      artist: "Urban Sounds"
    }
  ];

  useEffect(() => {
    // Criar elemento de áudio
    audioRef.current = new Audio();
    audioRef.current.volume = volume;
    audioRef.current.loop = false;

    // Event listeners
    const audio = audioRef.current;
    
    const handleEnded = () => {
      nextTrack();
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    // Auto play se habilitado
    if (autoPlay) {
      playTrack(0);
    }

    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.pause();
    };
  }, []);

  const playTrack = async (trackIndex: number) => {
    if (!audioRef.current) return;

    try {
      audioRef.current.src = tracks[trackIndex].url;
      setCurrentTrack(trackIndex);
      
      if (!isMuted) {
        await audioRef.current.play();
      }
    } catch (error) {
      console.log('🎵 Erro ao reproduzir música:', error);
    }
  };

  const play = async () => {
    if (!audioRef.current) return;
    
    try {
      if (!isMuted) {
        await audioRef.current.play();
      }
      setIsPlaying(true);
    } catch (error) {
      console.log('🎵 Erro ao reproduzir:', error);
    }
  };

  const pause = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setIsPlaying(false);
  };

  const nextTrack = () => {
    const next = (currentTrack + 1) % tracks.length;
    playTrack(next);
  };

  const previousTrack = () => {
    const prev = currentTrack === 0 ? tracks.length - 1 : currentTrack - 1;
    playTrack(prev);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (!isMuted) {
      pause();
    } else if (isPlaying) {
      play();
    }
  };

  const setVolume = (newVolume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = Math.max(0, Math.min(1, newVolume));
    }
  };

  return {
    isPlaying,
    currentTrack,
    tracks,
    isMuted,
    play,
    pause,
    nextTrack,
    previousTrack,
    toggleMute,
    setVolume,
    playTrack
  };
};