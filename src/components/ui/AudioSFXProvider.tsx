'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { sound } from '@/lib/sound';

interface AudioContextType {
  isMuted: boolean;
  toggleMute: () => void;
  playHover: () => void;
  playClick: () => void;
  playSelect: () => void;
  playOpen: () => void;
  playClose: () => void;
  playTab: () => void;
  playAlert: () => void;
  playDamage: () => void;
  playShield: () => void;
}

const AudioSFXContext = createContext<AudioContextType>({
  isMuted: false,
  toggleMute: () => {},
  playHover: () => {},
  playClick: () => {},
  playSelect: () => {},
  playOpen: () => {},
  playClose: () => {},
  playTab: () => {},
  playAlert: () => {},
  playDamage: () => {},
  playShield: () => {},
});

export function AudioSFXProvider({ children }: { children: React.ReactNode }) {
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    setIsMuted(sound.getMuted());
  }, []);

  const toggleMute = () => {
    const updated = sound.toggleMute();
    setIsMuted(updated);
  };

  return (
    <AudioSFXContext.Provider
      value={{
        isMuted,
        toggleMute,
        playHover: () => sound.play('hover'),
        playClick: () => sound.play('click'),
        playSelect: () => sound.play('select'),
        playOpen: () => sound.play('open'),
        playClose: () => sound.play('close'),
        playTab: () => sound.play('tab'),
        playAlert: () => sound.play('alert'),
        playDamage: () => sound.play('damage'),
        playShield: () => sound.play('shield'),
      }}
    >
      {children}
    </AudioSFXContext.Provider>
  );
}

export const useAudioSFX = () => useContext(AudioSFXContext);
