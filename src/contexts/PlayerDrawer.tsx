import { createContext, useContext, ReactNode } from 'react';
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
    onOpenPlayerDrawer: (music: MusicProps) => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const PlayerDrawerProvider = ({ children }: { children: ReactNode }) => {
    const { isOpen, onOpenChange } = useDisclosure();

    const onOpenPlayerDrawer = (music: MusicProps) => {
        onOpenChange();
    };

    return (
        <MusicContext.Provider value={{ isOpenPlayerDrawer: isOpen, onOpenPlayerDrawer }}>
            {children}
            {isOpen && <PlayerDrawer isOpen={isOpen} onOpenChange={onOpenChange} />}
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