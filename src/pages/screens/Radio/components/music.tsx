import { Icon } from "@/components/Icon";
import { Avatar } from "@heroui/react"
import clsx from "clsx";
import { useState, useRef, useMemo, memo, useEffect } from "react";
import { usePlayerDrawerContext } from "@/contexts/PlayerDrawer";

interface MusicProps {
    tab: string;
    music: {
        id: string;
        duration_ms: string;
        description: string;
        filename_image: string;
        filename_music: string;
    }
}

export const Music = memo(({ tab, music }: MusicProps) => {
    const { 
        buffered,
        seekingTimeMusic,
        currentTimeMusic,
        currentVolumeMusic,
        loadingCurrentChunk,
        isPlayingMusic,
        handlePlayMusic,
        currentMusicDrawer,
        handleVolumeMusic,
        handleSeekingTimeMusic
    } = usePlayerDrawerContext();
    
    const apiDuration = parseInt(music.duration_ms) / 1000;
    const displayDuration = apiDuration;
    const [isDragging, setIsDragging] = useState(false);
    const [volume, setVolume] = useState(1);
    const [isVolumeDragging, setIsVolumeDragging] = useState(false);
    const [seekingTime, setSeekingTime] = useState<number | null>(null);
    const [isHovered, setIsHovered] = useState(false);

    const sliderRef = useRef<HTMLDivElement>(null);
    const volumeSliderRef = useRef<HTMLDivElement>(null);

    const isPlaying = isPlayingMusic && currentMusicDrawer?.id === music.id;
    const sameMusic = currentMusicDrawer?.id === music.id;
    const _thisBuffered = sameMusic ? buffered : 0;
    const _thisCurrenTime = sameMusic ? currentTimeMusic : 0;
    const _thisLoadingCurrentChunk = sameMusic ? loadingCurrentChunk : false;

    const IMAGE_URL = `${import.meta.env.VITE_S3_REPOSITORY_PUBLIC}/${music.filename_image}`;
    
    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const handlePlay = () => {
        handlePlayMusic({
            volume,
            seekingTime,
            music
        })
    };

    const handleVolume = (newVolume: number) => {
        setVolume(newVolume);
        if (sameMusic) {
            handleVolumeMusic(newVolume);
        }
    };

    const handleSeekingTime = (newSeekingTime: number) => {
        setSeekingTime(newSeekingTime);
        if (sameMusic) {
            handleSeekingTimeMusic(newSeekingTime);
        }
    };

    useEffect(() => {
        if (sameMusic) {
            setSeekingTime(seekingTimeMusic);
        }
    }, [seekingTimeMusic]);

    useEffect(() => {
        if (sameMusic) {
            setVolume(currentVolumeMusic);
        }
    }, [currentVolumeMusic]);

    const BeatBars = useMemo(() => {
        const bars = Array.from({ length: 20 }, (_, i) => {
            const height = isPlaying ? 
                Math.sin((_thisCurrenTime * 10 + i) * 0.5) * 20 + 30 : 
                Math.random() * 10 + 10;
            return (
                <div
                    key={i}
                    className={clsx({ "bg-neutral-500": _thisLoadingCurrentChunk, "bg-danger-500": !_thisLoadingCurrentChunk }, "flex-1 transition-all duration-75")}
                    style={{ height: `${Math.abs(height)}px` }}
                />
            );
        });
        return <div className="flex items-end gap-1 w-full h-12 absolute bottom-0">{bars}</div>;
    }, [isPlaying, _thisCurrenTime, _thisLoadingCurrentChunk]);

    return (
        <div 
            onMouseEnter={() => setIsHovered(true)} 
            onMouseLeave={() => setIsHovered(false)}
            className={clsx("flex flex-col gap-4 p-4 bg-neutral-800 rounded-xl", { "w-full sm:w-[250px] h-96 sm:h-80": tab === "music", "w-[250px] h-80": tab === "all" })}
        >
            <div
                className={clsx("bg-neutral-700 rounded-xl relative overflow-hidden w-full", { "h-[200px] sm:h-[120px]": tab === "music", "h-[120px]": tab === "all" })}
                style={{ 
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, ${sameMusic ? 0 : 0.5}), rgba(0, 0, 0, ${sameMusic ? 0 : 0.5})), url(${IMAGE_URL})`, 
                    backgroundPosition: "100%",
                    backgroundSize: "cover"
                }}
            >
                <div className="absolute inset-0">
                    <div className="w-full h-full flex items-center justify-center relative">
                        {!music?.filename_image && <Icon name="album" className="text-neutral-600 absolute" style={{ fontSize: 90 }} filled/>}
                        <div
                            className={clsx(
                                {
                                    "bg-neutral-500 cursor-default": _thisLoadingCurrentChunk,
                                    "bg-danger-500 hover:bg-danger-300 cursor-pointer": !_thisLoadingCurrentChunk,
                                    "opacity-0": !isHovered || !_thisLoadingCurrentChunk,
                                    "opacity-100": isHovered || _thisLoadingCurrentChunk
                                },
                                "w-16 h-16 flex items-center justify-center shadow-xl",
                                "rounded-full select-none transition-all duration-300 z-50"
                            )}
                            onClick={handlePlay}
                        >
                            <Icon 
                                filled
                                spin={_thisLoadingCurrentChunk}
                                style={{ fontSize: _thisLoadingCurrentChunk ? 35 : 50 }}
                                name={_thisLoadingCurrentChunk ? "music_note" : isPlaying ? "pause" : "play_arrow"} 
                            />
                        </div>
                    </div>
                </div>
                {isHovered || sameMusic ? BeatBars : null}
            </div>
            <div className="flex flex-col gap-2">
                <div className="flex justify-between text-xs text-neutral-400">
                    <span>{formatTime(_thisCurrenTime)}</span>
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
                                handleSeekingTime(targetTime);
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
                                    handleSeekingTime(targetTime);
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
                                    width: `${displayDuration ? (_thisBuffered / displayDuration) * 100 : 0}%`,
                                    transition: 'width 200ms'
                                }}
                            />
                            {/* Progress bar */}
                            <div 
                                className={clsx("bg-danger-500 h-1 rounded-full relative")}
                                style={{ 
                                    maxWidth: "100%",
                                    width: `${displayDuration ? ((seekingTime ?? _thisCurrenTime) / displayDuration) * 100 : 0}%`,
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
                                handleVolume(newVolume);
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
                                    handleVolume(newVolume);
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
});