import { useEffect, useRef, useState, useCallback } from 'react';

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
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // 🎵 Playlist de músicas de skate (usando Web Audio API para gerar tons)
  const tracks = [
    {
      name: "Skate Vibes",
      artist: "Game Music",
      url: "" // Vamos usar Web Audio API
    },
    {
      name: "Street Session",
      artist: "Skate Beats",
      url: ""
    },
    {
      name: "Kickflip Dreams",
      artist: "Urban Sounds",
      url: ""
    }
  ];

  // Gerar música usando Web Audio API
  const generateMusic = useCallback((trackIndex: number) => {
    if (typeof window === 'undefined') return;
    
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Diferentes progressões para cada track
      const progressions = [
        [261.63, 329.63, 392.00, 523.25], // C, E, G, C
        [220.00, 277.18, 329.63, 440.00], // A, C#, E, A
        [196.00, 246.94, 293.66, 392.00]  // G, B, D, G
      ];
      
      const progression = progressions[trackIndex] || progressions[0];
      
      // Criar um buffer de áudio simples
      const duration = 30; // 30 segundos
      const sampleRate = audioContext.sampleRate;
      const buffer = audioContext.createBuffer(1, duration * sampleRate, sampleRate);
      const data = buffer.getChannelData(0);
      
      // Gerar tons harmônicos
      for (let i = 0; i < data.length; i++) {
        const time = i / sampleRate;
        const noteIndex = Math.floor(time * 2) % progression.length;
        const frequency = progression[noteIndex];
        
        data[i] = Math.sin(2 * Math.PI * frequency * time) * 0.1 +
                  Math.sin(2 * Math.PI * frequency * 2 * time) * 0.05;
      }
      
      // Criar source e conectar
      const source = audioContext.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      
      const gainNode = audioContext.createGain();
      gainNode.gain.value = isMuted ? 0 : volume;
      
      source.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      return { source, gainNode, audioContext };
    } catch (error) {
      console.log('🎵 Erro ao gerar música:', error);
      return null;
    }
  }, [volume, isMuted]);

  const audioContextRef = useRef<any>(null);

  useEffect(() => {
    if (autoPlay) {
      playTrack(0);
    }

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.source?.stop();
        audioContextRef.current.audioContext?.close();
      }
    };
  }, []);

  const playTrack = async (trackIndex: number) => {
    try {
      // Parar música anterior
      if (audioContextRef.current) {
        audioContextRef.current.source?.stop();
        audioContextRef.current.audioContext?.close();
      }

      setCurrentTrack(trackIndex);
      
      if (!isMuted) {
        const musicData = generateMusic(trackIndex);
        if (musicData) {
          audioContextRef.current = musicData;
          musicData.source.start();
          setIsPlaying(true);
        }
      }
    } catch (error) {
      console.log('🎵 Erro ao reproduzir música:', error);
    }
  };

  const play = async () => {
    if (!isMuted) {
      await playTrack(currentTrack);
    }
    setIsPlaying(true);
  };

  const pause = () => {
    if (audioContextRef.current) {
      audioContextRef.current.source?.stop();
    }
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
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    
    if (newMuted) {
      pause();
    } else if (isPlaying) {
      play();
    }
  };

  const setVolume = (newVolume: number) => {
    if (audioContextRef.current?.gainNode) {
      audioContextRef.current.gainNode.gain.value = Math.max(0, Math.min(1, newVolume));
    }
  };

  return {
    isPlaying,
    currentTrack,
    tracks,
    isMuted,
    currentTime,
    duration,
    play,
    pause,
    nextTrack,
    previousTrack,
    toggleMute,
    setVolume,
    playTrack
  };
};