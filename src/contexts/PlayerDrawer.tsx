import { createContext, useContext, ReactNode, useState, useEffect, useRef, memo } from 'react';
import { Button, useDisclosure } from "@heroui/react";
import Hls from 'hls.js';
import { Icon } from '@/components/Icon';
import clsx from 'clsx';

type MusicProps = {
    id: string;
    duration_ms: string;
    description: string;
    filename_image: string;
    filename_music: string;
}

type PlayProps = {
    volume: number,
    seekingTime: number;
    music: MusicProps
}

interface MusicContextType {
    buffered: number;
    isPlayingMusic: boolean;
    currentTimeMusic: number;
    currentVolumeMusic: number;
    loadingCurrentChunk: boolean;
    currentMusicDrawer: MusicProps;
    seekingTimeMusic: number | null;
    handleVolumeMusic: (volume: number) => void;
    handlePlayMusic: (payloadMusic: PlayProps) => void;
    handleSeekingTimeMusic: (seekingTime: number) => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const PlayerDrawerProvider = memo(({ children }: { children: ReactNode }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [currentMusic, setCurrentMusic] = useState<MusicProps | null>(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [volume, setVolume] = useState(1);
    const [buffered, setBuffered] = useState(0);
     const [isHovered, setIsHovered] = useState(false);
    const [isVolumeDragging, setIsVolumeDragging] = useState(false);
    const [seekingTime, setSeekingTime] = useState<number | null>(null);
    const [isPlaying, setCurrentPlaying] = useState(false);
    const [loadingCurrentChunk, setLoadingCurrentChunk] = useState(false);

    const animationRef = useRef<number>();
    const hlsRef = useRef<Hls | null>(null);
    const audioRef = useRef<HTMLAudioElement>(null);
    const pendingSeek = useRef<number | null>(null);

    const apiDuration = parseInt(currentMusic?.duration_ms || "0") / 1000;
    const displayDuration = apiDuration;

    const sliderRef = useRef<HTMLDivElement>(null);
    const volumeSliderRef = useRef<HTMLDivElement>(null);

    const STREAM_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/stream/media/${currentMusic?.filename_music}`;

    const closeMusicDrawer = () => {
        if (audioRef.current) {
            audioRef.current.pause();
        }
        if (hlsRef.current) {
            hlsRef.current.destroy();
            hlsRef.current = null;
        }
        pendingSeek.current = 0;
        setCurrentTime(0);
        setCurrentMusic(null);
        setCurrentPlaying(false);
        onClose();
    };

    const initializeHLS = () => {
        const audio = audioRef.current;
        if (!audio) return;
        if (hlsRef.current) {
            hlsRef.current.destroy();
            hlsRef.current = null;
        }
        if (Hls.isSupported() && STREAM_BASE_URL.includes('.m3u8')) {
            setLoadingCurrentChunk(true);
            const hls = new Hls();
            hlsRef.current = hls;
            hls.loadSource(STREAM_BASE_URL);
            hls.attachMedia(audio);
            hls.on(Hls.Events.MANIFEST_PARSED, () => audio.play());
            hls.on(Hls.Events.ERROR, (_event, data) => console.error('HLS error:', data));
        } else if (audio.canPlayType('application/vnd.apple.mpegurl')) {
            audio.src = STREAM_BASE_URL;
        }
    };

    const handlePlay = (payloadMusic: PlayProps) => {
        const { music, volume, seekingTime } = payloadMusic;
        setVolume(volume);
        if (!audioRef.current) return;
        const isNewMusic = music?.id !== currentMusic?.id;
        if (isNewMusic) {
            if (hlsRef.current) {
                hlsRef.current.destroy();
                hlsRef.current = null;
            }
            pendingSeek.current = seekingTime ?? 0;
            setCurrentTime(0);
            setCurrentMusic(music);
            if (!isOpen) onOpen();
            return;
        }
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            if (!isOpen) onOpen();
            audioRef.current.play();
        }
    };

    const handlePause = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            if (!isOpen) onOpen();
            audioRef.current.play();
        }
    };

    useEffect(() => {
        const audio = audioRef.current;
        if (audio) {
            const handleTimeUpdate = () => {
                if (!isDragging) {
                    setCurrentTime(audio.currentTime);
                }
                if (Math.abs(audio.currentTime - seekingTime) < 1) {
                    setSeekingTime(null);
                }
                if (audio.buffered.length > 0) {
                    const valueBufferedTimeUpdate = audio.buffered.end(audio.buffered.length - 1);
                    setBuffered(valueBufferedTimeUpdate);
                }
            };
            const handleSeeked = () => {
                setCurrentTime(audio.currentTime);
                setSeekingTime(null);
            };
            const handleEnded = () => {
                setCurrentPlaying(false);
                setCurrentTime(0);
            };
            const handleProgress = () => {
                if (audio.buffered.length > 0) {
                    const valueBufferedProgress = audio.buffered.end(audio.buffered.length - 1);
                    setBuffered(valueBufferedProgress);
                }
            };
            const handleLoadStart = () => {
                setLoadingCurrentChunk(true);
            };
            const handleCanPlay = () => {
                setLoadingCurrentChunk(false);
                if (pendingSeek.current !== null) {
                    audio.currentTime = pendingSeek.current;
                    setCurrentTime(pendingSeek.current);
                    pendingSeek.current = null;
                }
            };
            const handleWaiting = () => {
                setLoadingCurrentChunk(true);
            };
            const handleCanPlayThrough = () => {
                setLoadingCurrentChunk(false);
            };
            const handlePlayEvent = () => {
                setCurrentPlaying(true);
            };
            const handlePauseEvent = () => {
                setCurrentPlaying(false);
            };
            // add
            audio.addEventListener('timeupdate', handleTimeUpdate);
            audio.addEventListener('seeked', handleSeeked);
            audio.addEventListener('ended', handleEnded);
            audio.addEventListener('progress', handleProgress);
            audio.addEventListener('loadstart', handleLoadStart);
            audio.addEventListener('canplay', handleCanPlay);
            audio.addEventListener('waiting', handleWaiting);
            audio.addEventListener('play', handlePlayEvent);
            audio.addEventListener('pause', handlePauseEvent);
            audio.addEventListener('canplaythrough', handleCanPlayThrough);
            return () => {
                audio.removeEventListener('timeupdate', handleTimeUpdate);
                audio.removeEventListener('seeked', handleSeeked);
                audio.removeEventListener('ended', handleEnded);
                audio.removeEventListener('progress', handleProgress);
                audio.removeEventListener('loadstart', handleLoadStart);
                audio.removeEventListener('canplay', handleCanPlay);
                audio.removeEventListener('waiting', handleWaiting);
                audio.removeEventListener('play', handlePlayEvent);
                audio.removeEventListener('pause', handlePauseEvent);
                audio.removeEventListener('canplaythrough', handleCanPlayThrough);
            }
        }
    }, []);

    useEffect(() => {
        const audio = audioRef.current;
        if (audio) {
            audio.volume = volume;
        }
    }, [volume]);

    useEffect(() => {
        const audio = audioRef.current;
        if (audio && seekingTime !== null && isPlaying) {
            audio.currentTime = seekingTime;
            setCurrentTime(seekingTime);
        }
    }, [seekingTime, isPlaying]);

    useEffect(() => {
        const animate = () => {
            if (currentMusic) {
                animationRef.current = requestAnimationFrame(animate);
            }
        };
        if (audioRef.current && currentMusic) {
            initializeHLS();
        }
        if (currentMusic) {
            animate();
        } else if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
        }
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [currentMusic]);

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const IMAGE_URL = `${import.meta.env.VITE_S3_REPOSITORY_PUBLIC}/${currentMusic?.filename_image}`;
    return (
        <MusicContext.Provider value={{
            buffered,
            loadingCurrentChunk,
            isPlayingMusic: isPlaying,
            currentVolumeMusic: volume,
            handlePlayMusic: handlePlay,
            handleVolumeMusic: setVolume,
            seekingTimeMusic: seekingTime,
            currentTimeMusic: currentTime,
            currentMusicDrawer: currentMusic,
            handleSeekingTimeMusic: setSeekingTime
        }}>
            {isOpen && (
                <div
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    className="fixed bottom-0 left-0 right-0 bg-neutral-950/95 rounded-t-xl px-6 py-3 h-28 z-50"
                >
                    <div className="flex flex-row flex-1 items-start gap-4">
                        <div
                            className="w-18 h-18 bg-neutral-700 rounded-lg bg-cover flex items-center justify-center relative"
                            style={{ backgroundImage: `url(${IMAGE_URL})`, backgroundPosition: "50%" }}
                        >
                            {!currentMusic?.filename_image && <Icon name="album" className="text-neutral-600 absolute" style={{ fontSize: 50 }} filled />}
                            <div
                                className={clsx(
                                    {
                                        "bg-neutral-500 cursor-default": loadingCurrentChunk,
                                        "bg-danger-500 hover:bg-danger-300 cursor-pointer": !loadingCurrentChunk,
                                        "opacity-0": !isHovered || isPlaying || !loadingCurrentChunk,
                                        "opacity-100": !isPlaying || isHovered || loadingCurrentChunk
                                    },
                                    "w-12 h-12 flex items-center justify-center shadow-xl",
                                    "rounded-full select-none transition-all duration-300 z-50 absolute"
                                )}
                                onClick={handlePause}
                            >
                                <Icon 
                                    filled
                                    spin={loadingCurrentChunk}
                                    style={{ fontSize: loadingCurrentChunk ? 25 : 30 }}
                                    name={loadingCurrentChunk ? "music_note" : isPlaying ? "pause" : "play_arrow"} 
                                />
                            </div>
                        </div>
                        <div className="flex-1">
                            <div className="flex flex-row items-start justify-between">
                                <div className="text-start">
                                    <h2 className="text-sm font-bold text-white m-0 line-clamp-1">{currentMusic?.description}</h2>
                                    <span className="text-gray-300 text-sm font-semibold">Artista</span>
                                </div>
                                <Button 
                                    size="sm"
                                    isIconOnly
                                    radius="full"
                                    color="default"
                                    variant="light"
                                    onPress={closeMusicDrawer}
                                >
                                    <Icon filled name="close" className="text-neutral-400" style={{ fontSize: 20 }} />
                                </Button>
                            </div>
                            <div className="flex justify-between text-xs text-neutral-400">
                                <span>{formatTime(currentTime)}</span>
                                <span>{formatTime(displayDuration)}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div
                                    ref={sliderRef}
                                    className={clsx("cursor-pointer flex-1 relative select-none py-2")}
                                    onClick={(e) => {
                                        if (!isDragging) {
                                            const rect = e.currentTarget.getBoundingClientRect();
                                            const clickX = e.clientX - rect.left;
                                            const percentage = clickX / rect.width;

                                            const targetTime = percentage * displayDuration;
                                            setSeekingTime(targetTime);
                                        }
                                    }}
                                    onMouseDown={(e) => {
                                        setIsDragging(true);
                                        const handleMouseMove = (e: MouseEvent) => {
                                            if (sliderRef.current) {
                                                const rect = sliderRef.current.getBoundingClientRect();
                                                const clickX = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
                                                const percentage = clickX / rect.width;

                                                const targetTime = percentage * displayDuration;
                                                setSeekingTime(targetTime);
                                            }
                                        };
                                        const handleMouseUp = () => {
                                            setIsDragging(false);
                                            document.removeEventListener('mousemove', handleMouseMove);
                                            document.removeEventListener('mouseup', handleMouseUp);
                                        };
                                        document.addEventListener('mousemove', handleMouseMove);
                                        document.addEventListener('mouseup', handleMouseUp);
                                    }}
                                >
                                    <div className="w-full bg-neutral-600 rounded-full h-1 relative">
                                        {/* Buffer preview */}
                                        <div
                                            className="bg-neutral-500 h-1 rounded-full absolute"
                                            style={{
                                                maxWidth: "100%",
                                                width: `${displayDuration ? (buffered / displayDuration) * 100 : 0}%`,
                                                transition: 'width 200ms'
                                            }}
                                        />
                                        {/* Progress bar */}
                                        <div
                                            className={clsx("bg-danger-500 h-1 rounded-full relative")}
                                            style={{
                                                maxWidth: "100%",
                                                width: `${displayDuration ? ((seekingTime ?? currentTime) / displayDuration) * 100 : 0}%`,
                                                transition: isDragging ? 'none' : 'all 100ms'
                                            }}
                                        >
                                            <div
                                                className={clsx("bg-danger-500 cursor-pointer absolute -right-1.5 -top-1 w-3 h-3 rounded-full shadow-lg")}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <Icon filled name={(volume * 100) <= 0 ? "no_sound" : "volume_up"} className="text-neutral-400" style={{ fontSize: 20 }} />
                                <div
                                    ref={volumeSliderRef}
                                    className={clsx("cursor-pointer w-16 relative select-none py-2")}
                                    onClick={(e) => {
                                        if (!isVolumeDragging && volumeSliderRef.current) {
                                            const rect = e.currentTarget.getBoundingClientRect();
                                            const clickX = e.clientX - rect.left;
                                            const newVolume = Math.max(0, Math.min(clickX / rect.width, 1));
                                            setVolume(newVolume);
                                        }
                                    }}
                                    onMouseDown={(e) => {
                                        setIsVolumeDragging(true);
                                        const handleMouseMove = (e: MouseEvent) => {
                                            if (volumeSliderRef.current) {
                                                const rect = volumeSliderRef.current.getBoundingClientRect();
                                                const clickX = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
                                                const newVolume = clickX / rect.width;
                                                setVolume(newVolume);
                                            }
                                        };
                                        const handleMouseUp = () => {
                                            setIsVolumeDragging(false);
                                            document.removeEventListener('mousemove', handleMouseMove);
                                            document.removeEventListener('mouseup', handleMouseUp);
                                        };
                                        document.addEventListener('mousemove', handleMouseMove);
                                        document.addEventListener('mouseup', handleMouseUp);
                                    }}
                                >
                                    <div className="w-full bg-neutral-600 rounded-full h-1 relative">
                                        <div
                                            className={clsx("bg-danger-500 h-1 rounded-full relative")}
                                            style={{
                                                maxWidth: "100%",
                                                width: `${volume * 100}%`,
                                                transition: isVolumeDragging ? 'none' : 'all 100ms'
                                            }}
                                        >
                                            <div className={clsx("bg-danger-500 absolute -right-1.5 -top-1 w-3 h-3 rounded-full shadow-lg")} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <audio ref={audioRef} preload="none" />
            {children}
        </MusicContext.Provider>
    );
});

export const usePlayerDrawerContext = () => {
    const context = useContext(MusicContext);
    if (!context) {
        throw new Error('usePlayerDrawerContext must be used within PlayerDrawerProvider');
    }
    return context;
};