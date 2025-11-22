import { createContext, useContext, useState, ReactNode } from 'react';

interface MusicContextType {
  currentPlayingId: string | null;
  setCurrentPlaying: (id: string | null) => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider = ({ children }: { children: ReactNode }) => {
  const [currentPlayingId, setCurrentPlayingId] = useState<string | null>(null);

  const setCurrentPlaying = (id: string | null) => {
    setCurrentPlayingId(id);
  };

  return (
    <MusicContext.Provider value={{ currentPlayingId, setCurrentPlaying }}>
      {children}
    </MusicContext.Provider>
  );
};

export const useMusicContext = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusicContext must be used within MusicProvider');
  }
  return context;
};