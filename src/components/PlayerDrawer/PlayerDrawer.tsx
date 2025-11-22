import { Button } from "@heroui/react";
import { Icon } from "../Icon";
import clsx from "clsx";

interface PlayerDrawerProps {
  isOpen: boolean;
  onOpenChange: () => void;
}

export default function PlayerDrawer({ isOpen, onOpenChange }: PlayerDrawerProps) {
  if (!isOpen) return null;

  const STREAM_BASE_URL = '';
  return (
    <div
      className="fixed bottom-0 left-0 right-0 bg-neutral-950/95 rounded-t-xl px-6 py-3 h-24 z-50"
    >
      <div className="flex flex-row items-start justify-between">
        <div className="text-start">
          <h2 className="text-sm font-bold text-white">Decadence</h2>
          <span className="text-gray-400 text-sm">Disturbed • Ten Thousand Fists • 2005</span>
        </div>
        <Button variant="light" isIconOnly color="default" size="sm" radius="full" onPress={() => onOpenChange()}>
          <Icon filled name="close" className="text-neutral-400" style={{ fontSize: 20 }} />
        </Button>
      </div>
      <div className="flex items-center gap-3">
        <div
          className={clsx(STREAM_BASE_URL ? "cursor-pointer" : "cursor-default", "flex-1 relative select-none py-2")}
        >
          <div className="w-full bg-neutral-600 rounded-full h-1 relative">
            {/* Buffer preview */}
            <div
              className="bg-neutral-500 h-1 rounded-full absolute"
              style={{
                width: `${0}%`,
                transition: 'width 200ms'
              }}
            />
            {/* Progress bar */}
            <div
              className={clsx({ "bg-neutral-500": !STREAM_BASE_URL, "bg-danger-500": STREAM_BASE_URL }, "h-1 rounded-full relative")}
              style={{
                width: `${0}%`,
                transition: 'none'
              }}
            >
              <div
                className={clsx({ "bg-neutral-500 cursor-default": !STREAM_BASE_URL, "bg-danger-500 cursor-pointer": STREAM_BASE_URL }, "absolute -right-1.5 -top-1 w-3 h-3 rounded-full shadow-lg")}
              />
            </div>
          </div>
        </div>
        <Icon filled name={0 <= 0 ? "no_sound" : "volume_up"} className="text-neutral-400" style={{ fontSize: 25 }} />
        <div
          className={clsx(STREAM_BASE_URL ? "cursor-pointer" : "cursor-default", "w-16 relative select-none py-2")}
        >
          <div className="w-full bg-neutral-600 rounded-full h-1 relative">
            <div
              className={clsx({ "bg-neutral-500": !STREAM_BASE_URL, "bg-danger-500": STREAM_BASE_URL }, "h-1 rounded-full relative")}
              style={{
                width: `${100}%`,
                transition: 'none'
              }}
            >
              <div className={clsx({ "bg-neutral-500": !STREAM_BASE_URL, "bg-danger-500": STREAM_BASE_URL }, "absolute -right-1.5 -top-1 w-3 h-3 rounded-full shadow-lg")} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}