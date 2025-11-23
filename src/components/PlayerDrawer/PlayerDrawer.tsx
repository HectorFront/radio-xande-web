import { Button } from "@heroui/react";
import { Icon } from "../Icon";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { ObservableGlobal } from "@/utils";

interface PlayerDrawerProps {
  isOpen: boolean;
  currentMusic: {
    id: string;
    duration_ms: string;
    description: string;
    filename_image: string;
    filename_music: string;
  };
  onOpenChange: () => void;
}

const PlayerDrawer = ({ currentMusic, isOpen, onOpenChange }: PlayerDrawerProps) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const apiDuration = parseInt(currentMusic?.duration_ms || "0") / 1000;
  const displayDuration = duration || apiDuration;
  const [isDragging, setIsDragging] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isVolumeDragging, setIsVolumeDragging] = useState(false);
  const [buffered, setBuffered] = useState(0);
  const [seekingTime, setSeekingTime] = useState<number | null>(null);

  const audioRef = useRef<HTMLAudioElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const volumeSliderRef = useRef<HTMLDivElement>(null);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    ObservableGlobal.subscribe('audioglobal-ref', ref => audioRef.current = ref);
    ObservableGlobal.subscribe("audioglobal-duration", setDuration);
    ObservableGlobal.subscribe("audioglobal-currentTime", setCurrentTime);
    ObservableGlobal.subscribe("audioglobal-buffered", setBuffered);
    ObservableGlobal.subscribe("audioglobal-volume", setVolume);
    ObservableGlobal.subscribe("audioglobal-seekingTime", setSeekingTime);
    ObservableGlobal.subscribe("audioglobal-isDragging", setIsDragging);
    ObservableGlobal.subscribe("audioglobal-isVolumeDragging", setIsVolumeDragging);
    return () => {
      ObservableGlobal.unsubscribe("audioglobal-duration", setDuration);
      ObservableGlobal.unsubscribe("audioglobal-currentTime", setCurrentTime);
      ObservableGlobal.unsubscribe("audioglobal-buffered", setBuffered);
      ObservableGlobal.unsubscribe("audioglobal-volume", setVolume);
      ObservableGlobal.unsubscribe("audioglobal-seekingTime", setSeekingTime);
      ObservableGlobal.unsubscribe("audioglobal-isDragging", setIsDragging);
      ObservableGlobal.unsubscribe("audioglobal-isVolumeDragging", setIsVolumeDragging);
    };
  }, []);

  if (!isOpen) return null;
  const IMAGE_URL = `${import.meta.env.VITE_S3_REPOSITORY_PUBLIC}/${currentMusic?.filename_image}`;
  return (
    <div
      className="fixed bottom-0 left-0 right-0 bg-neutral-950/95 rounded-t-xl px-6 py-3 h-24 z-50"
    >
      <div className="flex flex-row flex-1 items-start gap-4">
        <div 
          className="w-18 h-18 bg-neutral-700 rounded-lg bg-cover flex items-center justify-center" 
          style={{ backgroundImage: `url(${IMAGE_URL})`, backgroundPosition: "50%" }}
        >
          {!currentMusic?.filename_image && <Icon name="album" className="text-neutral-600 absolute" style={{ fontSize: 50 }} filled/>}
        </div>
        <div className="flex-1">
          <div className="flex flex-row items-start justify-between">
            <div className="text-start">
              <h2 className="text-sm font-bold text-white">{currentMusic?.description}</h2>
              <span className="text-gray-400 text-sm">Artista</span>
            </div>
            <Button variant="light" isIconOnly color="default" size="sm" radius="full" onPress={() => onOpenChange()}>
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
              className={clsx(currentMusic ? "cursor-pointer" : "cursor-default", "flex-1 relative select-none py-2")}
              onClick={(e) => {
                if (!currentMusic) return;
                if (audioRef.current && !isDragging) {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickX = e.clientX - rect.left;
                  const percentage = clickX / rect.width;

                  const targetTime = percentage * displayDuration;
                  setSeekingTime(targetTime);
                  ObservableGlobal.notify(`audiolocal-${currentMusic.id}-seekingTime`, targetTime);
                  audioRef.current.currentTime = targetTime;
                }
              }}
              onMouseDown={(e) => {
                if (!currentMusic) return;
                setIsDragging(true);
                ObservableGlobal.notify(`audiolocal-${currentMusic.id}-isDragging`, true);
                const handleMouseMove = (e: MouseEvent) => {
                  if (audioRef.current && sliderRef.current) {
                    const rect = sliderRef.current.getBoundingClientRect();
                    const clickX = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
                    const percentage = clickX / rect.width;

                    const targetTime = percentage * displayDuration;
                    setSeekingTime(targetTime);
                    ObservableGlobal.notify(`audiolocal-${currentMusic.id}-seekingTime`, targetTime);
                    audioRef.current.currentTime = targetTime;
                  }
                };
                const handleMouseUp = () => {
                  setIsDragging(false);
                  ObservableGlobal.notify(`audiolocal-${currentMusic.id}-isDragging`, false);
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
                    width: `${displayDuration ? (buffered / displayDuration) * 100 : 0}%`,
                    transition: 'width 200ms'
                  }}
                />
                {/* Progress bar */}
                <div
                  className={clsx({ "bg-neutral-500": !currentMusic, "bg-danger-500": currentMusic }, "h-1 rounded-full relative")}
                  style={{
                    width: `${displayDuration ? ((seekingTime ?? currentTime) / displayDuration) * 100 : 0}%`,
                    transition: isDragging ? 'none' : 'all 100ms'
                  }}
                >
                  <div
                    className={clsx({ "bg-neutral-500 cursor-default": !currentMusic, "bg-danger-500 cursor-pointer": currentMusic }, "absolute -right-1.5 -top-1 w-3 h-3 rounded-full shadow-lg")}
                  />
                </div>
              </div>
            </div>
            <Icon filled name={(volume * 100) <= 0 ? "no_sound" : "volume_up"} className="text-neutral-400" style={{ fontSize: 20 }} />
            <div
              ref={volumeSliderRef}
              className={clsx(currentMusic ? "cursor-pointer" : "cursor-default", "w-16 relative select-none py-2")}
              onClick={(e) => {
                if (!currentMusic) return;
                if (!isVolumeDragging && volumeSliderRef.current) {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickX = e.clientX - rect.left;
                  const newVolume = Math.max(0, Math.min(clickX / rect.width, 1));
                  setVolume(newVolume);
                  audioRef.current.volume = newVolume;
                  ObservableGlobal.notify(`audiolocal-${currentMusic.id}-volume`, newVolume);
                }
              }}
              onMouseDown={(e) => {
                if (!currentMusic) return;
                setIsVolumeDragging(true);
                ObservableGlobal.notify(`audiolocal-${currentMusic.id}-isVolumeDragging`, true);
                const handleMouseMove = (e: MouseEvent) => {
                  if (volumeSliderRef.current) {
                    const rect = volumeSliderRef.current.getBoundingClientRect();
                    const clickX = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
                    const newVolume = clickX / rect.width;
                    setVolume(newVolume);
                    audioRef.current.volume = newVolume;
                    ObservableGlobal.notify(`audiolocal-${currentMusic.id}-volume`, newVolume);
                  }
                };
                const handleMouseUp = () => {
                  setIsVolumeDragging(false);
                  ObservableGlobal.notify(`audiolocal-${currentMusic.id}-isVolumeDragging`, false);
                  document.removeEventListener('mousemove', handleMouseMove);
                  document.removeEventListener('mouseup', handleMouseUp);
                };
                document.addEventListener('mousemove', handleMouseMove);
                document.addEventListener('mouseup', handleMouseUp);
              }}
            >
              <div className="w-full bg-neutral-600 rounded-full h-1 relative">
                <div
                  className={clsx({ "bg-neutral-500": !currentMusic, "bg-danger-500": currentMusic }, "h-1 rounded-full relative")}
                  style={{
                    width: `${volume * 100}%`,
                    transition: isVolumeDragging ? 'none' : 'all 100ms'
                  }}
                >
                  <div className={clsx({ "bg-neutral-500": !currentMusic, "bg-danger-500": currentMusic }, "absolute -right-1.5 -top-1 w-3 h-3 rounded-full shadow-lg")} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerDrawer;