import { Icon } from "@/components/Icon";
import { Avatar } from "@heroui/react"
import clsx from "clsx";

export const Artist = () => {
    return (
        <div className="w-[150px] flex flex-col gap-2">
            <div className="w-[150px] h-[150px] bg-neutral-700 rounded-full">
            </div>
            <div className="flex flex-col gap-2 relative">
                <div className="flex flex-col">
                    <span className="font-semibold text-xl text-wrap line-clamp-2">Nome do artista</span>
                    <span className="font-light text-sm text-wrap line-clamp-2">0 seguidores</span>
                </div>
            </div>
        </div>
    );
}