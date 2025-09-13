import { useEffect, useRef, useState, useCallback } from 'react';

interface GameMusicOptions {
  volume?: number;
  autoPlay?: boolean;
}

export const useGameMusic = (options: GameMusicOptions = {}) => {
  const { volume = 0.3, autoPlay = false } = options;
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  const tracks = [
    {
      name: "Skate Vibes",
      artist: "Game Music"
    },
    {
      name: "Street Session", 
      artist: "Skate Beats"
    },
    {
      name: "Kickflip Dreams",
      artist: "Urban Sounds"
    }
  ];

  // ✅ CORREÇÃO: Cleanup melhorado
  const cleanup = useCallback(() => {
    if (sourceRef.current) {
      try {
        sourceRef.current.stop();
      } catch (e) {
        // Ignore se já parou
      }
      sourceRef.current = null;
    }
    
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      try {
        audioContextRef.current.close();
      } catch (e) {
        // Ignore se já fechado
      }
      audioContextRef.current = null;
    }
  }, []);

  useEffect(() => {
    return cleanup; // Cleanup ao desmontar
  }, [cleanup]);

  const generateMusic = useCallback((trackIndex: number) => {
    if (typeof window === 'undefined') return null;
    
    try {
      // ✅ CORREÇÃO: Limpar contexto anterior
      cleanup();
      
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;
      
      const progressions = [
        [261.63, 329.63, 392.00, 523.25],
        [220.00, 277.18, 329.63, 440.00],
        [196.00, 246.94, 293.66, 392.00]
      ];
      
      const progression = progressions[trackIndex] || progressions[0];
      
      const duration = 30;
      const sampleRate = audioContext.sampleRate;
      const buffer = audioContext.createBuffer(1, duration * sampleRate, sampleRate);
      const data = buffer.getChannelData(0);
      
      for (let i = 0; i < data.length; i++) {
        const time = i / sampleRate;
        const noteIndex = Math.floor(time * 2) % progression.length;
        const frequency = progression[noteIndex];
        
        data[i] = Math.sin(2 * Math.PI * frequency * time) * 0.1 +
                  Math.sin(2 * Math.PI * frequency * 2 * time) * 0.05;
      }
      
      const source = audioContext.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      
      const gainNode = audioContext.createGain();
      gainNode.gain.value = isMuted ? 0 : volume;
      
      source.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      sourceRef.current = source;
      
      return { source, gainNode, audioContext };
    } catch (error) {
      console.log('🎵 Erro ao gerar música:', error);
      return null;
    }
  }, [volume, isMuted, cleanup]);

  const playTrack = async (trackIndex: number) => {
    try {
      setCurrentTrack(trackIndex);
      
      if (!isMuted) {
        const musicData = generateMusic(trackIndex);
        if (musicData && sourceRef.current) {
          sourceRef.current.start();
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
    if (sourceRef.current) {
      try {
        sourceRef.current.stop();
      } catch (e) {
        // Ignore se já parou
      }
      sourceRef.current = null;
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
    // Implementar se necessário
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