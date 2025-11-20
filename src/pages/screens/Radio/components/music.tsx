import { Icon } from "@/components/Icon";
import { Avatar } from "@heroui/react"
import clsx from "clsx";
import { useState, useRef, useEffect, useMemo } from "react";

interface MusicProps {
    music: {
        id: string;
        description: string;
        filename: string;
    }
}

export const Music = ({ music }: MusicProps) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [volume, setVolume] = useState(1);
    const [isVolumeDragging, setIsVolumeDragging] = useState(false);
    const [buffered, setBuffered] = useState(0);
    const audioRef = useRef<HTMLAudioElement>(null);
    const animationRef = useRef<number>();
    const sliderRef = useRef<HTMLDivElement>(null);
    const volumeSliderRef = useRef<HTMLDivElement>(null);

    const STREAM_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/stream/audio/${music.filename}`;
    
    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };
    
    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };
    
    useEffect(() => {
        const audio = audioRef.current;
        if (audio) {
            audio.volume = volume;
            const handleLoadedMetadata = () => setDuration(audio.duration);
            const handleTimeUpdate = () => {
                setCurrentTime(audio.currentTime);
                if (audio.buffered.length > 0) {
                    setBuffered(audio.buffered.end(audio.buffered.length - 1));
                }
            };
            const handleEnded = () => {
                setIsPlaying(false);
                setCurrentTime(0);
            };
            const handleProgress = () => {
                if (audio.buffered.length > 0) {
                    setBuffered(audio.buffered.end(audio.buffered.length - 1));
                }
            };
            
            audio.addEventListener('loadedmetadata', handleLoadedMetadata);
            audio.addEventListener('timeupdate', handleTimeUpdate);
            audio.addEventListener('ended', handleEnded);
            audio.addEventListener('progress', handleProgress);
            
            return () => {
                audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
                audio.removeEventListener('timeupdate', handleTimeUpdate);
                audio.removeEventListener('ended', handleEnded);
                audio.removeEventListener('progress', handleProgress);
            };
        }
    }, [volume]);
    
    useEffect(() => {
        const animate = () => {
            if (isPlaying) {
                animationRef.current = requestAnimationFrame(animate);
            }
        };
        
        if (isPlaying) {
            animate();
        } else if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
        }
        
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [isPlaying]);
    
    const BeatBars = useMemo(() => {
        const bars = Array.from({ length: 20 }, (_, i) => {
            const height = isPlaying ? 
                Math.sin((currentTime * 10 + i) * 0.5) * 20 + 30 : 
                Math.random() * 10 + 10;
            return (
                <div
                    key={i}
                    className={clsx({ "bg-neutral-500": !STREAM_BASE_URL, "bg-danger-500": STREAM_BASE_URL }, "flex-1 transition-all duration-75")}
                    style={{ height: `${Math.abs(height)}px` }}
                />
            );
        });
        return <div className="flex items-end gap-1 w-full h-12 absolute bottom-0">{bars}</div>;
    }, [isPlaying, STREAM_BASE_URL, currentTime]);

    return (
        <div className="w-[300px] flex flex-col gap-4 p-4 bg-neutral-800 rounded-xl">
            <div className="w-full h-[150px] bg-neutral-700 rounded-xl relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                    <div 
                        className={clsx(
                            {
                                "bg-neutral-500 cursor-default": !STREAM_BASE_URL,
                                "bg-danger-500 hover:bg-danger-300 cursor-pointer": STREAM_BASE_URL
                            },
                            "w-16 h-16 flex items-center justify-center shadow-xl",
                            "rounded-full select-none transition-colors"
                        )}
                        onClick={() => STREAM_BASE_URL && togglePlay()}
                    >
                        <Icon 
                            filled
                            style={{ fontSize: 50 }}
                            name={isPlaying ? "pause" : "play_arrow"} 
                        />
                    </div>
                </div>
                {BeatBars}
            </div>
            <audio ref={audioRef} src={STREAM_BASE_URL} preload="metadata" />
            <div className="flex flex-col gap-2">
                <div className="flex justify-between text-xs text-neutral-400">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                </div>
                
                <div className="flex items-center gap-3">
                    <div 
                        ref={sliderRef}
                        className={clsx(STREAM_BASE_URL ? "cursor-pointer" : "cursor-default", "flex-1 relative select-none py-2")}
                        onClick={(e) => {
                            if (!STREAM_BASE_URL) return;
                            if (audioRef.current && duration && !isDragging) {
                                const rect = e.currentTarget.getBoundingClientRect();
                                const clickX = e.clientX - rect.left;
                                const newTime = (clickX / rect.width) * duration;
                                audioRef.current.currentTime = newTime;
                            }
                        }}
                        onMouseDown={(e) => {
                            if (!STREAM_BASE_URL) return;
                            setIsDragging(true);
                            const handleMouseMove = (e: MouseEvent) => {
                                if (audioRef.current && duration && sliderRef.current) {
                                    const rect = sliderRef.current.getBoundingClientRect();
                                    const clickX = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
                                    const newTime = (clickX / rect.width) * duration;
                                    audioRef.current.currentTime = newTime;
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
                                    width: `${duration ? (buffered / duration) * 100 : 0}%`,
                                    transition: 'width 200ms'
                                }}
                            />
                            {/* Progress bar */}
                            <div 
                                className={clsx({ "bg-neutral-500": !STREAM_BASE_URL, "bg-danger-500": STREAM_BASE_URL }, "h-1 rounded-full relative")}
                                style={{ 
                                    width: `${duration ? (currentTime / duration) * 100 : 0}%`,
                                    transition: isDragging ? 'none' : 'all 100ms'
                                }}
                            >
                                <div 
                                    className={clsx({ "bg-neutral-500 cursor-default": !STREAM_BASE_URL, "bg-danger-500 cursor-pointer": STREAM_BASE_URL }, "absolute -right-1.5 -top-1 w-3 h-3 rounded-full shadow-lg")}
                                />
                            </div>
                        </div>
                    </div>
                    <Icon filled name="volume_up" className="text-neutral-400" style={{ fontSize: 20 }} />
                    <div 
                        ref={volumeSliderRef}
                        className={clsx(STREAM_BASE_URL ? "cursor-pointer": "cursor-default", "w-16 relative select-none py-2")}
                        onClick={(e) => {
                            if (!STREAM_BASE_URL) return;
                            if (!isVolumeDragging && volumeSliderRef.current) {
                                const rect = e.currentTarget.getBoundingClientRect();
                                const clickX = e.clientX - rect.left;
                                const newVolume = Math.max(0, Math.min(clickX / rect.width, 1));
                                setVolume(newVolume);
                            }
                        }}
                        onMouseDown={(e) => {
                            if (!STREAM_BASE_URL) return;
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
                                className={clsx({ "bg-neutral-500": !STREAM_BASE_URL, "bg-danger-500": STREAM_BASE_URL }, "h-1 rounded-full relative")}
                                style={{ 
                                    width: `${volume * 100}%`,
                                    transition: isVolumeDragging ? 'none' : 'all 100ms'
                                }}
                            >
                                <div className={clsx({ "bg-neutral-500": !STREAM_BASE_URL, "bg-danger-500": STREAM_BASE_URL }, "absolute -right-1.5 -top-1 w-3 h-3 rounded-full shadow-lg")} />
                            </div>
                        </div>
                    </div>
                </div>
                
                <span className="font-semibold text-lg text-wrap line-clamp-2">{music.description}</span>
                <div className="flex flex-row gap-3 items-center">
                    <Avatar 
                        isBordered
                        color="danger"
                        className="w-6 h-6"
                        name={"Artista"}
                        src=""
                    />
                    <div className="flex flex-col">
                        <span className="font-normal text-sm text-wrap line-clamp-2">{"Artista"}</span>
                        <span className="font-light text-xs text-wrap line-clamp-2">{0} seguidores</span>
                    </div>
                </div>
            </div>
        </div>
    );
}