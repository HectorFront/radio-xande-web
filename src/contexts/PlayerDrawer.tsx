import { createContext, useContext, ReactNode, useState, useRef, MutableRefObject, useEffect } from 'react';
import PlayerDrawer from '@/components/PlayerDrawer';
import { useDisclosure } from "@heroui/react";

type MusicProps = {
    id: string;
    duration_ms: string;
    description: string;
    filename_image: string;
    filename_music: string;
}

interface MusicContextType {
    isOpenPlayerDrawer: boolean;
    currentMusicDrawer: MusicProps;
    changeMusicDrawer: (music: MusicProps) => void;
    onOpenPlayerDrawer: (music: MusicProps) => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const PlayerDrawerProvider = ({ children }: { children: ReactNode }) => {
    const { isOpen, onOpenChange } = useDisclosure();
    const [currentMusic, setCurrentMusic] = useState<MusicProps | null>(null);

    const onOpenPlayerDrawer = (music: MusicProps) => {
        if (music) {
            setCurrentMusic(music);
        }
        onOpenChange();
    };

    const changeMusic = (music: MusicProps) => {
        setCurrentMusic(music);
    }

    return (
        <MusicContext.Provider value={{ 
            onOpenPlayerDrawer,
            isOpenPlayerDrawer: isOpen,
            changeMusicDrawer: changeMusic,
            currentMusicDrawer: currentMusic
        }}>
            {children}
            <PlayerDrawer 
                isOpen={isOpen}
                currentMusic={currentMusic}
                onOpenChange={onOpenChange}
            />
            <div id='portal-memory-audios'/>
        </MusicContext.Provider>
    );
};

export const usePlayerDrawerContext = () => {
    const context = useContext(MusicContext);
    if (!context) {
        throw new Error('usePlayerDrawerContext must be used within PlayerDrawerProvider');
    }
    return context;
};