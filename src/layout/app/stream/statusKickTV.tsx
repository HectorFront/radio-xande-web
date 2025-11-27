import IconKickTV from "@/assets/icon_kicktv.png";
import { Icon, Render } from "@/components";
import { Button } from "@heroui/react";
import clsx from "clsx";

export const StreamStatusKickTV = ({ title = '', online = false }: { title: string, online: boolean }) => {
    return (
        <div className="flex bg-neutral-900 flex-col gap-4 py-7 px-8 left-5 bottom-7 rounded-xl w-[450px] max-w-full">
            <div className="flex flex-row items-center gap-4">
                <div className={clsx(online ? "bg-green-700 text-white" : "bg-white text-neutral-950", "px-4 rounded font-bold text-xs py-0.5 uppercase flex flex-row items-center gap-1")}>
                    <Render test={online}>
                        <Icon name="podcasts" style={{ fontSize: 22 }} className="animate-pulse"/>
                    </Render>
                    {online ? "LIVE": "Offline"}
                </div>
                <span className="font-bold flex flex-row items-center gap-2 text-sm sm:text-lg">
                    Xandinho está {online ? "online": "offline"}
                    <img src={IconKickTV} width={40} alt="Kick"/>
                </span>
            </div>
            <Render test={title}>
                <span className="line-clamp-2 font-bold">{title}</span>
            </Render>
            <Render test={online}>
                <Button onPress={() => window.open("https://kick.com/superxandao")} color="default" href="#" variant="shadow" className="uppercase font-bold">
                    <span className="text-white">Assistir na Kick</span>
                </Button>
                <Button onPress={() => window.open("https://pixgg.com/superxandao")} color="primary" href="#" variant="shadow" className="uppercase font-bold">
                    <span className="text-white">Participe da Live</span>
                </Button>
            </Render>
        </div>
    );
}